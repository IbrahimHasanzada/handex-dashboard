"use client"

import type React from "react"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImageIcon, Loader2, Upload } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { imageState } from "@/types/home/graduates.dto"

interface MediaTabProps {
  form: UseFormReturn<any>
  imageState: imageState & {
    selectedFile: File | null
    isUploading: boolean
  }
  setImageState: React.Dispatch<
    React.SetStateAction<
      imageState & {
        selectedFile: File | null
        isUploading: boolean
      }
    >
  >
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  uploadSelectedImage: () => Promise<void>
  handleRemoveImage: () => void
  handleSelectImage: () => void
  fileInputRef: any
}

export function MediaTab({
  form,
  imageState,
  handleFileChange,
  uploadSelectedImage,
  handleRemoveImage,
  handleSelectImage,
  fileInputRef,
}: MediaTabProps) {
  return (
    <FormField
      control={form.control}
      name="featuredImage"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Seçilmiş Şəkil</FormLabel>
          <FormControl>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-40 w-40 overflow-hidden rounded-md border">
                  {imageState.isUploading ? (
                    <div className="w-full h-full flex justify-center items-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : imageState.preview ? (
                    <img
                      src={imageState.preview || "/placeholder.svg"}
                      alt="Featured image"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" onClick={handleSelectImage}>
                    Şəkil seç
                  </Button>
                  {imageState.preview && (
                    <Button type="button" variant="outline" className="text-destructive" onClick={handleRemoveImage}>
                      Şəkli sil
                    </Button>
                  )}
                </div>
              </div>

              {imageState.preview && !imageState.id && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="imageAlt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şəkil təsviri (Alt text)</FormLabel>
                        <FormControl>
                          <Input placeholder="Şəkil haqqında təsvir yazın" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>Bu təsvir şəkil yüklənərkən backend-ə göndəriləcək</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="button"
                    onClick={uploadSelectedImage}
                    disabled={imageState.isUploading}
                    className="w-full"
                  >
                    {imageState.isUploading ? (
                      <div className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Yüklənir...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Upload className="mr-2 h-4 w-4" />
                        Şəkili yüklə
                      </div>
                    )}
                  </Button>
                </div>
              )}

              {imageState.id && (
                <FormField
                  control={form.control}
                  name="imageAlt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şəkil təsviri (Alt text)</FormLabel>
                      <FormControl>
                        <Input placeholder="Şəkil haqqında təsvir yazın" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormDescription>
                        Şəkil artıq yüklənib. Dəyişmək üçün şəkli silib yenidən yükləyin.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
