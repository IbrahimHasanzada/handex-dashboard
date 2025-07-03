"use client"
import AddSection from '@/components/about/add-section'
import { DashboardLayout } from '@/components/dashboard-layout'
import React from 'react'

const page = () => {

    return (
        <DashboardLayout>
            <AddSection edit={false} onComplete={() => { }} refetch={() => { }} />
        </DashboardLayout>
    )
}

export default page
