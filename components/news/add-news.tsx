"use client"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ImageIcon, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardFooter } from "../ui/card"
import { Editor } from '@tinymce/tinymce-react';
import { formSchemaNews } from "@/validations/news.validation"

export function NewsForm({ id }: { id?: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const apiKey = process.env.NEXT_PUBLIC_EDITOR_API_KEY;
    console.log(apiKey)
    const defaultValues = id
        ? {
            title: "ABB və Handex arasında yeni əməkdaşlıq",
            content:
                "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması imzalanıb. Bu əməkdaşlıq çərçivəsində...",
            category: "finance",
            featuredImage: "/placeholder.svg",
        }
        : {
            title: "",
            content: "",
            featuredImage: "",
        }

    const form = useForm<z.infer<typeof formSchemaNews>>({
        resolver: zodResolver(formSchemaNews),
        defaultValues,
    })

    function onSubmit(values: z.infer<typeof formSchemaNews>) {
        setIsSubmitting(true)

        setTimeout(() => {
            console.log(values)
            setIsSubmitting(false)
        }, 1000)
    }

    return (
        <Tabs defaultValue="content" className="w-full pt-6">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="md:col-span-3">
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
                                <Editor
                                    apiKey={apiKey}
                                    init={{
                                        plugins: [
                                            // Core editing features
                                            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                                            // Your account includes a free trial of TinyMCE premium features
                                            // Try the most popular premium features until May 8, 2025:
                                            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown', 'importword', 'exportword', 'exportpdf'
                                        ],
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                        tinycomments_mode: 'embedded',
                                        tinycomments_author: 'Author name',
                                        mergetags_list: [
                                            { value: 'First.Name', title: 'First Name' },
                                            { value: 'Email', title: 'Email' },
                                        ],
                                        ai_request: (request: any, respondWith: any) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                                    }}
                                    initialValue="Mətn əlavə edin..."
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
                        </div>
                    </div>
                    <CardFooter className="flex flex-col gap-2">
                        <Button
                            disabled={isSubmitting}
                            type="button"
                            variant="outline"
                            className="w-full">
                            {isSubmitting ?
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                :
                                <div className="flex items-center">
                                    <Save className="mr-2 h-4 w-4" />
                                    Save & Preview
                                </div>
                            }
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Tabs>
    )
}
