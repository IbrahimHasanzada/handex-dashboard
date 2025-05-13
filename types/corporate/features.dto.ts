import { FeatureFormValues } from "@/validations/corporate/fetures.validation"

export interface FeatureFormProps {
    isFeatLoading: boolean,
    defaultValues?: Partial<FeatureFormValues>
    onSubmit: (data: FeatureFormValues) => void
    onCancel: () => void
    slug?: string,
    id?: number
}

export interface EditFeatureFormProps {
    isFeatLoading: boolean,
    upLoading: boolean,
    defaultValues?: Partial<FeatureFormValues>
    onSubmit: (data: FeatureFormValues, id: number) => void
    onCancel: () => void
    features: any,
    lang: string
}