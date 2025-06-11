"use client"
import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, X, Plus, Loader2 } from "lucide-react"
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
import { useGeneralMutation, useUploadFileMutation } from "@/store/handexApi"

const formSchema = z.object({
    id: z.number().nullable(),
    logoAlt: z.string().optional(),
})

export function AddPartner({ refetch, partners }: { refetch: () => void; partners: [{ id: number; url: string }] }) {
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
    const [addPartner, { isLoading }] = useGeneralMutation()
    const [uploadFile, { isLoading: upLoading }] = useUploadFileMutation()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: null,
            logoAlt: "",
        },
    })

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

            form.setValue("id", response.id)
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

        form.setValue("id", null)
        form.setValue("logoAlt", "")
        setLogoState({
            preview: null,
            id: null,
            error: null,
            selectedFile: null,
        })
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        // Check if we have an unuploaded image
        if (logoState.selectedFile && !logoState.id) {
            toast.error("Zəhmət olmasa əvvəlcə logonu yükləyin")
            return
        }

        const previousPartners = partners.map((item) => item.id)

        try {
            const { logoAlt, ...submitData } = values

            await addPartner({ company: [...previousPartners, submitData.id] }).unwrap()
            form.reset()
            setLogoState({
                preview: null,
                id: null,
                error: null,
                selectedFile: null,
            })
            setOpen(false)
            toast.success("Tərəfdaş uğurla əlavə edildi")
            refetch()
        } catch (error) {
            toast.error("Xəta baş verdi")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Yeni Tərəfdaş
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Yeni Şirkət Əlavə Et</DialogTitle>
                    <DialogDescription>
                        Yeni şirkət məlumatlarını daxil edin. Tamamladıqdan sonra yadda saxla düyməsini basın.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="id"
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

                        {/* Alt text field - only show when a logo is selected but not uploaded */}
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

                                <Button type="button" onClick={uploadLogo} disabled={upLoading} className="w-full">
                                    {upLoading ? (
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
                                {isLoading ? "Yüklənir..." : "Yadda saxla"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
