import { DashboardLayout } from "@/components/dashboard-layout"
import { NewsForm } from "@/components/news/add-form/add-news"
import { NewsHeader } from "@/components/news/news-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditNewsPage({ params }: { params: { slug: string } }) {
    return (
        <DashboardLayout>
            <div className="p-6">
                <NewsHeader heading="Xəbəri redaktə edin" text="Xəbərdə dəyişikliklər edin." />
                <div className="my-5">
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/news">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Xəbərlərə qayıt
                        </Link>
                    </Button>
                </div>
                <NewsForm slug={params.slug} />
            </div>
        </DashboardLayout>
    )
}
