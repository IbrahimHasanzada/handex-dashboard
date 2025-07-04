"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteContentMutation, useGetContentQuery } from "@/store/handexApi"
import { ChevronLeft, ChevronRight, Package, Trash2 } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import { useState } from "react"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { AddPartner } from "./add-partners"

const Partners = () => {
    const { data: partners, refetch: fetchPartners, isFetching } = useGetContentQuery({ slug: "partners", lang: "az" })
    const [updatePartner, { isLoading }] = useDeleteContentMutation()
    const [currentPage, setCurrentPage] = useState(1)
    const compaines = partners && partners
    const startIndex = (currentPage - 1) * 5
    const endIndex = startIndex + 5
    const displayedGraduates = compaines?.slice(startIndex, endIndex)
    const pageView = Math.ceil((compaines?.length || 0) / 5) || 1

    const handleDeletePartner = async (id: number) => {
        showDeleteConfirmation(updatePartner, id, fetchPartners, {
            title: "Tərəfdaşı silmək istəyirsinizmi?",
            text: "Bu əməliyyat geri qaytarıla bilməz!",
            successText: "Tərəfdaş uğurla silindi.",
        })
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Tərəfdaşlar</CardTitle>
                    <CardDescription>Tərəfdaş şirkətləri idarə edin</CardDescription>
                </div>
                <AddPartner partners={partners} refetch={fetchPartners} />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {partners ?
                        displayedGraduates?.map((partner: any, index: number) => (
                            <div key={partner.id} className="p-3 border rounded-lg flex flex-col justify-between h-full items-center">
                                <div className="relative">
                                    <Image
                                        src={partner.images[0].url || "/placeholder.svg"}
                                        alt={"partner" + index}
                                        width={80}
                                        height={80}
                                        className="object-contain"
                                    />
                                </div>
                                <div className="w-full items-end justify-end flex gap-1">
                                    <AddPartner
                                        editPartner={{
                                            id: partner.id,
                                            imageId: partner.images[0].id,
                                            url: partner.images[0].url,
                                            title: partner.title || "",
                                            alt: partner.images[0].alt || "",
                                        }}
                                        refetch={fetchPartners}
                                    />
                                    <Button
                                        onClick={() => handleDeletePartner(partner.id)}
                                        size="icon"
                                        className="h-7 w-7"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))
                        :
                        <div className="flex flex-col items-center gap-5 justify-center w-full p-5">
                            <Package className="w-10 h-10 md:w-20 md:h-20" />
                            <span className="text-xl">Tərəfdaş tapılmadı</span>
                        </div>
                    }

                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Əvvəlki
                </Button>
                <div className="text-sm">
                    Səhifə {currentPage} / {pageView}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage < pageView ? currentPage + 1 : currentPage)}
                    disabled={currentPage === pageView}
                >
                    Növbəti <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </CardFooter>
        </Card>
    )
}

export default Partners
