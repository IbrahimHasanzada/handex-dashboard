"use client"
import { useState } from "react"
import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddProfilesMutation, useUploadFileMutation } from "@/store/handexApi"
import type { z } from "zod"
import { validateImage } from "@/validations/upload.validation"
import { toast } from "react-toastify"
import InstructorsFormModal from "./instructors-form-modal"
import type { AddInstructorsModalProps, imageState } from "@/types/study-area/instructors.dto"
import { formSchemaInstructors } from "@/validations/study-area/instructors.validation"

export default function AddInstructorsModal({ open, onOpenChange, refetch }: AddInstructorsModalProps) {
    const [addProfile, { isLoading }] = useAddProfilesMutation()
    const [uploadImage, { isLoading: isUploading }] = useUploadFileMutation()
    const [imageState, setImageState] = useState<imageState>({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
    })

    const form = useForm<
        z.infer<typeof formSchemaInstructors> & {
            imageAlt: string
            translations: {
                az: string
                en: string
                ru: string
            }
        }
    >({
        defaultValues: {
            name: "",
            speciality: "",
            image: -1,
            imageAlt: "",
            translations: {
                az: "",
                en: "",
                ru: "",
            },
        },
        resolver: zodResolver(formSchemaInstructors),
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

            form.setValue("image", response.id)
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

    const onSubmit = async (
        data: z.infer<typeof formSchemaInstructors> & {
            imageAlt: string
            translations: {
                az: string
                en: string
                ru: string
            }
        },
    ) => {
        try {
            const translations = [
                { description: data.translations.az, lang: "az" },
                { description: data.translations.en, lang: "en" },
                { description: data.translations.ru, lang: "ru" },
            ]

            const jsonData = {
                name: data.name,
                speciality: data.speciality,
                model: "instructor", 
                image: data.image,
                translations: translations,
            }
            console.log(jsonData)

            await addProfile(jsonData).unwrap()

            form.reset()
            setImageState({ preview: null, id: null, error: null, selectedFile: null })
            refetch()
            toast.success("Müəllim uğurla əlavə edildi!")
            onOpenChange(false)
        } catch (error) {
            toast.error("Müəllim əlavə edərkən xəta baş verdi")
        }
    }

    return (
        <InstructorsFormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Yeni Müəllim Əlavə Et"
            description="Müəllim məlumatlarını daxil edin və yadda saxlayın."
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
            uploadImage={handleUploadWithAlt}
        />
    )
}
