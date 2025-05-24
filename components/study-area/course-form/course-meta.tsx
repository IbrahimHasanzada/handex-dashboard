"use client"

import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CourseFormData } from "@/validations/study-area/course-add.validation"

interface CourseMetaProps {
    form: UseFormReturn<CourseFormData>
}

export function CourseMeta({ form }: CourseMetaProps) {
    const {
        fields: metaFields,
        append: appendMeta,
        remove: removeMeta,
    } = useFieldArray({
        control: form.control,
        name: "meta",
    })

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Meta Məlumatları</CardTitle>
                    <CardDescription>SEO və meta məlumatları əlavə edin</CardDescription>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        appendMeta({
                            translations: [
                                { name: "", value: "", lang: "az" },
                                { name: "", value: "", lang: "en" },
                                { name: "", value: "", lang: "ru" },
                            ],
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" /> Meta Əlavə Et
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {metaFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium">Meta {index + 1}</h4>
                            {metaFields.length > 0 && (
                                <Button type="button" variant="outline" size="icon" onClick={() => removeMeta(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <Label>Tərcümələr</Label>
                            {["az", "en", "ru"].map((lang, langIndex) => (
                                <div key={lang} className="border rounded p-3">
                                    <Label className="text-sm font-medium mb-2 block">
                                        {lang === "az" ? "Azərbaycan" : lang === "en" ? "English" : "Русский"}
                                    </Label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Ad</Label>
                                            <Input
                                                {...form.register(`meta.${index}.translations.${langIndex}.name`)}
                                                placeholder="Meta adı (məs: description, keywords)"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Dəyər</Label>
                                            <Input
                                                {...form.register(`meta.${index}.translations.${langIndex}.value`)}
                                                placeholder="Meta dəyəri"
                                            />
                                        </div>
                                    </div>
                                    <input
                                        type="hidden"
                                        {...form.register(`meta.${index}.translations.${langIndex}.lang`)}
                                        value={lang}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {metaFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Hələ meta məlumatı əlavə edilməyib</p>
                        <p className="text-sm">Meta məlumatları SEO üçün istifadə olunur</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
