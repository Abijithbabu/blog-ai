import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SEOSuggestion {
  type: "success" | "warning" | "error"
  title: string
  description: string
}

interface SEOSuggestionsModalProps {
  isOpen: boolean
  onClose: () => void
  suggestions: SEOSuggestion[]
}

export function SEOSuggestionsModal({ isOpen, onClose, suggestions }: SEOSuggestionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>SEO Suggestions</DialogTitle>
          <DialogDescription>Improve your content with these SEO recommendations.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2">
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs mt-0.5 ${
                  suggestion.type === "success"
                    ? "bg-green-500"
                    : suggestion.type === "warning"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {suggestion.type === "success" ? "✓" : "!"}
              </div>
              <div>
                <p className="font-medium">{suggestion.title}</p>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

