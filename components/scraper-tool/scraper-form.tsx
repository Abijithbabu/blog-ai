"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ScraperFormProps {
  onScrapeComplete?: (data: any) => void;
}

export function ScraperForm({ onScrapeComplete }: ScraperFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [scrapingOptions, setScrapingOptions] = useState({
    includeImages: true,
    includeLinks: true,
    includeTables: true,
    includeLists: true,
    includeCode: true,
    excludeSelectors: "",
    customSelectors: "",
    waitForSelector: "",
    maxDepth: 2,
    timeout: 30000,
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/scraper/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          options: scrapingOptions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to scrape content");
      }

      const data = await response.json();
      onScrapeComplete?.(data);
      toast({
        title: "Success",
        description: "Content scraped successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to scrape content",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (option: string, value: any) => {
    setScrapingOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="url">URL to Scrape</Label>
        <Input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <Label>Content Options</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeImages"
              checked={scrapingOptions.includeImages}
              onCheckedChange={(checked) =>
                handleOptionChange("includeImages", checked)
              }
            />
            <Label htmlFor="includeImages">Include Images</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeLinks"
              checked={scrapingOptions.includeLinks}
              onCheckedChange={(checked) =>
                handleOptionChange("includeLinks", checked)
              }
            />
            <Label htmlFor="includeLinks">Include Links</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeTables"
              checked={scrapingOptions.includeTables}
              onCheckedChange={(checked) =>
                handleOptionChange("includeTables", checked)
              }
            />
            <Label htmlFor="includeTables">Include Tables</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeLists"
              checked={scrapingOptions.includeLists}
              onCheckedChange={(checked) =>
                handleOptionChange("includeLists", checked)
              }
            />
            <Label htmlFor="includeLists">Include Lists</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeCode"
              checked={scrapingOptions.includeCode}
              onCheckedChange={(checked) =>
                handleOptionChange("includeCode", checked)
              }
            />
            <Label htmlFor="includeCode">Include Code Blocks</Label>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Advanced Options</Label>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="h-8 w-8"
          >
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div
          className={cn(
            "space-y-4 overflow-hidden transition-all duration-200",
            showAdvanced ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="space-y-2">
            <Label htmlFor="excludeSelectors">
              Exclude Elements (CSS Selectors)
            </Label>
            <Input
              id="excludeSelectors"
              placeholder=".advertisement, .sidebar, .comments"
              value={scrapingOptions.excludeSelectors}
              onChange={(e) =>
                handleOptionChange("excludeSelectors", e.target.value)
              }
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated list of CSS selectors to exclude from scraping
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customSelectors">Custom Content Selectors</Label>
            <Input
              id="customSelectors"
              placeholder="article, .post-content, #main-content"
              value={scrapingOptions.customSelectors}
              onChange={(e) =>
                handleOptionChange("customSelectors", e.target.value)
              }
            />
            <p className="text-sm text-muted-foreground">
              Comma-separated list of CSS selectors to specifically target for
              content
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="waitForSelector">Wait for Element</Label>
            <Input
              id="waitForSelector"
              placeholder=".article-content"
              value={scrapingOptions.waitForSelector}
              onChange={(e) =>
                handleOptionChange("waitForSelector", e.target.value)
              }
            />
            <p className="text-sm text-muted-foreground">
              CSS selector to wait for before scraping (for dynamic content)
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxDepth">Max Depth</Label>
              <Input
                id="maxDepth"
                type="number"
                min="1"
                max="5"
                value={scrapingOptions.maxDepth}
                onChange={(e) =>
                  handleOptionChange("maxDepth", parseInt(e.target.value))
                }
              />
              <p className="text-sm text-muted-foreground">
                Maximum depth for nested content (1-5)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Timeout (ms)</Label>
              <Input
                id="timeout"
                type="number"
                min="5000"
                max="60000"
                step="1000"
                value={scrapingOptions.timeout}
                onChange={(e) =>
                  handleOptionChange("timeout", parseInt(e.target.value))
                }
              />
              <p className="text-sm text-muted-foreground">
                Maximum time to wait for content (5000-60000ms)
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Scrape Content
      </Button>
    </form>
  );
}
