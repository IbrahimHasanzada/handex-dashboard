"use client"

import { useState } from "react"
import Image from "next/image"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, ChevronDown, Plus } from "lucide-react"

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
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export function ArticlesTable() {
    const [articles] = useState([
        {
            id: "1",
            title: "ABB və Handex arasında yeni əməkdaşlıq",
            excerpt: "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması...",
            date: "14 yanvar 2024",
            status: "published",
            views: 1245,
            image: "/placeholder.svg",
            category: "Finance",
            author: "Admin User",
        },
        {
            id: "2",
            title: "ABB və Handex arasında yeni əməkdaşlıq",
            excerpt: "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması...",
            date: "14 yanvar 2024",
            status: "draft",
            views: 0,
            image: "/placeholder.svg",
            category: "Business",
            author: "Editor User",
        },
        {
            id: "3",
            title: "ABB və Handex arasında yeni əməkdaşlıq",
            excerpt: "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması...",
            date: "14 yanvar 2024",
            status: "published",
            views: 876,
            image: "/placeholder.svg",
            category: "Finance",
            author: "Admin User",
        },
        {
            id: "4",
            title: "ABB və Handex arasında yeni əməkdaşlıq",
            excerpt: "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması...",
            date: "14 yanvar 2024",
            status: "scheduled",
            views: 0,
            image: "/placeholder.svg",
            category: "Technology",
            author: "Content Writer",
        },
        {
            id: "5",
            title: "ABB və Handex arasında yeni əməkdaşlıq",
            excerpt: "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması...",
            date: "14 yanvar 2024",
            status: "published",
            views: 543,
            image: "/placeholder.svg",
            category: "Finance",
            author: "Admin User",
        },
        {
            id: "6",
            title: "ABB və Handex arasında yeni əməkdaşlıq",
            excerpt: "Azərbaycan Beynəlxalq Bankı (ABB) və Handex arasında yeni əməkdaşlıq razılaşması...",
            date: "14 yanvar 2024",
            status: "draft",
            views: 0,
            image: "/placeholder.svg",
            category: "Business",
            author: "Editor User",
        },
    ])

    return (
        <div className="rounded-md border">
            <div className="flex items-center justify-between p-4">
                <div className="flex flex-1 items-center space-x-2">
                    <h2 className="text-xl font-semibold">Articles</h2>
                    <Badge>{articles.length}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Article
                    </Button>
                </div>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox />
                        </TableHead>
                        <TableHead>Article</TableHead>
                        <TableHead>
                            <Button variant="ghost" className="p-0 hover:bg-transparent">
                                Status
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" className="p-0 hover:bg-transparent">
                                Category
                                <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" className="p-0 hover:bg-transparent">
                                Date
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead>
                            <Button variant="ghost" className="p-0 hover:bg-transparent">
                                Views
                                <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                        </TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {articles.map((article) => (
                        <TableRow key={article.id}>
                            <TableCell>
                                <Checkbox />
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center space-x-3">
                                    <div className="relative h-10 w-10 overflow-hidden rounded">
                                        <Image
                                            src={article.image || "/placeholder.svg"}
                                            alt={article.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div>
                                        <div className="font-medium">{article.title}</div>
                                        <div className="text-sm text-muted-foreground">By {article.author}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        article.status === "published" ? "default" : article.status === "draft" ? "outline" : "secondary"
                                    }
                                >
                                    {article.status}
                                </Badge>
                            </TableCell>
                            <TableCell>{article.category}</TableCell>
                            <TableCell>{article.date}</TableCell>
                            <TableCell>{article.views}</TableCell>
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
                                        <DropdownMenuItem >
                                            <Link className="flex item-center" href={`/news/${article.id}/view`}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                <span>View</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem >
                                            <Link className="flex item-center" href={`/news/${article.id}/edit`}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                <span>Edit</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
