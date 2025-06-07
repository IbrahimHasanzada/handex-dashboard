"use client"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Edit, Loader2, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useDeleteServiceMutation, useGetServiceBySlugQuery, useGetServiceQuery } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { ViewArticleProps } from "@/types/news/news-view.dto"
import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"



export function ViewService({ slug, onEdit, onDelete }: ViewArticleProps) {
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")
    const { data: service, isLoading: serviceLoading, isError, error, refetch: refetchServiceById } = useGetServiceBySlugQuery({ slug: slug, language: currentLanguage }, { pollingInterval: 0, refetchOnMountOrArgChange: true, skip: !slug })
    const { refetch: refetchService } = useGetServiceQuery('')
    const [deleteService, { isSuccess, isLoading }] = useDeleteServiceMutation()
    const router = useRouter()
    const handleDelete = () => {
        try {
            showDeleteConfirmation(deleteService, service.id, async () => {
                await refetchService()
                router.push('/services')
            }, {
                title: "Xidməti silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Xidmət uğurla silindi.",
            })
        } catch (error) {
            toast.error('Xidməti silərkən xəta baş verdi!')
        }
    }
    return (
        <div>
            {serviceLoading ? (
                <div className="flex items-center justify-center p-10">
                    <Loader2 className="animate-spin h-10 w-10" />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-start md:items-center gap-5 justify-between flex-col md:flex-row mt-5">
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/services">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Xidmətlərə qayıt
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

                                    <h1 className="mt-2 text-3xl font-bold">{service?.title}</h1>
                                </div>

                                <div className="relative mb-6 aspect-video w-full overflow-hidden rounded-lg">
                                    <Image
                                        src={service?.image?.url || "/placeholder.svg"}
                                        alt={service?.title || "News image"}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                <div className="prose max-w-none dark:prose-invert">
                                    <div dangerouslySetInnerHTML={{ __html: service?.description || "" }} />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="metadata" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Xitmətlər Metadata</CardTitle>
                                </CardHeader>
                                <CardFooter className="flex justify-between">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Description</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {service?.meta?.map((item: any) => (
                                                <TableRow key={item.id}>
                                                    <TableCell className="font-medium">{item.name}</TableCell>
                                                    <TableCell>{item.value}</TableCell>
                                                    {/* <TableCell className="flex justify-end"> <Button onClick={() => handleDeleteMeta(item.id)}><Trash /></Button></TableCell> */}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
}
