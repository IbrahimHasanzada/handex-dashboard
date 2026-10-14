"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteContentMutation, useGetContentQuery, useUpdateContentOrdersMutation } from "@/store/handexApi"
import { FileText, GripVertical, HelpCircle, Loader2, Package, RotateCcw, Save, Trash2 } from "lucide-react"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { AddReferenceLetter, isPdf } from "./add-reference-letter"

const SLUG = "reference-letters"

const ReferenceLetters = () => {
    const { data: az, refetch: refetchAz } = useGetContentQuery({ slug: SLUG, lang: "az" })
    const { data: en, refetch: refetchEn } = useGetContentQuery({ slug: SLUG, lang: "en" })
    const { data: ru, refetch: refetchRu } = useGetContentQuery({ slug: SLUG, lang: "ru" })
    const [deleteContent] = useDeleteContentMutation()
    const [updateContentOrders, { isLoading: isSavingOrder }] = useUpdateContentOrdersMutation()

    const [items, setItems] = useState<any[]>([])
    const [hasChanges, setHasChanges] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    useEffect(() => {
        if (Array.isArray(az)) {
            setItems(az)
            setHasChanges(false)
        }
    }, [az])

    const refetch = () => {
        refetchAz()
        refetchEn()
        refetchRu()
    }

    const titleById = (list: any[] | undefined, id: number) => list?.find((item: any) => item.id === id)?.title || ""

    const handleDelete = (id: number) => {
        showDeleteConfirmation(deleteContent, id, refetch, {
            title: "Referans məktubunu silmək istəyirsinizmi?",
            text: "Bu əməliyyat geri qaytarıla bilməz!",
            successText: "Referans məktubu uğurla silindi.",
        })
    }

    const resetDrag = () => {
        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/html", "")
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        setDragOverIndex(index)
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
            await updateContentOrders({ items: items.map((item, index) => ({ id: item.id, order: index + 1 })) }).unwrap()
            toast.success("Sıra uğurla yeniləndi")
            setHasChanges(false)
            refetch()
        } catch (error) {
            toast.error("Sıranı yeniləyərkən xəta baş verdi")
        }
    }

    const handleResetOrder = () => {
        if (Array.isArray(az)) setItems(az)
        setHasChanges(false)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div>
                    <CardTitle>Referans məktubları</CardTitle>
                    <CardDescription>
                        Korporativ səhifədəki "Referans məktublarımıza bax" modalında göstərilən şəkil və PDF-lər
                    </CardDescription>
                </div>
                <div className="flex gap-2">
                    {hasChanges && (
                        <>
                            <Button variant="outline" onClick={handleResetOrder} disabled={isSavingOrder}>
                                <RotateCcw className="mr-2 h-4 w-4" /> Ləğv et
                            </Button>
                            <Button onClick={handleSaveOrder} disabled={isSavingOrder}>
                                {isSavingOrder ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Sıranı saxla
                            </Button>
                        </>
                    )}
                    <AddReferenceLetter refetch={refetch} />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {items.map((item: any, index: number) => {
                            const file = item.images?.[0]
                            const isDragging = draggedIndex === index
                            const isDragOver = dragOverIndex === index && draggedIndex !== index

                            return (
                                <div
                                    key={item.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragLeave={() => setDragOverIndex(null)}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onDragEnd={resetDrag}
                                    className={`relative p-3 border rounded-lg flex flex-col gap-3 justify-between h-full cursor-move transition-all duration-200 ${
                                        isDragging
                                            ? "opacity-50 scale-95 shadow-lg"
                                            : isDragOver
                                                ? "border-primary border-2 bg-primary/5"
                                                : "hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                            {index + 1}
                                        </div>
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    </div>
                                    <a
                                        href={file?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        draggable={false}
                                        className="h-32 flex items-center justify-center bg-muted rounded-md overflow-hidden"
                                    >
                                        {isPdf(file?.url) ? (
                                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                                <FileText className="h-10 w-10" />
                                                <span className="text-xs">PDF</span>
                                            </div>
                                        ) : (
                                            <img
                                                src={file?.url}
                                                alt={file?.alt || item.title}
                                                draggable={false}
                                                className="h-full w-full object-contain"
                                            />
                                        )}
                                    </a>
                                    <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                                    <div className="w-full flex justify-end gap-1">
                                        <AddReferenceLetter
                                            refetch={refetch}
                                            editItem={{
                                                id: item.id,
                                                fileId: file?.id,
                                                url: file?.url,
                                                titles: {
                                                    az: item.title || "",
                                                    en: titleById(en, item.id),
                                                    ru: titleById(ru, item.id),
                                                },
                                            }}
                                        />
                                        <Button onClick={() => handleDelete(item.id)} size="icon" className="h-7 w-7">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5 justify-center w-full p-5">
                        <Package className="w-10 h-10 md:w-20 md:h-20" />
                        <span className="text-xl">Referans məktubu tapılmadı</span>
                    </div>
                )}

                {items.length > 1 && (
                    <Alert>
                        <HelpCircle className="h-4 w-4" />
                        <AlertDescription>
                            Sıranı dəyişmək üçün kartları sürükləyib buraxın, sonra "Sıranı saxla" düyməsini basın. Saytdakı slider bu sıra ilə göstəriləcək.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}

export default ReferenceLetters
