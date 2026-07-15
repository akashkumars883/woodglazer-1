export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import CTASection from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import {
  buildMetadata,
  createBreadcrumbNode,
  createServicesIndexNode,
} from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { getDynamicSiteConfig } from "@/lib/site";
import { FadeIn } from "@/components/Motion";
import PageHero from "@/components/PageHero";
import { 
  Home, 
  Paintbrush, 
  Briefcase, 
  Utensils, 
  Store, 
  Hotel, 
  MapPin, 
  Check, 
  Sparkles,
  ArrowRight
} from "lucide-react";

export async function generateMetadata() {
  const config = await getDynamicSiteConfig();
  
  return buildMetadata({
    title: "Wood Polishing, Carpentry & Interior Panel Services | Wood Glazer Delhi NCR",
    description: "Explore Wood Glazer's complete range of services — wood polishing, custom carpentry, wallpaper installation, and interior panels. Serving Delhi, Faridabad, Gurugram & Noida.",
    path: "/services",
    keywords: [
      "wood finishing services Delhi NCR",
      "carpentry services near me",
      "wallpaper installation Faridabad",
      "interior panel services",
      "PU polish carpentry Delhi",
      ...config.keywords
    ]
  }, config);
}

const categorySpecialties: Record<string, string[]> = {
  "wood-polishing-services": [
    "Melamine Polish — Smooth, mid-sheen protective coat",
    "PU Polish — Premium deep, crystal-clear polyurethane",
    "PU Paint — Opaque polyurethane coating for modern style",
    "Duco Paint — Flawless, ultra-smooth premium lacquer",
    "Polyester Polish — Diamond-hard, glass-like piano finish",
    "Standard Wood Polish — Spirit-based classic warm polish",
    "Specialty Coatings — Eco-friendly low-VOC finishes"
  ],
  "carpentry-services": [
    "General Woodworking — Professional repairs & assemblies",
    "Residential Joinery — Luxury wardrobes, beds & modular kitchens",
    "Office Fit-outs — Customized workstations & glass partition frames",
    "Restaurant Carpentry — Booth seating, custom bar counters & walls",
    "Bars & Cafes Woodwork — Intricate bar tops & modular display racks",
    "Shop & Showroom Interiors — Bespoke retail display units",
    "Exterior Carpentry — Weatherproof pergolas, decking & screens"
  ],
  "wallpaper-and-interior-panels": [
    "Premium Wallpaper — Elegant vinyl, textures, fabrics & custom prints",
    "Fluted & Ribbed Panels — Sophisticated architectural details",
    "Textured Wall Panels — 3D relief panels for luxury focus walls",
    "Charcoal Panels — Moody, deep charcoal & slate wall panelling",
    "Custom Panel Layouts — Fully tailormade layouts & sizes"
  ]
};

const sectors = [
  {
    title: "Homeowners",
    description: "Bespoke residential carpentry, furniture restoration, custom wardrobes, and high-end wall paneling for your sanctuary.",
    icon: Home,
    color: "from-amber-500/10 to-amber-600/5",
    iconColor: "text-amber-600"
  },
  {
    title: "Interior Designers & Architects",
    description: "A reliable, highly skilled execution partner that translates complex architectural drawings into perfect real-world finishes.",
    icon: Paintbrush,
    color: "from-stone-500/10 to-stone-600/5",
    iconColor: "text-stone-700"
  },
  {
    title: "Corporate Offices",
    description: "Workstations, elegant cabin partitions, reception counters, and executive boardroom joinery completed on tight schedules.",
    icon: Briefcase,
    color: "from-blue-500/10 to-blue-600/5",
    iconColor: "text-blue-600"
  },
  {
    title: "Restaurants & Cafes",
    description: "Custom bar counters, comfortable booth seating, eye-catching feature walls, and atmospheric wooden element installations.",
    icon: Utensils,
    color: "from-emerald-500/10 to-emerald-600/5",
    iconColor: "text-emerald-600"
  },
  {
    title: "Shops & Showrooms",
    description: "Custom retail displays, branded checkout counters, durable shelving, and striking product showcases to drive sales.",
    icon: Store,
    color: "from-rose-500/10 to-rose-600/5",
    iconColor: "text-rose-600"
  },
  {
    title: "Hotels & Hospitality",
    description: "Lobby wood-paneling, executive suite joinery, lounge furniture refinishing, and robust, heavy-use wood coatings.",
    icon: Hotel,
    color: "from-violet-500/10 to-violet-600/5",
    iconColor: "text-violet-600"
  }
];

const localities = [
  "Faridabad (Base)", "South Delhi", "West Delhi", "East Delhi", "North Delhi",
  "Gurugram", "Noida", "Greater Noida", "Ghaziabad", "Indirapuram"
];

export default async function Services() {
  const { data: categories } = await supabase
    .from("service_categories")
    .select("*, sub_services(count)")
    .order("created_at", { ascending: true });

  const services = categories || [];

  return (
    <main className="bg-stone-50 min-h-screen text-stone-900">
      <StructuredData
        id="services-structured-data"
        data={[
          createBreadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          createServicesIndexNode(),
        ]}
      />

      <PageHero
        title="Our Services"
        subtitle="Artistry & Excellence"
        description="Explore our comprehensive range of premium wood finishing, carpentry, and wall styling services dedicated to transforming spaces."
        backgroundImage="/images/services-hero.png"
      />

      {/* Editorial Overview Section */}
      <section className="py-20 bg-white border-b border-stone-200">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-primary font-semibold uppercase text-xs tracking-[0.3em] mb-4 block">
            Crafting Perfection
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-stone-900 leading-tight">
            Premium Wood Finishing & Carpentry for Every Space
          </h2>
          <p className="mt-6 text-lg sm:text-xl leading-relaxed text-stone-600 font-medium">
            Wood Glazer offers a comprehensive range of wood finishing, carpentry, and interior styling services for residential and commercial clients across Delhi NCR. Each service is delivered by experienced craftsmen using high-quality materials and proven techniques, ensuring results that are beautiful, durable, and precisely aligned with your vision.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="h-1 w-20 bg-primary rounded-full"></div>
          </div>
          <p className="mt-6 text-base text-stone-500 max-w-2xl mx-auto leading-relaxed">
            &ldquo;From breathing new life into a dull wardrobe door to executing a full commercial interior fit-out, our team has the skills, tools, and experience to handle projects of every scale and complexity.&rdquo;
          </p>
        </div>
      </section>

      {/* Services Showcase Section */}
      <section className="py-24 sm:py-32 bg-stone-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-20 sm:mb-24">
            <span className="text-primary font-semibold uppercase text-xs tracking-[0.3em] mb-3 block">
              Core Specialties
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-medium text-stone-900">
              Expert Execution Categories
            </h2>
            <p className="mt-4 text-stone-600 text-lg">
              We focus on the fine details of your interiors, ensuring premium protective coatings, stable carpentry joinery, and spectacular wall transformations.
            </p>
          </div>

          <div className="space-y-24">
            {services.map((service: { slug: string; image: string; title: string; description: string; sub_services: { count: number }[] }, index: number) => {
              const specialties = categorySpecialties[service.slug] || [];
              const isEven = index % 2 === 0;

              return (
                <FadeIn key={service.slug} direction={isEven ? "left" : "right"}>
                  <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.05)] border border-stone-200/60 overflow-hidden`}>
                    
                    {/* Visual Card */}
                    <div className={`w-full lg:w-1/2 order-1 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl shadow-xl group">
                        <Image
                          src={service.image}
                          alt={service.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-75 transition-opacity" />
                        <div className="absolute bottom-8 left-8">
                          <span className="text-primary font-black uppercase text-[10px] tracking-[0.3em] mb-2 block">Category 0{index + 1}</span>
                          <h3 className="text-white text-3xl font-display font-semibold">
                            {service.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className={`w-full lg:w-1/2 order-2 ${isEven ? 'lg:order-2' : 'lg:order-1'} space-y-8`}>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-display font-semibold text-stone-950">
                          {service.title}
                        </h3>
                        <p className="mt-4 text-stone-600 text-lg leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Specializations List */}
                      {specialties.length > 0 && (
                        <div className="space-y-4 pt-2">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-primary" />
                            Premium Specializations
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {specialties.map((spec, sIdx) => {
                              const [title, desc] = spec.split(" — ");
                              return (
                                <li key={sIdx} className="flex items-start gap-3 text-stone-700">
                                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                  <div className="text-sm">
                                    <strong className="text-stone-900 block font-semibold">{title}</strong>
                                    {desc && <span className="text-stone-500 font-normal">{desc}</span>}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-stone-100 gap-6">
                        <Link 
                          href={`/services/${service.slug}`}
                          className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-secondary px-8 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-primary shadow-lg hover:-translate-y-0.5 group"
                        >
                          Explore This Category
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <span className="text-stone-400 font-bold uppercase text-[10px] tracking-[0.2em] self-center">
                          {service.sub_services?.[0]?.count || 0} Sub-Services Available
                        </span>
                      </div>
                    </div>

                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* "Who We Serve" Section */}
      <section className="py-24 sm:py-32 bg-white border-y border-stone-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-primary font-semibold uppercase text-xs tracking-[0.3em] mb-3 block">
              Diverse Expertise
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-medium text-stone-900">
              Who We Serve Across Delhi NCR
            </h2>
            <p className="mt-4 text-stone-600 text-lg">
              Our artisanal standard scales flawlessly from private residential estates to busy commercial spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectors.map((sector, idx) => {
              const Icon = sector.icon;
              return (
                <div 
                  key={idx} 
                  className={`group relative bg-stone-50 rounded-3xl p-8 border border-stone-200/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-stone-200/80 hover:-translate-y-1.5 overflow-hidden`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${sector.color} rounded-bl-[4rem] transition-all duration-500 group-hover:scale-125 z-0`} />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-md border border-stone-100">
                      <Icon className={`h-6 w-6 ${sector.iconColor}`} />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-stone-950 font-display">
                        {sector.title}
                      </h3>
                      <p className="text-stone-600 leading-relaxed text-sm">
                        {sector.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* "Service Area" Section */}
      <section className="py-24 sm:py-32 bg-stone-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-xl border border-stone-200/80 overflow-hidden flex flex-col md:flex-row">
            
            {/* Visual highlight */}
            <div className="w-full md:w-2/5 bg-gradient-to-br from-stone-900 to-stone-950 p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(197,133,36,0.15),transparent_60%)] z-0" />
              
              <div className="relative z-10 space-y-4">
                <span className="text-primary font-semibold uppercase text-[10px] tracking-[0.3em] block">
                  Location Matrix
                </span>
                <h3 className="text-3xl font-display font-medium leading-tight">
                  Our Service Area Coverage
                </h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  Headquartered in Greenfield Colony, Faridabad, Haryana, we have an active crew network deployed across the entire NCR.
                </p>
              </div>

              <div className="relative z-10 pt-10 flex items-center gap-4 text-stone-300">
                <MapPin className="h-10 w-10 text-primary shrink-0 animate-bounce" />
                <div className="text-sm">
                  <strong className="text-white block font-semibold">Delhi NCR Service</strong>
                  Expert crews dispatched directly to your site.
                </div>
              </div>
            </div>

            {/* Localities Tags */}
            <div className="w-full md:w-3/5 p-10 sm:p-14 space-y-8">
              <div className="space-y-3">
                <h4 className="text-2xl font-display font-bold text-stone-950">
                  Serving Your Neighborhood
                </h4>
                <p className="text-stone-600 text-base leading-relaxed">
                  We maintain a strictly unified pricing model with zero hidden location surcharges. Contact us to schedule a free site evaluation at your location.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {localities.map((loc, idx) => (
                  <span 
                    key={idx} 
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                      loc.includes("(Base)")
                        ? "bg-primary/20 text-stone-900 border border-primary/40 font-bold shadow-sm"
                        : "bg-stone-50 text-stone-700 border border-stone-200/80 hover:bg-white hover:border-stone-400"
                    }`}
                  >
                    <MapPin className="h-4 w-4 text-stone-400 shrink-0" />
                    {loc}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
