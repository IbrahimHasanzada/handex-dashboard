import { DashboardLayout } from "@/components/dashboard-layout"
import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsTable } from "@/components/projects/projects-table"
import { ProjectsTableFilters } from "@/components/projects/projects-table-filter"


export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <ProjectsHeader heading="Layihələr" text="Layihələri və məzmununlarını idarə edin.">
          <ProjectsTableFilters />
        </ProjectsHeader>
        <ProjectsTable />
      </div>
    </DashboardLayout>
  )
}
