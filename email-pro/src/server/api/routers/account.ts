import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";
import { Account } from "@/lib/account";
import { EmailAddress } from "@clerk/nextjs/server";
import { Filter } from "lucide-react";
import { Prisma } from ".prisma/client/default.js";
import { db } from "@/server/db";
import { threadId } from "worker_threads";
import { emailAddressSchema } from "@/types";

export const authoriseAccountAccesss = async (AccountId: string, userId: string) => {
    const account = await db.account.findFirst({
        where: {
            id: AccountId,
            userId
        }, select: {
            id: true, emailAddress: true, name: true
        }
    })
    if (!account) throw new Error("Account not found")
    return account

}
export const accountRouter = createTRPCRouter({
    getAccounts: privateProcedure.query(async ({ ctx }) => {
        return await ctx.db.account.findMany({
            where: {
                userId: ctx.auth.userId
            },
            select: {
                id: true, emailAddress: true, name: true
            }
        })
    }),
    getNumThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string()
    })).query(async ({ ctx, input }) => {
        const account = await authoriseAccountAccesss(input.accountId, ctx.auth.userId)

        let filter: Prisma.ThreadWhereInput = {};

        if (input.tab === 'inbox') {
            filter.inboxStatus = true;
        } else if (input.tab === 'drafts') {
            filter.draftStatus = true;
        } else if (input.tab === 'sent') {
            filter.sentStatus = true;
        }

        return await ctx.db.thread.count({
            where: {
                accountId: account.id,
                ...filter
            }
        })
    }),
    getThreads: privateProcedure.input(z.object({
        accountId: z.string(),
        tab: z.string(),
        done: z.boolean()

    })).query(async ({ ctx, input }) => {
        const account = await authoriseAccountAccesss(input.accountId, ctx.auth.userId)

        let filter: Prisma.ThreadWhereInput = {};

        if (input.tab === 'inbox') {
            filter.inboxStatus = true;
        } else if (input.tab === 'drafts') {
            filter.draftStatus = true;
        } else if (input.tab === 'sent') {
            filter.sentStatus = true;
        }

        filter.done = {
            equals: input.done
        }

        return await ctx.db.thread.findMany({
            where: filter,
            include: {
                emails: {
                    orderBy: {
                        sentAt: 'asc'
                    },
                    select: {
                        from: true,
                        body: true,
                        bodySnippet: true,
                        subject: true,
                        sysLabels: true,
                        id: true,
                        sentAt: true,
                    },
                },
            },
            take: 15,
            orderBy: {
                lastMessageDate: 'desc'
            }
        })

    }),

    getSuggestions: privateProcedure.input(z.object({
        accountId: z.string(),
    })).query(async ({ ctx, input }) => {
        const account = await authoriseAccountAccesss(input.accountId, ctx.auth.userId)
        return await ctx.db.emailAddress.findMany({
            where: {
                accountId: account.id
            },
            select: {
                address: true,
                name: true
            }
        })
    }),

    getReplyDetails: privateProcedure.input(z.object({
        accountId: z.string(),
        threadId: z.string(),
    })).query(async ({ ctx, input }) => {
        const account = await authoriseAccountAccesss(input.accountId, ctx.auth.userId)
        const thread = await ctx.db.thread.findUnique({
            where: {
                id: input.threadId,
            },
            include: {
                emails: {
                    orderBy: { sentAt: "asc" },
                    select: {
                        from: true,
                        to: true,
                        cc: true,
                        bcc: true,
                        sentAt: true, subject: true,
                        internetMessageId: true
                    }
                }
            }
        })
        if (!thread || thread.emails.length === 0) {
            throw new Error("Thread not found or empty");
        }

        const lastExternalEmail = thread.emails
            .reverse()
            .find(email => email.from.id !== account.id);

        if (!lastExternalEmail) {
            throw new Error("No external email found in thread");
        }

        return {
            subject: lastExternalEmail.subject,
            to: [lastExternalEmail?.from, ...lastExternalEmail.to.filter(to => to.address !== account.emailAddress)],
            cc: lastExternalEmail.cc.filter(cc => cc.address !== account.emailAddress),
            from: { name: account.name, address: account.emailAddress },
            id: lastExternalEmail.internetMessageId
        }
    }),
    sendEmail: privateProcedure.input(z.object({
        accountId: z.string(),
        body: z.string(),
        subject: z.string(),
        from: emailAddressSchema,
        to: z.array(emailAddressSchema),
        cc: z.array(emailAddressSchema).optional(),
        bcc: z.array(emailAddressSchema).optional(),
        replyTo: emailAddressSchema,
        inReplyTo: z.string().optional(),
        threadId: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
        const acc = await authoriseAccountAccesss(input.accountId, ctx.auth.userId)
        const account = new Account(acc.accessToken)
        console.log('sendmail', input)
        await account.sendEmail({
            body: input.body,
            subject: input.subject,
            threadId: input.threadId,
            to: input.to,
            bcc: input.bcc,
            cc: input.cc,
            replyTo: input.replyTo,
            from: input.from,
            inReplyTo: input.inReplyTo,
        })
    })

})