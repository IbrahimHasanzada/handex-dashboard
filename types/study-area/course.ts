export interface Translation {
    table?: string
    course_detail?: string
    description?: string
    name?: string
    value?: string
    lang: "az" | "en" | "ru"
}

export interface FAQ {
    title: string
    description: string
    lang: "az" | "en" | "ru"
}

export interface Program {
    name: string
    translations: Translation[]
    studyArea: number
}

export interface Meta {
    translations: Translation[]
}

export interface Course {
    name: string
    date: string[]
    slug: string
    color: string
    image: number
    translations: Translation[]
    faq: FAQ[]
    program: Program[]
    meta: Meta[]
}
