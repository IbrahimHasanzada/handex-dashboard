import { z } from "zod";

export const formSchemaNews = z.object({
    title: z.string().min(2, {
        message: "Title must be at least 2 characters.",
    }),
    content: z.string().min(10, {
        message: "Content must be at least 10 characters.",
    }),
    featuredImage: z.string().optional(),
})