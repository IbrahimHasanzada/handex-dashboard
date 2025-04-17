"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Star
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import HomeHero from "./home/home-hero"
import Testimonials from "./home/testimonials/testimonials"

export function DashboardHome() {
  const [currentPage, setCurrentPage] = useState(1)

  const graduates = [
    { id: 1, name: "Aytən Hüseynli", avatar: "/placeholder.svg?height=80&width=80", course: "Veb Dizayn" },
    { id: 2, name: "Murad Əliyev", avatar: "/placeholder.svg?height=80&width=80", course: "JavaScript" },
    { id: 3, name: "Səbinə Məmmədova", avatar: "/placeholder.svg?height=80&width=80", course: "UX/UI" },
    { id: 4, name: "Orxan Həsənli", avatar: "/placeholder.svg?height=80&width=80", course: "SQL" },
  ]

  const partners = [
    { id: 1, name: "ABB", logo: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "Unibank", logo: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "Kapital Bank", logo: "/placeholder.svg?height=40&width=40" },
    { id: 4, name: "Azercell", logo: "/placeholder.svg?height=40&width=40" },
    { id: 5, name: "Pasha Holding", logo: "/placeholder.svg?height=40&width=40" },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <HomeHero />
      </div>

      {/* Testimonials Management */}

      <div>
        <Testimonials />
      </div>
      {/* Graduates Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Məzunlar</CardTitle>
            <CardDescription>Məzunları idarə edin</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Yeni Məzun Əlavə Et
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {graduates.map((graduate) => (
              <div key={graduate.id} className="border rounded-lg p-4 flex flex-col items-center">
                <div className="relative">
                  <Image
                    src={graduate.avatar || "/placeholder.svg"}
                    alt={graduate.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
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
                <div className="font-medium text-center mt-3">{graduate.name}</div>
                <div className="text-sm text-muted-foreground text-center">{graduate.course}</div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Əvvəlki
          </Button>
          <div className="text-sm">Səhifə {currentPage} / 3</div>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}>
            Növbəti <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>

      {/* Partners Management */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Tərəfdaşlar</CardTitle>
            <CardDescription>Tərəfdaş şirkətləri idarə edin</CardDescription>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Yeni Tərəfdaş
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {partners.map((partner) => (
              <div key={partner.id} className="border rounded-lg p-4 flex flex-col items-center">
                <div className="relative">
                  <Image
                    src={partner.logo || "/placeholder.svg"}
                    alt={partner.name}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <Button size="icon" variant="secondary" className="h-6 w-6">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="font-medium text-center mt-3">{partner.name}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
