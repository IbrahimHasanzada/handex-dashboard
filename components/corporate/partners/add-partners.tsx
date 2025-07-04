"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, Pen, Plus, Upload, X } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import { useAddContentMutation, useUpdateContentMutation, useUploadFileMutation } from "@/store/handexApi"

const formSchema = z.object({
    imageId: z.number().min(1, "Şəkil tələb olunur"),
    logoAlt: z.string().optional(),
})

interface AddPartnerProps {
    partners?: any[]
    refetch: () => void
    editPartner?: any
}

export function AddPartner({ partners = [], refetch, editPartner }: AddPartnerProps) {
    const [open, setOpen] = useState(false)
    const [logoState, setLogoState] = useState<{
        preview: string | null
        id: number | null
        error: string | null
        selectedFile: File | null
    }>({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
    })

    const [addContent, { isLoading: isAddingContent }] = useAddContentMutation()
    const [updateContent, { isLoading: isUpdatingContent }] = useUpdateContentMutation()
    const [uploadFile, { isLoading: isUploadingFile }] = useUploadFileMutation()

    const isEditing = !!editPartner
    const isLoading = isAddingContent || isUpdatingContent || isUploadingFile

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageId: 0,
            logoAlt: "",
        },
    })

    // Set form values when editing
    useEffect(() => {
        if (editPartner && open) {
            form.reset({
                imageId: editPartner.imageId,
                logoAlt: editPartner.alt || "",
            })

            if (editPartner.url) {
                setLogoState({
                    preview: editPartner.url,
                    id: editPartner.imageId,
                    error: null,
                    selectedFile: null,
                })
            }
        }
    }, [editPartner, form, open])

    // Reset form when dialog closes
    useEffect(() => {
        if (!open) {
            if (!isEditing) {
                form.reset({
                    imageId: 0,
                    logoAlt: "",
                })
                setLogoState({
                    preview: null,
                    id: null,
                    error: null,
                    selectedFile: null,
                })
            }
        }
    }, [open, form, isEditing])

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setLogoState({
            preview: URL.createObjectURL(file),
            id: null,
            error: null,
            selectedFile: file,
        })
    }

    const uploadLogo = async () => {
        if (!logoState.selectedFile) {
            toast.error("Zəhmət olmasa əvvəlcə logo seçin")
            return
        }

        try {
            const formData = new FormData()
            formData.append("file", logoState.selectedFile)
            formData.append("alt", form.getValues("logoAlt") || "")

            const response = await uploadFile(formData).unwrap()

            setLogoState({
                preview: response.url,
                id: response.id,
                error: null,
                selectedFile: null,
            })

            form.setValue("imageId", response.id)
            toast.success("Logo uğurla yükləndi")
        } catch (error) {
            toast.error("Logo yükləyərkən xəta baş verdi")
            setLogoState({
                ...logoState,
                error: "Logo yükləyərkən xəta baş verdi",
            })
        }
    }

    const clearLogo = () => {
        if (logoState.preview && !logoState.id) {
            URL.revokeObjectURL(logoState.preview)
        }

        form.setValue("imageId", 0)
        form.setValue("logoAlt", "")
        setLogoState({
            preview: null,
            id: null,
            error: null,
            selectedFile: null,
        })
    }

    const handleFormSubmit = form.handleSubmit(
        async (values) => {

            const result = formSchema.safeParse(values);
            // Prevent form submission if logo is selected but not uploaded
            if (logoState.selectedFile && !logoState.id) {
                toast.error("Zəhmət olmasa əvvəlcə logonu yükləyin")
                return
            }
            if (!result.success) {
                result.error.issues.forEach((issue: any) => {
                    toast.error(issue.message);
                });
                return;
            }

            try {
                const requestData = {
                    translations: [
                        {
                            title: 'partners',
                            desc: 'partners',
                            lang: "az",
                        },
                        {
                            title: 'partners',
                            desc: 'partners',
                            lang: "en",
                        },
                        {
                            title: 'partners',
                            desc: 'partners',
                            lang: "ru",
                        },
                    ],
                    images: values.imageId ? [values.imageId] : [],
                    slug: "partners",
                }

                if (isEditing) {
                    await updateContent({
                        id: editPartner.id,
                        params: requestData,
                    }).unwrap()
                    toast.success("Tərəfdaş uğurla yeniləndi")
                } else {
                    await addContent(requestData).unwrap()
                    toast.success("Tərəfdaş uğurla əlavə edildi")
                }

                form.reset()
                setLogoState({
                    preview: null,
                    id: null,
                    error: null,
                    selectedFile: null,
                })
                setOpen(false)
                refetch()
            } catch (error) {
                console.error("Submission error:", error)
                toast.error("Xəta baş verdi")
            }
        },
        (errors) => {
            console.log(errors)
            toast.error("Zəhmət olmasa bütün sahələri doldurun")
        },
    )

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {isEditing ? (
                    <Button variant="secondary" size="icon" className="h-7 w-7">
                        <Pen className="h-4 w-4" />
                    </Button>
                ) : (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Yeni Tərəfdaş
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Tərəfdaşı Redaktə Et" : "Yeni Tərəfdaş Əlavə Et"}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Tərəfdaş məlumatlarını yeniləyin. Tamamladıqdan sonra yadda saxla düyməsini basın."
                            : "Yeni tərəfdaş məlumatlarını daxil edin. Tamamladıqdan sonra yadda saxla düyməsini basın."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="imageId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Logo</FormLabel>
                                    <div className="flex flex-col gap-4">
                                        {logoState.preview ? (
                                            <div className="relative w-fit">
                                                <Image
                                                    src={logoState.preview || "/placeholder.svg"}
                                                    alt={form.getValues("logoAlt") || "Logo preview"}
                                                    width={100}
                                                    height={100}
                                                    className="object-contain border rounded-md p-2"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute -top-2 -right-2 h-6 w-6"
                                                    onClick={clearLogo}
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                                <input type="hidden" value={field.value || ""} onChange={field.onChange} />
                                            </div>
                                        ) : (
                                            <FormControl>
                                                <div className="flex items-center gap-4">
                                                    <label
                                                        htmlFor="logo-upload"
                                                        className="cursor-pointer flex items-center gap-2 border rounded-md px-4 py-2 hover:bg-muted"
                                                    >
                                                        <Upload className="h-4 w-4" />
                                                        <span>Logo yüklə</span>
                                                        <Input
                                                            id="logo-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleLogoChange}
                                                        />
                                                    </label>
                                                    <input type="hidden" value={field.value || ""} onChange={field.onChange} />
                                                </div>
                                            </FormControl>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {logoState.preview && !logoState.id && (
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="logoAlt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Logo Təsviri (Alt text)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Logo haqqında təsvir yazın" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="button" onClick={uploadLogo} disabled={isUploadingFile} className="w-full">
                                    {isUploadingFile ? (
                                        <span className="flex items-center">
                                            <Loader2 className="animate-spin h-4 w-4 mr-1" />
                                            Yüklənir...
                                        </span>
                                    ) : (
                                        <span className="flex items-center">
                                            <Upload className="h-4 w-4 mr-1" />
                                            Logonu yüklə
                                        </span>
                                    )}
                                </Button>
                            </div>
                        )}


                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Ləğv et
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Yüklənir..." : isEditing ? "Yenilə" : "Yadda saxla"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
