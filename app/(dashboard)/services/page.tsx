import { DashboardLayout } from "@/components/dashboard-layout"

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 p-4 md:p-8">
        <h1 className="text-3xl font-bold">Services Management</h1>
        <p className="text-muted-foreground">Manage your services here.</p>

        <div className="rounded-lg border shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <p className="text-muted-foreground">Your services content will appear here.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
