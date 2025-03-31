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
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Building2,
  Users,
  Tags,
  RssIcon,
  Check,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

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
const sources = [
  { value: "googleTrends", label: "Google Trends" },
  { value: "reddit", label: "Reddit" },
  { value: "twitter", label: "Twitter" },
  { value: "industry", label: "Industry News" },
  { value: "all", label: "All Sources" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

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
        title: "Welcome aboard! 🎉",
        description: "Your business profile has been successfully set up.",
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

  const steps = [
    {
      number: 1,
      title: "Business Info",
      icon: Building2,
      fields: ["businessName", "industry"],
    },
    {
      number: 2,
      title: "Target Audience",
      icon: Users,
      fields: ["targetAudience"],
    },
    {
      number: 3,
      title: "Keywords",
      icon: Tags,
      fields: ["primaryKeywords"],
    },
    {
      number: 4,
      title: "Content Sources",
      icon: RssIcon,
      fields: ["preferredSources"],
    },
  ];

  const isStepComplete = (stepFields: string[]) => {
    return stepFields.every((field) => {
      const value = form.getValues(field as keyof FormData);
      return value && value.length > 0;
    });
  };

  const canProceed = isStepComplete(steps[currentStep - 1].fields);

  const stepDescriptions = {
    1: {
      title: "Tell us about your business",
      description:
        "This helps us tailor content and trends specifically for your industry",
      tips: [
        "Use your official business name",
        "Select the closest matching industry",
      ],
    },
    2: {
      title: "Define your audience",
      description:
        "Understanding your target audience helps us generate more relevant content",
      tips: [
        "Be specific about demographics",
        "Consider both primary and secondary audiences",
      ],
    },
    3: {
      title: "Set your focus keywords",
      description:
        "Keywords help us find trending topics that matter to your business",
      tips: [
        "Include industry-specific terms",
        "Add product or service related keywords",
      ],
    },
    4: {
      title: "Choose your content sources",
      description: "Select where you'd like us to source trending topics from",
      tips: [
        "Multiple sources provide diverse content",
        "Industry news offers specialized insights",
      ],
    },
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex container mx-auto px-4 py-4 max-w-4xl flex-col">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Welcome to BlogAI!
          </h1>
          <p className="text-muted-foreground">
            Let&apos;s personalize your experience in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            {steps.map((step) => {
              const StepIcon = step.icon;
              const isActive = step.number === currentStep;
              const isDone =
                step.number < currentStep ||
                (step.number === currentStep && isStepComplete(step.fields));

              return (
                <div
                  key={step.number}
                  className={`flex flex-col items-center w-1/4 relative ${
                    isActive
                      ? "text-primary"
                      : isDone
                      ? "text-primary/80"
                      : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`absolute z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                      isActive
                        ? "border-primary bg-background"
                        : isDone
                        ? "border-primary/80 bg-primary/80 text-background"
                        : "border-muted bg-background"
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <p className="mt-10 text-xs font-medium">{step.title}</p>
                  {step.number < steps.length && (
                    <div
                      className={`absolute top-4 left-1/2 w-full h-0.5 z-0 ${
                        isDone ? "bg-primary/80" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-96 grid grid-cols-5 gap-4">
          {/* Main Form Card */}
          <Card className="col-span-3 border-none shadow-lg bg-card">
            <CardContent className="p-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Step 1: Business Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
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
                                className="bg-background"
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
                                <SelectTrigger className="bg-background">
                                  <SelectValue placeholder="Select your industry" />
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
                  )}

                  {/* Step 2: Target Audience */}
                  {currentStep === 2 && (
                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="E.g., small business owners, young professionals"
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormDescription>
                            Who is your product or service aimed at?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Step 3: Keywords */}
                  {currentStep === 3 && (
                    <FormField
                      control={form.control}
                      name="primaryKeywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Keywords</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="E.g., digital marketing, SEO, content creation"
                              {...field}
                              className="bg-background"
                            />
                          </FormControl>
                          <FormDescription>
                            Enter comma-separated keywords related to your
                            business
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Step 4: Content Sources */}
                  {currentStep === 4 && (
                    <FormField
                      control={form.control}
                      name="preferredSources"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Preferred Sources for Trending Topics
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select preferred sources" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sources.map((source) => (
                                <SelectItem
                                  key={source.value}
                                  value={source.value}
                                >
                                  {source.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Where would you like us to source trending topics
                            from?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="flex justify-between pt-4">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    {currentStep < steps.length ? (
                      <Button
                        type="button"
                        className="ml-auto"
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={!canProceed}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="ml-auto"
                        disabled={isLoading || !canProceed}
                      >
                        {isLoading ? "Setting up..." : "Complete Setup"}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Context Card */}
          <Card className="col-span-2 border-none shadow-lg bg-primary/5 dark:bg-primary/10">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-3">
                {
                  stepDescriptions[currentStep as keyof typeof stepDescriptions]
                    .title
                }
              </h2>
              <p className="text-muted-foreground mb-4">
                {
                  stepDescriptions[currentStep as keyof typeof stepDescriptions]
                    .description
                }
              </p>
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-primary">Tips:</h3>
                <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                  {stepDescriptions[
                    currentStep as keyof typeof stepDescriptions
                  ].tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
