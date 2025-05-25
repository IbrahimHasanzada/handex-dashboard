"use client"

import { useState } from "react"
import { Trash2, Phone, Calendar, User, BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDeleteConsultationMutation, useGetConsultationQuery } from "@/store/handexApi"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"

interface Course {
    id: number
    name: string
    slug: string
    date: string[]
    color: string
}

interface Consultation {
    id: number
    name: string
    surname: string
    phone: string
    createdAt: string
    updatedAt: string
    course: Course
}

export default function ConsultationPage() {
    const { data, refetch, isLoading } = useGetConsultationQuery('az')
    const [delConsultation, { isLoading: delLoading }] = useDeleteConsultationMutation()
    const [consultations, setConsultations] = useState<Consultation[]>([
        {
            id: 4,
            name: "John",
            surname: "Doe",
            phone: "+994505005050",
            createdAt: "2025-05-19T04:16:12.519Z",
            updatedAt: "2025-05-19T04:16:12.519Z",
            course: {
                id: 23,
                name: "Back-end",
                slug: "back-end",
                date: ["29 May"],
                color: "#DE465D",
            },
        },
        {
            id: 5,
            name: "Ayşe",
            surname: "Məmmədova",
            phone: "+994551234567",
            createdAt: "2025-05-18T10:30:15.123Z",
            updatedAt: "2025-05-18T10:30:15.123Z",
            course: {
                id: 24,
                name: "Front-end",
                slug: "front-end",
                date: ["15 June"],
                color: "#4F46E5",
            },
        },
        {
            id: 6,
            name: "Rəşad",
            surname: "Əliyev",
            phone: "+994701234567",
            createdAt: "2025-05-17T14:22:30.456Z",
            updatedAt: "2025-05-17T14:22:30.456Z",
            course: {
                id: 25,
                name: "Full-stack",
                slug: "full-stack",
                date: ["10 July"],
                color: "#059669",
            },
        },
    ])

    const handleDelete = async (id: number) => {
        try {
            await showDeleteConfirmation(delConsultation, id, refetch, {
                title: "Konsultasiyanı silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Konsultasiyan uğurla silindi.",
            })
        } catch (error: any) {
            toast.error(error.data)
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("az-AZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }
    return (
        <div className="container mx-auto p-6 ">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Konsultasiyalar</h1>
                <p className="text-gray-600">Bütün konsultasiya müraciətlərini idarə edin</p>
            </div>

            {
                isLoading
                    ?
                    <div className="flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin" />
                    </div>

                    :
                    (data?.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Konsultasiya yoxdur</h3>
                                <p className="text-gray-500 text-center">Hələ ki heç bir konsultasiya müraciəti yoxdur.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {data?.map((consultation: Consultation) => (
                                <Card key={consultation.id} className="relative hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-2">
                                                <User className="h-5 w-5 text-gray-500" />
                                                <CardTitle className="text-lg">
                                                    {consultation.name} {consultation.surname}
                                                </CardTitle>
                                            </div>
                                            <Button onClick={() => handleDelete(consultation.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                                            <Phone className="h-4 w-4" />
                                            <span>{consultation.phone}</span>
                                        </div>

                                        <div className="space-y-2">
                                            <Badge style={{ backgroundColor: consultation.course.color }} className="text-white">
                                                {consultation.course.name}
                                            </Badge>
                                        </div>

                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="text-xs text-gray-500 space-y-1">
                                                <div>Yaradılıb: {formatDate(consultation.createdAt)}</div>
                                                <div>Yenilənib: {formatDate(consultation.updatedAt)}</div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ))}


            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">Cəmi {data?.length} konsultasiya müraciəti</p>
            </div>

        </div >
    )
}
