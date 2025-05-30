"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Users } from "lucide-react"
import { toast } from "react-toastify"
import { GroupForm } from "./group-form"
import { GroupListProps } from "@/types/study-area/group"
import { useDeleteGroupMutation } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"


export function GroupList({ studyArea, groups, selectedLanguage, courseColor, onRefresh }: GroupListProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [delGroup] = useDeleteGroupMutation()
    const handleDelete = async (groupId: number) => {

        setDeletingId(groupId)
        try {
            showDeleteConfirmation(delGroup, groupId, onRefresh, {
                title: "Qrupu silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Qrup uğurla silindi.",
            })

        } catch (error) {
            console.error("Error deleting group:", error)
            toast.error("Qrup silinərkən xəta baş verdi")
        } finally {
            setDeletingId(null)
        }
    }

    const getValueForLanguage = (items: any[], lang: string) => {
        const item = items.find((i) => i.lang === lang)
        return item ? item.value : ""
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Qruplar
                    </CardTitle>
                    <CardDescription>Kurs qruplarını və cədvəllərini idarə edin</CardDescription>
                </div>
                <GroupForm studyArea={studyArea} selectedLanguage={selectedLanguage} onSuccess={onRefresh} />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {groups.map((group) => {
                        const tableValue = getValueForLanguage(group.table, selectedLanguage) || "Dərs günləri həftəiçi"
                        const textValue = getValueForLanguage(group.text, selectedLanguage) || "Qrup adı"

                        return (
                            <div key={group.id} className="relative">
                                <Card className="h-full" style={{ backgroundColor: courseColor, color: "white" }}>
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between">
                                            <div className="text-sm font-medium opacity-90">Cədvəl: {tableValue}</div>
                                            <div className="flex gap-1">
                                                <GroupForm
                                                    studyArea={studyArea}
                                                    groupId={group.id}
                                                    existingData={group}
                                                    selectedLanguage={selectedLanguage}
                                                    onSuccess={onRefresh}
                                                    trigger={
                                                        <Button size="icon" variant="ghost" className="h-6 w-6 text-white hover:bg-white/20">
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                    }
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-6 w-6 text-white hover:bg-white/20"
                                                    onClick={() => handleDelete(group.id)}
                                                    disabled={deletingId === group.id}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="mb-4">Başlama tarixi: {group.startDate}</div>
                                        <p className="text-sm opacity-90 mb-6 leading-relaxed">Məlumat: {textValue}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )
                    })}
                    {groups.length === 0 && (
                        <div className="col-span-full text-center py-8 text-muted-foreground">
                            <p>Hələ qrup əlavə edilməyib</p>
                            <p className="text-sm">İlk qrupunuzu əlavə etmək üçün yuxarıdakı düyməni basın</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
