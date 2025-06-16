import { z } from "zod";

const metaTagSchema = z.object({
    metaName: z.string().min(1, { message: "Meta adı tələb olunur" }),
    meta_az: z.string().min(1, { message: "Meta təsviri (AZ) tələb olunur" }),
    meta_en: z.string().min(1, { message: "Meta təsviri (EN) tələb olunur" }),
    meta_ru: z.string().min(1, { message: "Meta təsviri (RU) tələb olunur" }),
})

export const formSchemaNews = z.object({
    title_az: z.string().min(5, { message: "Ən azı 5 simvol olmalıdır" }),
    title_en: z.string().min(5, { message: "Ən azı 5 simvol olmalıdır" }),
    title_ru: z.string().min(5, { message: "Ən azı 5 simvol olmalıdır" }),
    content_az: z.string().min(20, { message: "Ən azı 20 simvol olmalıdır" }),
    content_en: z.string().min(20, { message: "Ən azı 20 simvol olmalıdır" }),
    content_ru: z.string().min(20, { message: "Ən azı 20 simvol olmalıdır" }),
    meta_az: z.string().min(1, { message: "Meta təsviri (AZ) tələb olunur" }),
    meta_en: z.string().min(1, { message: "Meta təsviri (EN) tələb olunur" }),
    meta_ru: z.string().min(1, { message: "Meta təsviri (RU) tələb olunur" }),
    slug: z.string().min(3, { message: "Ən azı 3 simvol olmalıdır" }),
    featuredImage: z
        .number({ required_error: "Şəkil tələb olunur." })
        .refine((val) => val !== -1, { message: "Şəkil tələb olunur." }),
    category: z.string().optional(),
    imageAlt: z.string().min(1, { message: "Şəkil təsviri tələb olunur" }),
    metaName: z.string().min(1, { message: "Meta adı tələb olunur" }),
    additionalMeta: z.array(metaTagSchema).optional().default([]),
})


export const editFormSchemaNews = z.object({
    title_az: z.string().min(5, { message: "Ən azı 5 simvol olmalıdır" }),
    title_en: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 5, { message: "Ən azı 5 simvol olmalıdır" }),
    title_ru: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 5, { message: "Ən azı 5 simvol olmalıdır" }),

    content_az: z.string().min(20, { message: "Ən azı 20 simvol olmalıdır" }),
    content_en: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 20, { message: "Ən azı 20 simvol olmalıdır" }),
    content_ru: z
        .string()
        .optional()
        .refine((val) => !val || val.length >= 20, { message: "Ən azı 20 simvol olmalıdır" }),

    meta_az: z.string().optional(),
    meta_en: z.string().optional(),
    meta_ru: z.string().optional(),

    slug: z.string().min(3, { message: "Ən azı 3 simvol olmalıdır" }),

    featuredImage: z
        .number({ required_error: "Şəkil tələb olunur." })
        .refine((val) => val !== -1, { message: "Şəkil tələb olunur." }),

    category: z.string().optional(),
    imageAlt: z.string(),
    metaName: z.string(),

    // Add validation for the additional meta tags array
    additionalMeta: z.array(metaTagSchema).optional().default([]),
})
