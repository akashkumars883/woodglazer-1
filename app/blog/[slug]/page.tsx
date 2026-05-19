export const dynamic = "force-dynamic";

import { buildMetadata, createBlogNode, createBreadcrumbNode, insertContextualLinks } from "@/lib/seo";
import { StructuredData } from "@/components/StructuredData";
import Image from "next/image";
import { notFound } from "next/navigation";
import BlogSidebar from "@/components/BlogSidebar";
import CTASection from "@/components/CTASection";
import { supabase } from "@/lib/supabase";
import { getDynamicSiteConfig } from "@/lib/site";
import BlogShareButtons from "@/components/BlogShareButtons";

export async function generateStaticParams() {
  const { data: blogs } = await supabase
    .from("blog_posts")
    .select("slug");
  
  return (blogs || []).map((blog: { slug: string }) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = await getDynamicSiteConfig();
  
  const { data: blog } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!blog) return {};

  return buildMetadata({
    title: `${blog.title} | ${config.name} Blog`,
    description: blog.description,
    path: `/blog/${blog.slug}`,
    image: blog.image,
    keywords: [blog.category, "wood finishing", "interior design"],
  }, config);
}


export default async function BlogDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = await getDynamicSiteConfig();
  
  const { data: blog } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!blog) notFound();

  const postUrl = `${config.url}/blog/${blog.slug}`;

  const formatAuthor = (authorName: string | null) => {
    if (!authorName || authorName === "Wood Glazer Team" || authorName === "Wood Glazer Admin" || authorName === "admin") {
      return "Team Wood Glazer";
    }
    return authorName;
  };

  // Map to BlogPost interface to maintain full type-safety
  const formattedBlog = {
    title: blog.title || "",
    slug: blog.slug || "",
    description: blog.description || "",
    image: blog.image || "",
    date: blog.created_at || "",
    author: formatAuthor(blog.author),
    category: blog.category || "General",
    readTime: blog.read_time || "",
    content: blog.content || "",
    featured: blog.featured,
  };

  // Fetch all posts to allow dynamic, database-backed interlinking in sidebar
  const { data: blogList } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const formattedAllBlogs = (blogList || []).map((b) => ({
    title: b.title || "",
    slug: b.slug || "",
    description: b.description || "",
    image: b.image || "",
    date: b.created_at || "",
    author: formatAuthor(b.author),
    category: b.category || "General",
    readTime: b.read_time || "",
    content: b.content || "",
    featured: b.featured,
  }));

  return (
    <>
      <article className="min-h-screen pt-12 pb-16">
        <StructuredData
          id="blog-post-data"
          data={[
            createBlogNode(formattedBlog),
            createBreadcrumbNode([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: formattedBlog.title, path: `/blog/${formattedBlog.slug}` },
            ]),
          ]}
        />


        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Main Content Column */}
            <div className="lg:col-span-8">
              {/* Post Header */}
              <header className="mb-12">
                <div className="flex items-center gap-3 text-xs text-primary mb-6 font-bold uppercase tracking-[0.2em]">
                  <span>{formattedBlog.category}</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-stone-500">{formattedBlog.readTime}</span>
                </div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-8 leading-[1.1] tracking-tight">
                  {formattedBlog.title}
                </h1>
                
                <div className="flex items-center gap-4 border-y border-stone-100 py-6">
                  <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-stone-900 font-bold">{formattedBlog.author}</p>
                    <p className="text-stone-500 text-sm" suppressHydrationWarning>Published on {new Date(formattedBlog.date).toLocaleDateString()}</p>
                  </div>
                </div>
              </header>

              {/* Featured Image */}
              <div className="relative aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl mb-12">
                <Image
                  alt={formattedBlog.title}
                  src={formattedBlog.image}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Blog Content */}
              <div 
                className="prose prose-stone prose-lg max-w-none prose-headings:text-secondary prose-headings:font-black prose-headings:mt-8 prose-headings:mb-3 prose-p:text-stone-600 prose-p:leading-relaxed prose-p:my-3 prose-li:text-stone-600 prose-li:my-1.5 prose-strong:text-secondary prose-img:rounded-3xl"
                dangerouslySetInnerHTML={{ __html: insertContextualLinks(formattedBlog.content) }} 
              />
              
              {/* Share section */}
              <div className="mt-16 pt-8 border-t border-stone-100">
                <BlogShareButtons url={postUrl} title={formattedBlog.title} />
              </div>
            </div>

            {/* Sidebar Column */}
            <aside className="lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <BlogSidebar currentPost={formattedBlog} allPosts={formattedAllBlogs} />
            </aside>
          </div>
        </div>
      </article>

      {/* CTA Section at bottom */}
      <CTASection />
    </>
  );
}
