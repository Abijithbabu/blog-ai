import type React from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AuthProvider } from "@/context/auth-context";
import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "./dashboard-layout";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "BlogAI - Automate Your Blog Creation",
  description:
    "Create SEO-optimized blog posts manually or with AI in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className}>
        <ThemeProvider>
          <AuthProvider>
            <DashboardLayout>{children}</DashboardLayout>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
