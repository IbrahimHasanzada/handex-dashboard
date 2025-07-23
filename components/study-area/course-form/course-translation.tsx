"use client"

import type { UseFormReturn } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CourseFormData } from "@/validations/study-area/course-add.validation"
const Editor = dynamic(
    () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
    { ssr: false }
);
import { editorConfig } from "@/utils/editor-config"
import dynamic from "next/dynamic"

interface CourseTranslationsProps {
    form: UseFormReturn<CourseFormData>
}

export function CourseTranslations({ form }: CourseTranslationsProps) {
    const getPlaceholder = (language: string): string => {
        const placeholders: Record<string, string> = {
            az: "Kurs haqqında ətraflı məlumat (Azərbaycanca)",
            en: "Detailed information about the course (English)",
            ru: "Подробная информация о курсе (Русский)",
        }
        return placeholders[language] || "Kurs haqqında ətraflı məlumat"
    }
    const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY

    return (
        <Card>
            <CardHeader>
                <CardTitle>Təsvir</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {["az", "en", "ru"].map((lang, langIndex) => (
                    <div key={lang} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-4 capitalize">
                            {lang === "az" ? "Azərbaycan" : lang === "en" ? "English" : "Русский"}
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Kurs Təfərrüatı *</Label>
                                <Editor
                                    value={form.watch(`translations.${langIndex}.course_detail`) || ""}
                                    onEditorChange={(content: any) => {
                                        form.setValue(`translations.${langIndex}.course_detail`, content, {
                                            shouldValidate: true,
                                        })
                                    }}
                                    apiKey={apiKey}
                                    init={
                                        {
                                            ...editorConfig,
                                            language: lang,
                                            placeholder: getPlaceholder(lang),
                                        } as any
                                    }
                                />
                                {form.formState.errors.translations?.[langIndex]?.course_detail && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.translations[langIndex]?.course_detail?.message}
                                    </p>
                                )}
                            </div>
                            <input type="hidden" {...form.register(`translations.${langIndex}.lang`)} value={lang} />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
