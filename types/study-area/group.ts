
export interface Group {
    id: number
    startDate: string
    text: Array<{
        id: number
        field: string
        model: string
        lang: string
        value: string
    }>
    table: Array<{
        id: number
        field: string
        model: string
        lang: string
        value: string
    }>
}

export interface GroupListProps {
    studyArea: number
    groups: Group[]
    selectedLanguage: string
    courseColor: string
    onRefresh?: () => void
}


export interface GroupItem {
    id: number
    startDate: string
    text: Array<{
        id: number
        field: string
        model: string
        lang: string
        value: string
    }>
    table: Array<{
        id: number
        field: string
        model: string
        lang: string
        value: string
    }>
}

export interface GroupTranslation {
    name: string
    lang: string
}

export interface GroupFormData {
    text: GroupTranslation[]
    table: GroupTranslation[]
    startDate: string
    studyArea: number
}

export interface GroupFormProps {
    studyArea: number
    groupId?: number
    existingData?: GroupItem
    selectedLanguage: string
    onSuccess?: () => void
    trigger?: React.ReactNode
}