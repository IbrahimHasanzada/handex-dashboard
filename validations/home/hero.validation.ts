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
    image: z.number({ required_error: "Şəkil tələb olunur." })
        .refine((val) => val !== -1, { message: "Şəkil tələb olunur." }),
})

export type FormValues = z.infer<typeof formSchema>