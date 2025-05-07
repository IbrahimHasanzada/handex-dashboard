import { z } from "zod"

export const testimonialFormSchema = z.object({
  name: z.string().min(2, { message: "Ad minimum 2 simvol olmalıdır" }),
  bank_name: z.string().min(2, { message: "Şirkət adı minimum 2 simvol olmalıdır" }),
  customer_profile: z
    .number({ required_error: "Profil şəkli tələb olunur." })
    .refine((val) => val !== -1, { message: "Profil şəkli tələb olunur." }),
  bank_logo: z
    .number({ required_error: "Şirkət logosu tələb olunur." })
    .refine((val) => val !== -1, { message: "Şirkət logosu tələb olunur." }),
  translations: z.array(
    z.object({
      comment: z.string().min(2, { message: "Rəy mətni minimum 2 simvol olmalıdır" }),
      lang: z.string()
    })
  )
})

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>


export const testimonialEditSchema = z.object({
  id: z.union([z.string(), z.number()]),
  name: z.string().min(2, { message: "Müştəri adı ən az 2 simvol olmalıdır" }),
  bank_name: z.string().min(2, { message: "Şirkət adı ən az 2 simvol olmalıdır" }),
  comment: z.string().min(10, { message: "Rəy mətni ən az 10 simvol olmalıdır" }),
  bank_logo_id: z.number().optional(),
  customer_profile_id: z.number().optional(),
  currentLanguage: z.string(),
})

export type TestimonialEditValues = z.infer<typeof testimonialEditSchema>
