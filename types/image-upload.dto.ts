export interface ImageUploadFormItemProps {
    form: any
    name: string
    imageState: {
        preview: string | null
        id: number | null
        error: string | null
    }
    setImageState: (state: {
        preview: string | null
        id: number | null
        error: string | null
        selectedFile: string | null
    }) => void
    handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    isUploading: boolean
    imageInputId?: string
    label?: string
}