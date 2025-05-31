"use client"
import { DashboardLayout } from '@/components/dashboard-layout'
import { CourseOverview } from '@/components/study-area/course-overiew'
import { useParams } from 'next/navigation'
import React from 'react'

type PageProps = {
    slug: string
}

const Page = () => {
    const params: PageProps = useParams()
    const slug = params.slug
    return (
        <DashboardLayout>
            <CourseOverview slug={slug} />
        </DashboardLayout>
    )
}

export default Page;
