"use client"
import { BlogsTable } from "@/components/blog/blogs-table"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"


export default function BlogsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <GeneralHeader heading="Bloqlar" text="Bloqları və məzmununlarını idarə edin." />
        <BlogsTable />
      </div>
    </DashboardLayout>
  )
}
