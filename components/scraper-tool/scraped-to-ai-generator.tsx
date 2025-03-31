"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import api from "@/axios-instance";
import LoadingResponse from "../LoadingResponse";

interface ScrapedToAIGeneratorProps {
  data?: {
    title: string;
    description: string;
    content: string;
  };
}

export function ScrapedToAIGenerator({ data }: ScrapedToAIGeneratorProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!data || !prompt) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/scraper/process", {
        title: data?.title,
        content: data?.content,
        prompt,
      });
      const result = response.data;
      console.warn(result);
      router.push(`/write/${result._id}`);
      toast({
        title: "Success",
        description: "Content generated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to generate content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          If you want to modify or refine the content, navigate to the "Edit
          Content" tab for full control. Otherwise, you can use the prompt below
          to generate AI-enhanced content effortlessly
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="prompt">Generation Prompt</Label>
        <Textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt for AI generation..."
          rows={8}
          className="min-h-[100px]"
          disabled={isGenerating}
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !data}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Blog"
        )}
      </Button>
      <LoadingResponse loading={isGenerating} />
    </div>
  );
}
