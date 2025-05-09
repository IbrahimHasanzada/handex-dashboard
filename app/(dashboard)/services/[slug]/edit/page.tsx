import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceForm } from "@/components/service/add-service"
import { ServiceHeader } from "@/components/service/service-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditServicePage({ params }: { params: { slug: string } }) {
    return (
        <DashboardLayout>
            <div className="p-6">
                <ServiceHeader heading="Xidməti redaktə edin" text="Xidmətdə dəyişikliklər edin." />
                <div className="my-5">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/services">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Xidmətlərə qayıt
                        </Link>
                    </Button>
                </div>
                <ServiceForm slug={params.slug} />
            </div>
        </DashboardLayout>
    )
}
