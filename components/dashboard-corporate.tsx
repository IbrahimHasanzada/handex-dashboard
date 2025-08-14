"use client"
import { useState } from "react"
import CorporateHero from "./corporate/corporate-hero"
import Partners from "./corporate/partners/partners"
import AdminFeaturesPage from "./featuresSections/features-about"
import { FAQList } from "./home/faq/faqlist"
import StatisticsSection from "./home/statistics/StatisticsSection"
import Testimonials from "./home/testimonials/testimonials"
import { MetaTranslations } from "./meta/meta"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { useGetFaqQuery } from "@/store/handexApi"

export function DashboardCorporate() {
    const [selectedLanguage, setSelectedLanguage] = useState("az")
    const { data: faqData, refetch: faqFetch } = useGetFaqQuery({ lang: selectedLanguage, model: "corporate" }, { skip: !selectedLanguage })

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <CorporateHero />
            </div>

            {/* Testimonials Management */}

            <div>
                <Testimonials slug='corporate' />
            </div>

            <div>
                <AdminFeaturesPage title='Üstünlükləri idarə edin' slug='corporate-informations' />
            </div>

            {/* Partners Management */}
            <Partners />

            {/* Statistics Section */}
            <StatisticsSection field="corporate" />

            {/* FAQ Section */}
            <Tabs defaultValue={selectedLanguage} onValueChange={(value: string) => setSelectedLanguage(value)}>
                <TabsList>
                    <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                    <TabsTrigger value="ru">Русский</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="space-y-4">
                <FAQList model="corporate" faqs={faqData && faqData} selectedLanguage={selectedLanguage} onRefresh={faqFetch} />
            </div>

            {/* Meta for corporate page */}
            <MetaTranslations slug="corporate" />
        </div>
    )
}
