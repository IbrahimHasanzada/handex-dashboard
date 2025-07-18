"use client"
import { useState, useEffect } from "react"
import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUpdateProfilesMutation, useUploadFileMutation } from "@/store/handexApi"
import type { z } from "zod"
import { validateImage } from "@/validations/upload.validation"
import { toast } from "react-toastify"
import InstructorsFormModal from "./instructors-form-modal"
import type { EditInstructorsModalProps } from "@/types/study-area/instructors.dto"
import { formSchemaInstructors } from "@/validations/study-area/instructors.validation"

export default function EditInstructorsModal({
    open,
    onOpenChange,
    refetch,
    graduate,
    selectedLanguage,
    studyArea
}: EditInstructorsModalProps & { selectedLanguage: string }) {
    const [updateProfile, { isLoading }] = useUpdateProfilesMutation()
    const [uploadImage, { isLoading: isUploading }] = useUploadFileMutation()
    const [imageState, setImageState] = useState<{
        preview: string | null
        id: number | null
        error: string | null
        selectedFile: File | null
    }>({
        preview: graduate?.image?.url || null,
        id: graduate?.image?.id || null,
        error: null,
        selectedFile: null,
    })

    const form = useForm<
        z.infer<typeof formSchemaInstructors> & {
            translations: {
                az: string
                en: string
                ru: string
            }
        }
    >({
        defaultValues: {
            name: graduate?.name || "",
            speciality: graduate?.speciality || "",
            image: graduate?.image?.id || -1,
            translations: {
                az: "",
                en: "",
                ru: "",
            },
        },
        resolver: zodResolver(formSchemaInstructors),
    })

    useEffect(() => {
        if (graduate) {
            const translations = {
                en: selectedLanguage === "en" && graduate.description || "",
                ru: selectedLanguage === "ru" && graduate.description || "",
                az: selectedLanguage === "az" && graduate.description || ""
            }

            form.reset({
                name: graduate.name,
                speciality: graduate.speciality,
                image: graduate.image?.id || -1,
                translations,
            })

            setImageState({
                preview: graduate.image?.url || null,
                id: graduate.image?.id || null,
                error: null,
                selectedFile: null,
            })
        }
    }, [graduate, form])

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
            translations: {
                az: string
                en: string
                ru: string
            }
        },
    ) => {
        try {
            const translations = [
                {
                    description: data.translations[selectedLanguage as keyof typeof data.translations],
                    lang: selectedLanguage,
                },
            ]

            const jsonData = {
                name: data.name,
                speciality: data.speciality,
                model: "instructor",
                image: data.image !== undefined ? data.image : null,
                translations: translations,
                studyArea
            }

            await updateProfile({ params: jsonData, id: graduate.id }).unwrap()
            refetch()
            toast.success("Müəllim uğurla yeniləndi!")
            onOpenChange(false)
        } catch (error) {
            toast.error("Müəllim yenilənərkən xəta baş verdi!")
        }
    }

    return (
        <InstructorsFormModal
            open={open}
            onOpenChange={onOpenChange}
            title="Müəllimin Məlumatlarını Redaktə Et"
            description="Müəllimin məlumatlarını yeniləyin və yadda saxlayın."
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
            isEditMode={true}
            selectedLanguage={selectedLanguage}
            studyArea={studyArea}
            uploadImage={handleUploadWithAlt}

        />
    )
}
