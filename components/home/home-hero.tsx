"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { AlertCircle, Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAddHeroMutation, useGetHeroHomeQuery, useUploadFileMutation } from "@/store/handexApi"
import { formSchema, FormValues } from "@/validations/home/hero.validation"
import { toast } from "react-toastify"

const HomeHero = () => {
    const [activeLanguage, setActiveLanguage] = useState<string>("az")
    const {
        data: heroData,
        refetch: fetchHero,
        isFetching,
        isLoading,
    } = useGetHeroHomeQuery(activeLanguage, { skip: false })
    const [addHero, { data: addHeroData, isLoading: isSubmitting }] = useAddHeroMutation()
    const [uploadImage, { data: UploadData }] = useUploadFileMutation()
    const [isEditing, setIsEditing] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    console.log(heroData)
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            desc: "",
            meta: "",
        },
    })

    const watchImage = watch("image")

    useEffect(() => {
        if (watchImage && watchImage.length > 0) {
            const file = watchImage[0]
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }, [watchImage])

    useEffect(() => {
        fetchHero()
        if (!isLoading && heroData) {
            reset({
                title: heroData[0]?.title || "",
                desc: heroData[0]?.desc || "",
                meta: heroData[0]?.meta?.find((m: any) => m.translations[0]?.name === "hero")?.translations[0]?.value || "",
            })

            if (heroData[0]?.images && heroData[0]?.images[0]?.url) {
                setImagePreview(heroData[0].images[0].url)
            }
        }
    }, [isEditing, heroData, activeLanguage, reset, isLoading])

    const onSubmit = async (data: FormValues) => {
        try {
            let imageData = null
            if (data.image && data.image.length > 0) {
                try {
                    const formData = new FormData()
                    formData.append("file", data.image[0])
                    const response = await uploadImage(formData)
                    console.log(response)
                    if (response.data) imageData = response.data.id
                } catch (error) {
                    toast.error("Şəkil yükləyərkən xəta baş verdi.")
                }
            }

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
                ...(imageData && { image: imageData }),
            }

            console.log(newBannerData)
            await addHero({ params: newBannerData, id: heroData?.[0].id })
            setIsEditing(false)
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
                        <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
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
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                        <Tabs defaultValue="az" value={activeLanguage} onValueChange={setActiveLanguage}>
                            <TabsList className="mb-4">
                                <TabsTrigger value="az">Azərbaycan</TabsTrigger>
                                <TabsTrigger value="en">English</TabsTrigger>
                                <TabsTrigger value="ru">Русский</TabsTrigger>
                            </TabsList>

                            <TabsContent value={activeLanguage} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>
                                        Başlıq
                                    </Label>
                                    <Input id="title" {...register("title")} className={errors.title ? "border-destructive" : ""} />
                                    {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="desc" className={errors.desc ? "text-destructive" : ""}>
                                        Alt Başlıq
                                    </Label>
                                    <Textarea
                                        id="desc"
                                        {...register("desc")}
                                        rows={3}
                                        className={errors.desc ? "border-destructive" : ""}
                                    />
                                    {errors.desc && <p className="text-sm text-destructive">{errors.desc.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="meta" className={errors.meta ? "text-destructive" : ""}>
                                        Meta
                                    </Label>
                                    <Input id="meta" {...register("meta")} className={errors.meta ? "border-destructive" : ""} />
                                    {errors.meta && <p className="text-sm text-destructive">{errors.meta.message}</p>}
                                </div>
                            </TabsContent>
                        </Tabs>

                        <div className="space-y-4">
                            <Label>Banner Şəkli</Label>

                            <div className="relative w-full max-w-[300px] aspect-video bg-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview || "/placeholder.svg"}
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

                            <div className="flex items-center gap-2">
                                <Label htmlFor="image" className="cursor-pointer">
                                    <div className="flex h-10 px-4 py-2 bg-secondary text-secondary-foreground rounded-md items-center justify-center text-sm font-medium">
                                        Şəkli Dəyişdir
                                    </div>
                                    <Input id="image" type="file" accept="image/*" className="sr-only" {...register("image")} />
                                </Label>
                                {imagePreview && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setValue("image", undefined)
                                            setImagePreview(null)
                                        }}
                                    >
                                        Şəkli Sil
                                    </Button>
                                )}
                            </div>

                            {errors.image && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{errors.image.message}</AlertDescription>
                                </Alert>
                            )}
                        </div>
                    </form>
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
