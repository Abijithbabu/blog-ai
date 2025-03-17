"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RefreshCw,
  TrendingUp,
  Search,
  Clock,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/axios-instance";

interface TrendingTopic {
  title: string;
  source: string;
  traffic: string | number;
  description: string;
  blogRelevance: string;
  url: string;
}

export default function TrendingPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingTopics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/trends");
      if (!response.data.success) {
        throw new Error(
          response.data.message || "Failed to fetch trending topics"
        );
      }
      setTrendingTopics(response.data.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch trending topics"
      );
      setTrendingTopics([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingTopics();
  }, []);

  const filteredTopics =
    activeTab === "all"
      ? trendingTopics
      : trendingTopics.filter(
          (topic) => topic.source.toLowerCase() === activeTab.toLowerCase()
        );

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case "daily trends":
        return <Clock className="h-4 w-4" />;
      case "real-time trends":
        return <TrendingUp className="h-4 w-4" />;
      case "related topics":
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case "daily trends":
        return "bg-blue-100 text-blue-800";
      case "real-time trends":
        return "bg-green-100 text-green-800";
      case "related topics":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Trending Topics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const dailyTrends = trendingTopics.filter((t) => t.source === "Daily Trends");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Trending Topics</h1>
            <p className="text-muted-foreground mt-1">
              Discover trending topics relevant to your business
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchTrendingTopics}
            disabled={isLoading}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">
              All Sources ({trendingTopics.length})
            </TabsTrigger>
            <TabsTrigger value="daily">
              Daily ({dailyTrends.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trendingTopics.map((topic, index) => (
                <TrendCard key={index} topic={topic} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="daily" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dailyTrends.map((topic, index) => (
                <TrendCard key={index} topic={topic} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {trendingTopics.length === 0 && !isLoading && (
          <Alert>
            <AlertTitle>No trending topics found</AlertTitle>
            <AlertDescription>
              Try refreshing the page or check back later for new trending
              topics.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

function TrendCard({ topic }: { topic: TrendingTopic }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{topic.title}</CardTitle>
            <CardDescription className="mt-1">
              {topic.source} •{" "}
              {typeof topic.traffic === "string"
                ? topic.traffic
                : `${topic.traffic.toLocaleString()} views`}
            </CardDescription>
          </div>
          {topic.url && (
            <a
              href={topic.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{topic.description}</p>
        <p className="text-sm font-medium text-gray-800">
          {topic.blogRelevance}
        </p>
      </CardContent>
    </Card>
  );
}
