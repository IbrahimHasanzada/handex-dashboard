import { DashboardLayout } from "@/components/dashboard-layout"

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <h1 className="text-3xl font-bold">Projects Management</h1>
        <p className="text-muted-foreground">Manage your projects here.</p>

        <div className="rounded-lg border shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Projects</h2>
            <p className="text-muted-foreground">Your projects content will appear here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
