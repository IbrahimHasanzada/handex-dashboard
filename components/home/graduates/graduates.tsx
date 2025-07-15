"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteContentMutation, useDeleteProfilesMutation, useGetContentQuery, useGetProfilesQuery } from "@/store/handexApi"
import { ChevronLeft, ChevronRight, Edit, Loader2, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import AddGraduateModal from "./add-graduate-modal"
import EditGraduateModal from "./edit-graduate-modal"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
const Graduates = () => {


    const [deleteGraduates, { isSuccess }] = useDeleteContentMutation()
    const [currentPage, setCurrentPage] = useState(1)
    const [currentLanguage, setCurrentLanguage] = useState<"az" | "en" | "ru">("az")
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedGraduate, setSelectedGraduate] = useState(null)
    const { data: graduatesData, isLoading, isError, refetch } = useGetContentQuery({ lang: currentLanguage, slug: "graduates" })
    const startIndex = (currentPage - 1) * 10
    const endIndex = startIndex + 10
    const displayedGraduates = graduatesData?.slice(startIndex, endIndex)
    const pageView = Math.ceil((graduatesData?.length || 0) / 10) || 1

    const handleEditGraduate = (graduate: any) => {
        setSelectedGraduate(graduate)
        setIsEditModalOpen(true)
    }
    const handleDeleteGraduates = async (id: number) => {
        try {
            showDeleteConfirmation(deleteGraduates, id, refetch, {
                title: "Məzunu silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Məzun uğurla silindi.",
            })
        } catch (error) {
            toast.error('Məzunu silərkən xəta baş verdi!')
        }
    }
    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Məzunlar</CardTitle>
                        <CardDescription>Məzunları idarə edin</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Tabs value={currentLanguage} onValueChange={setCurrentLanguage as any} className="mr-4">
                            <TabsList>
                                <TabsTrigger value="az">AZ</TabsTrigger>
                                <TabsTrigger value="en">EN</TabsTrigger>
                                <TabsTrigger value="ru">RU</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <Button onClick={() => setIsAddModalOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" /> Yeni Məzun Əlavə Et
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
                                {displayedGraduates?.map((graduate: any) => (
                                    <div key={graduate.id} className="border rounded-lg p-4 flex flex-col items-center">
                                        <div className="relative">
                                            <Image
                                                src={graduate.images[0]?.url || "/placeholder.svg"}
                                                alt={graduate.images[0]?.alt}
                                                width={80}
                                                height={80}
                                                className="rounded-lg object-cover"
                                            />
                                            <div className="absolute -bottom-2 -right-2 flex gap-1">
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="h-6 w-6"
                                                    onClick={() => handleEditGraduate(graduate)}
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                                <Button onClick={() => handleDeleteGraduates(graduate.id)} size="icon" variant="secondary" className="h-6 w-6">
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="font-medium text-center mt-3">{graduate.title}</div>
                                        <div className="text-sm text-muted-foreground text-center">{graduate.desc}</div>
                                    </div>
                                ))}
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

            <AddGraduateModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} refetch={refetch} />

            {selectedGraduate && (
                <EditGraduateModal
                    open={isEditModalOpen}
                    onOpenChange={setIsEditModalOpen}
                    refetch={refetch}
                    translation={selectedGraduate}
                    selectedLanguage={currentLanguage}
                />
            )}
        </>
    )
}

export default Graduates
