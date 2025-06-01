import { BlogsForm } from "@/components/blog/add-form/add-blog"
import { BlogsHeader } from "@/components/blog/blog-header"
import { DashboardLayout } from "@/components/dashboard-layout"

export default async function EditBlogsPage({ params }: { params: { slug: string } }) {
    return (
        <DashboardLayout>
            <div className="p-6">
                <BlogsHeader heading="Bloqu Redaktə et" text="Bloqda dəyişikliklər edin." />
                <BlogsForm slug={params.slug} />
            </div>
        </DashboardLayout>
    )
}
