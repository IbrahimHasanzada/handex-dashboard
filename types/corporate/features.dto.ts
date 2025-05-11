import { FeatureFormValues } from "@/validations/corporate/fetures.validation"

export interface FeatureFormProps {
    isFeatLoading: boolean,
    defaultValues?: Partial<FeatureFormValues>
    onSubmit: (data: FeatureFormValues) => void
    onCancel: () => void
}