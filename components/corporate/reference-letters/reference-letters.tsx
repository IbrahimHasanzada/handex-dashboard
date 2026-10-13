"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteContentMutation, useGetContentQuery } from "@/store/handexApi"
import { FileText, Package, Trash2 } from "lucide-react"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { AddReferenceLetter, isPdf } from "./add-reference-letter"

const SLUG = "reference-letters"

const ReferenceLetters = () => {
    const { data: az, refetch: refetchAz } = useGetContentQuery({ slug: SLUG, lang: "az" })
    const { data: en, refetch: refetchEn } = useGetContentQuery({ slug: SLUG, lang: "en" })
    const { data: ru, refetch: refetchRu } = useGetContentQuery({ slug: SLUG, lang: "ru" })
    const [deleteContent] = useDeleteContentMutation()

    const refetch = () => {
        refetchAz()
        refetchEn()
        refetchRu()
    }

    const titleById = (list: any[] | undefined, id: number) => list?.find((item: any) => item.id === id)?.title || ""

    const handleDelete = (id: number) => {
        showDeleteConfirmation(deleteContent, id, refetch, {
            title: "Referans məktubunu silmək istəyirsinizmi?",
            text: "Bu əməliyyat geri qaytarıla bilməz!",
            successText: "Referans məktubu uğurla silindi.",
        })
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Referans məktubları</CardTitle>
                    <CardDescription>
                        Korporativ səhifədəki "Referans məktublarımıza bax" modalında göstərilən şəkil və PDF-lər
                    </CardDescription>
                </div>
                <AddReferenceLetter refetch={refetch} />
            </CardHeader>
            <CardContent>
                {az?.length ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {az.map((item: any) => {
                            const file = item.images?.[0]
                            return (
                                <div key={item.id} className="p-3 border rounded-lg flex flex-col gap-3 justify-between h-full">
                                    <a
                                        href={file?.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-32 flex items-center justify-center bg-muted rounded-md overflow-hidden"
                                    >
                                        {isPdf(file?.url) ? (
                                            <div className="flex flex-col items-center gap-1 text-muted-foreground">
                                                <FileText className="h-10 w-10" />
                                                <span className="text-xs">PDF</span>
                                            </div>
                                        ) : (
                                            <img src={file?.url} alt={file?.alt || item.title} className="h-full w-full object-contain" />
                                        )}
                                    </a>
                                    <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                                    <div className="w-full flex justify-end gap-1">
                                        <AddReferenceLetter
                                            refetch={refetch}
                                            editItem={{
                                                id: item.id,
                                                fileId: file?.id,
                                                url: file?.url,
                                                titles: {
                                                    az: item.title || "",
                                                    en: titleById(en, item.id),
                                                    ru: titleById(ru, item.id),
                                                },
                                            }}
                                        />
                                        <Button onClick={() => handleDelete(item.id)} size="icon" className="h-7 w-7">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-5 justify-center w-full p-5">
                        <Package className="w-10 h-10 md:w-20 md:h-20" />
                        <span className="text-xl">Referans məktubu tapılmadı</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default ReferenceLetters
