"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Trash } from "lucide-react"
import { useDeleteMetaMutation, useGetMetaQuery } from "@/store/handexApi"
import { TranslationsDialog } from "./add-meta"
import { toast } from "react-toastify"

// Define the schema for the form
const formSchema = z.object({
    field: z.string().min(1, "Field is required"),
    lang: z.string().min(2, "Language is required"),
})

// Define the translation type based on the API response
type Translation = {
    id: number
    field: string
    model: string
    lang: string
    value: string
}

export function MetaTranslations() {
    // State to track when to trigger the query
    const [queryParams, setQueryParams] = useState<{ language: string; slug: string } | null>(null)
    const [isOpenMetaModal, setIsOpenMetaModal] = useState(false)
    const [deleteMeta, { isLoading: delLoading }] = useDeleteMetaMutation()
    const {
        data,
        error: queryError,
        isLoading,
        refetch,
        isFetching,
    } = useGetMetaQuery(queryParams || { language: "skip", slug: "skip" }, { skip: queryParams === null })

    const translations: Translation[] = data && data["0"] && data["0"].translations ? data["0"].translations : []

    // Initialize the form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            field: "about",
            lang: "az",
        },
    })

    // Handle form submission
    function onSubmit(values: z.infer<typeof formSchema>) {
        setQueryParams({
            language: values.lang,
            slug: values.field,
        })
    }
    console.log(data)
    const handleDeleteMeta = async (id: number) => {
        try {
            console.log(id)
            await deleteMeta(id).unwrap()
            toast.success('Meta uğurla silindi')
            refetch()
        } catch (error) {
            toast.error('Metanı silərkən xəta baş verdi')
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="grid grid-cols-2">
                    <div>
                        <CardTitle>Meta Translations</CardTitle>
                        <CardDescription>Fetch meta translations for a specific field and language</CardDescription>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={() => setIsOpenMetaModal(true)}><Plus /> Meta əlavə et</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="field"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Field <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormDescription className="text-xs text-muted-foreground">(path)</FormDescription>
                                            <FormControl>
                                                <Input placeholder="e.g., home, about" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="lang"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Language</FormLabel>
                                            <FormDescription className="text-xs text-muted-foreground">(query)</FormDescription>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select language" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="az">Azerbaijani (az)</SelectItem>
                                                    <SelectItem value="en">English (en)</SelectItem>
                                                    <SelectItem value="ru">Russian (ru)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <Button type="submit" disabled={isLoading || isFetching}>
                                {(isLoading || isFetching) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Metaları göstər
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {queryError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                    {typeof queryError === "string" ? queryError : "Failed to fetch translations"}
                </div>
            )}

            {translations.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Translation Results</CardTitle>
                        <CardDescription>
                            {queryParams?.language}: dili üçün {translations.length} meta göstərilir.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {translations.map((translation) => (
                                    <TableRow key={translation.id}>
                                        <TableCell className="font-medium">{translation.field}</TableCell>
                                        <TableCell>{translation.value}</TableCell>
                                        <TableCell className="flex justify-end"> <Button onClick={() => handleDeleteMeta(translation.id)}><Trash /></Button></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <TranslationsDialog open={isOpenMetaModal} onOpenChange={setIsOpenMetaModal} />
        </div>
    )
}
