import { JSX } from "react";

export const renderFormErrors = (
    errors: Record<string, any>,
    parentPath = ""
): JSX.Element[] => {
    const errorElements: JSX.Element[] = [];

    const pathMap: Record<string, string> = {
        "left_side.translations.0.value": "Sol tərəf Başlıq (AZ)",
        "left_side.translations.1.value": "Sol tərəf Başlıq (EN)",
        "left_side.translations.2.value": "Sol tərəf Başlıq (RU)",
        "right_side.translations.0.value": "Sağ tərəf Başlıq (AZ)",
        "right_side.translations.1.value": "Sağ tərəf Başlıq (EN)",
        "right_side.translations.2.value": "Sağ tərəf Başlıq (RU)",
        "left_side.url": "Sol tərəf URL",
        "right_side.url": "Sağ tərəf URL",
    };

    const getFieldDisplayName = (path: string): string => {
        return pathMap[path] || path;
    };

    Object.entries(errors).forEach(([key, value]) => {
        const currentPath = parentPath ? `${parentPath}.${key}` : key;

        if (value?.message) {
            errorElements.push(
                <p className="text-red-500 text-sm" key={currentPath}>
                    <strong>{getFieldDisplayName(currentPath)}:</strong> {value.message}
                </p>
            );
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => {
                if (item) {
                    errorElements.push(...renderFormErrors(item, `${currentPath}.${index}`));
                }
            });
        } else if (typeof value === "object" && value !== null) {
            errorElements.push(...renderFormErrors(value, currentPath));
        }
    });

    return errorElements;
};
