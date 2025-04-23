"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Clock, Edit, Eye, Share2, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ViewArticleProps } from "@/types/news/news-view.dto"



export function ViewNews({ id, onEdit, onDelete }: ViewArticleProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const article = {
        id,
        title: "ABB və Handex arasında yeni əməkdaşlıq",
        content: `
      <p>Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması imzalanıb. Bu əməkdaşlıq çərçivəsində tərəflər maliyyə texnologiyaları sahəsində birgə layihələr həyata keçirəcəklər.</p>
      
      <p>Razılaşmaya əsasən, ABB və Handex müştərilərə daha rahat və təhlükəsiz ödəniş həlləri təqdim etmək üçün innovativ texnologiyalar tətbiq edəcəklər. Bu əməkdaşlıq həm də rəqəmsal bankçılıq xidmətlərinin inkişafına töhfə verəcək.</p>
      
      <p>ABB-nin İdarə Heyətinin sədri bildirdi ki, bu əməkdaşlıq bankın rəqəmsal transformasiya strategiyasının mühüm bir hissəsidir. "Biz müştərilərimizə ən yüksək keyfiyyətli xidmətlər təqdim etmək üçün daim innovativ həllər axtarırıq. Handex ilə əməkdaşlığımız bizə bu istiqamətdə yeni imkanlar yaradacaq", - deyə o qeyd edib.</p>
    `,
        excerpt: "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması...",
        date: "2024-01-14T10:00:00.000Z",
        publishedDate: "2024-01-14T12:30:00.000Z",
        updatedDate: "2024-01-15T09:15:00.000Z",
        author: "Admin User",
        category: "Finance",
        tags: ["banking", "fintech", "partnership"],
        status: "published",
        image: "/placeholder.svg",
        readTime: 4,
        views: 1245,
        likes: 32,
        comments: 8,
        shares: 15,
        slug: "abb-ve-handex-arasinda-yeni-emekdasliq",
    }

    const handleDelete = () => {
        setIsDeleting(true)

        setTimeout(() => {
            setIsDeleting(false)
            if (onDelete) onDelete()
        }, 1000)
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/news">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Xəbərlərə qayıt
                    </Link>
                </Button>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/articles/${article.slug}`} target="_blank">
                            <Eye className="mr-2 h-4 w-4" />
                            View Live
                        </Link>
                    </Button>

                    <Button variant="outline" size="sm" onClick={onEdit}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the article and remove it from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                                    {isDeleting ? "Deleting..." : "Delete"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
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
                                <Badge variant={article.status === "published" ? "default" : "outline"}>{article.status}</Badge>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(article.date), "PPP")}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {article.readTime} min read
                                </span>
                            </div>

                            <h1 className="mt-2 text-3xl font-bold">{article.title}</h1>
                            <p className="mt-2 text-lg text-muted-foreground">{article.excerpt}</p>
                        </div>

                        <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
                            <Image src={article.image || "/placeholder.svg"} alt={article.title} fill className="object-cover" />
                        </div>

                        <div className="prose max-w-none dark:prose-invert">
                            <div dangerouslySetInnerHTML={{ __html: article.content }} />
                        </div>

                        <div className="mt-6 flex flex-wrap gap-2">
                            {article.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="metadata" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Article Metadata</CardTitle>
                            <CardDescription>Detailed information about this article</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">ID</h3>
                                    <p className="text-sm">{article.id}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Slug</h3>
                                    <p className="text-sm">{article.slug}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                                    <p className="text-sm capitalize">{article.status}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Category</h3>
                                    <p className="text-sm">{article.category}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Author</h3>
                                    <p className="text-sm">{article.author}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Created Date</h3>
                                    <p className="text-sm">{format(new Date(article.date), "PPP 'at' p")}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Published Date</h3>
                                    <p className="text-sm">{format(new Date(article.publishedDate), "PPP 'at' p")}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                                    <p className="text-sm">{format(new Date(article.updatedDate), "PPP 'at' p")}</p>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-sm font-medium text-muted-foreground">Tags</h3>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {article.tags.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={onEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Metadata
                            </Button>
                            <Button variant="outline" size="sm">
                                <Share2 className="mr-2 h-4 w-4" />
                                Share Article
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
