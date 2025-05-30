import { Dispatch, SetStateAction } from "react"

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
    areaStudy: number
    translations: Translation[]
}

export interface FAQFormProps {
    areaStudy: number
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
    areaStudy: number
    faqs: FAQ[]
    selectedLanguage: any
    onRefresh?: () => void
}