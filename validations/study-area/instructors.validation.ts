import { z } from "zod"

export const formSchemaInstructors = z.object({
    name: z.string().min(2, { message: "Ad minimum 2 simvol olmalıdır" }),
    speciality: z.string().min(2, { message: "İxtisas minimum 2 simvol olmalıdır" }),
    image: z
        .number({ required_error: "Şəkil tələb olunur." })
        .refine((val) => val !== -1, { message: "Şəkil tələb olunur." }),
    translations: z
        .object({
            az: z.string().optional(),
            en: z.string().optional(),
            ru: z.string().optional(),
        })
        .optional(),
})
