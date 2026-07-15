export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTASection from "@/components/CTASection";
import { StructuredData } from "@/components/StructuredData";
import {
  buildMetadata,
  createBreadcrumbNode,
  createServiceCategoryNode,
  getServiceSeoImage,
} from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { getDynamicSiteConfig } from "@/lib/site";
import type { Metadata } from "next";
import CategoryFaq from "@/components/CategoryFaq";
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Award, ThumbsUp, Wrench } from "lucide-react";
import { FadeIn } from "@/components/Motion";

type ServicesParentPageProps = {
  params: Promise<{ parent: string }>;
};

export async function generateStaticParams() {
  const { data: services } = await supabase
    .from("service_categories")
    .select("slug");
  
  return (services || []).map((service) => ({
    parent: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: ServicesParentPageProps): Promise<Metadata> {
  const { parent } = await params;
  
  const { data: service } = await supabase
    .from("service_categories")
    .select("*, sub_services(title)")
    .eq("slug", parent)
    .single();

  if (!service) {
    return {};
  }

  const config = await getDynamicSiteConfig();

  const seoTitle = service.seo_title || `${service.title} | Premium Wood Glazer`;
  const seoDescription = service.seo_description || service.description;
  const seoKeywords = service.seo_keywords && service.seo_keywords.length > 0
    ? service.seo_keywords
    : [service.title, ...(service.sub_services || []).map((sub: { title: string }) => sub.title)];

  return buildMetadata({
    title: seoTitle,
    description: seoDescription,
    path: `/services/${service.slug}`,
    image: getServiceSeoImage(service.slug),
    keywords: seoKeywords,
  }, config);
}

const categoryProcesses: Record<string, { step: string; title: string; desc: string }[]> = {
  "wood-polishing-services": [
    {
      step: "01",
      title: "Surface Stripping & Preparation",
      desc: "Old coatings and paints are meticulously chemical-stripped or scraped down. We repair wooden cracks, joints, and holes with high-quality sawdust wood filler epoxies."
    },
    {
      step: "02",
      title: "Sequential Water Sanding",
      desc: "Experienced carpenters perform uniform sanding with coarse to micro-fine emery water sandpapers to level any bumps and raise natural fibers."
    },
    {
      step: "03",
      title: "Wood Pore Grain Sealing",
      desc: "We apply a high-penetration primary sealer basecoat to seal raw wood pores. This prevents uneven polish absorption and ensures color uniformity."
    },
    {
      step: "04",
      title: "Grain Highlighting & Staining",
      desc: "Staining specialists apply custom-tinted dyes or oil stains by hand to enrich and accentuate the natural timber grain contours."
    },
    {
      step: "05",
      title: "Intermediate Sanding & Buffing",
      desc: "Multiple filler coats are sprayed, followed by machine sanding and buffing using fine steel wool to guarantee a perfectly smooth level build-up."
    },
    {
      step: "06",
      title: "Premium Protective Topcoat Finish",
      desc: "The final matte, satin, or mirror-gloss PU/Polyester lacquer topcoat is spray-applied in a dust-free enclosure and left to cure for lasting beauty."
    }
  ],
  "carpentry-services": [
    {
      step: "01",
      title: "Free Site Measurement & Estimate",
      desc: "Our supervisor visits your site to inspect wall alignment, take millimeter-perfect dimensions, and provide a transparent, itemized quotation."
    },
    {
      step: "02",
      title: "Sourcing Seasoned Woods & Ply",
      desc: "We pick premium ISI-certified waterproof plywood, HDHMR boards, and seasoned Teak (Sagan) wood, shielding your custom furniture from moisture and bending."
    },
    {
      step: "03",
      title: "Precision Off-site Prefabrication",
      desc: "Major plywood frames, drawer shells, and shutters are cut, laminated, and pre-assembled at our workshop to minimize dust and noise on your site."
    },
    {
      step: "04",
      title: "Professional On-site Assembly",
      desc: "Expert carpenters transport pre-fabricated modules to your property and assemble them cleanly, adjusting levels for walls and floors perfectly."
    },
    {
      step: "05",
      title: "German Hardware Integration",
      desc: "We install premium hydraulic soft-close hinges, heavy-duty tandem boxes, pull-out storage, and sleek profile handle hardware."
    },
    {
      step: "06",
      title: "Perfect Alignment & Polish Check",
      desc: "Final checks verify that every door is flush, gaps are consistent, drawer movements are silent, and raw edges are edge-banded or polished cleanly."
    }
  ],
  "wallpaper-and-interior-panels": [
    {
      step: "01",
      title: "Wall Inspections & Putty Repairs",
      desc: "Our installers check for moisture dampness. Any surface cracks or peeling paints are scraped, filled with acrylic wall putty, and sanded flat."
    },
    {
      step: "02",
      title: "Laser Grid Alignment Setup",
      desc: "Using modern laser levels and chalk rulers, we draw a perfect vertical and horizontal grid to ensure panels and wallpaper match seams seamlessly."
    },
    {
      step: "03",
      title: "Premium Adhesive Coating",
      desc: "We apply heavy-duty synthetic wallpaper paste or specialized industrial-grade silicone bondings to guarantee high adhesion grip."
    },
    {
      step: "04",
      title: "Joint-Lock Panel Installation",
      desc: "Fluted, charcoal, or PVC panels are secured into each other using advanced interlocking grooves, leaving absolutely zero gaps or visible pins."
    },
    {
      step: "05",
      title: "Edge Corner Silicone Trim",
      desc: "Outer borders, socket boxes, and corners are cleanly fitted with sleek border profiles or color-matched weather-silicones for neat margins."
    }
  ]
};

const valuePillars: Record<string, { title: string; desc: string; icon: typeof ShieldCheck }[]> = {
  "wood-polishing-services": [
    { title: "Dust-Free Spraying", desc: "Advanced enclosed-booth spray tech prevents tiny lint specks in the final lacquer topcoat.", icon: Wrench },
    { title: "Seasoned Sourcing", desc: "We utilize eco-friendly, low-VOC European chemical stains and polyurethanes.", icon: Award },
    { title: "No Yellowing Guarantee", desc: "Our polyurethane topcoats possess premium UV-filters that reject direct sunlight discoloration.", icon: ShieldCheck }
  ],
  "carpentry-services": [
    { title: "Millimeter Accuracy", desc: "Advanced laser levels and precision cutters are utilized for perfect joint alignment.", icon: Wrench },
    { title: "BWP Grade Plywood", desc: "We exclusively employ Boiling Water Proof plywood, completely immune to water damage and decay.", icon: ShieldCheck },
    { title: "Soft-Close German Rails", desc: "Fitted with state-of-the-art German soft-closing channels and hinges.", icon: ThumbsUp }
  ],
  "wallpaper-and-interior-panels": [
    { title: "Interlocking Grooves", desc: "Panels slide perfectly into interlocking grooves, revealing absolutely no joints.", icon: Wrench },
    { title: "100% Waterproof PVC", desc: "Our PVC and Charcoal composites are completely impervious to dampness and termites.", icon: ShieldCheck },
    { title: "Seamless Hanger Crew", desc: "Symmetrical matching alignment with clean trim margins for gorgeous accent focus.", icon: Award }
  ]
};

export default async function ServicesParent({
  params,
}: ServicesParentPageProps) {
  const { parent } = await params;
  
  const { data: service } = await supabase
    .from("service_categories")
    .select("*, sub_services(*)")
    .eq("slug", parent)
    .single();

  const config = await getDynamicSiteConfig();

  if (!service) {
    notFound();
  }

  const pillars = valuePillars[service.slug] || [];
  const processes = categoryProcesses[service.slug] || [];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <StructuredData
        id={`${service.slug}-structured-data`}
        data={[
          createBreadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.title, path: `/services/${service.slug}` },
          ]),
          createServiceCategoryNode(service, config),
        ]}
      />

      {/* Premium Compact Background Image Hero Section */}
      <header className="relative h-[42vh] sm:h-[45vh] min-h-[340px] flex items-center justify-center text-center text-white overflow-hidden bg-stone-950 px-4">
        {/* Full screen background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover opacity-65 scale-105"
            priority
          />
          {/* Subtle dark overlay vignette to ensure text readability while keeping the image vibrant and clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/45 to-stone-950/60" />
        </div>

        <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight mb-4 drop-shadow-lg leading-tight">
            {service.title}
          </h1>
          
          <div className="h-1 w-16 bg-primary rounded-full mb-6" />
          
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-stone-200 font-medium leading-relaxed drop-shadow-md">
            {service.description}
          </p>
        </div>
      </header>

      {/* Value Pillars Section */}
      {pillars.length > 0 && (
        <section className="py-16 bg-white border-b border-stone-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="flex gap-4 p-6 rounded-2xl hover:bg-stone-50 transition-colors duration-300">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-stone-950 font-display">{pillar.title}</h3>
                      <p className="text-stone-600 text-sm leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Specialties Grid Section */}
      <section id="specialties" className="py-24 sm:py-32 scroll-mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-primary font-semibold uppercase text-xs tracking-[0.3em] mb-3 block">
              Sub-Services Range
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-semibold text-stone-950 leading-tight">
              Bespoke Services of {service.title}
            </h2>
            <p className="mt-4 text-stone-600 text-lg sm:text-xl">
              Click on any specialized sub-service below to read their water-resistance ratios, suitability metrics, and technical detail parameters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {(service.sub_services || []).map((subService: { slug: string; image: string; title: string; description: string; features?: string[] }, idx: number) => {
              return (
                <article
                  key={subService.slug}
                  className="group bg-white rounded-3xl border border-stone-200 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="space-y-6">
                    {/* Image Area with luxury aspect ratio */}
                    <div className="relative aspect-[16/11] w-full overflow-hidden rounded-2xl bg-stone-100">
                      <Image
                        src={subService.image}
                        alt={subService.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/20 via-transparent to-transparent" />
                      <span className="absolute bottom-4 left-4 bg-stone-950/85 backdrop-blur-md text-white text-[10px] font-semibold uppercase px-3 py-1.5 rounded-full tracking-wider border border-white/10">
                        Option 0{idx + 1}
                      </span>
                    </div>

                    {/* Content area */}
                    <div className="space-y-4 px-1">
                      <h3 className="text-xl sm:text-2xl font-bold font-display text-stone-950 group-hover:text-primary transition-colors leading-tight">
                        {subService.title}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed line-clamp-3">
                        {subService.description}
                      </p>

                      {/* Display 3 custom mini tags for details/suitability */}
                      {subService.features && subService.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {subService.features.slice(0, 3).map((feat, fIdx) => (
                            <span 
                              key={fIdx} 
                              className="inline-flex items-center gap-1 bg-stone-50 border border-stone-200/80 text-stone-500 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md"
                            >
                              <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                              {feat.split(" — ")[0]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Read details button block */}
                  <div className="pt-6 mt-6 border-t border-stone-100 px-1">
                    <Link 
                      href={`/services/${service.slug}/${subService.slug}`}
                      className="w-full inline-flex items-center justify-between text-sm font-bold text-stone-950 group-hover:text-primary transition-colors uppercase tracking-widest gap-2 group-hover:translate-x-1 duration-300"
                    >
                      Read Technical Details
                      <span className="h-10 w-10 rounded-full bg-stone-50 border border-stone-200 group-hover:bg-primary group-hover:border-primary flex items-center justify-center transition-colors">
                        <ArrowRight className="h-4.5 w-4.5 text-stone-600 group-hover:text-white transition-colors" />
                      </span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

        </div>
      </section>

      {/* Interactive Process Timeline Section */}
      {processes.length > 0 && (
        <section className="py-24 sm:py-32 bg-stone-100 border-y border-stone-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <span className="text-primary font-semibold uppercase text-xs tracking-[0.3em] mb-3 block">
                Execution Excellence
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-semibold text-stone-900 leading-tight">
                Our Work Methodology
              </h2>
              <p className="mt-4 text-stone-600 text-lg sm:text-xl">
                We implement a multi-stage structural quality sequence to ensure every hinge, lacquer coat, and panel aligns perfectly.
              </p>
            </div>

            {/* Premium Interspersed Timeline */}
            <div className="relative">
              {/* Connecting line */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-stone-200/80 hidden lg:block" />

              <div className="space-y-16 lg:space-y-24">
                {processes.map((process, pIdx) => {
                  const isEven = pIdx % 2 === 0;
                  return (
                    <div key={pIdx} className="flex flex-col lg:flex-row items-center justify-between gap-8 relative">
                      
                      {/* Left content block */}
                      <div className={`w-full lg:w-[45%] ${isEven ? 'lg:text-right' : 'lg:order-2 lg:text-left'} space-y-4`}>
                        <div className={`flex items-center gap-3 ${isEven ? 'lg:justify-end' : 'lg:justify-start'}`}>
                          <span className="inline-flex items-center justify-center h-8 w-14 rounded-full bg-primary/20 text-stone-900 text-xs font-black tracking-widest">
                            STAGE
                          </span>
                          <span className="text-xl font-bold text-primary">{process.step}</span>
                        </div>
                        <h3 className="text-2xl font-bold font-display text-stone-950">{process.title}</h3>
                        <p className="text-stone-600 leading-relaxed text-sm sm:text-base font-medium">
                          {process.desc}
                        </p>
                      </div>

                      {/* Center Node dot on desktop */}
                      <div className="absolute left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-white border-4 border-primary shadow-md z-10 hidden lg:block" />

                      {/* Dummy offset block to push content correctly */}
                      <div className="w-full lg:w-[45%] hidden lg:block" />

                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </section>
      )}

      {/* Frequently Asked Questions Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary font-semibold uppercase text-xs tracking-[0.3em] mb-3 block">
              Transparent Details
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-semibold text-stone-900">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-stone-600 text-base">
              Explore answers regarding our custom material recommendations, curing timelines, and measurement bookings.
            </p>
          </div>

          <CategoryFaq slug={service.slug} />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
