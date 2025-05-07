"use client"
import { useState } from "react"
import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddProfilesMutation, useUploadFileMutation } from "@/store/handexApi"
import type { AddGraduateModalProps, imageState } from "@/types/home/graduates.dto"
import { z } from "zod"
import { validateImage } from "@/validations/upload.validation"
import { formSchema } from "@/validations/home/graduate.validation"
import GraduateFormModal from "./graduate-form-modal"
import { Bounce, toast } from "react-toastify"

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
            formData.append("file", file)
            const response = await uploadImage(formData).unwrap()
            form.setValue("image", response.id)
            setImageState((prev) => ({ ...prev, id: response.id, error: null, preview: response.url }))
        } catch (error) {
            toast.error(error?.data?.message.join(','))
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
            toast.success('Məzun uğurla əlavə edildi!')
            onOpenChange(false)
        } catch (error) {
            toast.error(error?.data?.message.join(','))
        }
    }

    return (
        <GraduateFormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Yeni Məzun Əlavə Et"
            description="Məzun məlumatlarını daxil edin və yadda saxlayın."
            form={form}
            imageState={imageState}
            setImageState={setImageState}
            handleImageChange={handleImageChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isUploading={isUploading}
            submitButtonText="Əlavə et"
            loadingText="Əlavə edilir..."
            imageInputId="image-upload-add"
        />
    )
}
