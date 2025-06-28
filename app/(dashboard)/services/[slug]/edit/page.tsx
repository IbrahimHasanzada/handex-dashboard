import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { ServiceForm } from "@/components/service/add-form/add-service"

export default async function EditServicePage({ params }: { params: { slug: string } }) {
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Xidməti redaktə edin" text="Xidmətdə dəyişikliklər edin." />
                <ServiceForm slug={await params.slug} />
            </div>
        </DashboardLayout>
    )
}
