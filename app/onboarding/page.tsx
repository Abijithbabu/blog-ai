"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
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
import { useAuth } from "@/context/auth-context";
import api from "@/axios-instance";

// Define form schema with zod
const formSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  targetAudience: z
    .string()
    .min(2, "Target audience must be at least 2 characters"),
  primaryKeywords: z.string().min(2, "Please enter at least one keyword"),
  preferredSources: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      targetAudience: "",
      primaryKeywords: "",
      preferredSources: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await api.post("/business/onboarding", data);
      if (response.data.user) {
        setUser(response.data.user);
      }

      toast({
        title: "Business profile saved!",
        description: "Your profile has been successfully set up.",
      });
      router.push("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save business profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-6 px-4 max-w-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to BlogAI!</h1>
          <p className="text-muted-foreground">
            Let&apos;s set up your business profile to personalize your
            experience.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="health">
                          Health & Wellness
                        </SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="food">Food & Beverage</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E.g., small business owners, young professionals"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Who is your product or service aimed at?
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
                      <Input
                        placeholder="E.g., digital marketing, SEO, content creation"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated keywords related to your business
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredSources"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Sources for Trending Topics</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred sources (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="googleTrends">
                          Google Trends
                        </SelectItem>
                        <SelectItem value="reddit">Reddit</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="industry">Industry News</SelectItem>
                        <SelectItem value="all">All Sources</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Where would you like us to source trending topics from?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save and Continue"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}
