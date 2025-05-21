"use client"
import { useState, useEffect, useRef } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CardFooter } from "../ui/card"
import { ArrowLeft, ImageIcon, Loader2, Save, Upload } from "lucide-react"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Editor } from "@tinymce/tinymce-react"
import { editorConfig } from "@/utils/editor-config"
import { placeholdersNews } from "@/utils/input-placeholders"
import {
  useAddBlogsMutation,
  useGetBlogsBySlugQuery,
  useUpdateBlogsMutation,
  useUploadFileMutation,
} from "@/store/handexApi"
import { Textarea } from "../ui/textarea"
import { toast } from "react-toastify"
import { formSchemaNews } from "@/validations/home/news.validation"
import type { imageState } from "@/types/home/graduates.dto"
import { validateImage } from "@/validations/upload.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"

export function BlogsForm({ slug }: { slug?: string }) {
  const apiKey = process.env.NEXT_PUBLIC_EDITOR_API_KEY
  const [selectedLanguage, setSelectedLanguage] = useState<string>("az")
  const [languagesSkip, setLanguagesSkip] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedTab, setSelectedTab] = useState("content")
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

  const [uploadImage, { isLoading: upLoading, isSuccess: upSucces }] = useUploadFileMutation()
  const [addBlogs, { isLoading: newsLoading, isSuccess: newsSucces }] = useAddBlogsMutation()
  const [updateBlogs, { isLoading: blogsUpLoading, isSuccess: blogsUpSucces }] = useUpdateBlogsMutation()
  const {
    data: blogs,
    isLoading: newsByIdLoading,
    isError,
    error,
    refetch,
  } = useGetBlogsBySlugQuery(
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
  }

  useEffect(() => {
    if (slug && blogs) {
      form.setValue(`title_${selectedLanguage}` as "title_az" | "title_en" | "title_ru", blogs.title)
      form.setValue(`content_${selectedLanguage}` as "content_az" | "content_en" | "content_ru", blogs.description)
      form.setValue(
        `meta_${selectedLanguage}` as "meta_az" | "meta_en" | "meta_ru",
        blogs.meta[0].value ? blogs.meta[0].value : "",
      )

      if (blogs.meta && blogs.meta[0] && blogs.meta[0].length > 0) {
        form.setValue("metaName", blogs.meta[0].name || "description")
      }

      if (blogs.image?.id) {
        form.setValue("featuredImage", blogs.image.id)
        setImageState({ ...imageState, preview: blogs.image.url || null, id: blogs.image.id })
      }
      form.setValue("slug", blogs.slug)
    }
  }, [blogs, slug])

  const form = useForm<z.infer<typeof formSchemaNews>>({
    defaultValues,
    resolver: zodResolver(formSchemaNews),
  })

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
              { name: values.metaName, value: values.meta_az, lang: "az" },
              { name: values.metaName, value: values.meta_en, lang: "en" },
              { name: values.metaName, value: values.meta_ru, lang: "ru" },
            ],
          },
        ],
        slug: values.slug,
      }

      !slug ? await addBlogs(postValue).unwrap() : await updateBlogs({ params: postValue, id: blogs.id }).unwrap()
      toast.success("Bloq uğurla yükləndi")
    } catch (error) {
      toast.error("Bloq yüklənərkən xəta baş verdi")
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validationImage = validateImage(file, setImageState, imageState)
      if (validationImage === false) {
        return
      }
      // Just store the file and show preview without uploading
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
    if (fileInputRef.current) {
      fileInputRef.current?.click()
    }
  }

  return newsByIdLoading ? (
    <div className="flex items-center justify-center">
      <Loader2 className="animate-spin w-10 h-10" />
    </div>
  ) : (
    <div>
      <Button className="my-5" variant="outline" size="sm" asChild>
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Bloqlara qayıt
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
                  <Tabs
                    value={selectedLanguage}
                    onValueChange={(language) => {
                      setSelectedLanguage(language)
                      setLanguagesSkip((prev) => [...prev, selectedLanguage])
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ru">Русский</TabsTrigger>
                    </TabsList>

                    {["az", "en", "ru"].map((lang, index) => (
                      <TabsContent key={index} value={lang} className="space-y-6">
                        <FormField
                          control={form.control}
                          name={`title_${lang}` as keyof z.infer<typeof formSchemaNews>}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{lang === "az" ? "Başlıq" : lang === "en" ? "Title" : "Заголовок"}</FormLabel>
                              <FormControl>
                                <Input placeholder={placeholdersNews[lang].title} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`content_${lang}` as keyof z.infer<typeof formSchemaNews>}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {lang === "az" ? "Məzmun" : lang === "en" ? "Content" : "Содержание"}
                              </FormLabel>
                              <FormControl>
                                <Editor
                                  value={field.value as string}
                                  onEditorChange={(content) => {
                                    field.onChange(content)
                                  }}
                                  apiKey={apiKey}
                                  init={{
                                    ...editorConfig,
                                    language: lang,
                                    placeholder: placeholdersNews[lang].content,
                                  }}
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
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                              <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                                {imageState.isUploading ? (
                                  <div className="w-full h-full flex justify-center items-center">
                                    <Loader2 className="h-8 w-8 animate-spin" />
                                  </div>
                                ) : imageState.preview ? (
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
                                {imageState.preview && (
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

                            {imageState.preview && !imageState.id && (
                              <div className="space-y-4">
                                <FormField
                                  control={form.control}
                                  name="imageAlt"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Şəkil təsviri (Alt text)</FormLabel>
                                      <FormControl>
                                        <Input
                                          placeholder="Şəkil haqqında təsvir yazın"
                                          {...field}
                                          value={field.value || ""}
                                        />
                                      </FormControl>
                                      <FormDescription>
                                        Bu təsvir şəkil yüklənərkən backend-ə göndəriləcək
                                      </FormDescription>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <Button
                                  type="button"
                                  onClick={uploadSelectedImage}
                                  disabled={imageState.isUploading}
                                  className="w-full"
                                >
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
                                </Button>
                              </div>
                            )}

                            {imageState.id && (
                              <FormField
                                control={form.control}
                                name="imageAlt"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Şəkil təsviri (Alt text)</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Şəkil haqqında təsvir yazın"
                                        {...field}
                                        value={field.value || ""}
                                        disabled
                                      />
                                    </FormControl>
                                    <FormDescription>
                                      Şəkil artıq yüklənib. Dəyişmək üçün şəkli silib yenidən yükləyin.
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            )}
                          </div>
                        </FormControl>
                        {imageState.error && <p className="text-sm text-destructive mt-1">{imageState.error}</p>}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
                <TabsContent value="meta" className="space-y-6">
                  {/* Meta Name Field - Common for all languages */}
                  <FormField
                    control={form.control}
                    name="metaName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Adı</FormLabel>
                        <FormControl>
                          <Input placeholder="Meta adını daxil edin" {...field} />
                        </FormControl>
                        <FormDescription>
                          Bu ad bütün dillər üçün eyni olacaq (məsələn: description, keywords, author)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Meta Content Fields - Language specific */}
                  <Tabs
                    value={selectedLanguage}
                    onValueChange={(language) => {
                      setSelectedLanguage(language)
                      setLanguagesSkip((prev) => [...prev, selectedLanguage])
                    }}
                  >
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ru">Русский</TabsTrigger>
                    </TabsList>

                    {["az", "en", "ru"].map((lang, index) => (
                      <TabsContent key={index} value={lang} className="space-y-6">
                        <FormField
                          control={form.control}
                          name={`meta_${lang}` as keyof z.infer<typeof formSchemaNews>}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Meta Məzmunu</FormLabel>
                              <FormControl>
                                <Textarea placeholder={placeholdersNews[lang].meta} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Slug əlavə edin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </div>
            </div>
            <CardFooter className="flex flex-col gap-2">
              <Button type="submit" className="w-full">
                {newsLoading ? (
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
        </Form>
      </Tabs>
    </div>
  )
}
