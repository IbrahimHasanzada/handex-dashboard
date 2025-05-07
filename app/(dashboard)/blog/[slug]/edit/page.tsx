import { BlogsForm } from "@/components/blog/add-blog"
import { BlogsHeader } from "@/components/blog/blog-header"
import { DashboardLayout } from "@/components/dashboard-layout"

export default async function EditBlogsPage({ params }: { params: { slug: string } }) {
    return (
        <DashboardLayout>
            <div className="p-6">
                <BlogsHeader heading="Edit Article" text="Make changes to your article." />
                <BlogsForm slug={params.slug} />
            </div>
        </DashboardLayout>
    )
}
