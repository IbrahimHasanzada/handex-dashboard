import { z } from "zod";

const textSideSchema = z.object({
    type: z.literal("text"),
    translations: z
        .array(
            z.object({
                value: z.string().min(1, "Bu sahə boş ola bilməz"),
                lang: z.enum(["az", "en", "ru"]),
            })
        )
        .length(3, "3 dil daxil edilməlidir"),
    url: z.literal("").optional(), 
});

const imageSideSchema = z.object({
    type: z.literal("image"),
    url: z.string().url("Düzgün URL daxil edin"),
    translations: z.any().optional(),
});

const sideSchema = z.discriminatedUnion("type", [textSideSchema, imageSideSchema]);

export const defaultValuesSchema = z.object({
    left_side: sideSchema,
    right_side: sideSchema,
});
