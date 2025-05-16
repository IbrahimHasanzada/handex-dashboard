"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AddSectionModal } from "@/components/about/add-section-modal"
import { CheckCircle2, Plus } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false)

  return (
    <DashboardLayout>
      <div className="mx-auto p-6">
        <div className="pb-6 flex justify-end">
          <Button onClick={() => setIsAddSectionModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Yeni bölmə əlavə et
          </Button>
        </div>

        {/* Top Photo Collage */}
        <div className="mb-12 relative h-64 sm:h-80">
          <div className="absolute top-0 left-0 w-1/3 h-full p-1">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image src="/placeholder.svg?height=300&width=400" alt="Team photo 1" fill className="object-cover" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-2/3 h-1/2 p-1">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image src="/placeholder.svg?height=300&width=600" alt="Team photo 2" fill className="object-cover" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-1/3 h-1/2 p-1">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image src="/placeholder.svg?height=150&width=300" alt="Team photo 3" fill className="object-cover" />
            </div>
          </div>
          <div className="absolute bottom-0 right-1/3 w-1/3 h-1/2 p-1">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image src="/placeholder.svg?height=150&width=300" alt="Team photo 4" fill className="object-cover" />
            </div>
          </div>
        </div>

        {/* Who We Are & History Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 border-t border-b border-dashed border-gray-200 py-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Who We Are?</h2>
            <p className="text-gray-600 mb-4">
              Founded in 2021, our company specializes in providing technical and analytical solutions to data analytics
              challenges. We focus on developing analytical tools and technologies to ensure optimal decision-making
              processes.
            </p>
            <p className="text-gray-600">
              Our team consists of experienced professionals with diverse backgrounds in data science, engineering, and
              business analytics. We are committed to delivering innovative solutions that help businesses transform
              their data into actionable insights.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our History</h2>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet consectetur. Ut amet in urna amet tincidunt gravida. Ut urna porttitor ligero
              malesuada. Neque elit tellus toreet risus hendrerit elit gravida vestibulum. Mi non et fusce congue amet
              gravida malesuadt.
            </p>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur. Gravida pellentesque viverra malesuada imperdiet. Eu varius
              bibendum mi in consequat amet gravida vestibulum hendrerit elit gravida.
            </p>
          </div>
        </div>

        {/* Our Mission Section */}
        <div className="mb-12 border-b border-dashed border-gray-200 py-8">
          <h2 className="text-2xl font-bold mb-6">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet consectetur. Ut amet in urna amet tincidunt gravida. Ut urna porttitor ligero
                malesuada. Neque elit tellus toreet risus hendrerit elit gravida vestibulum. Mi non et fusce congue amet
                gravida malesuadt.
              </p>
              <p className="text-gray-600 mb-6">
                Lorem ipsum dolor sit amet consectetur. Gravida pellentesque viverra malesuada imperdiet. Eu varius
                bibendum mi in.
              </p>
              <ul className="space-y-2">
                {[
                  "Laoreet sagittis semper mattis at platea adipiscing morbi.",
                  "Laoreet sagittis semper mattis at platea adipiscing morbi.",
                  "Laoreet sagittis semper mattis at platea adipiscing morbi.",
                  "Laoreet sagittis semper mattis at platea adipiscing morbi.",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Data analysis presentation"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Team with certificate"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Our Values</h2>
            <p className="text-gray-600 mb-4">
              Lorem ipsum dolor sit amet consectetur. Ut amet in urna amet tincidunt gravida. Ut urna porttitor ligero
              malesuada. Neque elit tellus toreet risus hendrerit elit gravida vestibulum. Mi non et fusce congue amet
              gravida malesuadt.
            </p>
            <p className="text-gray-600 mb-6">
              Lorem ipsum dolor sit amet consectetur. Gravida pellentesque viverra malesuada imperdiet. Eu varius
              bibendum mi in.
            </p>
            <ul className="space-y-2">
              {[
                "Laoreet sagittis semper mattis at platea adipiscing morbi.",
                "Laoreet sagittis semper mattis at platea adipiscing morbi.",
                "Laoreet sagittis semper mattis at platea adipiscing morbi.",
                "Laoreet sagittis semper mattis at platea adipiscing morbi.",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Add Section Modal */}
      <AddSectionModal open={isAddSectionModalOpen} onOpenChange={setIsAddSectionModalOpen} />
    </DashboardLayout>
  )
}
