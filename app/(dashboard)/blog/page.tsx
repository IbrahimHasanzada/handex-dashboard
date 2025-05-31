"use client"
import { BlogsHeader } from "@/components/blog/blog-header"
import { BlogsTableFilters } from "@/components/blog/blog-table-filter"
import { BlogsTable } from "@/components/blog/blogs-table"
import { DashboardLayout } from "@/components/dashboard-layout"


export default function BlogsPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <BlogsHeader heading="Bloqlar" text="Bloqları və məzmununlarını idarə edin.">
          <BlogsTableFilters />
        </BlogsHeader>
        <BlogsTable />
      </div>
    </DashboardLayout>
  )
}
