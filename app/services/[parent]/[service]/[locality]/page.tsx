export const revalidate = 3600;

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CTASection from "@/components/CTASection";
import ImageSlider from "@/components/ImageSlider";
import { StructuredData } from "@/components/StructuredData";
import FAQSection from "@/components/FAQSection";
import {
  buildMetadata,
  createBreadcrumbNode,
  createSubServiceNode,
  getServiceSeoImage,
} from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { getDynamicSiteConfig } from "@/lib/site";
import type { Metadata } from "next";
import { PhoneCall, Sparkles, Check, Clock, Shield, Award, HelpCircle, ArrowRight, Layers, Cpu, MapPin } from "lucide-react";

type LocalityServicePageProps = {
  params: Promise<{ parent: string; service: string; locality: string }>;
};

const technicalDatabase: Record<string, {
  materialBase: string;
  coatingLayers: string;
  sandingStandards: string;
  glossRange: string;
  curingTime: string;
}> = {
  "wood-polishing-services": {
    materialBase: "Italian Polyurethane / Premium Polyester",
    coatingLayers: "4 - 5 Coats (Basecoat, Sealer, Sanding, Gloss/Matte Topcoats)",
    sandingStandards: "P180, P320, P600 and P1000 Grits Sanding",
    glossRange: "95%+ Reflective Mirror Finish / 10% Soft Matte Finish",
    curingTime: "24 Hours Full Cure / 12 Hours Touch Dry",
  },
  "carpentry-services": {
    materialBase: "Marine Grade IS-710 Plywood / Action Tesa HDMR",
    coatingLayers: "Dual Structural Framing with Premium Wood Adhesive",
    sandingStandards: "Calibrated Sanding for Flawless Joinery Alignment",
    glossRange: "Custom Satin / Calibrated Architectural Alignment",
    curingTime: "48 Hours Adhesive Bond Curing Time",
  }
};

function getLocalityName(slug: string): string {
  const localities: Record<string, string> = {
    "dlf-phase-1-gurgaon": "DLF Phase 1, Gurgaon",
    "golf-course-road-gurgaon": "Golf Course Road, Gurgaon",
    "sohna-road-gurgaon": "Sohna Road, Gurgaon",
    "vasant-kunj-delhi": "Vasant Kunj, Delhi",
    "greater-kailash-delhi": "Greater Kailash, Delhi",
    "noida-sector-62": "Sector 62, Noida",
  };
  
  if (localities[slug]) {
    return localities[slug];
  }
  
  return slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: LocalityServicePageProps): Promise<Metadata> {
  const { service: serviceSlug, locality: localitySlug } = await params;

  const { data: subService } = await supabase
    .from("sub_services")
    .select("*, service_categories(*)")
    .eq("slug", serviceSlug)
    .single();

  if (!subService) {
    return {};
  }

  const config = await getDynamicSiteConfig();
  const localityName = getLocalityName(localitySlug);

  const seoTitle = `Premium ${subService.title} in ${localityName} | Wood Glazer`;
  const seoDescription = `Bespoke ${subService.title} services in ${localityName} by Wood Glazer. High-end wood polishing, Italian PU finishes, and custom carpentry with elite craftsmanship.`;

  return buildMetadata({
    title: seoTitle,
    description: seoDescription,
    path: `/services/${subService.service_categories.slug}/${subService.slug}/${localitySlug}`,
    image: getServiceSeoImage(subService.service_categories.slug),
    keywords: [subService.title, localityName, `${subService.title} ${localityName}`, "Wood Glazer"],
  }, config);
}

export default async function LocalityServicePage({
  params,
}: LocalityServicePageProps) {
  const { parent: parentSlug, service: serviceSlug, locality: localitySlug } = await params;

  const { data: subService } = await supabase
    .from("sub_services")
    .select("*, service_categories(*, sub_services(*))")
    .eq("slug", serviceSlug)
    .single();

  if (!subService) {
    notFound();
  }

  const config = await getDynamicSiteConfig();
  const parentService = subService.service_categories;
  const localityName = getLocalityName(localitySlug);

  // Split description text into paragraphs
  const paragraphs = (subService.details || subService.description || "").split("\n\n");
  const mainPillars = subService.features || ["Water Resistance", "Premium Curing Finish", "Scratch Prevention", "Architectural Grade"];
  const technicalDetails = technicalDatabase[parentService.slug] || technicalDatabase["wood-polishing-services"];

  // Localized Breadcrumbs Schema
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: parentService.title, path: `/services/${parentService.slug}` },
    { name: subService.title, path: `/services/${parentService.slug}/${subService.slug}` },
    { name: localityName, path: `/services/${parentService.slug}/${subService.slug}/${localitySlug}` },
  ];

  // Localized Service Schema
  const serviceNode = createSubServiceNode(parentService, subService, config);
  serviceNode.name = `${subService.title} in ${localityName}`;
  serviceNode.description = `Bespoke ${subService.title} services executed to perfection in ${localityName} by Wood Glazer.`;
  serviceNode.areaServed = [
    {
      "@type": "Place",
      "name": localityName
    }
  ];

  return (
    <main className="bg-stone-50 text-stone-900 font-sans leading-normal overflow-x-hidden pt-20">
      <StructuredData data={[createBreadcrumbNode(breadcrumbItems), serviceNode]} id={`locality-schema-${localitySlug}`} />

      {/* Localized Header Banner */}
      <header className="relative bg-stone-950 py-24 sm:py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900/50 via-stone-950 to-stone-950 z-10" />
        <div className="absolute inset-0 bg-stone-950/80 z-10" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full">
            <MapPin className="h-4.5 w-4.5 text-primary shrink-0" />
            Serving {localityName}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight mb-4 text-white leading-tight">
            Premium {subService.title} in {localityName}
          </h1>
          <p className="text-stone-400 max-w-3xl mx-auto text-base sm:text-lg">
            Elite custom finishes, architectural PU coatings, and artisan carpentry solutions executed for premium residential homes and duplexes in {localityName}.
          </p>
          <div className="h-1 w-16 bg-primary rounded-full mx-auto" />
        </div>
      </header>

      {/* Main Content Layout */}
      <section className="py-20 sm:py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">

            {/* Left Content column */}
            <div className="lg:col-span-7 space-y-12">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-primary">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Premium Solution Specification
                </div>
                
                <h2 className="text-2xl sm:text-4xl font-display font-semibold text-stone-950 leading-[1.15]">
                  Bespoke Artistry and Structural Excellence
                </h2>
                <div className="h-1.5 w-20 bg-primary rounded-full" />

                <div className="text-base sm:text-lg text-stone-600 leading-relaxed space-y-6 font-normal">
                  <p className="text-stone-700 font-medium">
                    Wood Glazer is proud to extend its ultra-premium wood finishing and carpentry services to the prestigious residences of {localityName}. Our expert artisans bring over 15 years of seasoned expertise directly to your doorstep.
                  </p>
                  {paragraphs.map((pText: string, pIdx: number) => (
                    <p key={pIdx} className="leading-relaxed text-stone-700">
                      {pText}
                    </p>
                  ))}
                </div>
              </div>

              {/* Pillars Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {mainPillars.map((pillar: string, index: number) => (
                  <div key={index} className="flex gap-4 p-6 bg-white rounded-3xl border border-stone-200 shadow-sm">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-950">{pillar}</h4>
                      <p className="text-stone-500 text-xs mt-1">
                        Engineered to meet the luxury durability requirements of high-end homes in {localityName}.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Spec sheet & CTA column */}
            <div className="lg:col-span-5 space-y-12">
              <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md space-y-8">
                <h3 className="text-lg font-bold font-display text-stone-950 border-b border-stone-100 pb-4 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" /> Chemical and Mechanical Properties
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Material Base Formula</span>
                    <p className="text-stone-800 text-sm font-semibold">{technicalDetails.materialBase}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Layering Standard</span>
                    <p className="text-stone-800 text-sm font-semibold">{technicalDetails.coatingLayers}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Sanding Standards</span>
                    <p className="text-stone-800 text-sm font-semibold">{technicalDetails.sandingStandards}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Reflective Gloss Range</span>
                    <p className="text-stone-800 text-sm font-semibold">{technicalDetails.glossRange}</p>
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Curing Timeline</span>
                    <p className="text-stone-800 text-sm font-semibold">{technicalDetails.curingTime}</p>
                  </div>
                </div>

                <div className="h-px bg-stone-100 my-6" />

                <ul className="space-y-4 text-sm font-medium">
                  <li className="flex justify-between items-center py-2 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-2"><Clock className="h-4.5 w-4.5 text-primary" /> Service Turnaround</span>
                    <span className="text-stone-950 font-semibold">5 - 10 Days</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-2"><Shield className="h-4.5 w-4.5 text-primary" /> Locality Coverage</span>
                    <span className="text-stone-950 font-bold">{localityName}</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-stone-500 flex items-center gap-2"><Award className="h-4.5 w-4.5 text-primary" /> Consultation</span>
                    <span className="text-stone-950 font-bold text-primary">Free Measure Visit</span>
                  </li>
                </ul>
              </div>

              {/* Localized Consultation trigger card */}
              <div className="p-8 sm:p-10 bg-stone-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 z-0" />
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                
                <div className="relative z-10 space-y-6">
                  <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <PhoneCall className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-medium text-white leading-tight">
                    Transform your home in {localityName}!
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed font-medium">
                    Discuss custom color shades, PU textures, or book a free supervisor site measurement at your home in {localityName}.
                  </p>
                  
                  <div className="space-y-4 pt-2">
                    <a
                      href="https://wa.me/919717048359"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center rounded-2xl bg-primary hover:bg-white text-stone-950 font-bold py-4.5 text-base shadow-xl hover:-translate-y-0.5 transition-all duration-300 gap-2"
                    >
                      Book Inspection in {localityName}
                      <ArrowRight className="h-4.5 w-4.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Dynamic Localized Q&A FAQ Accordions */}
      <FAQSection categorySlug={parentService.slug} />

      <CTASection />
    </main>
  );
}
