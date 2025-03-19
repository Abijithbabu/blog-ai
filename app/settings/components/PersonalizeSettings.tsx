import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import api from "@/axios-instance";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const personalizeFormSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  industry: z.enum([
    "Agriculture & Forestry",
    "Automotive & Transportation",
    "Aerospace & Defense",
    "Banking & Finance",
    "Construction & Real Estate",
    "Consumer Goods & Retail",
    "E-commerce",
    "Education & E-learning",
    "Energy & Utilities",
    "Entertainment & Media",
    "Food & Beverage",
    "Healthcare & Pharmaceuticals",
    "Hospitality & Tourism",
    "Information Technology (IT) & Software",
    "Manufacturing & Industrial",
    "Marketing & Advertising",
    "Mining & Metals",
    "Professional Services",
    "Telecommunications",
    "Logistics & Supply Chain",
  ]),
  targetAudience: z
    .string()
    .min(2, "Target audience must be at least 2 characters"),
  primaryKeywords: z
    .string()
    .min(2, "Primary keywords must be at least 2 characters"),
  contentPreferences: z.object({
    includeFeaturedImage: z.boolean().default(true),
    includeMetaDescription: z.boolean().default(true),
    includeTableOfContents: z.boolean().default(false),
    autoGenerateTags: z.boolean().default(true),
  }),
  defaultTone: z
    .enum(["professional", "casual", "witty", "authoritative", "friendly"])
    .default("professional"),
  defaultWordCount: z.enum(["500", "1000", "1500", "2000"]).default("1000"),
});

export type PersonalizeFormData = z.infer<typeof personalizeFormSchema>;

const industries = [
  "Agriculture & Forestry",
  "Automotive & Transportation",
  "Aerospace & Defense",
  "Banking & Finance",
  "Construction & Real Estate",
  "Consumer Goods & Retail",
  "E-commerce",
  "Education & E-learning",
  "Energy & Utilities",
  "Entertainment & Media",
  "Food & Beverage",
  "Healthcare & Pharmaceuticals",
  "Hospitality & Tourism",
  "Information Technology (IT) & Software",
  "Manufacturing & Industrial",
  "Marketing & Advertising",
  "Mining & Metals",
  "Professional Services",
  "Telecommunications",
  "Logistics & Supply Chain",
] as const;

export function PersonalizeSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<PersonalizeFormData>({
    resolver: zodResolver(personalizeFormSchema),
    defaultValues: {
      businessName: "",
      industry: "Information Technology (IT) & Software",
      targetAudience: "",
      primaryKeywords: "",
      contentPreferences: {
        includeFeaturedImage: true,
        includeMetaDescription: true,
        includeTableOfContents: false,
        autoGenerateTags: true,
      },
      defaultTone: "professional",
      defaultWordCount: "1000",
    },
  });

  useEffect(() => {
    const fetchBusinessSettings = async () => {
      try {
        const response = await api.get("/settings/personalize");
        if (response.data?.data) {
          form.reset(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching business settings:", error);
        toast({
          title: "Error",
          description: "Failed to load business settings",
          variant: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    fetchBusinessSettings();
  }, [form, toast]);

  const handleSubmit = async (data: PersonalizeFormData) => {
    try {
      setIsLoading(true);
      const response = await api.post("/settings/personalize", data);

      if (response.data?.status === "success") {
        toast({
          title: "Success",
          description: "Business settings saved successfully",
        });
      }
    } catch (error) {
      console.error("Error saving business settings:", error);
      toast({
        title: "Error",
        description: "Failed to save business settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="sticky top-0 col-span-2 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <h2 className="text-lg font-semibold">Personalization</h2>
          <Button
            type="button"
            disabled={isLoading}
            size="sm"
            onClick={() => formRef.current?.requestSubmit()}
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
          <CardDescription>
            Tell us about your business to help us generate more relevant
            content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your business name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Small business owners, Tech enthusiasts"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Who are your primary readers or customers?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryKeywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Keywords</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., digital marketing, SEO, content strategy"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Keywords that should be included in your content (comma
                        separated)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Preferences</CardTitle>
          <CardDescription>
            Customize how your content is generated
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="contentPreferences.includeMetaDescription"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Meta Description
                      </FormLabel>
                      <FormDescription>
                        Auto-generate SEO meta descriptions
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentPreferences.includeTableOfContents"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Table of Contents
                      </FormLabel>
                      <FormDescription>
                        Include auto-generated table of contents
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contentPreferences.autoGenerateTags"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Auto Tags</FormLabel>
                      <FormDescription>
                        Automatically generate tags for posts
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default Settings</CardTitle>
          <CardDescription>
            Set your preferred content generation defaults
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="defaultTone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Tone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select default tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="professional">
                          Professional
                        </SelectItem>
                        <SelectItem value="casual">
                          Casual & Friendly
                        </SelectItem>
                        <SelectItem value="witty">Witty & Engaging</SelectItem>
                        <SelectItem value="authoritative">
                          Authoritative
                        </SelectItem>
                        <SelectItem value="friendly">Conversational</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Default tone for generated content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultWordCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Word Count</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select default word count" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="500">Short (~500 words)</SelectItem>
                        <SelectItem value="1000">
                          Medium (~1000 words)
                        </SelectItem>
                        <SelectItem value="1500">Long (~1500 words)</SelectItem>
                        <SelectItem value="2000">
                          Extra Long (~2000 words)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Default length for generated content
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
