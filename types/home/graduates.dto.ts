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

export interface TranslationFormModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    form: any
    imageState: imageState
    setImageState: (state: imageState | ((prev: imageState) => imageState)) => void
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onSubmit: (data: any) => Promise<void>
    isLoading: boolean
    isUploading: boolean
    submitButtonText: string
    loadingText: string
    imageInputId?: string
    uploadImage?: (file: File, alt: string) => Promise<any>
    selectedLanguage?: "az" | "en" | "ru"
    singleLanguageMode?: boolean
}

export interface EditTranslationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  refetch: () => void
  translation: TranslationData | null
  selectedLanguage: "az" | "en" | "ru"
}

export interface TranslationData {
    id: number
    title: string
    desc: string
    images: Array<{
        id: number
        url: string
    }>
    slug: string
}
