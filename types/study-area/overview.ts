export interface CourseOverviewProps {
    slug: string
}
export interface StudyAreaData {
    id: number
    name: string
    slug: string
    color: string
    image: {
        id: number
        url: string
        alt: string
        createdAt: string
        updatedAt: string
    }
    faq: Array<{
        id: number
        title: string
        description: string
        createdAt: string
        updatedAt: string
    }>
    program: Array<{
        id: number
        name: string
        description: string
    }>
    meta: Array<{
        id: number
        slug: string
        name: string
        value: string
    }>
    course_detail: string
}