"use client"

import type React from "react"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react'
import { MetaTag } from "./meta-tag"
import type { UseFormReturn } from "react-hook-form"

interface MetaTabProps {
    form: UseFormReturn<any>
    metaFields: number[]
    setMetaFields: React.Dispatch<React.SetStateAction<number[]>>
    addNewMetaField: () => void
    selectedLanguage: string
    setSelectedLanguage: (lang: string) => void
}

export function MetaTab({
    form,
    metaFields,
    setMetaFields,
    addNewMetaField,
    selectedLanguage,
    setSelectedLanguage,
}: MetaTabProps) {
    const removeMetaField = (indexToRemove: number) => {
        setMetaFields((prev) => prev.filter((_, i) => i !== indexToRemove))

        // Get current additionalMeta array
        const currentAdditionalMeta = [...form.getValues("additionalMeta")]

        // Remove the item at the specified index
        currentAdditionalMeta.splice(indexToRemove - 1, 1)

        // Update the form value
        form.setValue("additionalMeta", currentAdditionalMeta)
    }

    return (
        <div className="space-y-6">
            <MetaTag
                form={form}
                isMainMeta={true}
                selectedLanguage={selectedLanguage}
                setSelectedLanguage={setSelectedLanguage}
            />

            {metaFields.slice(1).map((fieldIndex, index) => (
                <MetaTag
                    key={fieldIndex}
                    form={form}
                    index={index}
                    onDelete={() => removeMetaField(index + 1)}
                    selectedLanguage={selectedLanguage}
                    setSelectedLanguage={setSelectedLanguage}
                />
            ))}

            <Button type="button" variant="outline" onClick={addNewMetaField} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Yeni meta əlavə et
            </Button>

            <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                            <Textarea placeholder="Slug əlavə edin" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
