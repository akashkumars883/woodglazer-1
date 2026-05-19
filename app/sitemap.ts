import type { MetadataRoute } from "next";
import { getServiceSeoImage } from "@/lib/seo";
import { supabase } from "@/lib/supabase";
import { absoluteUrl, getDynamicSiteConfig } from "@/lib/site";

const lastModified = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const config = await getDynamicSiteConfig();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      images: [absoluteUrl("/brand/opengraph-image.jpg")],
    },
    {
      url: absoluteUrl("/about"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/services"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      images: [absoluteUrl("/images/hero-image3.jpg")],
    },
    {
      url: absoluteUrl("/blog"),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/contact"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/privacy-policy"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: absoluteUrl("/terms-of-service"),
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const premiumLocalities = [
    "dlf-phase-1-gurgaon",
    "golf-course-road-gurgaon",
    "sohna-road-gurgaon",
    "vasant-kunj-delhi",
    "greater-kailash-delhi",
    "noida-sector-62",
  ];

  // Fetch real service data from Supabase for sitemap
  const { data: services } = await supabase
    .from("service_categories")
    .select("slug, sub_services(slug)")
    .order("created_at", { ascending: true });

  const serviceRoutes: MetadataRoute.Sitemap = (services || []).flatMap((service) => {
    const parentRoute: MetadataRoute.Sitemap[number] = {
      url: absoluteUrl(`/services/${service.slug}`),
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      images: [absoluteUrl(getServiceSeoImage(service.slug))],
    };

    const subServiceRoutes = (service.sub_services || []).flatMap((subService: { slug: string }) => {
      const mainSubRoute: MetadataRoute.Sitemap[number] = {
        url: absoluteUrl(`/services/${service.slug}/${subService.slug}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
        images: [absoluteUrl(getServiceSeoImage(service.slug))],
      };

      const localityRoutes = premiumLocalities.map((locality) => ({
        url: absoluteUrl(`/services/${service.slug}/${subService.slug}/${locality}`),
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
        images: [absoluteUrl(getServiceSeoImage(service.slug))],
      }));

      return [mainSubRoute, ...localityRoutes];
    });

    return [parentRoute, ...subServiceRoutes];
  });

  // Fetch real blog data from Supabase for sitemap
  const { data: blogs } = await supabase
    .from("blog_posts")
    .select("slug, created_at")
    .order("created_at", { ascending: false });

  const blogRoutes: MetadataRoute.Sitemap = (blogs || []).map((blog) => ({
    url: absoluteUrl(`/blog/${blog.slug}`),
    lastModified: blog.created_at ? new Date(blog.created_at) : lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes];
}
