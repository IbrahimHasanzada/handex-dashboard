import { DashboardLayout } from "@/components/dashboard-layout"

export default function NewsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <h1 className="text-3xl font-bold">News Management</h1>
        <p className="text-muted-foreground">Manage your news articles here.</p>

        <div className="rounded-lg border shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">News Articles</h2>
            <p className="text-muted-foreground">Your news content will appear here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
