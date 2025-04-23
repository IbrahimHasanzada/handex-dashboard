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
import Partners from "./home/partners/partners"

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
      <Partners />
    </div>
  )
}
