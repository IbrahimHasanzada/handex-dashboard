"use client"

import { useState } from "react"
import Image from "next/image"
import { Box, Edit, MoreVertical, Plus, Trash } from "lucide-react"
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
import { toast } from "react-toastify"
import { useAddContentMutation, useDeleteContentMutation, useGetContentQuery, useGetHeroQuery, useUpdateContentMutation } from "@/store/handexApi"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import EditWhyHandexForm from "./why-handex-form-edit"
import WhyHandexForm from "./why-handex-form"

export default function AdminWhyHandexPage() {
    type Language = "az" | "en" | "ru"
    const [addFeatures, { isLoading: isFeatLoading }] = useAddContentMutation()
    const [delFeatures] = useDeleteContentMutation()
    const [updateFeature, { isLoading: upLoading }] = useUpdateContentMutation()
    const [activeLanguage, setActiveLanguage] = useState<string>("az")
    const {
        data: informationsData,
        refetch: fetchFeatures,
        isFetching,
        isLoading,
    } = useGetContentQuery({ slug: "corporate-informations", lang: activeLanguage }, { skip: false })
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentFeature, setCurrentFeature] = useState<Feature>()

    const openEditDialog = (informations: Feature) => {
        setCurrentFeature(informations)
        setIsEditDialogOpen(true)
    }
    const handleAddFeature = async (data: Omit<Feature, "id">) => {
        try {
            await addFeatures({ slug: "corporate-informations", ...data }).unwrap()
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
                successText: "Məlumat uğurla silindi.",
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
                <h1 className="text-3xl font-bold">Niyə Handex?</h1>
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

                    <Button onClick={() => setIsAddDialogOpen(true)} className="w-full sm:w-auto">
                        <Plus className="mr-2 h-4 w-4" /> Yeni məlumat əlavə edin
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {informationsData?.map((information: any) => (
                    <Card key={information.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                    <div className="relative w-20 h-20 overflow-hidden rounded-md">
                                        <Image
                                            src={information?.images.length > 0 && information?.images?.[0].url || "/placeholder.svg"}
                                            alt={'informations'}
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
                                        <DropdownMenuItem onClick={() => openEditDialog(information)}>
                                            <Edit className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            className="text-destructive focus:text-destructive"
                                            onClick={() => handleDeleteFeature(information.id)}
                                        >
                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="mt-4">{information.title}</CardTitle>
                        </CardHeader>
                        <div className="px-6 pb-6">
                            <p className="text-sm text-muted-foreground break-all">
                                {information.desc}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>

            {informationsData?.length === 0 && (
                <div className="w-full flex flex-col gap-5 items-center py-8">
                    <p>Məlumat əlavə edilməyib</p>
                    <Box className="h-16 w-16" />
                </div>
            )}

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Yeni üstünlük əlavə edin</DialogTitle>
                    </DialogHeader>
                    <WhyHandexForm
                        isFeatLoading={isFeatLoading}
                        onSubmit={handleAddFeature}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Məlumatı Redaktə et</DialogTitle>
                    </DialogHeader>
                    {informationsData && (
                        <EditWhyHandexForm
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
