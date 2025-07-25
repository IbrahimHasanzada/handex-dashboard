"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Edit, Globe, Loader2, Plus, Trash2 } from "lucide-react"
import { useDeleteCustomersMutation, useGetCustomersQuery } from "@/store/handexApi"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { TestimonialsAdd } from "./testimonials-add"
import TestimonialsEditModal from "./testimonials-edit"

const Testimonials = ({ slug }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [addData, setAddData] = useState<boolean>(false)
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")

    const { data: getCustomers, isLoading, isError, refetch } = useGetCustomersQuery({ lang: currentLanguage, slug })
    const [deleteCustomer] = useDeleteCustomersMutation()

    const startIndex = (currentPage - 1) * 4
    const endIndex = startIndex + 4
    const displayedGraduates = getCustomers?.slice(startIndex, endIndex)
    const pageView = Math.ceil((getCustomers?.length || 0) / 4) || 1

    const handleEdit = (testimonial: any) => {
        setSelectedTestimonial(testimonial)
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setSelectedTestimonial(null)
    }
    const handleDelete = async (id: number | string) => {
        try {
            showDeleteConfirmation(deleteCustomer, id, refetch, {
                title: "Rəyi silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Rəy uğurla silindi.",
            })
        } catch (error) {
            console.error(error)
        }
    }

    const handleLanguageChange = (language: string) => {
        setCurrentLanguage(language)
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Müştəri Rəyləri</CardTitle>
                    <CardDescription>Müştəri rəylərini idarə edin</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                    <Tabs value={currentLanguage} onValueChange={handleLanguageChange} className="mr-4">
                        <TabsList>
                            <TabsTrigger value="az">AZ</TabsTrigger>
                            <TabsTrigger value="en">EN</TabsTrigger>
                            <TabsTrigger value="ru">RU</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Button onClick={() => setAddData(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Yeni Rəy Əlavə Et
                    </Button>
                </div>
            </CardHeader>

            {addData ? (
                <CardContent>
                    <TestimonialsAdd
                        slug={slug}
                        refetch={refetch}
                        currentLanguage={currentLanguage}
                        addData={addData}
                        setAddData={setAddData}
                    />
                </CardContent>
            ) : (
                <CardContent>
                    <div className={isLoading ? "flex" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>
                        {isLoading ? (
                            <div className="w-full h-full flex !justify-center items-center">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : isError ? (
                            <div className="col-span-2 text-center py-8 text-red-500">Məlumatları yükləyərkən xəta baş verdi</div>
                        ) : displayedGraduates.length > 0 ? (
                            displayedGraduates.map((testimonial: any) => (
                                <div key={testimonial.id} className="relative border rounded-lg p-4">
                                    <div className="absolute right-2 top-3 flex gap-1">
                                        <Button size="icon" variant="ghost" onClick={() => handleEdit(testimonial)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDelete(testimonial.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col gap-2 md:w-2/3">
                                            <div className="flex gap-5 items-center">
                                                <Image
                                                    src={testimonial.customer_profile?.url || "/placeholder.svg?height=40&width=40"}
                                                    alt={testimonial.name}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full "
                                                />
                                                <div className="font-medium">{testimonial.name}</div>
                                            </div>
                                            <div className="flex gap-5 items-center">
                                                <Image
                                                    src={testimonial.bank_logo?.url || "/placeholder.svg?height=50&width=50"}
                                                    alt={testimonial.bank_name || ""}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full"
                                                />
                                                <div className="text-sm text-muted-foreground">{testimonial.bank_name}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm mt-2 break-words line-clamp-2">{testimonial.comment}</div>
                                    <div className="mt-2 text-xs text-muted-foreground flex items-center">
                                        <Globe className="h-3 w-3 mr-1" />
                                        {currentLanguage === "az" ? "Azərbaycan" : currentLanguage === "en" ? "English" : "Русский"}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center py-8">Heç bir rəy tapılmadı</div>
                        )}
                    </div>
                </CardContent>
            )}

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
            {/* Edit Testimonials Modal */}
            {isModalOpen && selectedTestimonial && (
                <TestimonialsEditModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    testimonial={selectedTestimonial}
                    refetch={refetch}
                    currentLanguage={currentLanguage}
                />
            )}
        </Card>
    )
}

export default Testimonials