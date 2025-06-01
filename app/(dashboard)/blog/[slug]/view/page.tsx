"use client"

import { ViewBlogs } from "@/components/blog/view-blog"
import { DashboardLayout } from "@/components/dashboard-layout"
import { NewsHeader } from "@/components/news/news-header"
import { useRouter, useParams } from "next/navigation"
import React from "react"

export default function ViewBlogsPage() {
    const router = useRouter()
    const params = useParams()
    const slug = params.slug

    const handleEdit = () => {
        router.push(`/blog/${slug}/edit`)
    }

    const handleDelete = () => {
        router.push("/blog")
    }
    return (
        <DashboardLayout>
            <div className="p-6">
                <NewsHeader heading="Bloqa baxın" text="Bloq detallarına baxın və idarə edin." />
                <ViewBlogs slug={slug} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </DashboardLayout>
    )
}