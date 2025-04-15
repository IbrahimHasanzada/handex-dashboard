export type Testimonial = {
    id: number | string
    name: string
    bank_name: string
    comment: translations[]
    customer_profile: string,
    bank_logo: string
}

type translations = {
    comment: string,
    lang: string
}