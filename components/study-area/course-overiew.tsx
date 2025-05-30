"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Award, Loader2, Box, ArrowLeft } from "lucide-react"
import type { CourseOverviewProps } from "@/types/study-area/overview"
import { useGetStudyAreaBySlugQuery } from "@/store/handexApi"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"
import Link from "next/link"
import { FAQList } from "./faq/faq-list"
import { GroupList } from "./group/group-list"

export function CourseOverview({ slug }: CourseOverviewProps) {
    const onEdit = () => { }

    const onEditProgram = (id: number) => { }

    const onAddProgram = () => { }

    const onAddFAQ = () => { }

    const onEditFAQ = (id: number) => { }

    const [selectedLanguage, setSelectedLanguage] = useState("az")
    const { data, isLoading, isError, refetch } = useGetStudyAreaBySlugQuery(
        { slug: slug, lang: selectedLanguage },
        { skip: !slug },
    )
    console.log(data)
    return (
        <div className="space-y-6 p-10">
            <div className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                    <Link href="/study-area">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Tədris sahələrinə qayıt
                    </Link>
                </Button>
                <Tabs defaultValue={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value)}>
                    <TabsList>
                        <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                        <TabsTrigger value="en">English</TabsTrigger>
                        <TabsTrigger value="ru">Русский</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
            ) : isError ? (
                <div>
                    <div className="flex w-full justify-center items-center">Məlumatları yükləyərkən xəta baş verdi</div>
                </div>
            ) : data ? (
                <div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    {data && data.name}
                                    <Badge variant="secondary" style={{ backgroundColor: `${data.color}20`, color: data.color }}>
                                        {data.slug}
                                    </Badge>
                                </CardTitle>
                            </div>
                            <Button variant="outline" onClick={onEdit}>
                                <Edit className="mr-2 h-4 w-4" />
                                Redaktə Et
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-6 items-start">
                                <div className="flex-1">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="font-medium text-sm text-muted-foreground">Kurs Adı</div>
                                            <div className="font-semibold">{data.name}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-sm text-muted-foreground">Kurs Təfərrüatı</div>
                                            <div className="text-sm leading-relaxed">{data.course_detail}</div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="font-medium text-sm text-muted-foreground">Rəng</div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded border" style={{ backgroundColor: data.color }} />
                                                <span className="font-mono text-sm">{data.color}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative w-full max-w-[300px] aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                        src={data.image.url || "/placeholder.svg"}
                                        alt={data.image ? data.image.alt : "tədris sahəsi şəkil alt tagı"}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute bottom-2 right-2">
                                        <Button size="sm" variant="secondary">
                                            Şəkli Dəyişdir
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Program Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Award className="h-5 w-5" />
                                    Proqram Modulları
                                </CardTitle>
                                <CardDescription>Kurs proqramının modullarını idarə edin</CardDescription>
                            </div>
                            <Button onClick={onAddProgram}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni Modul
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.program.map((program: any, index: number) => (
                                    <div key={program.id} className="flex items-start gap-4 border rounded-lg p-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <div className="font-medium">{program.name}</div>
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" onClick={() => onEditProgram?.(program.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{program.description}</div>
                                        </div>
                                    </div>
                                ))}
                                {data.program.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Hələ proqram modulu əlavə edilməyib</p>
                                        <p className="text-sm">İlk modulunuzu əlavə etmək üçün yuxarıdakı düyməni basın</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Groups Section */}
                    <GroupList
                        studyArea={data.id}
                        groups={data.groups}
                        selectedLanguage={selectedLanguage}
                        courseColor={data.color}
                        onRefresh={refetch}
                    />

                    {/* FAQ Section */}
                    <div className="space-y-4">
                        <FAQList areaStudy={data.id} faqs={data.faq} selectedLanguage={selectedLanguage} onRefresh={refetch} />
                        {data.faq.length === 0 && (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Hələ FAQ əlavə edilməyib</p>
                                <p className="text-sm">İlk sualınızı əlavə etmək üçün yuxarıdakı düyməni basın</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex w-full justify-center items-center">
                    <Box>Heç bir məlumat tapılmadı</Box>
                </div>
            )}
        </div>
    )
}
