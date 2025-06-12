"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Save, X, Loader2, Calendar } from "lucide-react"
import { toast } from "react-toastify"
import { GroupFormData, GroupFormProps } from "@/types/study-area/group"
import { useAddGroupMutation, useUpdateGroupMutation } from "@/store/handexApi"

const languages = [
    { code: "az" as const, name: "Azərbaycanca" },
    { code: "en" as const, name: "English" },
    { code: "ru" as const, name: "Русский" },
]

export function GroupForm({ studyArea, groupId, existingData, selectedLanguage, onSuccess, trigger }: GroupFormProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [addGroup] = useAddGroupMutation()
    const [editGroup] = useUpdateGroupMutation()
    const isEditMode = !!groupId

    const [formData, setFormData] = useState<GroupFormData>({
        text: [
            { name: "", lang: "az" },
            { name: "", lang: "en" },
            { name: "", lang: "ru" },
        ],
        table: [
            { name: "", lang: "az" },
            { name: "", lang: "en" },
            { name: "", lang: "ru" },
        ],
        startDate: "",
        studyArea,
    })

    useEffect(() => {
        if (existingData && groupId) {
            const getValueForLang = (items: any[], lang: string) => {
                const item = items.find((i) => i.lang === lang)
                return item ? item.value : ""
            }
            if (isEditMode) {
                setFormData({
                    text: [
                        { name: "", lang: "az" },
                        { name: "", lang: "en" },
                        { name: "", lang: "ru" },
                    ].map((t) =>
                        t.lang === selectedLanguage
                            ? { name: getValueForLang(existingData.text, selectedLanguage), lang: selectedLanguage }
                            : t,
                    ),
                    table: [
                        { name: "", lang: "az" },
                        { name: "", lang: "en" },
                        { name: "", lang: "ru" },
                    ].map((t) =>
                        t.lang === selectedLanguage
                            ? { name: getValueForLang(existingData.table, selectedLanguage), lang: selectedLanguage }
                            : t,
                    ),
                    startDate: existingData.startDate,
                    studyArea,
                })
            }
        }
    }, [existingData, groupId, studyArea, selectedLanguage, isEditMode])

    useEffect(() => {
        if (!open) {
            if (!groupId) {
                setFormData({
                    text: [
                        { name: "", lang: "az" },
                        { name: "", lang: "en" },
                        { name: "", lang: "ru" },
                    ],
                    table: [
                        { name: "", lang: "az" },
                        { name: "", lang: "en" },
                        { name: "", lang: "ru" },
                    ],
                    startDate: "",
                    studyArea,
                })
            }
        }
    }, [open, studyArea, groupId])

    const updateTranslation = (type: "text" | "table", lang: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [type]: prev[type].map((t) => (t.lang === lang ? { ...t, name: value } : t)),
        }))
    }

    const validateForm = () => {
        if (!formData.startDate.trim()) {
            toast.error("Başlama tarixi doldurulmalıdır")
            return false
        }

        if (isEditMode) {
            const currentText = formData.text.find((t) => t.lang === selectedLanguage)
            const currentTable = formData.table.find((t) => t.lang === selectedLanguage)

            if (!currentText?.name.trim() || !currentTable?.name.trim()) {
                toast.error("Qrup adı və cədvəl adı doldurulmalıdır")
                return false
            }
        } else {
            const hasValidText = formData.text.every((t) => t.name.trim() !== "")
            const hasValidTable = formData.table.every((t) => t.name.trim() !== "")

            if (!hasValidText || !hasValidTable) {
                toast.error("Bütün dillərdə qrup məlumatı və cədvəl adı doldurulmalıdır")
                return false
            }
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setIsLoading(true)

        try {
            let dataToSend = formData

            if (isEditMode) {
                dataToSend = {
                    ...formData,
                    text: formData.text.filter((t) => t.lang === selectedLanguage),
                    table: formData.table.filter((t) => t.lang === selectedLanguage),
                }
            }
            groupId ? await editGroup({ params: dataToSend, id: groupId }).unwrap() : await addGroup(dataToSend).unwrap()

            toast.success(groupId ? "Qrup uğurla yeniləndi" : "Qrup uğurla əlavə edildi")
            setOpen(false)
            onSuccess?.()
        } catch (error: any) {
            console.error("Error:", error)
            toast.error("Əməliyyat zamanı xəta baş verdi", error.data.message)
        } finally {
            setIsLoading(false)
        }
    }

    const getCurrentTranslation = (type: "text" | "table", lang: string) => {
        return formData[type].find((t) => t.lang === lang) || { name: "", lang }
    }

    const defaultTrigger = (
        <Button variant={groupId ? "ghost" : "default"} size={groupId ? "icon" : "default"}>
            {groupId ? (
                <Edit className="h-4 w-4" />
            ) : (
                <>
                    <Plus className="mr-2 h-4 w-4" />
                    Yeni Qrup
                </>
            )}
        </Button>
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {groupId
                            ? `Qrupu Redaktə Et (${languages.find((l) => l.code === selectedLanguage)?.name})`
                            : "Yeni Qrup Əlavə Et"}
                    </DialogTitle>
                    <DialogDescription>
                        {groupId
                            ? `${languages.find((l) => l.code === selectedLanguage)?.name} dilində qrup məlumatlarını yeniləyin`
                            : "Yeni qrup əlavə edin"}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Başlama Tarixi
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="startDate">Başlama Tarixi</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                                    placeholder="Məsələn: 28May"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {isEditMode ? (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">{languages.find((l) => l.code === selectedLanguage)?.name}</CardTitle>
                                <CardDescription>
                                    {selectedLanguage === "az" && "Azərbaycan dilində məlumatları daxil edin"}
                                    {selectedLanguage === "en" && "Enter information in English"}
                                    {selectedLanguage === "ru" && "Введите информацию на русском языке"}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`text-${selectedLanguage}`}>
                                        {selectedLanguage === "az" && "Qrup Adı"}
                                        {selectedLanguage === "en" && "Group Name"}
                                        {selectedLanguage === "ru" && "Информация о группе"}
                                    </Label>
                                    <Input
                                        id={`text-${selectedLanguage}`}
                                        value={getCurrentTranslation("text", selectedLanguage).name}
                                        onChange={(e) => updateTranslation("text", selectedLanguage, e.target.value)}
                                        placeholder={
                                            selectedLanguage === "az"
                                                ? "Qrup məlumatını daxil edin..."
                                                : selectedLanguage === "en"
                                                    ? "Enter group information..."
                                                    : "Введите информацию о группе..."
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor={`table-${selectedLanguage}`}>
                                        {selectedLanguage === "az" && "Cədvəl Adı"}
                                        {selectedLanguage === "en" && "Table İnformation"}
                                        {selectedLanguage === "ru" && "Название таблицы"}
                                    </Label>
                                    <Input
                                        id={`table-${selectedLanguage}`}
                                        value={getCurrentTranslation("table", selectedLanguage).name}
                                        onChange={(e) => updateTranslation("table", selectedLanguage, e.target.value)}
                                        placeholder={
                                            selectedLanguage === "az"
                                                ? "Cədvəl məlumatlarını daxil edin..."
                                                : selectedLanguage === "en"
                                                    ? "Enter table information..."
                                                    : "Введите название таблицы..."
                                        }
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Tabs defaultValue="az">
                            <TabsList className="grid w-full grid-cols-3">
                                {languages.map((lang) => (
                                    <TabsTrigger key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {languages.map((lang) => (
                                <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">{lang.name}</CardTitle>
                                            <CardDescription>
                                                {lang.code === "az" && "Azərbaycan dilində məlumatları daxil edin"}
                                                {lang.code === "en" && "Enter information in English"}
                                                {lang.code === "ru" && "Введите информацию на русском языке"}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor={`text-${lang.code}`}>
                                                    {lang.code === "az" && "Qrup Məlumatı"}
                                                    {lang.code === "en" && "Group İnformation"}
                                                    {lang.code === "ru" && "Информация о группе"}
                                                </Label>
                                                <Input
                                                    id={`text-${lang.code}`}
                                                    value={getCurrentTranslation("text", lang.code).name}
                                                    onChange={(e) => updateTranslation("text", lang.code, e.target.value)}
                                                    placeholder={
                                                        lang.code === "az"
                                                            ? "Qrup məlumatını daxil edin..."
                                                            : lang.code === "en"
                                                                ? "Enter group information..."
                                                                : "Введите информацию о группе..."
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor={`table-${lang.code}`}>
                                                    {lang.code === "az" && "Cədvəl Məlumatı"}
                                                    {lang.code === "en" && "Table İnformation"}
                                                    {lang.code === "ru" && "Название таблицы"}
                                                </Label>
                                                <Input
                                                    id={`table-${lang.code}`}
                                                    value={getCurrentTranslation("table", lang.code).name}
                                                    onChange={(e) => updateTranslation("table", lang.code, e.target.value)}
                                                    placeholder={
                                                        lang.code === "az"
                                                            ? "Cədvəl məlumatını daxil edin..."
                                                            : lang.code === "en"
                                                                ? "Enter table information..."
                                                                : "Введите название таблицы..."
                                                    }
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            ))}
                        </Tabs>
                    )}

                    <div className="flex justify-end gap-2 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            <X className="mr-2 h-4 w-4" />
                            Ləğv et
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            {groupId ? "Yenilə" : "Əlavə et"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
