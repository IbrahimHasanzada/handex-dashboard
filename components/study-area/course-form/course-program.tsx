"use client"

import { type UseFormReturn, useFieldArray } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CourseFormData } from "@/validations/study-area/course-add.validation"
import { Dispatch, SetStateAction } from "react"
import { ImageUpload } from "./image-upload"
import type { imageState } from "@/types/home/graduates.dto"

interface CourseProgramProps {
    form: UseFormReturn<CourseFormData>
    setProgramImageStates: Dispatch<SetStateAction<Record<number, imageState>>>
    programImageStates: Record<number, imageState>
    programAltTexts: Record<number, string>
    setProgramAltTexts: Dispatch<SetStateAction<Record<number, string>>>
}

export function CourseProgram({ form, setProgramImageStates, programImageStates, setProgramAltTexts, programAltTexts }: CourseProgramProps) {
    const {
        fields: programFields,
        append: appendProgram,
        remove: removeProgram,
    } = useFieldArray({
        control: form.control,
        name: "program",
    })




    const handleProgramImageUpload = (index: number, imageId: number) => form.setValue(`program.${index}.image` as any, imageId)

    const setProgramImageState = (index: number) => (newState: any) => {
        setProgramImageStates(
            (prev) => ({
                ...prev,
                [index]: typeof newState === "function"
                    ? newState(prev[index] || {})
                    : newState,
            })
        )
    }

    const setProgramAltText = (index: number) => (altText: string) => {
        setProgramAltTexts(
            (prev) => ({
                ...prev,
                [index]: altText,
            }))
    }

    const handleRemoveProgram = (index: number) => {
        removeProgram(index)

        setProgramImageStates((prev) => {
            const newStates = { ...prev }
            delete newStates[index]
            const reindexed: Record<number, imageState> = {}
            Object.keys(newStates).forEach((key) => {
                const keyNum = Number.parseInt(key)
                if (keyNum > index) {
                    reindexed[keyNum - 1] = newStates[keyNum]
                } else {
                    reindexed[keyNum] = newStates[keyNum]
                }
            })
            return reindexed
        })

        setProgramAltTexts((prev) => {
            const newTexts = { ...prev }
            delete newTexts[index]
            const reindexed: Record<number, string> = {}
            Object.keys(newTexts).forEach((key) => {
                const keyNum = Number.parseInt(key)
                if (keyNum > index) {
                    reindexed[keyNum - 1] = newTexts[keyNum]
                } else {
                    reindexed[keyNum] = newTexts[keyNum]
                }
            })
            return reindexed
        })
    }

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
                                <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveProgram(index)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Proqram Adı *</Label>
                                    <Input {...form.register(`program.${index}.name`)} placeholder="Proqram adı" />
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
                                <Label>Tərcümələr *</Label>
                                {["az", "en", "ru"].map((lang, langIndex) => (
                                    <div key={lang} className="border rounded p-3">
                                        <Label className="text-sm font-medium mb-2 block">
                                            {lang === "az" ? "Azərbaycan" : lang === "en" ? "English" : "Русский"} *
                                        </Label>
                                        <Textarea
                                            {...form.register(`program.${index}.translations.${langIndex}.description`)}
                                            placeholder="Proqram təsviri"
                                        />
                                        {form.formState.errors.program?.[index]?.translations?.[langIndex]?.description && (
                                            <p className="text-sm text-red-500">
                                                {form.formState.errors.program[index]?.translations?.[langIndex]?.description?.message}
                                            </p>
                                        )}
                                        <input
                                            type="hidden"
                                            {...form.register(`program.${index}.translations.${langIndex}.lang`)}
                                            value={lang}
                                        />
                                    </div>
                                ))}
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
                    onClick={() => {
                        const newIndex = programFields.length
                        appendProgram({
                            name: "",
                            image: 0,
                            translations: [
                                { description: "", lang: "az" },
                                { description: "", lang: "en" },
                                { description: "", lang: "ru" },
                            ],
                        })

                        setProgramImageStates((prev) => ({
                            ...prev,
                            [newIndex]: { preview: null, id: null, error: null, selectedFile: null },
                        }))
                        setProgramAltTexts((prev) => ({
                            ...prev,
                            [newIndex]: "",
                        }))
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" /> Proqram Əlavə Et
                </Button>
            </CardContent>
        </Card>
    )
}
