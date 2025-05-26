export interface ContactData {
    phone: string[]
    location: string
    email: string
}

export interface ValidationErrors {
    phone?: string
    location?: string
    email?: string
}