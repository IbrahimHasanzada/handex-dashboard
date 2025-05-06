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
import { useAddHeroMutation, useGetHeroHomeQuery, useUploadFileMutation } from "@/store/handexApi"
import { formSchema, type FormValues } from "@/validations/home/hero.validation"
import { toast } from "react-toastify"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { ImageUploadFormItem } from "../image-upload-form-item"

const HomeHero = () => {
    const [activeLanguage, setActiveLanguage] = useState<string>("az")
    const {
        data: heroData,
        refetch: fetchHero,
        isFetching,
        isLoading,
    } = useGetHeroHomeQuery(activeLanguage, { skip: false })
    const [addHero, { data: addHeroData, isLoading: isSubmitting }] = useAddHeroMutation()
    const [uploadImage, { data: uploadData, isLoading: isUploading }] = useUploadFileMutation()
    const [imageState, setImageState] = useState<{
        preview: string | null
        id: string | null
        error: string | null
    }>({
        preview: null,
        id: null,
        error: null,
    })
    const [isEditing, setIsEditing] = useState(false)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            desc: "",
            meta: "",
            image: null,
        },
    })

    useEffect(() => {
        fetchHero()
        if (!isLoading && heroData) {
            form.reset({
                title: heroData[0]?.title || "",
                desc: heroData[0]?.desc || "",
                meta: heroData[0]?.meta?.find((m: any) => m.translations[0]?.name === "hero")?.translations[0]?.value || "",
                image: null,
            })

            if (heroData[0]?.images && heroData[0]?.images[0]?.url) {
                setImageState({
                    preview: heroData[0].images[0].url,
                    id: heroData[0].images[0].id,
                    error: null,
                })
            }
        }
    }, [isEditing, heroData, activeLanguage, form.reset, isLoading])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setImageState({
                ...imageState,
                error: "Zəhmət olmasa şəkil faylı yükləyin",
            })
            return
        }

        // Validate file size (e.g., 5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            setImageState({
                ...imageState,
                error: "Şəkil ölçüsü 5MB-dan az olmalıdır",
            })
            return
        }

        try {
            // Create a preview URL
            const previewUrl = URL.createObjectURL(file)

            // Set the preview while uploading
            setImageState({
                preview: previewUrl,
                id: null,
                error: null,
            })

            // Create form data for upload
            const formData = new FormData()
            formData.append("file", file)

            // Upload the file
            const response = await uploadImage(formData)

            if (response.data) {
                // Update state with the uploaded image ID
                setImageState({
                    preview: previewUrl,
                    id: response.data.id,
                    error: null,
                })

                // Update form value
                form.setValue("image", response.data.id)
            }
        } catch (error) {
            setImageState({
                ...imageState,
                error: "Şəkil yükləyərkən xəta baş verdi",
            })
        }
    }

    const onSubmit = async (data: FormValues) => {
        try {
            const newBannerData = {
                translations: [
                    {
                        title: data.title,
                        desc: data.desc,
                        lang: activeLanguage,
                    },
                ],
                meta: [
                    {
                        translations: [
                            {
                                name: "hero",
                                value: data.meta,
                                lang: activeLanguage,
                            },
                        ],
                    },
                ],
                ...(imageState.id && { image: imageState.id }),
            }

            await addHero({ params: newBannerData, id: heroData?.[0]?.id })
            setIsEditing(false)
            toast.success("Məlumat uğurla yeniləndi")
        } catch (error) {
            toast.error("Məlumatı yükləyərkən xəta baş verdi")
        }
    }

    const editHero = () => setIsEditing(!isEditing)

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Ana Səhifə Banner</CardTitle>
                    <CardDescription>Saytın əsas banner bölməsini idarə edin</CardDescription>
                </div>
                {isEditing ? (
                    <div className="space-x-2">
                        <Button variant="outline" onClick={editHero} disabled={isSubmitting}>
                            Ləğv Et
                        </Button>
                        <Button onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting || isUploading}>
                            {isSubmitting ? "Yüklənir..." : "Yadda Saxla"}
                        </Button>
                    </div>
                ) : (
                    <Button variant="outline" onClick={editHero}>
                        Redaktə Et
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {isEditing ? (
                    <Form {...form}>
                        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                            <Tabs defaultValue="az" value={activeLanguage} onValueChange={setActiveLanguage}>
                                <TabsList className="mb-4">
                                    <TabsTrigger value="az">Azərbaycan</TabsTrigger>
                                    <TabsTrigger value="en">English</TabsTrigger>
                                    <TabsTrigger value="ru">Русский</TabsTrigger>
                                </TabsList>

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

                                    <FormField
                                        control={form.control}
                                        name="meta"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Meta</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Meta məlumatı" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </Tabs>

                            <div className="space-y-4">
                                <Label>Banner Şəkli</Label>

                                <div className="relative w-full max-w-[300px] aspect-video bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                                    {imageState.preview ? (
                                        <Image
                                            src={imageState.preview || "/placeholder.svg"}
                                            alt="Banner preview"
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Upload className="h-10 w-10 mb-2" />
                                            <span>Şəkil seçilməyib</span>
                                        </div>
                                    )}
                                </div>

                                <ImageUploadFormItem
                                    form={form}
                                    name="image"
                                    imageState={imageState}
                                    setImageState={setImageState}
                                    handleImageChange={handleImageChange}
                                    isUploading={isUploading}
                                    imageInputId="banner-image"
                                    label="Şəkli Dəyişdir"
                                />
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
                                    src={heroData[0].images[0].url || "/placeholder.svg"}
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
