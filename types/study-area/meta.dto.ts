export interface MetaTranslation {
    id?: number
    name: string
    value: string
    lang: string
}

export interface MetaItem {
    id?: number
    translations: MetaTranslation[]
}

export interface MetaIntegrationProps {
    studyAreaId?: number
    selectedLanguage: string
    onRefresh: () => void
    metaItems?: MetaItem[]
    onCreateMeta?: (data: MetaItem) => Promise<void>
    onUpdateMeta?: (id: number, data: MetaItem) => Promise<void>
    onDeleteMeta?: (id: number) => Promise<void>
}




export interface MetaFormProps {
    isOpen: boolean
    onClose: () => void
    initialData?: MetaItem | null
    selectedLanguage: string
    onSuccess: () => void
    onSubmit?: (data: MetaItem) => Promise<void>
}