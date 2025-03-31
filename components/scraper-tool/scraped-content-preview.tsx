"use client";

import { Card } from "@/components/ui/card";

interface ScrapedContentPreviewProps {
  data?: {
    title: string;
    description: string;
    content: string;
    images: string[];
    links: string[];
    sourceUrl: string;
  };
}

export function ScrapedContentPreview({ data }: ScrapedContentPreviewProps) {
  if (!data) {
    return (
      <div className="flex h-[450px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">
          Scraped content will appear here
        </p>
      </div>
    );
  }

  const { title, description, content, images, links } = data;

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold break-words">{title}</h3>
        <p className="text-sm text-muted-foreground break-words">{description}</p>
      </div>

      <Card className="p-4 overflow-hidden">
        <div
          className="prose prose-sm max-w-none dark:prose-invert overflow-hidden"
          dangerouslySetInnerHTML={{ 
            __html: content.replace(/position:\s*absolute/g, 'position: relative')
                          .replace(/position:\s*fixed/g, 'position: relative')
                          .replace(/z-index:\s*\d+/g, 'z-index: 0')
                          .replace(/width:\s*100vw/g, 'width: 100%')
                          .replace(/height:\s*100vh/g, 'height: auto')
          }}
        />
      </Card>

      {images.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Images Found</h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 bg-gray-100 dark:bg-gray-800 rounded-lg p-2 overflow-hidden">
            {images.map((image: string, index: number) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={image}
                  alt={`Scraped image ${index + 1}`}
                  className="absolute inset-0 h-full w-full object-cover border border-gray-400"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {links.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Links Found</h4>
          <div className="flex flex-wrap gap-2 overflow-hidden">
            {links.map((link: string, index: number) => (
              <a
                key={index}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 break-all"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
