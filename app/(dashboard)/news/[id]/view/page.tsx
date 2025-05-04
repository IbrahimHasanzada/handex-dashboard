"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { NewsHeader } from "@/components/news/news-header"
import { ViewNews } from "@/components/news/view-news"
import { useRouter, usePathname } from "next/navigation"

export default function ViewArticlePage() {
    const router = useRouter()
    const pathname = usePathname()
    const id = pathname.split('/')[2]

    const handleEdit = () => {
        router.push(`/news/${id}/edit`)
    }

    const handleDelete = () => {
        router.push("/news")
    }

    return (
        <DashboardLayout>
            <div className="p-6">
                <NewsHeader heading="View Article" text="View and manage article details." />
                <ViewNews id={id} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </DashboardLayout>
    )
}