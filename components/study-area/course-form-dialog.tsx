"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseBasicInfo } from "./course-form/course-basic-info"
import { CourseFAQ } from "./course-form/course-faq"
import { CourseProgram } from "./course-form/course-program"
import { CourseMeta } from "./course-form/course-meta"
import { CourseGroups } from "./course-form/course-groups"
import { type CourseFormData, courseSchema } from "@/validations/study-area/course-add.validation"
import type { JSX } from "react/jsx-runtime"
import { CourseTranslations } from "./course-form/course-translation"
import { renderFormErrors } from "@/utils/course-error-render"
import { courseDefaultValues } from "./course-form/defaultValues"
import { useAddStudyAreaMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import { imageState } from "@/types/home/graduates.dto"

interface CourseFormDialogProps {
    onSubmit: (data: CourseFormData) => void
}

export function CourseFormDialog({ onSubmit }: CourseFormDialogProps) {
    const [addStudyArea] = useAddStudyAreaMutation()
    const [open, setOpen] = useState(false)
    const [altText, setAltText] = useState("")
    const [imageState, setImageState] = useState<{
        preview: string | null
        id: number | null
        error: string | null
        selectedFile: File | null
    }>({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
    })
    const [programImageStates, setProgramImageStates] = useState<Record<number, imageState>>({})
    const [programAltTexts, setProgramAltTexts] = useState<Record<number, string>>({})

    const form = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: courseDefaultValues
    })

    const handleSubmit = async (data: CourseFormData) => {
        try {
            await addStudyArea(data).unwrap()
            toast.success("Tədris sahəsi uğurla əlavə olundu")
            onSubmit(data)
            setOpen(false)
            form.reset()
            setImageState({
                preview: null,
                id: null,
                error: null,
                selectedFile: null,
            })
        } catch (error: any) {
            toast.error(error.data)
        }
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim()
    }

    const checkValidation = () => { form.trigger() }



    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Yeni Kurs Əlavə Et
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Yeni Kurs Əlavə Et</DialogTitle>
                    <DialogDescription>Yeni kurs yaradın və bütün lazımi məlumatları doldurun</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-6">
                            <TabsTrigger value="basic">Əsas</TabsTrigger>
                            <TabsTrigger value="translations">Tərcümələr</TabsTrigger>
                            <TabsTrigger value="groups">Qruplar</TabsTrigger>
                            <TabsTrigger value="faq">FAQ</TabsTrigger>
                            <TabsTrigger value="program">Proqram</TabsTrigger>
                            <TabsTrigger value="meta">Meta</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <CourseBasicInfo
                                setAltText={setAltText}
                                altText={altText}
                                setImageState={setImageState}
                                imageState={imageState}
                                form={form}
                                generateSlug={generateSlug}
                            />
                        </TabsContent>

                        <TabsContent value="translations" className="space-y-4">
                            <CourseTranslations form={form} />
                        </TabsContent>

                        <TabsContent value="groups" className="space-y-4">
                            <CourseGroups form={form} />
                        </TabsContent>

                        <TabsContent value="faq" className="space-y-4">
                            <CourseFAQ form={form} />
                        </TabsContent>

                        <TabsContent value="program" className="space-y-4">
                            <CourseProgram
                                programAltTexts={programAltTexts}
                                setProgramAltTexts={setProgramAltTexts}
                                setProgramImageStates={setProgramImageStates}
                                programImageStates={programImageStates}
                                form={form}
                            />
                        </TabsContent>

                        <TabsContent value="meta" className="space-y-4">
                            <CourseMeta form={form} />
                        </TabsContent>
                    </Tabs>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Ləğv Et
                        </Button>
                        <Button type="button" variant="outline" onClick={checkValidation}>
                            Yoxla
                        </Button>
                        <Button type="submit">Kurs Əlavə Et</Button>
                    </div>
                </form>

                {/* Debug information - remove in production */}
                {process.env.NODE_ENV === "development" && (
                    <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
                        <p>
                            <strong>Form Valid:</strong> {form.formState.isValid ? "Yes" : "No"}
                        </p>
                        <p>
                            <strong>Form Dirty:</strong> {form.formState.isDirty ? "Yes" : "No"}
                        </p>
                        <p>
                            <strong>Errors:</strong> {Object.keys(form.formState.errors).length}
                        </p>
                        <p>
                            <strong>Image Value:</strong> {form.watch("image")}
                        </p>

                        {Object.keys(form.formState.errors).length > 0 && (
                            <div className="mt-4">
                                <strong className="text-red-600">Form Errors:</strong>
                                <div className="mt-2 space-y-1">{renderFormErrors(form.formState.errors)}</div>
                            </div>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
