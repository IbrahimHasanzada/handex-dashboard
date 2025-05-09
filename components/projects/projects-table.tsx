"use client"
import Image from "next/image"
import { MoreHorizontal, Eye, Edit, Trash2, ArrowUpDown, Plus, Loader2, Package } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useDeleteProjectsMutation, useGetProjectsQuery } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export function ProjectsTable() {
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")
    const { data: projects, refetch, isLoading: projectsLoading } = useGetProjectsQuery(currentLanguage, { skip: !currentLanguage });
    const [deleteProjects, { isLoading: delLoading }] = useDeleteProjectsMutation()
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handledeleteProjects = (id: number) => {
        try {
            showDeleteConfirmation(deleteProjects, id, refetch, {
                title: "Layihəni silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Layihə uğurla silindi.",
            })
        } catch (error) {
            toast.error('Layihə silərkən xəta baş verdi!')
        }
    }
    return (
        <div className="rounded-md border">
            <div className="flex flex-col gap-5 md:gap-0 md:flex-row md:items-center justify-between  p-4">
                <div className="flex flex-1 items-center space-x-2">
                    <h2 className="text-xl font-semibold">Layihələr</h2>
                    <Badge>{projects?.data.length}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Tabs value={currentLanguage} onValueChange={(language: string) => setCurrentLanguage(language)} className="mr-4">
                        <TabsList>
                            <TabsTrigger value="az">AZ</TabsTrigger>
                            <TabsTrigger value="en">EN</TabsTrigger>
                            <TabsTrigger value="ru">RU</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Link href='/projects/new'>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni layihə yarat
                        </Button>
                    </Link>
                </div>
            </div>

            {projectsLoading ?
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                :
                projects?.data.length == 0 ?
                    <div className="flex flex-col items-center gap-5 justify-center w-full p-5">
                        <Package className="w-10 h-10 md:w-20 md:h-20" />
                        <span className="text-xl">Layihə tapılmadı</span>
                    </div>
                    :
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Layihə</TableHead>
                                <TableHead>
                                    <Button variant="ghost" className="p-0 hover:bg-transparent">
                                        Date
                                        <ArrowUpDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </TableHead>
                                <TableHead className="w-[80px]  hidden md:block">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {projects?.data.map((project: any) => (
                                <TableRow key={project.id} >
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded">
                                                <Image
                                                    src={project.image.url || "/placeholder.svg"}
                                                    alt={project.id}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {(project.translations.find((item: any) => item.field === 'title')?.value ?? "").length > (windowWidth < 768 ? 20 : 50)
                                                        ? `${(project.translations.find((item: any) => item.field === 'title')?.value ?? "").slice(0, (windowWidth < 768 ? 20 : 50))}...`
                                                        : (project.translations.find((item: any) => item.field === 'title')?.value ?? "")}
                                                </div>

                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:block py-7"> {format(new Date(project.createdAt), "PPP")}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator />
                                                <Link className="flex item-center" href={`/projects/${project.slug}/view`}>
                                                    <DropdownMenuItem className="w-full cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>View</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link className="flex item-center w-full" href={`/projects/${project.slug}/edit`}>
                                                    <DropdownMenuItem className="w-full cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handledeleteProjects(project.id)} className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table >
            }
        </div >
    )
}
