"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AddSectionModal } from "@/components/about/add-section-modal"
import { AddImageModal } from "@/components/about/add-image-modal"
import { CheckCircle2, Loader2, Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useGetAboutQuery } from "@/store/handexApi"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AboutPage() {
  const [currentLanguage, setCurrentLanguage] = useState<string>("az")
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const { data: aboutData, isLoading } = useGetAboutQuery(currentLanguage)
  console.log(aboutData)
  return (
    <DashboardLayout>
      <div className="mx-auto p-6">
        <div className="pb-6 flex justify-end gap-5">
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
            <div className="mb-12 grid grid-cols-3 relative h-64 sm:h-80">
              {aboutData?.[0].images.map((item: any, index: any) => (
                <div key={index} className=" w-full h-full p-1">
                  <div className="relative h-full w-full overflow-hidden rounded-lg">
                    <Image src={item.url ? item.url : '/placeholder.svg?height=300&width=400'} alt="Team photo 1" fill className="object-cover" />
                  </div>
                </div>
              ))}
            </div>

            {/* Our Mission Section */}
            <div className="mb-12 flex flex-col gap-10 border-b border-dashed border-gray-200 py-8">
              {aboutData[0].sections.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              ))}
            </div>
          </div>

        }
      </div>

      {/* Add Section Modal */}
      <AddSectionModal open={isAddSectionModalOpen} onOpenChange={setIsAddSectionModalOpen} />

      {/* Add İmage Modal */}
      <AddImageModal open={isImageModalOpen} onOpenChange={setIsImageModalOpen} />
    </DashboardLayout >
  )
}
