"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowBigLeft, ArrowLeft, Save } from "lucide-react"
import { Form } from "@/components/ui/form"
import { useAddSectionAboutMutation, useUploadFileMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import Side from "@/components/about/section-sides"
import { validateImage } from "@/validations/upload.validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { defaultValuesSchema } from "@/validations/about/section-about"
import { renderFormErrors } from "@/utils/render-error-about"
import { useRouter } from "next/navigation"
import { Arrow } from "@radix-ui/react-tooltip"
import Link from "next/link"
export default function AddSection({ onComplete, edit, refetch }) {
    const apiKey = process.env.NEXT_PUBLIC_EDITOR_API_KEY
    const [saving, setSaving] = useState(false)
    const [addSection, { isLoading }] = useAddSectionAboutMutation()
    const [uploadImage, { isLoading: upLoading }] = useUploadFileMutation()
    const [imageStates, setImageStates] = useState({
        left: { preview: null, id: null, error: null, selectedFile: null },
        right: { preview: null, id: null, error: null, selectedFile: null },
    })
    const router = useRouter()

    const form = useForm({
        defaultValues: {
            left_side: {
                type: "text",
                translations: [
                    { value: "", lang: "az" },
                    { value: "", lang: "en" },
                    { value: "", lang: "ru" },
                ],
                url: "",
            },
            right_side: {
                type: "text",
                translations: [
                    { value: "", lang: "az" },
                    { value: "", lang: "en" },
                    { value: "", lang: "ru" },
                ],
                url: "",
            },
        },
        resolver: zodResolver(defaultValuesSchema)

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
    }, [form])

    const onSubmit = async (data) => {
        setSaving(true)
        try {
            const processedData = {
                left_side: {
                    type: data.left_side.type,
                    ...(data.left_side.type === "text"
                        ? {
                            translations: data.left_side.translations,
                        }
                        : {}),
                    ...(data.left_side.type === "image"
                        ? {
                            url: data.left_side.url,
                        }
                        : {}),
                },
                right_side: {
                    type: data.right_side.type,
                    ...(data.right_side.type === "text"
                        ? {
                            translations: data.right_side.translations,
                        }
                        : {}),
                    ...(data.right_side.type === "image"
                        ? {
                            url: data.right_side.url,
                        }
                        : {}),
                },
            }
            await addSection(processedData).unwrap()
            refetch()
            router.push('/about')

            toast.success("Bölmə uğurla əlavə edildi")

            if (onComplete) {
                onComplete()
            }
        } catch (error) {
            toast.success("Bölmə əlavə edilərkən xəta baş verdi", error.message)
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
            <Button className="mb-5" variant="outline" size="sm" asChild>
                <Link href="/about">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Əvvələ qayıt
                </Link>
            </Button>
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
                                    apiKey={apiKey}
                                    upLoading={upLoading}
                                    edit={edit}
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
                                    apiKey={apiKey}
                                    upLoading={upLoading}
                                    edit={edit}
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
            {/* Debug information - remove in production */}
            <div className="mt-4 p-4 bg-gray-100 rounded text-xs">
                <p>
                    <strong>Form Valid:</strong> {form.formState.isValid ? "Yes" : "No"}
                </p>
                <p>
                    <strong>Errors:</strong> {Object.keys(form.formState.errors).length}
                </p>

                {Object.keys(form.formState.errors).length > 0 && (
                    <div className="mt-4">
                        <strong className="text-red-600">Form Errors:</strong>
                        <div className="mt-2 space-y-1">
                            {renderFormErrors(form.formState.errors)}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}
