"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddSection from "./add-section"
import EditSection from "./edit-section"
import { useEffect } from "react"

export function SectionModal({ open, onOpenChange, edit, data, refetch }) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="flex flex-row items-center justify-between">
                    <div>
                        <DialogTitle>Yeni bölmə əlavə et</DialogTitle>
                        <DialogDescription>Haqqımızda səhifənizə hər iki tərəf üçün məzmunlu yeni bölmə əlavə edin.</DialogDescription>
                    </div>
                </DialogHeader>
                <div className="-mx-6" style={{ position: 'relative', zIndex: 1 }}>
                    {edit ?
                        <EditSection edit={edit} onComplete={() => onOpenChange(false)} data={data} refetch={refetch} />
                        :
                        <AddSection edit={edit} onComplete={() => onOpenChange(false)} refetch={refetch} />
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}
