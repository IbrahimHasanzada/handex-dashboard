"use client"

import type React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Camera, Check, Globe, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { useRef, useState } from "react"
import type { Testimonial } from "@/types/home/testimonials.dto"
import { useGetCustomersQuery, useUploadFileMutation } from "@/store/handexApi"

interface TestimonialsEditProps {
    editedData: Partial<Testimonial>
    testimonial: Testimonial
    setEditedData: React.Dispatch<React.SetStateAction<Partial<Testimonial>>>
    setEditingId: React.Dispatch<React.SetStateAction<number | string | null>>
    handleCancelEdit: () => void
    refetch: () => Promise<any>
    currentLanguage: string
}

const TestimonialsEdit: React.FC<TestimonialsEditProps> = ({
    editedData,
    testimonial,
    setEditedData,
    setEditingId,
    handleCancelEdit,
    refetch,
    currentLanguage,
}) => {
    const [uploadImage, { isSuccess, isError }] = useUploadFileMutation()
    const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null)
    const [profileImageId, setProfileImageId] = useState<string>()
    const [logoImagePreview, setLogoImagePreview] = useState<string | null>(null)
    // const { data: getCustomers, isLoading, refetch } = useGetCustomersQuery(currentLanguage)
    const profileImageInputRef = useRef<HTMLInputElement>(null)
    const logoImageInputRef = useRef<HTMLInputElement>(null)

    const handleSaveEdit = async (id: number | string) => {
        console.log("Saving edited testimonial:", id, editedData)
        console.log("New profile image:", profileImagePreview)
        console.log("New logo image:", logoImagePreview)
        console.log("Language:", currentLanguage)
        try {
            console.log(profileImageId)

            console.log(editedData)
            await refetch()
            setEditingId(null)
            setEditedData({})
            setProfileImagePreview(null)
            setLogoImagePreview(null)
        } catch (error) {
            console.error("Error saving testimonial:", error)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setEditedData((prev: any) => {
            if (field === 'translations') {
                return {
                    ...prev,
                    translations: [{ comment: value }],
                }
            } else {
                return {
                    ...prev,
                    [field]: value,
                }
            }
        })
    }

    const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            try {
                const formData = new FormData()
                formData.append('image', file)
                const response = await uploadImage(formData).unwrap()
                setProfileImagePreview(response.url)
                setEditedData({
                    ...editedData,
                    customer_profile: response.id
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const handleLogoImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setLogoImagePreview(previewUrl)
        }
    }

    const languageNames = {
        az: "Azərbaycan",
        en: "English",
        ru: "Русский",
    }

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Image
                            src={
                                profileImagePreview ||
                                testimonial.customer_profile.url ||
                                "/placeholder.svg?height=40&width=40" ||
                                "/placeholder.svg"
                            }
                            alt={testimonial.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                        />
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full"
                            onClick={() => profileImageInputRef.current?.click()}
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
                    </div>
                    <div className="space-y-2">
                        <Input
                            value={editedData.name || ""}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Ad Soyad"
                            className="max-w-[200px]"
                        />
                        <Input
                            value={editedData.bank_name || ""}
                            onChange={(e) => handleInputChange("bank_name", e.target.value)}
                            placeholder="Vəzifə"
                            className="max-w-[200px]"
                        />
                    </div>
                </div>
                <div className="relative">
                    <Image
                        src={logoImagePreview || testimonial.bank_logo.url || "/placeholder.svg?height=50&width=50"}
                        alt={testimonial.bank_name || ""}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => logoImageInputRef.current?.click()}
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
                </div>
                <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleSaveEdit(testimonial.id)}>
                        <Check className="h-4 w-4 mr-1" /> Saxla
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="mt-3">
                <Textarea
                    value={editedData.translations[0].comment || ""}
                    onChange={(e) => handleInputChange("translations", e.target.value)}
                    placeholder="Rəy"
                    rows={3}
                />
            </div>
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <Globe className="h-3 w-3 mr-1" />
                {languageNames[currentLanguage as keyof typeof languageNames] || currentLanguage}
                <span className="ml-1">(Düzəliş edilir)</span>
            </div>
        </>
    )
}

export default TestimonialsEdit
