"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save } from "lucide-react"
import { Form } from "@/components/ui/form"
import { useEditSectionsMutation, useUploadFileMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import Side from '@/components/about/section-sides'
import { validateImage } from "@/validations/upload.validation"
export default function EditSection({ onComplete, edit, data, refetch }) {
    const [editSection, { isLoading }] = useEditSectionsMutation()
    const [uploadImage, { isLoading: upLoading }] = useUploadFileMutation()
    const [imageStates, setImageStates] = useState({
        left: { preview: null, id: null, error: null, selectedFile: null },
        right: { preview: null, id: null, error: null, selectedFile: null },
    })
    const form = useForm({
        defaultValues: {
            left_side: {
                type: data?.left_side.type,
                translations: [
                    { value: data?.left_side.translations?.[0]?.value, lang: data?.left_side.translations?.[0]?.lang },
                ],
                url: data?.left_side.url && data?.left_side.url,
            },
            right_side: {
                type: data?.right_side.type,
                translations: [
                    { value: data?.right_side.translations?.[0]?.value, lang: data?.right_side.translations?.[0]?.lang },
                ],
                url: data?.right_side.url && data?.right_side.url,
            },
        },
    })

    const { control, handleSubmit, watch, setValue } = form

    useEffect(() => {
        const formValues = form.getValues()
        setImageStates({
            left: {
                preview: formValues.left_side.url || null,
                id: null,
                error: null,
            },
            right: {
                preview: formValues.right_side.url || null,
                id: null,
                error: null,
            },
        })
    }, [data, form])
    const onSubmit = async (editedData) => {
        try {
            const processedData = {
                left_side: {
                    type: editedData.left_side.type,
                    ...(editedData.left_side.type === "text"
                        ? {
                            translations: editedData.left_side.translations,
                        }
                        : {}),
                    ...(editedData.left_side.type === "image"
                        ? {
                            url: editedData.left_side.url,
                        }
                        : {}),
                },
                right_side: {
                    type: editedData.right_side.type,
                    ...(editedData.right_side.type === "text"
                        ? {
                            translations: editedData.right_side.translations,
                        }
                        : {}),
                    ...(editedData.right_side.type === "image"
                        ? {
                            url: editedData.right_side.url,
                        }
                        : {}),
                },
            }

            await editSection({ params: processedData, id: data.id }).unwrap()
            refetch()
            toast.success("Bölmə uğurla əlavə edildi")

            if (onComplete) {
                onComplete()
            }
        } catch (error) {
            toast.error("Bölmə əlavə edilərkən xəta baş verdi", error?.message?.map(item => item).join(','))
        }
    }


    const handleImageChange = (side) => (e) => {
        const files = e.target.files

        if (!files || files.length === 0) {
            setImageStates((prev) => ({
                ...prev,
                [side]: { ...prev[side], error: "No file selected" },
            }))
            return
        }

        const file = files[0]
        const validitonFile = validateImage(file)
        if (validitonFile == false) return
        setImageStates((prev) => ({
            ...prev,
            [side]: {
                ...prev[side],
                preview: URL.createObjectURL(file),
                selectedFile: file,
            },
        }))

        if (form.getValues(`${side}ImageAlt`) === undefined) {
            form.setValue(`${side}ImageAlt`, "")
        }
    }

    const handleUploadWithAltText = async (file, altText, side) => {
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", altText)
            const response = await uploadImage(formData).unwrap()
            setImageStates((prev) => ({
                ...prev,
                [side]: {
                    preview: response.url,
                    id: response.id,
                    error: null,
                },
            }))

            setValue(`${side}_side.url`, response.url)
            toast.success("Şəkil uğurla əlavə edildi")
        } catch (error) {
            toast.error("Şəkil yükləyərkən xəta baş vedi", error.message)
        }
    }

    const leftSideType = watch("left_side.type")
    const rightSideType = watch("right_side.type")
    return (
        <div className="p-6">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Card className="relative border-0 shadow-none">
                        <CardContent className="p-0">
                            <Tabs defaultValue="left" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="left">Left Side</TabsTrigger>
                                    <TabsTrigger value="right">Right Side</TabsTrigger>
                                </TabsList>

                                <Side
                                    form={form}
                                    control={control}
                                    side="left"
                                    contentType={leftSideType}
                                    imageStates={imageStates}
                                    setImageStates={setImageStates}
                                    handleImageChange={handleImageChange}
                                    handleUploadWithAltText={(file, altText) => handleUploadWithAltText(file, altText, "left")}
                                    upLoading={upLoading}
                                    edit={edit}
                                    data={data}
                                />

                                <Side
                                    form={form}
                                    control={control}
                                    side="right"
                                    contentType={rightSideType}
                                    imageStates={imageStates}
                                    setImageStates={setImageStates}
                                    handleImageChange={handleImageChange}
                                    handleUploadWithAltText={(file, altText) => handleUploadWithAltText(file, altText, "right")}
                                    upLoading={upLoading}
                                    edit={edit}
                                    data={data}
                                />
                            </Tabs>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end mt-6">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Section"}
                            <Save className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
