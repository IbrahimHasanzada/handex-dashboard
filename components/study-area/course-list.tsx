"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Search, ChevronLeft, ChevronRight, BookOpen, HelpCircle, AlertCircle, Globe } from "lucide-react"
import { CourseFormDialog } from "./course-form-dialog"
import type { CourseFormData } from "@/validations/study-area/course-add.validation"
import { useDeleteStudyAreaMutation, useGetStudyAreaQuery } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { StudyAreaData } from "@/types/study-area/overview"
import Image from "next/image"
import { InstructorsProps } from "@/types/study-area/instructors.dto"



type Language = "az" | "en" | "ru"

const languageLabels: any = {
    az: "Azərbaycanca",
    en: "English",
    ru: "Русский",
}

export function CourseList({ selectedLanguage, setSelectedLanguage }: InstructorsProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const router = useRouter()
    const itemsPerPage = 5

    const { data, isLoading, error, refetch } = useGetStudyAreaQuery(selectedLanguage)
    const [deleteStudyArea] = useDeleteStudyAreaMutation()
    useMemo(() => {
        setCurrentPage(1)
    }, [selectedLanguage, searchTerm])

    const filteredCourses = useMemo(() => {
        if (!data) return []

        return data.filter(
            (course: StudyAreaData) =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.course_detail.toLowerCase().includes(searchTerm.toLowerCase()),
        )
    }, [data, searchTerm])
    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage)

    const handleCourseSubmit = (data: CourseFormData) => {
        console.log("Yeni kurs:", data)
    }

    const handleEdit = (courseId: number) => {
        console.log("Edit course:", courseId)
    }

    const handleDelete = (courseId: number) => {
        try {
            showDeleteConfirmation(deleteStudyArea, courseId, refetch, {
                title: "Təhsil sahəsini nömrəsini silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Təhsil sahəsi nömrəsi uğurla silindi.",
            })
        } catch (error: any) {
            toast.error(error.data)
        }
    }


    // const handleLanguageChange = (language: Language) => {
    //     setSelectedLanguage(language)
    //     setSearchTerm("")
    // }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Kurslar yüklənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.</AlertDescription>
            </Alert>
        )
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2 mb-4">
                        <Globe className="h-5 w-5" />
                        <CardTitle className="text-lg">Dil Seçimi</CardTitle>
                    </div>
                </CardHeader>
            </Card>

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
                                : `${filteredCourses.length} təhsil sahəsi (${languageLabels[selectedLanguage]})`}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={`Təhsil sahəsi axtar... (${selectedLanguage.toUpperCase()})`}
                                className="w-[250px] pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CourseFormDialog onSubmit={handleCourseSubmit} />
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
                                            <Button size="sm" variant="outline" onClick={() => handleEdit(course.id)}>
                                                <Edit className="h-4 w-4 mr-1" />
                                                Redaktə
                                            </Button>
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
                                    {searchTerm ? (
                                        <>
                                            <p className="text-lg font-medium">Heç bir nəticə tapılmadı</p>
                                            <p className="text-sm">
                                                "{searchTerm}" üçün {languageLabels[selectedLanguage]} dilində heç bir təhsil sahəsi tapılmadı
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-lg font-medium">
                                                {languageLabels[selectedLanguage]} dilində təhsil sahəsi tapılmadı
                                            </p>
                                            <p className="text-sm">Bu dildə hələ təhsil sahəsi əlavə edilməyib</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Pagination */}
                {!isLoading && filteredCourses.length > itemsPerPage && (
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
                                ({startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCourses.length)} /{" "}
                                {filteredCourses.length})
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
