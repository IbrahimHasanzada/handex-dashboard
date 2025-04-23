"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter, Plus, Search, SlidersHorizontal } from "lucide-react"

export function NewsTableFilters() {
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search articles..." className="pl-8" />
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>Published</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem>Scheduled</DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Filter by category</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem checked>Finance</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Business</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked>Technology</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Select defaultValue="newest">
                <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="popular">Most views</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="h-9 w-9">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Advanced filters</span>
            </Button>
            <Button size="sm" className="h-9 gap-1">
                <Plus className="h-4 w-4" />
                <span>New Article</span>
            </Button>
        </div>
    )
}
