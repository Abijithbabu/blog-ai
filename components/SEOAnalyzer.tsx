import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface SEOAnalysisProps {
  seoAnalysis: {
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
  };
}

const StatusIndicator = ({ status }: { status: string }) => {
  switch (status) {
    case 'good':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'poor':
    case 'difficult':
    case 'missing':
    case 'too short':
    case 'too long':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
  }
};

export function SEOAnalyzer({ seoAnalysis }: SEOAnalysisProps) {
  if (!seoAnalysis) {
    return (
      <Alert>
        <AlertTitle>No SEO analysis available</AlertTitle>
        <AlertDescription>
          SEO analysis data is not available for this content.
        </AlertDescription>
      </Alert>
    );
  }

  const { wordCount, keywordDensity, readability, headings, links, images, metaDescription } = seoAnalysis;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>SEO Analysis</CardTitle>
          <CardDescription>
            Optimize your content for better search engine rankings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Score Section */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <h3 className="text-sm font-medium">Readability Score</h3>
              <span className="text-sm text-muted-foreground">{readability.score.toFixed(1)}/100</span>
            </div>
            <Progress value={readability.score} className="h-2" />
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <StatusIndicator status={readability.status} />
              {readability.recommendation}
            </p>
          </div>

          {/* Word Count Section */}
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <h3 className="text-sm font-medium">Word Count</h3>
              <p className="text-sm text-muted-foreground">{wordCount.count} words</p>
            </div>
            <StatusIndicator status={wordCount.status} />
          </div>

          {/* Keyword Density Section */}
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <h3 className="text-sm font-medium">Keyword Density</h3>
              <p className="text-sm text-muted-foreground">Average: {keywordDensity.average}</p>
              {keywordDensity.byKeyword && (
                <div className="mt-1">
                  {Object.entries(keywordDensity.byKeyword).map(([keyword, density]) => (
                    <span key={keyword} className="text-xs bg-gray-100 rounded-full px-2 py-0.5 mr-1">
                      {keyword}: {density}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <StatusIndicator status={keywordDensity.status} />
          </div>

          {/* Meta Description Section */}
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <h3 className="text-sm font-medium">Meta Description</h3>
              <p className="text-sm text-muted-foreground">{metaDescription.length} characters</p>
            </div>
            <StatusIndicator status={metaDescription.status} />
          </div>

          {/* Headings Section */}
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <h3 className="text-sm font-medium">Heading Structure</h3>
              <p className="text-sm text-muted-foreground">{headings.structure}</p>
              {headings.issues.length > 0 && (
                <ul className="text-xs text-red-500 mt-1">
                  {headings.issues.map((issue, idx) => (
                    <li key={idx}>• {issue}</li>
                  ))}
                </ul>
              )}
            </div>
            <StatusIndicator status={headings.issues.length > 0 ? 'poor' : 'good'} />
          </div>

          {/* Links Section */}
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <h3 className="text-sm font-medium">Links</h3>
              <p className="text-sm text-muted-foreground">
                Total: {links.total} (Internal: {links.internal}, External: {links.external})
              </p>
              {links.issuesFound.length > 0 && (
                <p className="text-xs text-red-500 mt-1">Issues found with links</p>
              )}
            </div>
            <StatusIndicator status={links.total > 0 ? 'good' : 'poor'} />
          </div>

          {/* Images Section */}
          <div className="flex items-center justify-between py-2 border-t">
            <div>
              <h3 className="text-sm font-medium">Images</h3>
              <p className="text-sm text-muted-foreground">
                Total: {images.total} {images.missingAlt > 0 && `(${images.missingAlt} missing alt text)`}
              </p>
            </div>
            <StatusIndicator status={images.missingAlt > 0 ? 'poor' : 'good'} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 