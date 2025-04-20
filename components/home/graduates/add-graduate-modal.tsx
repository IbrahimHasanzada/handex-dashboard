"use client"
import { useState } from "react"
import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useAddProfilesMutation, useUploadFileMutation } from "@/store/handexApi"
import type { AddGraduateModalProps, imageState } from "@/types/home/graduates.dto"
import { z } from "zod"
import { validateImage } from "@/validations/upload.validation"
import { formSchema } from "@/validations/graduate.validation"

export default function AddGraduateModal({ open, onOpenChange, refetch }: AddGraduateModalProps) {
    const [addProfile, { isLoading }] = useAddProfilesMutation()
    const [uploadImage, { isLoading: isUploading }] = useUploadFileMutation()
    const [imageState, setImageState] = useState<imageState>({ preview: null, id: null, error: null })

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: { name: "", speciality: "", image: -1 },
        resolver: zodResolver(formSchema),
    })
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const validationResult = validateImage(file, setImageState, imageState)
        if (validationResult === false) return
        try {
            const formData = new FormData()
            formData.append("image", file)
            const response = await uploadImage(formData).unwrap()
            form.setValue("image", response.id)
            setImageState((prev) => ({ ...prev, id: response.id, error: null, preview: response.url }))
        } catch (error) {
            setImageState((prev) => ({ ...prev, error: "Şəkil yükləmə xətası baş verdi" }))
        }
    }

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const jsonData = {
                name: data.name,
                speciality: data.speciality,
                model: "student",
                image: data.image,
            }

            await addProfile(jsonData).unwrap()

            form.reset()
            setImageState({ preview: null, id: null, error: null })
            refetch()
            onOpenChange(false)
        } catch (error) {
            console.error("Məzun əlavə edilərkən xəta baş verdi:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yeni Məzun Əlavə Et</DialogTitle>
                    <DialogDescription>Məzun məlumatlarını daxil edin və yadda saxlayın.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="image"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center">
                                    <FormControl>
                                        <div className="relative">
                                            {imageState.preview ? (
                                                <div className="relative">
                                                    <Image
                                                        src={imageState.preview || "/placeholder.svg"}
                                                        alt="Preview"
                                                        width={100}
                                                        height={100}
                                                        className="rounded-lg object-cover"
                                                    />
                                                    <Button
                                                        type="button"
                                                        size="icon"
                                                        variant="secondary"
                                                        className="absolute -top-2 -right-2 h-6 w-6"
                                                        onClick={() => {
                                                            setImageState({ preview: null, id: null, error: null })
                                                            form.setValue("image", -1)
                                                        }}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                    <input type="hidden" value={field.value} onChange={field.onChange} />
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                                                        <div className="h-[100px] w-[100px] bg-muted rounded-lg flex items-center justify-center">
                                                            {isUploading ? (
                                                                <Loader2 className="h-8 w-8 animate-spin" />
                                                            ) : (
                                                                <Upload className="h-8 w-8" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-muted-foreground mt-2">Şəkil yüklə</span>
                                                    </label>
                                                    <input
                                                        id="image-upload"
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleImageChange}
                                                        disabled={isUploading}
                                                    />
                                                    <input type="hidden" value={field.value} onChange={field.onChange} />
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    {imageState.error && <p className="text-sm text-destructive mt-1">{imageState.error}</p>}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

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
                                {isLoading ? "Əlavə edilir..." : "Əlavə et"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
