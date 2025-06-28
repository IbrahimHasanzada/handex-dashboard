import { BlogsForm } from "@/components/blog/add-form/add-blog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"

export default async function EditBlogsPage({ params }: { params: { slug: string } }) {
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Bloqu Redaktə et" text="Bloqda dəyişikliklər edin." />
                <BlogsForm slug={await params.slug} />
            </div>
        </DashboardLayout>
    )
}
