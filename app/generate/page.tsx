"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import TinyMCEEditor from "@/components/tiny-mce-editor"
import { Sparkles, RefreshCw, Copy, Download, Save, Send } from "lucide-react"

// Define form schema with zod
const formSchema = z.object({
  topic: z.string().min(5, "Topic must be at least 5 characters").optional(),
  tone: z.string().min(1, "Please select a tone"),
  wordCount: z.string().min(1, "Please select a word count"),
  autoGenerate: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

export default function GeneratePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [trendingTopics, setTrendingTopics] = useState<string[]>([])
  const [generatedContent, setGeneratedContent] = useState<{
    title: string
    body: string
    slug: string
  } | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      tone: "professional",
      wordCount: "1000",
      autoGenerate: false,
    },
  })

  useEffect(() => {
    // Fetch trending topics
    const fetchTrendingTopics = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await axios.get('/api/trending-topics')
        // setTrendingTopics(response.data)

        // For demo purposes, using static data
        setTrendingTopics([
          "The Future of AI in Content Marketing",
          "How to Optimize Your Website for Voice Search",
          "10 Effective Social Media Strategies for 2025",
          "Sustainable Business Practices That Boost Profits",
          "Remote Work Culture: Building Team Cohesion",
        ])
      } catch (error) {
        console.error("Failed to fetch trending topics", error)
      }
    }

    fetchTrendingTopics()
  }, [])

  const handleTopicClick = (topic: string) => {
    form.setValue("topic", topic)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      // Set preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const onSubmit = async (data: FormData) => {
    if (!data.topic && !data.autoGenerate) {
      toast({
        title: "Error",
        description: "Please enter a topic or select auto-generate",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // const response = await axios.post(
      //   data.autoGenerate ? '/api/auto-generate' : '/api/generate',
      //   {
      //     topic: data.topic,
      //     tone: data.tone,
      //     wordCount: data.wordCount
      //   }
      // )

      // For demo purposes, simulate a response
      setTimeout(() => {
        const topic = data.autoGenerate ? trendingTopics[Math.floor(Math.random() * trendingTopics.length)] : data.topic

        setGeneratedContent({
          title: `${topic}: A Comprehensive Guide`,
          body: `<h2>Introduction</h2>
          <p>In today's rapidly evolving digital landscape, ${topic?.toLowerCase()} has become increasingly important for businesses of all sizes. This comprehensive guide explores the key aspects of ${topic?.toLowerCase()} and provides actionable insights for implementation.</p>
          
          <h2>Why ${topic} Matters</h2>
          <p>Understanding the significance of ${topic?.toLowerCase()} is crucial for staying competitive in the modern market. Research shows that companies embracing these strategies see a 37% increase in customer engagement and a 24% boost in conversion rates.</p>
          
          <h2>Key Strategies</h2>
          <ul>
            <li><strong>Strategy 1:</strong> Implement data-driven decision making</li>
            <li><strong>Strategy 2:</strong> Focus on user experience optimization</li>
            <li><strong>Strategy 3:</strong> Leverage automation for efficiency</li>
            <li><strong>Strategy 4:</strong> Adopt agile methodologies</li>
          </ul>
          
          <h2>Implementation Guide</h2>
          <p>Follow these steps to successfully implement ${topic?.toLowerCase()} in your organization:</p>
          <ol>
            <li>Conduct a thorough assessment of current practices</li>
            <li>Develop a strategic roadmap with clear milestones</li>
            <li>Allocate resources effectively</li>
            <li>Monitor progress and adjust as needed</li>
          </ol>
          
          <h2>Case Studies</h2>
          <p>Several leading companies have successfully implemented ${topic?.toLowerCase()} strategies with remarkable results:</p>
          
          <h3>Company A</h3>
          <p>After adopting these approaches, Company A experienced a 45% increase in productivity and a 30% reduction in operational costs.</p>
          
          <h3>Company B</h3>
          <p>By focusing on ${topic?.toLowerCase()}, Company B was able to expand their market reach by 60% within just 12 months.</p>
          
          <h2>Conclusion</h2>
          <p>As we've explored throughout this guide, ${topic?.toLowerCase()} represents a significant opportunity for business growth and innovation. By implementing the strategies outlined here, organizations can position themselves for success in an increasingly competitive landscape.</p>`,
          slug:
            topic
              ?.toLowerCase()
              .replace(/[^\w\s]/gi, "")
              .replace(/\s+/g, "-") || "comprehensive-guide",
        })

        setIsLoading(false)
      }, 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleSave = async (status: "draft" | "published") => {
    if (!generatedContent) return

    setIsLoading(true)
    try {
      // In a real app, this would be an API call
      // const formData = new FormData()
      // if (imageFile) formData.append("image", imageFile)
      // const imageResponse = await axios.post('/api/upload', formData)
      // const imageUrl = imageResponse.data.url

      // await axios.post('/api/posts', {
      //   title: generatedContent.title,
      //   slug: generatedContent.slug,
      //   body: generatedContent.body,
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

  const copyToClipboard = () => {
    if (!generatedContent) return

    const textToCopy = `# ${generatedContent.title}\n\n${generatedContent.body.replace(/<[^>]*>/g, "")}`
    navigator.clipboard.writeText(textToCopy)

    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard",
    })
  }

  const downloadAsMarkdown = () => {
    if (!generatedContent) return

    const textToDownload = `# ${generatedContent.title}\n\n${generatedContent.body.replace(/<[^>]*>/g, "")}`
    const blob = new Blob([textToDownload], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${generatedContent.slug}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Content has been downloaded as Markdown",
    })
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Generate Blog with AI</h1>
        <p className="text-muted-foreground mt-1">Create SEO-optimized blog posts using artificial intelligence.</p>
      </div>

      {!generatedContent ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Generate Content</CardTitle>
                <CardDescription>Enter a topic or let AI choose a trending topic for you</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="autoGenerate"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Auto-generate with random trending topic</FormLabel>
                            <FormDescription>
                              Let AI choose a trending topic and generate content automatically
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Topic</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your topic (e.g., Benefits of Cloud Computing)"
                              {...field}
                              disabled={form.watch("autoGenerate")}
                            />
                          </FormControl>
                          <FormDescription>Be specific for better results</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tone</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select tone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="professional">Professional</SelectItem>
                                <SelectItem value="casual">Casual</SelectItem>
                                <SelectItem value="witty">Witty</SelectItem>
                                <SelectItem value="authoritative">Authoritative</SelectItem>
                                <SelectItem value="friendly">Friendly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="wordCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Word Count</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select word count" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="500">~500 words</SelectItem>
                                <SelectItem value="1000">~1000 words</SelectItem>
                                <SelectItem value="1500">~1500 words</SelectItem>
                                <SelectItem value="2000">~2000 words</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Blog Post
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>Click on a topic to use it for generation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {trendingTopics.map((topic, index) => (
                    <li key={index}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left h-auto py-2"
                        onClick={() => handleTopicClick(topic)}
                      >
                        <span className="mr-2 text-primary">#</span>
                        {topic}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Generated Content</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadAsMarkdown}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Title</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    value={generatedContent.title}
                    onChange={(e) => setGeneratedContent({ ...generatedContent, title: e.target.value })}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <Input type="file" accept="image/*" onChange={handleImageChange} />
                  {imagePreview && (
                    <div className="mt-4 relative w-full h-48 rounded-md overflow-hidden">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => setImagePreview(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <TinyMCEEditor
                    value={generatedContent.body}
                    onChange={(content) => setGeneratedContent({ ...generatedContent, body: content })}
                  />
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => handleSave("draft")} disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button onClick={() => handleSave("published")} disabled={isLoading}>
                  <Send className="mr-2 h-4 w-4" />
                  Publish
                </Button>
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>SEO Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-medium">Keyword density: 2.3%</p>
                        <p className="text-sm text-muted-foreground">Good keyword density (2-3% is ideal)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-medium">Headings structure</p>
                        <p className="text-sm text-muted-foreground">Good use of H2 and H3 headings</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs mt-0.5">
                        !
                      </div>
                      <div>
                        <p className="font-medium">Meta description</p>
                        <p className="text-sm text-muted-foreground">Add a meta description (150-160 characters)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xs mt-0.5">
                        !
                      </div>
                      <div>
                        <p className="font-medium">Internal links</p>
                        <p className="text-sm text-muted-foreground">Consider adding 2-3 internal links</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs mt-0.5">
                        ✓
                      </div>
                      <div>
                        <p className="font-medium">Content length: ~1,200 words</p>
                        <p className="text-sm text-muted-foreground">Good length for SEO (1,000+ words)</p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

