import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { ProjectsForm } from "@/components/projects/add-form/add-project"

export default function ProjectsPage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Yeni layihə" text="Yeni layihə yaradın." />
                <ProjectsForm />
            </div>
        </DashboardLayout>
    )
}
