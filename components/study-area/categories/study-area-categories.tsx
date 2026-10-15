"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { FolderTree, GripVertical, HelpCircle, Loader2, RotateCcw, Save, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    useDeleteStudyAreaCategoryMutation,
    useGetStudyAreaCategoriesQuery,
    useGetStudyAreaQuery,
    useUpdateStudyAreaCategoryOrdersMutation,
} from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { MODEL_TYPES } from "../course-list"
import { CategoryDialog } from "./category-dialog"

export function StudyAreaCategories() {
    const model = useSelector((store: any) => store.model.model)
    const modelLabel = MODEL_TYPES.find((type) => type.value === model)?.label

    const { data: categories, isLoading, refetch } = useGetStudyAreaCategoriesQuery({ model })
    const { data: studyAreas } = useGetStudyAreaQuery({ lang: "az", model })
    const [deleteCategory] = useDeleteStudyAreaCategoryMutation()
    const [updateOrders, { isLoading: isSavingOrder }] = useUpdateStudyAreaCategoryOrdersMutation()

    const [items, setItems] = useState<any[]>([])
    const [hasChanges, setHasChanges] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    useEffect(() => {
        if (Array.isArray(categories)) {
            setItems(categories)
            setHasChanges(false)
        }
    }, [categories])

    const areas = Array.isArray(studyAreas) ? studyAreas : []
    const groupedIds = new Set(items.flatMap((item) => item.studyAreas?.map((area: any) => area.id) || []))
    const ungroupedCount = areas.filter((area: any) => !groupedIds.has(area.id)).length

    const handleDelete = (id: number) => {
        showDeleteConfirmation(deleteCategory, id, refetch, {
            title: "Qrupu silmək istəyirsinizmi?",
            text: "Tədris sahələri silinməyəcək, sadəcə qrupsuz qalacaq.",
            successText: "Qrup silindi.",
        })
    }

    const resetDrag = () => {
        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === dropIndex) return resetDrag()

        const next = [...items]
        const [moved] = next.splice(draggedIndex, 1)
        next.splice(dropIndex, 0, moved)

        setItems(next)
        setHasChanges(true)
        resetDrag()
    }

    const handleSaveOrder = async () => {
        try {
            await updateOrders({ items: items.map((item, index) => ({ id: item.id, order: index + 1 })) }).unwrap()
            toast.success("Qrupların sırası yeniləndi")
        } catch (error) {
            toast.error("Sıranı yeniləyərkən xəta baş verdi")
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <CardTitle>Tədris sahəsi qrupları — {modelLabel}</CardTitle>
                    <CardDescription>
                        Saytda tədris sahələri bu qruplar üzrə tab-larla göstərilir. Qrup yoxdursa, əvvəlki kimi düz siyahı görünür.
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    {hasChanges && (
                        <>
                            <Button variant="outline" onClick={() => setItems(categories || [])} disabled={isSavingOrder}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Ləğv et
                            </Button>
                            <Button onClick={handleSaveOrder} disabled={isSavingOrder}>
                                {isSavingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Sıranı saxla
                            </Button>
                        </>
                    )}
                    <CategoryDialog model={model} studyAreas={areas} categories={items} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : items.length ? (
                    <div className="space-y-3">
                        {items.map((item, index) => {
                            const isDragging = draggedIndex === index
                            const isDragOver = dragOverIndex === index && draggedIndex !== index
                            return (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => {
                                        setDraggedIndex(index)
                                        e.dataTransfer.effectAllowed = "move"
                                        e.dataTransfer.setData("text/html", "")
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault()
                                        setDragOverIndex(index)
                                    }}
                                    onDragLeave={() => setDragOverIndex(null)}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragEnd={resetDrag}
                                    className={`flex items-start gap-3 rounded-lg border p-4 cursor-move transition-all duration-200 ${
                                        isDragging
                                            ? "opacity-50 scale-[0.98] shadow-lg"
                                            : isDragOver
                                                ? "border-primary border-2 bg-primary/5"
                                                : "hover:shadow-md"
                                    }`}
                                >
                                    <GripVertical className="h-5 w-5 mt-0.5 text-muted-foreground shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-xs text-muted-foreground">{item.studyAreas?.length || 0} tədris sahəsi</span>
                                        </div>
                                        <div className="mt-2 flex flex-wrap gap-1.5">
                                            {item.studyAreas?.length ? (
                                                item.studyAreas.map((area: any) => (
                                                    <Badge key={area.id} variant="secondary" className="font-normal">
                                                        {area.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-xs text-muted-foreground">
                                                    Boş qrup saytda göstərilmir. Redaktə edib tədris sahəsi əlavə edin.
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                        <CategoryDialog model={model} studyAreas={areas} categories={items} category={item} />
                                        <Button onClick={() => handleDelete(item.id)} size="icon" className="h-7 w-7">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                        <FolderTree className="h-10 w-10 text-muted-foreground" />
                        <p className="font-medium">Hələ qrup yoxdur</p>
                        <p className="text-sm text-muted-foreground max-w-md">
                            Saytda tədris sahələri hazırda düz siyahı şəklində görünür. Onları tab-lara bölmək üçün qrup yaradın.
                        </p>
                    </div>
                )}

                {items.length > 0 && (
                    <Alert>
                        <HelpCircle className="h-4 w-4" />
                        <AlertDescription>
                            Qrupların saytdakı sırasını dəyişmək üçün onları sürükləyib buraxın, sonra "Sıranı saxla" düyməsini basın.
                            {ungroupedCount > 0 && ` Qrupa daxil olmayan ${ungroupedCount} tədris sahəsi saytda "Digər" tab-ında göstəriləcək.`}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}
