"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ImageUploadFormItem } from "@/components/image-upload-form-item"
import { validateImage } from "@/validations/upload.validation"
import { useUploadFileMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import { type FeatureFormValues, FeatureSchema, type Language } from "@/validations/corporate/fetures.validation"
import type { imageState } from "@/types/home/graduates.dto"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FeatureFormProps } from "@/types/corporate/features.dto"

export default function FeatureForm({ defaultValues, onSubmit, onCancel, isFeatLoading }: FeatureFormProps) {
    const [activeTab, setActiveTab] = useState<Language>("az")
    const [imageState, setImageState] = useState<imageState>({
        preview: null,
        id: defaultValues?.images?.[0] || null,
        error: null,
    })

    const [uploadImage, { isLoading: isUpLoading }] = useUploadFileMutation()

    const form = useForm<FeatureFormValues>({
        resolver: zodResolver(FeatureSchema),
        defaultValues: defaultValues || {
            images: [],
            translations: [
                { title: "", desc: "", lang: "az" },
                { title: "", desc: "", lang: "en" },
                { title: "", desc: "", lang: "ru" },
            ],
        },
    })

    const translations = form.watch("translations") || []

    const getCurrentTranslation = (lang: Language) => {
        return translations.find((t) => t.lang === lang) || { title: "", desc: "", lang }
    }

    const updateTranslation = (lang: Language, field: "title" | "desc", value: string) => {
        const currentTranslations = [...translations]
        const index = currentTranslations.findIndex((t) => t.lang === lang)

        if (index !== -1) {
            currentTranslations[index] = { ...currentTranslations[index], [field]: value }
        } else {
            currentTranslations.push({
                title: field === "title" ? value : "",
                desc: field === "desc" ? value : "",
                lang,
            })
        }

        form.setValue("translations", currentTranslations, { shouldValidate: true })
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const imageValidation = validateImage(file, setImageState, imageState)
        if (imageValidation === false) return

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await uploadImage(formData)

            if ("data" in response) {
                setImageState({
                    preview: response.data.url,
                    id: response.data.id,
                    error: null,
                })

                form.setValue("images", [response.data.id], { shouldValidate: true })
            }
        } catch (error) {
            toast.error("Şəkil yükləyərkən xəta baş vedi")
            setImageState({
                ...imageState,
                error: "Şəkil yükləyərkən xəta baş verdi",
            })
        }
    }

    const onFormSubmit = form.handleSubmit(
        (data) => {
            onSubmit(data)
        },
        (errors) => {
            toast.error("Zəhmət olmasa bütün sahələri doldurun")
        },
    )

    const currentTranslation = getCurrentTranslation(activeTab)

    useEffect(() => {
        const langs: Language[] = ["az", "en", "ru"]
        const currentTranslations = [...translations]

        let updated = false
        langs.forEach((lang) => {
            if (!currentTranslations.some((t) => t.lang === lang)) {
                currentTranslations.push({ title: "", desc: "", lang })
                updated = true
            }
        })

        if (updated) {
            form.setValue("translations", currentTranslations)
        }
    }, [form, translations])

    return (
        <Form {...form}>
            <form onSubmit={onFormSubmit} className="space-y-6">
                <ImageUploadFormItem
                    form={form}
                    name="image"
                    imageState={imageState}
                    setImageState={setImageState}
                    handleImageChange={handleImageChange}
                    isUploading={isUpLoading}
                    imageInputId="feature-image"
                    label="Şəkli Dəyişdir"
                />

                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Language)}>
                    <TabsList className="grid grid-cols-3 w-full">
                        <TabsTrigger value="az">AZ</TabsTrigger>
                        <TabsTrigger value="en">EN</TabsTrigger>
                        <TabsTrigger value="ru">RU</TabsTrigger>
                    </TabsList>

                    <TabsContent value={activeTab} className="space-y-4 mt-4">
                        <FormItem>
                            <FormLabel>Başlıq ({activeTab.toUpperCase()})</FormLabel>
                            <FormControl>
                                <Input
                                    value={currentTranslation.title}
                                    onChange={(e) => updateTranslation(activeTab, "title", e.target.value)}
                                    placeholder={
                                        activeTab === "az"
                                            ? "Xüsusiyyət başlığını daxil edin"
                                            : activeTab === "en"
                                                ? "Enter feature title"
                                                : "Введите название функции"
                                    }
                                />
                            </FormControl>
                            <FormMessage>
                                {form.formState.errors.translations?.message ||
                                    form.formState.errors.translations?.[translations.findIndex((t) => t.lang === activeTab)]?.title
                                        ?.message}
                            </FormMessage>
                        </FormItem>

                        <FormItem>
                            <FormLabel>Təsvir ({activeTab.toUpperCase()})</FormLabel>
                            <FormControl>
                                <Textarea
                                    value={currentTranslation.desc}
                                    onChange={(e) => updateTranslation(activeTab, "desc", e.target.value)}
                                    placeholder={
                                        activeTab === "az"
                                            ? "Xüsusiyyət təsvirini daxil edin"
                                            : activeTab === "en"
                                                ? "Enter feature description"
                                                : "Введите описание функции"
                                    }
                                    rows={4}
                                />
                            </FormControl>
                            <FormMessage>
                                {form.formState.errors.translations?.message ||
                                    form.formState.errors.translations?.[translations.findIndex((t) => t.lang === activeTab)]?.desc
                                        ?.message}
                            </FormMessage>
                        </FormItem>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Ləğv et
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting || isUpLoading}>
                        {form.formState.isSubmitting || isFeatLoading
                            ? "Əlavə edilir..."
                            : defaultValues && defaultValues.images?.length
                                ? "Redaktə et"
                                : "Əlavə et"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
