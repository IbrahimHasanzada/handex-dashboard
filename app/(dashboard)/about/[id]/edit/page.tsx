"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save } from "lucide-react"
import { Form } from "@/components/ui/form"
import { useEditSectionsMutation, useUploadFileMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import Side from '@/components/about/section-sides'
import { validateImage } from "@/validations/upload.validation"
import { useParams, useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
export default function EditSection() {
  const { id } = useParams()
  const [editSection, { isLoading }] = useEditSectionsMutation()
  const [uploadImage, { isLoading: upLoading }] = useUploadFileMutation()
  const [imageStates, setImageStates] = useState({
    left: { preview: null, id: null, error: null, selectedFile: null },
    right: { preview: null, id: null, error: null, selectedFile: null },
  })
  const router = useRouter()
  const about = useSelector((store: any) => store.about.data)
  const data = about[0]
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
      } as any,
      right: {
        preview: formValues.right_side.url || null,
        id: null,
        error: null,
      } as any,
    })
  }, [data, form])
  const onSubmit = async (editedData: any) => {
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
      toast.success("Bölmə uğurla əlavə edildi")
      router.push('/about')


    } catch (error: any) {
      toast.error("Bölmə əlavə edilərkən xəta baş verdi", error?.message?.map((item: any) => item).join(',') as any)
    }
  }


  const handleImageChange = (side: any) => (e: any) => {
    const files = e.target.files

    if (!files || files.length === 0) {
      setImageStates((prev: any) => ({
        ...prev,
        [side]: { ...prev[side], error: "No file selected" },
      }))
      return
    }

    const file = files[0]
    const validitonFile = validateImage(file, imageStates, setImageStates)
    if (validitonFile == false) return
    setImageStates((prev: any) => ({
      ...prev,
      [side]: {
        ...prev[side],
        preview: URL.createObjectURL(file),
        selectedFile: file,
      },
    }))

    if (form.getValues(`${side}ImageAlt` as any) === undefined) {
      form.setValue(`${side}ImageAlt` as any, "")
    }
  }

  const handleUploadWithAltText = async (file: any, altText: any, side: any) => {
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

      setValue(`${side}_side.url` as any, response.url)
      toast.success("Şəkil uğurla əlavə edildi")
    } catch (error: any) {
      toast.error("Şəkil yükləyərkən xəta baş vedi", error.message)
    }
  }

  const leftSideType = watch("left_side.type")
  const rightSideType = watch("right_side.type")
  return (
    <DashboardLayout >
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
                    handleUploadWithAltText={(file: any, altText: any) => handleUploadWithAltText(file, altText, "left")}
                    upLoading={upLoading}
                    edit={true}
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
                    handleUploadWithAltText={(file: any, altText: any) => handleUploadWithAltText(file, altText, "right")}
                    upLoading={upLoading}
                    edit={true}
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
    </DashboardLayout>
  )
}
