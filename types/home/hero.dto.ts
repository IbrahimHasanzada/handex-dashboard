export type ContentTranslation = {
    title: string
    desc: string
    lang: string
}

export type MetaTranslationItem = {
    name: string
    value: string
    lang: string
}

export type MetaTranslation = {
    translations: MetaTranslationItem[]
}

export type BannerData = {
    translations: ContentTranslation[]
    images?: string[]
    slug?: string 
    meta: MetaTranslation[]
}