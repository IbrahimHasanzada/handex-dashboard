"use client"

import React, { useState } from "react"
import Image from "next/image"
import { Edit, MoreVertical, Package, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Feature } from "@/validations/corporate/fetures.validation"
import FeatureForm from "./features-form"
import { toast } from "react-toastify"
import { useAddContentMutation, useDeleteContentMutation, useGetHeroQuery, useUpdateContentMutation } from "@/store/handexApi"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import EditFeatureForm from "./features-form-edit"

export default function AdminFeaturesPage({ slug, title }: any) {
    type Language = "az" | "en" | "ru"
    const [addFeatures, { isLoading: isFeatLoading }] = useAddContentMutation()
    const [delFeatures] = useDeleteContentMutation()
    const [updateFeature, { isLoading: upLoading }] = useUpdateContentMutation()
    const [activeLanguage, setActiveLanguage] = useState<string>("az")
    const {
        data: featuresData,
        refetch: fetchFeatures
    } = useGetHeroQuery({ slug, lang: activeLanguage, scope: "componentC" }, { skip: false })
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentFeature, setCurrentFeature] = useState<Feature>()

    const openEditDialog = (features: Feature) => {
        setCurrentFeature(features)
        setIsEditDialogOpen(true)
    }
    const handleAddFeature = async (data: Omit<Feature, "id">) => {
        try {
            await addFeatures({ slug, ...data }).unwrap()
            fetchFeatures()
            setIsAddDialogOpen(false)
            toast.success("Məlumat uğurla əlavə edildi")
        } catch (error) {
            toast.error("Məlumatı əlavə edərkən xəta baş verdi")
        }
    }

    const handleUpdateFeature = async (data: Omit<Feature, "id">, id: number) => {
        try {
            await updateFeature({ params: data, id }).unwrap()
            fetchFeatures()
            setIsEditDialogOpen(false)
            toast.success("Məlumat uğurla yeniləndi")
        } catch (error) {
            toast.error("Məlumatları daxil edərkən xəta baş verdi")
        }
    }



    const handleDeleteFeature = async (id: number) => {
        try {
            showDeleteConfirmation(delFeatures, id, fetchFeatures, {
                title: "Məlumatı silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Üstünlük uğurla silindi.",
            })
        } catch (error) {
            toast.error('Məlumatı silərkən xəta baş verdi')
        }
    }
    const handleLanguageChange = (language: Language) => {
        setActiveLanguage(language)
        fetchFeatures()
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">{title}</h1>
                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="w-full sm:w-auto">
                        <Tabs value={activeLanguage} onValueChange={(value) => handleLanguageChange(value as Language)}>
                            <TabsList className="grid grid-cols-3 w-full">
                                <TabsTrigger value="az">AZ</TabsTrigger>
                                <TabsTrigger value="en">EN</TabsTrigger>
                                <TabsTrigger value="ru">RU</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {featuresData?.length < 6 && <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Yeni üstünlük əlavə edin
                    </Button>}
                </div>
            </div>

            <div className={featuresData?.length && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}>
                {!featuresData?.length ?
                    <div className="flex flex-col items-center gap-5 justify-center w-full p-5">
                        <Package className="w-10 h-10 md:w-20 md:h-20" />
                        <span className="text-xl">Məlumat tapılmadı</span>
                    </div>
                    : featuresData?.map((feature: any) => (
                        <Card key={feature.id}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center">
                                        <div className="relative w-20 h-20 overflow-hidden rounded-md">
                                            <Image
                                                src={feature?.images.length > 0 && feature?.images?.[0].url || "/placeholder.svg"}
                                                alt={'features'}
                                                fill
                                                className="object-contain"
                                                sizes="80px"
                                            />
                                        </div>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                                <span className="sr-only">Actions</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openEditDialog(feature)}>
                                                <Edit className="mr-2 h-4 w-4" /> Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onClick={() => handleDeleteFeature(feature.id)}
                                            >
                                                <Trash className="mr-2 h-4 w-4" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                                <CardTitle className="mt-4">{feature.title}</CardTitle>
                            </CardHeader>
                            <div className="px-6 pb-6">
                                <p className="text-sm text-muted-foreground break-all">
                                    {feature.desc}
                                </p>
                            </div>
                        </Card>
                    ))}
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Yeni üstünlük əlavə edin</DialogTitle>
                    </DialogHeader>
                    <FeatureForm
                        isFeatLoading={isFeatLoading}
                        onSubmit={handleAddFeature}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Üstünlüyü Redaktə et</DialogTitle>
                    </DialogHeader>
                    {featuresData && (
                        <EditFeatureForm
                            onSubmit={handleUpdateFeature}
                            onCancel={() => setIsEditDialogOpen(false)}
                            isFeatLoading={isFeatLoading}
                            features={currentFeature}
                            lang={activeLanguage}
                            upLoading={upLoading}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
