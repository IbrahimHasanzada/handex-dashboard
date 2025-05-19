"use client"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import type { ImageUploadFormItemProps } from "@/types/image-upload.dto"
import { useEffect } from "react"

export function ImageUploadFormItem({
    form,
    name,
    imageState,
    setImageState,
    handleImageChange,
    isUploading,
    imageInputId = "image-upload",
    label = "Şəkil yüklə",
    altFieldName = "imageAlt",
}: ImageUploadFormItemProps & { altFieldName?: string }) {
    // Make sure the alt field is registered
    useEffect(() => {
        // Ensure the alt field exists in the form
        if (form.getValues(altFieldName) === undefined) {
            form.setValue(altFieldName, "")
        }
    }, [form, altFieldName])

    const handleRemoveImage = () => {
        if (imageState.preview && !imageState.id) {
            URL.revokeObjectURL(imageState.preview)
        }

        setImageState({
            preview: null,
            id: null,
            error: null,
            selectedFile: null,
        })
        form.setValue(name, -1)
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                {/* Image upload section */}
                <FormField
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                            <FormControl>
                                <div className="relative">
                                    {imageState.preview ? (
                                        <div className="relative">
                                            <Image
                                                src={imageState.preview || "/placeholder.svg"}
                                                alt={form.getValues(altFieldName) || "Preview"}
                                                width={100}
                                                height={100}
                                                className="rounded-lg object-cover"
                                            />
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="secondary"
                                                className="absolute -top-2 -right-2 h-6 w-6"
                                                onClick={handleRemoveImage}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                            <input type="hidden" value={field.value || ""} onChange={field.onChange} />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <label htmlFor={imageInputId} className="cursor-pointer flex flex-col items-center">
                                                <div className="h-[100px] w-[100px] bg-muted rounded-lg flex items-center justify-center">
                                                    {isUploading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Upload className="h-8 w-8" />}
                                                </div>
                                                <span className="text-sm text-muted-foreground mt-2">{label}</span>
                                            </label>
                                            <input
                                                id={imageInputId}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleImageChange}
                                                disabled={isUploading}
                                            />
                                            <input type="hidden" value={field.value || ""} onChange={field.onChange} />
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            {imageState.error && <p className="text-sm text-destructive mt-1">{imageState.error}</p>}
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Alt text input field - only show when an image is selected */}
                {imageState.preview && (
                    <div className="p-5">
                        <FormField
                            control={form.control}
                            name={altFieldName}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Şəkil təsviri (Alt text)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Şəkil haqqında təsvir yazın" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
