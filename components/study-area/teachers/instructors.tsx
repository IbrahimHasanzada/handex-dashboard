"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteProfilesMutation, useGetProfilesQuery } from "@/store/handexApi"
import { ChevronLeft, ChevronRight, Edit, Loader2, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import AddInstructorsModal from "./add-instructor"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EditInstructorsModal from "./edit.instructors"
import { InstructorsProps } from "@/types/study-area/instructors.dto"

const Instructors = ({ selectedLanguage, setSelectedLanguage }: InstructorsProps) => {
    const { data: instructorsData, isLoading, isError, refetch } = useGetProfilesQuery({ model: "instructor", lang: selectedLanguage })
    const [deleteInstructor, { isSuccess }] = useDeleteProfilesMutation()
    const [currentPage, setCurrentPage] = useState(1)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedInstructor, setSelectedInstructor] = useState(null)

    const startIndex = (currentPage - 1) * 10
    const endIndex = startIndex + 10
    const displayedInstructors = instructorsData?.slice(startIndex, endIndex)
    const pageView = Math.ceil((instructorsData?.length || 0) / 10) || 1

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

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Müəllimlər</CardTitle>
                        <CardDescription>Müəllimləri idarə edin</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Yeni Müəllim Əlavə Et
                        </Button>
                    </div>
                </CardHeader>
                {isLoading ? (
                    <div className="w-full h-full flex !justify-center items-center">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : isError ? (
                    <div className="col-span-2 text-center py-8 text-red-500">Məlumatları yükləyərkən xəta baş verdi</div>
                ) : (
                    <>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {displayedInstructors?.map((instructor: any) => (
                                    <div key={instructor.id} className="border rounded-lg p-4 flex flex-col items-center">
                                        <div className="relative">
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
                                        <div className="text-sm text-muted-foreground text-center">{instructor.speciality}</div>

                                        {/* Display translation badges */}
                                        <div className="flex gap-1 mt-2">
                                            {instructor.translations?.map((translation: any) => (
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
                                ))}

                                {displayedInstructors?.length === 0 && (
                                    <div className="col-span-5 text-center py-8 text-muted-foreground">Hələ müəllim əlavə edilməyib</div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Əvvəlki
                            </Button>
                            <div className="text-sm">
                                Səhifə {currentPage} / {pageView}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(currentPage < pageView ? currentPage + 1 : currentPage)}
                                disabled={currentPage === pageView}
                            >
                                Növbəti <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Card>

            <AddInstructorsModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} refetch={refetch} />

            {selectedInstructor && (
                <EditInstructorsModal
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    refetch={refetch}
                    graduate={selectedInstructor}
                    selectedLanguage={selectedLanguage}
                />
            )}
        </>
    )
}

export default Instructors
