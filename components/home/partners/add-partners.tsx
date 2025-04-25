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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
// import { useAddPartnerMutation } from "@/store/handexApi"

const formSchema = z.object({
    logo: z.any().optional(),
})

export function AddPartner({ onSuccess }: { onSuccess: () => void }) {
    const [open, setOpen] = useState(false)
    const [logoPreview, setLogoPreview] = useState<string | null>(null)
    // const [addPartner, { isLoading }] = useAddPartnerMutation()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            logo: undefined,
        },
    })

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            form.setValue("logo", file)
        }
    }

    const clearLogo = () => {
        form.setValue("logo", undefined)
        setLogoPreview(null)
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()
            if (values.logo) {
                formData.append("logo", values.logo)
            }

            // await addPartner(formData).unwrap()
            form.reset()
            setLogoPreview(null)
            setOpen(false)
            onSuccess()
        } catch (error) {
            console.error("Failed to add partner:", error)
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
                            {/* <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Yüklənir..." : "Yadda saxla"}
                            </Button> */}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
