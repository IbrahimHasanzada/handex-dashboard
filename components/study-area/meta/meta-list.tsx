"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, Globe } from "lucide-react"
import { MetaForm } from "./meta-form"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { useDeleteMetaMutation } from "@/store/handexApi"


interface MetaListProps {
    metaItems: any
    selectedLanguage: string
    onRefresh: () => void
    onCreateMeta?: (data: any) => Promise<void>
    onUpdateMeta?: (data: any) => Promise<void>
}

export function MetaList({
    metaItems,
    selectedLanguage,
    onRefresh,
    onCreateMeta,
    onUpdateMeta,
}: MetaListProps) {
    const [isMetaFormOpen, setIsMetaFormOpen] = useState(false)
    const [editingMeta, setEditingMeta] = useState<any>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [deleteMeta] = useDeleteMetaMutation()

    const onAddMeta = () => {
        setEditingMeta(null)
        setIsEditMode(false)
        setIsMetaFormOpen(true)
    }

    const onEditMeta = (meta: any) => {
        setEditingMeta(meta)
        setIsEditMode(true)
        setIsMetaFormOpen(true)
    }

    const handleMetaFormClose = () => {
        setIsMetaFormOpen(false)
        setEditingMeta(null)
        setIsEditMode(false)
    }

    const handleMetaSuccess = () => {
        onRefresh()
        handleMetaFormClose()
    }

    const handleDeleteMeta = async (id: number) => {
        try {
            await showDeleteConfirmation(deleteMeta, id, onRefresh, {
                title: "Meta məlumatını silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Meta məlumatı uğurla silindi.",
            })
        } catch (error: any) {
            toast.error("Meta məlumatını silərkən xəta baş verdi", error.data.message)
        }
    }

    const handleSubmitMeta = async (data: any) => {
        if (isEditMode && editingMeta && editingMeta.id && onUpdateMeta) {
            await onUpdateMeta(data)
        } else if (onCreateMeta) {
            await onCreateMeta(data)
        }
    }


    const getMetaTypeLabel = (name: string) => {
        const metaTypes: Record<string, string> = {
            title: "Başlıq",
            description: "Təsvir",
        }
        return metaTypes[name] || name
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Meta Məlumatları
                        </CardTitle>
                        <CardDescription>Səhifə meta məlumatlarını idarə edin (3 dil dəstəyi)</CardDescription>
                    </div>
                    <Button onClick={onAddMeta}>
                        <Plus className="mr-2 h-4 w-4" />
                        Yeni Meta
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {metaItems.map((meta: any, index: number) => {
                            const metaType = meta?.name || "unknown"

                            return (
                                <div key={meta.id || index} className="flex items-start gap-4 border rounded-lg p-4">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">{getMetaTypeLabel(metaType)}</div>
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    {meta.value}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" onClick={() => onEditMeta(meta)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                {meta.id && metaItems.length > 1 && (
                                                    <Button size="icon" variant="ghost" onClick={() => handleDeleteMeta(meta.id!)}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        {metaItems.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Hələ meta məlumatı əlavə edilməyib</p>
                                <p className="text-sm">İlk meta məlumatınızı əlavə etmək üçün yuxarıdakı düyməni basın</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <MetaForm
                isOpen={isMetaFormOpen}
                onClose={handleMetaFormClose}
                initialData={editingMeta}
                selectedLanguage={selectedLanguage}
                onSuccess={handleMetaSuccess}
                onSubmit={handleSubmitMeta}
                isEditMode={isEditMode}
            />
        </>
    )
}
