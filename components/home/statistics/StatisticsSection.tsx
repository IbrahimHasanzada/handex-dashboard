"use client"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Trash2, Plus, Loader2, Box } from "lucide-react"
import { AddStatisticForm, addStatisticSchema, Statistic } from "@/validations/home/statistics.validation"
import { useAddStatisticsMutation, useDeleteStatisticsMutation, useGetStatisticsQuery, useUpdateStatisticsMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"

type Language = "az" | "en" | "ru"

export default function StatisticsSection({ field, studyArea }: { field: string, studyArea?: number }) {
    const [selectedLanguage, setSelectedLanguage] = useState<Language>("az")
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [addStatistics, { isLoading: addLoading }] = useAddStatisticsMutation()
    const [editStatistics, { isLoading: editLoading }] = useUpdateStatisticsMutation()
    const [deleteStatistics] = useDeleteStatisticsMutation()
    const { data: statisticsData, isLoading, isError, refetch } = useGetStatisticsQuery({ lang: selectedLanguage, field })

    const form = useForm<{ value: string, count: number }>({
        resolver: zodResolver(
            z.object({
                value: z.string().min(1, "Məlumat tələb olunur"),
                count: z.string().min(1, "Say tələb olunur və minimum 1 olmalıdır")
            }),
        ),
    })

    const addForm = useForm<AddStatisticForm>({
        resolver: zodResolver(addStatisticSchema),
        defaultValues: {
            count: 0,
            az: "",
            en: "",
            ru: "",
        },
    })


    const handleEdit = (index: number) => {
        setEditingIndex(index)
        setIsDialogOpen(true)
    }

    const onSubmit = async (data: { value: string, count: number }) => {
        try {
            const edit: any = {
                count: data.count,
                field: field,
                translations: [
                    {
                        lang: selectedLanguage,
                        value: data.value
                    }
                ],
                studyArea
            }
            await editStatistics({ params: edit, id: editingIndex }).unwrap()
            setIsDialogOpen(false)
            setEditingIndex(null)
            form.reset()
        } catch (error: any) {
            toast.error("Xəta baş verdi \n" + error.message)
        }
    }

    const handleAdd = async (data: AddStatisticForm) => {
        try {
            const newStatistic = {
                count: `${data.count}`,
                translations: [
                    { lang: "az", value: data.az },
                    { lang: "en", value: data.en },
                    { lang: "ru", value: data.ru },
                ],
                field: field,
                studyArea
            }
            console.log(newStatistic)
            await addStatistics(newStatistic).unwrap()
            toast.success("Statistika uğurla əlavə edildi")
            setIsAddDialogOpen(false)
            addForm.reset()
        } catch (error: any) {
            toast.error("Xəta baş verdi \n" + error.data.message)
        }
    }

    const handleDelete = (index: number) => {
        showDeleteConfirmation(deleteStatistics, index, refetch, {
            title: "Statistikanı silmək istəyirsinizmi?",
            text: "Bu əməliyyat geri qaytarıla bilməz!",
            successText: "Statistika uğurla silindi.",
        })
    }

    return (
        <div className="w-full max-w-7xl mx-auto p-6">
            <div className="flex justify-between">
                {/* Language Switcher */}
                <div className="mb-8">
                    <Tabs value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="az">Azərbaycan</TabsTrigger>
                            <TabsTrigger value="en">English</TabsTrigger>
                            <TabsTrigger value="ru">Русский</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Add New Statistic Button */}
                <div className="mb-6">
                    <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center gap-2">
                        <Plus className="h-4 w-4" />
                        Yeni Statistika Əlavə et
                    </Button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className={statisticsData?.length > 0 ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6' : 'w-full'}>
                {isLoading ?
                    <div className="w-full flex justify-center items-center">
                        <Loader2 className="h-10 w-10" />
                    </div>
                    : statisticsData?.length === 0 ?
                        <div className="w-full flex gap-5 justify-center items-center flex-col">
                            <Box className="h-10 w-10" />
                            Statistika yoxdur
                        </div>
                        :
                        statisticsData?.map((statistic: any, index: number) => (
                            <Card key={index} className="relative group hover:shadow-lg transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-2  transition-opacity"
                                        onClick={() => handleEdit(statistic.id)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute top-2 right-10   transition-opacity text-destructive hover:text-destructive"
                                        onClick={() => handleDelete(statistic.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>

                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed min-h-[3rem] flex items-center justify-center">
                                        {statistic.text}
                                    </p>
                                    <div className="text-4xl font-bold text-foreground">{statistic.count}</div>
                                </CardContent>
                            </Card>
                        ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Məlumatı Redaktə Et ({selectedLanguage.toUpperCase()})</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label htmlFor="value">Say</Label>
                            <Input id="count" {...form.register("count")} placeholder="Statistika üçün say daxil edin..." />
                            {form.formState.errors.value && (
                                <p className="text-sm text-destructive mt-1">{form.formState.errors.value.message}</p>
                            )}
                            <Label htmlFor="value">Məlumat ({selectedLanguage})</Label>
                            <Input id="value" {...form.register("value")} placeholder="Statistika üçün məlumat daxil edin..." />
                            {form.formState.errors.value && (
                                <p className="text-sm text-destructive mt-1">{form.formState.errors.value.message}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsDialogOpen(false)
                                    setEditingIndex(null)
                                    form.reset()
                                }}
                            >
                                Ləğv et
                            </Button>
                            <Button type="submit">{editLoading ? 'Yüklənir...' : 'Redaktə et'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add New Statistic Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Yeni Statistika Əlavə Et</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={addForm.handleSubmit(handleAdd)} className="space-y-4">
                        <div>
                            <Label htmlFor="count">Say</Label>
                            <Input id="count" type="number" {...addForm.register("count", { valueAsNumber: true })} placeholder="0" />
                            {addForm.formState.errors.count && (
                                <p className="text-sm text-destructive mt-1">{addForm.formState.errors.count.message}</p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label>Məlumat</Label>

                            <div>
                                <Label htmlFor="az" className="text-sm">
                                    Azerbaijani
                                </Label>
                                <Input id="az" {...addForm.register("az")} placeholder="Azərbaycan dilində mətn" />
                                {addForm.formState.errors.az && (
                                    <p className="text-sm text-destructive mt-1">{addForm.formState.errors.az.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="en" className="text-sm">
                                    English
                                </Label>
                                <Input id="en" {...addForm.register("en")} placeholder="Text in English" />
                                {addForm.formState.errors.en && (
                                    <p className="text-sm text-destructive mt-1">{addForm.formState.errors.en.message}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="ru" className="text-sm">
                                    Russian
                                </Label>
                                <Input id="ru" {...addForm.register("ru")} placeholder="Текст на русском языке" />
                                {addForm.formState.errors.ru && (
                                    <p className="text-sm text-destructive mt-1">{addForm.formState.errors.ru.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsAddDialogOpen(false)
                                    addForm.reset()
                                }}
                            >
                                Ləğv et
                            </Button>
                            <Button type="submit">
                                {addLoading ? "Yüklənir..." : "Əlavə et"}

                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
