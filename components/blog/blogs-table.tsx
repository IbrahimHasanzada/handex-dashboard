"use client"
import Image from "next/image"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, Plus, Loader2, Package, ChevronLeft, ChevronRight, Pin, PinOff } from "lucide-react"
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
import { useDeleteBlogsMutation, useGetBlogsQuery, usePinBlogsMutation, useUnpinBlogsMutation } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export function BlogsTable() {
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")
    const [currentPage, setCurrentPage] = useState<number>(0)
    const { data: blogs, refetch, isLoading: newsLoading } = useGetBlogsQuery({ lang: currentLanguage, page: currentPage }, { skip: !currentLanguage });
    const [deleteBlogs, { isLoading: delLoading }] = useDeleteBlogsMutation()
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
    const [pinBlog] = usePinBlogsMutation()
    const [unpinBlog] = useUnpinBlogsMutation()
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handledeleteBlogs = (id: number) => {
        try {
            showDeleteConfirmation(deleteBlogs, id, refetch, {
                title: "Bloqu silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Bloq uğurla silindi.",
            })
        } catch (error) {
            toast.error('Bloq silərkən xəta baş verdi!')
        }
    }

    const handlePinBlog = async (id: number) => {
        try {
            await pinBlog(id).unwrap()
            toast.success("Bloq uğurla pinləndi")
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }
    const handleUnPin = async (id: number) => {
        try {
            await unpinBlog(id).unwrap()
            toast.success("Bloq uğurla pindən silindi")
        } catch (error: any) {
            toast.error(error.data.message)
        }
    }
    return (
        <div className="rounded-md border">
            <div className="flex md:items-center justify-between  p-4">
                <div className="flex flex-1 items-center space-x-2">
                    <h2 className="text-xl font-semibold">Bloqlar</h2>
                    <Badge>{blogs?.totalItems}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Tabs value={currentLanguage} onValueChange={(language: string) => setCurrentLanguage(language)} className="mr-4">
                        <TabsList>
                            <TabsTrigger value="az">AZ</TabsTrigger>
                            <TabsTrigger value="en">EN</TabsTrigger>
                            <TabsTrigger value="ru">RU</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Link href='/blog/new'>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni bloq yarat
                        </Button>
                    </Link>
                </div>
            </div>

            {newsLoading ?
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                :
                blogs?.data.length == 0 ?
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
                            {
                                blogs?.data.length == 0 ?
                                    <div>Bloq tapılmadı</div>
                                    :
                                    blogs?.data.map((blog: any) => (
                                        <TableRow key={blog.id} >
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <div className="relative h-10 w-10 overflow-hidden rounded">
                                                        <Image
                                                            src={blog.image.url || "/placeholder.svg"}
                                                            alt={blog.id}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">
                                                            {(blog.title ?? "").length > (windowWidth < 768 ? 20 : 50)
                                                                ? `${blog.title.slice(0, (windowWidth < 768 ? 20 : 50))}...`
                                                                : (blog.title ?? "")}
                                                        </div>

                                                    </div>
                                                    <span>
                                                        {blog.order == 2 ? <div className="flex items-center text-gray-400"><Pin className="w-4 h-4" /> pinned</div> : ''}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:block py-7"> {format(new Date(blog.createdAt), "PPP")}</TableCell>
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
                                                        <Link className="flex item-center" href={`/blog/${blog.slug}/view`}>
                                                            <DropdownMenuItem className="w-full cursor-pointer">
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                <span>View</span>
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        <Link className="flex item-center w-full" href={`/blog/${blog.slug}/edit`}>
                                                            <DropdownMenuItem className="w-full cursor-pointer">
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                <span>Edit</span>
                                                            </DropdownMenuItem>
                                                        </Link>
                                                        {blog.order === 1
                                                            ? <DropdownMenuItem className="w-full cursor-pointer">
                                                                <button onClick={() => handlePinBlog(blog.id)} className="flex items-center gap-2">
                                                                    <Pin className="mr-2 h-4 w-4" />
                                                                    <span>Pin</span>
                                                                </button>
                                                            </DropdownMenuItem>
                                                            :
                                                            <DropdownMenuItem className="w-full cursor-pointer">
                                                                <button onClick={() => handleUnPin(blog.id)} className="flex items-center gap-2">
                                                                    <PinOff className="mr-2 h-4 w-4" />
                                                                    <span>Unpin</span>
                                                                </button>
                                                            </DropdownMenuItem>}
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem onClick={() => handledeleteBlogs(blog.id)} className="text-destructive">
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
                    Səhifə {currentPage + 1} / {blogs?.totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage + 1 === blogs?.totalPages}
                >
                    Növbəti <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </div>
        </div >
    )
}
