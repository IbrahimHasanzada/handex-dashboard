"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Edit, Globe, Plus, Trash2 } from 'lucide-react'
import { useDeleteCustomersMutation, useGetCustomersQuery } from "@/store/handexApi"
import { Testimonial } from "@/types/home/testimonials.dto"
import TestimonialsEdit from "./testimonials-edit"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TestimonialsAdd } from "./testimonials-add"

const Testimonials = () => {
    const [editingId, setEditingId] = useState<number | string | null>(null)
    const [editedData, setEditedData] = useState<Partial<Testimonial>>({})
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")
    const [addData, setAddData] = useState<boolean>(false)

    const { data: getCustomers, isLoading, isError, refetch } = useGetCustomersQuery(currentLanguage)
    const [deleteCustomer, { isLoading: customersLoading, data: customersData }] = useDeleteCustomersMutation()

    const handleEdit = (testimonial: Testimonial) => {
        setEditingId(testimonial.id)
        setEditedData({
            name: testimonial.name,
            bank_name: testimonial.bank_name,
            bank_logo: testimonial.bank_logo.id,
            translations: [{
                comment: testimonial.comment,
                lang: currentLanguage
            }],
            customer_profile: testimonial.customer_profile.id,
        })
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditedData({})
    }

    const handleDelete = async (id: number | string) => {
        try {
            await deleteCustomer(id)
            await refetch()
        } catch (error) {
            console.error(error)
        }
    }


    const handleLanguageChange = (language: string) => {
        setCurrentLanguage(language)
        if (editingId) {
            handleCancelEdit()
        }
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
            {addData ?
                <CardContent>
                    <TestimonialsAdd addData={addData} setAddData={setAddData} />
                </CardContent>

                :
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {isLoading ? (
                            <div className="col-span-2 text-center py-8">Yüklənir...</div>
                        ) : isError ? (
                            <div className="col-span-2 text-center py-8 text-red-500">Məlumatları yükləyərkən xəta baş verdi</div>
                        ) : getCustomers && getCustomers.length > 0 ? (
                            getCustomers.map((testimonial: Testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className={`border rounded-lg p-4 ${editingId === testimonial.id ? "bg-muted/50 shadow-sm" : ""}`}
                                >
                                    {editingId === testimonial.id ? (
                                        <TestimonialsEdit
                                            editedData={editedData}
                                            handleCancelEdit={handleCancelEdit}
                                            testimonial={testimonial}
                                            setEditedData={setEditedData}
                                            setEditingId={setEditingId}
                                            refetch={refetch}
                                            currentLanguage={currentLanguage}
                                        />
                                    ) : (
                                        <>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={testimonial.customer_profile.url || "/placeholder.svg?height=40&width=40"}
                                                        alt={testimonial.name}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                    <div>
                                                        <div className="font-medium">{testimonial.name}</div>
                                                        <div className="text-sm text-muted-foreground">{testimonial.bank_name}</div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <Image
                                                        src={testimonial.bank_logo.url || "/placeholder.svg?height=50&width=50"}
                                                        alt={testimonial.bank_name || ""}
                                                        width={50}
                                                        height={50}
                                                        className="rounded-full"
                                                    />
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
                                        </>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-8">Heç bir rəy tapılmadı</div>
                        )}
                    </div>
                </CardContent>
            }
        </Card>
    )
}

export default Testimonials
