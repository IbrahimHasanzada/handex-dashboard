"use client"

import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CourseFormData } from "@/validations/study-area/course-add.validation"
import type { Dispatch, SetStateAction } from "react"
import { ImageUpload } from "./image-upload"
import type { imageState } from "@/types/home/graduates.dto"
import { editorConfig } from "@/utils/editor-config"
import dynamic from "next/dynamic"
const Editor = dynamic(
    () => import('@tinymce/tinymce-react').then((mod) => mod.Editor),
    { ssr: false }
);
interface CourseProgramProps {
    form: UseFormReturn<CourseFormData>
    setProgramImageStates: Dispatch<SetStateAction<Record<number, imageState>>>
    programImageStates: Record<number, imageState>
    programAltTexts: Record<number, string>
    setProgramAltTexts: Dispatch<SetStateAction<Record<number, string>>>
}

export function CourseProgram({
    form,
    setProgramImageStates,
    programImageStates,
    setProgramAltTexts,
    programAltTexts,
}: CourseProgramProps) {

    const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY
    const {
        fields: programFields,
        append: appendProgram,
        remove: removeProgram,
    } = useFieldArray({
        control: form.control,
        name: "program",
    })

    const languages = [
        { code: "az", name: "Azərbaycan" },
        { code: "en", name: "English" },
        { code: "ru", name: "Русский" },
    ]

    const handleProgramImageUpload = (index: number, imageId: number) =>
        form.setValue(`program.${index}.image` as any, imageId)

    const setProgramImageState = (index: number) => (newState: any) => {
        setProgramImageStates((prev) => ({
            ...prev,
            [index]: typeof newState === "function" ? newState(prev[index] || {}) : newState,
        }))
    }

    const setProgramAltText = (index: number) => (altText: string) => {
        setProgramAltTexts((prev) => ({
            ...prev,
            [index]: altText,
        }))
    }

    const getPlaceholder = (language: string): string => {
        const placeholders: Record<string, string> = {
            az: "Proqram təsviri (Azərbaycanca)",
            en: "Program description (English)",
            ru: "Описание программы (Русский)",
        }
        return placeholders[language] || "Proqram təsviri"
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Kurs Proqramı</CardTitle>
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
                                    <Label htmlFor={`program.${index}.name`}>Proqram Adı *</Label>
                                    <Input
                                        {...form.register(`program.${index}.name`)}
                                        placeholder="Proqram adı"
                                        id={`program.${index}.name`}
                                    />
                                    {form.formState.errors.program?.[index]?.name && (
                                        <p className="text-sm text-red-500">{form.formState.errors.program[index]?.name?.message}</p>
                                    )}
                                </div>
                                {/* Image upload section using ImageUpload component */}
                                <div className="space-y-2">
                                    <ImageUpload
                                        onImageUpload={(imageId) => handleProgramImageUpload(index, imageId)}
                                        setImageState={setProgramImageState(index)}
                                        imageState={
                                            programImageStates[index] || { preview: null, id: null, error: null, selectedFile: null }
                                        }
                                        altText={programAltTexts[index] || ""}
                                        setAltText={setProgramAltText(index)}
                                    />
                                    <input type="hidden" {...form.register(`program.${index}.image` as any)} />
                                    {form.formState.errors.program?.[index]?.image && (
                                        <p className="text-sm text-red-500">{form.formState.errors.program[index]?.image?.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-base font-medium">Tərcümələr *</Label>
                                <Tabs defaultValue="az" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        {languages.map((lang) => (
                                            <TabsTrigger key={lang.code} value={lang.code}>
                                                {lang.name}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                    {languages.map((lang, langIndex) => (
                                        <TabsContent key={lang.code} value={lang.code} className="space-y-2">
                                            <Editor
                                                value={form.watch(`program.${index}.translations.${langIndex}.description`) || ""}
                                                onEditorChange={(content: any) => {
                                                    form.setValue(`program.${index}.translations.${langIndex}.description`, content, {
                                                        shouldValidate: true,
                                                    })
                                                }}
                                                apiKey={apiKey}
                                                init={
                                                    {
                                                        ...editorConfig,
                                                        language: lang.code,
                                                        placeholder: getPlaceholder(lang.code),
                                                    } as any
                                                }
                                            />
                                            {form.formState.errors.program?.[index]?.translations?.[langIndex]?.description && (
                                                <p className="text-sm text-red-500">
                                                    {form.formState.errors.program[index]?.translations?.[langIndex]?.description?.message}
                                                </p>
                                            )}
                                            <input
                                                type="hidden"
                                                {...form.register(`program.${index}.translations.${langIndex}.lang`)}
                                                value={lang.code}
                                            />
                                        </TabsContent>
                                    ))}
                                </Tabs>
                                {form.formState.errors.program?.[index]?.translations &&
                                    typeof form.formState.errors.program[index]?.translations === "object" &&
                                    "message" in form.formState.errors.program[index]!.translations! && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.program[index]?.translations?.message}
                                        </p>
                                    )}
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
                            image: null as any,
                            translations: languages.map((lang) => ({ lang: lang.code, description: "" })) as any,
                        })
                    }
                    className="w-full"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Proqram əlavə et
                </Button>
                {programFields.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>Hələ proqram əlavə edilməyib</p>
                        <p className="text-sm">Proqramlar kursun məzmunu və strukturu üçün istifadə olunur</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
