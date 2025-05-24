"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseFormData } from "@/validations/study-area/course-add.validation"

interface CourseTranslationsProps {
    form: UseFormReturn<CourseFormData>
}

export function CourseTranslations({ form }: CourseTranslationsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tərcümələr</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {["az", "en", "ru"].map((lang, langIndex) => (
                    <div key={lang} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-4 capitalize">
                            {lang === "az" ? "Azərbaycan" : lang === "en" ? "English" : "Русский"}
                        </h4>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Cədvəl</Label>
                                <Input {...form.register(`translations.${langIndex}.table`)} placeholder="5 ay, həftədə 3 dəfə" />
                            </div>
                            <div className="space-y-2">
                                <Label>Kurs Təfərrüatı</Label>
                                <Textarea
                                    {...form.register(`translations.${langIndex}.course_detail`)}
                                    placeholder="Kurs haqqında ətraflı məlumat"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
