"use client"

import { useState } from "react"
import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import { AddGraduateModalProps, imageState } from "@/types/home/graduates.dto"
import { useAddContentMutation, useUploadFileMutation } from "@/store/handexApi"
import { TranslationFormData, translationSchema } from "@/validations/home/graduate.validation"
import TranslationFormModal from "./graduate-form-modal"



const validateImage = (file: File, setImageState: any, imageState: imageState) => {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]

    if (!allowedTypes.includes(file.type)) {
        setImageState({ ...imageState, error: "Yalnız JPEG, PNG və WebP formatları dəstəklənir" })
        return false
    }

    if (file.size > maxSize) {
        setImageState({ ...imageState, error: "Şəkil ölçüsü 5MB-dan çox ola bilməz" })
        return false
    }

    return true
}

export default function TranslationModal({ open, onOpenChange, refetch }: AddGraduateModalProps) {
    const [addTranslation, { isLoading }] = useAddContentMutation()
    const [uploadImage, { isLoading: isUploading }] = useUploadFileMutation()

    const [imageState, setImageState] = useState<imageState>({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
    })

    const form = useForm<TranslationFormData & { imageAlt: string }>({
        defaultValues: {
            translations: [
                { title: "", desc: "", lang: "az" as const },
                { title: "", desc: "", lang: "en" as const },
                { title: "", desc: "", lang: "ru" as const },
            ],
            images: [],
            imageAlt: "",
        },
        resolver: zodResolver(translationSchema),
    })

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validationResult = validateImage(file, setImageState, imageState)
        if (validationResult === false) return

        setImageState({
            preview: URL.createObjectURL(file),
            id: null,
            error: null,
            selectedFile: file,
        })
    }

    const handleUploadWithAlt = async (file: File, altText: string) => {
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", altText)

            const response = await uploadImage(formData).unwrap()

            const currentImages = form.getValues("images")
            form.setValue("images", [...currentImages, response.id])

            setImageState({
                preview: response.url,
                id: response.id,
                error: null,
                selectedFile: null,
            })
            return response
        } catch (error) {
            toast.error("Şəkli yükləyərkən xəta baş verdi")
            setImageState((prev) => ({ ...prev, error: "Şəkil yükləmə xətası baş verdi" }))
            throw error
        }
    }

    const onSubmit = async (data: TranslationFormData & { imageAlt: string }) => {
        try {
            const jsonData = {
                translations: data.translations,
                images: data.images,
                slug: "graduates", // Fixed slug as requested
            }

            await addTranslation(jsonData).unwrap()
            form.reset()
            setImageState({ preview: null, id: null, error: null, selectedFile: null })
            refetch()
            toast.success("Tərcümə uğurla əlavə edildi!")
            onOpenChange(false)
        } catch (error) {
            toast.error("Tərcümə əlavə edərkən xəta baş verdi")
        }
    }

    return (
        <TranslationFormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Yeni Tərcümə Əlavə Et"
            description="Müxtəlif dillər üçün tərcümə məlumatlarını daxil edin."
            form={form}
            imageState={imageState}
            setImageState={setImageState}
            handleImageChange={handleImageChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isUploading={isUploading}
            submitButtonText="Əlavə et"
            loadingText="Əlavə edilir..."
            imageInputId="translation-image-upload"
            uploadImage={handleUploadWithAlt}
        />
    )
}
