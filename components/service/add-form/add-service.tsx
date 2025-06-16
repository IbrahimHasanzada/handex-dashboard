"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardFooter } from "@/components/ui/card"
import { ArrowLeft, Loader2, Save } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import {
    useAddServiceMutation,
    useGetServiceBySlugQuery,
    useUpdateServiceMutation,
    useUploadFileMutation,
} from "@/store/handexApi"
import { toast } from "react-toastify"
import { editFormSchemaNews, formSchemaNews } from "@/validations/home/news.validation"
import type { imageState } from "@/types/home/graduates.dto"
import { validateImage } from "@/validations/upload.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ContentTab } from "./content-tab"
import { MediaTab } from "./media-tab"
import { MetaTab } from "./meta-tab"
import { useRouter } from "next/navigation"
import { renderFormErrors } from "@/utils/render-error"

const ServiceDefaultValues = {
    title_az: "",
    title_en: "",
    title_ru: "",
    content_az: "",
    content_en: "",
    content_ru: "",
    featuredImage: -1,
    imageAlt: "",
    meta_az: "",
    meta_en: "",
    meta_ru: "",
    metaName: "description",
    slug: "",
    additionalMeta: [] as Array<{
        metaName: string
        meta_az: string
        meta_en: string
        meta_ru: string
    }>,
}

export function ServiceForm({ slug }: { slug?: string }) {
    const apiKey = process.env.NEXT_PUBLIC_EDITOR_API_KEY
    const [selectedLanguage, setSelectedLanguage] = useState<string>("az")
    const [languagesSkip, setLanguagesSkip] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedTab, setSelectedTab] = useState("content")
    const [metaFields, setMetaFields] = useState<number[]>([0])
    const router = useRouter()
    const [imageState, setImageState] = useState<
        imageState & {
            selectedFile: File | null
            isUploading: boolean
        }
    >({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
        isUploading: false,
    })

    const [uploadImage] = useUploadFileMutation()
    const [addService, { isLoading: serviceLoading }] = useAddServiceMutation()
    const [updateService, { isLoading: serviceUpLoading }] = useUpdateServiceMutation()

    const { data: services, isLoading: serviceByIdLoading } = useGetServiceBySlugQuery(
        {
            slug,
            language: selectedLanguage ? selectedLanguage : "az",
        },
        {
            pollingInterval: 0,
            refetchOnMountOrArgChange: true,
            skip: languagesSkip.includes(selectedLanguage) || !slug,
        },
    )

    let form

    if (services) {
        form = useForm<z.infer<typeof editFormSchemaNews>>({
            defaultValues: ServiceDefaultValues,
            resolver: zodResolver(editFormSchemaNews),
        })
    } else {
        form = useForm<z.infer<typeof formSchemaNews>>({
            resolver: zodResolver(formSchemaNews),
        })
    }
    useEffect(() => {
        if (slug && services) {
            form.setValue(`title_${selectedLanguage}` as "title_az" | "title_en" | "title_ru", services.title)
            form.setValue(`content_${selectedLanguage}` as "content_az" | "content_en" | "content_ru", services.description)

            if (services.meta && services.meta.length > 0) {
                if (services.meta[0]) {
                    form.setValue(`meta_${selectedLanguage}` as "meta_az" | "meta_en" | "meta_ru", services.meta[0].value || "")
                    form.setValue("metaName", services.meta[0].name || "description")
                }
                // Handle additional meta fields
                if (services.meta.length > 1) {
                    const existingAdditionalMeta = form.getValues("additionalMeta") || []

                    const updatedAdditionalMeta = services.meta.slice(1).map((meta: any, index: number) => {
                        const existingMeta = existingAdditionalMeta[index] || {
                            metaName: "",
                            meta_az: "",
                            meta_en: "",
                            meta_ru: "",
                        }

                        const updatedMeta = { ...existingMeta }
                        updatedMeta.metaName = meta.name || ""

                        if (selectedLanguage === "az") {
                            updatedMeta.meta_az = meta.value || ""
                        } else if (selectedLanguage === "en") {
                            updatedMeta.meta_en = meta.value || ""
                        } else if (selectedLanguage === "ru") {
                            updatedMeta.meta_ru = meta.value || ""
                        }

                        return updatedMeta
                    })

                    form.setValue("additionalMeta", updatedAdditionalMeta)
                    setMetaFields([0, ...Array.from({ length: updatedAdditionalMeta.length }, (_, i) => i + 1)])
                }
            }

            if (services.image?.id) {
                form.setValue("featuredImage", services.image.id)
                form.setValue("imageAlt", services.image.alt || "")
                setImageState({ ...imageState, preview: services.image.url || null, id: services.image.id })
            }
            form.setValue("slug", services.slug)
        }
    }, [services, slug])

    async function onSubmit(values: z.infer<typeof formSchemaNews>) {
        try {
            const mainMetaTranslations = [
                { name: values.metaName, value: values.meta_az, lang: "az" },
                ...(values.meta_en !== "" ? [{ name: values.metaName, value: values.meta_en, lang: "en" }] : []),
                ...(values.meta_ru !== "" ? [{ name: values.metaName, value: values.meta_ru, lang: "ru" }] : []),
            ]

            const additionalMetaObjects = (values.additionalMeta || []).map((meta: any) => {
                return {
                    translations: [
                        { name: meta.metaName, value: meta.meta_az, lang: "az" },
                        ...(meta.meta_en !== '' ? [{ name: meta.metaName, value: meta.meta_en, lang: "en" }] : []),
                        ...(meta.meta_ru !== '' ? [{ name: meta.metaName, value: meta.meta_ru, lang: "ru" }] : []),
                    ],
                }
            })

            const postValue = {
                image: values.featuredImage,
                translations: [
                    { title: values.title_az, description: values.content_az, lang: "az" },
                    ...(values.title_en !== '' ? [{ title: values.title_en, description: values.content_en, lang: "en" }] : []),
                    ...(values.title_ru !== '' ? [{ title: values.title_ru, description: values.content_ru, lang: "ru" }] : []),
                ],
                meta: [
                    {
                        translations: mainMetaTranslations,
                    },
                    ...additionalMetaObjects,
                ],
                slug: values.slug,
            }
            console.log(postValue)
            !slug
                ? await addService(postValue).unwrap()
                : await updateService({ params: postValue, id: services.id }).unwrap()
            toast.success(slug ? "Xidmət redaktə edildi" : "Xidmət uğurla yükləndi")
            router.push('/services')
        } catch (error) {
            toast.error("Xidmət yüklənərkən xəta baş verdi")
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const validationImage = validateImage(file, setImageState, imageState)
            if (validationImage === false) {
                return
            }
            setImageState({
                ...imageState,
                preview: URL.createObjectURL(file),
                selectedFile: file,
            })
        }
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
                ...imageState,
                preview: response?.url,
                id: response?.id,
                isUploading: false,
            })
            form.setValue("featuredImage", response?.id)
            toast.success("Şəkil uğurla yükləndi")
        } catch (error) {
            setImageState({ ...imageState, isUploading: false })
            toast.error("Şəkil yükləyərkən xəta baş verdi")
        }
    }

    const handleRemoveImage = () => {
        if (imageState.preview && !imageState.id) {
            URL.revokeObjectURL(imageState.preview)
        }
        setImageState({
            preview: null,
            id: null,
            error: null,
            selectedFile: null,
            isUploading: false,
        })
        form.setValue("featuredImage", -1)
        form.setValue("imageAlt", "")
    }

    const handleSelectImage = () => {
        handleRemoveImage()
        if (fileInputRef.current) {
            fileInputRef.current?.click()
        }

    }

    const handleLanguageChange = (language: string) => {
        setSelectedLanguage(language)
        setLanguagesSkip((prev) => [...prev, selectedLanguage])
    }

    const addNewMetaField = () => {
        setMetaFields((prev) => [...prev, prev.length])
        const currentAdditionalMeta = form.getValues("additionalMeta") || []
        form.setValue("additionalMeta", [...currentAdditionalMeta, { metaName: "", meta_az: "", meta_en: "", meta_ru: "" }])
    }

    return serviceByIdLoading ? (
        <div className="flex items-center justify-center">
            <Loader2 className="animate-spin w-10 h-10" />
        </div>
    ) : (
        <div>
            <Button className="my-5" variant="outline" size="sm" asChild>
                <Link href="/services">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Xidmətlərə qayıt
                </Link>
            </Button>

            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full pt-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                    <TabsTrigger value="meta">Meta</TabsTrigger>
                </TabsList>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="md:col-span-3">
                                <TabsContent value="content" className="space-y-6">
                                    <ContentTab
                                        form={form}
                                        apiKey={apiKey}
                                        selectedLanguage={selectedLanguage}
                                        setSelectedLanguage={handleLanguageChange}
                                    />
                                </TabsContent>

                                <TabsContent value="media" className="space-y-6">
                                    <MediaTab
                                        form={form}
                                        imageState={imageState}
                                        setImageState={setImageState}
                                        handleFileChange={handleFileChange}
                                        uploadSelectedImage={uploadSelectedImage}
                                        handleRemoveImage={handleRemoveImage}
                                        handleSelectImage={handleSelectImage}
                                        fileInputRef={fileInputRef}
                                    />
                                </TabsContent>

                                <TabsContent value="meta" className="space-y-6">
                                    <MetaTab
                                        form={form}
                                        metaFields={metaFields}
                                        setMetaFields={setMetaFields}
                                        addNewMetaField={addNewMetaField}
                                        selectedLanguage={selectedLanguage}
                                        setSelectedLanguage={handleLanguageChange}
                                    />
                                </TabsContent>
                            </div>
                        </div>

                        <CardFooter className="flex flex-col gap-2">
                            <Button type="submit" className="w-full" disabled={serviceLoading || serviceUpLoading}>
                                {serviceLoading || serviceUpLoading ? (
                                    <div className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Yüklənir...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <Save className="mr-2 h-4 w-4" />
                                        {slug ? "Yenilə" : "Əlavə et"}
                                    </div>
                                )}
                            </Button>
                        </CardFooter>
                    </form>

                    {/* Debug information - remove in production */}
                    <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
                        <p>
                            <strong>Form Valid:</strong> {form.formState.isValid ? "Yes" : "No"}
                        </p>
                        <p>
                            <strong>Errors:</strong> {Object.keys(form.formState.errors).length}
                        </p>

                        {Object.keys(form.formState.errors).length > 0 && (
                            <div className="mt-4">
                                <strong className="text-red-600">Form Errors:</strong>
                                <div className="mt-2 space-y-1">{renderFormErrors(form.formState.errors)}</div>
                            </div>
                        )}
                    </div>
                </Form>
            </Tabs>
        </div>
    )
}
