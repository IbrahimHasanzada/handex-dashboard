"use client"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { placeholdersNews } from "@/utils/input-placeholders"
import { Trash2 } from 'lucide-react'
import { useState } from "react"
import type { UseFormReturn } from "react-hook-form"

interface MetaTagProps {
    form: UseFormReturn<any>
    index?: number
    onDelete?: () => void
    isMainMeta?: boolean
    setSelectedLanguage?: (lang: string) => void
    selectedLanguage?: string
}

export function MetaTag({
    form,
    index,
    onDelete,
    isMainMeta = false,
    selectedLanguage = "az",
    setSelectedLanguage,
}: MetaTagProps) {
    const [languagesSkip, setLanguagesSkip] = useState<string[]>([])

    const metaNameField = isMainMeta ? "metaName" : `additionalMeta.${index}.metaName`

    return (
        <div className="border p-4 rounded-md relative">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Meta Tag {isMainMeta ? 1 : (index || 0) + 2}</h3>
                {!isMainMeta && onDelete && (
                    <Button type="button" variant="ghost" size="sm" onClick={onDelete} className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </div>

            <FormField
                control={form.control}
                name={metaNameField}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Meta Adı</FormLabel>
                        <FormControl>
                            <Input placeholder="Meta adını daxil edin" {...field} />
                        </FormControl>
                        <FormDescription>
                            Bu ad bütün dillər üçün eyni olacaq (məsələn: description, keywords, author)
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                    <FormLabel>
                        Meta Məzmunu (
                        {selectedLanguage === "az" ? "Azərbaycanca" : selectedLanguage === "en" ? "English" : "Русский"})
                    </FormLabel>
                    {setSelectedLanguage && (
                        <div className="flex space-x-2">
                            <Button
                                type="button"
                                variant={selectedLanguage === "az" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedLanguage("az")}
                            >
                                AZ
                            </Button>
                            <Button
                                type="button"
                                variant={selectedLanguage === "en" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedLanguage("en")}
                            >
                                EN
                            </Button>
                            <Button
                                type="button"
                                variant={selectedLanguage === "ru" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedLanguage("ru")}
                            >
                                RU
                            </Button>
                        </div>
                    )}
                </div>

                {selectedLanguage === "az" && (
                    <FormField
                        control={form.control}
                        name={isMainMeta ? "meta_az" : `additionalMeta.${index}.meta_az`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder={placeholdersNews.az.meta} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {selectedLanguage === "en" && (
                    <FormField
                        control={form.control}
                        name={isMainMeta ? "meta_en" : `additionalMeta.${index}.meta_en`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder={placeholdersNews.en.meta} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                {selectedLanguage === "ru" && (
                    <FormField
                        control={form.control}
                        name={isMainMeta ? "meta_ru" : `additionalMeta.${index}.meta_ru`}
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea placeholder={placeholdersNews.ru.meta} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>
        </div>
    )
}
