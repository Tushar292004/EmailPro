import { z } from "zod";

export interface SyncResponse {
    syncUpdatedToken: string;
    pdatedToken: string;
    syncDeletedToken: string;
    ready: boolean;
}

export interface SyncUpdatedResponse {
    nextPageToken?: string;
    nextDeltaToken: string;
    records: EmailMessage[];
}

export const emailAddressSchema = z.object({
    name: z.string(),
    address: z.string()
})


export interface EmailMessage {
    id: string;
    threadId: string;
    createdTime: string;
    lastModifiedTime: string;
    sentAt: string;
    receivedAt: string;
    internetMessageId: string;
    subject: string;
    sysLabels: Array<"junk" | "trash" | "sent" | "inbox" | "unread" | "flagged" | "important" | "draft">;
    keywords: string[];
    sysClassifications: Array<"personal" | "social" | "promotions" | "updates" | "forums">;
    sensitivity: "normal" | "private" | "personal" | "confidential";
    meetingMessageMethod?: "request" | "reply" | "cancel" | "counter" | "other";
    from: EmailAddress;
    to: EmailAddress[];
    cc: EmailAddress[];
    bcc: EmailAddress[];
    replyTo: EmailAddress[];
    hasAttachments: boolean;
    body?: string;
    bodySnippet?: string;
    attachments: EmailAttachment[];
    inReplyTo?: string;
    references?: string;
    threadIndex?: string;
    internetHeaders: EmailHeader[];
    nativeProperties: Record<string, string>;
    folderId?: string;
    omitted: Array<"threadId" | "body" | "attachments" | "recipients" | "internetHeaders">;
}

export interface EmailAddress {
    name?: string;
    address: string;
    raw?: string;
}

export interface EmailAttachment {
    id: string;
    name: string;
    mimeType: string;
    size: number;
    inline: boolean;
    contentId?: string;
    content?: string;
    contentLocation?: string;
}

export interface EmailHeader {
    name: string;
    value: string;
}

// # When adding additional environment variables, the schema in "/src/env.js"
// # should be updated accordingly.

// # Prisma
// # https://www.prisma.io/docs/reference/database-reference/connection-urls#env
// DATABASE_URL='postgresql://neondb_owner:npg_BX3RdM8HzYwW@ep-black-moon-a8u565y4-pooler.eastus2.azure.neon.tech/EmailPro?sslmode=require'
// NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_ZGVzaXJlZC1oYWdmaXNoLTYuY2xlcmsuYWNjb3VudHMuZGV2JA
// CLERK_SECRET_KEY=sk_test_Wk7rWFtXkKtOKBLxYExF0c8XwaPKPZDA2fLRdoX4MX

// NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
// NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

// AURINKO_CLIENT_ID = '8fc44144ce8c2dff074b7ce19f563ec7'
// AURINKO_CLIENT_SECRET = 'bdUHu3bEnIMIWf0B2Id4ULKW7cqjeBCziq222wof7g0K_ZgTKCI3zDbt1NVi0i_MS5_othStAR2Yplu4uBdOgQ'
// AURINKO_SIGNING_SECRET = '5b8241fa52f7dc53befda277493b6043c3ba229f46382e07940c72a3f9f1cb9b'
// API_BASE_URL='https://api.aurinko.io/v1'

// NEXT_PUBLIC_URL='http://localhost:3000'

// OPENAI_API_KEY='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'