"use client"

import { useState } from "react"
import { ImageUploadFormItem } from "../image-upload-form-item"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useUpdateAboutMutation, useUploadFileMutation } from "@/store/handexApi"
import { Button } from "../ui/button"
import { toast } from "react-toastify"
import { Save } from "lucide-react"
import { aboutImageSchema } from "@/validations/about/image-about"
import { validateImage } from "@/validations/upload.validation"

export function AddImageModal({ open, onOpenChange, refetch, data }) {
    const [imageState, setImageState] = useState({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
    })

    const form = useForm({
        defaultValues: {
            image: -1,
            imageAlt: "",
        },
        resolver: zodResolver(aboutImageSchema),
    })

    const {
        handleSubmit,
        formState: { errors },
        reset,
    } = form

    const [uploadImage, { isLoading: upLoading }] = useUploadFileMutation()
    const [addImageAbout, { isLoading }] = useUpdateAboutMutation()

    const handleImageChange = (e) => {
        const files = e.target.files

        if (!files || files.length === 0) {
            setImageState({
                preview: null,
                id: null,
                error: "File seçilməyib",
                selectedFile: null,
            })
            return
        }

        const file = files[0]
        const validationImage = validateImage(file, setImageState, imageState)
        if (validationImage === false) return

        const previewUrl = URL.createObjectURL(file)
        setImageState({
            preview: previewUrl,
            id: null,
            error: null,
            selectedFile: file,
        })
    }

    const onSubmit = async () => {
        try {
            if (!imageState.selectedFile) {
                setImageState({ ...imageState, error: "Şəkil seçilməyib" })
                return
            }

            const altText = form.getValues("imageAlt") || ""

            const formData = new FormData()
            formData.append("file", imageState.selectedFile)
            formData.append("alt", altText)

            console.log({ file: formData.get('file'), alt: formData.get('alt') })

            const response = await uploadImage(formData).unwrap()

            await addImageAbout({
                images: [...data, response.id],
            }).unwrap()

            toast.success("Məlumat uğurla yükləndi")
            refetch()
            onOpenChange(false)
            setImageState({ preview: null, id: null, error: null, selectedFile: null })
            reset()
        } catch (error) {
            toast.error("Məlumat yüklənərkən xəta baş verdi", error.data?.message || "Xəta baş verdi")
        }
    }

    const cleanupPreview = () => {
        if (imageState.preview && !imageState.id) {
            URL.revokeObjectURL(imageState.preview)
        }
    }

    const handleModalClose = (open) => {
        if (!open) {
            cleanupPreview()
            setImageState({ preview: null, id: null, error: null, selectedFile: null })
            reset()
        }
        onOpenChange(open)
    }

    return (
        <Dialog open={open} onOpenChange={handleModalClose}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle>Yeni şəkil əlavə et</DialogTitle>
                        <DialogDescription>Haqqımızda səhifənizə yeni şəkil əlavə edin.</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="-mx-6">
                    <FormProvider {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <ImageUploadFormItem
                                setImageState={setImageState}
                                imageState={imageState}
                                form={form}
                                handleImageChange={handleImageChange}
                                name="image"
                                isUploading={upLoading || isLoading}
                                error={errors.imageId?.message}
                                altFieldName="imageAlt"
                            />

                            <div className="flex justify-end mt-6 p-2">
                                <Button type="submit" disabled={isLoading || upLoading || !imageState.selectedFile}>
                                    {isLoading || upLoading ? "Əlavə edilir..." : "Şəkil əlavə et"}
                                    <Save className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </DialogContent>
        </Dialog>
    )
}
