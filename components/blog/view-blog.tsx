"use client"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Edit, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useDeleteBlogsMutation, useGetBlogsBySlugQuery, useGetBlogsQuery } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { ViewArticleProps } from "@/types/news/news-view.dto"
import { useState } from "react"



export function ViewBlogs({ slug, onEdit, onDelete }: ViewArticleProps) {
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")
    const { data: blogs, isLoading: blogsLoading, isError, error, refetch: refetchBlogsById } = useGetBlogsBySlugQuery({ slug: slug, language: currentLanguage }, { pollingInterval: 0, refetchOnMountOrArgChange: true, skip: !slug })
    const { refetch: refetchBlogs } = useGetBlogsQuery('')
    const [deleteBlog, { isSuccess, isLoading }] = useDeleteBlogsMutation()
    console.log(blogs)
    const router = useRouter()
    const handleDelete = () => {
        try {
            showDeleteConfirmation(deleteBlog, blogs.id, async () => {
                await refetchBlogs()
                router.push('/blogs')
            }, {
                title: "Bloqu silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Bloq uğurla silindi.",
            })
        } catch (error) {
            toast.error('Bloqu silərkən xəta baş verdi!')
        }
    }
    return (
        <div>
            {blogsLoading ? (
                <div className="flex items-center justify-center p-10">
                    <Loader2 className="animate-spin h-10 w-10" />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-start md:items-center gap-5 justify-between flex-col md:flex-row mt-5">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/blog">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Bloqlara qayıt
                            </Link>
                        </Button>
                        <div className="flex items-center">
                            <Tabs value={currentLanguage} onValueChange={(language: string) => setCurrentLanguage(language)} className="mr-4">
                                <TabsList>
                                    <TabsTrigger value="az">AZ</TabsTrigger>
                                    <TabsTrigger value="en">EN</TabsTrigger>
                                    <TabsTrigger value="ru">RU</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={onEdit}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                </Button>
                                <Button onClick={handleDelete} variant="destructive" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>

                    <Tabs defaultValue="preview" className="w-full">
                        <TabsList>
                            <TabsTrigger value="preview">Preview</TabsTrigger>
                            <TabsTrigger value="metadata">Metadata</TabsTrigger>
                        </TabsList>

                        <TabsContent value="preview" className="space-y-6">
                            <div className="rounded-lg border p-6">
                                <div className="mb-6">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {/* {format(new Date(news.createdAt), "PPP")} */}
                                        </span>
                                    </div>

                                    <h1 className="mt-2 text-3xl font-bold">{blogs?.title}</h1>
                                </div>

                                <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
                                    <Image
                                        src={blogs?.image?.url || "/placeholder.svg"}
                                        alt={blogs?.title || "News image"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="prose max-w-none dark:prose-invert">
                                    <div dangerouslySetInnerHTML={{ __html: blogs?.description || "" }} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="metadata" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>News Metadata</CardTitle>
                                </CardHeader>
                                <CardFooter className="flex justify-between">
                                    <p>{blogs?.meta[0].translations[1].value}</p>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
}
