"use client"

import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseFormData } from "@/validations/study-area/course-add.validation"
import { ImageUpload } from "./image-upload"

interface CourseBasicInfoProps {
    form: UseFormReturn<CourseFormData>
    generateSlug: (name: string) => string
}

export function CourseBasicInfo({ form, generateSlug }: CourseBasicInfoProps) {
    const {
        fields: dateFields,
        append: appendDate,
        remove: removeDate,
    } = useFieldArray<any>({
        control: form.control,
        name: "date",
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Əsas Məlumatlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Kurs Adı</Label>
                        <Input
                            id="name"
                            {...form.register("name")}
                            onChange={(e) => {
                                form.setValue("name", e.target.value)
                                form.setValue("slug", generateSlug(e.target.value))
                            }}
                            placeholder="Kurs adını daxil edin"
                        />
                        {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input id="slug" {...form.register("slug")} placeholder="kurs-slug" />
                        {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="color">Rəng</Label>
                        <div className="flex gap-2">
                            <Input
                                id="color"
                                type="color"
                                {...form.register("color")}
                                className="w-20"
                                onChange={(e) => {
                                    form.setValue("color", e.target.value)
                                }}
                            />
                            <Input
                                {...form.register("color")}
                                placeholder="#DE465D"
                                className="flex-1"
                                onChange={(e) => {
                                    form.setValue("color", e.target.value)
                                }}
                            />
                        </div>
                        {form.formState.errors.color && (
                            <p className="text-sm text-red-500">{form.formState.errors.color.message}</p>
                        )}
                    </div>
                    <ImageUpload onImageUpload={(imageId: number) => form.setValue("image", imageId)} />
                </div>

                <div className="space-y-2">
                    <Label>Tarixlər</Label>
                    {dateFields.map((field, index) => (
                        <div key={field.id} className="flex gap-2">
                            <Input type="date" {...form.register(`date.${index}`)} placeholder="YYYY-MM-DD" />
                            {dateFields.length > 1 && (
                                <Button type="button" variant="outline" size="icon" onClick={() => removeDate(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => appendDate("")}>
                        <Plus className="mr-2 h-4 w-4" /> Tarix Əlavə Et
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
