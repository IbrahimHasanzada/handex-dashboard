import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { ServiceForm } from "@/components/service/add-form/add-service"

export default function ServicesPage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Yeni xidmət" text="Yeni xidmət yaradın." />
                <ServiceForm />
            </div>
        </DashboardLayout>
    )
}
