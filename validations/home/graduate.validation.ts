import { z } from "zod"

export const translationSchema = z.object({
    translations: z
        .array(
            z.object({
                title: z.string().min(1, "Başlıq tələb olunur"),
                desc: z.string().min(1, "Təsvir tələb olunur"),
                lang: z.enum(["az", "en", "ru"]),
            }),
        )
        .length(3, "3 dil üçün tərcümə tələb olunur"),
    images: z.array(z.number()).min(1, "Ən azı bir şəkil tələb olunur"),
})

export const singleLanguageTranslationSchema = z.object({
    title: z.string().min(1, "Başlıq tələb olunur"),
    desc: z.string().min(1, "Təsvir tələb olunur"),
    lang: z.enum(["az", "en", "ru"]),
    images: z.array(z.number()).min(1, "Ən azı bir şəkil tələb olunur"),
})

export type TranslationFormData = z.infer<typeof translationSchema>
export type SingleLanguageTranslationFormData = z.infer<typeof singleLanguageTranslationSchema>
