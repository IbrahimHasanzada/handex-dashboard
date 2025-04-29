import { NewsHeaderProps } from "@/types/news/news-header.dto"
import type React from "react"

export function NewsHeader({ heading, text, children }: NewsHeaderProps) {
    return (
        <div className="flex flex-col gap-5 md:gap-0 md:flex-row items-start md:items-center justify-between px-2 ">
            <div className="grid gap-1">
                <h1 className="font-heading text-3xl md:text-4xl">{heading}</h1>
                {text && <p className="text-lg text-muted-foreground hidden md:block">{text}</p>}
            </div>
            {children}
        </div>
    )
}
