"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PencilLine,
  Sparkles,
  RefreshCw,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import api from "@/axios-instance";

// Static post types for demo
type Post = {
  _id: string;
  title: string;
  status: "draft" | "published";
  createdAt: string;
  content: string;
  tags: string[];
  readTime: number;
  featuredImage?: string;
};

export default function BlogsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [deletePostId, setDeletePostId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch posts
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error",
          description: "Failed to fetch posts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  const handleDeletePost = async () => {
    if (!deletePostId) return;

    try {
      await api.delete(`/posts/${deletePostId}`);
      setPosts(posts.filter((post) => post._id !== deletePostId));
      toast({
        title: "Success",
        description: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Error",
        description: "Failed to delete the post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletePostId(null);
    }
  };

  const filteredPosts =
    activeTab === "all"
      ? posts
      : activeTab === "published"
      ? posts.filter((post) => post.status === "published")
      : posts.filter((post) => post.status === "draft");

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl">Your Blog Posts</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your published and draft blog posts in one
            place.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Link href="/write">
            <Button className="w-full md:w-auto">
              <PencilLine className="mr-2 h-4 w-4" />
              Write New Post
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Posts ({posts.length})</TabsTrigger>
          <TabsTrigger value="published">
            Published ({posts.filter((p) => p.status === "published").length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Drafts ({posts.filter((p) => p.status === "draft").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-10">
              <h3 className="text-lg font-medium">No posts found</h3>
              <p className="text-muted-foreground mt-1">
                Start by creating a new blog post
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
                <Card key={post._id} className="overflow-hidden flex flex-col">
                  <div className="relative h-48 w-full">
                    {post.featuredImage ? (
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                        <PencilLine className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="p-4">
                    <CardTitle className="line-clamp-2 text-xl">
                      {post.title}
                    </CardTitle>
                    <CardDescription>
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                      {post.readTime > 0 && ` • ${post.readTime} min read`}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4">
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex justify-between mt-auto px-4">
                    <Link href={`/write/${post._id}`}>
                      <Button variant="outline" size="sm">
                        Edit <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => setDeletePostId(post._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <ConfirmationDialog
        isOpen={!!deletePostId}
        onClose={() => setDeletePostId(null)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
