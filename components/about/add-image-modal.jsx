"use client"

import { useState } from "react"
import { ImageUploadFormItem } from "../image-upload-form-item"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormProvider, useForm } from "react-hook-form"
import { useAddAboutMutation, useUploadFileMutation } from "@/store/handexApi"
import { Button } from "../ui/button"
import { toast } from "react-toastify"
import { Save } from "lucide-react"
import { aboutImageSchema } from "@/validations/about/image-about"

export function AddImageModal({ open, onOpenChange }) {
    const [imageState, setImageState] = useState({ preview: null, id: null, error: null })
    const form = useForm({
        defaultValues: {
            image: -1,
        },
        resolver: zodResolver(aboutImageSchema),
    })

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        getValues,
    } = form
    const [uploadImage, { isLoading: upLoading }] = useUploadFileMutation()
    const [addImageAbout, { isLoading }] = useAddAboutMutation()

    const onSubmit = async (data) => {
        console.log("Form submitted with data:", data)
        try {
            if (data.image === -1) {
                setImageState({ ...imageState, error: "Şəkil seçilməyib" })
                return
            }

            await addImageAbout({ images: [imageState.id] }).unwrap()
            toast.success("Məlumat uğurla yükləndi")
            onOpenChange(false)
        } catch (error) {
            toast.error("Məlumat yüklənərkən xəta baş verdi", error)
        }
    }

    const handleImageChange = async (e) => {
        const files = e.target.files

        if (!files || files.length === 0) {
            setImageState({ preview: null, id: null, error: "File seçilməyib" })
            return
        }
        const file = files[0]
        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await uploadImage(formData).unwrap()

            toast.success("Şəkil uğurla yükləndi")
            if (response) {
                setImageState({
                    preview: response.url,
                    id: response.id,
                    error: null,
                })
            }

            setValue("image", response.id)
            console.log(form.getValues())
        } catch (error) {
            console.log(error)
            toast.error("Şəkil yükləyərkən xəta baş verdi", error.message)
            setImageState({ preview: null, id: null, error: "Şəkil yükləyərkən xəta baş verdi" })
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle>Yeni şəkil əlavə et</DialogTitle>
                        <DialogDescription>Haqqımızda səhifənizə yeni şəkil əlavə edin.</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="-mx-6">
                    <FormProvider {...form}>
                        {/* Important: The form element needs to have the onSubmit handler directly */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <ImageUploadFormItem
                                setImageState={setImageState}
                                imageState={imageState}
                                form={form}
                                handleImageChange={handleImageChange}
                                name="image"
                                isUploading={upLoading}
                                error={errors.imageId?.message}
                            />

                            <div className="flex justify-end mt-6 p-2">
                                <Button type="submit" disabled={isLoading || getValues("image") === ""}>
                                    {isLoading ? "Əlavə edilir..." : "Şəkil əlavə et"}
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
