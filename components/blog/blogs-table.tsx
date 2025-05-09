"use client"
import Image from "next/image"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, Plus, Loader2 } from "lucide-react"
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
import { useDeleteBlogsMutation, useGetBlogsQuery } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export function BlogsTable() {
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")
    const { data: blogs, refetch, isLoading: newsLoading } = useGetBlogsQuery(currentLanguage, { skip: !currentLanguage });
    const [deleteBlogs, { isLoading: delLoading }] = useDeleteBlogsMutation()
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

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
    return (
        <div className="rounded-md border">
            <div className="flex md:items-center justify-between  p-4">
                <div className="flex flex-1 items-center space-x-2">
                    <h2 className="text-xl font-semibold">Bloqlar</h2>
                    <Badge>{blogs?.data.length}</Badge>
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
        </div >
    )
}
