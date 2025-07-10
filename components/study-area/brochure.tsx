"use client"

import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload, X, File, Plus } from 'lucide-react'
import { useAddBrochureMutation } from "@/store/handexApi"
import { toast } from "react-toastify"

const fileSchema = z
    .custom<File>((file) => {
        if (!file) return false
        const allowedTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        ]
        return allowedTypes.includes(file.type)
    }, {
        message: "Zəhmət olmasa yalnız PDF və DOC faylları yükləyin",
    })

const formSchema = z.object({
    file: fileSchema,
    studyAreaId: z.number().min(1, "Study Area ID minimum 1 olmalıdır"),
})

type FormData = z.infer<typeof formSchema>

export default function BrochureForm({ studyAreaId }: { studyAreaId: number }) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [addBrochure, { isLoading }] = useAddBrochureMutation()

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studyAreaId: studyAreaId
        }
    })

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setValue("file", file, { shouldValidate: true })
        }
    }

    const handleReset = () => {
        reset()
        setSelectedFile(null)
        setIsModalOpen(false)
    }

    const removeFile = () => {
        setSelectedFile(null)
        setValue("file", undefined as any)
    }

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData()
            formData.append("file", data.file)
            // formData.append("studyAreaId", studyAreaId as any)

            console.log("Sending data:", {
                file: data.file,
                studyAreaId: studyAreaId,
            })

            await addBrochure({ parmas: { formData, studyAreaId } }).unwrap()

            toast.success("Məlumatlar uğurla göndərildi!")
            handleReset()
        } catch (error) {
            console.error("Error:", error)
            alert("Xəta baş verdi!")
        }
    }

    return (
        <div className="mx-auto space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <h2>Broşür əlavə edin</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full h-12 border-dashed border-2 hover:bg-muted/50 bg-transparent"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Broşür əlavə et
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>Brochure Əlavə Et</DialogTitle>
                                </DialogHeader>

                                {/* Form elementi əlavə edildi */}
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8">
                                        {selectedFile ? (
                                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                                                <div className="flex items-center space-x-3">
                                                    <File className="w-5 h-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="text-sm font-medium">{selectedFile.name}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="text-center space-y-4">
                                                <div className="mx-auto w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                                    <Upload className="w-6 h-6 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">Brochure yükləmək üçün klikləyin</p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        PDF, DOC, DOCX faylları dəstəklənir
                                                    </p>
                                                </div>
                                                <Input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                    id="file-upload-modal"
                                                    accept=".pdf,.doc,.docx"
                                                />
                                                <Label
                                                    htmlFor="file-upload-modal"
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                                                >
                                                    Fayl Seç
                                                </Label>
                                            </div>
                                        )}
                                    </div>

                                    {errors.file && (
                                        <p className="text-sm text-red-500">{errors.file.message}</p>
                                    )}

                                    <div className="flex justify-end space-x-3">
                                        <Button type="button" variant="outline" onClick={handleReset}>
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isLoading || !selectedFile}
                                            className="bg-blue-500 hover:bg-blue-600"
                                        >
                                            {isLoading ? "Göndərilir..." : "Əlavə et"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {/* Seçilmiş faylın göstərilməsi */}
                        {selectedFile && (
                            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border">
                                <div className="flex items-center space-x-3">
                                    <File className="w-5 h-5 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">{selectedFile.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                </div>
                                <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
