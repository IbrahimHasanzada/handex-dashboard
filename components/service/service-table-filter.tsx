"use client"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function ServiceTableFilters() {
    return (
        <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Xidmət axtar..." className="pl-8" />
        </div>
    )
}
