import { UPLOAD_IMAGE_ALLOWED_MIME_TYPES, UPLOAD_IMAGE_MAX_SIZE } from "@/shared/constants/upload.contstant"

export function validateImage(file: any, setImageState: any, imageState: any) {
    if (!UPLOAD_IMAGE_ALLOWED_MIME_TYPES.includes(file.type)) {
        setImageState({ ...imageState, error: "Yalnız .jpg, .jpeg, .png, .webp və .svg formatları dəstəklənir." })
        return false
    }

    if (file.size > UPLOAD_IMAGE_MAX_SIZE) {
        setImageState({ ...imageState, error: "Maksimum şəkil ölçüsü 24 MB-dır." })
        return false
    }

}