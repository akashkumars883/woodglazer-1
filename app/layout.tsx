import type { Metadata, Viewport } from "next";
import { StructuredData } from "@/components/StructuredData";
import { Outfit } from "next/font/google";
import { createOrganizationNode, createWebsiteNode } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import "./globals.css";
import SiteLayoutWrapper from "@/components/SiteLayoutWrapper";
import { Toaster } from "sonner";
import Script from "next/script";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieBanner from "@/components/CookieBanner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});



export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  referrer: "origin-when-cross-origin",
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: siteConfig.category,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: siteConfig.icon16, sizes: "16x16", type: "image/png" },
      { url: siteConfig.icon32, sizes: "32x32", type: "image/png" },
      { url: siteConfig.icon, sizes: "512x512", type: "image/png" },
    ],
    shortcut: [{ url: siteConfig.icon32, sizes: "32x32", type: "image/png" }],
    apple: [{ url: siteConfig.appleIcon, sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: siteConfig.openGraphImage,
        width: 2217,
        height: 1512,
        alt: "Wood Glazer brand logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.twitterImage,
        alt: "Wood Glazer brand logo",
      },
    ],
  },
  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },
  other: {
    "msapplication-TileImage": siteConfig.logo,
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#c58524",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = "G-GHH86XW9XG";

  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background text-foreground" suppressHydrationWarning>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        <StructuredData
          id="global-structured-data"
          data={[createOrganizationNode(), createWebsiteNode()]}
        />
        <Toaster position="top-right" richColors closeButton />
        <WhatsAppButton />
        <CookieBanner />
        <SiteLayoutWrapper>
          {children}
        </SiteLayoutWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
