"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useDispatch } from "react-redux"

export default function BlogPage() {

  const dispatch = useDispatch()


  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <p className="text-muted-foreground">Manage your blog posts here.</p>

        <div className="rounded-lg border shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Blog Posts</h2>
            <p className="text-muted-foreground">Your blog content will appear here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
