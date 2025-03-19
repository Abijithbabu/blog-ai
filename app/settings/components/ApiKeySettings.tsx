import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy, RefreshCw, Key, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import api from "@/axios-instance";
import { ApiUsageModal } from "@/components/api-usage-modal";
import { useAuth } from "@/context/auth-context";

export function ApiKeySettings() {
  const { user } = useAuth();
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(user?.apiKey || null);

  const generateApiKey = async () => {
    setIsGeneratingKey(true);
    try {
      const response = await api.post("/settings/generate-api-key");
      if (!response.data) {
        throw new Error(
          response.data.message ||
            "Failed to generate API key. Please try again."
        );
      }
      console.log(response);
      setApiKey(response.data.apiKey);
      toast({
        title: "API key generated",
        description: "Your new API key has been generated successfully.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to generate API key. Please try again.";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsGeneratingKey(false);
    }
  };

  const copyApiKey = () => {
    if (!apiKey) return;

    navigator.clipboard.writeText(apiKey);

    toast({
      title: "Copied to clipboard",
      description: "API key has been copied to your clipboard",
    });
  };

  const [showApiUsageModal, setShowApiUsageModal] = useState(false);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Generate and manage API keys to access your content programmatically
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {apiKey && (
            <Button
              variant="outline"
              onClick={() => setShowApiUsageModal(true)}
            >
              View API Usage Instructions
            </Button>
          )}
          {apiKey ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={apiKey}
                    readOnly
                    className="pr-10 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={copyApiKey}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateApiKey}
                  disabled={isGeneratingKey}
                >
                  {isGeneratingKey ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  <span className="ml-2">Regenerate</span>
                </Button>
              </div>

              <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Attention needed
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        Keep your API key secure. Do not share it in publicly
                        accessible areas such as GitHub, client-side code, etc.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Key className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-2 text-lg font-medium">No API Keys</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You haven't created any API keys yet.
              </p>
              <Button
                className="mt-4"
                onClick={generateApiKey}
                disabled={isGeneratingKey}
              >
                {isGeneratingKey ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Key className="mr-2 h-4 w-4" />
                    Generate API Key
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
        {apiKey && (
          <CardFooter className="flex flex-col items-start">
            <h3 className="text-lg font-medium mb-2">Example Usage</h3>
            <div className="w-full space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">React/Next.js</h4>
                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm">
                  {`fetch('${process.env.NEXT_PUBLIC_SERVER_URL}/api/blogs', {
  headers: {
    'Authorization': 'Bearer ${apiKey}'
  }
})
  .then(res => res.json())
  .then(data => console.log(data));`}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">
                  JSON Response Example
                </h4>
                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto text-sm">
                  {`{
  "status": "success",
  "data": [
    {
      "id": "123",
      "title": "My Blog Post",
      "slug": "my-blog-post",
      "body": "<p>Lorem ipsum...</p>",
      "image": "https://your-storage-url/image.jpg",
      "status": "published",
      "createdAt": "2025-03-03T00:00:00Z"
    }
  ]
}`}
                </pre>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
      <ApiUsageModal
        isOpen={showApiUsageModal}
        onClose={() => setShowApiUsageModal(false)}
        apiKey={apiKey || ""}
      />
    </>
  );
}
