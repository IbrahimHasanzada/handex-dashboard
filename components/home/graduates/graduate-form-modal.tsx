"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import type React from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Loader2, ImageIcon, X } from "lucide-react"
import { toast } from "react-toastify"
import Image from "next/image"
import { useRef } from "react"
import { TranslationFormModalProps } from "@/types/home/graduates.dto"

const languages = [
    { code: "az", name: "Azərbaycan", flag: "🇦🇿" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
]

export default function TranslationFormModal({
    open,
    onOpenChange,
    title,
    description,
    form,
    imageState,
    setImageState,
    handleImageChange: originalHandleImageChange,
    onSubmit,
    isLoading,
    isUploading,
    submitButtonText,
    loadingText,
    imageInputId = "translation-image-upload",
    uploadImage,
    selectedLanguage,
    singleLanguageMode = false,
}: TranslationFormModalProps & { uploadImage?: (file: File, alt: string) => Promise<any> }) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setImageState({
            ...imageState,
            preview: URL.createObjectURL(file),
            id: null,
            selectedFile: file,
        })
    }

    const handleUploadWithAlt = async () => {
        if (!imageState.selectedFile) {
            toast.error("Zəhmət olmasa əvvəlcə şəkil seçin")
            return
        }

        if (!uploadImage) {
            toast.error("Şəkil yükləmə funksiyası təyin edilməyib")
            return
        }

        try {
            await uploadImage(imageState.selectedFile as File, form.getValues("imageAlt") || "")
            toast.success("Şəkil uğurla yükləndi")
        } catch (error) {
            toast.error("Şəkil yükləyərkən xəta baş verdi")
        }
    }

    const handleSelectImage = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    const handleRemoveImage = () => {
        if (imageState.preview && !imageState.id) {
            URL.revokeObjectURL(imageState.preview)
        }
        setImageState({
            ...imageState,
            preview: null,
            id: null,
            selectedFile: null,
        })

        if (singleLanguageMode) {
            form.setValue("images", [])
        } else {
            const currentImages = form.getValues("images")
            if (imageState.id) {
                const updatedImages = currentImages.filter((id: number) => id !== imageState.id)
                form.setValue("images", updatedImages)
            }
        }

        form.setValue("imageAlt", "")
    }

    const handleFormSubmit = async (data: any) => {
        if (imageState.selectedFile && !imageState.id && uploadImage) {
            toast.error("Zəhmət olmasa əvvəlcə şəkili yükləyin")
            return
        }

        await onSubmit(data)
    }

    const getCurrentLanguage = () => {
        if (selectedLanguage) {
            return languages.find((lang) => lang.code === selectedLanguage)
        }
        return languages[0]
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                        {/* Image Upload Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Şəkil</h3>
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-32 w-32 overflow-hidden rounded-md border">
                                        {isUploading ? (
                                            <div className="w-full h-full flex justify-center items-center">
                                                <Loader2 className="h-8 w-8 animate-spin" />
                                            </div>
                                        ) : imageState.preview ? (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={imageState.preview || "/placeholder.svg"}
                                                    alt="Preview"
                                                    width={128}
                                                    height={128}
                                                    className="h-full w-full object-cover"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-1 right-1 h-6 w-6 p-0"
                                                    onClick={handleRemoveImage}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id={imageInputId}
                                        />
                                        <Button type="button" variant="outline" onClick={handleSelectImage}>
                                            Şəkil seç
                                        </Button>
                                    </div>
                                </div>

                                {/* Alt text field - only show when an image is selected but not uploaded */}
                                {imageState.preview && !imageState.id && (
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name="imageAlt"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Şəkil təsviri (Alt text)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Şəkil haqqında təsvir yazın" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="button" onClick={handleUploadWithAlt} disabled={isUploading} className="w-full">
                                            {isUploading ? (
                                                <span className="flex items-center">
                                                    <Loader2 className="animate-spin h-4 w-4 mr-1" />
                                                    Yüklənir...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <Upload className="h-4 w-4 mr-1" />
                                                    Şəkili yüklə
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Translations Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">
                                {singleLanguageMode ? `${getCurrentLanguage()?.name} Tərcüməsi` : "Tərcümələr"}
                            </h3>

                            {singleLanguageMode ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="text-2xl">{getCurrentLanguage()?.flag}</span>
                                        <span className="font-medium">{getCurrentLanguage()?.name}</span>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ad Soyad</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={`${getCurrentLanguage()?.name} dilində məzun adı və soyadı`} {...field} />
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
                                                <FormLabel>İxtisas</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={`${getCurrentLanguage()?.name} dilində ixtisas adı`}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Hidden field for language code */}
                                    <input type="hidden" {...form.register("lang")} value={selectedLanguage} />
                                </div>
                            ) : (
                                <Tabs defaultValue="az" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        {languages.map((lang) => (
                                            <TabsTrigger key={lang.code} value={lang.code} className="flex items-center gap-2">
                                                <span>{lang.flag}</span>
                                                <span>{lang.name}</span>
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {languages.map((lang, index) => (
                                        <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                                            <FormField
                                                control={form.control}
                                                name={`translations.${index}.title`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Ad Soyad ({lang.name})</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder={`${lang.name} dilində məzun adı və soyadı`} {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name={`translations.${index}.desc`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>İxtisas ({lang.name})</FormLabel>
                                                        <FormControl>
                                                            <Textarea
                                                                placeholder={`${lang.name} dilində ixtisas adı`}
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            {/* Hidden field for language code */}
                                            <input type="hidden" {...form.register(`translations.${index}.lang`)} value={lang.code} />
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Ləğv et
                            </Button>
                            <Button type="submit" disabled={isLoading || isUploading}>
                                {isLoading ? loadingText : submitButtonText}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
