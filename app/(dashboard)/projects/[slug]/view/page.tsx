"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { GeneralHeader } from "@/components/general-header"
import { ViewProjects } from "@/components/projects/view-projects"
import { useRouter, useParams } from "next/navigation"
import React from "react"

export default async function ViewProjetcsPage() {
    const router = useRouter()
    const params = useParams()
    const slug = await params.slug

    const handleEdit = () => {
        router.push(`/projects/${slug}/edit`)
    }

    const handleDelete = () => {
        router.push("/projects")
    }
    return (
        <DashboardLayout>
            <div className="p-6">
                <GeneralHeader heading="Layihəyə Baxın" text="Layihə detallarına baxın və idarə edin." />
                <ViewProjects slug={slug} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </DashboardLayout>
    )
}