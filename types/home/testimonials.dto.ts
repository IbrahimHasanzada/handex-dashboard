export interface TestimonialBackend {
    id: number | string
    name: string
    bank_name: string
    comment?: string 
    bank_logo: {
        id: number
        url: string
    }
    customer_profile: {
        id: number
        url: string
    }
    translations?: Array<{
        comment: string
        lang: string
    }>
}

export interface TestimonialSubmit {
    id: number | string
    name: string
    bank_name: string
    bank_logo: number
    customer_profile: number
    translations: Array<{
        comment: string
        lang: string
    }>
}


export interface TestimonialsEditModalProps {
    testimonial: TestimonialBackend
    onClose: () => void
    refetch: () => Promise<any>
    currentLanguage: string
    isOpen: boolean
}