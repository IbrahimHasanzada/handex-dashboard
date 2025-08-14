"use client"
import HomeHero from "./home/home-hero"
import Testimonials from "./home/testimonials/testimonials"
import Graduates from "./home/graduates/graduates"
import Partners from "./home/partners/partners"
import { MetaTranslations } from "./meta/meta"
import StatisticsSection from "./home/statistics/StatisticsSection"
import { FAQList } from "./home/faq/faqlist"
import { useGetFaqQuery } from "@/store/handexApi"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"

export function DashboardHome() {
  const [selectedLanguage, setSelectedLanguage] = useState("az")
  const { data: faqData, refetch: faqFetch } = useGetFaqQuery({ lang: selectedLanguage, model: "home" }, { skip: !selectedLanguage })

  console.log(faqData)
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <HomeHero />
      </div>

      {/* Testimonials Management */}

      <div>
        <Testimonials slug='home' />
      </div>
      {/* Graduates Management */}
      <div>
        <Graduates />
      </div>

      {/* Partners Management */}
      <Partners />

      {/* Statistic Section */}
      <StatisticsSection field="home" />

      {/* FAQ Section */}
      <Tabs defaultValue={selectedLanguage} onValueChange={(value: string) => setSelectedLanguage(value)}>
        <TabsList>
          <TabsTrigger value="az">Azərbaycanca</TabsTrigger>
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="ru">Русский</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-4">
        <FAQList model="home" faqs={faqData && faqData} selectedLanguage={selectedLanguage} onRefresh={faqFetch} />
      </div>


      {/* Meta for home page */}
      <MetaTranslations slug="home" />
    </div>
  )
}
