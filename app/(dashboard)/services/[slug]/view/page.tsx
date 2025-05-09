"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceHeader } from "@/components/service/service-header"
import { ViewService } from "@/components/service/view-service"
import { useRouter, usePathname, useParams } from "next/navigation"
import React from "react"

export default function ViewServicesPage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug

    const handleEdit = () => {
        router.push(`/services/${slug}/edit`)
    }

    const handleDelete = () => {
        router.push("/services")
    }
    return (
        <DashboardLayout>
            <div className="p-6">
                <ServiceHeader heading="View Service" text="View and manage service details." />
                <ViewService slug={slug} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </DashboardLayout>
    )
}