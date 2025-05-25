"use client"

import type React from "react"

import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CourseFormData } from "@/validations/study-area/course-add.validation"
import { ImageUpload } from "./image-upload"
import type { imageState } from "@/types/home/graduates.dto"

interface CourseBasicInfoProps {
    form: UseFormReturn<CourseFormData>
    generateSlug: (name: string) => string
    setImageState: any
    imageState: imageState
    setAltText: any
    altText: string
}

export function CourseBasicInfo({ form, generateSlug, setImageState, imageState, altText, setAltText }: CourseBasicInfoProps) {
    const {
        fields: dateFields,
        append: appendDate,
        remove: removeDate,
    } = useFieldArray<any>({
        control: form.control,
        name: "date",
    })

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        form.setValue("name", value)
        // Auto-generate slug when name changes
        if (value) {
            form.setValue("slug", generateSlug(value))
        }
    }

    const handleImageUpload = (imageId: number) => {
        console.log("Setting image ID:", imageId)
        form.setValue("image", imageId, { shouldValidate: true })
        // Trigger validation
        form.trigger("image")
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Əsas Məlumatlar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Kurs Adı *</Label>
                        <Input
                            id="name"
                            {...form.register("name")}
                            onChange={handleNameChange}
                            placeholder="Kurs adını daxil edin"
                        />
                        {form.formState.errors.name && <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug *</Label>
                        <Input id="slug" {...form.register("slug")} placeholder="kurs-slug" />
                        {form.formState.errors.slug && <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="color">Rəng</Label>
                        <div className="flex gap-2">
                            <Input id="color" type="color" {...form.register("color")} className="w-20" />
                            <Input {...form.register("color")} placeholder="#DE465D" className="flex-1" />
                        </div>
                        {form.formState.errors.color && (
                            <p className="text-sm text-red-500">{form.formState.errors.color.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <ImageUpload altText={altText} setAltText={setAltText} setImageState={setImageState} imageState={imageState} onImageUpload={handleImageUpload} />
                        {form.formState.errors.image && (
                            <p className="text-sm text-red-500">{form.formState.errors.image.message}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Current image value: {form.watch("image") || "Not set"}</p>
                    </div>
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
                    {form.formState.errors.date && (
                        <p className="text-sm text-red-500">
                            {Array.isArray(form.formState.errors.date) ? "Tarix xətası var" : form.formState.errors.date.message}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
