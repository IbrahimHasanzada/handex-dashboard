import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceHeader } from "@/components/service/service-header"
import { ServiceTable } from "@/components/service/service-table"
import { ServiceTableFilters } from "@/components/service/service-table-filter"


export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ServiceHeader heading="Xidmətlər" text="Xidmətləri və məzmununlarını idarə edin.">
          <ServiceTableFilters />
        </ServiceHeader>
        <ServiceTable />
      </div>
    </DashboardLayout>
  )
}
