"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { AVAILABLE_LANGUAGES, META_TYPES, MetaFormProps, MetaItem, MetaTranslation } from "@/types/study-area/meta.dto"


export function MetaForm({
    isOpen,
    onClose,
    initialData,
    selectedLanguage,
    onSuccess,
    onSubmit,
    isEditMode = false,
}: MetaFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [metaType, setMetaType] = useState("")
    const [translations, setTranslations] = useState<MetaTranslation[]>([])
    const [activeTab, setActiveTab] = useState(selectedLanguage)

    const languageNames: Record<string, string> = {
        az: "Azərbaycanca",
        en: "English",
        ru: "Русский",
    }

    const placeholders: Record<string, string> = {
        az: "Meta dəyərini daxil edin (Azərbaycanca)",
        en: "Enter meta value (English)",
        ru: "Введите мета значение (Русский)",
    }

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const existingTranslations = initialData.translations || []
                setMetaType(initialData?.name || "")

                if (isEditMode) {
                    const selectedTranslation = existingTranslations.find((t: any) => t.lang === selectedLanguage)
                    setTranslations([
                        {
                            name: initialData.name || "",
                            value: initialData?.value || "",
                            lang: selectedLanguage,
                        },
                    ])
                } else {
                    const completeTranslations = AVAILABLE_LANGUAGES.map((lang) => {
                        const existing = existingTranslations.find((t: any) => t.lang === lang.code)
                        return (
                            existing || {
                                name: existingTranslations[0]?.name || "",
                                value: "",
                                lang: lang.code,
                            }
                        )
                    })
                    setTranslations(completeTranslations)
                }
            } else {
                setMetaType("")
                if (isEditMode) {
                    setTranslations([
                        {
                            name: "",
                            value: "",
                            lang: selectedLanguage,
                        },
                    ])
                } else {
                    setTranslations(
                        AVAILABLE_LANGUAGES.map((lang) => ({
                            name: "",
                            value: "",
                            lang: lang.code,
                        })),
                    )
                }
            }
            setActiveTab(selectedLanguage)
        }
    }, [isOpen, initialData, selectedLanguage, isEditMode])

    const updateTranslation = (lang: string, value: string) => {
        setTranslations((prev) => prev.map((t) => (t.lang === lang ? { ...t, value } : t)))
    }

    const updateAllTranslationsName = (name: string) => {
        setMetaType(name)
        setTranslations((prev) => prev.map((t) => ({ ...t, name })))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!metaType.trim()) {
            toast.error("Meta növü seçilməlidir")
            return
        }

        const hasValue = translations.some((t) => t.value.trim())
        if (!hasValue) {
            toast.error(isEditMode ? "Meta dəyəri daxil edin" : "Ən azı bir dil üçün meta dəyəri daxil edin")
            return
        }

        setIsLoading(true)

        try {
            const metaData: MetaItem = {
                ...(initialData?.id && { id: initialData.id }),
                translations: translations
                    .filter((t) => t.value.trim())
                    .map((t) => ({
                        name: metaType,
                        value: t.value,
                        lang: t.lang,
                    })),
            }

            if (onSubmit) {
                await onSubmit(metaData)
            }
            toast.success(isEditMode ? "Meta məlumatı yeniləndi" : "Meta məlumatı əlavə edildi")
            onSuccess()
        } catch (error) {
            console.error("Error:", error)
            toast.error("Xəta baş verdi")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? `Meta Məlumatını Redaktə Et (${languageNames[selectedLanguage]})` : "Yeni Meta Məlumatı"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? `Seçilmiş dil (${languageNames[selectedLanguage]}) üçün meta məlumatını yeniləyin`
                            : "Meta məlumatlarını və tərcümələrini idarə edin (3 dil üçün)"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Meta Type Selection */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Meta Növü</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Meta Növü Seçin</Label>
                                <Select value={metaType} onValueChange={updateAllTranslationsName}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Meta növünü seçin..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {META_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Content Section - different UI for edit vs add mode */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                {isEditMode ? `Məzmun (${languageNames[selectedLanguage]})` : "Tərcümələr (3 Dil)"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditMode ? (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Meta Dəyəri ({languageNames[selectedLanguage]})</Label>
                                        <Textarea
                                            value={translations[0]?.value || ""}
                                            onChange={(e) => updateTranslation(selectedLanguage, e.target.value)}
                                            placeholder={placeholders[selectedLanguage] || "Meta dəyərini daxil edin"}
                                            rows={4}
                                        />
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Meta növü: <span className="font-mono">{metaType || "Seçilməyib"}</span>
                                    </div>
                                </div>
                            ) : (
                                // Add mode - show tabs for all 3 languages
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-3">
                                        {AVAILABLE_LANGUAGES.map((lang) => (
                                            <TabsTrigger key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {AVAILABLE_LANGUAGES.map((lang) => {
                                        const translation = translations.find((t) => t.lang === lang.code)
                                        return (
                                            <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label>Meta Dəyəri ({lang.name})</Label>
                                                    <Textarea
                                                        value={translation?.value || ""}
                                                        onChange={(e) => updateTranslation(lang.code, e.target.value)}
                                                        placeholder={placeholders[lang.code] || `Meta dəyərini daxil edin (${lang.name})`}
                                                        rows={4}
                                                    />
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    Meta növü: <span className="font-mono">{metaType || "Seçilməyib"}</span>
                                                </div>
                                            </TabsContent>
                                        )
                                    })}
                                </Tabs>
                            )}
                        </CardContent>
                    </Card>
                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Ləğv et
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {isEditMode ? "Yenilə" : "Əlavə et"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
