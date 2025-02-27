// /api/aurinko/callback

import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const {userId} = await auth()
    if (!userId) return NextResponse.json({message: 'Unauthroized'}, {status: 401})

    const params = req.nextUrl.searchParams
    const status = params.get('status')
    if (status !+ 'success') return NextResponse.json({message: "Failed to link account"}, {status: 400})

    // get the code to exchange for the access token    
    const code = params.get('code')
    if(!code) return NextResponse.json( {message: "No code provided"}, {status: 400} )
    
    const token = await exchangeCodeForAccessToken(code)
    if (!token) return NextResponse.json({message: "Failed to get exchange code for access token"}, {status: 400})

    const accountDetails = await getAccountDetails(token.accessToken)

    return NextResponse.json({message: 'Hello World'})
}