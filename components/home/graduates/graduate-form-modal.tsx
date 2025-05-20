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
import { Button } from "@/components/ui/button"
import type { GraduateFormModalProps } from "@/types/home/graduates.dto"
import { Upload, Loader2, ImageIcon } from "lucide-react"
import { toast } from "react-toastify"
import Image from "next/image"
import { useRef } from "react"

export default function GraduateFormModal({
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
    imageInputId = "image-upload",
    uploadImage,
}: GraduateFormModalProps & { uploadImage?: (file: File, alt: string) => Promise<any> }) {
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

        form.setValue("image", -1)
        form.setValue("imageAlt", "")
    }

    // Check if form submission should be blocked due to unuploaded image
    const handleFormSubmit = async (data: any) => {
        // Check if we have an unuploaded image
        if (imageState.selectedFile && !imageState.id && uploadImage) {
            toast.error("Zəhmət olmasa əvvəlcə şəkili yükləyin")
            return
        }

        // Call the original onSubmit function
        await onSubmit(data)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                        {/* Custom image upload section */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Şəkil</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                                                    {isUploading ? (
                                                        <div className="w-full h-full flex justify-center items-center">
                                                            <Loader2 className="h-8 w-8 animate-spin" />
                                                        </div>
                                                    ) : imageState.preview ? (
                                                        <Image
                                                            src={imageState.preview || "/placeholder.svg"}
                                                            alt="Preview"
                                                            width={160}
                                                            height={160}
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
                                                        onChange={handleImageChange}
                                                        className="hidden"
                                                        id={imageInputId}
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
                                                    <input type="hidden" value={field.value || ""} onChange={field.onChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ad Soyad</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Məzunun adı və soyadı" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="speciality"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>İxtisas</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Məzunun ixtisası" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
