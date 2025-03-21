import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/auth-context"
import { Toaster } from "@/components/ui/toaster"
import DashboardLayout from "./dashboard-layout"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "BlogAI - Automate Your Blog Creation",
  description: "Create SEO-optimized blog posts manually or with AI in minutes.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <DashboardLayout>{children}</DashboardLayout>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'