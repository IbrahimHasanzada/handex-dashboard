import { z } from "zod"

const translationSchema = z.object({
    table: z.string().optional(),
    course_detail: z.string().optional(),
    description: z.string().optional(),
    name: z.string().optional(),
    value: z.string().optional(),
    lang: z.enum(["az", "en", "ru"]),
})

const faqSchema = z.object({
    title: z.string().min(1, "Başlıq tələb olunur"),
    description: z.string().min(1, "Təsvir tələb olunur"),
    lang: z.enum(["az", "en", "ru"]),
})

const programSchema = z.object({
    name: z.string().min(1, "Proqram adı tələb olunur"),
    translations: z.array(translationSchema).min(1, "Ən azı bir tərcümə tələb olunur"),
    studyArea: z.number().min(0, "Tədris sahəsi tələb olunur"),
})

const metaSchema = z.object({
    translations: z.array(translationSchema).min(1, "Meta məlumatları tələb olunur"),
})

export const courseSchema = z.object({
    name: z.string().min(1, "Kurs adı tələb olunur"),
    date: z.array(z.string()).min(1, "Ən azı bir tarix tələb olunur"),
    slug: z.string().min(1, "Slug tələb olunur"),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Düzgün hex rəng formatı tələb olunur"),
    image: z.number().min(0, "Şəkil tələb olunur"),
    translations: z.array(translationSchema).min(1, "Ən azı bir tərcümə tələb olunur"),
    faq: z.array(faqSchema).min(1, "Ən azı bir FAQ tələb olunur"),
    program: z.array(programSchema).min(1, "Ən azı bir proqram tələb olunur"),
    meta: z.array(metaSchema).optional(),
})

export type CourseFormData = z.infer<typeof courseSchema>
