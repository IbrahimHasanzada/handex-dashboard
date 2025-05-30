"use client"

import { CourseList } from "@/components/study-area/course-list"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function page() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Tədris Sahələri</h1>
            <p className="text-muted-foreground">Kurs kateqoriyalarını və məzmununu idarə edin</p>
          </div>
        </div>


        <CourseList />

      </div>
    </DashboardLayout>
  )
}
