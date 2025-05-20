"use client"
import { useState } from "react"
import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAddProfilesMutation, useUploadFileMutation } from "@/store/handexApi"
import type { AddGraduateModalProps, imageState } from "@/types/home/graduates.dto"
import type { z } from "zod"
import { validateImage } from "@/validations/upload.validation"
import { formSchema } from "@/validations/home/graduate.validation"
import GraduateFormModal from "./graduate-form-modal"
import { toast } from "react-toastify"

export default function AddGraduateModal({ open, onOpenChange, refetch }: AddGraduateModalProps) {
    const [addProfile, { isLoading }] = useAddProfilesMutation()
    const [uploadImage, { isLoading: isUploading }] = useUploadFileMutation()
    const [imageState, setImageState] = useState<imageState>({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
    })

    // Update the form schema to include imageAlt
    const form = useForm<z.infer<typeof formSchema> & { imageAlt: string }>({
        defaultValues: {
            name: "",
            speciality: "",
            image: -1,
            imageAlt: "",
        },
        resolver: zodResolver(formSchema),
    })

    // This function now only handles image validation and preview
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validationResult = validateImage(file, setImageState, imageState)
        if (validationResult === false) return

        // Just store the file and show preview without uploading
        setImageState({
            preview: URL.createObjectURL(file),
            id: null,
            error: null,
            selectedFile: file,
        })
    }

    // New function to handle image upload with alt text
    const handleUploadWithAlt = async (file: File, altText: string) => {
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", altText) // Add alt text to the form data

            const response = await uploadImage(formData).unwrap()

            // Update form and image state with the uploaded image info
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

    const onSubmit = async (data: z.infer<typeof formSchema> & { imageAlt: string }) => {
        try {
            const jsonData = {
                name: data.name,
                speciality: data.speciality,
                model: "student",
                image: data.image,
            }

            await addProfile(jsonData).unwrap()

            form.reset()
            setImageState({ preview: null, id: null, error: null, selectedFile: null })
            refetch()
            toast.success("Məzun uğurla əlavə edildi!")
            onOpenChange(false)
        } catch (error) {
            toast.error("Məzun əlavə edərkən xəta baş verdi")
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
            uploadImage={handleUploadWithAlt} // Pass the upload function to the modal
        />
    )
}
