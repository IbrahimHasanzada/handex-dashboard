"use client"
import { useState, useMemo } from "react"
import type React from "react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    AlertCircle,
    Plus,
    GripVertical,
    Save,
} from "lucide-react"
import { useDeleteStudyAreaMutation, useGetStudyAreaQuery, useUpdateStudyAreaOrderMutation } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import type { StudyAreaData } from "@/types/study-area/overview"
import Image from "next/image"
import type { InstructorsProps } from "@/types/study-area/instructors.dto"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { changeModel } from "@/store/studyAreaModalSlice"

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

interface CourseWithOrder extends StudyAreaData {
    order: number
}

export function CourseList({ selectedLanguage, setSelectedLanguage }: InstructorsProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [draggedItem, setDraggedItem] = useState<number | null>(null)
    const [dragOverItem, setDragOverItem] = useState<number | null>(null)
    const [orderedCourses, setOrderedCourses] = useState<CourseWithOrder[]>([])
    const [hasChanges, setHasChanges] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const router = useRouter()
    const dispatch = useDispatch()
    const model = useSelector((store: any) => store.model.model)
    const itemsPerPage = 5

    const { data, isLoading, error, refetch } = useGetStudyAreaQuery({ lang: selectedLanguage, model: model })
    const [deleteStudyArea] = useDeleteStudyAreaMutation()
    const [updateStudyAreaOrder] = useUpdateStudyAreaOrderMutation()

    const startIndex = (currentPage - 1) * itemsPerPage
    const totalPages = Math.ceil(orderedCourses.length / itemsPerPage)

    // Initialize ordered courses when data changes
    useMemo(() => {
        if (data) {
            const coursesWithOrder = data.map((course: StudyAreaData, index: number) => ({
                ...course,
                order: index + 1,
            }))
            setOrderedCourses(coursesWithOrder)
            setHasChanges(false)
        }
        setCurrentPage(1)
    }, [data, selectedLanguage, model])

    const paginatedCourses = showAll
        ? orderedCourses
        : orderedCourses && orderedCourses.slice(startIndex, startIndex + itemsPerPage)

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

    const handleChooseModel = (value: any) => {
        dispatch(changeModel(value))
    }

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedItem(index)
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/html", "")
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        setDragOverItem(index)
    }

    const handleDragLeave = () => {
        setDragOverItem(null)
    }

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()

        if (draggedItem === null || draggedItem === dropIndex) {
            setDraggedItem(null)
            setDragOverItem(null)
            return
        }

        const newOrderedCourses = [...orderedCourses]
        const draggedCourse = newOrderedCourses[draggedItem]
        const targetCourse = newOrderedCourses[dropIndex]

        // Remove dragged item
        newOrderedCourses.splice(draggedItem, 1)

        // Insert at new position
        const insertIndex = draggedItem < dropIndex ? dropIndex - 1 : dropIndex
        newOrderedCourses.splice(insertIndex, 0, draggedCourse)

        // Update order numbers
        const reorderedCourses = newOrderedCourses.map((course, index) => ({
            ...course,
            order: index + 1,
        }))



        setOrderedCourses(reorderedCourses)
        setHasChanges(true)
        setDraggedItem(null)
        setDragOverItem(null)
    }

    const handleDragEnd = () => {
        setDraggedItem(null)
        setDragOverItem(null)
    }

    const handleSaveOrder = async () => {
        try {
            const orderData = orderedCourses.map((course) => ({
                id: course.id,
                order: course.order,
            }))


            await updateStudyAreaOrder(orderData).unwrap()

            toast.success("Kurs sırası uğurla yeniləndi!")
            setHasChanges(false)
        } catch (error) {
            toast.error("Kurs sırasını yeniləyərkən xəta baş verdi!")
        }
    }

    const resetOrder = () => {
        if (data) {
            const coursesWithOrder = data.map((course: StudyAreaData, index: number) => ({
                ...course,
                order: index + 1,
            }))
            setOrderedCourses(coursesWithOrder)
            setHasChanges(false)
        }
    }

    const handleShowAll = () => {
        setShowAll(true)
        setCurrentPage(1)
    }

    const handleShowPaginated = () => {
        setShowAll(false)
        setCurrentPage(1)
    }

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
            {/* Course List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Təhsil Sahələri
                            <Badge variant="outline">{languageLabels[selectedLanguage]}</Badge>
                            {hasChanges && (
                                <Badge variant="destructive" className="animate-pulse">
                                    Dəyişikliklər var
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {isLoading
                                ? "Yüklənir..."
                                : `${orderedCourses.length} təhsil sahəsi (${languageLabels[selectedLanguage]})`}
                        </CardDescription>
                    </div>
                    <div className="flex gap-3">
                        {hasChanges && (
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={resetOrder}>
                                    Sıfırla
                                </Button>
                                <Button size="sm" onClick={handleSaveOrder}>
                                    <Save className="mr-2 h-4 w-4" />
                                    Sıranı Saxla
                                </Button>
                            </div>
                        )}
                        <Button>
                            <Link href="/study-area/new" className="flex items-center gap-3">
                                <Plus className="mr-2 h-4 w-4" /> Yeni Kurs Əlavə Et
                            </Link>
                        </Button>
                        <div className="space-y-2">
                            <Select value={model} onValueChange={handleChooseModel}>
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
                            paginatedCourses.map((course: CourseWithOrder, index: number) => {
                                const actualIndex = startIndex + index
                                const isDragging = draggedItem === actualIndex
                                const isDragOver = dragOverItem === actualIndex

                                return (
                                    <div
                                        key={course.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, actualIndex)}
                                        onDragOver={(e) => handleDragOver(e, actualIndex)}
                                        onDragLeave={handleDragLeave}
                                        onDrop={(e) => handleDrop(e, actualIndex)}
                                        onDragEnd={handleDragEnd}
                                        className={`rounded-lg border transition-all duration-200 cursor-move ${isDragging
                                            ? "opacity-50 scale-95 shadow-lg"
                                            : isDragOver
                                                ? "border-primary border-2 bg-primary/5"
                                                : "hover:shadow-md"
                                            }`}
                                    >
                                        <div className="flex items-center p-4 gap-4">
                                            {/* Drag Handle and Order Number */}
                                            <div className="flex items-center gap-2 shrink-0">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                                    {course.order}
                                                </div>
                                                <GripVertical className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                                            </div>

                                            {/* Course Image */}
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                                <Image
                                                    src={course.image ? course.image.url : "/placeholder.svg"}
                                                    alt={course.image ? course.image.alt : "tədris sahələri şəkil alt tagı"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>

                                            {/* Course Info */}
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
                                                    className="text-destructive hover:text-destructive bg-transparent"
                                                    onClick={() => handleDelete(course.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Sil
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            // Empty state
                            <div className="text-center py-12">
                                <div className="text-muted-foreground">
                                    <p className="text-lg font-medium">
                                        {languageLabels[selectedLanguage]} dilində təhsil sahəsi tapılmadı
                                    </p>
                                    <p className="text-sm">Bu dildə hələ təhsil sahəsi əlavə edilməyib</p>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Pagination */}
                {!isLoading && orderedCourses.length > itemsPerPage && (
                    <CardFooter className="flex flex-col">
                        <div className="w-full flex justify-between items-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1 || showAll}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Əvvəlki
                            </Button>

                            <div className="flex justify-center items-center gap-2">
                                <Button
                                    variant={showAll ? "default" : "outline"}
                                    size="sm"
                                    onClick={showAll ? handleShowPaginated : handleShowAll}
                                >
                                    {showAll ? "Səhifələmə" : "Hamısı"}
                                </Button>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages || showAll}
                            >
                                Növbəti
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                        <div className="w-full flex justify-center gap-2 text-sm mt-5">
                            {!showAll ? (
                                <>
                                    <span>
                                        Səhifə {currentPage} / {totalPages}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ({startIndex + 1}-{Math.min(startIndex + itemsPerPage, orderedCourses.length)} /{" "}
                                        {orderedCourses.length})
                                    </span>
                                </>
                            ) : (
                                <span className="text-muted-foreground">Hamısı göstərilir ({orderedCourses.length} təhsil sahəsi)</span>
                            )}
                        </div>
                    </CardFooter>
                )}

            </Card>

            {/* Instructions */}
            {!isLoading && orderedCourses.length > 0 && (
                <Alert>
                    <HelpCircle className="h-4 w-4" />
                    <AlertDescription>
                        Kursların sırasını dəyişmək üçün onları sürükləyib buraxın. Dəyişikliklər etdikdən sonra "Sıranı Saxla"
                        düyməsini basın.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    )
}
