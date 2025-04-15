"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  FileText,
  Code,
  BarChart3,
  BookOpen,
  GraduationCap,
  Briefcase,
  Search,
  ArrowRight,
  Upload,
  ChevronLeft,
  ImageIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

export function StudyAreaPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const courseCategories = [
    { id: 1, name: "Document Yazır", icon: FileText, count: 7, color: "bg-emerald-100 text-emerald-700" },
    { id: 2, name: "SQL (PostgreSQL)", icon: Code, count: 4, color: "bg-pink-100 text-pink-700" },
    { id: 3, name: "Power BI", icon: BarChart3, count: 6, color: "bg-blue-100 text-blue-700" },
    { id: 4, name: "Excel VBA", icon: BookOpen, count: 5, color: "bg-amber-100 text-amber-700" },
    { id: 5, name: "Veb Dizayn (HTML, CSS)", icon: Code, count: 8, color: "bg-emerald-100 text-emerald-700" },
    { id: 6, name: "Veb Proqramlaşdırma (JavaScript)", icon: Code, count: 9, color: "bg-pink-100 text-pink-700" },
    { id: 7, name: "SEO", icon: Briefcase, count: 3, color: "bg-blue-100 text-blue-700" },
    { id: 8, name: "UX/UI", icon: GraduationCap, count: 4, color: "bg-amber-100 text-amber-700" },
  ]

  const graduates = [
    { id: 1, name: "Aytən Hüseynli", avatar: "/placeholder.svg?height=80&width=80", course: "Veb Dizayn" },
    { id: 2, name: "Murad Əliyev", avatar: "/placeholder.svg?height=80&width=80", course: "JavaScript" },
    { id: 3, name: "Səbinə Məmmədova", avatar: "/placeholder.svg?height=80&width=80", course: "UX/UI" },
    { id: 4, name: "Orxan Həsənli", avatar: "/placeholder.svg?height=80&width=80", course: "SQL" },
  ]

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

 

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tədris Sahələri</h1>
          <p className="text-muted-foreground">Kurs kateqoriyalarını və məzmununu idarə edin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Yeni Kurs Əlavə Et
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="overview">Ümumi Baxış</TabsTrigger>
          <TabsTrigger value="categories">Kateqoriyalar</TabsTrigger>
          <TabsTrigger value="courses">Kurslar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                      Məlumatları analiz etmək, vizuallaşdırmaq və qərarlar qəbul etmək üçün lazım olan bütün
                      bacarıqları öyrənin. SQL, Power BI və Excel VBA kimi alətlərdən istifadə edərək data analitika
                      sahəsində peşəkar olun.
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
                        <Button size="icon" variant="secondary" className="h-6 w-6">
                          <Trash2 className="h-3 w-3" />
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
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Kurs Kateqoriyaları</CardTitle>
                <CardDescription>Bütün kurs kateqoriyalarını idarə edin</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Kateqoriya axtar..." className="w-[200px] pl-8" />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Yeni Kateqoriya
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseCategories.map((category) => (
                  <Card key={category.id}>
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-md ${category.color}`}>
                          <category.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{category.name}</CardTitle>
                          <CardDescription>Kurs sayı: {category.count}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        Bu kateqoriyada {category.count} kurs var. Kursları görmək üçün klikləyin.
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" size="sm" className="w-full">
                        Kursları Göstər <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Yeni Kateqoriya Əlavə Et</CardTitle>
              <CardDescription>Yeni kurs kateqoriyası yaradın</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Kateqoriya Adı
                    </label>
                    <Input id="name" placeholder="Kateqoriya adını daxil edin" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="icon" className="text-sm font-medium">
                      İkon
                    </label>
                    <div className="flex gap-2">
                      <Button variant="outline" className="w-full">
                        İkon Seçin
                      </Button>
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Təsvir
                  </label>
                  <Textarea id="description" placeholder="Kateqoriya təsvirini daxil edin" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="color" className="text-sm font-medium">
                    Rəng
                  </label>
                  <div className="flex gap-2">
                    <div className="h-10 w-10 rounded-md bg-emerald-100 cursor-pointer border-2 border-emerald-300" />
                    <div className="h-10 w-10 rounded-md bg-pink-100 cursor-pointer" />
                    <div className="h-10 w-10 rounded-md bg-blue-100 cursor-pointer" />
                    <div className="h-10 w-10 rounded-md bg-amber-100 cursor-pointer" />
                    <div className="h-10 w-10 rounded-md bg-purple-100 cursor-pointer" />
                    <div className="h-10 w-10 rounded-md bg-red-100 cursor-pointer" />
                  </div>
                </div>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Kateqoriya Əlavə Et
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Kurslar</CardTitle>
                <CardDescription>Bütün kursları idarə edin</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Kurs axtar..." className="w-[200px] pl-8" />
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Yeni Kurs
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border">
                  <div className="flex items-center p-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center">
                      <div className="font-medium">Veb Dizayn (HTML, CSS)</div>
                      <div className="text-sm text-muted-foreground">Başlanğıc səviyyə</div>
                      <div className="flex items-center">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Aktiv</Badge>
                      </div>
                      <div className="text-sm">8 həftə</div>
                      <div className="text-sm">32 tələbə</div>
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

                <div className="rounded-lg border">
                  <div className="flex items-center p-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center">
                      <div className="font-medium">JavaScript</div>
                      <div className="text-sm text-muted-foreground">Orta səviyyə</div>
                      <div className="flex items-center">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Aktiv</Badge>
                      </div>
                      <div className="text-sm">10 həftə</div>
                      <div className="text-sm">24 tələbə</div>
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

                <div className="rounded-lg border">
                  <div className="flex items-center p-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center">
                      <div className="font-medium">SQL (PostgreSQL)</div>
                      <div className="text-sm text-muted-foreground">Başlanğıc səviyyə</div>
                      <div className="flex items-center">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Aktiv</Badge>
                      </div>
                      <div className="text-sm">6 həftə</div>
                      <div className="text-sm">18 tələbə</div>
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

                <div className="rounded-lg border">
                  <div className="flex items-center p-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center">
                      <div className="font-medium">Power BI</div>
                      <div className="text-sm text-muted-foreground">Başlanğıc səviyyə</div>
                      <div className="flex items-center">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">Aktiv</Badge>
                      </div>
                      <div className="text-sm">5 həftə</div>
                      <div className="text-sm">22 tələbə</div>
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

                <div className="rounded-lg border">
                  <div className="flex items-center p-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 md:gap-4 items-center">
                      <div className="font-medium">UX/UI Dizayn</div>
                      <div className="text-sm text-muted-foreground">Orta səviyyə</div>
                      <div className="flex items-center">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Planlaşdırılır</Badge>
                      </div>
                      <div className="text-sm">8 həftə</div>
                      <div className="text-sm">12 tələbə</div>
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

          <Card>
            <CardHeader>
              <CardTitle>Yeni Kurs Əlavə Et</CardTitle>
              <CardDescription>Yeni kurs yaradın və kateqoriyaya əlavə edin</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="course-name" className="text-sm font-medium">
                      Kurs Adı
                    </label>
                    <Input id="course-name" placeholder="Kurs adını daxil edin" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Kateqoriya
                    </label>
                    <select
                      id="category"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Kateqoriya seçin</option>
                      {courseCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="level" className="text-sm font-medium">
                      Səviyyə
                    </label>
                    <select
                      id="level"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Səviyyə seçin</option>
                      <option value="beginner">Başlanğıc</option>
                      <option value="intermediate">Orta</option>
                      <option value="advanced">İrəli</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="duration" className="text-sm font-medium">
                      Müddət (həftə)
                    </label>
                    <Input id="duration" type="number" min="1" placeholder="Həftə sayı" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="status" className="text-sm font-medium">
                      Status
                    </label>
                    <select
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Status seçin</option>
                      <option value="active">Aktiv</option>
                      <option value="planned">Planlaşdırılır</option>
                      <option value="completed">Tamamlanıb</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Təsvir
                  </label>
                  <Textarea id="description" placeholder="Kurs təsvirini daxil edin" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="image" className="text-sm font-medium">
                    Kurs Şəkli
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-40 rounded-md border flex items-center justify-center bg-muted">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <Button variant="outline">Şəkil Yüklə</Button>
                  </div>
                </div>

                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" /> Kurs Əlavə Et
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
