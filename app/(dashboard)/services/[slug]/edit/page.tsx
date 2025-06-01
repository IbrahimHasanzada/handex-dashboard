import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceForm } from "@/components/service/add-form/add-service"
import { ServiceHeader } from "@/components/service/service-header"

export default function EditServicePage({ params }: { params: { slug: string } }) {
    return (
        <DashboardLayout>
            <div className="p-6">
                <ServiceHeader heading="Xidməti redaktə edin" text="Xidmətdə dəyişikliklər edin." />
                <ServiceForm slug={params.slug} />
            </div>
        </DashboardLayout>
    )
}
