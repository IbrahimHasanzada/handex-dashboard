"use client"

import { useEffect, useMemo, useState } from "react"
import { Loader2, Pen, Plus, Search } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddStudyAreaCategoryMutation, useUpdateStudyAreaCategoryMutation } from "@/store/handexApi"

interface CategoryDialogProps {
    model: string
    studyAreas: any[]
    categories: any[]
    category?: any
}

export function CategoryDialog({ model, studyAreas, categories, category }: CategoryDialogProps) {
    const [open, setOpen] = useState(false)
    const [name, setName] = useState("")
    const [selected, setSelected] = useState<number[]>([])
    const [search, setSearch] = useState("")

    const [addCategory, { isLoading: isAdding }] = useAddStudyAreaCategoryMutation()
    const [updateCategory, { isLoading: isUpdating }] = useUpdateStudyAreaCategoryMutation()
    const isEditing = !!category
    const isLoading = isAdding || isUpdating

    useEffect(() => {
        if (!open) return
        setName(category?.name || "")
        setSelected(category?.studyAreas?.map((item: any) => item.id) || [])
        setSearch("")
    }, [open, category])

    // Which other group each study area currently sits in, so moving it is a visible, deliberate choice.
    const otherGroupOf = useMemo(() => {
        const map = new Map<number, string>()
        categories.forEach((item: any) => {
            if (item.id === category?.id) return
            item.studyAreas?.forEach((area: any) => map.set(area.id, item.name))
        })
        return map
    }, [categories, category])

    const filtered = studyAreas.filter((item: any) => item.name.toLowerCase().includes(search.trim().toLowerCase()))

    const toggle = (id: number) =>
        setSelected((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!name.trim()) return toast.error("Qrupun adını daxil edin")

        const params = { name: name.trim(), model, studyAreas: selected }

        try {
            if (isEditing) {
                await updateCategory({ id: category.id, params }).unwrap()
                toast.success("Qrup yeniləndi")
            } else {
                await addCategory(params).unwrap()
                toast.success("Qrup yaradıldı")
            }
            setOpen(false)
        } catch (error) {
            toast.error("Qrupu yadda saxlayarkən xəta baş verdi")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <Button variant="secondary" size="icon" className="h-7 w-7">
                        <Pen className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Yeni qrup
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Qrupu redaktə et" : "Yeni qrup"}</DialogTitle>
                    <DialogDescription>
                        Qrupa ad verin və ona aid tədris sahələrini seçin. Bir tədris sahəsi yalnız bir qrupda ola bilər.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="category-name">Qrupun adı</Label>
                        <Input
                            id="category-name"
                            placeholder="Məs: Microsoft"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label>Tədris sahələri</Label>
                            <span className="text-xs text-muted-foreground">{selected.length} seçilib</span>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Axtar..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <div className="max-h-72 overflow-y-auto rounded-md border divide-y">
                            {filtered.length ? (
                                filtered.map((item: any) => {
                                    const other = otherGroupOf.get(item.id)
                                    const checked = selected.includes(item.id)
                                    return (
                                        <label
                                            key={item.id}
                                            className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50"
                                        >
                                            <Checkbox checked={checked} onCheckedChange={() => toggle(item.id)} />
                                            <span className="flex-1 text-sm">{item.name}</span>
                                            {other && (
                                                <span className={`text-xs ${checked ? "text-amber-600" : "text-muted-foreground"}`}>
                                                    {checked ? `"${other}" qrupundan köçürüləcək` : other}
                                                </span>
                                            )}
                                        </label>
                                    )
                                })
                            ) : (
                                <p className="px-3 py-6 text-center text-sm text-muted-foreground">Tədris sahəsi tapılmadı</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Ləğv et
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditing ? "Yenilə" : "Yarat"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
