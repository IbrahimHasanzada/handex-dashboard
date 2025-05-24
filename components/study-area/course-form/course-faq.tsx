"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CourseFormData } from "@/validations/study-area/course-add.validation"

interface CourseFAQProps {
    form: UseFormReturn<CourseFormData>
}

export function CourseFAQ({ form }: CourseFAQProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="az" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ru">Русский</TabsTrigger>
                    </TabsList>
                    <TabsContent value="az" className="space-y-4 mt-4">
                        <div className="border rounded-lg p-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Başlıq</Label>
                                    <Input {...form.register(`faq.0.title`)} placeholder="Sual başlığı" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Təsvir</Label>
                                    <Textarea {...form.register(`faq.0.description`)} placeholder="Cavab" />
                                </div>
                                <input type="hidden" {...form.register(`faq.0.lang`)} value="az" />
                            </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="en" className="space-y-4 mt-4">
                        <div className="border rounded-lg p-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input {...form.register(`faq.1.title`)} placeholder="Question title" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Textarea {...form.register(`faq.1.description`)} placeholder="Answer" />
                                </div>
                                <input type="hidden" {...form.register(`faq.1.lang`)} value="en" />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="ru" className="space-y-4 mt-4">
                        <div className="border rounded-lg p-4">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Заголовок</Label>
                                    <Input {...form.register(`faq.2.title`)} placeholder="Заголовок вопроса" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Описание</Label>
                                    <Textarea {...form.register(`faq.2.description`)} placeholder="Ответ" />
                                </div>
                                <input type="hidden" {...form.register(`faq.2.lang`)} value="ru" />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
