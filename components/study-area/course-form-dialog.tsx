"use client"

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
import { CourseFormData, courseSchema } from "@/validations/study-area/course-add.validation"
import { CourseTranslations } from "./course-form/course-translation"

interface CourseFormDialogProps {
    onSubmit: (data: CourseFormData) => void
}

export function CourseFormDialog({ onSubmit }: CourseFormDialogProps) {
    const [open, setOpen] = useState(false)

    const form = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
        defaultValues: {
            name: "",
            date: [""],
            slug: "",
            color: "#DE465D",
            image: 0,
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
                    studyArea: 0,
                },
            ],
            meta: [],
        },
    })

    const handleSubmit = (data: CourseFormData) => {
        onSubmit(data)
        setOpen(false)
        form.reset()
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .trim()
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

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="grid w-full grid-cols-5">
                            <TabsTrigger value="basic">Əsas</TabsTrigger>
                            <TabsTrigger value="translations">Tərcümələr</TabsTrigger>
                            <TabsTrigger value="faq">FAQ</TabsTrigger>
                            <TabsTrigger value="program">Proqram</TabsTrigger>
                            <TabsTrigger value="meta">Meta</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-4">
                            <CourseBasicInfo form={form} generateSlug={generateSlug} />
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
                        <Button type="submit">Kurs Əlavə Et</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
