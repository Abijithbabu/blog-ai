"use client"

import type React from "react"

import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't apply dashboard layout to landing page, login, signup
  if (pathname === "/" || pathname === "/login" || pathname === "/signup" || pathname === "/onboarding") {
    return <>{children}</>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}

