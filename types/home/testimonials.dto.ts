export interface TestimonialsModalProps {
    isOpen: boolean
    onClose: () => void
    testimonial?: any
    refetch: () => Promise<any>
    currentLanguage: string
}
