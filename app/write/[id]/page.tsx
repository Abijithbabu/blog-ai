"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams, useRouter } from "next/navigation";
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
import api from "@/axios-instance";
import { Textarea } from "@/components/ui/textarea";

// Define form schema with zod
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  metaTitle: z.string().optional(),
  description: z.string().optional(),
  keywords: z.string().optional(),
  content: z.string().min(50, "Content must be at least 50 characters"),
  tags: z.string().optional(),
  featuredImage: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum(["draft", "published"]).default("draft"),
});

type FormData = z.infer<typeof formSchema>;

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      metaTitle: "",
      description: "",
      keywords: "",
      content: "",
      tags: "",
      featuredImage: "",
      slug: "",
      status: "draft",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // Set preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const uploadToCloudinary = async (imagePreview: string) => {
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary configuration is missing. Please check your environment variables.');
      }

      // Create a FormData instance
      const formData = new FormData();
      
      // Convert base64 to blob
      const base64Response = await fetch(imagePreview);
      const blob = await base64Response.blob();
      
      // Add the file to formData
      formData.append('file', blob);
      formData.append('upload_preset', uploadPreset);
      
      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const uploadData = await uploadResponse.json();
      return uploadData.secure_url;

    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload image';
      toast({
        title: "Image Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/posts/${params.id}`);
        const post = response.data.post;
        form.reset({
          title: post.title,
          metaTitle: post.metaTitle,
          description: post.description,
          keywords: post.keywords.join(", "),
          content: post.content,
          tags: post.tags.join(", "),
          featuredImage: post.featuredImage || "",
          slug: post.slug,
          status: post.status,
        });

        // Set image preview if post has an image
        if (post.featuredImage) {
          setImagePreview(post.featuredImage);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        toast({
          title: "Error",
          description: "Failed to fetch post. Please try again.",
          variant: "destructive",
        });
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id, router, toast, form]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      let imageUrl = data.featuredImage;
      
      // Only upload to Cloudinary if there's a new image preview
      if (imagePreview && !imagePreview.startsWith('http')) {
        imageUrl = await uploadToCloudinary(imagePreview);
        console.log("Image URL:", imageUrl);
        if (!imageUrl) {
          // If image upload failed, stop the submission
          setIsLoading(false);
          return;
        }
      }

      await api.put(`/posts/${params.id}`, {
        ...data,
        featuredImage: imageUrl,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Success!",
        description: "Your blog post has been updated.",
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating post:", error);
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`flex-1 transition-all duration-200 ${showChat ? 'w-2/3' : 'w-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex-none border-b p-4">
            <div className="container flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Edit Blog Post</h1>
                <p className="text-muted-foreground mt-1">Update your blog post</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
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
                    name="metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your blog post meta title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter your blog post description"
                            {...field}
                          />
                        </FormControl>
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
                            placeholder="Enter your blog post keywords (comma separated)"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Separate keywords with commas (e.g., technology,
                          programming, web)
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
                    render={({ field: { onChange, value, ...field } }) => (
                      <FormItem>
                        <FormLabel>Featured Image</FormLabel>
                        <FormControl>
                          <div className="space-y-4">
                            <div className="flex flex-col gap-4">
                              {(imagePreview || value) && (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-border">
                                  <img
                                    src={imagePreview || value}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 right-2 flex gap-2">
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        setImagePreview(null);
                                        onChange("");
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center gap-4">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    handleImageChange(e);
                                  }}
                                  className="flex-1"
                                />
                                {value && !imagePreview && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setImagePreview(value)}
                                  >
                                    Restore Original
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Upload a new image or use the existing one. Supported formats: JPG, PNG, GIF
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
                          <Input
                            placeholder="Enter URL slug"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The URL-friendly version of the title (e.g., my-blog-post)
                        </FormDescription>
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
      </div>
    </div>
  );
}
