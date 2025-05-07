"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProfilesMutation, useUploadFileMutation } from "@/store/handexApi"
import type { z } from "zod"
import { validateImage } from "@/validations/upload.validation"
import type { EditGraduateModalProps } from "@/types/home/graduates.dto"
import { formSchema } from "@/validations/home/graduate.validation"
import GraduateFormModal from "./graduate-form-modal"
import { toast } from "react-toastify"

export default function EditGraduateModal({ open, onOpenChange, refetch, graduate }: EditGraduateModalProps) {
    const [updateProfile, { isLoading }] = useUpdateProfilesMutation()
    const [uploadImage, { isLoading: isUploading }] = useUploadFileMutation()
    const [imageState, setImageState] = useState<{
        preview: string | null
        id: number | null
        error: string | null
    }>({
        preview: graduate?.image?.url || null,
        id: graduate?.image?.id || null,
        error: null,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        defaultValues: {
            name: graduate?.name || "",
            speciality: graduate?.speciality || "",
            image: graduate?.image?.id || -1,
        },
        resolver: zodResolver(formSchema),
    })
    useEffect(() => {
        if (graduate) {
            form.reset({
                name: graduate.name,
                speciality: graduate.speciality,
                image: graduate.image?.id || -1,
            })

            setImageState({
                preview: graduate.image?.url || null,
                id: graduate.image?.id || null,
                error: null,
            })
        }
    }, [graduate, form])

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validationResult = validateImage(file, setImageState, imageState)
        if (validationResult === false) return

        try {
            const formData = new FormData()
            formData.append("file", file)
            const response = await uploadImage(formData).unwrap()

            setImageState({
                preview: response.url || null,
                id: response.id || null,
                error: null,
            })
            form.setValue("image", response.id)
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
                image: data.image !== undefined && data.image,
            }

            await updateProfile({ params: jsonData, id: graduate.id }).unwrap()
            refetch()
            toast.success('Məzun uğurla yeniləndi!')
            onOpenChange(false)
        } catch (error) {
            toast.error("Məzun əlavə edilərkən xəta baş verdi!")
        }
    }

    return (
        <GraduateFormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Məzun Məlumatlarını Redaktə Et"
            description="Məzun məlumatlarını yeniləyin və yadda saxlayın."
            form={form}
            imageState={imageState}
            setImageState={setImageState}
            handleImageChange={handleImageChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isUploading={isUploading}
            submitButtonText="Yadda saxla"
            loadingText="Yenilənir..."
            imageInputId="image-upload-edit"
        />
    )
}
