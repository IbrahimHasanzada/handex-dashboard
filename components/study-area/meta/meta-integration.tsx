"use client"

import { MetaList } from "./meta-list"

interface MetaTranslation {
  name: string
  value: string
  lang: string
}

interface MetaItem {
  id?: number
  translations: MetaTranslation[]
}

interface MetaIntegrationProps {
  studyAreaId?: number
  selectedLanguage: string
  onRefresh: () => void
  metaItems?: MetaItem[]
  onCreateMeta?: (data: MetaItem) => Promise<void>
  onUpdateMeta?: (data: MetaItem) => Promise<void>
  isLoading: boolean
}

export function MetaIntegration({
  studyAreaId,
  selectedLanguage,
  onRefresh,
  metaItems = [],
  onCreateMeta,
  onUpdateMeta,
  isLoading
}: MetaIntegrationProps) {
  return (
    <MetaList
      metaItems={metaItems}
      selectedLanguage={selectedLanguage}
      onRefresh={onRefresh}
      onCreateMeta={onCreateMeta}
      onUpdateMeta={onUpdateMeta}
      isLoading={isLoading}
    />
  )
}
