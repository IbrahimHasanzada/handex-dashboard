export interface MetaTranslation {
    name: string
    value: string
    lang: string
}

export interface MetaItem {
    id?: number
    translations: MetaTranslation[]
}

export interface MetaFormProps {
    isOpen: boolean
    onClose: () => void
    initialData?: any
    selectedLanguage: string
    onSuccess: () => void
    onSubmit?: (data: MetaItem) => Promise<void>
    isEditMode?: boolean
    availableTypes: any
}

export const AVAILABLE_LANGUAGES = [
    { code: "az", name: "Azərbaycanca" },
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
]

