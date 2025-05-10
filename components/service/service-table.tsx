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
import { useDeleteServiceMutation, useGetServiceQuery } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs"

export function ServiceTable() {
    const [currentLanguage, setCurrentLanguage] = useState<string>("az")
    const { data: services, refetch, isLoading: newsLoading } = useGetServiceQuery(currentLanguage, { skip: !currentLanguage });
    const [deleteService, { isLoading: delLoading }] = useDeleteServiceMutation()
    const [windowWidth, setWindowWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    const handledeleteService = (id: number) => {
        try {
            showDeleteConfirmation(deleteService, id, refetch, {
                title: "Xidməti silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Xidmət uğurla silindi.",
            })
        } catch (error) {
            toast.error('Xidməti silərkən xəta baş verdi!')
        }
    }
    return (
        <div className="rounded-md border">
            <div className="flex flex-col gap-5 md:gap-0 md:flex-row md:items-center justify-between  p-4">
                <div className="flex flex-1 items-center space-x-2">
                    <h2 className="text-xl font-semibold">Xidmətlər</h2>
                    <Badge>{services?.totalItems}</Badge>
                </div>
                <div className="flex items-center space-x-2">
                    <Tabs value={currentLanguage} onValueChange={(language: string) => setCurrentLanguage(language)} className="mr-4">
                        <TabsList>
                            <TabsTrigger value="az">AZ</TabsTrigger>
                            <TabsTrigger value="en">EN</TabsTrigger>
                            <TabsTrigger value="ru">RU</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Link href='/services/new'>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Yeni xidmət yarat
                        </Button>
                    </Link>
                </div>
            </div>

            {newsLoading ?
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                :
                services?.data.length == 0 ?
                    <div className="flex flex-col items-center gap-5 justify-center w-full p-5">
                        <Package className="w-10 h-10 md:w-20 md:h-20" />
                        <span className="text-xl">Xidmət tapılmadı</span>
                    </div>
                    :
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Xidmətlər</TableHead>
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
                            {services?.data.map((service: any) => (
                                <TableRow key={service.id} >
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <div className="relative h-10 w-10 overflow-hidden rounded">
                                                <Image
                                                    src={service.image.url || "/placeholder.svg"}
                                                    alt={service.id}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div>
                                                <div className="font-medium">
                                                    {(service.translations.find((item: any) => item.field === 'title')?.value ?? "").length > (windowWidth < 768 ? 20 : 50)
                                                        ? `${(service.translations.find((item: any) => item.field === 'title')?.value ?? "").slice(0, (windowWidth < 768 ? 20 : 50))}...`
                                                        : (service.translations.find((item: any) => item.field === 'title')?.value ?? "")}
                                                </div>

                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:block py-7"> {format(new Date(service.createdAt), "PPP")}</TableCell>
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
                                                <Link className="flex item-center" href={`/services/${service.slug}/view`}>
                                                    <DropdownMenuItem className="w-full cursor-pointer">
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        <span>View</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <Link className="flex item-center w-full" href={`/services/${service.slug}/edit`}>
                                                    <DropdownMenuItem className="w-full cursor-pointer">
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        <span>Edit</span>
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem onClick={() => handledeleteService(service.id)} className="text-destructive">
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
