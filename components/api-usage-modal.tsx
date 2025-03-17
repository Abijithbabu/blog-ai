import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ApiUsageModalProps {
  isOpen: boolean
  onClose: () => void
  apiKey: string
}

export function ApiUsageModal({ isOpen, onClose, apiKey }: ApiUsageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>API Usage Instructions</DialogTitle>
          <DialogDescription>Learn how to use your API key to access BlogAI programmatically.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Authentication</h3>
            <p className="text-sm text-muted-foreground">
              Include your API key in the Authorization header of your requests:
            </p>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm mt-2">
              {`Authorization: Bearer ${apiKey}`}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Example: Fetch Posts</h3>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm">
              {`fetch('https://api.blogai.com/v1/posts', {
  headers: {
    'Authorization': 'Bearer ${apiKey}'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));`}
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Example: Create Post</h3>
            <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm">
              {`fetch('https://api.blogai.com/v1/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ${apiKey}',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'My New Post',
    content: 'This is the content of my new post.',
    status: 'draft'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));`}
            </pre>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

