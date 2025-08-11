"use client"
import { useState } from "react"
import { Trash2, Phone, User, BookOpen, Loader2, Download, Mail, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDeleteConsultationMutation, useGetConsultationQuery } from "@/store/handexApi"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

interface Course {
    id: number
    name: string
    slug: string
    date: string[]
    color: string
}

interface Consultation {
    id: number
    name: string
    surname: string
    phone: string
    course: Course
    createdAt: string
    updatedAt: string
    company?: string
    email?: string
}

export default function ConsultationPage() {
    const { data, refetch, isLoading } = useGetConsultationQuery("az")
    const [delConsultation, { isLoading: delLoading }] = useDeleteConsultationMutation()
    const [isExporting, setIsExporting] = useState(false)


    const handleDelete = async (id: number) => {
        try {
            await showDeleteConfirmation(delConsultation, id, refetch, {
                title: "Konsultasiyanı silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Konsultasiyan uğurla silindi.",
            })
        } catch (error: any) {
            toast.error(error.data)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    // Export to Excel using ExcelJS
    const exportToExcel = async () => {
        if (!data || data.length === 0) {
            toast.error("İxrac etmək üçün məlumat yoxdur")
            return
        }

        setIsExporting(true)

        try {
            // Create a new workbook
            const workbook = new ExcelJS.Workbook()
            const worksheet = workbook.addWorksheet("Konsultasiyalar")

            // Set worksheet properties
            worksheet.properties.defaultRowHeight = 20

            // Define columns
            worksheet.columns = [
                { header: "Sıra", key: "sira", width: 8 },
                { header: "Ad", key: "ad", width: 15 },
                { header: "Soyad", key: "soyad", width: 15 },
                { header: "Telefon", key: "telefon", width: 15 },
                { header: "Kurs", key: "kurs", width: 25 },
                { header: "Yaradılma Tarixi", key: "yaradilma_tarixi", width: 20 },
                { header: "Yenilənmə Tarixi", key: "yenilenme_tarixi", width: 20 },
            ]

            // Style the header row
            const headerRow = worksheet.getRow(1)
            headerRow.font = { bold: true, color: { argb: "FFFFFF" } }
            headerRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "366092" },
            }
            headerRow.alignment = { horizontal: "center", vertical: "middle" }
            headerRow.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            }

            // Add data rows
            data.forEach((consultation: Consultation, index: number) => {
                const row = worksheet.addRow({
                    sira: index + 1,
                    ad: consultation.name,
                    soyad: consultation.surname,
                    telefon: consultation.phone,
                    kurs: consultation.course.name,
                    yaradilma_tarixi: formatDate(consultation.createdAt),
                    yenilenme_tarixi: formatDate(consultation.updatedAt),
                })

                // Style data rows
                row.alignment = { horizontal: "left", vertical: "middle" }
                row.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                }

                // Alternate row colors
                if (index % 2 === 0) {
                    row.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "F8F9FA" },
                    }
                }
            })

            // Add summary row
            const summaryRow = worksheet.addRow({
                sira: "",
                ad: "",
                soyad: "",
                telefon: "",
                kurs: `Cəmi: ${data.length} konsultasiya`,
                yaradilma_tarixi: "",
                yenilenme_tarixi: "",
            })

            summaryRow.font = { bold: true }
            summaryRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "E3F2FD" },
            }

            // Add title and metadata
            worksheet.insertRow(1, [""])
            worksheet.insertRow(1, [""])
            worksheet.insertRow(1, [`İxrac tarixi: ${new Date().toLocaleDateString("az-AZ")}`])
            worksheet.insertRow(1, ["Konsultasiya Məlumatları"])

            // Style title
            const titleRow = worksheet.getRow(1)
            titleRow.font = { size: 16, bold: true, color: { argb: "366092" } }
            titleRow.alignment = { horizontal: "center" }

            // Merge title cells
            worksheet.mergeCells("A1:G1")

            // Style export date
            const dateRow = worksheet.getRow(2)
            dateRow.font = { italic: true, color: { argb: "666666" } }
            dateRow.alignment = { horizontal: "center" }
            worksheet.mergeCells("A2:G2")

            // Generate filename with current date
            const currentDate = new Date().toLocaleDateString("az-AZ").replace(/\./g, "-")
            const filename = `konsultasiyalar-${currentDate}.xlsx`

            // Generate Excel file
            const buffer = await workbook.xlsx.writeBuffer()
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })

            // Save file
            saveAs(blob, filename)

            toast.success("Excel faylı uğurla yükləndi!")
        } catch (error) {
            console.error("Excel export error:", error)
            toast.error("Excel faylını ixrac edərkən xəta baş verdi")
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Konsultasiyalar</h1>
                        <p className="text-gray-600">Bütün konsultasiya müraciətlərini idarə edin</p>
                    </div>

                    {/* Excel Export Button */}
                    {data && data.length > 0 && (
                        <Button
                            onClick={exportToExcel}
                            disabled={isExporting}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {isExporting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    İxrac edilir...
                                </>
                            ) : (
                                <>
                                    <Download className="h-4 w-4 mr-2" />
                                    Excel-ə İxrac Et
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
            ) : data?.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Konsultasiya yoxdur</h3>
                        <p className="text-gray-500 text-center">Hələ ki heç bir konsultasiya müraciəti yoxdur.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data?.map((consultation: Consultation) => (
                        <Card key={consultation.id} className="relative hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <CardTitle className="text-lg">
                                            {consultation.name} {consultation.surname}
                                        </CardTitle>
                                    </div>
                                    <Button
                                        onClick={() => handleDelete(consultation.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {consultation.company && <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Building2 className="h-4 w-4" />
                                    <span>{consultation.company}</span>
                                </div>}
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Phone className="h-4 w-4" />
                                    <span>{consultation.phone}</span>
                                </div>
                                {consultation.email && <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Mail className="h-4 w-4" />
                                    <span>{consultation.email}</span>
                                </div>}

                                <div className="space-y-2">
                                    <Badge style={{ backgroundColor: consultation.course.color }} className="text-white">
                                        {consultation.course.name}
                                    </Badge>
                                </div>

                                <div className="pt-3 border-t border-gray-100">
                                    <div className="text-xs text-gray-500 space-y-1">
                                        <div>Yaradılıb: {formatDate(consultation.createdAt)}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">Cəmi {data?.length} konsultasiya müraciəti</p>
            </div>
        </div>
    )
}
