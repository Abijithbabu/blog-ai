"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, RefreshCw, Key, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { ApiUsageModal } from "@/components/api-usage-modal";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import api from "@/axios-instance";

// Define form schema with zod
const profileFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.confirmPassword !== data.password) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type ProfileFormData = z.infer<typeof profileFormSchema>;

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [showApiUsageModal, setShowApiUsageModal] = useState(false);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // await axios.patch('/api/user', {
      //   name: data.name,
      //   email: data.email,
      //   password: data.password || undefined
      // })

      // For demo purposes, show a success message
      setTimeout(() => {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // await axios.delete('/api/user')

      // For demo purposes, show a success message
      setTimeout(() => {
        toast({
          title: "Account deleted",
          description: "Your account has been deleted successfully.",
        });
        setIsLoading(false);
        setShowDeleteModal(false);
        // Redirect to home page
        window.location.href = "/";
      }, 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      setShowDeleteModal(false);
    }
  };

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
      console.log(response)
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

  return (
    <>
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and API keys.
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form
                    onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Your email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Leave blank to keep current password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            At least 6 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>
                  Permanently delete your account and all of your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Once you delete your account, there is no going back. This
                  action cannot be undone.
                </p>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Generate and manage API keys to access your content
                  programmatically
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
                              Keep your API key secure. Do not share it in
                              publicly accessible areas such as GitHub,
                              client-side code, etc.
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
                      <h4 className="text-sm font-medium mb-1">
                        React/Next.js
                      </h4>
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
          </TabsContent>
        </Tabs>
      </div>

      <ConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone."
        confirmText="Delete Account"
        cancelText="Cancel"
      />

      <ApiUsageModal
        isOpen={showApiUsageModal}
        onClose={() => setShowApiUsageModal(false)}
        apiKey={apiKey || ""}
      />
    </>
  );
}
