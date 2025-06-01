"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { NewsHeader } from "@/components/news/news-header"
import { ViewNews } from "@/components/news/view-news"
import { useRouter, useParams } from "next/navigation"
import React from "react"


export default function ViewArticlePage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug

    const handleEdit = () => {
        router.push(`/news/${slug}/edit`)
    }

    const handleDelete = () => {
        router.push("/news")
    }
    return (
        <DashboardLayout>
            <div className="p-6">
                <NewsHeader heading="Xəbərə baxın" text="Xəbər təfərrüatlarına baxın və idarə edin." />
                <ViewNews slug={slug} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </DashboardLayout>
    )
}