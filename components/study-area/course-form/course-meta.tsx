"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CourseFormData } from "@/validations/study-area/course-add.validation"
import { useState } from "react"

interface CourseMetaProps {
    form: UseFormReturn<CourseFormData>
}

export function CourseMeta({ form }: CourseMetaProps) {
    const [sharedName, setSharedName] = useState("")

    const handleNameChange = (value: string) => {
        setSharedName(value)
        // Update all language versions with the same name
        form.setValue("meta.0.translations.0.name", value) // az
        form.setValue("meta.0.translations.1.name", value) // en
        form.setValue("meta.0.translations.2.name", value) // ru
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Meta Məlumatları</CardTitle>
                <CardDescription>SEO və meta məlumatları əlavə edin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Ad</Label>
                        <Input
                            value={sharedName}
                            onChange={(e) => handleNameChange(e.target.value)}
                            placeholder="Meta adı (məs: description, keywords)"
                        />
                    </div>

                    <Tabs defaultValue="az" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="az">Azərbaycan</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="ru">Русский</TabsTrigger>
                        </TabsList>

                        <TabsContent value="az" className="space-y-2">
                            <Label>Dəyər</Label>
                            <Input {...form.register("meta.0.translations.0.value")} placeholder="Meta dəyəri" />
                            <input type="hidden" {...form.register("meta.0.translations.0.lang")} value="az" />
                        </TabsContent>

                        <TabsContent value="en" className="space-y-2">
                            <Label>Value</Label>
                            <Input {...form.register("meta.0.translations.1.value")} placeholder="Meta value" />
                            <input type="hidden" {...form.register("meta.0.translations.1.lang")} value="en" />
                        </TabsContent>

                        <TabsContent value="ru" className="space-y-2">
                            <Label>Значение</Label>
                            <Input {...form.register("meta.0.translations.2.value")} placeholder="Мета значение" />
                            <input type="hidden" {...form.register("meta.0.translations.2.lang")} value="ru" />
                        </TabsContent>
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
}
