
export interface FAQItem {
    id: number
    title: string
    description: string
    createdAt: string
    updatedAt: string
}

export interface Translation {
    title: string
    description: string
    lang: "az" | "en" | "ru"
}

export interface FAQFormData {
    model: string
    translations: Translation[]
}

export interface FAQFormProps {
    model: string
    faqId?: number
    existingData?: FAQItem
    onSuccess?: () => void
    trigger?: React.ReactNode
    currentLanguage: any
}

export interface FAQ {
    id: number
    title: string
    description: string
    createdAt: string
    updatedAt: string
}

export interface FAQListProps {
    model: string
    faqs: FAQ[]
    selectedLanguage: any
    onRefresh?: () => void
}