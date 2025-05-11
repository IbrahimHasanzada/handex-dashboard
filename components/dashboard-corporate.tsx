"use client"
import Testimonials from "./home/testimonials/testimonials"
import Graduates from "./home/graduates/graduates"
import Partners from "./home/partners/partners"
import CorporateHero from "./corporate/corporate-hero"
import FeaturesSection from "./corporate/features/features-corporate"

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
        </div>
    )
}
