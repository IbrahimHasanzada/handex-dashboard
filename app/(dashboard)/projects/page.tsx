import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { ProjectsTable } from "@/components/projects/projects-table"


export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <GeneralHeader heading="Layihələr" text="Layihələri və məzmununlarını idarə edin." />
        <ProjectsTable />
      </div>
    </DashboardLayout>
  )
}
