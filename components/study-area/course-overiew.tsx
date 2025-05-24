"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit } from "lucide-react"

const steps = [
    { id: 1, title: "Qeydiyyatdan keçin", description: "Online və ya ofisdə qeydiyyatdan keçin" },
    { id: 2, title: "Ödəniş edin", description: "Nağd və ya kartla ödəniş edin" },
    { id: 3, title: "Dərsləri izləyin", description: "Canlı və ya video dərsləri izləyin" },
    { id: 4, title: "Sertifikat əldə edin", description: "Kursu bitirdikdən sonra sertifikat əldə edin" },
]

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

export function CourseOverview() {
    return (
        <div className="space-y-6">
            {/* Data Analytics Header */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Data Analitika</CardTitle>
                        <CardDescription>Məlumatları analiz etmək və qərarlar qəbul etmək üçün</CardDescription>
                    </div>
                    <Button variant="outline">Redaktə Et</Button>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-1">
                            <div className="space-y-2">
                                <div className="font-medium text-sm text-muted-foreground">Başlıq</div>
                                <div className="font-semibold">Data Analitika</div>
                            </div>
                            <div className="space-y-2 mt-4">
                                <div className="font-medium text-sm text-muted-foreground">Təsvir</div>
                                <div className="text-sm">
                                    Məlumatları analiz etmək, vizuallaşdırmaq və qərarlar qəbul etmək üçün lazım olan bütün bacarıqları
                                    öyrənin. SQL, Power BI və Excel VBA kimi alətlərdən istifadə edərək data analitika sahəsində peşəkar
                                    olun.
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full max-w-[300px] aspect-video bg-pink-100 rounded-lg flex items-center justify-center">
                            <Image
                                src="/placeholder.svg?height=200&width=300"
                                alt="Data Analytics"
                                width={300}
                                height={200}
                                className="object-contain"
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

            {/* Steps Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Proqram Mərhələləri</CardTitle>
                    <CardDescription>Tədris prosesinin mərhələlərini idarə edin</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex items-start gap-4 border rounded-lg p-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    {index + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium">{step.title}</div>
                                        <div className="flex gap-1">
                                            <Button size="icon" variant="ghost">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">{step.description}</div>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full">
                            <Plus className="mr-2 h-4 w-4" /> Yeni Mərhələ Əlavə Et
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* School Rules */}
            <Card>
                <CardHeader>
                    <CardTitle>Məktəb Qaydaları</CardTitle>
                    <CardDescription>Məktəb qaydalarını və statistikaları idarə edin</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="border rounded-lg p-6 flex flex-col items-center justify-center bg-black text-white">
                            <div className="text-4xl font-bold">27 saat</div>
                            <div className="text-sm mt-2 text-center">Həftəlik dərs saatı</div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 border-white text-white hover:text-black hover:bg-white"
                            >
                                Redaktə Et
                            </Button>
                        </div>
                        <div className="border rounded-lg p-6 flex flex-col items-center justify-center bg-black text-white">
                            <div className="text-4xl font-bold">10 həftə</div>
                            <div className="text-sm mt-2 text-center">Proqram müddəti</div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-4 border-white text-white hover:text-black hover:bg-white"
                            >
                                Redaktə Et
                            </Button>
                        </div>
                        <div className="border rounded-lg p-6 flex flex-col items-center justify-center">
                            <div className="text-4xl font-bold">12 nəfər</div>
                            <div className="text-sm mt-2 text-center">Qrup ölçüsü</div>
                            <Button variant="outline" size="sm" className="mt-4">
                                Redaktə Et
                            </Button>
                        </div>
                        <div className="border rounded-lg p-6 flex flex-col items-center justify-center">
                            <div className="text-4xl font-bold">3 ay</div>
                            <div className="text-sm mt-2 text-center">Təcrübə müddəti</div>
                            <Button variant="outline" size="sm" className="mt-4">
                                Redaktə Et
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Why School */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Niyə Handex?</CardTitle>
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
                                        alt={benefit.title}
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
    )
}
