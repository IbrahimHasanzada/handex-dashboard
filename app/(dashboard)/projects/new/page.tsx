import { DashboardLayout } from "@/components/dashboard-layout"
import { ProjectsForm } from "@/components/projects/add-form/add-project"
import { ProjectsHeader } from "@/components/projects/projects-header"

export default function ProjectsPage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <ProjectsHeader heading="Yeni layihə" text="Yeni layihə yaradın." />
                <ProjectsForm />
            </div>
        </DashboardLayout>
    )
}
