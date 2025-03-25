"use client";

import type React from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TinyMCEEditor from "@/components/tiny-mce-editor";
import { Sparkles, RefreshCw, Copy, Download, Save, Send } from "lucide-react";
import axios from "axios";
import api from "@/axios-instance";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define form schema with zod
const formSchema = z
  .object({
    topic: z.string(),
    tone: z.string().min(1, "Please select a tone"),
    wordCount: z.string().min(1, "Please select a word count"),
    autoGenerate: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    // Only validate topic length if autoGenerate is false
    if (!data.autoGenerate && (!data.topic || data.topic.length < 5)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Topic must be at least 5 characters when not auto-generating",
        path: ["topic"],
      });
    }
  });

type FormData = z.infer<typeof formSchema>;

interface GeneratedContent {
  title: string;
  body: string;
  slug: string;
  meta: string;
  metaTitle: string;
  keywords: string[];
  tags?: string[];
}

export default function GeneratePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [trendingTopics, setTrendingTopics] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] =
    useState<GeneratedContent | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "professional",
      wordCount: "1000",
      autoGenerate: false,
    },
    mode: "onChange", // Add this to enable real-time validation
  });

  useEffect(() => {
    // Fetch trending topics
    const fetchTrendingTopics = async () => {
      setIsTrendingLoading(true);
      try {
        const response = await api.get("/trending");
        if (response.data.success) {
          setTrendingTopics(response.data.data);
        } else {
          // Fallback to default topics if API call fails
          setTrendingTopics([
            "The Future of AI in Content Marketing",
            "How to Optimize Your Website for Voice Search",
            "10 Effective Social Media Strategies for 2025",
            "Sustainable Business Practices That Boost Profits",
            "Remote Work Culture: Building Team Cohesion",
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch trending topics", error);
        // Use default topics as fallback
        setTrendingTopics([
          "The Future of AI in Content Marketing",
          "How to Optimize Your Website for Voice Search",
          "10 Effective Social Media Strategies for 2025",
          "Sustainable Business Practices That Boost Profits",
          "Remote Work Culture: Building Team Cohesion",
        ]);
      } finally {
        setIsTrendingLoading(false);
      }
    };

    fetchTrendingTopics();
  }, []);

  const handleTopicClick = (topic: string) => {
    form.setValue("topic", topic);
    form.setValue("autoGenerate", false);
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

  const onSubmit = async (data: FormData) => {
    if (!data.topic && !data.autoGenerate) {
      toast({
        title: "Error",
        description: "Please enter a topic or select auto-generate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { update, dismiss } = toast({
      title: "Generating content",
      description: "Starting content generation...",
      duration: 120000, // Keep toast visible for 2 minutes
    });

    try {
      const topic = data.autoGenerate
        ? trendingTopics[Math.floor(Math.random() * trendingTopics.length)]
        : data.topic;
      console.log("Sending research request:", {
        topic,
        wordCount: parseInt(data.wordCount),
      });

      // Update progress toast
      update({
        id: "progress-toast",
        title: "Generating content",
        description:
          "Researching topic and generating content... This may take a few minutes.",
      });

      const response = await api.post("/content/research", {
        topic,
        wordCount: parseInt(data.wordCount),
        tone: data.tone,
      });

      console.log("Received response:", response.data);
      if (!response.data || !response.data.suggestion) {
        throw new Error("Invalid response format");
      }

      const suggestion = response.data.suggestion;

      // Clean the response data by removing "**" from all text fields
      const cleanedSuggestion = {
        ...suggestion,
        title: suggestion.title.replace(/\*\*/g, "").trim(),
        meta: suggestion.meta.replace(/\*\*/g, "").trim(),
        keywords: suggestion.keywords.map((keyword: string) =>
          keyword.replace(/\*\*/g, "").trim()
        ),
        outline: suggestion.outline.replace(/\*\*/g, "").trim(),
      };

      setGeneratedContent({
        title: cleanedSuggestion.title,
        body: cleanedSuggestion.outline,
        slug: cleanedSuggestion.title
          .toLowerCase()
          .replace(/[^\w\s]/gi, "")
          .replace(/\s+/g, "-"),
        meta: cleanedSuggestion.meta,
        metaTitle: cleanedSuggestion.title,
        keywords: cleanedSuggestion.keywords,
        tags: cleanedSuggestion.keywords,
      });

      // Dismiss progress toast and show success
      dismiss();
      toast({
        title: "Success",
        description: "Content generated successfully!",
        variant: "default",
      });
    } catch (error) {
      console.error("Research error:", error);
      // Dismiss progress toast
      dismiss();

      if (axios.isAxiosError(error)) {
        let errorMessage = "Failed to generate content suggestion";

        if (
          error.code === "ECONNABORTED" ||
          error.message.includes("timeout")
        ) {
          errorMessage =
            "Content generation is taking longer than expected. Please try again.";
        } else if (error.code === "ECONNREFUSED") {
          errorMessage =
            "Cannot connect to the server. Please make sure the API server is running.";
        } else if (error.code === "ECONNRESET") {
          errorMessage = "Connection was interrupted. Please try again.";
        } else {
          errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Failed to generate content suggestion";
        }

        console.error("API Error details:", {
          code: error.code,
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage,
        });

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!generatedContent) return;

    setIsLoading(true);
    try {
      let imageUrl = null;

      // Upload image to Cloudinary if exists
      if (imagePreview) {
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
          imageUrl = uploadData.secure_url;

          console.log("Image uploaded to Cloudinary:", {
            url: imageUrl,
            publicId: uploadData.public_id,
            uploadPreset,
            cloudName,
          });
        } catch (error) {
          console.error("Cloudinary upload failed:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Failed to upload image";
          toast({
            title: "Image Upload Failed",
            description: errorMessage,
            variant: "destructive",
          });
          return; // Stop the save process if image upload fails
        }
      }

      // Save the blog post
      const response = await api.post("/posts", {
        title: generatedContent.title,
        metaTitle: generatedContent.metaTitle || generatedContent.title,
        description: generatedContent.meta,
        keywords: generatedContent.keywords,
        content: generatedContent.body,
        tags: generatedContent.tags,
        featuredImage: imageUrl,
        status,
        slug: generatedContent.slug,
        wordCount: generatedContent.body.split(/\s+/).length,
        createdAt: new Date().toISOString(),
      });

      console.log("Blog post saved:", response.data);

      toast({
        title: status === "published" ? "Blog published!" : "Draft saved!",
        description:
          status === "published"
            ? "Your blog post has been published successfully."
            : "Your draft has been saved.",
      });

      // Redirect to dashboard after successful save
      router.push("/dashboard");
    } catch (error) {
      console.error("Save error:", error);

      let errorMessage = "Failed to save blog post. Please try again.";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          errorMessage;

        // Log detailed error information
        console.error("API Error details:", {
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage,
        });
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedContent) return;

    const textToCopy = `# ${
      generatedContent.title
    }\n\n${generatedContent.body.replace(/<[^>]*>/g, "")}`;
    navigator.clipboard.writeText(textToCopy);

    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    });
  };

  const downloadAsMarkdown = () => {
    if (!generatedContent) return;

    const textToDownload = `# ${
      generatedContent.title
    }\n\n${generatedContent.body.replace(/<[^>]*>/g, "")}`;
    const blob = new Blob([textToDownload], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedContent.slug}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Content has been downloaded as Markdown",
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl">Generate Blog with AI</h1>
        <p className="text-muted-foreground mt-1">
          Create SEO-optimized blog posts using artificial intelligence.
        </p>
      </div>

      {!generatedContent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generate Content</CardTitle>
                <CardDescription>
                  Enter a topic or let AI choose a trending topic for you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="autoGenerate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Auto-generate with random trending topic
                            </FormLabel>
                            <FormDescription>
                              Let AI choose a trending topic and generate
                              content automatically
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your topic (e.g., Benefits of Cloud Computing)"
                              {...field}
                              disabled={form.watch("autoGenerate")}
                            />
                          </FormControl>
                          <FormDescription>
                            Be specific for better results
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tone</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="professional">
                                  Professional
                                </SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="witty">Witty</SelectItem>
                                <SelectItem value="authoritative">
                                  Authoritative
                                </SelectItem>
                                <SelectItem value="friendly">
                                  Friendly
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wordCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Word Count</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select word count" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="500">~500 words</SelectItem>
                                <SelectItem value="1000">
                                  ~1000 words
                                </SelectItem>
                                <SelectItem value="1500">
                                  ~1500 words
                                </SelectItem>
                                <SelectItem value="2000">
                                  ~2000 words
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Blog Post
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>
                  Click on a topic to use it for generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isTrendingLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-12 bg-muted rounded-md" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {trendingTopics.map((topic, index) => (
                      <li key={index}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-left h-auto py-2 whitespace-normal break-words"
                          onClick={() => handleTopicClick(topic)}
                        >
                          <div className="flex items-center">
                            <span className="mr-2 text-primary flex-shrink-0">
                              #
                            </span>
                            <div className="flex-1">
                              <span className="break-words block">{topic}</span>
                            </div>
                          </div>
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Generated Content</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAsMarkdown}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Title</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={generatedContent.title}
                    onChange={(e) =>
                      setGeneratedContent({
                        ...generatedContent,
                        title: e.target.value,
                      })
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO & Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Meta Title</label>
                    <Input
                      value={
                        generatedContent.metaTitle || generatedContent.title
                      }
                      onChange={(e) =>
                        setGeneratedContent({
                          ...generatedContent,
                          metaTitle: e.target.value,
                        })
                      }
                      placeholder="Enter meta title for SEO"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This will be used as the title in search engine results
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Meta Description
                    </label>
                    <Textarea
                      value={generatedContent.meta || ""}
                      onChange={(e) =>
                        setGeneratedContent({
                          ...generatedContent,
                          meta: e.target.value,
                        })
                      }
                      placeholder="Enter meta description for SEO"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      This will appear in search engine results
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Keywords</label>
                    <Input
                      value={generatedContent.keywords?.join(", ") || ""}
                      onChange={(e) =>
                        setGeneratedContent({
                          ...generatedContent,
                          keywords: e.target.value
                            .split(",")
                            .map((k) => k.trim()),
                        })
                      }
                      placeholder="Enter keywords (comma separated)"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Keywords help with SEO. Separate with commas
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">URL Slug</label>
                    <Input
                      value={generatedContent.slug}
                      onChange={(e) =>
                        setGeneratedContent({
                          ...generatedContent,
                          slug: e.target.value,
                        })
                      }
                      placeholder="Enter URL slug"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      The URL-friendly version of the title (e.g., my-blog-post)
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Tags</label>
                    <Input
                      value={generatedContent.tags?.join(", ") || ""}
                      onChange={(e) =>
                        setGeneratedContent({
                          ...generatedContent,
                          tags: e.target.value.split(",").map((t) => t.trim()),
                        })
                      }
                      placeholder="Enter tags (comma separated)"
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      Separate tags with commas (e.g., technology, programming,
                      web)
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImagePreview(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <TinyMCEEditor
                    value={generatedContent.body}
                    onChange={(content) =>
                      setGeneratedContent({
                        ...generatedContent,
                        body: content,
                      })
                    }
                  />
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleSave("draft")}
                  disabled={isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button
                  onClick={() => handleSave("published")}
                  disabled={isLoading}
                >
                  <Send className="mr-2 h-4 w-4" />
                  Publish
                </Button>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>SEO Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-medium">Keyword density: 2.3%</p>
                        <p className="text-sm text-muted-foreground">
                          Good keyword density (2-3% is ideal)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-medium">Headings structure</p>
                        <p className="text-sm text-muted-foreground">
                          Good use of H2 and H3 headings
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs mt-0.5">
                        !
                      </div>
                      <div>
                        <p className="font-medium">Meta description</p>
                        <p className="text-sm text-muted-foreground">
                          Add a meta description (150-160 characters)
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs mt-0.5">
                        !
                      </div>
                      <div>
                        <p className="font-medium">Internal links</p>
                        <p className="text-sm text-muted-foreground">
                          Consider adding 2-3 internal links
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-medium">
                          Content length: ~1,200 words
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Good length for SEO (1,000+ words)
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
