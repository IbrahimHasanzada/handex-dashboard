export interface StudyAreaEditFormProps {
    isOpen: boolean
    onClose: () => void
    studyAreaId: number
    initialData: {
        name: string
        slug: string
        color: string
        image: { id: number; url: string; alt: string | null }
        course_detail: string
    }
    selectedLanguage: string
    onSuccess: () => void
}