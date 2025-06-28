import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { NewsForm } from "@/components/news/add-form/add-news"

export default function NewArticlePage() {
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Yeni xəbər" text="Yeni xəbər yaradın." />
                <NewsForm />
            </div>
        </DashboardLayout>
    )
}
