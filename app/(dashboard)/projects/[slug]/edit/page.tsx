import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { ProjectsForm } from "@/components/projects/add-form/add-project"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditProjectsPage({ params }: { params: { slug: string } }) {
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Layihələri redaktə edin" text="Layihədə dəyişikliklər edin." />
                <div className="my-5">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Layihələrə qayıt
                        </Link>
                    </Button>
                </div>
                <ProjectsForm slug={await params.slug} />
            </div>
        </DashboardLayout>
    )
}
