import type React from "react"
import type { UseFormReturn } from "react-hook-form"

export interface AddInstructorsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    refetch: () => void
}

export interface imageState {
    preview: string | null
    id: number | null
    error: string | null
    selectedFile: string | File | null
}

export interface EditInstructorsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    refetch: () => void
    graduate: {
        id: number
        name: string
        speciality: string
        translations?: Array<{
            description: string
            lang: string
        }>
        image?: {
            id: number
            url: string
        }
    }
}

export interface InstructorsFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    form: UseFormReturn<any>
    imageState: any
    setImageState: any
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>
    onSubmit: (data: any) => Promise<void>
    isLoading: boolean
    isUploading: boolean
    submitButtonText: string
    loadingText: string
    imageInputId?: string
}
