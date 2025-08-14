"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Save, X, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { useAddFaqMutation, useUpdateFaqMutation } from "@/store/handexApi"
import { FAQFormData, FAQFormProps } from "@/types/home/faq.dto"

const languages = [
    { code: "az" as const, name: "Azərbaycanca" },
    { code: "en" as const, name: "English" },
    { code: "ru" as const, name: "Русский" },
]

export function FAQForm({
    model,
    faqId,
    existingData,
    onSuccess,
    trigger,
    currentLanguage,
}: FAQFormProps) {
    const [selectedLanguage, setSelectedLanguage] = useState<any>()
    const [addFaq, { isLoading: addLoading }] = useAddFaqMutation()
    const [editFaq, { isLoading: editLoading }] = useUpdateFaqMutation()

    const [open, setOpen] = useState(false)

    const isEditMode = !!faqId
    const [formData, setFormData] = useState<FAQFormData>({
        model,
        translations: [
            { title: "", description: "", lang: "az" },
            { title: "", description: "", lang: "en" },
            { title: "", description: "", lang: "ru" },
        ],
    })

    useEffect(() => {
        if (existingData && faqId) {
            setFormData({
                model,
                translations: [
                    { title: "", description: "", lang: "az" },
                    { title: "", description: "", lang: "en" },
                    { title: "", description: "", lang: "ru" },
                ].map((t) =>
                    t.lang === currentLanguage
                        ? { title: existingData.title, description: existingData.description, lang: currentLanguage }
                        : t,
                ),
            })
        }
    }, [existingData, faqId, currentLanguage])

    useEffect(() => {
        if (!open) {
            if (!faqId) {
                setFormData({
                    model,
                    translations: [
                        { title: "", description: "", lang: "az" },
                        { title: "", description: "", lang: "en" },
                        { title: "", description: "", lang: "ru" },
                    ],
                })
            }
        }
    }, [open, faqId])

    const updateTranslation = (lang: "az" | "en" | "ru", field: "title" | "description", value: string) => {
        setFormData((prev) => ({
            ...prev,
            translations: prev.translations.map((t) => (t.lang === lang ? { ...t, [field]: value } : t)),
        }))
    }

    const validateForm = () => {
        if (isEditMode) {
            const currentTranslation = formData.translations.find((t) => t.lang === currentLanguage)
            if (!currentTranslation || !currentTranslation.title.trim() || !currentTranslation.description.trim()) {
                toast.error("Başlıq və təsvir doldurulmalıdır")
                return false
            }
        } else {
            const hasValidTranslation = formData.translations.every(
                (t) => t.title.trim() !== "" && t.description.trim() !== "",
            )
            if (!hasValidTranslation) {
                toast.error("Bütün dillərdə başlıq və təsvir doldurulmalıdır")
                return false
            }
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            let dataToSend = formData

            if (isEditMode) {
                dataToSend = {
                    ...formData,
                    translations: formData.translations.filter((t) => t.lang === currentLanguage),
                }
            }

            if (faqId) {
                await editFaq({ params: dataToSend, id: faqId }).unwrap()
            } else {
                await addFaq(dataToSend).unwrap()
            }

            toast.success(faqId ? "FAQ uğurla yeniləndi" : "FAQ uğurla əlavə edildi")
            setOpen(false)
            onSuccess?.()
        } catch (error) {
            console.error("Error:", error)
            toast.error("Əməliyyat zamanı xəta baş verdi")
        }
    }

    const getCurrentTranslation = (lang: "az" | "en" | "ru") => {
        return formData.translations.find((t) => t.lang === lang) || { title: "", description: "", lang }
    }

    const defaultTrigger = (
        <Button variant={faqId ? "ghost" : "default"} size={faqId ? "icon" : "default"}>
            {faqId ? (
                <Edit className="h-4 w-4" />
            ) : (
                <>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Sual
                </>
            )}
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {faqId
                            ? `FAQ-nı Redaktə Et (${languages.find((l) => l.code === currentLanguage)?.name})`
                            : "Yeni FAQ Əlavə Et"}
                    </DialogTitle>
                    <DialogDescription>
                        {faqId
                            ? `${languages.find((l) => l.code === currentLanguage)?.name} dilində FAQ məlumatlarını yeniləyin`
                            : "Yeni tez-tez verilən sual əlavə edin"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isEditMode ? (
                        // Edit modunda yalnız hazırki dil
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{languages.find((l) => l.code === currentLanguage)?.name}</CardTitle>
                                <CardDescription>
                                    {currentLanguage === "az" && "Azərbaycan dilində məlumatları daxil edin"}
                                    {currentLanguage === "en" && "Enter information in English"}
                                    {currentLanguage === "ru" && "Введите информацию на русском языке"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`title-${currentLanguage}`}>
                                        {currentLanguage === "az" && "Sual"}
                                        {currentLanguage === "en" && "Question"}
                                        {currentLanguage === "ru" && "Вопрос"}
                                    </Label>
                                    <Input
                                        id={`title-${currentLanguage}`}
                                        value={getCurrentTranslation(currentLanguage).title}
                                        onChange={(e) => updateTranslation(currentLanguage, "title", e.target.value)}
                                        placeholder={
                                            currentLanguage === "az"
                                                ? "Sualı daxil edin..."
                                                : currentLanguage === "en"
                                                    ? "Enter question..."
                                                    : "Введите вопрос..."
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`description-${currentLanguage}`}>
                                        {currentLanguage === "az" && "Cavab"}
                                        {currentLanguage === "en" && "Answer"}
                                        {currentLanguage === "ru" && "Ответ"}
                                    </Label>
                                    <Textarea
                                        id={`description-${currentLanguage}`}
                                        value={getCurrentTranslation(currentLanguage).description}
                                        onChange={(e) => updateTranslation(currentLanguage, "description", e.target.value)}
                                        placeholder={
                                            currentLanguage === "az"
                                                ? "Cavabı daxil edin..."
                                                : currentLanguage === "en"
                                                    ? "Enter answer..."
                                                    : "Введите вопрос..."
                                        }
                                        rows={4}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        // Add modunda bütün dillər
                        <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as "az" | "en" | "ru")}>
                            <TabsList className="grid w-full grid-cols-3">
                                {languages.map((lang) => (
                                    <TabsTrigger key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {languages.map((lang) => {
                                const translation = getCurrentTranslation(lang.code)
                                return (
                                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                                        <Card>
                                            <CardHeader>
                                                <CardTitle className="text-lg">{lang.name}</CardTitle>
                                                <CardDescription>
                                                    {lang.code === "az" && "Azərbaycan dilində məlumatları daxil edin"}
                                                    {lang.code === "en" && "Enter information in English"}
                                                    {lang.code === "ru" && "Введите информацию на русском языке"}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor={`title-${lang.code}`}>
                                                        {lang.code === "az" && "Sual"}
                                                        {lang.code === "en" && "Question"}
                                                        {lang.code === "ru" && "Вопрос"}
                                                    </Label>
                                                    <Input
                                                        id={`title-${lang.code}`}
                                                        value={translation.title}
                                                        onChange={(e) => updateTranslation(lang.code, "title", e.target.value)}
                                                        placeholder={
                                                            lang.code === "az"
                                                                ? "Sualı daxil edin..."
                                                                : lang.code === "en"
                                                                    ? "Enter question..."
                                                                    : "Введите вопрос..."
                                                        }
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor={`description-${lang.code}`}>
                                                        {lang.code === "az" && "Cavab"}
                                                        {lang.code === "en" && "Answer"}
                                                        {lang.code === "ru" && "Ответ"}
                                                    </Label>
                                                    <Textarea
                                                        id={`description-${lang.code}`}
                                                        value={translation.description}
                                                        onChange={(e) => updateTranslation(lang.code, "description", e.target.value)}
                                                        placeholder={
                                                            lang.code === "az"
                                                                ? "Cavabı daxil edin..."
                                                                : lang.code === "en"
                                                                    ? "Enter answer..."
                                                                    : "Введите вопрос..."
                                                        }
                                                        rows={4}
                                                    />
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                )
                            })}
                        </Tabs>
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={editLoading || addLoading}>
                            <X className="mr-2 h-4 w-4" />
                            Ləğv et
                        </Button>
                        <Button type="submit" disabled={addLoading || editLoading}>
                            {editLoading || addLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            {faqId ? "Yenilə" : "Əlavə et"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
