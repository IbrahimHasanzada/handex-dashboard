"use client"

import { MetaIntegrationProps } from "@/types/study-area/meta.dto"
import { MetaList } from "./meta-list"


export function MetaIntegration({
    studyAreaId,
    selectedLanguage,
    onRefresh,
    metaItems = [],
    onCreateMeta,
    onUpdateMeta,
    onDeleteMeta,
}: MetaIntegrationProps) {
    return (
        <MetaList
            metaItems={metaItems}
            selectedLanguage={selectedLanguage}
            onRefresh={onRefresh}
            onCreateMeta={onCreateMeta}
            onUpdateMeta={onUpdateMeta}
            onDeleteMeta={onDeleteMeta}
        />
    )
}
