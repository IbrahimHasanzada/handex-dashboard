"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CalendarIcon, ImageIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    content: z.string().min(10, {
        message: "Content must be at least 10 characters.",
    }),
    excerpt: z.string().min(10, {
        message: "Excerpt must be at least 10 characters.",
    }),
    category: z.string({
        required_error: "Please select a category.",
    }),
    status: z.string({
        required_error: "Please select a status.",
    }),
    publishDate: z.date().optional(),
    featuredImage: z.string().optional(),
    isFeatured: z.boolean().default(false),
})

export function NewsForm({ id }: { id?: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Default values for the form
    const defaultValues = id
        ? {
            title: "ABB və Handex arasında yeni əməkdaşlıq",
            content:
                "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması imzalanıb. Bu əməkdaşlıq çərçivəsində...",
            excerpt: "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması...",
            category: "finance",
            status: "published",
            publishDate: new Date(),
            featuredImage: "/placeholder.svg",
            isFeatured: true,
        }
        : {
            title: "",
            content: "",
            excerpt: "",
            category: "",
            status: "draft",
            publishDate: new Date(),
            featuredImage: "",
            isFeatured: false,
        }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues,
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            console.log(values)
            setIsSubmitting(false)
        }, 1000)
    }

    return (
        <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <TabsContent value="content" className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Article title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Content</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Write your article content here..."
                                                    className="min-h-[300px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="excerpt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Excerpt</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="A short summary of your article..."
                                                    className="min-h-[100px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>This will be displayed on the article list page.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="media" className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="featuredImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Featured Image</FormLabel>
                                            <FormControl>
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                                                        {field.value ? (
                                                            <img
                                                                src={field.value || "/placeholder.svg"}
                                                                alt="Featured image"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        <Button type="button" variant="outline">
                                                            Select Image
                                                        </Button>
                                                        {field.value && (
                                                            <Button type="button" variant="outline" className="text-destructive">
                                                                Remove Image
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                This image will be displayed at the top of your article and in article lists.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                            <TabsContent value="settings" className="space-y-6">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="finance">Finance</SelectItem>
                                                        <SelectItem value="business">Business</SelectItem>
                                                        <SelectItem value="technology">Technology</SelectItem>
                                                        <SelectItem value="economy">Economy</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a status" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Published</SelectItem>
                                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="publishDate"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Publish Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={`w-full justify-start text-left font-normal ${!field.value && "text-muted-foreground"
                                                                }`}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                            <FormDescription>The date when the article will be published.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isFeatured"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>Featured Article</FormLabel>
                                                <FormDescription>
                                                    This article will be displayed in the featured section on the homepage.
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        </div>
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Article Settings</CardTitle>
                                    <CardDescription>Configure your article settings and publish options.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium">Status</div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`h-2 w-2 rounded-full ${form.watch("status") === "published"
                                                    ? "bg-green-500"
                                                    : form.watch("status") === "draft"
                                                        ? "bg-yellow-500"
                                                        : "bg-blue-500"
                                                    }`}
                                            />
                                            <span className="text-sm capitalize">{form.watch("status")}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium">Category</div>
                                        <div className="text-sm capitalize">{form.watch("category") || "Not selected"}</div>
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-medium">Publish Date</div>
                                        <div className="text-sm">
                                            {form.watch("publishDate") ? format(form.watch("publishDate"), "PPP") : "Not scheduled"}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col gap-2">
                                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {id ? "Update Article" : "Create Article"}
                                    </Button>
                                    <Button type="button" variant="outline" className="w-full">
                                        Preview
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </form>
            </Form>
        </Tabs>
    )
}
