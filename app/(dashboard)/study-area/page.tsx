"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { CourseOverview } from "@/components/study-area/course-overiew"
import { CourseList } from "@/components/study-area/course-list"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function page() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tədris Sahələri</h1>
            <p className="text-muted-foreground">Kurs kateqoriyalarını və məzmununu idarə edin</p>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="overview">Ümumi Baxış</TabsTrigger>
            <TabsTrigger value="courses">Kurslar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <CourseOverview />
          </TabsContent>

          <TabsContent value="courses">
            <CourseList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
