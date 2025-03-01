// /api/aurinko/callback
import { getAurinkoToken, getAccountDetails } from "@/lib/aurinko";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import axios from "axios";
import { error } from "console";

export const GET = async (req: NextRequest) => {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({message: 'Unauthorized'}, {status: 401})
    
    const params = req.nextUrl.searchParams
    
    // Check the status first
    const status = params.get('status')
    if (status && status !== 'success') {
        console.error("Auth failed with status:", status);
        return NextResponse.json({message: "Failed to link account"}, {status: 400})
    }
    
    // Get the Aurinko code (not the Google code)
    const code = params.get('code')
    console.log("Received Aurinko code:", code);
    
    if (!code) {
        return NextResponse.json({message: "No code provided"}, {status: 400})
    }
    
    try {
        // Exchange the Aurinko code for a token
        const token = await getAurinkoToken(code)
        console.log("\n Token: ",token);
        
        if (!token) {
            return NextResponse.json({message: "Failed to exchange code for access token"}, {status: 400})
        }
        
        // Get account details using the token
        const accountDetails = await getAccountDetails(token.accessToken)
        if (!accountDetails) {
            return NextResponse.json({ message: "Failed to fetch account details" }, { status: 400 });
        }
        
        // Store the account in your database
        await db.account.upsert({
            where: {
                id: token.accountId.toString()
            },
            update: {
                accessToken: token.accessToken
            },
            create: {
                id: token.accountId.toString(),
                userId,
                emailAddress: accountDetails.email,
                name: accountDetails.name,
                accessToken: token.accessToken,
            }
        })
        
        //trigger initial sync endpoint
        waitUntil(
            axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, {
                accountId: token.accountId.toString(), userId
            }).then(response => {
                console.log('Initial Sync Triggered', response.data);
            }).catch(error => {
                console.error('Failed to trigger initial sync', error);
            })
        )
        // waitUntil(

        //     axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, { accountId: token.accountId.toString(), userId }).then((res) => {
        //         console.log(res.data)
        //     }).catch((err) => {
        //         console.log(err.response.data)
        //     })
        // )

        // Redirect to your mail page
        return NextResponse.redirect(new URL('/mail', req.url))
    } catch (error) {
        console.error("Error in Aurinko callback:", error);
        return NextResponse.json({
            message: "Error processing authentication", 
            error: error instanceof Error ? error.message : String(error)
        }, {status: 500})
    }
}