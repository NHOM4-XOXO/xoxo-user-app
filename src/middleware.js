import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl;
  const isLoggedIn = request.cookies.get("token"); // hoặc token/session

  // Nếu chưa đăng nhập, chặn truy cập các route cần bảo vệ
  if (
    !isLoggedIn &&
    url.pathname !== "/login" &&
    !url.pathname.startsWith("/api")
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Nếu đã đăng nhập, không cho vào lại trang login
  if (isLoggedIn && url.pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile/:path*", "/groups/:path*", "/friends/:path*", "/"], // các route cần bảo vệ
};
