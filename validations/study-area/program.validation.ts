import { z } from "zod"

export const addProgramFormSchema = z.object({
    name: z.string().min(1, "Proqram adı tələb olunur"),
    image: z.number().min(1, "Şəkil tələb olunur"),
    translations: z.array(
        z.object({
            description: z.string().min(1, "Təsvir tələb olunur"),
            lang: z.string(),
        }),
    ),
    studyArea: z.number(),
})

export const editProgramFormSchema = z.object({
    name: z.string().min(1, "Proqram adı tələb olunur"),
    image: z.number().min(1, "Şəkil tələb olunur"),
    description: z.string().min(1, "Təsvir tələb olunur"),
    studyArea: z.number(),
})

export type AddProgramFormData = z.infer<typeof addProgramFormSchema>
export type EditProgramFormData = z.infer<typeof editProgramFormSchema>
