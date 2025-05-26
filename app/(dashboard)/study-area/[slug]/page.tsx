import { DashboardLayout } from '@/components/dashboard-layout'
import { CourseOverview } from '@/components/study-area/course-overiew'
import React from 'react'

type PageProps = {
    params: {
        slug: string
    }
}

const Page = ({ params }: PageProps) => {
    const { slug } = params;

    return (
        <DashboardLayout>
            <CourseOverview slug={slug} />
        </DashboardLayout>
    )
}

export default Page;
