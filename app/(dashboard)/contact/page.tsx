import ContactManager from "@/components/contact/contact-manager";
import ContactPage from "@/components/contact/contact-page";
import { DashboardLayout } from "@/components/dashboard-layout";

export default function Page() {
    return (
        <DashboardLayout>
            <ContactManager />
            <ContactPage />
        </DashboardLayout>
    )
}
