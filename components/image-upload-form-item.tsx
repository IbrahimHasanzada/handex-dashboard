"use client"

import type React from "react"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"
import { ImageUploadFormItemProps } from "@/types/image-upload.dto"



export function ImageUploadFormItem({
    form,
    name,
    imageState,
    setImageState,
    handleImageChange,
    isUploading,
    imageInputId = "image-upload",
    label = "Şəkil yüklə",
}: ImageUploadFormItemProps) {
    return (
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
                                        alt="Preview"
                                        width={100}
                                        height={100}
                                        className="rounded-lg object-cover"
                                    />
                                    <Button
                                        type="button"
                                        size="icon"
                                        variant="secondary"
                                        className="absolute -top-2 -right-2 h-6 w-6"
                                        onClick={() => {
                                            setImageState({ preview: null, id: null, error: null })
                                            form.setValue(name, -1)
                                        }}
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
    )
}
