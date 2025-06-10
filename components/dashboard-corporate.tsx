"use client"
import CorporateHero from "./corporate/corporate-hero"
import FeaturesSection from "./corporate/features/features-corporate"
import Partners from "./corporate/partners/partners"
import StatisticsSection from "./home/statistics/StatisticsSection"
import { MetaTranslations } from "./meta/meta"

export function DashboardCorporate() {

    return (
        <div className="flex flex-col gap-6 p-6">
            <div>
                <CorporateHero />
            </div>

            <div>
                <FeaturesSection />
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
