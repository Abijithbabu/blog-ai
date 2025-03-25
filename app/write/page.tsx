"use client";

import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/lib/utils";

// Add this interface definition before the formSchema
interface GeneratedContent {
  title: string;
  meta?: string;
  keywords?: string[];
  body: string;
  slug?: string;
}

interface ContentSuggestion {
  title: string;
  meta: string;
  keywords: string[];
  outline: string;
}

// Define form schema with zod
const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  slug: z
    .string()
    .min(5, "Slug must be at least 5 characters")
    .max(100, "Slug must be less than 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: "Slug must contain only lowercase letters, numbers, and hyphens",
    }),
  metaTitle: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  content: z.string().min(100, "Content must be at least 100 characters"),
  tags: z.string().optional(),
  featuredImage: z.string().optional(),
  status: z.enum(["draft", "published"]),
});

type FormData = z.infer<typeof formSchema>;

export default function WritePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      metaTitle: "",
      description: "",
      keywords: "",
      content: "",
      tags: "",
      featuredImage: "",
      status: "draft",
    },
  });

  // Watch the title field to auto-generate slug
  const title = form.watch("title");

  useEffect(() => {
    // Only auto-generate slug if the slug field hasn't been manually edited
    if (!form.getValues("slug")) {
      const generatedSlug = slugify(title);
      form.setValue("slug", generatedSlug, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [title, form]);

  const onSubmit = async (data: FormData, status: "draft" | "published") => {
    setIsLoading(true);
    try {
      let imageUrl = null;

      if (imagePreview) {
        imageUrl = await uploadToCloudinary(imagePreview);
        if (!imageUrl) {
          setIsLoading(false);
          return;
        }
      }

      await api.post("/posts", {
        ...data,
        status,
        featuredImage: imageUrl,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Success!",
        description:
          status === "published"
            ? "Your blog post has been published."
            : "Your blog post has been saved as draft.",
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
    form.setValue("metaTitle", suggestion.title);
    form.setValue("description", suggestion.meta);
    form.setValue("keywords", suggestion.keywords.join(", "));
    form.setValue("content", suggestion.outline);
    form.setValue("tags", suggestion.keywords.join(", "));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Set preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const uploadToCloudinary = async (imagePreview: string) => {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error(
          "Cloudinary configuration is missing. Please check your environment variables."
        );
      }

      // Create a FormData instance
      const formData = new FormData();

      // Convert base64 to blob
      const base64Response = await fetch(imagePreview);
      const blob = await base64Response.blob();

      // Add the file to formData
      formData.append("file", blob);
      formData.append("upload_preset", uploadPreset);

      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(
          `Cloudinary upload failed: ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const uploadData = await uploadResponse.json();
      return uploadData.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to upload image";
      toast({
        title: "Image Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className={`flex-1 ${showChat ? "w-2/3" : "w-full"}`}>
        <div className="container py-6 px-4">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl">Write a Blog Post</h1>
              <p className="text-muted-foreground mt-1">
                Create and publish your blog post
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setShowChat(!showChat)}>
                {showChat ? "Hide Research" : "Research Content"}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="max-w-4xl pb-8">
            <Form {...form}>
              <form className="space-y-8">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter title" {...field} />
                      </FormControl>
                      <FormDescription>
                        The title of your blog post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input
                            placeholder="url-friendly-slug"
                            {...field}
                            onChange={(e) => {
                              // Convert to lowercase and replace spaces with hyphens
                              const value = e.target.value
                                .toLowerCase()
                                .replace(/\s+/g, "-");
                              field.onChange(value);
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const generatedSlug = slugify(
                                form.getValues("title")
                              );
                              form.setValue("slug", generatedSlug, {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                          >
                            Generate from Title
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        The URL-friendly version of the title (e.g.,
                        my-blog-post)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter meta title for SEO"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will be used as the title in search engine results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter meta description for SEO"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This will appear in search engine results
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keywords</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter keywords (comma separated)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Keywords help with SEO. Separate with commas
                      </FormDescription>
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
                  render={({ field: { onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Featured Image</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleImageChange(e);
                              onChange(e);
                            }}
                            {...field}
                          />
                          {imagePreview && (
                            <div className="relative w-full h-48 rounded-md overflow-hidden">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                  setImagePreview(null);
                                  onChange("");
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Upload an image for your blog post
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => {
                      form.setValue("status", "draft");
                      form.handleSubmit((data) => onSubmit(data, "draft"))();
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : "Save as Draft"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      form.setValue("status", "published");
                      form.handleSubmit((data) =>
                        onSubmit(data, "published")
                      )();
                    }}
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

      {showChat && (
        <div className="w-1/3 border-l">
          <ChatPanel onSuggestionSelect={handleSuggestionSelect} />
        </div>
      )}
    </div>
  );
}
