import { DashboardLayout } from "@/components/dashboard-layout"
import { RedirectManager } from "@/components/redirect/redirect-manager"

export default function Page() {
    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 text-gray-900">301 Redirect Manager</h1>
                <p className="text-gray-600 mb-8">Configure permanent redirects for SEO optimization</p>
                <RedirectManager />
            </div>
        </DashboardLayout>
    )
}
