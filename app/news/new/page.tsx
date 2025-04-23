import { DashboardLayout } from "@/components/dashboard-layout"
import { NewsHeader } from "@/components/news/news-header"
import { NewsForm } from "@/components/news/add-news"

export default function NewArticlePage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <NewsHeader heading="New Article" text="Create a new article for your news site." />
                <NewsForm />
            </div>
        </DashboardLayout>
    )
}
