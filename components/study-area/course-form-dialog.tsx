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
import { type CourseFormData, courseSchema } from "@/validations/study-area/course-add.validation"
import { CourseTranslations } from "./course-form/course-translation"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface CourseFormDialogProps {
    onSubmit: (data: CourseFormData) => void
}

export function CourseFormDialog({ onSubmit }: CourseFormDialogProps) {
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

    const form = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            name: "",
            date: [""],
            slug: "",
            color: "#DE465D",
            image: 1, // Changed from 0 to 1 as default
            translations: [
                { table: "", course_detail: "", lang: "az" },
                { table: "", course_detail: "", lang: "en" },
                { table: "", course_detail: "", lang: "ru" },
            ],
            faq: [
                { title: "", description: "", lang: "az" },
                { title: "", description: "", lang: "en" },
                { title: "", description: "", lang: "ru" },
            ],
            program: [
                {
                    name: "",
                    translations: [
                        { description: "", lang: "az" },
                        { description: "", lang: "en" },
                        { description: "", lang: "ru" },
                    ],
                },
            ],
            meta: [],
        },
    })

    const handleSubmit = (data: CourseFormData) => {
        console.log("Form submitted with data:", data)
        onSubmit(data)
        setOpen(false)
        form.reset()
        setImageState({
            preview: null,
            id: null,
            error: null,
            selectedFile: null,
        })
    }

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submit triggered")
        console.log("Form is valid:", form.formState.isValid)
        console.log("Form errors:", form.formState.errors)
        console.log("Current form values:", form.getValues())

        form.handleSubmit(handleSubmit, (errors) => {
            console.log("Validation errors:", errors)
        })(e)
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim()
    }

    // Force validation check
    const checkValidation = () => {
        form.trigger()
    }

    // Helper function to render form errors in a readable format
    const renderFormErrors = (errors: any, parentPath = ""): JSX.Element[] => {
        const errorElements: JSX.Element[] = []

        const getFieldDisplayName = (path: string): string => {
            const pathMap: Record<string, string> = {
                name: "Kurs Adı",
                slug: "Slug",
                color: "Rəng",
                image: "Şəkil",
                date: "Tarixlər",
                translations: "Tərcümələr",
                table: "Cədvəl",
                course_detail: "Kurs Təfərrüatı",
                faq: "FAQ",
                title: "Başlıq",
                description: "Təsvir",
                program: "Proqram",
                studyArea: "Təhsil Sahəsi",
                meta: "Meta Məlumatları",
                value: "Dəyər",
                lang: "Dil",
            }

            // Handle array indices
            const parts = path.split(".")
            const displayParts = parts.map((part, index) => {
                if (!isNaN(Number(part))) {
                    const prevPart = parts[index - 1]
                    if (prevPart === "program") return `Proqram ${Number(part) + 1}`
                    if (prevPart === "faq") return `FAQ ${Number(part) + 1}`
                    if (prevPart === "meta") return `Meta ${Number(part) + 1}`
                    if (prevPart === "translations") {
                        const langMap = ["Azərbaycan", "English", "Русский"]
                        return langMap[Number(part)] || `Tərcümə ${Number(part) + 1}`
                    }
                    return `${Number(part) + 1}`
                }
                return pathMap[part] || part
            })

            return displayParts.join(" → ")
        }

        Object.keys(errors).forEach((key) => {
            const currentPath = parentPath ? `${parentPath}.${key}` : key
            const error = errors[key]

            if (error && typeof error === "object") {
                if (error.message) {
                    // This is a leaf error with a message
                    errorElements.push(
                        <div key={currentPath} className="text-red-600 bg-red-50 p-2 rounded">
                            <strong>{getFieldDisplayName(currentPath)}:</strong> {error.message}
                        </div>,
                    )
                } else if (Array.isArray(error)) {
                    // Handle array errors
                    error.forEach((item, index) => {
                        if (item && typeof item === "object") {
                            errorElements.push(...renderFormErrors(item, `${currentPath}.${index}`))
                        }
                    })
                } else {
                    // Nested object, recurse
                    errorElements.push(...renderFormErrors(error, currentPath))
                }
            }
        })

        return errorElements
    }

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

                <form onSubmit={handleFormSubmit} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="basic">Əsas</TabsTrigger>
                            <TabsTrigger value="translations">Tərcümələr</TabsTrigger>
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

                        <TabsContent value="faq" className="space-y-4">
                            <CourseFAQ form={form} />
                        </TabsContent>

                        <TabsContent value="program" className="space-y-4">
                            <CourseProgram form={form} />
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
