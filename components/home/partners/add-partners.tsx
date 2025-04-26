"use client"
import type React from "react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Upload, X, Plus } from "lucide-react"
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
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "react-toastify"
import { useGeneralMutation, useUploadFileMutation } from "@/store/handexApi"

const formSchema = z.object({
    id: z.number().nullable()
})

export function AddPartner({ refetch, partners }: { refetch: () => void, partners: [{ id: number, url: string }] }) {
    const [open, setOpen] = useState(false)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    const [addPartner, { isLoading }] = useGeneralMutation()
    const [uploadFile, { isLoading: upLoading }] = useUploadFileMutation()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: null
        },
    })

    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        try {
            if (file) {
                const formData = new FormData()
                formData.append('file', file)
                const response = await uploadFile(formData).unwrap()
                if (!upLoading) {
                    setLogoPreview(response?.url)
                    form.setValue("id", response?.id)
                }
            }
        } catch (error) {
            toast.error('Şəkil yüklənərkən xəta baş verdi')
        }
    }

    const clearLogo = () => {
        form.setValue("id", null)
        setLogoPreview(null)
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {

        const previousPartners = partners.map(item => item.id)

        try {
            await addPartner({ company: [...previousPartners, values.id] }).unwrap()
            form.reset()
            setLogoPreview(null)
            setOpen(false)
            toast.success('Tərəfdaş uğurla əlavə edildi')
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
                    <DialogTitle>Yeni Tərəfdaş Əlavə Et</DialogTitle>
                    <DialogDescription>
                        Yeni tərəfdaş məlumatlarını daxil edin. Tamamladıqdan sonra yadda saxla düyməsini basın.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormItem>
                            <FormLabel>Logo</FormLabel>
                            <div className="flex flex-col gap-4">
                                {logoPreview ? (
                                    <div className="relative w-fit">
                                        <Image
                                            src={logoPreview || "/placeholder.svg"}
                                            alt="Logo preview"
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
                                        </div>
                                    </FormControl>
                                )}
                            </div>
                        </FormItem>

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
