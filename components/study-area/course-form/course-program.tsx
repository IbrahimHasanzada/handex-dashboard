"use client"

import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseFormData } from "@/validations/study-area/course-add.validation"

interface CourseProgramProps {
    form: UseFormReturn<CourseFormData>
}

export function CourseProgram({ form }: CourseProgramProps) {
    const {
        fields: programFields,
        append: appendProgram,
        remove: removeProgram,
    } = useFieldArray({
        control: form.control,
        name: "program",
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Proqram</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {programFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium">Proqram {index + 1}</h4>
                            {programFields.length > 1 && (
                                <Button type="button" variant="outline" size="icon" onClick={() => removeProgram(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Proqram Adı</Label>
                                    <Input {...form.register(`program.${index}.name`)} placeholder="Proqram adı" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tədris Sahəsi</Label>
                                    <Input
                                        type="number"
                                        {...form.register(`program.${index}.studyArea`, { valueAsNumber: true })}
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label>Tərcümələr</Label>
                                {["az", "en", "ru"].map((lang, langIndex) => (
                                    <div key={lang} className="border rounded p-3">
                                        <Label className="text-sm font-medium mb-2 block">
                                            {lang === "az" ? "Azərbaycan" : lang === "en" ? "English" : "Русский"}
                                        </Label>
                                        <Textarea
                                            {...form.register(`program.${index}.translations.${langIndex}.description`)}
                                            placeholder="Proqram təsviri"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        appendProgram({
                            name: "",
                            translations: [
                                { description: "", lang: "az" },
                                { description: "", lang: "en" },
                                { description: "", lang: "ru" },
                            ],
                            studyArea: 0,
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" /> Proqram Əlavə Et
                </Button>
            </CardContent>
        </Card>
    )
}
