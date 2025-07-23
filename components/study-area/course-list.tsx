"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Search, ChevronLeft, ChevronRight, BookOpen, HelpCircle, AlertCircle, Globe, Plus } from "lucide-react"
import { CourseFormDialog } from "./course-form-dialog"
import type { CourseFormData } from "@/validations/study-area/course-add.validation"
import { useDeleteStudyAreaMutation, useGetStudyAreaQuery } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { StudyAreaData } from "@/types/study-area/overview"
import Image from "next/image"
import { InstructorsProps } from "@/types/study-area/instructors.dto"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import Link from "next/link"



type Language = "az" | "en" | "ru"

const languageLabels: any = {
    az: "Azərbaycanca",
    en: "English",
    ru: "Русский",
}

export const MODEL_TYPES = [
    { value: "home", label: "Ana səhifə" },
    { value: "corporate", label: "Korporativ" },
]

export function CourseList({ selectedLanguage, setSelectedLanguage }: InstructorsProps) {
    const [modelTypes, setModelTypes] = useState("home")
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()
    const itemsPerPage = 5

    const { data, isLoading, error, refetch } = useGetStudyAreaQuery({ lang: selectedLanguage, model: modelTypes })
    const [deleteStudyArea] = useDeleteStudyAreaMutation()
    useMemo(() => {
        setCurrentPage(1)
    }, [selectedLanguage])

    const totalPages = data && Math.ceil(data.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCourses = data && data.slice(startIndex, startIndex + itemsPerPage)


    const handleDelete = (courseId: number) => {
        try {
            showDeleteConfirmation(deleteStudyArea, courseId, refetch, {
                title: "Təhsil sahəsini silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Təhsil sahəsi uğurla silindi.",
            })
        } catch (error: any) {
            toast.error(error.data)
        }
    }


    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Kurslar yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.</AlertDescription>
            </Alert>
        )
    }

    const handleChooseModel = (value: any) => {
        setModelTypes(value)
    }

    return (
        <div className="space-y-6">
            {/* Course List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Təhsil Sahələri
                            <Badge variant="outline">{languageLabels[selectedLanguage]}</Badge>
                        </CardTitle>
                        <CardDescription>
                            {isLoading
                                ? "Yüklənir..."
                                : `${data.length} təhsil sahəsi (${languageLabels[selectedLanguage]})`}
                        </CardDescription>
                    </div>
                    <div className="flex gap-5">
                        <div className="flex items-center gap-2">
                            <Button>
                                <Link href='/study-area/new' className="flex items-center gap-3">
                                    <Plus className="mr-2 h-4 w-4" /> Yeni Kurs Əlavə Et
                                </Link>
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Select value={modelTypes} onValueChange={handleChooseModel}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tədris sahəsinin modelini seçin..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {MODEL_TYPES.map((type: any) => (
                                        <SelectItem key={type.value} value={type.value}>
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="rounded-lg border p-4">
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-16 w-16 rounded" />
                                        <div className="flex-1 space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-3 w-[300px]" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-6 w-16" />
                                                <Skeleton className="h-6 w-16" />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Skeleton className="h-8 w-20" />
                                            <Skeleton className="h-8 w-16" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : paginatedCourses.length > 0 ? (
                            paginatedCourses.map((course: StudyAreaData) => (
                                <div key={course.id} className="rounded-lg border">
                                    <div className="flex items-center p-4 gap-4">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                            <Image
                                                src={course.image ? course.image.url : "/placeholder.svg"}
                                                alt={course.image ? course.image.alt : 'tədris sahələri şəkil alt tagı'}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <h3 className="font-medium text-lg truncate">{course.name}</h3>
                                                <Badge
                                                    variant="secondary"
                                                    style={{
                                                        backgroundColor: `${course.color}20`,
                                                        color: course.color,
                                                        borderColor: course.color,
                                                    }}
                                                >
                                                    {course.slug}
                                                </Badge>
                                                <Badge variant="outline" className="text-xs">
                                                    {selectedLanguage.toUpperCase()}
                                                </Badge>
                                            </div>

                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{course.course_detail}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 shrink-0">
                                            <Button size="sm" variant="outline" onClick={() => router.push(`/study-area/${course.slug}`)}>
                                                <Edit className="h-4 w-4 mr-1" />
                                                Bax
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDelete(course.id)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Sil
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            // Empty state
                            <div className="text-center py-12">
                                <div className="text-muted-foreground">
                                    <>
                                        <p className="text-lg font-medium">
                                            {languageLabels[selectedLanguage]} dilində təhsil sahəsi tapılmadı
                                        </p>
                                        <p className="text-sm">Bu dildə hələ təhsil sahəsi əlavə edilməyib</p>
                                    </>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Pagination */}
                {!isLoading && data.length > itemsPerPage && (
                    <CardFooter className="flex justify-between items-center">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Əvvəlki
                        </Button>

                        <div className="flex items-center gap-2 text-sm">
                            <span>
                                Səhifə {currentPage} / {totalPages}
                            </span>
                            <span className="text-muted-foreground">
                                ({startIndex + 1}-{Math.min(startIndex + itemsPerPage, data.length)} /{" "}
                                {data.length})
                            </span>
                        </div>

                        <Button variant="outline" size="sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            Növbəti
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
