import { DashboardLayout } from "@/components/dashboard-layout"
import { BlogsHeader } from "@/components/blog/blog-header"
import { BlogsForm } from "@/components/blog/add-form/add-blog"

export default function NewArticlePage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <BlogsHeader heading="Yeni Bloq" text="Yeni Bloq yaradın." />
                <BlogsForm />
            </div>
        </DashboardLayout>
    )
}
