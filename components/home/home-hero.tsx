"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { useAddHeroMutation, useGetHeroQuery, useUploadFileMutation } from "@/store/handexApi"
import { formSchema, type FormValues } from "@/validations/home/hero.validation"
import { toast } from "react-toastify"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ImageUploadFormItem } from "../image-upload-form-item"
import { validateImage } from "@/validations/upload.validation"
import type { imageState } from "@/types/home/graduates.dto"

const HomeHero = () => {
    const [activeLanguage, setActiveLanguage] = useState<string>("az")
    const {
        data: heroData,
        refetch: fetchHero,
        isFetching,
        isLoading,
    } = useGetHeroQuery({ slug: "hero", lang: activeLanguage, scope: "componentA" }, { skip: false })
    const [addHero, { data: addHeroData, isLoading: isSubmitting }] = useAddHeroMutation()
    const [uploadImage, { data: uploadData, isLoading: isUploading }] = useUploadFileMutation()
    const [imageState, setImageState] = useState<imageState>({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
        alt: null
    })
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            desc: "",
            image: -1,
            imageAlt: "",
        },
    })

    useEffect(() => {
        fetchHero()
        if (!isLoading && heroData) {
            form.reset({
                title: heroData[0].title || "",
                desc: heroData[0].desc || "",
                image: heroData[0].images[0]?.id || -1,
                imageAlt: heroData[0].images[0]?.alt || "",
            })

            if (heroData[0]?.images && heroData[0]?.images[0]?.url) {
                setImageState({
                    preview: heroData[0].images[0].url,
                    id: heroData[0].images[0].id,
                    error: null,
                    selectedFile: null,
                })
            }
        }
    }, [isEditing, heroData, activeLanguage, form.reset, isLoading])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            if (response) {
                setImageState({
                    preview: response.url,
                    id: response.id,
                    error: null,
                    selectedFile: null,
                    alt: form.getValues("imageAlt")
                })

                form.setValue("image", response.id)
                toast.success("Şəkil uğurla yükləndi")
            }
        } catch (error: any) {
            toast.error(error.data?.message || "Şəkil yükləyərkən xəta baş verdi")
            setImageState({
                ...imageState,
                error: "Şəkil yükləyərkən xəta baş verdi",
            })
        }
    }

    const onSubmit = async (data: FormValues) => {
        try {
            if (imageState.selectedFile && !imageState.id) {
                toast.error("Zəhmət olmasa əvvəlcə şəkili yükləyin")
                return
            }

            const newBannerData = {
                translations: [
                    {
                        title: data.title,
                        desc: data.desc,
                        lang: activeLanguage,
                    },
                ],
                ...(imageState.id && { images: [imageState.id] }),
            }

            await addHero({ params: newBannerData, id: heroData?.[0]?.id })
            setIsEditing(false)
            toast.success("Məlumat uğurla yeniləndi")
        } catch (error) {
            toast.error("Məlumatı yükləyərkən xəta baş verdi")
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Ana Səhifə Banner</CardTitle>
                    <CardDescription>Saytın əsas banner bölməsini idarə edin</CardDescription>
                </div>
                {isEditing ? (
                    <div className="space-x-2">
                        <Button variant="outline" onClick={() => setIsEditing(!isEditing)} disabled={isSubmitting}>
                            Ləğv Et
                        </Button>
                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || isUploading}>
                            {isSubmitting ? "Yüklənir..." : "Yadda Saxla"}
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                        Redaktə Et
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <Tabs defaultValue="az" value={activeLanguage} onValueChange={setActiveLanguage}>
                                <TabsContent value={activeLanguage} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Başlıq</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Banner başlığı" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="desc"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Alt Başlıq</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Banner alt başlığı" rows={3} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </Tabs>

                            <div className="space-y-4">
                                <Label>Banner Şəkli</Label>

                                <ImageUploadFormItem
                                    form={form}
                                    name="image"
                                    imageState={imageState}
                                    setImageState={setImageState}
                                    handleImageChange={handleImageChange}
                                    isUploading={isUploading}
                                    isEditing={isEditing}
                                    imageInputId="banner-image"
                                    label="Şəkli Dəyişdir"
                                    altFieldName="imageAlt"
                                />

                                {imageState.preview && !imageState.id && (
                                    <Button type="button" onClick={uploadSelectedImage} disabled={isUploading} className="w-full mt-2">
                                        {isUploading ? "Yüklənir..." : "Şəkili yüklə"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                ) : (
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <div className="space-y-2">
                                <div className="font-medium text-sm text-muted-foreground">Başlıq</div>
                                <div className="font-semibold">{heroData?.[0]?.title}</div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <div className="font-medium text-sm text-muted-foreground">Alt Başlıq</div>
                                <div className="text-sm">{heroData?.[0]?.desc}</div>
                            </div>

                            <div className="mt-4">
                                <Tabs defaultValue="az" value={activeLanguage} onValueChange={setActiveLanguage}>
                                    <TabsList>
                                        <TabsTrigger value="az">AZ</TabsTrigger>
                                        <TabsTrigger value="en">EN</TabsTrigger>
                                        <TabsTrigger value="ru">RU</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                        <div className="relative w-full max-w-[300px] aspect-video bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                            {heroData?.[0]?.images?.[0]?.url ? (
                                <Image
                                    src={heroData[0]?.images[0]?.url || "/placeholder.svg"}
                                    alt="Banner image"
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center text-muted-foreground">
                                    <Upload className="h-10 w-10 mb-2" />
                                    <span>Şəkil yoxdur</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default HomeHero
