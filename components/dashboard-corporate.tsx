"use client"
import CorporateHero from "./corporate/corporate-hero"
import Partners from "./corporate/partners/partners"
import AdminFeaturesPage from "./featuresSections/features-about"
import StatisticsSection from "./home/statistics/StatisticsSection"
import Testimonials from "./home/testimonials/testimonials"
import { MetaTranslations } from "./meta/meta"

export function DashboardCorporate() {

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

            {/* Meta for corporate page */}
            <MetaTranslations slug="corporate" />
        </div>
    )
}
