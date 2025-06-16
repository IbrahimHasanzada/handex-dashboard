import { JSX } from "react"

export const renderFormErrorsStudy = (errors: any, parentPath = ""): JSX.Element[] => {
    const errorElements: JSX.Element[] = []

    const getFieldDisplayName = (path: string): string => {
        const pathMap: Record<string, string> = {
            name: "Kurs Adı",
            slug: "Slug",
            color: "Rəng",
            image: "Şəkil",
            date: "Tarixlər",
            translations: "Tərcümələr",
            course_detail: "Kurs Təfərrüatı",
            faq: "FAQ",
            title: "Başlıq",
            description: "Təsvir",
            program: "Proqram",
            meta: "Meta Məlumatları",
            group: "Qruplar",
            text: "Qrup Adı",
            table: "Cədvəl",
            startDate: "Başlama Tarixi",
            value: "Dəyər",
            lang: "Dil",
        }

        const parts = path.split(".")
        const displayParts = parts.map((part, index) => {
            if (!isNaN(Number(part))) {
                const prevPart = parts[index - 1]
                if (prevPart === "program") return `Proqram ${Number(part) + 1}`
                if (prevPart === "faq") return `FAQ ${Number(part) + 1}`
                if (prevPart === "meta") return `Meta ${Number(part) + 1}`
                if (prevPart === "group") return `Qrup ${Number(part) + 1}`
                if (prevPart === "translations") {
                    const langMap = ["Azərbaycan", "English", "Русский"]
                    return langMap[Number(part)] || `Tərcümə ${Number(part) + 1}`
                }
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
                    <div key={currentPath} className="text-red-600 bg-red-50 p-2 rounded">
                        <strong>{getFieldDisplayName(currentPath)}:</strong> {error.message}
                    </div>,
                )
            } else if (Array.isArray(error)) {
                error.forEach((item, index) => {
                    if (item && typeof item === "object") {
                        errorElements.push(...renderFormErrorsStudy(item, `${currentPath}.${index}`))
                    }
                })
            } else {
                errorElements.push(...renderFormErrorsStudy(error, currentPath))
            }
        }
    })

    return errorElements
}