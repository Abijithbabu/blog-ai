"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { user, logout, isAuthenticated } = useAuth()

  // Don't show navbar on landing page, login, signup
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null
  }

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold">BlogAI</span>
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <div className="flex items-center gap-4">
              <span className="text-sm">Hello, {user?.name || "User"}</span>
              <Button variant="outline" size="icon" onClick={logout}>
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

