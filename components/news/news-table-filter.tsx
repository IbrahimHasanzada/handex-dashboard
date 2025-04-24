"use client"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

export function NewsTableFilters() {
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Xəbər axtar..." className="pl-8" />
            </div>
            <Select defaultValue="newest">
                <SelectTrigger className="h-9 w-[130px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="newest">Ən yeni</SelectItem>
                    <SelectItem value="oldest">Ən köhnə</SelectItem>
                    <SelectItem value="title-asc">Sırala (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Sırala (Z-A)</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}
