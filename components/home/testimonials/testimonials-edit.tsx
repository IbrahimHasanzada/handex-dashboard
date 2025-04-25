"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Camera, Loader2 } from "lucide-react"
import { useUploadFileMutation, useUpdateCustomersMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import { validateImage } from "@/validations/upload.validation"
import { testimonialFormSchema } from "@/validations/testimonials.validation"
import { TestimonialsModalProps } from "@/types/home/testimonials.dto"



type TestimonialEditValues = z.infer<typeof testimonialFormSchema>


export function TestimonialsEditModal({
    isOpen,
    onClose,
    testimonial,
    refetch,
    currentLanguage,
}: TestimonialsModalProps) {
    const [activeTab, setActiveTab] = useState(currentLanguage)
    const [profilePreview, setProfilePreview] = useState<string | null>(null)
    const [bankLogoPreview, setBankLogoPreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [uploadImage] = useUploadFileMutation()
    const [updateCustomers] = useUpdateCustomersMutation()

    const form = useForm<TestimonialEditValues>({
        resolver: zodResolver(testimonialFormSchema),
        defaultValues: {
            name: "",
            bank_name: "",
            customer_profile: -1,
            bank_logo: -1,
            translations: [{ comment: "", lang: currentLanguage }],
        },
    })

    useEffect(() => {

        if (testimonial) {
            form.reset({
                name: testimonial.name || "",
                bank_name: testimonial.bank_name || "",
                customer_profile: testimonial.customer_profile?.id || -1,
                bank_logo: testimonial.bank_logo?.id || -1,
                translations: [{ comment: testimonial.comment || "", lang: currentLanguage }],
            })

            setProfilePreview(testimonial.customer_profile?.url || null)
            setBankLogoPreview(testimonial.bank_logo?.url || null)
        }
    }, [testimonial, form, currentLanguage])

    const handleImageUpload = async (field: "customer_profile" | "bank_logo", file: File) => {
        const validationImage = validateImage(file, '', '')
        if (!validationImage) return
        try {
            const formData = new FormData()
            formData.append("file", file)
            const response = await uploadImage(formData).unwrap()

            if (field === "customer_profile") {
                setProfilePreview(response.url)
                form.setValue("customer_profile", response.id)
            } else {
                setBankLogoPreview(response.url)
                form.setValue("bank_logo", response.id)
            }
        } catch (error) {
            toast.error("Şəkil yüklənərkən xəta baş verdi")
        }
    }

    const onSubmit = async (data: TestimonialEditValues) => {
        if (!testimonial?.id) return

        setIsSubmitting(true)
        try {
            await updateCustomers({
                params: data,
                id: testimonial.id,
            }).unwrap()

            toast.success("Rəy uğurla yeniləndi!")
            await refetch()
            onClose()
        } catch (error: any) {
            toast.error(error?.data?.message?.join?.(",") || "Xəta baş verdi")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Get language display name
    const getLanguageName = (lang: string) => {
        switch (lang) {
            case "az":
                return "Azərbaycan"
            case "en":
                return "English"
            case "ru":
                return "Русский"
            default:
                return lang
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Rəyi Redaktə Et</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Profile Image */}
                            <FormField
                                control={form.control}
                                name="customer_profile"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Müştəri Profil Şəkli</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-40 relative">
                                                {profilePreview ? (
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={profilePreview || "/placeholder.svg"}
                                                            alt="Müştəri profil şəkli"
                                                            fill
                                                            className="object-contain rounded-full"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            size="icon"
                                                            className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                                            onClick={() => {
                                                                const input = document.createElement("input")
                                                                input.type = "file"
                                                                input.accept = "image/*"
                                                                input.onchange = (e) => {
                                                                    const file = (e.target as HTMLInputElement).files?.[0]
                                                                    if (file) handleImageUpload("customer_profile", file)
                                                                }
                                                                input.click()
                                                            }}
                                                        >
                                                            <Camera className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center w-full h-full">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const input = document.createElement("input")
                                                                input.type = "file"
                                                                input.accept = "image/*"
                                                                input.onchange = (e) => {
                                                                    const file = (e.target as HTMLInputElement).files?.[0]
                                                                    if (file) handleImageUpload("customer_profile", file)
                                                                }
                                                                input.click()
                                                            }}
                                                        >
                                                            Şəkil Yüklə
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Bank Logo */}
                            <FormField
                                control={form.control}
                                name="bank_logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Şirkət Logosu</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-4 h-40 relative">
                                                {bankLogoPreview ? (
                                                    <div className="relative w-full h-full">
                                                        <Image
                                                            src={bankLogoPreview || "/placeholder.svg"}
                                                            alt="Şirkət logosu"
                                                            fill
                                                            className="object-contain"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            size="icon"
                                                            className="absolute top-2 right-2 h-6 w-6 rounded-full"
                                                            onClick={() => {
                                                                const input = document.createElement("input")
                                                                input.type = "file"
                                                                input.accept = "image/*"
                                                                input.onchange = (e) => {
                                                                    const file = (e.target as HTMLInputElement).files?.[0]
                                                                    if (file) handleImageUpload("bank_logo", file)
                                                                }
                                                                input.click()
                                                            }}
                                                        >
                                                            <Camera className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center w-full h-full">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => {
                                                                const input = document.createElement("input")
                                                                input.type = "file"
                                                                input.accept = "image/*"
                                                                input.onchange = (e) => {
                                                                    const file = (e.target as HTMLInputElement).files?.[0]
                                                                    if (file) handleImageUpload("bank_logo", file)
                                                                }
                                                                input.click()
                                                            }}
                                                        >
                                                            Logo Yüklə
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Customer Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Müştəri Adı</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Bank Name */}
                        <FormField
                            control={form.control}
                            name="bank_name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Şirkət Adı</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Handex MMC" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Testimonial Text with Language Tabs */}
                        <div className="space-y-2">
                            <Label>Rəy Mətni</Label>
                            <Tabs value={activeTab} onValueChange={setActiveTab}>
                                <TabsList className="mb-2">
                                    <TabsTrigger value="az">AZ</TabsTrigger>
                                    <TabsTrigger value="en">EN</TabsTrigger>
                                    <TabsTrigger value="ru">RU</TabsTrigger>
                                </TabsList>
                                <TabsContent value={activeTab}>
                                    <FormField
                                        control={form.control}
                                        name="translations.0.comment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder={
                                                            activeTab === "az"
                                                                ? "Rəy mətnini daxil edin..."
                                                                : activeTab === "en"
                                                                    ? "Enter testimonial text..."
                                                                    : "Введите текст отзыва..."
                                                        }
                                                        rows={5}
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e)
                                                            // Update the form data for the current language
                                                            form.setValue("translations", [{ comment: e.target.value, lang: activeTab }])
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </TabsContent>
                            </Tabs>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Ləğv Et
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Yenilənir...
                                    </>
                                ) : (
                                    "Yadda Saxla"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
