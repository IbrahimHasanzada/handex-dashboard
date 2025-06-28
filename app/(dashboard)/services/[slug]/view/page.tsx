"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { ViewService } from "@/components/service/view-service"
import { useRouter, usePathname, useParams } from "next/navigation"
import React from "react"

export default async function ViewServicesPage() {
    const router = useRouter()
    const params = useParams()
    const slug = await params.slug

    const handleEdit = () => {
        router.push(`/services/${slug}/edit`)
    }

    const handleDelete = () => {
        router.push("/services")
    }
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Xidmətə baxın" text="Xidmət detallarına baxın və idarə edin." />
                <ViewService slug={slug} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </DashboardLayout>
    )
}