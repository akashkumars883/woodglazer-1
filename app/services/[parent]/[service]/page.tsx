export const dynamic = "force-dynamic";

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
import { PhoneCall, Sparkles, Check, Clock, Shield, Award, HelpCircle, ArrowRight, CornerDownRight, Layers, Cpu, Settings, Activity } from "lucide-react";

type NestedServicePageProps = {
  params: Promise<{ parent: string; service: string }>;
};

// Rich dynamic technical database based on category slug
const technicalDatabase: Record<string, {
  materialBase: string;
  coatingLayers: string;
  sandingStandards: string;
  glossRange: string;
  curingTime: string;
  careInstructions: string;
  architecturalNote: string;
  stepByStepDetails: { phase: string; details: string }[];
}> = {
  "wood-polishing-services": {
    materialBase: "Premium European Polyurethane & Low-VOC Acrylic Resins",
    coatingLayers: "2 Base Sealer Coats + 2 Protective Undercoats + 2 Luxury Top Lacquer Coats",
    sandingStandards: "Progressive sanding using Grit 220, Grit 400, Grit 600, and Grit 1000 water-emery sheets",
    glossRange: "Mirror High Gloss (95 GU+) or Sophisticated Satin Matte (15 GU)",
    curingTime: "Touch dry in 4 hours, complete curing for furniture usage in 36 hours",
    careInstructions: "Dust with an ultra-soft dry microfiber cloth. Avoid ammonia-based cleaners or direct liquid spills.",
    architecturalNote: "Engineered to deliver exceptional color depth and natural grain highlight while sealing the wood fiber.",
    stepByStepDetails: [
      { phase: "Surface Rectification", details: "Deep machine sanding to remove previous stains, varnishes, dents, and imperfections, revealing fresh raw wood grain." },
      { phase: "Grain Filling & Stain Customization", details: "Application of color-matched high-solid wood fillers and custom-blended spirit stains to establish a uniform tone." },
      { phase: "Sealer Base Priming", details: "Spraying heavy polyurethane sealer base coats to completely lock the pores and prevent structural moisture absorption." },
      { phase: "Precision Sanding", details: "Micro-level hand sanding to level out any sealer grain raising, creating a perfectly flat canvas." },
      { phase: "Topcoat Lacquering", details: "Dual high-volume, low-pressure spray application of high-solid PU or Duco coats inside dust-controlled environments." }
    ]
  },
  "carpentry-services": {
    materialBase: "Boiling Water Proof (BWP) Marine Plywood & Seasoned Hardwoods",
    coatingLayers: "1mm Premium Anti-Scratch Laminate / Natural Wood Veneer with protective sealer lacquer",
    sandingStandards: "Precision calibrated panel sizing with high-tech edge-banding machine trims",
    glossRange: "Ultra Matte Suede finishes, textured metallic laminate, or high-gloss acrylic sheets",
    curingTime: "Instant lock adhesive structural bond, hardware alignments completed within 24 hours",
    careInstructions: "Wipe with a slightly damp cloth. Lubricate soft-closing hinges with light machine oil annually.",
    architecturalNote: "Assembled with modular mortise-and-tenon joints combined with high-tensile industrial-grade steel fasteners.",
    stepByStepDetails: [
      { phase: "On-site Laser Measurement", details: "Supervisors take exact 3D laser dimensions of walls, corners, and floor gradients to plan modular carcass units." },
      { phase: "Material Sourcing & Selection", details: "Sourcing certified ISI-marked ply cores and selecting non-toxic, moisture-resistant laminates/veneers." },
      { phase: "Precision Panel Fabrication", details: "Cutting wood boards with professional sliding-table saws to ensure absolute 90-degree aligned corner joints." },
      { phase: "German Hardware Calibration", details: "Pre-drilling precise hinge sockets and mounting soft-closing drawer channels (Hettich/Hafele standards)." },
      { phase: "Veneer & Edge Lamination", details: "Applying high-pressure synthetic bonding for laminates, completed with heat-fused protective PVC edge bands." }
    ]
  },
  "wallpaper-and-interior-panels": {
    materialBase: "High-density Virgin PVC, Activated Charcoal Polymers & Premium Non-Woven Cellulose fibers",
    coatingLayers: "Co-extruded Protective UV Shielding Layer + Textured Core Foil",
    sandingStandards: "Seamless interlocking groove joints, flush fitting with high-precision corner profiles",
    glossRange: "Textured embossing, metallic foil highlights, or luxurious anti-glare matte panels",
    curingTime: "Adhesive setting within 12 hours. Wall is immediately ready for decorative fixtures.",
    careInstructions: "Extremely easy maintenance. Washable surface; sponge gently with dilute liquid detergent.",
    architecturalNote: "Provides outstanding acoustic dampening, sound insulation, and wall-dampness masking properties without peeling.",
    stepByStepDetails: [
      { phase: "Dampness Inspection", details: "Moisture meter testing of wall surfaces to ensure appropriate base dryness before applying adhesive." },
      { phase: "Wall Leveling & Priming", details: "Applying high-grip wall primer to stabilize loose plaster and maximize adhesive molecular stick." },
      { phase: "Symmetrical Pattern Planning", details: "Layout marking to align fluted panel grooves or ensure wallpaper pattern matching is seamless." },
      { phase: "Adhesive Spreading", details: "Spreading heavy-duty anti-fungal cellulose paste or industrial-grade heavy silicone bondings." },
      { phase: "Panel Interlocking", details: "Fitting panels systematically using interlocking joint grooves and securing with hidden micro-pins." }
    ]
  }
};

export async function generateStaticParams() {
  const { data: subServices } = await supabase
    .from("sub_services")
    .select("slug, service_categories(slug)");

  return (subServices || []).map((sub: { slug: string; service_categories: { slug: string } | { slug: string }[] | null }) => {
    const categories = sub.service_categories;
    const parentSlug = Array.isArray(categories)
      ? categories[0]?.slug
      : categories?.slug;

    return {
      parent: parentSlug || "general",
      service: sub.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: NestedServicePageProps): Promise<Metadata> {
  const { service: serviceSlug } = await params;

  const { data: subService } = await supabase
    .from("sub_services")
    .select("*, service_categories(title, slug)")
    .eq("slug", serviceSlug)
    .single();

  if (!subService) {
    return {};
  }

  const config = await getDynamicSiteConfig();

  const seoTitle = subService.seo_title || `${subService.title} | Premium ${subService.service_categories.title}`;
  const seoDescription = subService.seo_description || subService.description;
  const seoKeywords = subService.seo_keywords && subService.seo_keywords.length > 0
    ? subService.seo_keywords
    : [subService.title, subService.service_categories.title, "Wood Glazer"];

  return buildMetadata({
    title: seoTitle,
    description: seoDescription,
    path: `/services/${subService.service_categories.slug}/${subService.slug}`,
    image: getServiceSeoImage(subService.service_categories.slug),
    keywords: seoKeywords,
  }, config);
}

export default async function NestedServicePage({
  params,
}: NestedServicePageProps) {
  const { service: serviceSlug } = await params;

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

  // Split description text into rich paragraphs
  const paragraphs = (subService.details || subService.description || "").split("\n\n");
  const mainPillars = subService.features || ["Water Resistance", "Premium Curing Finish", "Scratch Prevention", "Architectural Grade"];

  // Fetch specific technical details based on category
  const technicalDetails = technicalDatabase[parentService.slug] || technicalDatabase["wood-polishing-services"];

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <StructuredData
        id={`${parentService.slug}-${subService.slug}-structured-data`}
        data={[
          createBreadcrumbNode([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            {
              name: parentService.title,
              path: `/services/${parentService.slug}`,
            },
            {
              name: subService.title,
              path: `/services/${parentService.slug}/${subService.slug}`,
            },
          ]),
          createSubServiceNode(parentService, subService, config),
        ]}
      />

      {/* Luxury Compact Sub-Service Banner - Matches exactly, no uppercase, no italics */}
      <header className="relative h-[42vh] sm:h-[45vh] min-h-[340px] flex items-center justify-center text-center text-white overflow-hidden bg-stone-950 px-4">
        {/* Crisp background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={subService.image}
            alt={subService.title}
            fill
            className="object-cover opacity-65 scale-105"
            priority
          />
          {/* Subtle dark overlay vignette to ensure text readability while keeping the image vibrant and clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/45 to-stone-950/60" />
        </div>

        <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center">
          {/* Symmetrical breadcrumb indicators - no uppercase, no italics */}
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-primary/90 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-stone-500">/</span>
            <Link href={`/services/${parentService.slug}`} className="hover:text-white transition-colors">{parentService.title}</Link>
            <span className="text-stone-500">/</span>
            <span className="text-stone-400">{subService.title}</span>
          </div>

          {/* Title in single solid white color, no italics */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight mb-4 drop-shadow-lg leading-tight text-white">
            {subService.title}
          </h1>
          <div className="h-1 w-12 bg-primary rounded-full" />
        </div>
      </header>

      {/* Content Layout - no italics, no drop-caps, single solid color titles */}
      <section className="py-20 sm:py-28 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">

            {/* Left Main Editorial Panel (7 Columns) */}
            <div className="lg:col-span-7 space-y-12">
              
              {/* Main Introduction Card - no drop cap, no italics, single color title */}
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-primary">
                  <Sparkles className="h-4 w-4 animate-spin-slow text-primary" />
                  Premium Solution Specification
                </div>
                
                <h2 className="text-2xl sm:text-4xl font-display font-semibold text-stone-950 leading-[1.15]">
                  Sophisticated Artistry and Structural Reliability
                </h2>
                
                <div className="h-1.5 w-20 bg-primary rounded-full" />

                {/* Body paragraph with standard, clean, non-drop-cap paragraphs in solid black */}
                <div className="text-base sm:text-lg text-stone-600 leading-relaxed space-y-6 font-normal">
                  {paragraphs.map((pText: string, pIdx: number) => (
                    <p key={pIdx} className="leading-relaxed text-stone-700">
                      {pText}
                    </p>
                  ))}
                </div>
              </div>

              {/* Unique Technical Merits List - no uppercase, no italics */}
              <div className="space-y-8">
                <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-[0.3em] flex items-center gap-2">
                  <Award className="h-4.5 w-4.5 text-primary" />
                  Technical Suitability Merits
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {mainPillars.map((feat: string, idx: number) => {
                    const parts = feat.split(" — ");
                    const title = parts[0];
                    const subtitle = parts[1] || "High durability and elegant seamless finish.";
                    return (
                      <div 
                        key={idx} 
                        className="p-6 bg-white rounded-2xl border border-stone-200 hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex gap-4 group"
                      >
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-300">
                          <Check className="h-4.5 w-4.5 text-primary group-hover:text-white transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-stone-950 font-display tracking-wider">{title}</h4>
                          <p className="text-xs text-stone-500 leading-normal font-medium">{subtitle}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Consultation Panel (5 Columns) */}
            <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
              
              {/* Specifications Card - no uppercase */}
              <div className="p-8 bg-white border border-stone-200 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.02)] space-y-6">
                <h3 className="text-lg font-semibold font-display text-stone-950 tracking-widest border-b border-stone-100 pb-4 flex items-center justify-between">
                  <span>Specifications</span>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full tracking-wider">Premium</span>
                </h3>

                <ul className="space-y-4 text-sm font-medium">
                  <li className="flex justify-between items-center py-2 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-2"><Clock className="h-4.5 w-4.5 text-primary" /> Duration</span>
                    <span className="text-stone-950 font-semibold">5 - 10 Days</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-2"><Shield className="h-4.5 w-4.5 text-primary" /> Quality Grade</span>
                    <span className="text-stone-950 font-bold">Bespoke Architectural</span>
                  </li>
                  <li className="flex justify-between items-center py-2 border-b border-stone-50">
                    <span className="text-stone-500 flex items-center gap-2"><Award className="h-4.5 w-4.5 text-primary" /> Warranty</span>
                    <span className="text-stone-950 font-bold">Assured Quality</span>
                  </li>
                  <li className="flex justify-between items-center py-2">
                    <span className="text-stone-500 flex items-center gap-2"><HelpCircle className="h-4.5 w-4.5 text-primary" /> Site Inspection</span>
                    <span className="text-stone-950 font-bold text-primary flex items-center gap-1">Free Measure Visit</span>
                  </li>
                </ul>
              </div>

              {/* Consultation trigger card */}
              <div className="p-8 sm:p-10 bg-stone-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 z-0" />
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
                
                <div className="relative z-10 space-y-6">
                  <div className="h-10 w-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                    <PhoneCall className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-display font-medium text-white leading-tight">
                    Ready to transform your space?
                  </h3>
                  <p className="text-stone-400 text-sm leading-relaxed font-medium">
                    Discuss materials, custom shade options, or book a free supervisor site measurement at your home.
                  </p>
                  
                  <div className="space-y-4 pt-2">
                    <a
                      href="https://wa.me/919717048359"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center rounded-2xl bg-primary hover:bg-white text-stone-950 font-bold py-4.5 text-base shadow-xl hover:-translate-y-0.5 transition-all duration-300 gap-2"
                    >
                      WhatsApp Support
                    </a>
                    <a
                      href="tel:+919717048359"
                      className="w-full inline-flex items-center justify-center rounded-2xl bg-transparent border border-stone-700 hover:border-white text-white font-bold py-4.5 text-base transition-all duration-300 gap-2"
                    >
                      Call: +91 9717048359
                    </a>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Deep Internet Sourced Technical Spec Sheet Section (Fully customized layout) */}
      <section className="py-20 sm:py-28 bg-stone-100 border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-primary font-semibold uppercase tracking-[0.25em] text-xs flex items-center gap-1.5 mb-2">
              <Layers className="h-4.5 w-4.5 text-primary" />
              Technical Application Blueprint
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-medium text-stone-950">
              Architectural Specifications and Process
            </h2>
            <div className="h-1 w-16 bg-primary rounded-full mt-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Spec Sheet Parameters Grid */}
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
                <div className="space-y-1">
                  <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Curing Timeline</span>
                  <p className="text-stone-800 text-sm font-semibold">{technicalDetails.curingTime}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-stone-400 font-bold uppercase tracking-wider">Maintenance Standard</span>
                  <p className="text-stone-800 text-sm font-semibold">{technicalDetails.careInstructions}</p>
                </div>
              </div>

              <div className="bg-stone-50 p-4.5 rounded-2xl border-l-4 border-primary text-xs text-stone-600 leading-relaxed font-medium">
                <strong>Architectural Advisory Note:</strong> {technicalDetails.architecturalNote}
              </div>
            </div>

            {/* Structured Step-by-Step Production Process */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold font-display text-stone-950 flex items-center gap-2 mb-2">
                <Settings className="h-5 w-5 text-primary" /> High-Class Execution Phases
              </h3>

              <div className="space-y-4">
                {technicalDetails.stepByStepDetails.map((step, sIdx) => (
                  <div key={sIdx} className="p-5 bg-white border border-stone-200 rounded-2xl hover:border-primary/40 transition-colors flex gap-4">
                    <span className="h-8 w-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                      0{sIdx + 1}
                    </span>
                    <div className="space-y-1 text-left">
                      <h4 className="text-sm font-bold text-stone-950 font-display">{step.phase}</h4>
                      <p className="text-xs text-stone-500 leading-relaxed font-medium">{step.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Redesigned Project Showcase Section - Cohesive with Page Aesthetic, no italics, no uppercase */}
      {subService.gallery && subService.gallery.length > 0 && (
        <section className="py-20 sm:py-28 bg-white border-y border-stone-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="space-y-4 text-left">
                <span className="text-primary font-semibold uppercase tracking-[0.25em] text-xs flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                  Portfolio Gallery
                </span>
                <h2 className="text-3xl sm:text-5xl font-display font-medium leading-tight text-stone-950">
                  Our Recent Creations
                </h2>
                <div className="h-1 w-16 bg-primary rounded-full" />
              </div>
              <p className="text-stone-600 max-w-sm text-sm sm:text-base font-medium leading-relaxed text-left">
                Witness our high-gloss lamination and carpentry finishes completed across Greenfield Colony and Delhi NCR.
              </p>
            </div>

            {/* Centered compact single column card layout */}
            <div className="max-w-xl mx-auto space-y-12">
              {[subService.image, ...subService.gallery].map((imgUrl, imgIdx) => (
                <div 
                  key={imgIdx} 
                  className="bg-stone-50 rounded-3xl border border-stone-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <Image
                      src={imgUrl}
                      alt={`${subService.title} Showcase ${imgIdx + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-8 bg-white border-t border-stone-100">
                    <span className="text-[10px] font-bold tracking-widest text-primary uppercase block mb-2">
                      Project Finish {imgIdx + 1}
                    </span>
                    <h3 className="text-xl font-bold text-stone-950 font-display">
                      {subService.title}
                    </h3>
                    <p className="text-stone-500 text-sm mt-3 leading-relaxed">
                      Executed and detailed to perfection by {"Wood Glazer's"} master team of skilled artisans using premium-grade materials and industry-best processes.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Suggested Services - no italics, no uppercase */}
      <section className="py-24 sm:py-32 bg-stone-100 border-b border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-16">
            <div className="space-y-3 text-left">
              <span className="text-primary font-semibold uppercase tracking-[0.2em] text-xs">Symmetrical Range</span>
              <h2 className="text-3xl sm:text-4xl font-display font-medium text-stone-950">Similar Specialties</h2>
              <p className="text-stone-500 text-sm sm:text-base font-medium">Explore alternative finishes and carpentry installations within {parentService.title}</p>
            </div>
            <Link 
              href={`/services/${parentService.slug}`} 
              className="inline-flex items-center gap-2 text-primary font-semibold text-xs sm:text-sm uppercase tracking-widest hover:text-stone-950 transition-colors hidden sm:flex"
            >
              View Category
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(parentService.sub_services || [])
              .filter((item: { slug: string; title: string; image: string }) => item.slug !== subService.slug)
              .slice(0, 3)
              .map((item: { slug: string; title: string; image: string; description: string }) => (
                <Link
                  key={item.slug}
                  href={`/services/${parentService.slug}/${item.slug}`}
                  className="rounded-3xl bg-white p-5 border border-stone-200 hover:border-primary/50 hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between group"
                >
                  <div className="space-y-6">
                    <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-stone-50">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-lg sm:text-xl font-display text-stone-950 group-hover:text-primary transition-colors leading-tight">{item.title}</h3>
                      <p className="text-stone-500 text-xs sm:text-sm leading-relaxed line-clamp-3">{item.description}</p>
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-stone-100 flex items-center justify-between text-stone-950 group-hover:text-primary font-bold text-[10px] sm:text-xs uppercase tracking-widest duration-300">
                    <span>Read Details</span>
                    <ArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection categorySlug={parentService.slug} />

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}
