
export interface ProgramFormProps {
    isOpen: boolean
    onClose: () => void
    studyAreaId: number | undefined
    programId?: number
    initialData?: {
        id?: number
        name: string
        image: { id: number; url: string; alt: string | null }
        description: string
    } | null
    selectedLanguage: string
    onSuccess: () => void
}