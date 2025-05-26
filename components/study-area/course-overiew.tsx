"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Users, Award, Loader2 } from "lucide-react"
import { CourseOverviewProps } from "@/types/study-area/overview"
import { useGetStudyAreaBySlugQuery } from "@/store/handexApi"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"





const benefits = [
    {
        id: 1,
        title: "Peşəkar Müəllimlər",
        description: "Sahəsində təcrübəli və peşəkar müəllimlərdən dərs alın",
        icon: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 2,
        title: "Praktiki Təcrübə",
        description: "Real layihələr üzərində işləyərək təcrübə qazanın",
        icon: "/placeholder.svg?height=40&width=40",
    },
    {
        id: 3,
        title: "Karyera Dəstəyi",
        description: "Məzun olduqdan sonra iş tapmaqda dəstək alın",
        icon: "/placeholder.svg?height=40&width=40",
    },
]

export function CourseOverview({ slug }: CourseOverviewProps) {
    const onEdit = () => {

    }

    const onEditProgram = (id: number) => {

    }

    const onAddProgram = () => {

    }

    const onAddFAQ = () => {

    }

    const onEditFAQ = (id: number) => {

    }


    const [selectedLanguage, setSelectedLanguage] = useState("az")
    const { data, isLoading } = useGetStudyAreaBySlugQuery({ slug: slug, lang: selectedLanguage }, { skip: !slug })
    return (
        <div className="space-y-6 p-10">
            <Tabs defaultValue={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value)}>
                <TabsList>
                    <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ru">Русский</TabsTrigger>
                </TabsList>
            </Tabs>
            {isLoading ?
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                :
                <div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    {data.name}
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
                                        alt={data.image ? data.image.alt : 'tədris sahəsi şəkil alt tagı'}
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

                    {/* FAQ Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Tez-tez Verilən Suallar</CardTitle>
                                <CardDescription>Kurs haqqında FAQ-ları idarə edin</CardDescription>
                            </div>
                            <Button onClick={onAddFAQ}>
                                <Plus className="mr-2 h-4 w-4" />
                                Yeni Sual
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.faq.map((faq: any) => (
                                    <div key={faq.id} className="border rounded-lg p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-medium mb-2">{faq.title}</div>
                                                <div className="text-sm text-muted-foreground">{faq.description}</div>
                                                <div className="text-xs text-muted-foreground mt-2">
                                                    Yaradılıb: {new Date(faq.createdAt).toLocaleDateString("az-AZ")}
                                                </div>
                                            </div>
                                            <Button size="icon" variant="ghost" onClick={() => onEditFAQ?.(faq.id)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {data.faq.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>Hələ FAQ əlavə edilməyib</p>
                                        <p className="text-sm">İlk sualınızı əlavə etmək üçün yuxarıdakı düyməni basın</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    {/* Benefits Section */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5" />
                                    Niyə Handex?
                                </CardTitle>
                                <CardDescription>Məktəbin üstünlüklərini idarə edin</CardDescription>
                            </div>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Yeni Üstünlük
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {benefits.map((benefit) => (
                                    <div key={benefit.id} className="border rounded-lg p-6 flex flex-col items-center text-center">
                                        <div className="relative">
                                            <Image
                                                src={benefit.icon || "/placeholder.svg"}
                                                alt={benefit.title ||  'tədris sahəsi şəkil alt tagı'}
                                                width={40}
                                                height={40}
                                                className="mb-4"
                                            />
                                            <div className="absolute -bottom-2 -right-2 flex gap-1">
                                                <Button size="icon" variant="secondary" className="h-6 w-6">
                                                    <Edit className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-medium mb-2">{benefit.title}</h3>
                                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            }
        </div>
    )
}
