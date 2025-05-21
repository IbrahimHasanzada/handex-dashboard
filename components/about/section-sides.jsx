"use client"

import { Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect } from "react"
import { ImageUploadFormItem } from "../image-upload-form-item"
import { FormControl, FormField, FormItem, FormMessage, FormLabel } from "@/components/ui/form"
import { Editor } from "@tinymce/tinymce-react"
import { editorConfig } from "@/utils/editor-config"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

import { toast } from "sonner"
export default function Side({
    form,
    control,
    side,
    contentType,
    imageStates,
    setImageStates,
    handleImageChange,
    handleUploadWithAltText,
    upLoading,
    edit,
    data,
}) {
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
                    edit ? (
                        <div className="space-y-4">
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
                                                    placeholder: "Azərbaycan dilində mətn əlavə edin",
                                                    // Alət panelinin pozisiyasını sabitləyin
                                                    toolbar_sticky: true,
                                                    toolbar_sticky_offset: 0,
                                                    // Redaktorun ölçüsünü özü təyin etməsinə imkan verin
                                                    autoresize_bottom_margin: 50,
                                                    // İnisilializasiya gözləmə vaxtını artırın
                                                    init_instance_callback: (editor) => {
                                                        setTimeout(() => {
                                                            editor.execCommand("mceAutoResize")
                                                            editor.focus()
                                                        }, 500)
                                                    },
                                                    // Alət panelinin yuxarıda görünməsini məcbur edin
                                                    fixed_toolbar_container: "#tinymce-toolbar-container",
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    ) : (
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
                    )
                ) : (
                    <div className="space-y-4">
                        <Label>Image</Label>
                        <div className="space-y-2">
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
                                altFieldName={`${side}ImageAlt`}
                            />

                            {imageStates[side]?.selectedFile && (
                                <div className="mt-4">

                                    <Button
                                        type="button"
                                        className="mt-4 w-full"
                                        disabled={upLoading || !form.getValues(`${side}ImageAlt`)}
                                        onClick={() => {
                                            handleUploadWithAltText(imageStates[side]?.selectedFile, form.getValues(`${side}ImageAlt`), side)

                                        }}
                                    >
                                        {upLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Yüklənir...
                                            </>
                                        ) : (
                                            "Şəkili Yüklə"
                                        )}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </TabsContent>
    )
}
