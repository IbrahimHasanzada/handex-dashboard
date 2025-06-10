"use client"
import HomeHero from "./home/home-hero"
import Testimonials from "./home/testimonials/testimonials"
import Graduates from "./home/graduates/graduates"
import Partners from "./home/partners/partners"
import { MetaTranslations } from "./meta/meta"
import StatisticsSection from "./home/statistics/StatisticsSection"

export function DashboardHome() {

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <HomeHero />
      </div>

      {/* Testimonials Management */}

      <div>
        <Testimonials />
      </div>
      {/* Graduates Management */}
      <div>
        <Graduates />
      </div>

      {/* Partners Management */}
      <Partners />

      {/* Statistic Section */}
      <StatisticsSection field="home" />


      {/* Meta for home page */}
      <MetaTranslations slug="home" />
    </div>
  )
}
