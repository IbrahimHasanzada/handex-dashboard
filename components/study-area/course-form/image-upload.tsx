"use client"

import type React from "react"

import { useState } from "react"
import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateImage } from "@/validations/upload.validation"
import { useUploadFileMutation } from "@/store/handexApi"
import { toast } from "react-toastify"
import { imageState } from "@/types/home/graduates.dto"

interface ImageUploadProps {
    onImageUpload: (imageId: number) => void
    setImageState: any,
    imageState: any
    altText: string
    setAltText: any
}

export function ImageUpload({ onImageUpload, setImageState, imageState, setAltText, altText }: ImageUploadProps) {


    const [uploadImage, { isLoading }] = useUploadFileMutation()
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        let validationImage = validateImage(file, setImageState, imageState)
        if (validationImage == false) return

        setImageState({
            preview: URL.createObjectURL(file),
            id: null,
            error: null,
            selectedFile: file,
        })
    }

    const handleUploadWithAlt = async (file: File, altText: string) => {
        if (!file) return

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", altText.trim())

            const result: any = await uploadImage(formData)
            if (result) {
                onImageUpload(result.data.id)
                setImageState({
                    preview: result.data.url,
                    id: result.data.id,
                    error: null,
                    selectedFile: null,
                })
            }
            toast.success("Şəkil uğurla yükləndi")
        } catch (error: any) {
            toast.error("Upload error:", error)
            setImageState((prev: imageState) => ({ ...prev, error: "Şəkil yükləmə xətası" }))
        }
    }

    return (
        <div className="space-y-2">
            <Label>Şəkil</Label>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                        {imageState?.preview ? (
                            <img
                                src={imageState.preview || "/placeholder.svg"}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col gap-2">
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-upload" />
                        <Button type="button" variant="outline" onClick={() => document.getElementById("image-upload")?.click()}>
                            Şəkil seç
                        </Button>
                        {imageState?.preview && (
                            <Button
                                type="button"
                                variant="outline"
                                className="text-destructive"
                                onClick={() => {
                                    setAltText("")
                                    setImageState({ preview: null, id: null, error: null, selectedFile: null })
                                }}
                            >
                                Şəkli sil
                            </Button>
                        )}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="alt-text">Alt Text</Label>
                    <Input
                        id="alt-text"
                        placeholder="Şəkil təsviri daxil edin"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                    />
                </div>
                {imageState.selectedFile && (
                    <Button
                        type="button"
                        variant="default"
                        onClick={() => handleUploadWithAlt(imageState.selectedFile!, altText)}
                        disabled={isLoading}
                    >
                        {isLoading ? "Yüklənir..." : "Şəkli Yüklə"}
                    </Button>
                )}
                {imageState?.error && <p className="text-sm text-red-500">{imageState.error}</p>}
            </div>
        </div>
    )
}
