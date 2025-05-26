"use client"

import { useState } from "react"
import { Trash2, Mail, Phone, User, MessageSquare, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteContactMutation, useGetContactQuery } from "@/store/handexApi"
import { showDeleteConfirmation } from "@/utils/sweet-alert"
import { toast } from "react-toastify"

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
    const { data, isLoading, refetch } = useGetContactQuery('')
    const [deleteContact] = useDeleteContactMutation()
    const [contacts, setContacts] = useState<Contact[]>([
        {
            id: 1,
            full_name: "Emil Huseynov",
            email: "emilhuseynvh@gmail.com",
            phone: "+994504062435",
            title: "Web Development Inquiry",
            message:
                "I am interested in your web development services. Could you please provide more information about your pricing and timeline?",
            createdAt: "2025-05-19T10:30:00.000Z",
        },
        {
            id: 2,
            full_name: "Leyla Əhmədova",
            email: "leyla.ahmadova@example.com",
            phone: "+994551234567",
            title: "Partnership Opportunity",
            message:
                "Hello, I would like to discuss a potential partnership opportunity with your company. Please contact me at your earliest convenience.",
            createdAt: "2025-05-18T14:22:00.000Z",
        },
        {
            id: 3,
            full_name: "Rəşad Məmmədov",
            email: "rashad.mammadov@example.com",
            phone: "+994701234567",
            title: "Technical Support",
            message:
                "I'm experiencing some issues with your platform and need technical assistance. Could someone from your support team reach out to me?",
            createdAt: "2025-05-17T09:15:00.000Z",
        },
    ])

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
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    return (
        <div className="p-6 ">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Əlaqə Mesajları</h1>
                <p className="text-gray-600">Bütün əlaqə forması təqdimatlarını idarə edin</p>
            </div>



            {isLoading ?
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                :
                (data?.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Contact Messages</h3>
                            <p className="text-gray-500 text-center">There are no contact messages at the moment.</p>
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
                                        <Button onClick={() => handleDelete(contact.id)} variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
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
                ))}


            <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">Cəmi {data?.length} əlaqə mesajı</p>
            </div>
        </div >
    )
}
