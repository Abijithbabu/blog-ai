"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScraperForm } from "@/components/scraper-tool/scraper-form";
import { ScrapedContentPreview } from "@/components/scraper-tool/scraped-content-preview";
import { ScraperActions } from "@/components/scraper-tool/scraper-actions";
import { SummarizeExpandToggle } from "@/components/scraper-tool/summarize-expand-toggle";
import { ScrapedToAIGenerator } from "@/components/scraper-tool/scraped-to-ai-generator";

export default function ScraperToolPage() {
  const [scrapedContent, setScrapedContent] = useState<any>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleScrapeComplete = (data: any) => {
    setScrapedContent(data);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl">Web Scraper Tool</h2>
        <p className="text-muted-foreground">
          Extract content from websites and generate blogs
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {!isExpanded && (
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Scrape Content</CardTitle>
                <CardDescription>
                  Enter a URL to extract content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScraperForm onScrapeComplete={handleScrapeComplete} />
              </CardContent>
            </Card>
          </div>
        )}

        <div className={isExpanded ? "lg:col-span-3" : "lg:col-span-2"}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Scraped Content</CardTitle>
                <CardDescription>
                  Preview and edit the extracted content
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <SummarizeExpandToggle
                  isExpanded={isExpanded}
                  onToggle={() => setIsExpanded(!isExpanded)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4 h-[84vh] overflow-y-scroll">
              <ScrapedContentPreview data={scrapedContent} />
              <Tabs defaultValue="generate">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="generate">Generate Blog</TabsTrigger>
                  <TabsTrigger value="edit" onClick={() => setIsExpanded(true)}>
                    Edit Content
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="generate" className="space-y-4 pt-4">
                  <ScrapedToAIGenerator data={scrapedContent} />
                </TabsContent>
                <TabsContent value="edit" className="space-y-4 pt-4">
                  <ScraperActions data={scrapedContent} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
