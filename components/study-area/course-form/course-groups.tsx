"use client"

import type { UseFormReturn } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { CourseFormData } from "@/validations/study-area/course-add.validation"

interface CourseGroupsProps {
    form: UseFormReturn<CourseFormData>
}

export function CourseGroups({ form }: CourseGroupsProps) {
    const languages = [
        { code: "az", name: "Azərbaycan" },
        { code: "en", name: "English" },
        { code: "ru", name: "Русский" },
    ]

    return (
        <Card>
            <CardHeader>
                <CardTitle>Qrup</CardTitle>
                <CardDescription>Kurs qrupu və cədvəl məlumatları</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Start Date */}
                <div className="space-y-2">
                    <Label>Başlama Tarixi</Label>
                    <Input {...form.register("group.0.startDate")} type="date" placeholder="28May" />
                    {form.formState.errors.group?.[0]?.startDate && (
                        <p className="text-sm text-red-500">{form.formState.errors.group[0]?.startDate?.message}</p>
                    )}
                </div>

                {/* Group Text Translations */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">Qrup Adı Tərcümələri</Label>
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
                                <Input {...form.register(`group.0.text.${langIndex}.name`)} placeholder="Qrup adı" />
                                {form.formState.errors.group?.[0]?.text?.[langIndex]?.name && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.group[0]?.text?.[langIndex]?.name?.message}
                                    </p>
                                )}
                                <input type="hidden" {...form.register(`group.0.text.${langIndex}.lang`)} value={lang.code} />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                {/* Table Translations */}
                <div className="space-y-4">
                    <Label className="text-base font-medium">Cədvəl Tərcümələri</Label>
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
                                <Input {...form.register(`group.0.table.${langIndex}.name`)} placeholder="5 ay, həftədə 3 dəfə" />
                                {form.formState.errors.group?.[0]?.table?.[langIndex]?.name && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.group[0]?.table?.[langIndex]?.name?.message}
                                    </p>
                                )}
                                <input type="hidden" {...form.register(`group.0.table.${langIndex}.lang`)} value={lang.code} />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </CardContent>
        </Card>
    )
}
