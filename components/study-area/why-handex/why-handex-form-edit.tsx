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
import { EditFeatureFormSchema, EditFeatureSchema } from "@/validations/corporate/fetures.validation"
import type { imageState } from "@/types/home/graduates.dto"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { EditFeatureFormProps } from "@/types/corporate/features.dto"
import { Loader2, Upload } from "lucide-react"

export default function EditWhyHandexForm({ onSubmit, onCancel, isFeatLoading, features, lang, upLoading }: EditFeatureFormProps) {
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
    }, [features, lang])
    const [imageState, setImageState] = useState<imageState>({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
        alt: null
    })

    useEffect(() => {
        if (features?.images?.[0]?.id) {
            setImageState((prev) => ({
                ...prev,
                id: features.images[0].id,
                preview: features.images[0].url || null,
                alt: features.images[0].alt
            }))
        }
    }, [features])

    const [uploadImage, { isLoading: isUpLoading }] = useUploadFileMutation()

    const form = useForm<EditFeatureFormSchema & { imageAlt: string }>({
        resolver: zodResolver(EditFeatureSchema),
        defaultValues: {
            images: [],
            translations: [
                { title: title, desc: desc, lang: lang as any },
            ],
            imageAlt: ""
        },
    })

    useEffect(() => {
        if (title || desc) {
            const currentTranslations = [...form.getValues("translations")]
            const index = currentTranslations.findIndex((t) => t.lang === lang)

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
                    lang: lang as any,
                })
            }

            form.setValue("translations", currentTranslations, { shouldValidate: true })
        }
    }, [title, desc, lang, form])

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

            const response = await uploadImage(formData).unwrap()

            setImageState({
                preview: response.url,
                id: response.id,
                error: null,
                selectedFile: null,
            })

            form.setValue("images", [response.id], { shouldValidate: true })
            toast.success("Şəkil uğurla yükləndi")
        } catch (error: any) {
            toast.error("Şəkil yükləyərkən xəta baş verdi", error.data.message)
        }
    }


    const onFormSubmit = form.handleSubmit(
        (data) => {
            onSubmit(data as any, features.id)
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
                <Button type="button" onClick={uploadSelectedImage} disabled={isUpLoading} className="w-full">
                    {isUpLoading ? (
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
                </Button>

                <Tabs value={lang}>
                    <TabsContent value={lang} className="space-y-4 mt-4">
                        <FormItem>
                            <FormLabel>Başlıq ({lang})</FormLabel>
                            <FormControl>
                                <Input
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={
                                        lang === "az"
                                            ? "Məlumat başlığını daxil edin"
                                            : lang === "en"
                                                ? "Enter information title"
                                                : "Введите название информации"
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
                                            ? "Məlumat təsvirini daxil edin"
                                            : lang === "en"
                                                ? "Enter information description"
                                                : "Введите описание данных"
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
