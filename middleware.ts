import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const zasticeneRute = ["/"];

export function middleware(req: NextRequest) {
    
    const token = req.cookies.get("AuthToken")?.value;

    if(zasticeneRute.some((path) => req.nextUrl.pathname.startsWith(path))) {
        
        if(!token) {
            const loginUrl = new URL('/login', req.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!login|_next|favicon.ico).*)"], // sve osim login, _next i favicon
};
