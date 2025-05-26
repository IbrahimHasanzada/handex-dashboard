import { z } from 'zod'

export const phoneSchema = z.string()
    .min(1, "Telefon nömrəsi tələb olunur")
    .regex(/^\+994\d{9}$/, "Telefon nömrəsi +994 ilə başlamalı və ondan sonra düz 9 rəqəmdən ibarət olmalıdır")

export const emailSchema = z.string()
    .min(1, "E-poçt tələb olunur")
    .email("Etibarlı e-poçt ünvanı daxil edin")

export const locationSchema = z.string()
    .min(5, "Ünvan ən azı 5 simvol uzunluğunda olmalıdır")
    .max(500, "Ünvan 500 simvoldan çox olmamalıdır")

export const contactFormSchema = z.object({
    location: locationSchema,
    email: emailSchema,
})

export type ContactFormData = z.infer<typeof contactFormSchema>
