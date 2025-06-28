import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { ServiceTable } from "@/components/service/service-table"


export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <GeneralHeader heading="Xidmətlər" text="Xidmətləri və məzmununlarını idarə edin." />
        <ServiceTable />
      </div>
    </DashboardLayout>
  )
}
