import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
 
const AuthProtectedRoutes = ["/", "/profile/view"];
const isAuthRoute = (path: string) => {
    return path == "/auth";
}
const isAuthProtected = (path: string) => {
    return AuthProtectedRoutes.some((route) => path===route);
}

export async function middleware(request: NextRequest) {
	const sessionCookie = getSessionCookie(request); 
	if (!sessionCookie && isAuthProtected(request.nextUrl.pathname)) {
		return NextResponse.redirect(new URL("/auth", request.url));
	}
    if (sessionCookie && isAuthRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
    }
	return NextResponse.next();
}
export const config = {
	matcher: ["/", "/profile/view", "/auth"]
};