import { UPLOAD_IMAGE_ALLOWED_MIME_TYPES, UPLOAD_IMAGE_MAX_SIZE } from "@/shared/constants/upload.contstant"
import { z } from "zod"

export const formSchema = z.object({
    title: z
        .string()
        .min(3, { message: "Başlıq ən azı 3 simvol olmalıdır" })
        .max(100, { message: "Başlıq 100 simvoldan çox olmamalıdır" }),
    desc: z
        .string()
        .min(10, { message: "Alt başlıq ən azı 10 simvol olmalıdır" })
        .max(500, { message: "Alt başlıq 500 simvoldan çox olmamalıdır" }),
    meta: z.string().min(1, { message: "Meta tələb olunur" }),
    image: z
        .instanceof(FileList)
        .optional()
        .refine((files) => !files || files.length === 0 || files.length === 1, {
            message: "Bir şəkil seçin",
        })
        .refine((files) => !files || files.length === 0 || files[0].size <= UPLOAD_IMAGE_MAX_SIZE, {
            message: "Şəkil 5MB-dan böyük olmamalıdır",
        })
        .refine((files) => !files || files.length === 0 || UPLOAD_IMAGE_ALLOWED_MIME_TYPES.includes(files[0].type), {
            message: "Yalnız .jpg, .jpeg, .png, .webp və .gif formatları qəbul edilir",
        }),
})

export type FormValues = z.infer<typeof formSchema>