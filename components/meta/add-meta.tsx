"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAddMetaMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { Textarea } from "../ui/textarea"

type Translation = {
    name: string
    value: string
    lang: string
}

const translationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    values: z.array(
        z.object({
            value: z.string().min(1, "Value is required"),
            lang: z.string().min(2, "Language code is required"),
        }),
    ),
    slug: z.string().min(1, "Slug is required"),
})

type TranslationFormValues = z.infer<typeof translationSchema>

const languages = [
    { code: "az", name: "Azerbaijani" },
    { code: "en", name: "English" },
    { code: "ru", name: "Russian" },
]

interface TranslationsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    slug: string
}

export function TranslationsDialog({ open, onOpenChange, slug }: TranslationsDialogProps) {
    const [activeTab, setActiveTab] = useState("az")
    const [addMeta, { isLoading }] = useAddMetaMutation()

    // Initialize form with the new structure
    const form = useForm<TranslationFormValues>({
        resolver: zodResolver(translationSchema),
        defaultValues: {
            name: "",
            values: languages.map((lang) => ({
                value: "",
                lang: lang.code,
            })),
            slug: slug,
        },
    })

    // Handle form submission
    async function onSubmit(data: TranslationFormValues) {
        try {
            // Transform the data to match the API's expected format
            const transformedData = {
                slug: data.slug,
                translations: data.values.map((item) => ({
                    name: data.name,
                    value: item.value,
                    lang: item.lang,
                })),
            }
            console.log(transformedData)
            await addMeta(transformedData).unwrap()
            toast.success("Meta uğurla əlavə edildi")
            form.reset() // Reset form after successful submission
            onOpenChange(false) // Close dialog
        } catch (error) {
            console.error("Error submitting form:", error)
            toast.error("Meta əlavə edərkən xəta baş verdi!")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Meta əlavə et</DialogTitle>
                    <DialogDescription>Müxtəlif dillər üçün meta yaradın. Aşağıdakı təfərrüatları doldurun.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* Name field - shared across all languages */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Meta name əlavə edin..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Language tabs - only for values */}
                        <div className="space-y-4">
                            <FormLabel>Dil</FormLabel>

                            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                <TabsList className="grid grid-cols-3 mb-4">
                                    {languages.map((lang) => (
                                        <TabsTrigger key={lang.code} value={lang.code}>
                                            {lang.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>

                                {languages.map((lang, langIndex) => (
                                    <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name={`values.${langIndex}.value`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Value ({lang.name})</FormLabel>
                                                    <FormControl>
                                                        <Textarea placeholder={`Meta content in ${lang.name}`} {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Hidden field for language code */}
                                        <input type="hidden" {...form.register(`values.${langIndex}.lang`)} value={lang.code} />
                                    </TabsContent>
                                ))}
                            </Tabs>
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Ləğv et
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Metanı yadda saxla
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
