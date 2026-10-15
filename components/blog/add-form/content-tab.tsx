"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowUpRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
const TinyMCE = dynamic(
    () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
    {
        ssr: false, 
        loading: () => <p>Editor yüklənir...</p>
    }
);
import { editorConfig } from "@/utils/editor-config"
import { placeholdersNews } from "@/utils/input-placeholders"
import dynamic from "next/dynamic";
import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"

interface ContentTabProps {
    form: UseFormReturn<any>
    apiKey: string | undefined
    selectedLanguage: string
    setSelectedLanguage: (arg: string) => void
}

export function ContentTab({ form, apiKey, selectedLanguage, setSelectedLanguage }: ContentTabProps) {

    return (
        <Tabs
            value={selectedLanguage}
            onValueChange={(language: any) => {
                setSelectedLanguage(language)
            }}
        >
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ru">Русский</TabsTrigger>
            </TabsList>

            {["az", "en", "ru"].map((lang, index) => (
                <TabsContent key={index} value={lang} className="space-y-6">
                    <FormField
                        control={form.control}
                        name={`title_${lang}`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{lang === "az" ? "Başlıq" : lang === "en" ? "Title" : "Заголовок"}</FormLabel>
                                <FormControl>
                                    <Input placeholder={placeholdersNews[lang].title} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name={`content_${lang}`}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{lang === "az" ? "Məzmun" : lang === "en" ? "Content" : "Содержание"}</FormLabel>
                                <FormControl>
                                    <TinyMCE
                                        value={field.value as string}
                                        onEditorChange={(content) => {
                                            field.onChange(content)
                                        }}
                                        apiKey={apiKey}
                                        init={{
                                            ...editorConfig as any,
                                            language: lang,
                                            placeholder: placeholdersNews[lang].content,
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <CtaFields form={form} lang={lang} />
                </TabsContent>
            ))}
        </Tabs>
    )
}

const ctaLabels: Record<string, { heading: string; title: string; description: string; button: string; link: string }> = {
    az: { heading: "Bloqun sonunda CTA bloku", title: "Başlıq", description: "Təsvir", button: "Düymə mətni", link: "Link" },
    en: { heading: "Call-to-action at the end of the post", title: "Title", description: "Description", button: "Button text", link: "Link" },
    ru: { heading: "Блок призыва в конце статьи", title: "Заголовок", description: "Описание", button: "Текст кнопки", link: "Ссылка" },
}

function CtaFields({ form, lang }: { form: UseFormReturn<any>; lang: string }) {
    const labels = ctaLabels[lang]
    const [title, description, buttonText, link] = form.watch([
        `cta_title_${lang}`,
        `cta_description_${lang}`,
        `cta_button_text_${lang}`,
        `cta_link_${lang}`,
    ])
    const hasContent = title || description || (buttonText && link)

    const field = (name: string, label: string, placeholder: string, multiline = false) => (
        <FormField
            control={form.control}
            name={`${name}_${lang}`}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        {multiline ? (
                            <Textarea rows={3} placeholder={placeholder} {...field} value={field.value || ""} />
                        ) : (
                            <Input placeholder={placeholder} {...field} value={field.value || ""} />
                        )}
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )

    return (
        <div className="rounded-lg border p-5 space-y-4">
            <div>
                <p className="font-medium">{labels.heading}</p>
                <p className="text-sm text-muted-foreground">
                    İstəyə bağlıdır. Doldurulsa, saytda bloqun məzmununun altında göstərilir. Düymə üçün həm mətn, həm də link yazılmalıdır.
                </p>
            </div>
            {field("cta_title", labels.title, "Məs: Data analitikanı öyrənmək istəyirsiniz?")}
            {field("cta_description", labels.description, "Məs: Ətraflı məlumat üçün təlim səhifəmizə keçin.", true)}
            <div className="grid gap-4 md:grid-cols-2">
                {field("cta_button_text", labels.button, "Məs: Ətraflı öyrən")}
                {field("cta_link", labels.link, "https://handex.edu.az/tedris/...")}
            </div>

            {hasContent && (
                <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Önizləmə</p>
                    <div className="rounded-[20px] bg-white p-5 shadow-sm border flex flex-col md:flex-row md:items-center gap-5">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <img
                                src="https://handex.edu.az/assets/img/blog-cta.webp"
                                alt=""
                                className="size-16 shrink-0 object-contain"
                                onError={(e) => (e.currentTarget.style.display = "none")}
                            />
                            <div className="min-w-0">
                                {title && <p className="text-lg font-bold leading-snug text-[#141414]">{title}</p>}
                                {description && <p className="mt-1 text-sm text-[#666]">{description}</p>}
                            </div>
                        </div>
                        {buttonText && link && (
                            <span className="shrink-0 inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full bg-gradient-to-b from-[rgba(17,17,17,0.8)] to-[rgba(26,26,26,0.9)] text-white font-medium whitespace-nowrap">
                                {buttonText}
                                <ArrowUpRight className="h-4 w-4" />
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
