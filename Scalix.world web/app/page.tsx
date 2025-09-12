import { HeroSection } from '@/components/HeroSection'
import { FeaturesSection } from '@/components/FeaturesSection'
import { CTASection } from '@/components/CTASection'
import { PricingSection } from '@/components/PricingSection'
import { TestimonialsSection } from '@/components/TestimonialsSection'
import { Footer } from '@/components/Footer'
import { Navigation } from '@/components/Navigation'

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      <Navigation />

      <main className="relative">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* CTA Section */}
        <CTASection />

        {/* Pricing Section */}
        <PricingSection />

        {/* Testimonials */}
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  )
}
