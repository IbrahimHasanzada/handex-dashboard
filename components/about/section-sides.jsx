"use client"

import { Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"
import { ImageUploadFormItem } from "../image-upload-form-item"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { editorConfig } from "@/utils/editor-config"
import { Editor } from '@tinymce/tinymce-react';
export default function Side({ form, control, side, contentType, imageStates, setImageStates, handleImageChange, upLoading }) {
    const sideName = `${side}_side`
    const apiKey = process.env.NEXT_PUBLIC_EDITOR_API_KEY

    const placeholders = {
        az: {
            content: "Azərbaycan dilində məzmunu daxil edin...",
        },
        en: {
            content: "Enter content in English...",
        },
        ru: {
            content: "Введите содержание на русском языке...",
        },
    }

    useEffect(() => {
        if (contentType === "text") {
            form.setValue(`${sideName}.url`, "")
        } else if (contentType === "image") {
            const translations = form.getValues(`${sideName}.translations`) || []
            translations.forEach((_, index) => {
                form.setValue(`${sideName}.translations.${index}.value`, "")
            })
        }
    }, [contentType, form, sideName])

    return (
        <TabsContent value={side} className="space-y-4">
            <div className="space-y-4">
                <div>
                    <Label>Content Type</Label>
                    <Controller
                        control={control}
                        name={`${sideName}.type`}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="image">Image</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                </div>

                {contentType === "text" ? (
                    <div className="space-y-4">
                        <Label>Translations</Label>
                        <Tabs defaultValue="az" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="az">Azerbaijani</TabsTrigger>
                                <TabsTrigger value="en">English</TabsTrigger>
                                <TabsTrigger value="ru">Русский</TabsTrigger>
                            </TabsList>

                            <TabsContent value="az" className="space-y-2">
                                <FormField
                                    control={control}
                                    name={`${sideName}.translations.0.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Editor
                                                    value={field.value}
                                                    onEditorChange={(content) => {
                                                        field.onChange(content)
                                                    }}
                                                    apiKey={apiKey}
                                                    init={{
                                                        ...editorConfig,
                                                        language: "az",
                                                        placeholder: placeholders.az.content,
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="en" className="space-y-2">
                                <FormField
                                    control={control}
                                    name={`${sideName}.translations.1.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Editor
                                                    value={field.value}
                                                    onEditorChange={(content) => {
                                                        field.onChange(content)
                                                    }}
                                                    apiKey={apiKey}
                                                    init={{
                                                        ...editorConfig,
                                                        language: "en",
                                                        placeholder: placeholders.en.content,
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>

                            <TabsContent value="ru" className="space-y-2">
                                <FormField
                                    control={control}
                                    name={`${sideName}.translations.2.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Editor
                                                    value={field.value}
                                                    onEditorChange={(content) => {
                                                        field.onChange(content)
                                                    }}
                                                    apiKey={apiKey}
                                                    init={{
                                                        ...editorConfig,
                                                        language: "ru",
                                                        placeholder: placeholders.ru.content,
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Label>Image</Label>
                        <ImageUploadFormItem
                            form={form}
                            name={`${sideName}.url`}
                            imageState={imageStates[side] || { preview: null, id: null, error: null }}
                            setImageState={(newState) => {
                                setImageStates((prev) => ({
                                    ...prev,
                                    [side]: newState,
                                }))
                            }}
                            handleImageChange={handleImageChange(side)}
                            isUploading={upLoading}
                            imageInputId={`${side}-image-upload`}
                            label="Şəkil yüklə"
                        />
                    </div>
                )}
            </div>
        </TabsContent>
    )
}
