import { JSX } from "react"

export const renderFormErrors = (errors: any, parentPath = ""): JSX.Element[] => {
    const errorElements: JSX.Element[] = []

    const getFieldDisplayName = (path: string): string => {
        const pathMap: Record<string, string> = {
            title_az: "Başlıq (AZ)",
            title_en: "Başlıq (EN)",
            title_ru: "Başlıq (RU)",
            content_az: "Təsvir (AZ)",
            content_en: "Təsvir (EN)",
            content_ru: "Təsvir (RU)",
            slug: "Slug",
            featuredImage: "Şəkil",
            category: "Kateqoriya",
            imageAlt: "Şəkil Təsviri",
            meta_az: "Meta (AZ)",
            meta_en: "Meta (EN)",
            meta_ru: "Meta (RU)",
            metaName: "Meta Adı",
            additionalMeta: "Əlavə Meta",
        }

        const parts = path.split(".")
        const displayParts = parts.map((part, index) => {
            if (!isNaN(Number(part))) {
                const prevPart = parts[index - 1]
                if (prevPart === "additionalMeta") return `Meta Məlumatı ${Number(part) + 1}`
                return `${Number(part) + 1}`
            }
            return pathMap[part] || part
        })

        return displayParts.join(" → ")
    }

    Object.keys(errors).forEach((key) => {
        const currentPath = parentPath ? `${parentPath}.${key}` : key
        const error = errors[key]

        if (error && typeof error === "object") {
            if (error.message) {
                errorElements.push(
                    <p className="text-red-500 text-sm" key={currentPath}>
                        <strong>{getFieldDisplayName(currentPath)}:</strong> {error.message}
                    </p>
                )
            } else if (Array.isArray(error)) {
                error.forEach((item, index) => {
                    if (item && typeof item === "object") {
                        errorElements.push(...renderFormErrors(item, `${currentPath}.${index}`))
                    }
                })
            } else {
                errorElements.push(...renderFormErrors(error, currentPath))
            }
        }
    })

    return errorElements
}
