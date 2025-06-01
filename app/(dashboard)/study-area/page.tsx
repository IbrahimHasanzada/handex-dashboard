"use client"

import { CourseList } from "@/components/study-area/course-list"
import { DashboardLayout } from "@/components/dashboard-layout"
import Instructors from "@/components/study-area/teachers/instructors"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Language = "az" | "en" | "ru"
export default function page() {

  const [selectedLanguage, setSelectedLanguage] = useState<Language>("az")
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tədris Sahələri</h1>
            <p className="text-muted-foreground">Kurs kateqoriyalarını və məzmununu idarə edin</p>
          </div>
        </div>

        <div>


          <Tabs className="mb-5" value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as Language)}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="az" className="flex items-center gap-2">
                Azərbaycanca
              </TabsTrigger>
              <TabsTrigger value="en" className="flex items-center gap-2">
                English
              </TabsTrigger>
              <TabsTrigger value="ru" className="flex items-center gap-2">
                Русский
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Instructors
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage} />
        </div>

        <div>
          <CourseList
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage} />
        </div>

      </div>
    </DashboardLayout>
  )
}
