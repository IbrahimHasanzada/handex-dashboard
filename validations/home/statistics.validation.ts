import { z } from "zod";

export const statisticSchema = z.object({
    count: z.number().min(0, "Count must be non-negative"),
    translations: z
        .array(
            z.object({
                lang: z.enum(["az", "en", "ru"]),
                value: z.string().min(1, "Translation value is required"),
            }),
        )
        .length(3, "Must have exactly 3 translations"),
})

export const addStatisticSchema = z.object({
    count: z.number().min(0, "Count must be non-negative"),
    az: z.string().min(1, "Azerbaijani translation is required"),
    en: z.string().min(1, "English translation is required"),
    ru: z.string().min(1, "Russian translation is required"),
})


export type AddStatisticForm = z.infer<typeof addStatisticSchema>

export const statisticsArraySchema = z.array(statisticSchema)

export type Statistic = z.infer<typeof statisticSchema>