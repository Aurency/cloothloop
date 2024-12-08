import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  const token = request.cookies.get("token"); // Sesuaikan dengan metode autentikasi Anda
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin-admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"], // Proteksi semua rute di bawah "/admin"
};
