"use client"

import { useState } from "react"
import { Trash2, Mail, Phone, User, MessageSquare, FileText, Loader2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDeleteContactMutation, useGetContactQuery } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"
import ExcelJS from "exceljs"
import { saveAs } from "file-saver"

interface Contact {
    id: number
    full_name: string
    email: string
    phone: string
    title: string
    message: string
    createdAt: string
}

export default function ContactPage() {
    const { data, isLoading, refetch } = useGetContactQuery("")
    const [deleteContact] = useDeleteContactMutation()
    const [isExporting, setIsExporting] = useState(false)

    const handleDelete = (id: number) => {
        try {
            showDeleteConfirmation(deleteContact, id, refetch, {
                title: "Əlaqə məlumatlarını silmək istəyirsinizmi?",
                text: "Bu əməliyyat geri qaytarıla bilməz!",
                successText: "Əlaqə məlumatları uğurla silindi.",
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
            const worksheet = workbook.addWorksheet("Əlaqə Mesajları")

            // Set worksheet properties
            worksheet.properties.defaultRowHeight = 25

            // Define columns
            worksheet.columns = [
                { header: "Sıra", key: "sira", width: 8 },
                { header: "Ad Soyad", key: "ad_soyad", width: 20 },
                { header: "Email", key: "email", width: 25 },
                { header: "Telefon", key: "telefon", width: 15 },
                { header: "Mövzu", key: "movzu", width: 30 },
                { header: "Mesaj", key: "mesaj", width: 50 },
                { header: "Qəbul Tarixi", key: "qebul_tarixi", width: 20 },
            ]

            // Style the header row
            const headerRow = worksheet.getRow(1)
            headerRow.font = { bold: true, color: { argb: "FFFFFF" } }
            headerRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "2563EB" }, // Blue color
            }
            headerRow.alignment = { horizontal: "center", vertical: "middle" }
            headerRow.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            }

            // Add data rows
            data.forEach((contact: Contact, index: number) => {
                const row = worksheet.addRow({
                    sira: index + 1,
                    ad_soyad: contact.full_name,
                    email: contact.email,
                    telefon: contact.phone,
                    movzu: contact.title,
                    mesaj: contact.message,
                    qebul_tarixi: formatDate(contact.createdAt),
                })

                // Style data rows
                row.alignment = { horizontal: "left", vertical: "top", wrapText: true }
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

                // Make email clickable
                const emailCell = row.getCell("email")
                emailCell.value = {
                    text: contact.email,
                    hyperlink: `mailto:${contact.email}`,
                }
                emailCell.font = { color: { argb: "2563EB" }, underline: true }

                // Make phone clickable
                const phoneCell = row.getCell("telefon")
                phoneCell.value = {
                    text: contact.phone,
                    hyperlink: `tel:${contact.phone}`,
                }
                phoneCell.font = { color: { argb: "2563EB" }, underline: true }

                // Set row height for better message display
                row.height = Math.max(25, Math.ceil(contact.message.length / 50) * 15)
            })

            // Add summary row
            const summaryRow = worksheet.addRow({
                sira: "",
                ad_soyad: "",
                email: "",
                telefon: "",
                movzu: `Cəmi: ${data.length} əlaqə mesajı`,
                mesaj: "",
                qebul_tarixi: "",
            })

            summaryRow.font = { bold: true }
            summaryRow.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: "DBEAFE" }, // Light blue
            }

            // Add title and metadata
            worksheet.insertRow(1, [""])
            worksheet.insertRow(1, [""])
            worksheet.insertRow(1, [`İxrac tarixi: ${new Date().toLocaleDateString("az-AZ")}`])
            worksheet.insertRow(1, ["Əlaqə Mesajları Hesabatı"])

            // Style title
            const titleRow = worksheet.getRow(1)
            titleRow.font = { size: 16, bold: true, color: { argb: "2563EB" } }
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
            const filename = `elaqe-mesajlari-${currentDate}.xlsx`

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
        <div className="p-6">
            <div className="mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Əlaqə Mesajları</h1>
                        <p className="text-gray-600">Bütün əlaqə forması təqdimatlarını idarə edin</p>
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
                        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Əlaqə mesajı yoxdur</h3>
                        <p className="text-gray-500 text-center">Hələ ki heç bir əlaqə mesajı yoxdur.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 lg:grid-cols-3">
                    {data?.map((contact: Contact) => (
                        <Card key={contact.id} className="relative hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <CardTitle className="text-lg">{contact.full_name}</CardTitle>
                                    </div>
                                    <Button
                                        onClick={() => handleDelete(contact.id)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <a href={`mailto:${contact.email}`} className="hover:text-blue-600 transition-colors">
                                            {contact.email}
                                        </a>
                                    </div>

                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        <a href={`tel:${contact.phone}`} className="hover:text-blue-600 transition-colors">
                                            {contact.phone}
                                        </a>
                                    </div>

                                    <div className="flex items-start space-x-2 text-sm text-gray-600">
                                        <FileText className="h-4 w-4 mt-0.5" />
                                        <div>
                                            <span className="font-medium text-gray-900">Mövzu: </span>
                                            {contact.title}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-start space-x-2">
                                        <MessageSquare className="h-4 w-4 text-gray-500 mt-0.5" />
                                        <div>
                                            <span className="text-sm font-medium text-gray-900 block mb-1">Mesaj:</span>
                                            <p className="text-sm text-gray-700 leading-relaxed break-all">{contact.message}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100">
                                    <div className="text-xs text-gray-500">Qəbul edildi: {formatDate(contact.createdAt)}</div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">Cəmi {data?.length} əlaqə mesajı</p>
            </div>
        </div>
    )
}
