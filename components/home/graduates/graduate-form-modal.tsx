"use client"
import type React from "react"
import { X, Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { GraduateFormModalProps } from "@/types/home/graduates.dto"

export default function GraduateFormModal({
    open,
    onOpenChange,
    title,
    description,
    form,
    imageState,
    setImageState,
    handleImageChange,
    onSubmit,
    isLoading,
    isUploading,
    submitButtonText,
    loadingText,
    imageInputId = "image-upload",
}: GraduateFormModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="image"
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
                                                            form.setValue("image", -1)
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
                                                            {isUploading ? (
                                                                <Loader2 className="h-8 w-8 animate-spin" />
                                                            ) : (
                                                                <Upload className="h-8 w-8" />
                                                            )}
                                                        </div>
                                                        <span className="text-sm text-muted-foreground mt-2">Şəkil yüklə</span>
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

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Ad Soyad</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Məzunun adı və soyadı" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="speciality"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>İxtisas</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Məzunun ixtisası" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Ləğv et
                            </Button>
                            <Button type="submit" disabled={isLoading || isUploading}>
                                {isLoading ? loadingText : submitButtonText}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
