"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { NewsHeader } from "@/components/news/news-header"
import { ViewNews } from "@/components/news/view-news"
import { useRouter, usePathname, useParams } from "next/navigation"
import React from "react"

export async function generateStaticParams() {
  // Backend'dən və ya API'dən xəbərləri çəkirik
  const response = await fetch("https://api.drafts.az/news")
  const newsList: any = await response.json()

  // Hər xəbər üçün slug dəyərini qaytarırıq
  return newsList.map((news) => ({
    slug: news.slug,
  }))
}

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
                <NewsHeader heading="View Article" text="View and manage article details." />
                <ViewNews slug={slug} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
        </DashboardLayout>
    )
}