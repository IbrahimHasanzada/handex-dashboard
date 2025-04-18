"use client"

import { useEffect, useState } from "react"
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
import Graduates from "./home/graduates/graduates"

export function DashboardHome() { 

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
      <div>
        <Graduates />
      </div>

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
