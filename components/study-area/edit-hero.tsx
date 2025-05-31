"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import type { imageState } from "@/types/home/graduates.dto"
import { useUpdateStudyAreaMutation } from "@/store/handexApi"
import { ImageUpload } from "./course-form/image-upload"
import { StudyAreaEditFormProps } from "@/types/study-area/dit-hero.dto"
import { StudyAreaFormData, studyAreaFormSchema } from "@/validations/study-area/edit-hero.validation"


export function EditHero({
    isOpen,
    onClose,
    studyAreaId,
    initialData,
    selectedLanguage,
    onSuccess,
}: StudyAreaEditFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [updateStudyArea] = useUpdateStudyAreaMutation()

    const [imageState, setImageState] = useState<imageState>({
        preview: initialData?.image?.url || null,
        id: initialData?.image?.id || null,
        error: null,
        selectedFile: null,
    })

    const [altText, setAltText] = useState(initialData?.image?.alt || "")

    const getLanguageDisplayName = (lang: string) => {
        switch (lang) {
            case "az":
                return "Azərbaycanca"
            case "en":
                return "English"
            case "ru":
                return "Русский"
            default:
                return lang
        }
    }

    const getPlaceholder = (lang: string) => {
        switch (lang) {
            case "az":
                return "Kursun azərbaycanca təfərrüatını daxil edin"
            case "en":
                return "Enter course details in English"
            case "ru":
                return "Введите детали курса на русском языке"
            default:
                return "Kurs təfərrüatını daxil edin"
        }
    }

    const form = useForm<StudyAreaFormData>({
        resolver: zodResolver(studyAreaFormSchema),
        defaultValues: {
            name: "",
            slug: "",
            color: "#DE465D",
            image: 0,
            course_detail: "",
        },
    })

    useEffect(() => {
        if (initialData) {
            form.reset({
                name: initialData.name || "",
                slug: initialData.slug || "",
                color: initialData.color || "#DE465D",
                image: initialData.image?.id || 0,
                course_detail: initialData.course_detail || "",
            })

            setImageState({
                preview: initialData.image?.url || null,
                id: initialData.image?.id || null,
                error: null,
                selectedFile: null,
            })
            setAltText(initialData.image?.alt || "")
        }
    }, [initialData, form])

    const handleImageUpload = (imageId: number) => {
        form.setValue("image", imageId)
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    const onSubmit = async (data: StudyAreaFormData) => {
        if (!data.image) {
            toast.error("Zəhmət olmasa şəkil yükləyin")
            return
        }
        setIsSubmitting(true)
        try {
            const payload = {
                name: data.name,
                slug: data.slug,
                color: data.color,
                image: data.image,
                translations: [
                    {
                        course_detail: data.course_detail,
                        lang: selectedLanguage,
                    },
                ],
            }
            await updateStudyArea({ id: studyAreaId, params: payload }).unwrap()
            toast.success("Tədris sahəsi uğurla yeniləndi")
            onSuccess()
            onClose()
        } catch (error) {
            toast.error("Xəta baş verdi")
            console.error("Error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        Tədris Sahəsini Redaktə Et
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                            ({getLanguageDisplayName(selectedLanguage)})
                        </span>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Course Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Kurs Adı *</Label>
                            <Input
                                id="name"
                                {...form.register("name")}
                                placeholder="Kurs adını daxil edin"
                                onChange={(e) => {
                                    form.setValue("name", e.target.value)
                                    // Auto-generate slug from name
                                    const slug = generateSlug(e.target.value)
                                    form.setValue("slug", slug)
                                }}
                            />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input id="slug" {...form.register("slug")} placeholder="kurs-slug" />
                            {form.formState.errors.slug && (
                                <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
                            )}
                        </div>

                        {/* Color */}
                        <div className="space-y-2">
                            <Label htmlFor="color">Rəng *</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="color-picker"
                                    type="color"
                                    value={form.watch("color")}
                                    onChange={(e) => {
                                        form.setValue("color", e.target.value)
                                    }}
                                    className="w-16 h-10 p-1 border rounded"
                                />
                                <Input
                                    id="color-hex"
                                    value={form.watch("color")}
                                    onChange={(e) => {
                                        form.setValue("color", e.target.value)
                                    }}
                                    placeholder="#DE465D"
                                    className="flex-1 font-mono"
                                />
                            </div>
                            {form.formState.errors.color && (
                                <p className="text-sm text-red-500">{form.formState.errors.color.message}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <ImageUpload
                                onImageUpload={handleImageUpload}
                                setImageState={setImageState}
                                imageState={imageState}
                                altText={altText}
                                setAltText={setAltText}
                            />
                            {form.formState.errors.image && (
                                <p className="text-sm text-red-500">{form.formState.errors.image.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Course Detail */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Kurs Təfərrüatı ({getLanguageDisplayName(selectedLanguage)})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Təfərrüat *</Label>
                                <Textarea {...form.register("course_detail")} placeholder={getPlaceholder(selectedLanguage)} rows={4} />
                                {form.formState.errors.course_detail && (
                                    <p className="text-sm text-red-500">{form.formState.errors.course_detail.message}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Form Actions */}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Ləğv Et
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Yüklənir..." : "Yenilə"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
