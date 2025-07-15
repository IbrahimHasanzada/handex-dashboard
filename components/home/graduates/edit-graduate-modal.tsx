"use client"

import { useState, useEffect } from "react"
import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { toast } from "react-toastify"
import { EditTranslationModalProps, imageState } from "@/types/home/graduates.dto"
import { useUpdateContentMutation, useUploadFileMutation } from "@/store/handexApi"
import { SingleLanguageTranslationFormData, singleLanguageTranslationSchema } from "@/validations/home/graduate.validation"
import TranslationFormModal from "./graduate-form-modal"


const validateImage = (file: File, setImageState: any, imageState: imageState) => {
    const maxSize = 5 * 1024 * 1024
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

export default function EditTranslationModal({
    open,
    onOpenChange,
    refetch,
    translation,
    selectedLanguage,
}: EditTranslationModalProps) {
    const [updateTranslation, { isLoading }] = useUpdateContentMutation()
    const [uploadImage, { isLoading: isUploading }] = useUploadFileMutation()

    const [imageState, setImageState] = useState<imageState>({
        preview: translation?.images?.[0]?.url || null,
        id: translation?.images?.[0]?.id || null,
        error: null,
        selectedFile: null,
    })

    const form = useForm<SingleLanguageTranslationFormData & { imageAlt: string }>({
        defaultValues: {
            title: translation?.title || "",
            desc: translation?.desc || "",
            lang: selectedLanguage,
            images: translation?.images?.map((img) => img.id) || [],
            imageAlt: "",
        },
        resolver: zodResolver(singleLanguageTranslationSchema),
    })

    useEffect(() => {
        if (translation) {
            form.reset({
                title: translation.title || "",
                desc: translation.desc || "",
                lang: selectedLanguage,
                images: translation.images?.map((img) => img.id) || [],
                imageAlt: "",
            })

            setImageState({
                preview: translation.images?.[0]?.url || null,
                id: translation.images?.[0]?.id || null,
                error: null,
                selectedFile: null,
            })
        }
    }, [translation, selectedLanguage, form])

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

            form.setValue("images", [response.id])

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

    const onSubmit = async (data: SingleLanguageTranslationFormData & { imageAlt: string }) => {
        try {
            const jsonData = {
                translations: [
                    {
                        title: data.title,
                        desc: data.desc,
                        lang: selectedLanguage
                    }
                ],
                images: data.images,
            }

            await updateTranslation({ params: jsonData, id: translation!.id }).unwrap()
            refetch()
            toast.success(`${getLanguageName(selectedLanguage)} dilində tərcümə uğurla yeniləndi!`)
            onOpenChange(false)
        } catch (error) {
            toast.error("Tərcümə yeniləyərkən xəta baş verdi")
        }
    }

    const getLanguageName = (lang: "az" | "en" | "ru") => {
        switch (lang) {
            case "az":
                return "Azərbaycan"
            case "en":
                return "İngilis"
            case "ru":
                return "Rus"
            default:
                return ""
        }
    }

    return (
        <TranslationFormModal
            open={open}
            onOpenChange={onOpenChange}
            title={`${getLanguageName(selectedLanguage)} Dilində Tərcümə Redaktəsi`}
            description={`${getLanguageName(selectedLanguage)} dilində tərcümə məlumatlarını yeniləyin.`}
            form={form}
            imageState={imageState}
            setImageState={setImageState}
            handleImageChange={handleImageChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
            isUploading={isUploading}
            submitButtonText="Yadda saxla"
            loadingText="Yenilənir..."
            imageInputId="translation-image-upload-edit"
            uploadImage={handleUploadWithAlt}
            selectedLanguage={selectedLanguage}
            singleLanguageMode={true}
        />
    )
}
