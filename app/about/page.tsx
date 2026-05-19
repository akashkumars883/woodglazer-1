import Image from "next/image";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import { buildMetadata } from "@/lib/seo";
import { FadeIn, FadeInStagger } from "@/components/Motion";
import PageHero from "@/components/PageHero";

export const metadata = buildMetadata({
  title: "About Wood Glazer | 15+ Years of Expert Wood Finishing in Delhi NCR",
  description: "Learn about Wood Glazer's story, philosophy, and team. We are a Faridabad-based wood polishing and carpentry company with 15+ years of experience serving Delhi NCR clients.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main className="bg-white">
      <PageHero
        title="About Wood Glazer"
        subtitle="Our Heritage & Philosophy"
        backgroundImage="/images/about-hero.png"
      />

      {/* Story Section */}
      <section className="py-24 sm:py-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <FadeIn direction="left" className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
              <Image
                src="https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80"
                alt="Wood Glazer Craftsmanship"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-10 left-10 text-white">
                <p className="text-5xl font-display">Mastering the Grain</p>
              </div>
            </FadeIn>
            
            <FadeInStagger className="space-y-10">
              <FadeIn>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
                  The Wood Glazer Story
                </p>
                <h2 className="text-4xl sm:text-5xl font-display font-medium text-secondary leading-tight">
                  Where Nature Meets <br /> <span className="text-primary">Artistic Precision</span>
                </h2>
              </FadeIn>
              
              <FadeIn>
                <p className="text-lg text-stone-600 leading-relaxed font-medium">
                  At Wood Glazer, we do not simply polish wood. We restore its soul. Every knot, every grain, every subtle variation in texture tells the story of the tree it came from — and our mission is to honour and amplify that story with skill, care, and precision.
                </p>
                <p className="mt-6 text-stone-600 leading-relaxed font-medium">
                  Founded and based in Faridabad, Haryana, Wood Glazer has grown from a small carpentry workshop into one of {"Delhi NCR's"} most trusted names in premium wood finishing and interior fit-out. Over 15 years of hands-on work and more than 500 completed projects later, our belief remains the same: every wooden surface deserves the finest treatment available.
                </p>
                <p className="mt-6 text-stone-600 leading-relaxed font-medium">
                  Whether it is a centuries-old heirloom passed down through generations, a freshly installed modular kitchen, a sleek corporate office fit-out, or the warm dining space of a restaurant, our master craftsmen approach every project with the same reverence and commitment to excellence.
                </p>
              </FadeIn>
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 sm:py-32 bg-stone-50 border-y border-stone-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeInStagger className="space-y-8">
            <FadeIn>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
                Our Philosophy
              </p>
              <h2 className="text-3xl sm:text-5xl font-display font-medium text-secondary">
                Craftsmanship That Endures
              </h2>
            </FadeIn>
            <FadeIn>
              <p className="text-lg sm:text-xl text-stone-600 leading-relaxed font-medium max-w-3xl mx-auto">
                The name Wood Glazer reflects the essence of what we do. Glazing, in the traditional sense, refers to applying a protective and aesthetically enhancing layer to a surface — creating depth, sheen, and resilience. That philosophy underpins every service we offer.
              </p>
              <p className="mt-6 text-base sm:text-lg text-stone-500 leading-relaxed max-w-3xl mx-auto">
                We bridge the gap between raw natural beauty and refined luxury. We believe that a well-finished wooden surface is not just a visual upgrade — it is an investment in the longevity and character of your space. Our work is designed not just to look beautiful on day one, but to remain beautiful for years to come.
              </p>
            </FadeIn>
          </FadeInStagger>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 sm:py-40 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-32">
            <FadeIn className="space-y-8">
              <h3 className="text-3xl font-display font-medium text-secondary flex items-center gap-4">
                <span className="text-primary">01.</span> Our Vision
              </h3>
              <p className="text-lg text-stone-600 leading-relaxed font-medium border-l-2 border-primary/20 pl-8">
                To redefine the standards of premium interior wood finishing in India, and to become the most trusted name for homeowners, interior designers, and commercial clients who value perfection in every grain.
              </p>
            </FadeIn>
            <FadeIn className="space-y-8">
              <h3 className="text-3xl font-display font-medium text-secondary flex items-center gap-4">
                <span className="text-primary">02.</span> Our Mission
              </h3>
              <p className="text-lg text-stone-600 leading-relaxed font-medium border-l-2 border-primary/20 pl-8">
                To blend heritage craftsmanship with modern technological advancements — delivering wooden surfaces that are not just beautiful, but built to last for generations. We achieve this by investing in the finest materials, training our craftsmen continuously, and maintaining an uncompromising standard of quality control across every project we undertake.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats/Metrics */}
      <section className="py-24 sm:py-32 bg-stone-900 text-white overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInStagger className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: "Projects Completed", value: "500+" },
              { label: "Expert Craftsmen", value: "25+" },
              { label: "Years of Experience", value: "15+" },
              { label: "Client Satisfaction Focus", value: "100%" },
            ].map((stat) => (
              <FadeIn key={stat.label} className="space-y-2">
                <p className="text-4xl sm:text-5xl font-display text-primary font-medium">{stat.value}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-400">{stat.label}</p>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>
      </section>

      <WhyChooseUs />

      {/* Why We Are Different */}
      <section className="py-24 sm:py-32 bg-stone-50 border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl sm:text-5xl font-display font-medium text-secondary mb-6">
              What Makes Wood Glazer Different
            </h2>
            <p className="text-lg text-stone-600 font-medium">
              We go beyond standard painting and polishing. Our approach combines traditional artisanal methods with modern technology to deliver a finish that is truly unmatched.
            </p>
          </FadeIn>
          <FadeInStagger className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Artisanal Craftsmanship",
                desc: "Every project at Wood Glazer is handled by master artisans who understand the unique character of different wood species. Our team does not just apply a product and move on. We study the grain, assess the surface condition, and make deliberate choices about technique, product selection, and application method — ensuring the natural beauty of the wood is enhanced, not hidden.",
              },
              {
                title: "Advanced Technology",
                desc: "We combine traditional methods with modern tools. Our workshop employs dust-free sanding machines, premium European spray guns, and climate-controlled curing processes. The result is a finish that is flawless, even, and glass-like — the kind of quality that stands out immediately.",
              },
              {
                title: "Tailored Solutions",
                desc: "No two pieces of wood are identical, and no two projects are the same. We customise our polishing compounds, stains, and application techniques specifically for each project. You will never receive a one-size-fits-all solution from Wood Glazer.",
              },
              {
                title: "Premium Material Sourcing",
                desc: "We use exclusively high-grade PU, melamine, and Duco finishes from globally renowned brands. Every product that enters our workflow has been vetted for quality, safety, and performance.",
              },
              {
                title: "Sustainable & Eco-Friendly",
                desc: "Our processes prioritise eco-friendly coatings and low-VOC finishes where possible. We believe that beautiful interiors and responsible practices can — and should — go hand in hand.",
              }
            ].map((feature, i) => (
              <FadeIn key={i} className="bg-white p-10 rounded-3xl border border-stone-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all group">
                <div className="w-12 h-12 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 text-primary font-display text-xl font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                  0{i + 1}
                </div>
                <h3 className="text-xl font-display font-bold text-secondary mb-4">{feature.title}</h3>
                <p className="text-stone-500 leading-relaxed text-sm">{feature.desc}</p>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>
      </section>

      <Testimonials />
      <CTASection />
    </main>
  );
}
