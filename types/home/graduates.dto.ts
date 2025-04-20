export interface AddGraduateModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    refetch: () => void
}

export interface imageState {
    preview: string | null
    id: number | null
    error: string | null
}