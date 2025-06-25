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
import { useGetHeroQuery, useUploadFileMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import { type FeatureFormValues, FeatureSchema, type Language } from "@/validations/corporate/fetures.validation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { FeatureFormProps } from "@/types/corporate/features.dto"
import { Loader2, Upload } from "lucide-react"

export default function WhyHandexForm({ onSubmit, onCancel, isFeatLoading, slug, id }: FeatureFormProps) {
    const [activeTab, setActiveTab] = useState<Language>("az")
    const {
        data: featuresData,
        refetch: fetchFeatures,
        isFetching,
        isLoading,
    } = useGetHeroQuery({ slug, lang: activeTab, scope: "componentC" }, { skip: false })
    const [defaultValues, setDefaultValue] = useState<string[] | any>()

    useEffect(() => {
        id && setDefaultValue(featuresData?.filter((item: any) => item.id === id))
    }, [activeTab, id, featuresData])

    const [imageState, setImageState] = useState<any>({
        preview: null,
        id: defaultValues?.[0]?.images?.[0]?.id || null,
        error: null,
        selectedFile: null,
        isUploading: false,
    })

    const [uploadImage, { isLoading: isUpLoading }] = useUploadFileMutation()

    const form = useForm<FeatureFormValues & { imageAlt: string }>({
        resolver: zodResolver(FeatureSchema),
        defaultValues: {
            ...(defaultValues?.[0] || {
                images: [],
                translations: [
                    { title: "", desc: "", lang: "az" },
                    { title: "", desc: "", lang: "en" },
                    { title: "", desc: "", lang: "ru" },
                ],
            }),
            imageAlt: defaultValues?.[0]?.images?.[0]?.alt || "",
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const imageValidation = validateImage(file, setImageState, imageState)
        if (imageValidation === false) return

        setImageState({
            preview: URL.createObjectURL(file),
            id: null,
            error: null,
            selectedFile: file,
            isUploading: false,
        })
    }

    const uploadSelectedImage = async () => {
        if (!imageState.selectedFile) {
            toast.error("Zəhmət olmasa əvvəlcə şəkil seçin")
            return
        }

        try {
            const formData = new FormData()
            formData.append("file", imageState.selectedFile)
            formData.append("alt", form.getValues("imageAlt") || "")

            setImageState({ ...imageState, isUploading: true })
            const response = await uploadImage(formData).unwrap()

            setImageState({
                preview: response.url,
                id: response.id,
                error: null,
                alt: form.getValues("imageAlt"),
                selectedFile: null,
                isUploading: false,
            })

            form.setValue("images", [response.id], { shouldValidate: true })
            toast.success("Şəkil uğurla yükləndi")
        } catch (error) {
            setImageState({ ...imageState, isUploading: false })
            toast.error("Şəkil yükləyərkən xəta baş verdi")
        }
    }

    const onFormSubmit = form.handleSubmit((data) => {
        if (imageState.selectedFile && !imageState.id) {
            toast.error("Zəhmət olmasa əvvəlcə şəkili yükləyin")
            return
        }

        const { imageAlt, ...submitData } = data
        onSubmit(submitData)
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

    useEffect(() => {
        if (defaultValues?.[0]?.images?.[0]) {
            setImageState({
                preview: defaultValues[0].images[0].url,
                id: defaultValues[0].images[0].id,
                error: null,
                selectedFile: null,
                isUploading: false,
            })
            form.setValue("imageAlt", defaultValues[0].images[0].alt || "")
        }
    }, [defaultValues, form])

    return (
        <Form {...form}>
            <form onSubmit={onFormSubmit} className="space-y-6">
                {/* Use ImageUploadFormItem component */}
                <ImageUploadFormItem
                    form={form}
                    name="images"
                    imageState={imageState}
                    setImageState={setImageState}
                    handleImageChange={handleImageChange}
                    isUploading={imageState.isUploading}
                    imageInputId="feature-image"
                    label="Şəkli Dəyişdir"
                />

                {imageState.selectedFile && <Button type="button" onClick={uploadSelectedImage} disabled={imageState.isUploading} className="w-full">
                    {imageState.isUploading ? (
                        <div className="flex items-center">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Yüklənir...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Upload className="mr-2 h-4 w-4" />
                            Şəkili yüklə
                        </div>
                    )}
                </Button>}


                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Language)}>
                    {!id && (
                        <TabsList className="grid grid-cols-3 w-full">
                            <TabsTrigger value="az">AZ</TabsTrigger>
                            <TabsTrigger value="en">EN</TabsTrigger>
                            <TabsTrigger value="ru">RU</TabsTrigger>
                        </TabsList>
                    )}

                    <TabsContent value={activeTab} className="space-y-4 mt-4">
                        <FormItem>
                            <FormLabel>Başlıq ({activeTab.toUpperCase()})</FormLabel>
                            <FormControl>
                                <Input
                                    value={currentTranslation.title}
                                    onChange={(e) => updateTranslation(activeTab, "title", e.target.value)}
                                    placeholder={
                                        activeTab === "az"
                                            ? "Məlumat başlığını daxil edin"
                                            : activeTab === "en"
                                                ? "Enter information title"
                                                : "Введите название информация"
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
                                            ? "Məlumat təsvirini daxil edin"
                                            : activeTab === "en"
                                                ? "Enter information description"
                                                : "Введите описание информация"
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
                    <Button type="submit" disabled={form.formState.isSubmitting || imageState.isUploading}>
                        {form.formState.isSubmitting || isFeatLoading
                            ? "Əlavə edilir..."
                            : defaultValues && defaultValues.images?.length
                                ? "Redaktə et"
                                : "Əlavə et"}
                    </Button>
                </div>
            </form>
        </Form >
    )
}
