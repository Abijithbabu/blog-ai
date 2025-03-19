"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOAnalyzer } from "./SEOAnalyzer";
import api from "@/axios-instance";
import axios from "axios";

export interface ContentSuggestion {
  title: string;
  meta: string;
  keywords: string[];
  outline: string;
  wordCount: number;
  slug: string;
}

interface SEOAnalysis {
  wordCount: {
    count: number;
    status: string;
    recommendation: string;
  };
  keywordDensity: {
    average: string;
    status: string;
    recommendation: string;
    byKeyword?: Record<string, string>;
  };
  readability: {
    score: number;
    status: string;
    recommendation: string;
  };
  headings: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
    total: number;
    structure: string;
    issues: string[];
  };
  links: {
    total: number;
    internal: number;
    external: number;
    issuesFound: string[];
  };
  images: {
    total: number;
    missingAlt: number;
    emptyAlt: number;
  };
  metaDescription: {
    length: number;
    status: string;
    recommendation: string;
  };
}

interface ContentResponse {
  suggestion: ContentSuggestion;
  source: "ai" | "template" | "openai";
  wordCount: number;
  seoAnalysis?: SEOAnalysis;
}

interface ChatPanelProps {
  onSuggestionSelect: (suggestion: ContentSuggestion) => void;
}

export function ChatPanel({ onSuggestionSelect }: ChatPanelProps) {
  const [topic, setTopic] = useState("");
  const [wordCount, setWordCount] = useState(800);
  const [response, setResponse] = useState<ContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("content");
  const { toast } = useToast();

  const handleResearch = async () => {
    if (!topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic to research",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Sending research request:", { topic, wordCount });
      const response = await api.post<ContentResponse>("/content/research", {
        topic,
        wordCount,
      });
      
      // Clean the response data by removing "**" from all text fields
      const cleanedData = {
        ...response.data,
        suggestion: {
          ...response.data.suggestion,
          title: response.data.suggestion.title.replace(/\*\*/g, '').trim(),
          meta: response.data.suggestion.meta.replace(/\*\*/g, '').trim(),
          keywords: response.data.suggestion.keywords.map(keyword => 
            keyword.replace(/\*\*/g, '').trim()
          ),
          outline: response.data.suggestion.outline.replace(/\*\*/g, '').trim(),
        }
      };

      console.log("Cleaned response:", cleanedData);
      if (!cleanedData || !cleanedData.suggestion) {
        throw new Error("Invalid response format");
      }
      setResponse(cleanedData);
      // If SEO analysis is available, switch to that tab automatically
      if (cleanedData.seoAnalysis) {
        setActiveTab("seo");
      }
    } catch (error) {
      console.error("Research error:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Failed to generate content suggestion";
        console.error("API Error details:", {
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

  const handleUseSuggestion = () => {
    if (response?.suggestion) {
      onSuggestionSelect(response.suggestion);
      setResponse(null);
      setTopic("");
    }
  };

  return (
    <div className="w-96 border-l p-6 bg-gray-50">
      <div className="h-full flex flex-col">
        <h2 className="text-lg font-semibold mb-4">AI Content Research</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Enter a topic to get content suggestions tailored to your business.
        </p>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Enter a topic to research..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Word Count: {wordCount}</span>
              <span className="text-xs text-muted-foreground">
                {wordCount < 500
                  ? "Short"
                  : wordCount < 1000
                  ? "Medium"
                  : "Long"}
              </span>
            </div>
            <Slider
              value={[wordCount]}
              min={300}
              max={3000}
              step={100}
              onValueChange={(value) => setWordCount(value[0])}
              disabled={isLoading}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleResearch}
            disabled={isLoading}
          >
            {isLoading ? "Researching..." : "Research Topic"}
          </Button>
        </div>

        {response && (
          <div className="mt-6 flex-1 overflow-auto">
            <Tabs
              defaultValue={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="seo">SEO Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-0">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium">Title</h3>
                    <p className="text-sm mt-1">{response.suggestion.title}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-medium">Meta Description</h3>
                    <p className="text-sm mt-1">{response.suggestion.meta}</p>
                  </div>

                  <div>
                    <h3 className="text-md font-medium">Keywords</h3>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {response.suggestion.keywords.map((keyword, i) => (
                        <Badge key={i} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-md font-medium">Content Preview</h3>
                    <div className="max-h-60 overflow-y-auto rounded border p-2 mt-1 text-sm">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: response.suggestion.outline,
                        }}
                      />
                    </div>
                  </div>

                  <Button onClick={handleUseSuggestion} className="w-full">
                    Use This Suggestion
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="mt-0">
                {response.seoAnalysis ? (
                  <div className="space-y-4">
                    <SEOAnalyzer seoAnalysis={response.seoAnalysis} />
                    <Button onClick={handleUseSuggestion} className="w-full">
                      Use This Suggestion
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">
                      No SEO analysis available for this content.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
