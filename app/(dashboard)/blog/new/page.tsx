"use client"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BlogsForm } from "@/components/blog/add-form/add-blog"
import { GeneralHeader } from "@/components/general-header"

export default function NewArticlePage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Yeni Bloq" text="Yeni Bloq yaradın." />
                <BlogsForm />
            </div>
        </DashboardLayout>
    )
}
