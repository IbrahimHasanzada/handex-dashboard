"use client"
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
import { Button } from "@/components/ui/button"
import type { GraduateFormModalProps } from "@/types/home/graduates.dto"
import { ImageUploadFormItem } from "@/components/image-upload-form-item"

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
                        <ImageUploadFormItem
                            form={form}
                            name="image"
                            imageState={imageState}
                            setImageState={setImageState}
                            handleImageChange={handleImageChange}
                            isUploading={isUploading}
                            imageInputId={imageInputId}
                            label="Şəkil yüklə"
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
