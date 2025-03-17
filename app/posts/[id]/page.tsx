"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import TinyMCEEditor from "@/components/tiny-mce-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Modal } from "@/components/ui/modal"
import { Copy, Download, Save, Send, Trash2 } from "lucide-react"
import { SEOSuggestionsModal } from "@/components/seo-suggestions-modal"

// Define form schema with zod
const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(2, "Slug is required"),
  image: z.any().optional(),
  description: z.string().min(20, "Description must be at least 20 characters"),
})

type FormData = z.infer<typeof formSchema>

interface SEOSuggestion {
  type: "success" | "warning" | "error"
  title: string
  description: string
}

// Sample post data for demo
const samplePosts = [
  {
    id: "1",
    title: "How to Increase Your Website Traffic",
    status: "published",
    createdAt: "2025-03-02T12:00:00Z",
    slug: "how-to-increase-your-website-traffic",
    body: `<h2>Introduction</h2>
    <p>Increasing website traffic is crucial for online success. This guide explores proven strategies to boost your visitor numbers.</p>
    
    <h2>SEO Optimization</h2>
    <p>Search engine optimization remains one of the most effective ways to drive organic traffic to your website.</p>
    
    <h3>Keyword Research</h3>
    <p>Start with thorough keyword research to understand what your target audience is searching for.</p>
    
    <h3>On-Page SEO</h3>
    <p>Optimize your content, meta descriptions, and headers for better search engine visibility.</p>
    
    <h2>Content Marketing</h2>
    <p>Creating valuable, relevant content consistently will attract and retain visitors.</p>
    
    <h2>Social Media Promotion</h2>
    <p>Leverage social platforms to expand your reach and drive traffic back to your website.</p>
    
    <h2>Email Marketing</h2>
    <p>Build an email list and use it to notify subscribers about new content and offerings.</p>
    
    <h2>Conclusion</h2>
    <p>Implementing these strategies consistently will help increase your website traffic over time.</p>`,
  },
  {
    id: "2",
    title: "Top 10 Digital Marketing Strategies",
    status: "draft",
    createdAt: "2025-03-01T10:30:00Z",
    slug: "top-10-digital-marketing-strategies",
    body: `<h2>Introduction to Digital Marketing</h2>
    <p>Digital marketing continues to evolve rapidly. This post covers the top 10 strategies for 2025.</p>
    
    <h2>1. AI-Powered Marketing</h2>
    <p>Artificial intelligence is revolutionizing how marketers analyze data and personalize campaigns.</p>
    
    <h2>2. Video Content Dominance</h2>
    <p>Video remains the most engaging content format across all platforms.</p>
    
    <h2>3. Voice Search Optimization</h2>
    <p>With the rise of smart speakers, optimizing for voice search is becoming essential.</p>
    
    <h2>4. Interactive Content</h2>
    <p>Quizzes, polls, and interactive infographics drive higher engagement rates.</p>
    
    <h2>5. Personalization at Scale</h2>
    <p>Delivering personalized experiences to each user is now possible with advanced tools.</p>
    
    <h2>6. Micro-Influencer Collaborations</h2>
    <p>Smaller influencers often deliver better ROI than celebrity endorsements.</p>
    
    <h2>7. Privacy-First Marketing</h2>
    <p>With increasing privacy regulations, ethical data collection is paramount.</p>
    
    <h2>8. Omnichannel Approach</h2>
    <p>Creating seamless experiences across all customer touchpoints.</p>
    
    <h2>9. Sustainability Messaging</h2>
    <p>Eco-friendly practices are becoming a key differentiator for brands.</p>
    
    <h2>10. Community Building</h2>
    <p>Fostering communities around your brand creates loyal advocates.</p>`,
  },
]

export default function PostEditPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [post, setPost] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSEOModal, setShowSEOModal] = useState(false)
  const [seoSuggestions, setSEOSuggestions] = useState<SEOSuggestion[]>([
    {
      type: "success",
      title: "Keyword density: 2.1%",
      description: "Good keyword density (2-3% is ideal)",
    },
    {
      type: "success",
      title: "Headings structure",
      description: "Good use of H2 and H3 headings",
    },
    {
      type: "warning",
      title: "Meta description",
      description: "Add a meta description (150-160 characters)",
    },
    {
      type: "warning",
      title: "Internal links",
      description: "Consider adding 2-3 internal links",
    },
    {
      type: "success",
      title: "Content length: ~1,100 words",
      description: "Good length for SEO (1,000+ words)",
    },
    {
      type: "error",
      title: "Image alt text",
      description: "Add alt text to all images for accessibility",
    },
  ])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
    },
  })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get(`/api/posts/${params.id}`)
        // const post = response.data

        // For demo purposes, find the post in our sample data
        const post = samplePosts.find((p) => p.id === params.id)

        if (post) {
          setPost(post)
          form.reset({
            title: post.title,
            slug: post.slug,
            description: post.body,
          })
        } else {
          toast({
            title: "Error",
            description: "Post not found",
            variant: "destructive",
          })
          router.push("/dashboard")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch post",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id, router, toast, form])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // Set preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      form.setValue("image", file)
    } else {
      setImagePreview(null)
      form.setValue("image", undefined)
    }
  }

  const onSubmit = async (data: FormData, status: "draft" | "published") => {
    setIsLoading(true)
    try {
      // In a real app, this would upload the image and save the post
      // const formData = new FormData()
      // if (data.image) formData.append("image", data.image)
      // const imageResponse = await axios.post('/api/upload', formData)
      // const imageUrl = imageResponse.data.url

      // await axios.patch(`/api/posts/${params.id}`, {
      //   title: data.title,
      //   slug: data.slug,
      //   body: data.description,
      //   image: imageUrl,
      //   status
      // })

      // For demo purposes, show a success message
      setTimeout(() => {
        toast({
          title: status === "published" ? "Blog published!" : "Draft saved!",
          description:
            status === "published" ? "Your blog post has been published successfully." : "Your draft has been saved.",
        })
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // await axios.delete(`/api/posts/${params.id}`)

      // For demo purposes, show a success message
      setTimeout(() => {
        toast({
          title: "Post deleted",
          description: "Your blog post has been deleted successfully.",
        })
        router.push("/dashboard")
      }, 1000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteModal(false)
    }
  }

  const copyToClipboard = () => {
    if (!post) return

    const textToCopy = `# ${form.getValues().title}\n\n${form.getValues().description.replace(/<[^>]*>/g, "")}`
    navigator.clipboard.writeText(textToCopy)

    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    })
  }

  const downloadAsMarkdown = () => {
    if (!post) return

    const textToDownload = `# ${form.getValues().title}\n\n${form.getValues().description.replace(/<[^>]*>/g, "")}`
    const blob = new Blob([textToDownload], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${form.getValues().slug}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Content has been downloaded as Markdown",
    })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 px-4 flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Blog Post</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadAsMarkdown}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteModal(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Form {...form}>
              <form className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter blog post title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter slug" {...field} />
                        </FormControl>
                        <FormDescription>Used in URL: example.com/blog/{field.value}</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormLabel>Featured Image</FormLabel>
                        <FormControl>
                          <Input type="file" accept="image/*" onChange={handleImageChange} />
                        </FormControl>
                        <FormDescription>Optional. Recommended size: 1200x630px</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {imagePreview && (
                  <div className="relative w-full h-48 rounded-md overflow-hidden">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImagePreview(null)
                        form.setValue("image", undefined)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description / Body</FormLabel>
                      <FormControl>
                        <TinyMCEEditor value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onSubmit(form.getValues(), "draft")}
                    disabled={isLoading || !form.formState.isValid}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={() => onSubmit(form.getValues(), "published")}
                    disabled={isLoading || !form.formState.isValid}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    Publish
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>SEO Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {seoSuggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center text-white text-xs mt-0.5 ${
                          suggestion.type === "success"
                            ? "bg-green-500"
                            : suggestion.type === "warning"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      >
                        {suggestion.type === "success" ? "✓" : "!"}
                      </div>
                      <div>
                        <p className="font-medium">{suggestion.title}</p>
                        <p className="text-sm text-muted-foreground">{suggestion.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <Button variant="link" onClick={() => setShowSEOModal(true)} className="mt-4">
                  View all suggestions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SEOSuggestionsModal isOpen={showSEOModal} onClose={() => setShowSEOModal(false)} suggestions={seoSuggestions} />

      <Modal
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        footer={
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        }
      />
    </>
  )
}

