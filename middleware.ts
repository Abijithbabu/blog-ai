import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define which paths are protected (require authentication)
  const isProtectedPath =
    path.includes("/dashboard") ||
    path.includes("/onboarding") ||
    path.includes("/write") ||
    path.includes("/generate") ||
    path.includes("/posts") ||
    path.includes("/settings") ||
    path.includes("/scraper")

  // Define paths that should redirect logged-in users
  const isAuthPath = path === "/login" || path === "/signup"

  // Get the token from cookies
  const token = request.cookies.get("auth-token")?.value

  // If trying to access protected route without token, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If trying to access login/signup while logged in, redirect to dashboard
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding/:path*",
    "/write/:path*",
    "/generate/:path*",
    "/posts/:path*",
    "/settings/:path*",
    "/scraper/:path*",
    "/login",
    "/signup",
  ],
}

