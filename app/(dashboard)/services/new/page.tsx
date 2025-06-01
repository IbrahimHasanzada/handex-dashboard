import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceForm } from "@/components/service/add-form/add-service"
import { ServiceHeader } from "@/components/service/service-header"

export default function ServicesPage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <ServiceHeader heading="Yeni xidmət" text="Yeni xidmət yaradın." />
                <ServiceForm />
            </div>
        </DashboardLayout>
    )
}
