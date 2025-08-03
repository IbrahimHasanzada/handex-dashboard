import { z } from "zod"

export const studyAreaFormSchema = z.object({
    name: z.string().min(1, "Kurs adı tələb olunur"),
    slug: z.string().min(1, "Slug tələb olunur"),
    color: z.string().min(1, "Rəng tələb olunur"),
    image: z.number().min(1, "Şəkil tələb olunur"),
    course_detail: z.string().min(1, "Kurs təfərrüatı tələb olunur"),
    hidden: z.string().min(1, "Kurs üçün gizli məlumat tələb olunur tələb olunur"),
})

export type StudyAreaFormData = z.infer<typeof studyAreaFormSchema>