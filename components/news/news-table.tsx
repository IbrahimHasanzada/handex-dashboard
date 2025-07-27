"use client"
import Image from "next/image"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, Plus, Loader2, Package, ChevronRight, ChevronLeft, Pin, MapPinned, PinOff } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useDeleteNewsMutation, useGetNewsQuery, usePinNewsMutation, useUnpinNewsMutation } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export function ArticlesTable() {
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")
    const [currentPage, setCurrentPage] = useState<number>(0)
    const { data: news, refetch, isLoading: newsLoading } = useGetNewsQuery({ lang: currentLanguage, page: currentPage }, { skip: !currentLanguage });
    const [deleteNews, { isLoading: delLoading }] = useDeleteNewsMutation()
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0)
    const [pinNews] = usePinNewsMutation()
    const [unpinNews] = useUnpinNewsMutation()
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handleDeleteNews = (id: number) => {
        try {
            showDeleteConfirmation(deleteNews, id, refetch, {
                title: "Xəbəri silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Xəbər uğurla silindi.",
            })
        } catch (error) {
            toast.error('Xəbər silərkən xəta baş verdi!')
        }
    }

    const handlePinNews = async (id: number) => {
        try {
            await pinNews(id).unwrap()
            toast.success("Xəbər uğurla pinləndi")
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }

    const handleUnPin = async (id: number) => {
        try {
            await unpinNews(id).unwrap()
            toast.success("Xəbər uğurla pindən silindi")
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }

    return (
        <div className="rounded-md border">
            <div className="flex md:items-center justify-between  p-4">
                <div className="flex flex-1 items-center space-x-2">
                    <h2 className="text-xl font-semibold">Xəbərlər</h2>
                    <Badge>{news?.totalItems}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Tabs value={currentLanguage} onValueChange={(language: string) => setCurrentLanguage(language)} className="mr-4">
                        <TabsList>
                            <TabsTrigger value="az">AZ</TabsTrigger>
                            <TabsTrigger value="en">EN</TabsTrigger>
                            <TabsTrigger value="ru">RU</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Link href='/news/new'>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            New Article
                        </Button>
                    </Link>
                </div>
            </div>

            {newsLoading ?
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                :

                news?.data.length == 0 ?
                    <div className="flex flex-col items-center gap-5 justify-center w-full p-5">
                        <Package className="w-10 h-10 md:w-20 md:h-20" />
                        <span className="text-xl">Xəbər tapılmadı</span>
                    </div>
                    :
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Article</TableHead>
                                <TableHead>
                                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                                        Date
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead className="w-[80px]  hidden md:block">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {news?.data.map((article: any) => (
                                <TableRow key={article.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded">
                                                <Image
                                                    src={article.image.url || "/placeholder.svg"}
                                                    alt={article.id}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {(article.title ?? "").length > (windowWidth < 768 ? 20 : 50)
                                                        ? `${article.title.slice(0, (windowWidth < 768 ? 20 : 50))}...`
                                                        : (article.title ?? "")}
                                                </div>

                                            </div>
                                            <span>
                                                {article.order == 2 ? <div className="flex items-center text-gray-400"><Pin className="w-4 h-4" /> pinned</div> : ''}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:block py-7"> {format(new Date(article.createdAt), "PPP")}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <Link className="flex item-center" href={`/news/${article.slug}/view`}>
                                                    <DropdownMenuItem className="w-full cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>View</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link className="flex item-center w-full" href={`/news/${article.slug}/edit`}>
                                                    <DropdownMenuItem className="w-full cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                {article.order === 1 ?
                                                    <DropdownMenuItem className="w-full cursor-pointer">
                                                        <button onClick={() => handlePinNews(article.id)} className="flex items-center gap-2">
                                                            <Pin className="mr-2 h-4 w-4" />
                                                            <span>Pin</span>
                                                        </button>
                                                    </DropdownMenuItem>
                                                    :
                                                    <DropdownMenuItem className="w-full cursor-pointer">
                                                        <button onClick={() => handleUnPin(article.id)} className="flex items-center gap-2">
                                                            <PinOff className="mr-2 h-4 w-4" />
                                                            <span>Unpin</span>
                                                        </button>
                                                    </DropdownMenuItem>
                                                }
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handleDeleteNews(article.id)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table >
            }
            <div className="flex justify-between w-full p-3">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage === 0 ? currentPage : currentPage - 1)}
                    disabled={currentPage === 0}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Əvvəlki
                </Button>
                <div className="text-sm">
                    Səhifə {currentPage + 1} / {news?.totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage + 1 === news?.totalPages}
                >
                    Növbəti <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div >
    )
}
