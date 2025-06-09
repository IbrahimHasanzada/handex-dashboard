"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { FAQForm } from "./faq-form"
import { toast } from "react-toastify"
import { useDeleteFaqMutation } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { FAQListProps } from "@/types/study-area/faq"



export function FAQList({ areaStudy, faqs, selectedLanguage, onRefresh }: FAQListProps) {
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [delFaq] = useDeleteFaqMutation()

    const handleDelete = async (faqId: number) => {
        setDeletingId(faqId)
        try {
            showDeleteConfirmation(delFaq, faqId, onRefresh, {
                title: "FAQ-ı silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "FAQ uğurla silindi.",
            })
        } catch (error) {
            console.error("Error deleting FAQ:", error)
            toast.error("FAQ silinərkən xəta baş verdi")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Tez-tez Verilən Suallar</CardTitle>
                    <CardDescription>Kurs haqqında FAQ-ları idarə edin</CardDescription>
                </div>
                <FAQForm areaStudy={areaStudy} currentLanguage={selectedLanguage} onSuccess={onRefresh} />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {faqs.map((faq) => (
                        <div key={faq.id} className="border rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="font-medium mb-2">{faq.title}</div>
                                    <div className="text-sm text-muted-foreground">{faq.description}</div>
                                    <div className="text-xs text-muted-foreground mt-2">
                                        Yaradılıb: {new Date(faq.createdAt).toLocaleDateString("az-AZ")}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <FAQForm
                                        areaStudy={areaStudy}
                                        faqId={faq.id}
                                        existingData={faq}
                                        currentLanguage={selectedLanguage}
                                        onSuccess={onRefresh}
                                        trigger={
                                            <Button size="icon" variant="ghost">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        }
                                    />
                                    {faqs.length > 1 && <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => handleDelete(faq.id)}
                                        disabled={deletingId === faq.id}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>}
                                </div>
                            </div>
                        </div>
                    ))}
                    {faqs.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Hələ FAQ əlavə edilməyib</p>
                            <p className="text-sm">İlk sualınızı əlavə etmək üçün yuxarıdakı düyməni basın</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
