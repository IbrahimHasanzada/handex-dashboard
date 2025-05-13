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
import { type FeatureFormValues, EditFeatureFormSchema, FeatureSchema, type Language, EditFeatureSchema } from "@/validations/corporate/fetures.validation"
import type { imageState } from "@/types/home/graduates.dto"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { EditFeatureFormProps } from "@/types/corporate/features.dto"

export default function EditFeatureForm({ onSubmit, onCancel, isFeatLoading, features, lang, upLoading }: EditFeatureFormProps) {
    const [activeTab, setActiveTab] = useState<Language>("az")

    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    useEffect(() => {
        if (features) {
            if (features) {
                setTitle(features.title || "")
                setDesc(features.desc || "")
                form.setValue("images", [features.images[0].id])
            }
        }
    }, [features, activeTab])

    const [imageState, setImageState] = useState<imageState>({
        preview: null,
        id: null,
        error: null,
    })

    useEffect(() => {
        if (features?.images?.[0]?.id) {
            setImageState((prev) => ({
                ...prev,
                id: features.images[0].id,
                preview: features.images[0].url || null,
            }))
        }
    }, [features])
    const [uploadImage, { isLoading: isUpLoading }] = useUploadFileMutation()

    const form = useForm<EditFeatureFormSchema>({
        resolver: zodResolver(EditFeatureSchema),
        defaultValues: {
            images: [],
            translations: [
                { title: title, desc: desc, lang: lang },
            ],
        },
    })

    useEffect(() => {
        if (title || desc) {
            const currentTranslations = [...form.getValues("translations")]
            const index = currentTranslations.findIndex((t) => t.lang === activeTab)

            if (index !== -1) {
                currentTranslations[index] = {
                    ...currentTranslations[index],
                    title: title,
                    desc: desc,
                }
            } else {
                currentTranslations.push({
                    title: title,
                    desc: desc,
                    lang: activeTab,
                })
            }

            form.setValue("translations", currentTranslations, { shouldValidate: true })
        }
    }, [title, desc, activeTab, form])

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
            onSubmit(data, features.id)
        },
        (errors) => {
            toast.error("Zəhmət olmasa bütün sahələri doldurun")
        },
    )

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
                    <TabsContent value={activeTab} className="space-y-4 mt-4">
                        <FormItem>
                            <FormLabel>Başlıq ({lang})</FormLabel>
                            <FormControl>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={
                                        lang === "az"
                                            ? "Xüsusiyyət başlığını daxil edin"
                                            : lang === "en"
                                                ? "Enter feature title"
                                                : "Введите название функции"
                                    }
                                />
                            </FormControl>
                            <FormMessage>{form.formState.errors.translations?.message}</FormMessage>
                        </FormItem>

                        <FormItem>
                            <FormLabel>Təsvir ({lang})</FormLabel>
                            <FormControl>
                                <Textarea
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    placeholder={
                                        lang === "az"
                                            ? "Xüsusiyyət təsvirini daxil edin"
                                            : lang === "en"
                                                ? "Enter feature description"
                                                : "Введите описание функции"
                                    }
                                    rows={4}
                                />
                            </FormControl>
                            <FormMessage>{form.formState.errors.translations?.message}</FormMessage>
                        </FormItem>
                    </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Ləğv et
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting || upLoading ? "Redaktə edilir..." : "Redaktə et"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
