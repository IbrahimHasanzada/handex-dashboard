import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { NewsForm } from "@/components/news/add-form/add-news"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditNewsPage({ params }: { params: { slug: string } }) {
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Xəbəri redaktə edin" text="Xəbərdə dəyişikliklər edin." />
                <div className="my-5">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/news">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Xəbərlərə qayıt
                        </Link>
                    </Button>
                </div>
                <NewsForm slug={await params.slug} />
            </div>
        </DashboardLayout>
    )
}
