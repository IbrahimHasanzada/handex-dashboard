"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Editor } from "@tinymce/tinymce-react"
import { editorConfig } from "@/utils/editor-config"
import { placeholdersNews } from "@/utils/input-placeholders"
import type { UseFormReturn } from "react-hook-form"

interface ContentTabProps {
    form: UseFormReturn<any>
    apiKey: string | undefined
    selectedLanguage: string
    setSelectedLanguage: (lang: string) => void
}

export function ContentTab({ form, apiKey, selectedLanguage, setSelectedLanguage }: ContentTabProps) {
    return (
        <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                <TabsTrigger value="en">English</TabsTrigger>
                <TabsTrigger value="ru">Русский</TabsTrigger>
            </TabsList>

            {["az", "en", "ru"].map((lang) => (
                <TabsContent key={lang} value={lang} className="space-y-6">
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
                                    <Editor
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
                </TabsContent>
            ))}
        </Tabs>
    )
}
