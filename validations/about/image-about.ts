import { z } from "zod";

export const aboutImageSchema = z.object({
    image: z.number().min(-1, { message: "Şəkil seçilməlidir." }),
})