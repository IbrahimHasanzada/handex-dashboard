"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FileText, Loader2, Pen, Plus, Upload, X } from "lucide-react"
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

const MAX_FILE_SIZE = 5 * 1024 * 1024

const formSchema = z.object({
    fileId: z.number().min(1, "Fayl tələb olunur"),
    title_az: z.string().min(3, "Başlıq (AZ) minimum 3 simvol olmalıdır"),
    title_en: z.string().refine((v) => !v || v.trim().length >= 3, "Başlıq (EN) minimum 3 simvol olmalıdır"),
    title_ru: z.string().refine((v) => !v || v.trim().length >= 3, "Başlıq (RU) minimum 3 simvol olmalıdır"),
})

export const isPdf = (url?: string, type?: string) =>
    type === "application/pdf" || (!!url && /\.pdf($|\?)/i.test(url))

interface AddReferenceLetterProps {
    refetch: () => void
    editItem?: {
        id: number
        fileId: number
        url: string
        titles: { az: string; en: string; ru: string }
    }
}

const emptyFile = { preview: null as string | null, id: null as number | null, pdf: false }

export function AddReferenceLetter({ refetch, editItem }: AddReferenceLetterProps) {
    const [open, setOpen] = useState(false)
    const [fileState, setFileState] = useState(emptyFile)

    const [addContent, { isLoading: isAdding }] = useAddContentMutation()
    const [updateContent, { isLoading: isUpdating }] = useUpdateContentMutation()
    const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation()

    const isEditing = !!editItem
    const isLoading = isAdding || isUpdating || isUploading

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { fileId: 0, title_az: "", title_en: "", title_ru: "" },
    })

    useEffect(() => {
        if (!open) return
        if (editItem) {
            form.reset({
                fileId: editItem.fileId,
                title_az: editItem.titles.az,
                title_en: editItem.titles.en,
                title_ru: editItem.titles.ru,
            })
            setFileState({ preview: editItem.url, id: editItem.fileId, pdf: isPdf(editItem.url) })
        } else {
            form.reset({ fileId: 0, title_az: "", title_en: "", title_ru: "" })
            setFileState(emptyFile)
        }
    }, [editItem, form, open])

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return

        if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
            toast.error("Yalnız şəkil və ya PDF yükləyə bilərsiniz")
            return
        }
        if (file.size > MAX_FILE_SIZE) {
            toast.error("Faylın ölçüsü 5MB-dan çox ola bilməz")
            return
        }

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", form.getValues("title_az") || file.name)

            const response = await uploadFile(formData).unwrap()

            setFileState({ preview: response.url, id: response.id, pdf: isPdf(response.url, file.type) })
            form.setValue("fileId", response.id, { shouldValidate: true })
            toast.success("Fayl uğurla yükləndi")
        } catch (error) {
            toast.error("Fayl yükləyərkən xəta baş verdi")
        }
    }

    const clearFile = () => {
        form.setValue("fileId", 0)
        setFileState(emptyFile)
    }

    const handleFormSubmit = form.handleSubmit(
        async (values) => {
            const requestData = {
                translations: (["az", "en", "ru"] as const)
                    .filter((lang) => values[`title_${lang}`].trim())
                    .map((lang) => ({
                        title: values[`title_${lang}`].trim(),
                        desc: values[`title_${lang}`].trim(),
                        lang,
                    })),
                images: [values.fileId],
                slug: "reference-letters",
            }

            try {
                if (isEditing) {
                    await updateContent({ id: editItem.id, params: requestData }).unwrap()
                    toast.success("Referans məktubu uğurla yeniləndi")
                } else {
                    await addContent(requestData).unwrap()
                    toast.success("Referans məktubu uğurla əlavə edildi")
                }

                setOpen(false)
                refetch()
            } catch (error) {
                console.error("Submission error:", error)
                toast.error("Xəta baş verdi")
            }
        },
        (errors) => {
            Object.values(errors).forEach((error: any) => error?.message && toast.error(error.message))
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
                        <Plus className="mr-2 h-4 w-4" /> Yeni məktub
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Referans məktubunu redaktə et" : "Yeni referans məktubu"}</DialogTitle>
                    <DialogDescription>Şəkil və ya PDF faylı yükləyin və hər dil üçün başlıq daxil edin.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={handleFormSubmit} className="space-y-5">
                        <FormField
                            control={form.control}
                            name="fileId"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Fayl (şəkil və ya PDF, maks. 5MB)</FormLabel>
                                    {fileState.preview ? (
                                        <div className="relative w-fit">
                                            {fileState.pdf ? (
                                                <a
                                                    href={fileState.preview}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 border rounded-md px-4 py-3 hover:bg-muted"
                                                >
                                                    <FileText className="h-6 w-6" />
                                                    <span className="text-sm">PDF faylına bax</span>
                                                </a>
                                            ) : (
                                                <img
                                                    src={fileState.preview}
                                                    alt="preview"
                                                    className="h-32 w-auto object-contain border rounded-md p-2"
                                                />
                                            )}
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                onClick={clearFile}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <FormControl>
                                            <label
                                                htmlFor="reference-file-upload"
                                                className="cursor-pointer flex w-fit items-center gap-2 border rounded-md px-4 py-2 hover:bg-muted"
                                            >
                                                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                                                <span>{isUploading ? "Yüklənir..." : "Fayl seç"}</span>
                                                <Input
                                                    id="reference-file-upload"
                                                    type="file"
                                                    accept="image/*,application/pdf"
                                                    className="hidden"
                                                    disabled={isUploading}
                                                    onChange={handleFileChange}
                                                />
                                            </label>
                                        </FormControl>
                                    )}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {(["az", "en", "ru"] as const).map((lang) => (
                            <FormField
                                key={lang}
                                control={form.control}
                                name={`title_${lang}`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Başlıq ({lang.toUpperCase()})
                                            {lang !== "az" && <span className="text-muted-foreground font-normal"> — istəyə bağlı</span>}
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Məs: ABC Bank — referans məktubu" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Ləğv et
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isAdding || isUpdating ? "Yüklənir..." : isEditing ? "Yenilə" : "Yadda saxla"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
