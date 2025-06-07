"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAddContentMutation, useGeneralMutation, useGetGeneralQuery } from "@/store/handexApi"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import { useState } from "react"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { AddPartner } from "./add-partners"

const Partners = () => {
    const { data: partners, refetch: fetchPartners, isFetching } = useGetGeneralQuery("")
    const [updatePartner, { isLoading }] = useAddContentMutation()
    const [currentPage, setCurrentPage] = useState(1)
    const compaines = partners && partners[0].company

    const startIndex = (currentPage - 1) * 5
    const endIndex = startIndex + 5
    const displayedGraduates = compaines?.slice(startIndex, endIndex)
    const pageView = Math.ceil((compaines?.length || 0) / 5) || 1

    const handleDeletePartner = async (id: number) => {
        try {
            const updatedPartners = compaines.filter((item: any) => item.id !== id).map((elem: any) => elem.id)
            fetchPartners()
            showDeleteConfirmation(updatePartner, { company: updatedPartners }, fetchPartners, {
                title: "Tərəfdaşı silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Tərəfdaş uğurla silindi.",
            })
        } catch (error) {
            toast.error("Tərəfdaş silinərkən xəta baş verdi")
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Tərəfdaşlar</CardTitle>
                    <CardDescription>Tərəfdaş şirkətləri idarə edin</CardDescription>
                </div>
                <AddPartner partners={partners?.[0].company} refetch={fetchPartners} />
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {displayedGraduates?.map((partner: any, index: number) => (
                        <div key={partner.id} className="border rounded-lg p-4 flex flex-col items-center">
                            <div className="relative">
                                <Image
                                    src={partner.url || "/placeholder.svg"}
                                    alt={"partner" + index}
                                    width={80}
                                    height={80}
                                    className="object-contain"
                                />
                                <div className="absolute -bottom-2 -right-2 flex gap-1">
                                    <AddPartner
                                        editPartner={{
                                            id: partner.id,
                                            url: partner.url,
                                            title: partner.title || "",
                                            alt: partner.alt || "",
                                            contentId: partner.contentId,
                                        }}
                                        refetch={fetchPartners}
                                    />
                                    <Button
                                        onClick={() => handleDeletePartner(partner.id)}
                                        size="icon"
                                        variant="secondary"
                                        className="h-7 w-7"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
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
