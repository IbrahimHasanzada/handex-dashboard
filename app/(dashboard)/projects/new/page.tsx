import { DashboardLayout } from "@/components/dashboard-layout"
import { ProjectsHeader } from "@/components/projects/projects-header"
import { ProjectsForm } from "@/components/projects/add-projects"

export default function ProjectsPage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <ProjectsHeader heading="Yeni xidmət" text="Yeni xidmət yaradın." />
                <ProjectsForm />
            </div>
        </DashboardLayout>
    )
}
