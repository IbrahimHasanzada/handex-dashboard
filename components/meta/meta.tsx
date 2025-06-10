"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Plus, Trash } from "lucide-react"
import { useDeleteMetaMutation, useGetMetaQuery } from "@/store/handexApi"
import { TranslationsDialog } from "./add-meta"
import { toast } from "react-toastify"
import { showDeleteConfirmation } from "@/utils/sweet-alert"

// Define the schema for the form
const formSchema = z.object({
    field: z.string().min(1, "Field is required"),
    lang: z.string().min(2, "Language is required"),
})

type Translation = {
    id: number
    field: string
    model: string
    lang: string
    value: string
}

export function MetaTranslations({ slug }: { slug: string }) {
    const [queryParams, setQueryParams] = useState<{ language: string; slug: string } | null>(null)
    const [isOpenMetaModal, setIsOpenMetaModal] = useState(false)
    const [showData, setShowData] = useState<boolean>(false)
    const [deleteMeta, { isLoading: delLoading }] = useDeleteMetaMutation()
    const {
        data,
        error: queryError,
        isLoading,
        refetch,
        isFetching,
    } = useGetMetaQuery(queryParams || { language: "skip", slug: "skip" }, {
        skip: queryParams === null,
        refetchOnMountOrArgChange: true,
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            field: slug,
            lang: "az",
        },
    })
    useEffect(() => {
        if (!isOpenMetaModal && queryParams) {
            refetch()
        }
    }, [isOpenMetaModal, refetch, queryParams])

    function onSubmit(values: z.infer<typeof formSchema>) {
        setQueryParams({
            language: values.lang,
            slug: values.field,
        })
        setShowData(true)
    }

    const handleDeleteMeta = async (id: number) => {
        try {
            showDeleteConfirmation(deleteMeta, id, refetch,
                {
                    title: "Metanı silmək istəyirsinizmi?",
                    text: "Bu əməliyyat geri qaytarıla bilməz!",
                    successText: "Meta uğurla silindi.",
                },
            )
            setShowData(false)
        } catch (error) {
            toast.error("Metanı silərkən xəta baş verdi")
        }
    }

    const handleModalClose = (open: boolean) => {
        setIsOpenMetaModal(open)
        if (!open && queryParams) {
            setTimeout(() => {
                refetch()
            }, 300)
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
                        <Button onClick={() => setIsOpenMetaModal(true)}>
                            <Plus /> Meta əlavə et
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {typeof queryError === "string" ? queryError : "Meta tapılmadı"}
                </div>
            )}

            {showData && data?.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Meta nəticə</CardTitle>
                        <CardDescription>
                            {queryParams?.language}: dili üçün {data?.length} meta göstərilir.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.map((item: any) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>{item.value}</TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteMeta(item.id)}
                                                disabled={delLoading}
                                            >
                                                {delLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            <TranslationsDialog slug={slug} open={isOpenMetaModal} onOpenChange={handleModalClose} />
        </div>
    )
}
