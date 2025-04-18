import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetProfilesQuery } from '@/store/handexApi'
import { ChevronLeft, ChevronRight, Edit, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

const Graduates = () => {
    const { data: graduatesData, isLoading, isError, refetch } = useGetProfilesQuery('student')
    const [currentPage, setCurrentPage] = useState(1)

    const startIndex = (currentPage - 1) * 10
    const endIndex = startIndex + 10
    const displayedGraduates = graduatesData?.slice(startIndex, endIndex)
    const pageView = Math.round(graduatesData?.length / 10)


    return (
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
            {isLoading ? (
                <div className="col-span-2 text-center py-8">Yüklənir...</div>
            ) : isError ? (
                <div className="col-span-2 text-center py-8 text-red-500">Məlumatları yükləyərkən xəta baş verdi</div>
            ) : (
                <>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {displayedGraduates?.map((graduate: any) => (
                                <div key={graduate.id} className="border rounded-lg p-4 flex flex-col items-center">
                                    <div className="relative">
                                        <Image
                                            src={graduate.image.url || "/placeholder.svg"}
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
                                    <div className="text-sm text-muted-foreground text-center">{graduate.speciality}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : currentPage)}>
                            <ChevronLeft className="h-4 w-4 mr-1" /> Əvvəlki
                        </Button>
                        <div className="text-sm">Səhifə {currentPage} / {pageView}</div>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(graduatesData?.length > 10 ? currentPage + 1 : currentPage)}>
                            Növbəti <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </CardFooter>
                </>
            )}
        </Card>
    )
}

export default Graduates
