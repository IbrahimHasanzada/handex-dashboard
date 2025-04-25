import { z } from "zod"

export const testimonialFormSchema = z.object({
  name: z.string().min(2, { message: "Ad minimum 2 simvol olmalıdır" }),
  bank_name: z.string().min(2, { message: "Şirkət adı minimum 2 simvol olmalıdır" }),
  customer_profile: z
    .number({ required_error: "Profil şəkli tələb olunur." })
    .nullable()
    .refine((val) => val !== null, { message: "Profil şəkli tələb olunur." }),
  bank_logo: z
    .number({ required_error: "Şirkət logosu tələb olunur." })
    .nullable()
    .refine((val) => val !== null, { message: "Şirkət logosu tələb olunur." }),
  translations: z.array(
    z.object({
      comment: z.string().min(2, { message: "Rəy mətni minimum 2 simvol olmalıdır" }),
      lang: z.string()
    })
  )
})

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>
