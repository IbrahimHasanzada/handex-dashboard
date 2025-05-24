"use client"

import type React from "react"

import { useState } from "react"
import { ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { validateImage } from "@/validations/upload.validation"

interface ImageUploadProps {
    onImageUpload: (imageId: number) => void
}

export function ImageUpload({ onImageUpload }: ImageUploadProps) {
    const [imageState, setImageState] = useState<{
        preview: string | null
        id: number | null
        error: string | null
        selectedFile: File | null
    }>({
        preview: null,
        id: null,
        error: null,
        selectedFile: null,
    })
    const [altText, setAltText] = useState("")
    const [fileLoading, setFileLoading] = useState(false)

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
        if (!file || !altText.trim()) return

        setFileLoading(true)
        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", altText.trim())

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Upload failed")

            const result = await response.json()

            onImageUpload(result.id)
            setImageState({
                preview: result.url,
                id: result.id,
                error: null,
                selectedFile: null,
            })

            console.log("Image uploaded successfully:", result)
        } catch (error) {
            console.error("Upload error:", error)
            setImageState((prev) => ({ ...prev, error: "Şəkil yükləmə xətası" }))
        } finally {
            setFileLoading(false)
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
                                onClick={() => setImageState({ preview: null, id: null, error: null, selectedFile: null })}
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
                {imageState?.selectedFile && altText && (
                    <Button
                        type="button"
                        variant="default"
                        onClick={() => handleUploadWithAlt(imageState.selectedFile!, altText)}
                        disabled={fileLoading}
                    >
                        {fileLoading ? "Yüklənir..." : "Şəkli Yüklə"}
                    </Button>
                )}
                {imageState?.error && <p className="text-sm text-red-500">{imageState.error}</p>}
            </div>
        </div>
    )
}
