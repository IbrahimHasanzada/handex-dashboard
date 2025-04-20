"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { useAddCustomersMutation, useUploadFileMutation } from "@/store/handexApi"

export const TestimonialsAdd: React.FC<any> = ({ addData, setAddData, refetch }) => {
    const [activeTab, setActiveTab] = useState("az")
    const [profilePreview, setProfilePreview] = useState()
    const [uploadImage, { isLoading, isSuccess, isError }] = useUploadFileMutation()
    const [addCustomers, { isSuccess: addCustomersSucces, isError: addCustomersError }] = useAddCustomersMutation()
    const [bankPreview, setBankPreview] = useState()
    const [addTestimonials, setaddTestimonials] = useState({
        name: "",
        bank_name: "",
        translations: [
            { comment: "", lang: "az" },
            { comment: "", lang: "en" },
            { comment: "", lang: "ru" }
        ],
        customer_profile: null,
        bank_logo: null,
    })

    const handleInputChange = (field: string, value: string) => {
        setaddTestimonials({
            ...addTestimonials,
            [field]: value,
        })
    }

    const handleCommentChange = (lang: string, value: string) => {
        setaddTestimonials({
            ...addTestimonials,
            translations: addTestimonials.translations.map(item => (
                item.lang === lang ? { ...item, comment: value }
                    : item
            )),
        })
    }

    const handleFileChange = async (field: string, file: File | null) => {
        console.log(field, file)
        if (file) {
            try {
                const formData = new FormData()
                formData.append('image', file)
                const response = await uploadImage(formData).unwrap()
                if (!isLoading) {
                    if (field == 'customer_profile') { setProfilePreview(response.url) } else setBankPreview(response.url)
                    setaddTestimonials({
                        ...addTestimonials,
                        [field]: response.id
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log(addTestimonials)
        try {
            await addCustomers(addTestimonials).unwrap()
            await refetch()
        } catch (error) {
            console.log(error)
        }
        setAddData(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <Card className="w-full max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>Yeni Rəy Əlavə Et</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="customer_profile">Müştəri Profil Şəkli</Label>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-40 relative">
                                {profilePreview ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={profilePreview || "/placeholder.svg"}
                                            alt="Customer profile preview"
                                            fill
                                            className="object-contain rounded-full"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-0 right-0 bg-white rounded-full"
                                            onClick={(e) => handleFileChange("customer_profile", null)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Şəkil yükləmək üçün klikləyin və ya sürükləyin</p>
                                        <input
                                            id="customer_profile"
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleFileChange("customer_profile", e.target.files?.[0] || null)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Bank Logo */}
                        <div className="space-y-2">
                            <Label htmlFor="bank_logo">Şirkət Logosu</Label>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-40 relative">
                                {bankPreview ? (
                                    <div className="relative w-full h-full">
                                        <Image
                                            src={bankPreview || "/placeholder.svg"}
                                            alt="Bank logo preview"
                                            fill
                                            className="object-contain"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-0 right-0 bg-white rounded-full"
                                            onClick={() => handleFileChange("bank_logo", null)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Şəkil yükləmək üçün klikləyin və ya sürükləyin</p>
                                        <input
                                            id="bank_logo"
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={(e) => handleFileChange("bank_logo", e.target.files?.[0] || null)}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Customer Name */}
                    <div className="space-y-2">
                        <Label htmlFor="name">Müştəri Adı</Label>
                        <Input
                            id="name"
                            value={addTestimonials.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>

                    {/* Bank Name */}
                    <div className="space-y-2">
                        <Label htmlFor="bank_name">Şirkət Adı</Label>
                        <Input
                            id="bank_name"
                            value={addTestimonials.bank_name}
                            onChange={(e) => handleInputChange("bank_name", e.target.value)}
                            placeholder="Handex MMC"
                        />
                    </div>

                    {/* Testimonial Text with Language Tabs */}
                    <div className="space-y-2">
                        <Label>Rəy Mətni</Label>
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="mb-2">
                                <TabsTrigger value="az">AZ</TabsTrigger>
                                <TabsTrigger value="en">EN</TabsTrigger>
                                <TabsTrigger value="ru">RU</TabsTrigger>
                            </TabsList>
                            <TabsContent value="az">
                                <Textarea
                                    placeholder="Rəy mətnini daxil edin..."
                                    value={addTestimonials.translations.find(item => item.lang === "az")?.comment}
                                    onChange={(e) => handleCommentChange("az", e.target.value)}
                                    rows={5}
                                />
                            </TabsContent>
                            <TabsContent value="en">
                                <Textarea
                                    placeholder="Enter testimonial text..."
                                    value={addTestimonials.translations.find(item => item.lang === "en")?.comment}
                                    onChange={(e) => handleCommentChange("en", e.target.value)}
                                    rows={5}
                                />
                            </TabsContent>
                            <TabsContent value="ru">
                                <Textarea
                                    placeholder="Введите текст отзыва..."
                                    value={addTestimonials.translations.find(item => item.lang === "ru")?.comment}
                                    onChange={(e) => handleCommentChange("ru", e.target.value)}
                                    rows={5}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button onClick={() => setAddData(false)} type="button" variant="outline">
                        Ləğv Et
                    </Button>
                    <Button type="submit">Yadda Saxla</Button>
                </CardFooter>
            </Card>
        </form>
    )
}
