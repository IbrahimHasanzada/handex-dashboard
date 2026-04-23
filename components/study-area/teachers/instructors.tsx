"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    useDeleteProfilesMutation,
    useUpdateProfileOrdersMutation,
} from "@/store/handexApi"
import {
    ChevronLeft,
    ChevronRight,
    Edit,
    GripVertical,
    HelpCircle,
    Loader2,
    Plus,
    Save,
    Trash2,
} from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import AddInstructorsModal from "./add-instructor"
import { Badge } from "@/components/ui/badge"
import EditInstructorsModal from "./edit.instructors"
import { InstructorsProps } from "@/types/study-area/instructors.dto"

interface InstructorWithOrder {
    id: number
    name: string
    speciality: string
    order: number
    image?: { id: number; url: string; alt?: string | null } | null
    translations?: { lang: string }[]
    [key: string]: any
}

const ITEMS_PER_PAGE = 10

const Instructors = ({
    selectedLanguage,
    setSelectedLanguage,
    studyArea,
    instructorsData,
    isLoading,
    isError,
    refetch,
}: InstructorsProps) => {
    const [deleteInstructor] = useDeleteProfilesMutation()
    const [updateProfileOrders, { isLoading: isSavingOrder }] = useUpdateProfileOrdersMutation()

    const [orderedInstructors, setOrderedInstructors] = useState<InstructorWithOrder[]>([])
    const [hasChanges, setHasChanges] = useState(false)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)

    const [currentPage, setCurrentPage] = useState(1)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedInstructor, setSelectedInstructor] = useState<any>(null)

    useEffect(() => {
        if (Array.isArray(instructorsData)) {
            const withOrder = instructorsData.map((instructor: any, index: number) => ({
                ...instructor,
                order: instructor.order ?? index + 1,
            }))
            setOrderedInstructors(withOrder)
            setHasChanges(false)
            setCurrentPage(1)
        }
    }, [instructorsData])

    const totalPages = Math.ceil(orderedInstructors.length / ITEMS_PER_PAGE) || 1
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const displayedInstructors = orderedInstructors.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handleEditInstructor = (instructor: any) => {
        setSelectedInstructor(instructor)
        setIsEditModalOpen(true)
    }

    const handleDeleteInstructor = async (id: number) => {
        try {
            showDeleteConfirmation(deleteInstructor, id, refetch, {
                title: "Müəllimi silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Müəllim uğurla silindi.",
            })
        } catch (error) {
            toast.error("Müəllimi silərkən xəta baş verdi!")
        }
    }

    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/html", "")
    }

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = "move"
        setDragOverIndex(index)
    }

    const handleDragLeave = () => {
        setDragOverIndex(null)
    }

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault()

        if (draggedIndex === null || draggedIndex === dropIndex) {
            setDraggedIndex(null)
            setDragOverIndex(null)
            return
        }

        const next = [...orderedInstructors]
        const [moved] = next.splice(draggedIndex, 1)
        const insertIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
        next.splice(insertIndex, 0, moved)

        const reordered = next.map((instructor, index) => ({
            ...instructor,
            order: index + 1,
        }))

        setOrderedInstructors(reordered)
        setHasChanges(true)
        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const handleDragEnd = () => {
        setDraggedIndex(null)
        setDragOverIndex(null)
    }

    const handleSaveOrder = async () => {
        try {
            const items = orderedInstructors.map((instructor) => ({
                id: instructor.id,
                order: instructor.order,
            }))

            await updateProfileOrders({ items }).unwrap()

            toast.success("Müəllimlərin sırası uğurla yeniləndi!")
            setHasChanges(false)
            refetch?.()
        } catch (error) {
            toast.error("Sıranı yeniləyərkən xəta baş verdi!")
        }
    }

    const handleResetOrder = () => {
        if (Array.isArray(instructorsData)) {
            const withOrder = instructorsData.map((instructor: any, index: number) => ({
                ...instructor,
                order: instructor.order ?? index + 1,
            }))
            setOrderedInstructors(withOrder)
            setHasChanges(false)
        }
    }

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            Müəllimlər
                            {hasChanges && (
                                <Badge variant="destructive" className="animate-pulse">
                                    Dəyişikliklər var
                                </Badge>
                            )}
                        </CardTitle>
                        <CardDescription>
                            Müəllimləri idarə edin və sırasını sürükləyib buraxmaqla dəyişin
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasChanges && (
                            <>
                                <Button variant="outline" size="sm" onClick={handleResetOrder} disabled={isSavingOrder}>
                                    Sıfırla
                                </Button>
                                <Button size="sm" onClick={handleSaveOrder} disabled={isSavingOrder}>
                                    {isSavingOrder ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Sıranı Saxla
                                </Button>
                            </>
                        )}
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Yeni Müəllim Əlavə Et
                        </Button>
                    </div>
                </CardHeader>
                {isLoading ? (
                    <div className="w-full h-40 flex justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="text-center py-8 text-red-500">Məlumatları yükləyərkən xəta baş verdi</div>
                ) : (
                    <>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {displayedInstructors.map((instructor, index) => {
                                    const actualIndex = startIndex + index
                                    const isDragging = draggedIndex === actualIndex
                                    const isDragOver = dragOverIndex === actualIndex && draggedIndex !== actualIndex

                                    return (
                                        <div
                                            key={instructor.id}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, actualIndex)}
                                            onDragOver={(e) => handleDragOver(e, actualIndex)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, actualIndex)}
                                            onDragEnd={handleDragEnd}
                                            className={`relative border rounded-lg p-4 flex flex-col items-center cursor-move transition-all duration-200 ${
                                                isDragging
                                                    ? "opacity-50 scale-95 shadow-lg"
                                                    : isDragOver
                                                        ? "border-primary border-2 bg-primary/5"
                                                        : "hover:shadow-md"
                                            }`}
                                        >
                                            <div className="absolute top-2 left-2 flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-xs">
                                                {instructor.order}
                                            </div>
                                            <GripVertical className="absolute top-2 right-2 h-4 w-4 text-muted-foreground" />

                                            <div className="relative mt-4">
                                                <Image
                                                    src={instructor.image?.url || "/placeholder.svg"}
                                                    alt={instructor.name}
                                                    width={80}
                                                    height={80}
                                                    className="rounded-lg object-cover"
                                                />
                                                <div className="absolute -bottom-2 -right-2 flex gap-1">
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-6 w-6"
                                                        onClick={() => handleEditInstructor(instructor)}
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDeleteInstructor(instructor.id)}
                                                        size="icon"
                                                        variant="secondary"
                                                        className="h-6 w-6"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="font-medium text-center mt-3">{instructor.name}</div>
                                            <div className="text-sm text-muted-foreground text-center">
                                                {instructor.speciality}
                                            </div>

                                            <div className="flex gap-1 mt-2">
                                                {instructor.translations?.map((translation) => (
                                                    <Badge
                                                        key={translation.lang}
                                                        variant={translation.lang === selectedLanguage ? "default" : "outline"}
                                                        className="text-xs"
                                                    >
                                                        {translation.lang.toUpperCase()}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )
                                })}

                                {displayedInstructors.length === 0 && (
                                    <div className="col-span-2 md:col-span-5 text-center py-8 text-muted-foreground">
                                        Hələ müəllim əlavə edilməyib
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        {orderedInstructors.length > 0 && (
                            <CardContent className="pt-0">
                                <Alert>
                                    <HelpCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        Müəllimlərin sırasını dəyişmək üçün onları sürükləyib buraxın. Dəyişikliklər etdikdən sonra "Sıranı Saxla" düyməsini basın.
                                    </AlertDescription>
                                </Alert>
                            </CardContent>
                        )}

                        {orderedInstructors.length > ITEMS_PER_PAGE && (
                            <CardFooter className="flex justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" /> Əvvəlki
                                </Button>
                                <div className="text-sm">
                                    Səhifə {currentPage} / {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                >
                                    Növbəti <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </CardFooter>
                        )}
                    </>
                )}
            </Card>

            <AddInstructorsModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                refetch={refetch}
                studyArea={studyArea}
            />

            {selectedInstructor && (
                <EditInstructorsModal
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    refetch={refetch}
                    graduate={selectedInstructor}
                    selectedLanguage={selectedLanguage}
                    studyArea={studyArea}
                />
            )}
        </>
    )
}

export default Instructors
