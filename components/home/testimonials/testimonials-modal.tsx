"use client"

import { useState } from "react"
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
import { Upload, X } from "lucide-react"
import { useUploadFileMutation, useAddCustomersMutation, useUpdateCustomersMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import { testimonialFormSchema } from "@/validations/testimonials.validation"
import { TestimonialsModalProps } from "@/types/home/testimonials.dto"



type TestimonialFormValues = z.infer<typeof testimonialFormSchema>


export function TestimonialsModal({ isOpen, onClose, testimonial, refetch, currentLanguage }: TestimonialsModalProps) {
    const isEditing = !!testimonial
    const [activeTab, setActiveTab] = useState(currentLanguage)
    const [profilePreview, setProfilePreview] = useState<string | null>(testimonial?.customer_profile?.url || null)
    const [bankPreview, setBankPreview] = useState<string | null>(testimonial?.bank_logo?.url || null)

    const [uploadImage] = useUploadFileMutation()
    const [addCustomers] = useAddCustomersMutation()
    const [updateCustomers] = useUpdateCustomersMutation()

    // Initialize form with default values
    const defaultValues: Partial<TestimonialFormValues> = {
        name: testimonial?.name || "",
        bank_name: testimonial?.bank_name || "",
        customer_profile: testimonial?.customer_profile?.id || null,
        bank_logo: testimonial?.bank_logo?.id || null,
        translations: [
            { comment: testimonial?.comment || "", lang: currentLanguage },
            { comment: "", lang: "az" },
            { comment: "", lang: "en" },
            { comment: "", lang: "ru" },
        ],
    }

    // If editing, update translations with current language comment
    if (isEditing) {
        defaultValues.translations = [{ comment: testimonial?.comment || "", lang: currentLanguage }]
    }

    const form = useForm<TestimonialFormValues>({
        resolver: zodResolver(testimonialFormSchema),
        defaultValues,
    })

    const handleFileChange = async (field: "customer_profile" | "bank_logo", file: File | null) => {
        if (!file) {
            if (field === "customer_profile") {
                setProfilePreview(null)
            } else {
                setBankPreview(null)
            }
            form.setValue(field, null)
            return
        }

        // Basic file validation
        if (!file.type.startsWith("image/")) {
            toast.error("Yalnız şəkil faylları yükləyə bilərsiniz")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Şəkil 5MB-dan böyük olmamalıdır")
            return
        }

        try {
            const formData = new FormData()
            formData.append("file", file)
            const response = await uploadImage(formData).unwrap()

            if (field === "customer_profile") {
                setProfilePreview(response.url)
            } else {
                setBankPreview(response.url)
            }

            form.setValue(field, response.id)
        } catch (error) {
            toast.error("Şəkil yüklənərkən xəta baş verdi")
        }
    }

    const onSubmit = async (data: TestimonialFormValues) => {
        try {
            if (isEditing) {
                await updateCustomers({
                    params: data,
                    id: testimonial.id,
                }).unwrap()
                toast.success("Rəy uğurla yeniləndi!")
            } else {
                await addCustomers(data).unwrap()
                toast.success("Rəy uğurla əlavə edildi!")
            }
            await refetch()
            onClose()
        } catch (error: any) {
            toast.error(error?.data?.message?.join?.(",") || "Xəta baş verdi")
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Rəyi Redaktə Et" : "Yeni Rəy Əlavə Et"}</DialogTitle>
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
                                                            alt="Customer profile preview"
                                                            fill
                                                            className="object-contain rounded-full"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute top-0 right-0 bg-white rounded-full"
                                                            onClick={() => handleFileChange("customer_profile", null)}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                                        <p className="text-sm text-muted-foreground">
                                                            Şəkil yükləmək üçün klikləyin və ya sürükləyin
                                                        </p>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            onChange={(e) => handleFileChange("customer_profile", e.target.files?.[0] || null)}
                                                        />
                                                    </>
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
                                                        <p className="text-sm text-muted-foreground">
                                                            Şəkil yükləmək üçün klikləyin və ya sürükləyin
                                                        </p>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                            onChange={(e) => handleFileChange("bank_logo", e.target.files?.[0] || null)}
                                                        />
                                                    </>
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
                                {["az", "en", "ru"].map((lang) => (
                                    <TabsContent key={lang} value={lang}>
                                        <FormField
                                            control={form.control}
                                            name={`translations.${lang === currentLanguage ? 0 : ["az", "en", "ru"].indexOf(lang) + 1}.comment`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder={
                                                                lang === "az"
                                                                    ? "Rəy mətnini daxil edin..."
                                                                    : lang === "en"
                                                                        ? "Enter testimonial text..."
                                                                        : "Введите текст отзыва..."
                                                            }
                                                            rows={5}
                                                            {...field}
                                                            onChange={(e) => {
                                                                field.onChange(e)
                                                                // Update the form data for the current language
                                                                const updatedTranslations = [...form.getValues().translations]
                                                                const index = updatedTranslations.findIndex((t) => t.lang === lang)
                                                                if (index >= 0) {
                                                                    updatedTranslations[index].comment = e.target.value
                                                                } else {
                                                                    updatedTranslations.push({ comment: e.target.value, lang })
                                                                }
                                                                form.setValue("translations", updatedTranslations)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Ləğv Et
                            </Button>
                            <Button type="submit">{isEditing ? "Yadda Saxla" : "Əlavə Et"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
