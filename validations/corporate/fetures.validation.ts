import { z } from "zod";

export type Language = "az" | "en" | "ru";

const SUPPORTED_LANGUAGES: Language[] = ["az", "en", "ru"];

const TranslationSchema = z.object({
    title: z
        .string()
        .min(2, { message: "Başlıq ən azı 2 simvoldan ibarət olmalıdır" })
        .max(100, { message: "Başlıq 100 simvoldan az olmalıdır" }),
    desc: z
        .string()
        .min(10, { message: "Təsvir ən azı 10 simvoldan ibarət olmalıdır" })
        .max(500, { message: "Təsvir 500 simvoldan az olmalıdır" }),
    lang: z.string().refine(
        (val): val is Language => SUPPORTED_LANGUAGES.includes(val as Language),
        {
            message: "Dil aşağıdakılardan biri olmalıdır: az, en, ru"
        }
    ),
});

export const FeatureSchema = z.object({
    images: z
        .array(z.any(), {
            required_error: "Şəkil tələb olunur.",
        })
        .nonempty({ message: "Ən azı bir şəkil əlavə etməlisiniz." }),
    translations: z
        .array(TranslationSchema)
        .min(1, { message: "Ən azı bir tərcümə tələb olunur" })
        .refine(
            (translations) => {
                const langs = translations.map((t) => t.lang);
                return SUPPORTED_LANGUAGES.every((lang) => langs.includes(lang));
            },
            {
                message: "Tərcümələrə Azərbaycan, ingilis və rus dilləri daxil edilməlidir",
            }
        ),
});

export type FeatureFormValues = z.infer<typeof FeatureSchema>

export type Feature = FeatureFormValues & { id: string }


export const EditFeatureSchema = z.object({
    images: z
        .array(z.any(), {
            required_error: "Şəkil tələb olunur.",
        })
        .nonempty({ message: "Ən azı bir şəkil əlavə etməlisiniz." }),
    translations: z
        .array(TranslationSchema)
        .refine(
            (translations) => {
                const langs = translations.map((t) => t.lang);
                return SUPPORTED_LANGUAGES.some((lang) => langs.includes(lang));
            },
            {
                message: "Bütün dəstəklənən dillər üçün tərcümələr təmin edilməlidir."
            }
        )
})

export type EditFeatureFormSchema = z.infer<typeof EditFeatureSchema>