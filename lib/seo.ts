import type { Metadata } from "next";
import { type ServiceCategory, type SubService, servicesData } from "@/lib/servicesData";
import { absoluteUrl, siteConfig, type SiteConfig } from "@/lib/site";
import { type BlogPost } from "@/lib/blogData";

type SchemaNode = Record<string, unknown>;

const serviceImageFallbacks: Record<string, string> = {
  "wood-polishing-services": "/images/hero-image1.png",
  "carpentry-services": "/images/hero-image2.png",
};

const defaultServiceImage = "/images/hero-image3.png";


const organizationId = absoluteUrl("/#organization");
const websiteId = absoluteUrl("/#website");

export const servicesIndexDescription =
  "Explore Wood Glazer service categories for wood polishing, premium finishes, custom carpentry, and interior fit-out solutions.";

function truncateDescription(text: string, maxLength = 160) {
  if (text.length <= maxLength) {
    return text;
  }

  const slicedText = text.slice(0, maxLength - 1);
  const lastSpace = slicedText.lastIndexOf(" ");

  if (lastSpace <= 0) {
    return `${slicedText}...`;
  }

  return `${slicedText.slice(0, lastSpace)}...`;
}

function uniqueKeywords(keywords: string[]) {
  return [...new Set(keywords.filter(Boolean))];
}

export function getServiceSeoImage(parentSlug?: string) {
  if (!parentSlug) {
    return siteConfig.openGraphImage;
  }

  return serviceImageFallbacks[parentSlug] ?? defaultServiceImage;
}

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string[];
};

export function buildMetadata({
  title,
  description,
  path,
  image,
  keywords = [],
}: MetadataInput, config: SiteConfig = siteConfig): Metadata {
  const shortDescription = truncateDescription(description);
  const absoluteImage = absoluteUrl(image || config.openGraphImage);

  return {
    title,
    description: shortDescription,
    category: config.category,
    keywords: uniqueKeywords([...config.keywords, ...keywords]),
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description: shortDescription,
      url: path,
      siteName: config.name,
      locale: config.locale,
      type: "website",
      images: [
        {
          url: absoluteImage,
          width: 1600,
          height: 900,
          alt: `${title} - Premium Wood Craftsmanship & Finishing by Wood Glazer`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: shortDescription,
      images: [absoluteImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function createOrganizationNode(config: SiteConfig = siteConfig): SchemaNode {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: config.name,
    url: absoluteUrl("/"),
    logo: absoluteUrl(config.logo),
    image: absoluteUrl(config.openGraphImage),
    areaServed: config.serviceArea.map(area => ({
      "@type": "City",
      "name": area
    })),
  };
}

export function createWebsiteNode(config: SiteConfig = siteConfig): SchemaNode {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: config.name,
    url: absoluteUrl("/"),
    description: config.description,
    publisher: {
      "@id": organizationId,
    },
    inLanguage: "en",
  };
}

export function createBreadcrumbNode(
  items: Array<{ name: string; path: string }>
): SchemaNode {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function createServicesIndexNode(): SchemaNode {
  return {
    "@type": "CollectionPage",
    "@id": absoluteUrl("/services#collection-page"),
    name: "Our Services",
    url: absoluteUrl("/services"),
    description: servicesIndexDescription,
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": organizationId,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Wood Glazer service categories",
      itemListElement: (servicesData || []).map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: service.title,
        url: absoluteUrl(`/services/${service.slug}`),
        description: truncateDescription(service.description),
      })),
    },
  };
}

export function createServiceCategoryNode(service: ServiceCategory, config: SiteConfig = siteConfig): SchemaNode {
  return {
    "@type": "Service",
    "@id": absoluteUrl(`/services/${service.slug}#service`),
    name: service.title,
    serviceType: service.title,
    description: service.description,
    url: absoluteUrl(`/services/${service.slug}`),
    image: absoluteUrl(getServiceSeoImage(service.slug)),
    provider: {
      "@id": organizationId,
    },
    areaServed: (config.serviceArea || []).map((area: string) => ({
      "@type": "City",
      "name": area
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} catalog`,
      itemListElement: (service.subServices || (service as unknown as { sub_services: { title: string; slug: string; description: string }[] }).sub_services || []).map((subService: { title: string; slug: string; description: string }, index: number) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          name: subService.title,
          description: subService.description,
          url: absoluteUrl(`/services/${service.slug}/${subService.slug}`),
        },
      })),
    },
  };
}

export function createSubServiceNode(
  parent: ServiceCategory,
  subService: SubService,
  config: SiteConfig = siteConfig
): SchemaNode {
  return {
    "@type": "Service",
    "@id": absoluteUrl(`/services/${parent.slug}/${subService.slug}#service`),
    name: subService.title,
    serviceType: parent.title,
    description: subService.description,
    url: absoluteUrl(`/services/${parent.slug}/${subService.slug}`),
    image: absoluteUrl(getServiceSeoImage(parent.slug)),
    provider: {
      "@id": organizationId,
    },
    isPartOf: {
      "@id": absoluteUrl(`/services/${parent.slug}#service`),
    },
    areaServed: config.serviceArea.map((area: string) => ({
      "@type": "City",
      "name": area
    })),
    category: parent.title,

  };
}

export function createBlogIndexNode(blogs: BlogPost[]): SchemaNode {
  return {
    "@type": "CollectionPage",
    "@id": absoluteUrl("/blog#collection-page"),
    name: "Our Blog",
    url: absoluteUrl("/blog"),
    description: "Insights, guides, and updates on premium wood finishing and interior fit-out services.",
    isPartOf: {
      "@id": websiteId,
    },
    about: {
      "@id": organizationId,
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Latest blog posts",
      itemListElement: blogs.map((blog, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: blog.title,
        url: absoluteUrl(`/blog/${blog.slug}`),
        description: blog.description,
      })),
    },
  };
}

export function createBlogNode(blog: BlogPost): SchemaNode {
  return {
    "@type": "BlogPosting",
    "@id": absoluteUrl(`/blog/${blog.slug}#blogposting`),
    headline: blog.title,
    description: blog.description,
    image: absoluteUrl(blog.image),
    datePublished: blog.date,
    author: {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
    },
    publisher: {
      "@id": organizationId,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(`/blog/${blog.slug}`),
    },
    inLanguage: "en",
  };
}

export function insertContextualLinks(html: string): string {
  if (!html) return "";
  
  const linkMap = [
    { keywords: ["pu paint", "pu polishing", "pu polish"], url: "/services/wood-polishing-services/pu-paint-pu-polishing" },
    { keywords: ["melamine polishing", "melamine polish", "melamine finish"], url: "/services/wood-polishing-services/melamine-polishing" },
    { keywords: ["deco paint", "deco painting", "deco finish"], url: "/services/wood-polishing-services/deco-paint" },
    { keywords: ["polyester polishing", "polyester polish", "lamination", "laminated wood"], url: "/services/wood-polishing-services/polyester-polishing-lamination" },
    { keywords: ["residential carpentry", "home carpentry"], url: "/services/carpentry-services/residential-carpentry" },
    { keywords: ["commercial carpentry", "office carpentry"], url: "/services/carpentry-services/commercial-carpentry" },
    { keywords: ["wood polishing", "wood polishing services"], url: "/services/wood-polishing-services" },
    { keywords: ["carpentry", "carpentry services"], url: "/services/carpentry-services" },
  ];
  
  let text = html;
  
  linkMap.forEach(({ keywords, url }) => {
    for (const kw of keywords) {
      const escapedKw = kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`(?<!<[^>]*)\\b(${escapedKw})\\b(?![^<]*<\/a>)`, "gi");
      
      let matched = false;
      text = text.replace(regex, (match) => {
        if (!matched) {
          matched = true;
          return `<a href="${url}" class="text-primary font-bold hover:underline decoration-2 underline-offset-4">${match}</a>`;
        }
        return match;
      });
      
      if (matched) break;
    }
  });
  
  return text;
}

