"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PenTool,
  Sparkles,
  Settings,
  FileText,
  TrendingUp,
  User,
  LogOut,
  Workflow,
  Globe,
  Bell,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

interface SidebarProps {
  className?: string;
}

interface Route {
  label: string;
  icon: any;
  href: string;
  onClick?: () => void;
}

interface Section {
  title: string;
  routes: Route[];
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  // Don't show sidebar on landing page, login, signup
  if (
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/onboarding"
  ) {
    return null;
  }

  const sections: Section[] = [
    {
      title: "Main",
      routes: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
        },
        {
          label: "Blog Editor",
          icon: PenTool,
          href: "/write",
        },
        {
          label: "AI Generator",
          icon: Sparkles,
          href: "/generate",
        },
        {
          label: "Trending Topics",
          icon: TrendingUp,
          href: "/trending",
        },
        {
          label: "My Blogs",
          icon: FileText,
          href: "/posts",
        },
      ],
    },
    {
      title: "Tools",
      routes: [
        {
          label: "Workflows",
          icon: Workflow,
          href: "#/workflows",
        },
        {
          label: "Scraper Tool",
          icon: Globe,
          href: "/scraper",
        },
      ],
    },
    {
      title: "Account",
      routes: [
        {
          label: "Notifications",
          icon: Bell,
          href: "#/notifications",
        },
        {
          label: "Settings",
          icon: Settings,
          href: "/settings",
        },
        {
          label: "Help",
          icon: HelpCircle,
          href: "/help",
        },
      ],
    },
  ];

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col border-r bg-background",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="text-xl font-bold">BlogAI</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="px-3 mb-1 text-xs text-muted-foreground">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.routes.map((route) => (
                  <Link
                    key={route.label}
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground hover:bg-accent",
                      pathname === route.href
                        ? "bg-accent text-accent-foreground font-medium"
                        : ""
                    )}
                  >
                    <route.icon className="h-4 w-4" />
                    {route.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{user?.name || "User"}</p>
            <p className="text-xs text-muted-foreground">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </div>
  );
}
