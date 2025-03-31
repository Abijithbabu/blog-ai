"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TextEditor from "../Editor";
import { useRouter } from "next/navigation";
import api from "@/axios-instance";
import LoadingResponse from "../LoadingResponse";

interface ScraperActionsProps {
  data: {
    title: string;
    description: string;
    content: string;
  };
}

export function ScraperActions({ data }: ScraperActionsProps) {
  const router = useRouter();
  const [title, setTitle] = useState(data?.title);
  const [description, setDescription] = useState(data?.description);
  const [editedContent, setEditedContent] = useState(data?.content);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!title || !editedContent) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post("/scraper/process", {
        title,
        content: editedContent,
        prompt,
      });
      const result = response.data;
      console.log(result);
      router.push(`/write/${result._id}`);
      toast({
        title: "Success",
        description: "Content processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to process content",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2 col-span-2">
        <Label>Content</Label>
        <TextEditor data={editedContent} dispatch={setEditedContent} />
      </div>
      <div className="col-span-1 space-y-4 h-full">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prompt">Generation Prompt</Label>
          <Textarea
            id="prompt"
            value={prompt}
            rows={5}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt for AI generation... (optional)"
            disabled={isGenerating}
          />
        </div>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || !editedContent}
          className="w-full bottom-0 justify-self-end align-self-end align-bottom col-end-1"
        >
          {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Blog
        </Button>
        <LoadingResponse loading={isGenerating} />
      </div>
    </div>
  );
}
