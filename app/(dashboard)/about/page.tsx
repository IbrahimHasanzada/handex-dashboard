"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { SectionModal } from "@/components/about/add-section-modal"
import { AddImageModal } from "@/components/about/add-image-modal"
import { Box, CheckCircle2, Edit, Loader2, Plus, Trash } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useDeleteSectionsMutation, useGetAboutQuery, useUpdateAboutMutation } from "@/store/handexApi"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { MetaTranslations } from "@/components/meta/meta"

export default function AboutPage() {
  const [currentLanguage, setCurrentLanguage] = useState<string>("az")
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false)
  const [isEditSectionModalOpen, setIsEditSectionModalOpen] = useState(false)
  const [editedData, setEditedData] = useState()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [imageIds, setImageIds] = useState()
  const { data: aboutData, isLoading, refetch } = useGetAboutQuery(currentLanguage)
  const [deleteSection, { isLoading: deleteLoading }] = useDeleteSectionsMutation()
  const [delImageAbout, { isLoading: imageLoading }] = useUpdateAboutMutation()


  const handleDeleteSection = async (id: number) => {
    try {
      showDeleteConfirmation(deleteSection, id, refetch, {
        title: "Bölməni silmək istəyirsinizmi?",
        text: "Bu əməliyyat geri qaytarıla bilməz!",
        successText: "Bölmə uğurla silindi.",
      })
    } catch (error: any) {
      toast.error("Məlumatı silərkən xəta baş verdi", error.message)
    }
  }

  useEffect(() => {
    setImageIds(aboutData?.[0].images.map((item: any) => item.id))
  }, [aboutData])

  const handleEditData = (item: any) => {
    setEditedData(item)
    setIsEditSectionModalOpen(true)
  }

  const handleDeleteImage = async (id: number) => {
    let deletedImagesId = aboutData[0].images
      .filter((item: any) => item.id !== id)
      .map((item: any) => item.id)
    try {
      await delImageAbout({ images: deletedImagesId }).unwrap()
      refetch()
      toast.success("Şəkil uğurla silindi")
    } catch (error: any) {
      toast.error("Şəkil silərkən xəta baş verdi", error.data.message)
    }
  }
  console.log(aboutData?.[0].images)
  return (
    <DashboardLayout>
      <div className="mx-auto p-6">
        <div className="pb-6 flex justify-end flex-col sm:flex-row gap-5">
          <Button onClick={() => setIsAddSectionModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Yeni bölmə əlavə et
          </Button>
          <Button onClick={() => setIsImageModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Yeni şəkil əlavə et
          </Button>
        </div>

        <Tabs value={currentLanguage} onValueChange={(language: string) => setCurrentLanguage(language)} className="mb-4">
          <TabsList>
            <TabsTrigger value="az">AZ</TabsTrigger>
            <TabsTrigger value="en">EN</TabsTrigger>
            <TabsTrigger value="ru">RU</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading ?
          <div className="w-full flex justify-center items-center">
            <Loader2 className="w-10 h-10  animate-spin" />
          </div>
          :
          <div>
            {/* Top Photo Collage */}
            <div className="mb-12 grid grid-cols-3 lg:grid-cols-4 lg:grid-rows-2 gap-5 relative  h-64 sm:h-80">
              {
                !aboutData?.[0].images.length ?
                  <div>
                    <Box />
                    Əlavə edilmiş şəkil yoxdur
                  </div>
                  :
                  aboutData?.[0].images.map((item: any, index: any) => (
                    <div key={index} className=" p-1">
                      <div className="relative h-full w-full overflow-hidden rounded-lg">
                        <div className="absolute z-[2] right-0">
                          <Button onClick={() => handleDeleteImage(item.id)}>
                            <Trash />
                          </Button>
                        </div>
                        <Image
                          src={item.url ? item.url : '/placeholder.svg?height=300&width=400'}
                          alt={item.alt ?? "Team photo 1"}
                          fill
                          className="object-contain" />
                      </div>
                    </div>
                  ))}
            </div>

            {/* Our Mission Section */}
            <div className="mb-12 flex flex-col gap-10 border-b border-dashed border-gray-200 py-8">
              {aboutData[0].sections.map((item: any, index: number) => (
                <div key={index}>
                  <div className="mb-5 flex justify-end gap-5">
                    <div>
                      <Button onClick={() => handleEditData(item)}>Redaktə et <Edit /></Button>
                    </div>
                    <div>
                      <Button onClick={() => handleDeleteSection(item.id)}>Sil <Trash /></Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {item.left_side.type == "text"
                      ?
                      <div dangerouslySetInnerHTML={{ __html: item.left_side.translations[0].value }}></div>
                      :
                      <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden">
                        <Image
                          src={item.left_side.url ? item.left_side.url : `/placeholder.svg?height=400&width=600`}
                          alt="Data analysis presentation"
                          fill
                          className="object-cover"
                        />
                      </div>
                    }
                    {item.right_side.type == "text"
                      ?
                      <div dangerouslySetInnerHTML={{ __html: item.right_side.translations[0].value }}></div>
                      :
                      <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden">
                        <Image
                          src={item.left_side.url ? item.left_side.url : `/placeholder.svg?height=400&width=600`}
                          alt="Data analysis presentation"
                          fill
                          className="object-cover"
                        />
                      </div>
                    }
                  </div>
                </div>
              ))}
            </div>
            <MetaTranslations slug="about" />
          </div>

        }
      </div>

      {/* Add or Edit Modal Sections */}
      {isAddSectionModalOpen ?
        <SectionModal open={isAddSectionModalOpen} onOpenChange={setIsAddSectionModalOpen} edit={false} data={!isLoading && editedData} refetch={refetch} />
        :
        <SectionModal open={isEditSectionModalOpen} onOpenChange={setIsEditSectionModalOpen} edit={true} data={!isLoading && editedData} refetch={refetch} />
      }

      {/* Add İmage Modal */}
      <AddImageModal open={isImageModalOpen} onOpenChange={setIsImageModalOpen} refetch={refetch} data={imageIds} />
    </DashboardLayout >
  )
}
