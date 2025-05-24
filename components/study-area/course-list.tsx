"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { CourseFormDialog } from "./course-form-dialog"
import { CourseFormData } from "@/validations/study-area/course-add.validation"

const courses = [
    {
        id: 1,
        name: "Veb Dizayn (HTML, CSS)",
        duration: "8 həftə",
        students: 32,
        statusColor: "bg-emerald-100 text-emerald-800",
    },
    {
        id: 2,
        name: "JavaScript",
        duration: "10 həftə",
        students: 24,
        statusColor: "bg-emerald-100 text-emerald-800",
    },
    {
        id: 3,
        name: "SQL (PostgreSQL)",
        duration: "6 həftə",
        students: 18,
        statusColor: "bg-emerald-100 text-emerald-800",
    },
    {
        id: 4,
        name: "Power BI",
        duration: "5 həftə",
        students: 22,
        statusColor: "bg-emerald-100 text-emerald-800",
    },
    {
        id: 5,
        name: "UX/UI Dizayn",
        status: "Planlaşdırılır",
        duration: "8 həftə",
        students: 12,
        statusColor: "bg-amber-100 text-amber-800",
    },
]

export function CourseList() {
    const [searchTerm, setSearchTerm] = useState("")

    const filteredCourses = courses.filter((course) => course.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const handleCourseSubmit = (data: CourseFormData) => {
        console.log("Yeni kurs:", data)
        // Burada API çağırısı ediləcək
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Kurslar</CardTitle>
                        <CardDescription>Bütün kursları idarə edin</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Kurs axtar..."
                                className="w-[200px] pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <CourseFormDialog onSubmit={handleCourseSubmit} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredCourses.map((course) => (
                            <div key={course.id} className="rounded-lg border">
                                <div className="flex items-center p-4">
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center">
                                        <div className="font-medium">{course.name}</div>
                                        <div className="text-sm">{course.duration}</div>
                                        <div className="text-sm">{course.students} tələbə</div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button size="sm" variant="outline">
                                            <Edit className="h-4 w-4 mr-1" /> Redaktə
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-destructive">
                                            <Trash2 className="h-4 w-4 mr-1" /> Sil
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                        <ChevronLeft className="h-4 w-4 mr-1" /> Əvvəlki
                    </Button>
                    <div className="text-sm">Səhifə 1 / 2</div>
                    <Button variant="outline" size="sm">
                        Növbəti <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
