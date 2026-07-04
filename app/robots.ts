import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-Web",
          "Google-Extended",
          "Anthropic-ai",
          "CCBot",
          "cohere-ai",
          "PerplexityBot",
          "YouBot",
          "Applebot",
          "Bingbot"
        ],
        allow: "/",
        disallow: ["/admin", "/api"],
      }
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
