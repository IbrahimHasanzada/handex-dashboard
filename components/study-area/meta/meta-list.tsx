"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash, Globe } from "lucide-react"
import { MetaForm } from "./meta-form"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"

interface MetaTranslation {
    id?: number
    name: string
    value: string
    lang: string
}

interface MetaItem {
    id?: number
    translations: MetaTranslation[]
}

interface MetaListProps {
    metaItems: MetaItem[]
    selectedLanguage: string
    onRefresh: () => void
    onDeleteMeta?: (id: number) => Promise<void>
    onCreateMeta?: (data: MetaItem) => Promise<void>
    onUpdateMeta?: (id: number, data: MetaItem) => Promise<void>
}

export function MetaList({
    metaItems,
    selectedLanguage,
    onRefresh,
    onDeleteMeta,
    onCreateMeta,
    onUpdateMeta,
}: MetaListProps) {
    const [isMetaFormOpen, setIsMetaFormOpen] = useState(false)
    const [editingMeta, setEditingMeta] = useState<MetaItem | null>(null)

    const onAddMeta = () => {
        setEditingMeta(null)
        setIsMetaFormOpen(true)
    }

    const onEditMeta = (meta: MetaItem) => {
        setEditingMeta(meta)
        setIsMetaFormOpen(true)
    }

    const handleMetaFormClose = () => {
        setIsMetaFormOpen(false)
        setEditingMeta(null)
    }

    const handleMetaSuccess = () => {
        onRefresh()
        handleMetaFormClose()
    }

    const handleDeleteMeta = async (id: number) => {
        if (!onDeleteMeta) return

        try {
            await showDeleteConfirmation(() => onDeleteMeta(id), id, onRefresh, {
                title: "Meta məlumatını silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Meta məlumatı uğurla silindi.",
            })
        } catch (error) {
            console.error("Error:", error)
            toast.error("Meta məlumatını silərkən xəta baş verdi")
        }
    }

    const handleSubmitMeta = async (data: MetaItem) => {
        if (editingMeta && editingMeta.id && onUpdateMeta) {
            await onUpdateMeta(editingMeta.id, data)
        } else if (onCreateMeta) {
            await onCreateMeta(data)
        }
    }

    const getTranslationForLanguage = (translations: MetaTranslation[], lang: string) => {
        return translations.find((t) => t.lang === lang) || translations[0]
    }

    const getMetaTypeLabel = (name: string) => {
        const metaTypes: Record<string, string> = {
            title: "Başlıq",
            description: "Təsvir",
            keywords: "Açar sözlər",
            author: "Müəllif",
            robots: "Robotlar",
            viewport: "Görünüş sahəsi",
            canonical: "Kanonik URL",
            "og:title": "OG Başlıq",
            "og:description": "OG Təsvir",
            "og:image": "OG Şəkil",
            "twitter:title": "Twitter Başlıq",
            "twitter:description": "Twitter Təsvir",
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
                        {metaItems.map((meta, index) => {
                            const currentTranslation = getTranslationForLanguage(meta.translations, selectedLanguage)
                            const metaType = meta.translations[0]?.name || "unknown"

                            return (
                                <div key={meta.id || index} className="flex items-start gap-4 border rounded-lg p-4">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium">{getMetaTypeLabel(metaType)}</div>
                                                <Badge variant="outline" className="font-mono text-xs">
                                                    {metaType}
                                                </Badge>
                                            </div>
                                            <div className="flex gap-1">
                                                <Button size="icon" variant="ghost" onClick={() => onEditMeta(meta)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                {meta.id && onDeleteMeta && (
                                                    <Button size="icon" variant="ghost" onClick={() => handleDeleteMeta(meta.id!)}>
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                            {currentTranslation?.value || "Dəyər yoxdur"}
                                        </div>

                                        <div className="flex gap-1 flex-wrap">
                                            {meta.translations.map((translation, idx) => (
                                                <Badge
                                                    key={idx}
                                                    variant={translation.lang === selectedLanguage ? "default" : "secondary"}
                                                    className="text-xs"
                                                >
                                                    {translation.lang.toUpperCase()}
                                                    {translation.value ? " ✓" : " ✗"}
                                                </Badge>
                                            ))}
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
            />
        </>
    )
}
