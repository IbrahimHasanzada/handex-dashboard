"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardFooter } from "../ui/card"
import { ImageIcon, Loader, Loader2, Save } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Editor } from '@tinymce/tinymce-react';
import { editorConfig } from "@/utils/editor-config"
import { placeholdersNews } from "@/utils/input-placeholders"
import { useAddNewsMutation, useGetNewsByIdQuery, useUpdateNewsMutation, useUploadFileMutation } from "@/store/handexApi"
import { Textarea } from "../ui/textarea"
import { toast } from "react-toastify"
import { formSchemaNews } from "@/validations/news.validation"
import { imageState } from "@/types/home/graduates.dto"
import { validateImage } from "@/validations/upload.validation"
import { zodResolver } from "@hookform/resolvers/zod"



export function NewsForm({ id }: { id?: string }) {
    const apiKey = process.env.NEXT_PUBLIC_EDITOR_API_KEY;
    const [selectedLanguage, setSelectedLanguage] = useState<string>("az");
    const [languagesSkip, setLanguagesSkip] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedTab, setSelectedTab] = useState("content");
    const [imageState, setImageState] = useState<imageState>({ preview: null, id: null, error: null })
    const [uploadImage, { isLoading: upLoading, isSuccess: upSucces }] = useUploadFileMutation()
    const [addNews, { isLoading: newsLoading, isSuccess: newsSucces }] = useAddNewsMutation()
    const [updateNews, { isLoading: newsUpLoading, isSuccess: newsUpSucces }] = useUpdateNewsMutation()
    const { data: news, isLoading: newsByIdLoading, isError, error, refetch } = useGetNewsByIdQuery(
        {
            id,
            language: selectedLanguage ? selectedLanguage : "az"
        },
        {
            pollingInterval: 0,
            refetchOnMountOrArgChange: true,
            skip: languagesSkip.includes(selectedLanguage) || !id
        }
    )
    const defaultValues = {
        title_az: "",
        title_en: "",
        title_ru: "",
        content_az: "",
        content_en: "",
        content_ru: "",
        featuredImage: -1,
        meta_az: "",
        meta_en: "",
        meta_ru: "",
    }

    useEffect(() => {
        if (id && news) {

            form.setValue(`title_${selectedLanguage}` as "title_az" | "title_en" | "title_ru", news.title);
            form.setValue(`content_${selectedLanguage}` as "content_az" | "content_en" | "content_ru", news.description);
            form.setValue(`meta_${selectedLanguage}` as "meta_az" | "meta_en" | "meta_ru", news.meta ? news.meta : "");

            if (news.image?.id) {
                form.setValue("featuredImage", news.image.id);
                setImageState({ ...imageState, preview: news.image.url || null, id: news.image.id });
            }
        }
    }, [news, id]);

    const form = useForm<z.infer<typeof formSchemaNews>>({
        defaultValues,
        resolver: zodResolver(formSchemaNews)
    });

    async function onSubmit(values: z.infer<typeof formSchemaNews>) {
        try {
            const postValue = {
                image: values.featuredImage,
                translations: [
                    { title: values.title_az, description: values.content_az, lang: "az" },
                    { title: values.title_en, description: values.content_en, lang: "en" },
                    { title: values.title_ru, description: values.content_ru, lang: "ru" },
                ],
                meta: [
                    {
                        translations: [
                            { name: "news", value: values.meta_az, lang: "az" },
                            { name: "news", value: values.meta_en, lang: "en" },
                            { name: "news", value: values.meta_ru, lang: "ru" }
                        ]
                    }
                ]
            }


            !id ? await addNews(postValue).unwrap() : await updateNews({ params: postValue, id }).unwrap()
            toast.success('Xəbər uğurla yükləndi')
        } catch (error) {
            toast.error('Xəbər yüklənərkən xəta baş verdi')
        }

    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const validationImage = validateImage(file, setImageState, imageState)
            if (validationImage === false) {
                return
            }
            try {
                const formData = new FormData()
                formData.append("file", file)
                const response = await uploadImage(formData).unwrap()
                setImageState({ ...imageState, preview: response?.url })
                form.setValue("featuredImage", response?.id);
                upSucces && toast.success("Şəkil uğurla yükləndi")
            } catch (error) {
                toast.error('Şəkil yükləyərkən xəta baş verdi')
            }
        };
    }


    const handleRemoveImage = () => {
        setImageState({ ...imageState, preview: null });
        form.setValue("featuredImage", -1);
    };

    const handleSelectImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current?.click();
        }
    };

    return (
        newsByIdLoading ?
            <div className="flex items-center justify-center">
                <Loader2 className="animate-spin w-10 h-10" />
            </div >
            :
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full pt-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="media">Media</TabsTrigger>
                </TabsList>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <div className="md:col-span-3">
                                <TabsContent value="content" className="space-y-6">


                                    <Tabs value={selectedLanguage} onValueChange={(language) => {
                                        setSelectedLanguage(language);
                                        setLanguagesSkip((prev) => [...prev, selectedLanguage])

                                    }}>
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                                            <TabsTrigger value="en">English</TabsTrigger>
                                            <TabsTrigger value="ru">Русский</TabsTrigger>
                                        </TabsList>

                                        {["az", "en", "ru"].map((lang, index) => (
                                            <TabsContent key={index} value={lang} className="space-y-6">
                                                <FormField
                                                    control={form.control}
                                                    name={`title_${lang}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                {lang === "az" ? "Başlıq" : lang === "en" ? "Title" : "Заголовок"}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder={placeholdersNews[lang].title}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`content_${lang}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                {lang === "az" ? "Məzmun" : lang === "en" ? "Content" : "Содержание"}
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Editor
                                                                    value={field.value}
                                                                    onEditorChange={(content) => {
                                                                        field.onChange(content);
                                                                    }}
                                                                    apiKey={apiKey}
                                                                    init={{
                                                                        ...editorConfig,
                                                                        language: lang,
                                                                        placeholder: placeholdersNews[lang].content
                                                                    }}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`meta_${lang}`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>
                                                                Meta
                                                            </FormLabel>
                                                            <FormControl>
                                                                <Textarea
                                                                    placeholder={placeholdersNews[lang].meta}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </TabsContent>
                                <TabsContent value="media" className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="featuredImage"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Seçilmiş Şəkil</FormLabel>
                                                <FormControl>
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                                                            {upLoading ?
                                                                <div className="w-full h-full flex justify-center items-center">
                                                                    <Loader2 className="h-8 w-8 animate-spin" />
                                                                </div>
                                                                :
                                                                imageState.preview ? (
                                                                    <img
                                                                        src={imageState.preview || "/placeholder.svg"}
                                                                        alt="Featured image"
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="flex h-full w-full items-center justify-center bg-muted">
                                                                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                                                    </div>
                                                                )}
                                                        </div>
                                                        <div className="flex flex-col gap-2">
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                accept="image/*"
                                                                onChange={handleFileChange}
                                                                className="hidden"
                                                            />
                                                            <Button type="button" variant="outline" onClick={handleSelectImage}>
                                                                Şəkil seç
                                                            </Button>
                                                            {(imageState.preview) && (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    className="text-destructive"
                                                                    onClick={handleRemoveImage}
                                                                >
                                                                    Şəkli sil
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                {imageState.error && <p className="text-sm text-destructive mt-1">{imageState.error}</p>}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </div>
                        </div>
                        <CardFooter className="flex flex-col gap-2">
                            <Button
                                disabled={newsLoading}
                                type="submit"
                                className="w-full">
                                {newsLoading ?
                                    <div className="flex items-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Yüklənir...
                                    </div>
                                    :
                                    <div className="flex items-center">
                                        <Save className="mr-2 h-4 w-4" />
                                        Əlavə et
                                    </div>
                                }
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Tabs>)


}