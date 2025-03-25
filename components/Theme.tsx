"use client"
import { Check } from "lucide-react"
import { useTheme } from "next-themes"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function Theme() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Theme</h3>
          <p className="text-sm text-muted-foreground">Select your preferred theme for the dashboard</p>
        </div>

        <RadioGroup defaultValue={theme} onValueChange={setTheme} className="grid grid-cols-3 gap-4">
          <div>
            <RadioGroupItem value="light" id="theme-light" className="sr-only" />
            <Label
              htmlFor="theme-light"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-3 rounded-md border border-border p-2">
                <div className="space-y-2">
                  <div className="h-2 w-10 rounded-lg bg-primary"></div>
                  <div className="h-2 w-8 rounded-lg bg-muted-foreground"></div>
                  <div className="h-2 w-12 rounded-lg bg-muted-foreground"></div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <span>Light</span>
                {theme === "light" && <Check className="h-4 w-4" />}
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
            <Label
              htmlFor="theme-dark"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-3 rounded-md border border-border bg-slate-950 p-2">
                <div className="space-y-2">
                  <div className="h-2 w-10 rounded-lg bg-primary"></div>
                  <div className="h-2 w-8 rounded-lg bg-slate-400"></div>
                  <div className="h-2 w-12 rounded-lg bg-slate-400"></div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <span>Dark</span>
                {theme === "dark" && <Check className="h-4 w-4" />}
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="system" id="theme-system" className="sr-only" />
            <Label
              htmlFor="theme-system"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
            >
              <div className="mb-3 rounded-md border border-border p-2">
                <div className="flex space-x-1">
                  <div className="w-1/2 space-y-2">
                    <div className="h-2 w-full rounded-lg bg-primary"></div>
                    <div className="h-2 w-4/5 rounded-lg bg-muted-foreground"></div>
                  </div>
                  <div className="w-1/2 space-y-2 bg-slate-950 p-1">
                    <div className="h-2 w-full rounded-lg bg-primary"></div>
                    <div className="h-2 w-4/5 rounded-lg bg-slate-400"></div>
                  </div>
                </div>
              </div>
              <div className="flex w-full items-center justify-between">
                <span>System</span>
                {theme === "system" && <Check className="h-4 w-4" />}
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
