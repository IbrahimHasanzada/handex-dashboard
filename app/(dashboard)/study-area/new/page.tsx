"use client"
import { DashboardLayout } from '@/components/dashboard-layout'
import { CourseFormDialog } from '@/components/study-area/course-form-dialog'
import React from 'react'

const page = () => {
    return (
        <DashboardLayout>
            <CourseFormDialog />
        </DashboardLayout>
    )
}

export default page
