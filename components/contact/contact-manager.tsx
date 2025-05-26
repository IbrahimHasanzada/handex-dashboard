"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trash2, Edit, Plus, Phone, MapPin, Mail, AlertCircle, Loader2 } from "lucide-react"
import { ContactFormData, contactFormSchema, emailSchema, phoneSchema } from "@/validations/contact/contact.validation"
import validatePhone from "@/utils/validate-phone"
import { ContactData, ValidationErrors } from "@/types/contact/contact-manager.dto"
import { useGeneralMutation, useGetGeneralQuery } from "@/store/handexApi"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"

export default function ContactManager() {
    const { data, isLoading } = useGetGeneralQuery('')
    const [updateContactGeneral, { isLoading: isSubmitting }] = useGeneralMutation()
    const [contactData, setContactData] = useState<ContactData>({
        phone: [],
        location: '',
        email: '',
    })
    useEffect(() => {
        if (data) {
            setContactData({
                phone: [...data[0].phone],
                email: data[0].email,
                location: data[0].location
            })
        }
    }, [data])
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [isAddPhoneDialogOpen, setIsAddPhoneDialogOpen] = useState(false)
    const [editForm, setEditForm] = useState<ContactFormData>({
        location: "",
        email: "",
    })
    const [newPhone, setNewPhone] = useState("")
    const [errors, setErrors] = useState<ValidationErrors>({})

    const openEditDialog = () => {
        setEditForm({
            location: contactData.location,
            email: contactData.email,
        })
        setErrors({})
        setIsEditDialogOpen(true)
    }
    const addPhone = async () => {
        try {
            const trimmedPhone = newPhone.trim()

            if (!trimmedPhone) {
                setErrors({ phone: "Telefon nömrəsi tələb olunur" })
                return
            }

            const phoneError = validatePhone(trimmedPhone)
            if (phoneError) {
                setErrors({ phone: phoneError })
                return
            }

            if (contactData.phone.includes(trimmedPhone)) {
                setErrors({ phone: "Bu telefon nömrəsi artıq mövcuddur" })
                return
            }

            updateContactGeneral({ phone: [...contactData.phone, trimmedPhone] }).unwrap()
            toast.success("Telefon nömrəsi uğurla yeniləndi")
            setContactData((prev) => ({
                ...prev,
                phone: [...prev.phone, trimmedPhone],
            }))
            setNewPhone("")
            setErrors({})
            setIsAddPhoneDialogOpen(false)
        } catch (error: any) {
            toast.error(error.data)
        }
    }

    const deletePhone = (index: number) => {

        try {
            showDeleteConfirmation(
                updateContactGeneral,
                { phone: contactData.phone.filter((_, i) => i !== index) },
                () => { },
                {
                    title: "Telefon nömrəsini silmək istəyirsinizmi?",
                    text: "Bu əməliyyat geri qaytarıla bilməz!",
                    successText: "Telefon nömrəsi uğurla silindi.",
                }
            )
        } catch (error: any) {
            toast.error(error.data)
        }
    }

    const updateContact = async () => {
        setErrors({})

        try {
            const validatedData = contactFormSchema.parse(editForm)

            updateContactGeneral({ email: validatedData.email, location: validatedData.location }).unwrap()
            setContactData((prev) => ({
                ...prev,
                location: validatedData.location,
                email: validatedData.email,
            }))
            setIsEditDialogOpen(false)
            toast.success("Əlaqə məlumatarı uğurla yeniləndi")
        } catch (error: any) {
            if (error) {
                const zodError = JSON.parse(error.message)
                const newErrors: ValidationErrors = {}

                zodError.forEach((err: any) => {
                    if (err.path[0] === "location") {
                        newErrors.location = err.message
                    } else if (err.path[0] === "email") {
                        newErrors.email = err.message
                    }
                })
                toast.success(error.data ? error.data : error.message)
                setErrors(newErrors)
            }
        }
    }

    const handlePhoneChange = (value: string) => {
        setNewPhone(value)
        if (errors.phone) {
            const phoneError = validatePhone(value.trim())
            if (!phoneError) {
                setErrors((prev) => ({ ...prev, phone: undefined }))
            }
        }
    }

    const handleFormChange = (field: keyof ContactFormData, value: string) => {
        setEditForm((prev: any) => ({ ...prev, [field]: value }))

        if (errors[field] as any) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Əlaqə</h1>
            </div>

            {isLoading ?
                <div className="flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                :
                <div>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5" />
                                    Telefon Nömrələri
                                </CardTitle>
                                <CardDescription>Əlaqə telefon nömrələrini idarə edin (+994 ilə başlamalıdır)</CardDescription>
                            </div>
                            <Dialog open={isAddPhoneDialogOpen} onOpenChange={setIsAddPhoneDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Telefon nömrəsi əlavə edin
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Telefon nömrəsi əlavə edin</DialogTitle>
                                        <DialogDescription>+994 və ardınca 9 rəqəmlə başlayan yeni telefon nömrəsini daxil edin.</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="phone">Telefon nömrəsi</Label>
                                            <Input
                                                id="phone"
                                                value={newPhone}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                placeholder="+994501234567"
                                                className={errors.phone ? "border-red-500" : ""}
                                            />
                                            {errors.phone && (
                                                <Alert variant="destructive" className="mt-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>{errors.phone}</AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsAddPhoneDialogOpen(false)
                                                setNewPhone("")
                                                setErrors({})
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button onClick={addPhone} disabled={isSubmitting}>
                                            {isSubmitting ? "Əlavə edilir..." : "Əlavə et"}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {contactData.phone.map((phone, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <Badge variant="secondary" className="font-mono">
                                            {phone}
                                        </Badge>
                                        <Button size="sm" variant="destructive" onClick={() => deletePhone(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {contactData.phone.length === 0 && (
                                    <p className="text-muted-foreground text-center py-4">Telefon nömrələri əlavə edilməyib</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5" />
                                    Ünvan
                                </CardTitle>
                                <CardDescription>Biznes ünvanı və yeri (minimum 5 simvol)</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" onClick={openEditDialog}>
                                <Edit className="h-4 w-4 mr-2" />
                                Redaktə et
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed">{contactData.location}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Email
                                </CardTitle>
                                <CardDescription>Əlaqə e-poçt ünvanı</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" onClick={openEditDialog}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="outline" className="font-mono">
                                {contactData.email}
                            </Badge>
                        </CardContent>
                    </Card>
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Əlaqə məlumatlarını redaktə edin</DialogTitle>
                                <DialogDescription>Məkanı və e-poçt ünvanını yeniləyin.</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="location">Ünvan</Label>
                                    <Textarea
                                        id="location"
                                        value={editForm.location}
                                        onChange={(e) => handleFormChange("location", e.target.value)}
                                        placeholder="Enter business address (minimum 5 characters)"
                                        rows={3}
                                        className={errors.location ? "border-red-500" : ""}
                                    />
                                    {errors.location && (
                                        <Alert variant="destructive" className="mt-2">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.location}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={editForm.email}
                                        onChange={(e) => handleFormChange("email", e.target.value)}
                                        placeholder="contact@example.com"
                                        className={errors.email ? "border-red-500" : ""}
                                    />
                                    {errors.email && (
                                        <Alert variant="destructive" className="mt-2">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{errors.email}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditDialogOpen(false)
                                        setErrors({})
                                    }}
                                >
                                    Ləğv et
                                </Button>
                                <Button onClick={updateContact} disabled={isSubmitting}>
                                    {isSubmitting ? "Saving..." : "Save Changes"}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            }
        </div>
    )
}
