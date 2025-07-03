import { z } from "zod"

const translationSchema = z.object({
    course_detail: z.string().min(1, "Kurs təfərrüatı tələb olunur").optional(),
    description: z.string().min(1, "Təsvir tələb olunur").optional(),
    name: z.string().min(1, "Ad tələb olunur").optional(),
    value: z.string().min(1, "Dəyər tələb olunur").optional(),
    lang: z.enum(["az", "en", "ru"]),
})

const courseTranslationSchema = z.object({
    course_detail: z.string().min(1, "Kurs təfərrüatı tələb olunur"),
    lang: z.enum(["az", "en", "ru"]),
})

const programTranslationSchema = z.object({
    description: z.string().min(1, "Təsvir tələb olunur"),
    lang: z.enum(["az", "en", "ru"]),
})

const metaTranslationSchema = z.object({
    name: z.string().min(1, "Ad tələb olunur"),
    value: z.string().min(1, "Dəyər tələb olunur"),
    lang: z.enum(["az", "en", "ru"]),
})

const faqSchema = z.object({
    title: z.string().min(1, "Başlıq tələb olunur"),
    description: z.string().min(1, "Təsvir tələb olunur"),
    lang: z.enum(["az", "en", "ru"]),
})

const programSchema = z.object({
    name: z.string().min(1, "Proqram adı tələb olunur"),
    image: z.number().min(1, "Şəkil tələb olunur"),
    translations: z
        .array(programTranslationSchema)
        .length(3, "Hər 3 dil üçün tərcümə tələb olunur")
        .refine((translations) => {
            const languages = translations.map((t) => t.lang)
            return languages.includes("az") && languages.includes("en") && languages.includes("ru")
        }, "Azərbaycan, İngilis və Rus dillərində tərcümələr tələb olunur"),
})

const metaSchema = z.object({
    translations: z
        .array(metaTranslationSchema)
        .length(3, "Hər 3 dil üçün meta tərcümə tələb olunur")
        .refine((translations) => {
            const languages = translations.map((t) => t.lang)
            return languages.includes("az") && languages.includes("en") && languages.includes("ru")
        }, "Azərbaycan, İngilis və Rus dillərində meta tərcümələr tələb olunur"),
})

const groupTextTranslationSchema = z.object({
    name: z.string().optional(),
    lang: z.enum(["az", "en", "ru"]).optional(),
})

const groupTableTranslationSchema = z.object({
    name: z.string().optional(),
    lang: z.enum(["az", "en", "ru"]).optional(),
})

const groupSchema = z.object({
    text: z
        .array(groupTextTranslationSchema)
        .optional(),
    table: z
        .array(groupTableTranslationSchema)
        .optional(),
    startDate: z.string().optional(),
})

export const courseSchema = z.object({
    name: z.string().min(1, "Kurs adı tələb olunur"),
    slug: z.string()
        .min(1, "Slug boş ola bilməz")
        .regex(/^[a-z0-9-]+$/, "Slug yalnız kiçik ingilis hərfləri, rəqəmlər və `-` icazə verir")
        .refine((val) => !/[əıöüşç]/i.test(val), {
            message: "Slug içində ə, ı, ö, ü, ş, ç hərfləri ola bilməz",
        }),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Düzgün hex rəng formatı tələb olunur"),
    image: z.number().min(1, "Şəkil tələb olunur"),
    translations: z
        .array(courseTranslationSchema)
        .length(3, "Hər 3 dil üçün tərcümə tələb olunur")
        .refine((translations) => {
            const languages = translations.map((t) => t.lang)
            return languages.includes("az") && languages.includes("en") && languages.includes("ru")
        }, "Azərbaycan, İngilis və Rus dillərində tərcümələr tələb olunur"),
    faq: z
        .array(faqSchema)
        .length(3, "Hər 3 dil üçün FAQ tələb olunur")
        .refine((faqs) => {
            const languages = faqs.map((f) => f.lang)
            return languages.includes("az") && languages.includes("en") && languages.includes("ru")
        }, "Azərbaycan, İngilis və Rus dillərində FAQ-lar tələb olunur"),
    program: z.array(programSchema).min(1, "Ən azı bir proqram tələb olunur"),
    meta: z.array(metaSchema).min(1, "Ən azı bir meta tələb olunur"),
    group: z.array(groupSchema).optional(),
    model: z.string().min(1, "Model tələb olunur")
})

export type CourseFormData = z.infer<typeof courseSchema>

export {
    translationSchema,
    courseTranslationSchema,
    programTranslationSchema,
    metaTranslationSchema,
    faqSchema,
    programSchema,
    metaSchema,
    groupTextTranslationSchema,
    groupTableTranslationSchema,
    groupSchema,
}
