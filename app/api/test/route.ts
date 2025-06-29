import { NextRequest } from "next/server";




export async function GET(req: NextRequest) {
    console.log(req.nextUrl.searchParams.get("testParam"));
    return new Response("Hello from the test route!");
}