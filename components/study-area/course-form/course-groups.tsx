"use client"

import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { CourseFormData } from "@/validations/study-area/course-add.validation"

interface CourseGroupsProps {
    form: UseFormReturn<CourseFormData>
}

export function CourseGroups({ form }: CourseGroupsProps) {
    const {
        fields: groupFields,
        append: appendGroup,
        remove: removeGroup,
    } = useFieldArray<any>({
        control: form.control,
        name: "group",
    })

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Qruplar</CardTitle>
                    <CardDescription>Kurs qrupları və cədvəl məlumatları</CardDescription>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                        appendGroup({
                            text: [
                                { name: "", lang: "az" },
                                { name: "", lang: "en" },
                                { name: "", lang: "ru" },
                            ],
                            table: [
                                { name: "", lang: "az" },
                                { name: "", lang: "en" },
                                { name: "", lang: "ru" },
                            ],
                            startDate: "",
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" /> Qrup Əlavə Et
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {groupFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium">Qrup {index + 1}</h4>
                            {groupFields.length > 0 && (
                                <Button type="button" variant="outline" size="icon" onClick={() => removeGroup(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>

                        <div className="space-y-6">
                            {/* Start Date */}
                            <div className="space-y-2">
                                <Label>Başlama Tarixi</Label>
                                <Input {...form.register(`group.${index}.startDate`)} type="date" placeholder="28May" />
                                {form.formState.errors.group?.[index]?.startDate && (
                                    <p className="text-sm text-red-500">{form.formState.errors.group[index]?.startDate?.message}</p>
                                )}
                            </div>

                            {/* Group Text Translations */}
                            <div className="space-y-4">
                                <Label className="text-base font-medium">Qrup Adı Tərcümələri</Label>
                                {["az", "en", "ru"].map((lang, langIndex) => (
                                    <div key={`text-${lang}`} className="border rounded p-3">
                                        <Label className="text-sm font-medium mb-2 block">
                                            {lang === "az" ? "Azərbaycan" : lang === "en" ? "English" : "Русский"}
                                        </Label>
                                        <Input {...form.register(`group.${index}.text.${langIndex}.name`)} placeholder="Qrup adı" />
                                        {form.formState.errors.group?.[index]?.text?.[langIndex]?.name && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {form.formState.errors.group[index]?.text?.[langIndex]?.name?.message}
                                            </p>
                                        )}
                                        <input type="hidden" {...form.register(`group.${index}.text.${langIndex}.lang`)} value={lang} />
                                    </div>
                                ))}
                            </div>

                            {/* Table Translations */}
                            <div className="space-y-4">
                                <Label className="text-base font-medium">Cədvəl Tərcümələri</Label>
                                {["az", "en", "ru"].map((lang, langIndex) => (
                                    <div key={`table-${lang}`} className="border rounded p-3">
                                        <Label className="text-sm font-medium mb-2 block">
                                            {lang === "az" ? "Azərbaycan" : lang === "en" ? "English" : "Русский"}
                                        </Label>
                                        <Input
                                            {...form.register(`group.${index}.table.${langIndex}.name`)}
                                            placeholder="5 ay, həftədə 3 dəfə"
                                        />
                                        {form.formState.errors.group?.[index]?.table?.[langIndex]?.name && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {form.formState.errors.group[index]?.table?.[langIndex]?.name?.message}
                                            </p>
                                        )}
                                        <input type="hidden" {...form.register(`group.${index}.table.${langIndex}.lang`)} value={lang} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {groupFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Hələ qrup əlavə edilməyib</p>
                        <p className="text-sm">Qruplar kurs cədvəli və başlama tarixləri üçün istifadə olunur</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
