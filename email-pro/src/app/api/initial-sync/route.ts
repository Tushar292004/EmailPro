import { Account } from "@/lib/account";
import { db } from "@/server/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const {accountId, userId} = await req.json()
    console.log("AcId: ",accountId, "\n UsId:", userId );
    
    if(!accountId || !userId) {
        return NextResponse.json({error:"Missing accountId or userId"}, {status: 400})
    }

    const dbAccount = await db.account.findUnique({
        where:{
            id: accountId,
            userId
        }
    })

    console.log("\n dbAcn: ", dbAccount);
    
    if(!dbAccount) return NextResponse.json({error: "Account Not Found"}, {status: 404})
    
    const account = new Account(dbAccount.accessToken)
    
    // perform initial-sync
    const response = await account.performInitialSync()
    if(!response){
        return NextResponse.json({error: "Failed to perform initial sync"}, {status: 500})
    }

    const {emails, deltaToken} = response
    console.log('emails', emails);
    
    // await db.account.update({
    //     where:{
    //         id: accountId
    //     },
    //     data: {
    //         nextDeltaToken: deltaToken
    //     }
    // })

    // await syncEmailsToDatabase(emails)

    console.log('Initial Sync Completed', deltaToken);
    
    return NextResponse.json({success: true}, {status: 200})
}