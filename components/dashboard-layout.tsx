"use client"

import type React from "react"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Home,
  FileText,
  Newspaper,
  Briefcase,
  Info,
  GraduationCap,
  Building2,
  FolderKanban,
  LogOut,
  Settings,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const menuItems = [
    { name: "Ana Səhifə", href: "/", icon: Home },
    { name: "Blog", href: "/blog", icon: FileText },
    { name: "Xəbərlər", href: "/news", icon: Newspaper },
    { name: "Xidmətlər", href: "/services", icon: Briefcase },
    { name: "Haqqımızda", href: "/about", icon: Info },
    { name: "Təhsil Sahəsi", href: "/study-area", icon: GraduationCap },
    { name: "Korporativ", href: "/corporate", icon: Building2 },
    { name: "Layihələr", href: "/projects", icon: FolderKanban },
    { name: "Statistika", href: "/statistics", icon: BarChart3 },
  ]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center gap-2">
              <div className="rounded-md bg-primary p-1">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">Admin Panel</span>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.name}>
                    <Link href={item.href}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <div className="flex items-center justify-between px-4 py-2">
              <ModeToggle />
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <SidebarTrigger />
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm">
                Profile
              </Button>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
