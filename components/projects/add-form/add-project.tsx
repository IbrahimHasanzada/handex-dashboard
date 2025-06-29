"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardFooter } from "../../ui/card"
import { Loader2, Save } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import {
    useAddProjectsMutation,
    useGetProjectsBySlugQuery,
    useUpdateProjectsMutation,
    useUploadFileMutation,
} from "@/store/handexApi"
import { toast } from "react-toastify"
import type { imageState } from "@/types/home/graduates.dto"
import { validateImage } from "@/validations/upload.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { MetaTab } from "./meta-tab"
import { MediaTab } from "./media-tab"
import { ContentTab } from "./content-tab"
import { useRouter } from "next/navigation"
import { editFormSchemaNews, formSchemaNews } from "@/validations/home/news.validation"
import { renderFormErrors } from "@/utils/render-error"

export function ProjectsForm({ slug }: { slug?: string }) {
    const apiKey = process.env.NEXT_PUBLIC_EDITOR_API_KEY
    const [selectedLanguage, setSelectedLanguage] = useState<string>("az")
    const [languagesSkip, setLanguagesSkip] = useState<string[]>([])
    const [formEdited, setFormEdited] = useState<boolean>(false)
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
    const [uploadImage, { isLoading: upLoading }] = useUploadFileMutation()
    const [addprojetcs, { isLoading: projetcsLoading }] = useAddProjectsMutation()
    const [updateprojetcs, { isLoading: projetcsUpLoading }] = useUpdateProjectsMutation()


    const { data: projetcs, isLoading: projetcsByIdLoading } = useGetProjectsBySlugQuery(
        {
            slug,
            language: selectedLanguage,
        },
        {
            pollingInterval: 0,
            refetchOnMountOrArgChange: true,
            skip: languagesSkip.includes(selectedLanguage) || !slug
        },
    )

    const defaultValues = {
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

    let form: any
    if (projetcs) {
        form = useForm<z.infer<typeof editFormSchemaNews>>({
            defaultValues,
            resolver: zodResolver(editFormSchemaNews),
        })

    } else {
        form = useForm<z.infer<typeof formSchemaNews>>({
            defaultValues,
            resolver: zodResolver(formSchemaNews),
        })
    }

    const handleLanguageChange = (lang: string) => {
        setSelectedLanguage(lang)
        setLanguagesSkip((prev) => [...prev, selectedLanguage])
    }

    useEffect(() => {
        const subscription = form.watch(() => {
            setFormEdited(true)
        })
        return () => subscription.unsubscribe()
    }, [form])

    useEffect(() => {
        if (slug && projetcs) {
            form.setValue("imageAlt", projetcs.image.alt)
            form.setValue(`title_${selectedLanguage}` as "title_az" | "title_en" | "title_ru", projetcs.title || "")
            form.setValue(`content_${selectedLanguage}` as "content_az" | "content_en" | "content_ru", projetcs.description || "")

            if (projetcs.meta && projetcs.meta.length > 0) {
                if (projetcs.meta[0]) {
                    form.setValue(`meta_${selectedLanguage}` as "meta_az" | "meta_en" | "meta_ru", projetcs.meta[0].value || "")
                    form.setValue("metaName", projetcs.meta[0].name || "description")
                }

                if (projetcs.meta.length > 1) {
                    const existingAdditionalMeta = form.getValues("additionalMeta") || []

                    const updatedAdditionalMeta = projetcs.meta.slice(1).map((meta: any, index: number) => {
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

            if (projetcs.image?.id && !imageState.id) {
                form.setValue("featuredImage", projetcs.image.id)
                setImageState((prev) => ({
                    ...prev,
                    preview: projetcs.image.url || null,
                    id: projetcs.image.id,
                }))
            }

            if (!form.getValues("slug")) {
                form.setValue("slug", projetcs.slug)
            }

            setFormEdited(false)
        }
    }, [projetcs, slug, form])

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
                        ...(meta.meta_en !== "" ? [{ name: meta.metaName, value: meta.meta_en, lang: "en" }] : []),
                        ...(meta.meta_ru !== "" ? [{ name: meta.metaName, value: meta.meta_ru, lang: "ru" }] : []),
                    ],
                }
            })

            const postValue = {
                image: values.featuredImage,
                translations: [
                    { title: values.title_az, description: values.content_az, lang: "az" },
                    ...(values.title_en !== "" ? [{ title: values.title_en, description: values.content_en, lang: "en" }] : []),
                    ...(values.title_ru !== "" ? [{ title: values.title_ru, description: values.content_ru, lang: "ru" }] : []),
                ],
                meta: [
                    {
                        translations: mainMetaTranslations,
                    },
                    ...additionalMetaObjects,
                ],
                slug: values.slug,
            }
            !slug ? await addprojetcs(postValue).unwrap() : await updateprojetcs({ params: postValue, id: projetcs.id }).unwrap()
            slug ? toast.success("Layihə redaktə edildi") : toast.success("Layihə uğurla yükləndi")
            setFormEdited(false)
            router.push('/projects')
        } catch (error) {
            toast.error("Xəbər yüklənərkən xəta baş verdi")
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
            setFormEdited(true)
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
            setFormEdited(true)
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
        setFormEdited(true)
    }

    const handleSelectImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current?.click()
        }
        handleRemoveImage()
    }

    const addNewMetaField = () => {
        setMetaFields((prev) => [...prev, prev.length])
        const currentAdditionalMeta = form.getValues("additionalMeta") || []
        form.setValue("additionalMeta", [...currentAdditionalMeta, { metaName: "", meta_az: "", meta_en: "", meta_ru: "" }])
        setFormEdited(true)
    }

    return projetcsByIdLoading ? (
        <div className="flex items-center justify-center">
            <Loader2 className="animate-spin w-10 h-10" />
        </div>
    ) : (
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
                                    setSelectedLanguage={setSelectedLanguage}
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
                        <Button type="submit" className="w-full">
                            {projetcsLoading || projetcsUpLoading ? (
                                <div className="flex items-center">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Yüklənir...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <Save className="mr-2 h-4 w-4" />
                                    Əlavə et
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
    )
}
