"use client"

import { useState } from "react"
import Image from "next/image"
import { Edit, MoreVertical, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useAddContentMutation, useGetHeroQuery } from "@/store/handexApi"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminFeaturesPage() {
    type Language = "az" | "en" | "ru"
    const [addFeatures, { isLoading: isFeatLoading }] = useAddContentMutation()
    const [activeLanguage, setActiveLanguage] = useState<string>("az")
    const {
        data: featuresData,
        refetch: fetchFeatures,
        isFetching,
        isLoading,
    } = useGetHeroQuery({ slug: "corporate-features", lang: activeLanguage, scope: "componentC" }, { skip: false })
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [currentFeature, setCurrentFeature] = useState<Feature | null>(null)
    const openEditDialog = (feature: Feature) => {
        setCurrentFeature(feature)
        setIsEditDialogOpen(true)
    }

    const openDeleteDialog = (feature: Feature) => {
        setCurrentFeature(feature)
    }

    const handleAddFeature = async (data: Omit<Feature, "id">) => {

        await addFeatures({ slug: "corporate-features", ...data }).unwrap()
        setIsAddDialogOpen(false)
        toast.success("Xüsusiyyət uğurla əlavə edildi")
    }

    const handleUpdateFeature = (data: Omit<Feature, "id">) => {
        setIsEditDialogOpen(false)
        toast.success("Xüsusiyyət uğurla yeniləndi")
    }



    const handleDeleteFeature = () => {
        if (!currentFeature) return

        toast.success("Xüsusiyyət uğurla silindi")
    }
    const handleLanguageChange = (language: Language) => {
        setActiveLanguage(language)
        fetchFeatures()
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Xüsusiyyətləri idarə edin</h1>
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
                        <Plus className="mr-2 h-4 w-4" /> Yeni Xüsusiyyət əlavə edin
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuresData?.map((feature: any) => (
                    <Card key={feature.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center">
                                    <div className="relative w-20 h-20 overflow-hidden rounded-md">
                                        <Image
                                            src={feature.images[0].url || "/placeholder.svg"}
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
                                            onClick={() => openDeleteDialog(feature)}
                                        >
                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <CardTitle className="mt-4">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Yeni Xüsusiyyət əlavə edin</DialogTitle>
                    </DialogHeader>
                    <FeatureForm isFeatLoading={isFeatLoading} onSubmit={handleAddFeature} onCancel={() => setIsAddDialogOpen(false)} />
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Xüsusiyyəti Redaktə et</DialogTitle>
                    </DialogHeader>
                    {currentFeature && (
                        <FeatureForm
                            defaultValues={currentFeature}
                            onSubmit={handleUpdateFeature}
                            onCancel={() => setIsEditDialogOpen(false)}
                            isFeatLoading={isFeatLoading}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
