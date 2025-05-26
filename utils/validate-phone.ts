import { phoneSchema } from "@/validations/contact/contact.validation"

const validatePhone = (phone: string): string | null => {
    try {
        phoneSchema.parse(phone)
        return null
    } catch (error) {
        if (error instanceof Error) {
            const zodError = JSON.parse(error.message)
            return zodError[0]?.message || "Invalid phone number"
        }
        return "Invalid phone number"
    }
}
export default validatePhone