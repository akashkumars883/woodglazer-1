export const revalidate = 3600;

import { buildMetadata } from "@/lib/seo";
import { FadeIn } from "@/components/Motion";
import PageHero from "@/components/PageHero";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Compass, 
  Sparkles, 
  MapPin, 
  BookOpen, 
  FileText, 
  ChevronRight, 
  CheckCircle,
  HelpCircle,
  Shield,
  Layers
} from "lucide-react";

export const metadata = buildMetadata({
  title: "HTML Sitemap | Wood Glazer",
  description: "Browse the complete layout and all visual pages of Wood Glazer - your premium wood polishing and carpentry partner in Delhi NCR.",
  path: "/sitemap",
});

export default async function SitemapPage() {
  // Fetch real service categories and sub-services from Supabase
  const { data: categories } = await supabase
    .from("service_categories")
    .select("slug, title, description, sub_services(slug, name)")
    .order("created_at", { ascending: true });

  // Fetch real blog posts from Supabase
  const { data: blogs } = await supabase
    .from("blog_posts")
    .select("slug, title, created_at")
    .order("created_at", { ascending: false });

  const services = categories || [];
  const blogPosts = blogs || [];

  const mainPages = [
    { href: "/", label: "Home", description: "Premium woodwork, glazing, and finish craftsmanship." },
    { href: "/about", label: "About Us", description: "Our legacy, team, and commitment to detail & durability." },
    { href: "/services", label: "All Services", description: "Complete range of premium wood polishing & carpentry." },
    { href: "/blog", label: "Blog Journal", description: "Expert advice, polish guides, and wood maintenance tips." },
    { href: "/contact", label: "Contact Us", description: "Get a free quote and consult with our master artisans." },
  ];

  const premiumLocalities = [
    { slug: "dlf-phase-1-gurgaon", name: "DLF Phase 1, Gurgaon" },
    { slug: "golf-course-road-gurgaon", name: "Golf Course Road, Gurgaon" },
    { slug: "sohna-road-gurgaon", name: "Sohna Road, Gurgaon" },
    { slug: "vasant-kunj-delhi", name: "Vasant Kunj, Delhi" },
    { slug: "greater-kailash-delhi", name: "Greater Kailash, Delhi" },
    { slug: "noida-sector-62", name: "Sector 62, Noida" },
  ];

  const policyPages = [
    { href: "/privacy-policy", label: "Privacy Policy", icon: Shield },
    { href: "/terms-of-service", label: "Terms of Service", icon: FileText },
  ];

  return (
    <main className="bg-stone-50 min-h-screen text-stone-900">
      <PageHero
        title="Sitemap"
        subtitle="Explore Our Website Layout"
        description="A complete visual directory of all pages, services, localities, and articles on Wood Glazer."
        backgroundImage="/images/policies-hero.png"
      />

      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 sm:gap-16">
            
            {/* Left Column: Quick Links & Policies */}
            <div className="space-y-12">
              {/* Main Navigation Pages */}
              <FadeIn direction="left">
                <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md">
                  <h2 className="text-xl font-display font-bold text-stone-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Compass className="h-5 w-5 text-primary" />
                    </div>
                    Main Directory
                  </h2>
                  <div className="space-y-4">
                    {mainPages.map((page) => (
                      <Link 
                        key={page.href}
                        href={page.href}
                        className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-stone-50 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5 text-primary shrink-0 mt-0.5 group-hover:translate-x-1 transition-transform" />
                        <div>
                          <strong className="text-sm font-semibold text-stone-900 block group-hover:text-primary transition-colors">
                            {page.label}
                          </strong>
                          <span className="text-xs text-stone-500 font-medium block mt-0.5">
                            {page.description}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Policy Pages */}
              <FadeIn direction="left" delay={0.2}>
                <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-md">
                  <h2 className="text-xl font-display font-bold text-stone-900 mb-6 flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    Legal & Policies
                  </h2>
                  <div className="grid grid-cols-1 gap-3">
                    {policyPages.map((page) => {
                      const Icon = page.icon;
                      return (
                        <Link 
                          key={page.href}
                          href={page.href}
                          className="group flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/60 hover:bg-white hover:border-primary/50 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-stone-400 group-hover:text-primary transition-colors" />
                            <span className="text-sm font-semibold text-stone-700 group-hover:text-stone-950 transition-colors">
                              {page.label}
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-stone-400 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Middle Column: Services & Localities */}
            <div className="lg:col-span-2 space-y-12">
              
              {/* Dynamic Services & Sub-services */}
              <FadeIn direction="right">
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-md">
                  <h2 className="text-2xl font-display font-bold text-stone-900 mb-8 flex items-center gap-3 pb-4 border-b border-stone-100">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    Services & Sub-Services
                  </h2>
                  
                  <div className="space-y-8">
                    {services.map((cat) => (
                      <div key={cat.slug} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                          <Link 
                            href={`/services/${cat.slug}`}
                            className="text-lg font-bold text-stone-900 hover:text-primary transition-colors font-display"
                          >
                            {cat.title}
                          </Link>
                        </div>
                        
                        {/* Subservices list */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
                          {((cat.sub_services as unknown as { slug: string; name: string }[]) || []).map((sub) => (
                            <Link 
                              key={sub.slug}
                              href={`/services/${cat.slug}/${sub.slug}`}
                              className="group flex items-center gap-2 p-2.5 rounded-xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100"
                            >
                              <div className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform" />
                              <span className="text-sm font-semibold text-stone-600 group-hover:text-stone-900 transition-colors">
                                {sub.name}
                              </span>
                              <ChevronRight className="h-3 w-3 text-stone-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Premium Localities */}
              <FadeIn direction="right" delay={0.2}>
                <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-md">
                  <h2 className="text-2xl font-display font-bold text-stone-900 mb-6 flex items-center gap-3 pb-4 border-b border-stone-100">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    Premium Locality Landing Pages
                  </h2>
                  <p className="text-sm text-stone-500 font-medium mb-6">
                    Our customized subservice designs are optimized for the following premium residential and commercial sectors in Delhi NCR:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.flatMap((cat) => 
                      ((cat.sub_services as unknown as { slug: string; name: string }[]) || []).flatMap((sub) => 
                        premiumLocalities.map((loc) => ({
                          href: `/services/${cat.slug}/${sub.slug}/${loc.slug}`,
                          label: `${sub.name} in ${loc.name}`
                        }))
                      )
                    ).slice(0, 12).map((locPage, index) => ( // limit to 12 featured links for clean aesthetics
                      <Link 
                        key={index}
                        href={locPage.href}
                        className="group flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-900 hover:text-white transition-all duration-300 border border-stone-200/50 hover:border-stone-900"
                      >
                        <span className="text-xs font-semibold text-stone-600 group-hover:text-stone-200 transition-colors truncate max-w-[90%]">
                          {locPage.label}
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-stone-400 group-hover:translate-x-1 group-hover:text-primary transition-all shrink-0" />
                      </Link>
                    ))}
                  </div>
                  {services.length > 0 && (
                    <p className="text-[11px] text-stone-400 font-medium mt-4 text-center">
                      * Supporting all major sectors in Faridabad, Gurgaon, Delhi, and Noida with direct on-site team dispatch.
                    </p>
                  )}
                </div>
              </FadeIn>

              {/* Dynamic Blog Posts */}
              {blogPosts.length > 0 && (
                <FadeIn direction="right" delay={0.4}>
                  <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-md">
                    <h2 className="text-2xl font-display font-bold text-stone-900 mb-6 flex items-center gap-3 pb-4 border-b border-stone-100">
                      <div className="p-2.5 bg-primary/10 rounded-xl">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      Articles & Polish Guides
                    </h2>
                    
                    <div className="space-y-4">
                      {blogPosts.map((blog) => (
                        <Link 
                          key={blog.slug}
                          href={`/blog/${blog.slug}`}
                          className="group flex items-center justify-between p-3 rounded-xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100"
                        >
                          <div className="flex items-center gap-3 truncate">
                            <FileText className="h-4 w-4 text-stone-400 group-hover:text-primary transition-colors shrink-0" />
                            <span className="text-sm font-semibold text-stone-700 group-hover:text-stone-950 transition-colors truncate">
                              {blog.title}
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-400 font-medium shrink-0 ml-4 group-hover:text-stone-600 transition-colors">
                            {blog.created_at ? new Date(blog.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </FadeIn>
              )}
              
            </div>

          </div>

        </div>
      </div>
    </main>
  );
}
