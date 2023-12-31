// middleware.ts
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = await getToken({ req });

  if (pathname == "/auth/login") {
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL(`/auth/login`, req.url);
    return NextResponse.redirect(url);
  }
  if (pathname.includes("/admin") && !token.admin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image).*)"],
};
