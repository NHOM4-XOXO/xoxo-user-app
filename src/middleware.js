import { NextResponse } from "next/server";

const isProduction = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

export function middleware(request) {
  console.log("Cookies in middleware:", request.cookies.getAll());

  const url = request.nextUrl;
  const hasSession = request.cookies.get("token");

  // Chỉ redirect khi production, local thì bỏ qua
  if (!hasSession && url.pathname !== "/login" && !url.pathname.startsWith("/api")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}



export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/groups/:path*",
    "/friends/:path*",
    "/messages/:path*",
    "/saved/:path*",
    "/videos/:path*",
    "/musics/:path*",
    "/events/:path*",
  ], // các route cần bảo vệ
};
