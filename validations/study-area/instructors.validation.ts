import { z } from "zod"

export const formSchemaInstructors = z.object({
    name: z.string().min(2, { message: "Ad minimum 2 simvol olmalıdır" }),
    speciality: z.string().min(2, { message: "İxtisas minimum 2 simvol olmalıdır" }),
    image: z
        .number({ required_error: "Şəkil tələb olunur." })
        .refine((val) => val !== -1, { message: "Şəkil tələb olunur." }),
    translations: z
        .array(
            z.object({
                lang: z.enum(["az", "en", "ru"]),
                value: z.string().min(1, { message: "Translation value is required" }),
            }),
        )
        .length(3, { message: "Must have exactly 3 translations" }),
})
