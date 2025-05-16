"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddSection from "./add-section"

export function AddSectionModal({ open, onOpenChange }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle>Yeni bölmə əlavə et</DialogTitle>
                        <DialogDescription>Haqqımızda səhifənizə hər iki tərəf üçün məzmunlu yeni bölmə əlavə edin.</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="-mx-6">
                    <AddSection onComplete={() => onOpenChange(false)} />
                </div>
            </DialogContent>
        </Dialog>
    )
}
