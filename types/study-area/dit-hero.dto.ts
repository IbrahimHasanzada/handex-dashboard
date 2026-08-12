export interface StudyAreaEditFormProps {
    isOpen: boolean
    onClose: () => void
    studyAreaId: number
    initialData: {
        name: string
        slug: string
        color: string
        seoWord?: string | null
        image: { id: number; url: string; alt: string | null }
        course_detail: string
        hidden: string
    }
    selectedLanguage: string
    onSuccess: () => void
}