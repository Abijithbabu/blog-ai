"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
import { Editor } from "@tinymce/tinymce-react";
import { ChatPanel } from "@/components/ChatPanel";
import api from "@/axios-instance";

interface ContentSuggestion {
  title: string;
  meta: string;
  keywords: string[];
  outline: string;
}

// Define form schema with zod
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  tags: z.string().optional(),
  featuredImage: z.string().url("Please enter a valid image URL").optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

type FormData = z.infer<typeof formSchema>;

export default function WritePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: "",
      featuredImage: "",
      status: "draft",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      await api.post("/posts", data);
      toast({
        title: "Success!",
        description: "Your blog post has been created.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion: ContentSuggestion) => {
    form.setValue("title", suggestion.title);
    form.setValue("content", suggestion.outline);
    form.setValue("tags", suggestion.keywords.join(", "));
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1">
        <div className="container py-6 px-4">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Write a Blog Post</h1>
              <p className="text-muted-foreground mt-1">
                Create and publish your blog post
              </p>
            </div>
            <Button variant="outline" onClick={() => setShowChat(!showChat)}>
              {showChat ? "Hide Research" : "Research Content"}
            </Button>
          </div>

          <div className="max-w-4xl">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your blog post title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Editor
                          apiKey="x02r3sx3hyrz2eadicgxwwjmmdij2ozk3b7aktdpkyw4vxyu"
                          value={field.value}
                          onEditorChange={(content) => {
                            field.onChange(content);
                          }}
                          init={{
                            height: 500,
                            menubar: true,
                            plugins: [
                              "advlist",
                              "autolink",
                              "lists",
                              "link",
                              "image",
                              "charmap",
                              "preview",
                              "anchor",
                              "searchreplace",
                              "visualblocks",
                              "code",
                              "fullscreen",
                              "insertdatetime",
                              "media",
                              "table",
                              "code",
                              "help",
                              "wordcount",
                            ],
                            toolbar:
                              "undo redo | formatselect | " +
                              "bold italic backcolor | alignleft aligncenter " +
                              "alignright alignjustify | bullist numlist outdent indent | " +
                              "removeformat | help",
                            content_style:
                              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter tags (comma separated)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Separate tags with commas (e.g., technology,
                        programming, web)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="featuredImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter the URL of your featured image"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    onClick={() => form.setValue("status", "draft")}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button
                    type="submit"
                    onClick={() => form.setValue("status", "published")}
                    disabled={isLoading}
                    variant="default"
                  >
                    {isLoading ? "Publishing..." : "Publish"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {showChat && <ChatPanel onSuggestionSelect={handleSuggestionSelect} />}
    </div>
  );
}
