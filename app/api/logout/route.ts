import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants";

export async function GET(request: NextRequest) {
    try {
        const response = NextResponse.json({
            message: 'logout successful'
        }, { status: 200 });

        response.cookies.set(COOKIE_NAME, '', {
            httpOnly: true,
            path: '/',
            expires: new Date(0)
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.response.status })
    }
}