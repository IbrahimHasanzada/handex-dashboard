"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-toastify"
import type { imageState } from "@/types/home/graduates.dto"
import { ImageUpload } from "../course-form/image-upload"
import { useAddProgramMutation, useUpdateProgramMutation } from "@/store/handexApi"
import {
    type AddProgramFormData,
    addProgramFormSchema,
    type EditProgramFormData,
    editProgramFormSchema,
} from "@/validations/study-area/program.validation"
import type { ProgramFormProps } from "@/types/study-area/program"

import { Editor as TinyMCE } from "@tinymce/tinymce-react"
import { editorConfig } from "@/utils/editor-config"

export function ProgramForm({
    isOpen,
    onClose,
    studyAreaId,
    programId,
    initialData,
    selectedLanguage,
    onSuccess,
}: ProgramFormProps) {
    const isEditMode = !!programId
    const [activeTab, setActiveTab] = useState("az")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [imageState, setImageState] = useState<imageState>({
        preview: initialData?.image?.url || null,
        id: initialData?.image?.id || null,
        error: null,
        selectedFile: null,
    })
    const [altText, setAltText] = useState(initialData?.image?.alt || "")

    const [addProgram] = useAddProgramMutation()
    const [updateProgram] = useUpdateProgramMutation()

    const apiKey = process.env.NEXT_PUBLIC_EDITOR_API_KEY

    const getLanguageDisplayName = (lang: string) => {
        switch (lang) {
            case "az":
                return "Azərbaycanca"
            case "en":
                return "English"
            case "ru":
                return "Русский"
            default:
                return lang
        }
    }

    const getPlaceholder = (lang: string) => {
        switch (lang) {
            case "az":
                return "Proqramın azərbaycanca təsvirini daxil edin"
            case "en":
                return "Enter program description in English"
            case "ru":
                return "Введите описание программы на русском языке"
            default:
                return "Proqram təsvirini daxil edin"
        }
    }

    const addForm = useForm<AddProgramFormData>({
        resolver: zodResolver(addProgramFormSchema),
        defaultValues: {
            name: "",
            image: 0,
            translations: [
                { description: "", lang: "az" },
                { description: "", lang: "en" },
                { description: "", lang: "ru" },
            ],
            studyArea: studyAreaId || 0,
        },
    })

    const editForm = useForm<EditProgramFormData>({
        resolver: zodResolver(editProgramFormSchema),
        defaultValues: {
            name: "",
            image: 0,
            description: "",
            studyArea: studyAreaId || 0,
        },
    })

    const form: any = isEditMode ? editForm : addForm

    useEffect(() => {
        if (isEditMode && initialData) {
            editForm.reset({
                name: initialData.name || "",
                image: initialData.image?.id || 0,
                description: initialData.description || "",
                studyArea: studyAreaId || 0,
            })
            setImageState({
                preview: initialData.image?.url || null,
                id: initialData.image?.id || null,
                error: null,
                selectedFile: null,
            })
            setAltText(initialData.image?.alt || "")
        } else {
            addForm.reset({
                name: "",
                image: 0,
                translations: [
                    { description: "", lang: "az" },
                    { description: "", lang: "en" },
                    { description: "", lang: "ru" },
                ],
                studyArea: studyAreaId || 0,
            })
            setImageState({ preview: null, id: null, error: null, selectedFile: null })
            setAltText("")
        }
    }, [initialData, isEditMode, addForm, editForm, studyAreaId])

    const handleImageUpload = (imageId: number) => {
        form.setValue("image", imageId)
    }

    const onSubmit = async (data: AddProgramFormData | EditProgramFormData) => {
        if (!data.image) {
            toast.error("Zəhmət olmasa şəkil yükləyin")
            return
        }

        if (!studyAreaId) {
            toast.error("Study Area ID tapılmadı")
            return
        }

        setIsSubmitting(true)
        try {
            let payload: any

            if (isEditMode) {
                const editData = data as EditProgramFormData
                payload = {
                    name: editData.name,
                    image: editData.image,
                    translations: [
                        {
                            description: editData.description,
                            lang: selectedLanguage,
                        },
                    ],
                    studyArea: studyAreaId,
                    programId,
                }
            } else {
                const addData = data as AddProgramFormData
                payload = {
                    name: addData.name,
                    image: addData.image,
                    translations: addData.translations,
                    studyArea: studyAreaId,
                }
            }

            if (isEditMode) {
                await updateProgram({ params: payload, id: programId }).unwrap()
            } else {
                await addProgram(payload).unwrap()
            }

            toast.success(isEditMode ? "Proqram uğurla yeniləndi" : "Proqram uğurla əlavə edildi")
            onSuccess()
            onClose()

            if (!isEditMode) {
                addForm.reset()
                setImageState({ preview: null, id: null, error: null, selectedFile: null })
                setAltText("")
            }
        } catch (error) {
            toast.error("Xəta baş verdi")
            console.error("Error:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        if (!isEditMode) {
            addForm.reset()
            setImageState({ preview: null, id: null, error: null, selectedFile: null })
            setAltText("")
        }
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode ? "Proqramı Redaktə Et" : "Yeni Proqram Əlavə Et"}
                        {isEditMode && (
                            <span className="text-sm font-normal text-muted-foreground ml-2">
                                ({getLanguageDisplayName(selectedLanguage)})
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Program Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Proqram Adı *</Label>
                            <Input id="name" {...form.register("name")} placeholder="Proqram adını daxil edin" />
                            {form.formState.errors.name && (
                                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <ImageUpload
                                onImageUpload={handleImageUpload}
                                setImageState={setImageState}
                                imageState={imageState}
                                altText={altText}
                                setAltText={setAltText}
                            />
                            {form.formState.errors.image && (
                                <p className="text-sm text-red-500">{form.formState.errors.image.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Translations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Proqram Təsviri</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isEditMode ? (
                                <div className="space-y-2">
                                    <Label>Təsvir ({getLanguageDisplayName(selectedLanguage)}) *</Label>
                                    <Controller
                                        name="description"
                                        control={editForm.control}
                                        render={({ field }) => (
                                            <TinyMCE
                                                value={field.value as string}
                                                onEditorChange={(content) => {
                                                    field.onChange(content)
                                                }}
                                                apiKey={apiKey}
                                                init={{
                                                    ...editorConfig as any,
                                                    language: selectedLanguage,
                                                    placeholder: getPlaceholder(selectedLanguage),
                                                }}
                                            />
                                        )}
                                    />
                                    {editForm.formState.errors.description && (
                                        <p className="text-sm text-red-500">{editForm.formState.errors.description.message}</p>
                                    )}
                                </div>
                            ) : (
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                                        <TabsTrigger value="en">English</TabsTrigger>
                                        <TabsTrigger value="ru">Русский</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="az" className="space-y-2">
                                        <Label>Azərbaycanca Təsvir *</Label>
                                        <Controller
                                            name="translations.0.description"
                                            control={addForm.control}
                                            render={({ field }) => (
                                                <TinyMCE
                                                    value={field.value as string}
                                                    onEditorChange={(content) => {
                                                        field.onChange(content)
                                                    }}
                                                    apiKey={apiKey}
                                                    init={{
                                                        ...editorConfig as any,
                                                        language: "az",
                                                        placeholder: "Proqramın azərbaycanca təsvirini daxil edin",
                                                    }}
                                                />
                                            )}
                                        />
                                        {addForm.formState.errors.translations?.[0]?.description && (
                                            <p className="text-sm text-red-500">
                                                {addForm.formState.errors.translations[0].description.message}
                                            </p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="en" className="space-y-2">
                                        <Label>English Description *</Label>
                                        <Controller
                                            name="translations.1.description"
                                            control={addForm.control}
                                            render={({ field }) => (
                                                <TinyMCE
                                                    value={field.value as string}
                                                    onEditorChange={(content) => {
                                                        field.onChange(content)
                                                    }}
                                                    apiKey={apiKey}
                                                    init={{
                                                        ...editorConfig as any,
                                                        language: "en",
                                                        placeholder: "Enter program description in English",
                                                    }}
                                                />
                                            )}
                                        />
                                        {addForm.formState.errors.translations?.[1]?.description && (
                                            <p className="text-sm text-red-500">
                                                {addForm.formState.errors.translations[1].description.message}
                                            </p>
                                        )}
                                    </TabsContent>

                                    <TabsContent value="ru" className="space-y-2">
                                        <Label>Русское Описание *</Label>
                                        <Controller
                                            name="translations.2.description"
                                            control={addForm.control}
                                            render={({ field }) => (
                                                <TinyMCE
                                                    value={field.value as string}
                                                    onEditorChange={(content) => {
                                                        field.onChange(content)
                                                    }}
                                                    apiKey={apiKey}
                                                    init={{
                                                        ...editorConfig as any,
                                                        language: "ru",
                                                        placeholder: "Введите описание программы на русском языке",
                                                    }}
                                                />
                                            )}
                                        />
                                        {addForm.formState.errors.translations?.[2]?.description && (
                                            <p className="text-sm text-red-500">
                                                {addForm.formState.errors.translations[2].description.message}
                                            </p>
                                        )}
                                    </TabsContent>
                                </Tabs>
                            )}
                        </CardContent>
                    </Card>

                    {/* Hidden fields */}
                    <input type="hidden" {...form.register("studyArea")} />
                    {!isEditMode && (
                        <>
                            <input type="hidden" {...addForm.register("translations.0.lang")} value="az" />
                            <input type="hidden" {...addForm.register("translations.1.lang")} value="en" />
                            <input type="hidden" {...addForm.register("translations.2.lang")} value="ru" />
                        </>
                    )}

                    {/* Form Actions */}
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Ləğv Et
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Yüklənir..." : isEditMode ? "Yenilə" : "Əlavə Et"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
