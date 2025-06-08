"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Camera, Check, Globe, Loader2, X } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "react-toastify"
import { useUpdateCustomersMutation, useUploadFileMutation } from "@/store/handexApi"
import { DialogTitle } from "@radix-ui/react-dialog"
import { testimonialEditSchema, TestimonialEditValues } from "@/validations/home/testimonials.validation"
import { TestimonialsEditModalProps, TestimonialSubmit } from "@/types/home/testimonials.dto"

const TestimonialsEditModal = ({
    testimonial,
    onClose,
    refetch,
    currentLanguage,
    isOpen,
}: TestimonialsEditModalProps) => {
    const profileImageInputRef = useRef<HTMLInputElement>(null)
    const logoImageInputRef = useRef<HTMLInputElement>(null)
    const [updateCustomers, { isLoading: cusLoading }] = useUpdateCustomersMutation()
    const [uploadImage, { isLoading: upLoading }] = useUploadFileMutation()
    const [profilePreview, setProfilePreview] = useState(testimonial?.customer_profile?.url)
    const [bankPreview, setBankPreview] = useState(testimonial?.bank_logo?.url)
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<TestimonialEditValues>({
        resolver: zodResolver(testimonialEditSchema),
        defaultValues: {
            id: testimonial?.id || "",
            name: testimonial?.name || "",
            bank_name: testimonial?.bank_name || "",
            comment: testimonial.comment,
            bank_logo_id: testimonial?.bank_logo?.id,
            customer_profile_id: testimonial?.customer_profile?.id,
            currentLanguage,
        },
    })

    useEffect(() => {
        if (testimonial) {
            reset({
                id: testimonial.id,
                name: testimonial.name || "",
                bank_name: testimonial.bank_name || "",
                comment: testimonial.comment,
                bank_logo_id: testimonial?.bank_logo?.id,
                customer_profile_id: testimonial?.customer_profile?.id,
                currentLanguage,
            })
        }
    }, [testimonial, reset, currentLanguage])

    const formValues = watch()

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await uploadImage(formData)
            setValue("customer_profile_id", response?.data.id, { shouldDirty: true })
            setProfilePreview(response?.data.url)
            toast.success("Profil şəkli yükləndi")
        } catch (error) {
            toast.error("Şəkil yükləmə xətası")
        }
    }

    const handleLogoImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const formData = new FormData()
            formData.append("file", file)

            const response = await uploadImage(formData)

            setValue("bank_logo_id", response?.data.id, { shouldDirty: true })
            setBankPreview(response?.data.url)
            toast.success("Şirkət logosu yükləndi")
        } catch (error) {
            toast.error("Şəkil yükləmə xətası")
        }
    }

    const onSaveEdit = async (data: TestimonialEditValues) => {
        try {
            const submitData: TestimonialSubmit = {
                id: data.id,
                name: data.name,
                bank_name: data.bank_name,
                bank_logo: data.bank_logo_id || 0,
                customer_profile: data.customer_profile_id || 0,
                translations: [
                    {
                        comment: data.comment,
                        lang: data.currentLanguage,
                    },
                ],
            }
            await updateCustomers({ params: submitData, id: data.id })
            toast.success("Rəy uğurla yeniləndi!")
            await refetch()
            !cusLoading && onClose()
        } catch (error: any) {
            toast.error(error?.data?.message || "Xəta baş verdi")
        }
    }

    const languageNames = {
        az: "Azərbaycan",
        en: "English",
        ru: "Русский",
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-bold">
                        Rəyi dəyiş
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSaveEdit)}>
                    <div className="mb-4 flex flex-col gap-5">
                        <div>
                            <p className="mb-2">Müştəri</p>
                            <div className="flex justify-between items-center gap-5">
                                <div className="relative">
                                    {upLoading
                                        ?
                                        (
                                            <Loader2 className="animate-spin" />
                                        )
                                        : (
                                            <>
                                                <Image
                                                    src={profilePreview || "/placeholder.svg?height=40&width=40"}
                                                    alt={formValues.name || "Customer profile"}
                                                    width={60}
                                                    height={60}
                                                    className="rounded-full object-cover"
                                                />
                                                <Button
                                                    size="icon"
                                                    variant="secondary"
                                                    className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full"
                                                    onClick={() => profileImageInputRef.current?.click()}
                                                    type="button"
                                                >
                                                    <Camera className="h-3 w-3" />
                                                </Button>
                                                <Input
                                                    type="file"
                                                    ref={profileImageInputRef}
                                                    onChange={handleProfileImageChange}
                                                    accept="image/*"
                                                    className="hidden"
                                                />
                                            </>
                                        )
                                    }
                                </div>
                                <div className="w-full">
                                    <Input {...register("name")} placeholder="Ad Soyad" className="w-full" />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="mb-2">Şirkət</p>
                            <div className="flex justify-between items-center gap-5">
                                <div className="relative">
                                    {upLoading ?
                                        (
                                            <Loader2 className="animate-spin" />
                                        ) :
                                        <>
                                            <Image
                                                src={bankPreview || "/placeholder.svg?height=50&width=50"}
                                                alt={formValues.bank_name || "Company logo"}
                                                width={60}
                                                height={60}
                                                className="rounded-full object-cover"
                                            />
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full"
                                                onClick={() => logoImageInputRef.current?.click()}
                                                type="button"
                                            >
                                                <Camera className="h-3 w-3" />
                                            </Button>
                                            <input
                                                type="file"
                                                ref={logoImageInputRef}
                                                onChange={handleLogoImageChange}
                                                accept="image/*"
                                                className="hidden"
                                            />
                                        </>

                                    }
                                </div>

                                <div className="w-full">
                                    <Input {...register("bank_name")} placeholder="Vəzifə" className="w-full" />
                                    {errors.bank_name && <p className="text-sm text-destructive">{errors.bank_name.message}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <p>Rəy</p>
                        <Textarea
                            {...register("comment")}
                            placeholder="Rəy"
                            rows={3}
                        />
                        {errors.comment && <p className="text-sm text-destructive">{errors.comment.message}</p>}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            {languageNames[currentLanguage as keyof typeof languageNames] || currentLanguage}
                            <span className="ml-1">(Düzəliş edilir)</span>
                        </div>

                        <div className="flex gap-2">
                            <Button size="sm" className="bg-black hover:bg-white hover:border border-black group" type="submit">

                                <span className="text-white group-hover:text-black">
                                    {cusLoading ?
                                        <span className="flex items-center">
                                            <Loader2 className="animate-spin h-4 w-4 mr-1" />
                                            Yenilənir...
                                        </span>
                                        :
                                        <span className="flex items-center">
                                            <Check className="h-4 w-4 mr-1 text-white group-hover:text-black" />
                                            Saxla
                                        </span>
                                    }
                                </span>
                            </Button>
                            <Button size="sm" variant="ghost" type="button" onClick={onClose}>
                                Ləğv et
                            </Button>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    )
}

export default TestimonialsEditModal
