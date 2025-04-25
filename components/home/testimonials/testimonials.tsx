"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Edit, Globe, Loader2, Plus, Trash2 } from "lucide-react"
import { useDeleteCustomersMutation, useGetCustomersQuery } from "@/store/handexApi"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { TestimonialsEditModal } from "./testimonials-edit"
import { TestimonialsAdd } from "./testimonials-add"

const Testimonials = () => {
    const [isModalOpen, setisModalOpen] = useState(false)
    const [selectedTestimonial, setSelectedTestimonial] = useState<any>(null)
    const [addData, setAddData] = useState<boolean>(false)
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")

    const { data: getCustomers, isLoading, isError, refetch } = useGetCustomersQuery(currentLanguage)
    const [deleteCustomer] = useDeleteCustomersMutation()

    const handleEdit = (testimonial: any) => {
        setSelectedTestimonial(testimonial)
        setisModalOpen(true)
    }

    const handleCloseModal = () => {
        setisModalOpen(false)
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
                        refetch={refetch}
                        currentLanguage={currentLanguage}
                        addData={addData}
                        setAddData={setAddData}
                    />
                </CardContent>
            ) : (
                <CardContent>
                    <div className={isLoading ? "flex" : "grid grid-cols-1 md:grid-cols-3 gap-4"}>
                        {isLoading ? (
                            <div className="w-full h-full flex !justify-center items-center">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : isError ? (
                            <div className="col-span-2 text-center py-8 text-red-500">Məlumatları yükləyərkən xəta baş verdi</div>
                        ) : getCustomers && getCustomers.length > 0 ? (
                            getCustomers.map((testimonial: any) => (
                                <div key={testimonial.id} className="border rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex flex-col gap-3 md:w-1F/3">
                                            <div className="w-full flex justify-between items-center">
                                                <div className="h-10 w-15">
                                                    <img
                                                        src={testimonial.customer_profile.url || "/placeholder.svg?height=40&width=40"}
                                                        alt={testimonial.name}
                                                        className="rounded-full object-cover w-full h-full"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{testimonial.name}</div>
                                                </div>
                                            </div>
                                            <div className="w-full flex justify-between items-center">
                                                <Image
                                                    src={testimonial.bank_logo.url || "/placeholder.svg?height=50&width=50"}
                                                    alt={testimonial.bank_name || ""}
                                                    width={50}
                                                    height={50}
                                                    className="rounded-full w-15 !h-15"
                                                />
                                                <div className="text-sm text-muted-foreground">{testimonial.bank_name}</div>
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost" onClick={() => handleEdit(testimonial)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => handleDelete(testimonial.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-sm mt-2">{testimonial.comment}</div>
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

            {/* Edit Modal */}
            <TestimonialsEditModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                testimonial={selectedTestimonial}
                refetch={refetch}
                currentLanguage={currentLanguage}
            />
        </Card>
    )
}

export default Testimonials
