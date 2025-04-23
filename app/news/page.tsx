import { DashboardLayout } from "@/components/dashboard-layout"
import { NewsHeader } from "@/components/news/news-header"
import { ArticlesTable } from "@/components/news/news-table"
import { NewsTableFilters } from "@/components/news/news-table-filter"


export default function ArticlesPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <NewsHeader heading="Xəbərlər" text="Xəbərlərinizi və məzmununlarını idarə edin.">
          <NewsTableFilters />
        </NewsHeader>
        <ArticlesTable />
      </div>
    </DashboardLayout>
  )
}
