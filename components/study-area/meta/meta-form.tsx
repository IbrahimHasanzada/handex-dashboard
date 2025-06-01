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
import { MetaFormProps, MetaItem, MetaTranslation } from "@/types/study-area/meta.dto"



const AVAILABLE_LANGUAGES = [
    { code: "az", name: "Azərbaycanca" },
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
]

const META_TYPES = [
    { value: "title", label: "Title" },
    { value: "description", label: "Description" },
]

export function MetaForm({ isOpen, onClose, initialData, selectedLanguage, onSuccess, onSubmit }: MetaFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [translations, setTranslations] = useState<MetaTranslation[]>([])
    const [activeTab, setActiveTab] = useState(selectedLanguage)

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const existingTranslations = initialData.translations || []
                const completeTranslations = AVAILABLE_LANGUAGES.map((lang) => {
                    const existing = existingTranslations.find((t) => t.lang === lang.code)
                    return (
                        existing || {
                            name: "",
                            value: "",
                            lang: lang.code,
                        }
                    )
                })
                setTranslations(completeTranslations)
            } else {
                setTranslations(
                    AVAILABLE_LANGUAGES.map((lang, index) => ({
                        id: index + 1,
                        name: "",
                        value: "",
                        lang: lang.code,
                    })),
                )
            }
            setActiveTab(selectedLanguage)
        }
    }, [isOpen, initialData, selectedLanguage])

    const updateTranslation = (lang: string, field: "name" | "value", value: string) => {
        setTranslations((prev) => prev.map((t) => (t.lang === lang ? { ...t, [field]: value } : t)))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validTranslations = translations.filter((t) => t.name.trim() && t.value.trim())

        if (validTranslations.length === 0) {
            toast.error("Ən azı bir dil üçün meta adı və dəyəri daxil edin")
            return
        }

        const firstValidTranslation = validTranslations[0]
        const allSameName = validTranslations.every((t) => t.name === firstValidTranslation.name)

        if (!allSameName) {
            toast.error("Bütün dillər üçün eyni meta növü seçilməlidir")
            return
        }

        setIsLoading(true)

        try {
            const metaData: MetaItem = {
                ...(initialData?.id && { id: initialData.id }),
                translations: translations.map((t, index) => ({
                    ...(t.id && { id: t.id }),
                    name: t.name,
                    value: t.value,
                    lang: t.lang,
                })),
            }

            if (onSubmit) {
                await onSubmit(metaData)
                toast.success(initialData ? "Meta məlumatı yeniləndi" : "Meta məlumatı əlavə edildi")
                onSuccess()
            }
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
                    <DialogTitle>{initialData ? "Meta Məlumatını Redaktə Et" : "Yeni Meta Məlumatı"}</DialogTitle>
                    <DialogDescription>Meta məlumatlarını və tərcümələrini idarə edin (3 dil üçün)</DialogDescription>
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
                                <Select
                                    value={translations[0]?.name || ""}
                                    onValueChange={(value) => {
                                        // Update all translations to have the same meta type
                                        setTranslations((prev) =>
                                            prev.map((t) => ({
                                                ...t,
                                                name: value,
                                            })),
                                        )
                                    }}
                                >
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

                    {/* Translations for all 3 languages */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Tərcümələr (3 Dil)</CardTitle>
                        </CardHeader>
                        <CardContent>
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
                                                    onChange={(e) => updateTranslation(lang.code, "value", e.target.value)}
                                                    placeholder={`Meta dəyərini daxil edin (${lang.name})`}
                                                    rows={4}
                                                />
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                Meta növü: <span className="font-mono">{translation?.name || "Seçilməyib"}</span>
                                            </div>
                                        </TabsContent>
                                    )
                                })}
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Önizləmə</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="text-sm">
                                    <span className="font-medium">Meta Növü:</span>{" "}
                                    <span className="font-mono bg-muted px-2 py-1 rounded">{translations[0]?.name || "Seçilməyib"}</span>
                                </div>
                                <div className="space-y-2">
                                    {AVAILABLE_LANGUAGES.map((lang) => {
                                        const translation = translations.find((t) => t.lang === lang.code)
                                        return (
                                            <div key={lang.code} className="border rounded p-3">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-sm font-medium">{lang.name}:</span>
                                                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                                                        {lang.code.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {translation?.value || "Dəyər daxil edilməyib"}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Ləğv et
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {initialData ? "Yenilə" : "Əlavə et"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
