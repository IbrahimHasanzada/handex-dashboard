import { UseFormReturn } from "react-hook-form"

export interface AddGraduateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    refetch: () => void
}

export interface imageState {
    preview: string | null
    id: number | null
    error: string | null
    selectedFile: string | File | null
    alt?: any

}

export interface EditGraduateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    refetch: () => void
    graduate: {
        id: number
        name: string
        speciality: string
        image?: {
            id: number
            url: string
        }
    }
}

export interface GraduateFormModalProps {
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
