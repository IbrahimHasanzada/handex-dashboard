import { DashboardLayout } from "@/components/dashboard-layout"
import { NewsForm } from "@/components/news/add-form/add-news"
import { NewsHeader } from "@/components/news/news-header"

export default function NewArticlePage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <NewsHeader heading="Yeni xəbər" text="Yeni xəbər yaradın." />
                <NewsForm />
            </div>
        </DashboardLayout>
    )
}
