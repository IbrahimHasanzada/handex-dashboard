import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { ArticlesTable } from "@/components/news/news-table"


export default function ArticlesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <GeneralHeader heading="Xəbərlər" text="Xəbərləri və məzmununlarını idarə edin." />
        <ArticlesTable />
      </div>
    </DashboardLayout>
  )
}
