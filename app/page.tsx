export const revalidate = 3600;

import FAQ from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import GetInTouch from "@/components/GetInTouch";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import LatestBlog from "@/components/LatestBlog";
import { buildMetadata } from "@/lib/seo";
import CTASection from "@/components/CTASection";

import { getDynamicSiteConfig } from "@/lib/site";
import { incrementVisitorCount } from "@/app/admin/actions";

export async function generateMetadata() {
  const config = await getDynamicSiteConfig();
  
  return buildMetadata({
    title: config.name + " - Custom Wood Finishing and Interior Fit-Out Services",
    description: config.description,
    path: "/",
  }, config);
}


export default async function HomePage() {
  // Record actual public visitor hit in database
  await incrementVisitorCount();

  return (
    <main className="min-h-screen">
      <Hero />
      <Services />
      <WhyChooseUs />
      <GetInTouch />
      <Testimonials />
      <FAQ />
      <LatestBlog />
      <CTASection />
    </main>
  );
}
