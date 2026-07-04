"use client";

import { 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { deleteBlogPost, suggestNewBlogTopics, generateAndPublishAIBlogPost } from "../actions";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  category: string;
  status: string;
  created_at: string;
  image?: string;
}

export default function BlogAdminPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (isMounted) {
        if (data) setBlogs(data as BlogPost[]);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const [suggestions, setSuggestions] = useState<{ title: string; category: string; reason: string; seoScore: string; description?: string }[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [autoGenerating, setAutoGenerating] = useState(false);

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const existingTitles = blogs.map(b => b.title);
      const result = await suggestNewBlogTopics(existingTitles);
      if (result.success && result.suggestions) {
        interface SuggestedTopic {
          title?: string;
          category?: string;
          reason?: string;
          seoScore?: string;
          description?: string;
        }
        const validated = (result.suggestions as SuggestedTopic[]).map((item: SuggestedTopic) => {
          let title = (item.title || "").trim();
          let description = (item.description || "").trim();

          // 1. Title formatting (strictly 40-60 chars)
          if (title.length > 60) {
            title = title.substring(0, 57);
            const lastSpace = title.lastIndexOf(" ");
            if (lastSpace > 15) title = title.substring(0, lastSpace);
          } else if (title.length < 40) {
            const paddings = [
              " | Best Wood Polish Delhi",
              " | PU Polish Services Delhi",
              " | Luxury Carpentry Delhi NCR",
              " | Wood Glazer Delhi"
            ];
            for (const pad of paddings) {
              if (title.length + pad.length >= 40 && title.length + pad.length <= 60) {
                title += pad;
                break;
              }
            }
            if (title.length < 40) {
              title += " | Best Wood Polish Delhi";
            }
          }

          // 2. Description formatting (strictly 120-160 chars)
          // Ensure we start with a clean string or fallback
          if (!description) {
            description = "Get premium PU polish, Melamine, Deco paint and high-end luxury carpentry services in Delhi NCR. Transform your home interior with Wood Glazer today.";
          }

          // If too short, append premium snippets until it reaches at least 120 chars
          if (description.length < 120) {
            const descriptionPaddings = [
              "Contact Wood Glazer in Delhi NCR for high-end luxury wood polish and premium carpentry.",
              "Transform your home interior with professional melamine & PU wood polish services today.",
              "Discover premium furniture designs and luxury custom carpentry work from our Delhi experts."
            ];
            for (const pad of descriptionPaddings) {
              if (description.length + pad.length + 1 <= 160) {
                description = description + " " + pad;
              }
              if (description.length >= 120) {
                break;
              }
            }
          }

          // If still too short or somehow too long, enforce strict clipping
          if (description.length > 160) {
            description = description.substring(0, 157);
            const lastSpace = description.lastIndexOf(" ");
            if (lastSpace > 110) {
              description = description.substring(0, lastSpace) + "...";
            } else {
              description = description.substring(0, 157) + "...";
            }
          } else if (description.length < 120) {
            // Absolute fallback that is exactly 144 characters (Perfect SEO length!)
            description = "Get premium PU polish, Melamine, Deco paint and high-end luxury carpentry services in Delhi NCR. Transform your home interior with Wood Glazer.";
          }

          return {
            title,
            description,
            category: (item.category || "Wood Polishing").trim(),
            reason: (item.reason || "High demand keyword").trim(),
            seoScore: (item.seoScore || "High").trim()
          };
        });
        setSuggestions(validated);
      } else {
        alert("Error getting suggestions: " + (result.error || "Please check your AI config"));
      }
    } catch (e: unknown) {
      alert("Error: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      const result = await deleteBlogPost(id);
      if (result.success) {
        setBlogs(blogs.filter(b => b.id !== id));
      } else {
        alert("Error deleting post: " + result.error);
      }
    }
  };

  const handleAutoGenerate = async () => {
    setAutoGenerating(true);
    try {
      const result = await generateAndPublishAIBlogPost();
      if (result.success) {
        alert(`Success! AI has generated and published a new blog post:\n\n"${result.title}"`);
        // Refresh blogs list
        const { data } = await supabase
          .from("blog_posts")
          .select("*")
          .order("created_at", { ascending: false });
        if (data) setBlogs(data as BlogPost[]);
      } else {
        alert("Error generating blog: " + result.error);
      }
    } catch (err: unknown) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setAutoGenerating(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-semibold text-secondary">Blog Posts</h1>
           <p className="text-stone-500 font-medium">Manage your articles, guides, and news updates.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button 
            onClick={handleAutoGenerate}
            disabled={autoGenerating}
            className="inline-flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 hover:bg-stone-850 transition-all disabled:opacity-50 disabled:hover:scale-100 cursor-pointer self-start sm:self-center"
          >
             {autoGenerating ? <Loader2 className="w-5 h-5 animate-spin text-primary" /> : <Sparkles className="w-5 h-5 text-primary animate-pulse" />}
             {autoGenerating ? "AI Writing & Posting..." : "Write & Post with AI Now"}
          </button>
          <Link 
            href="/admin/blog/new"
            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform self-start sm:self-center"
          >
             <Plus className="w-5 h-5" />
             Write New Post
          </Link>
        </div>
      </div>

      {/* AI Daily Topic Recommendations Card */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-950 text-white rounded-3xl border border-stone-800 p-8 relative overflow-hidden shadow-xl shadow-stone-950/20">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
             <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                AI Smart Planner
             </div>
             <h2 className="text-2xl font-bold tracking-tight">Need a fresh topic? Get daily suggestions!</h2>
             <p className="text-stone-300 text-sm leading-relaxed">
                Our AI analyzes your active blogs, matches them with Google trending keywords, and suggests brand-new topics for Wood Glazer that you {"haven't"} published yet.
             </p>
          </div>
          <button 
             onClick={handleGetSuggestions}
             disabled={loadingSuggestions}
             className="inline-flex items-center gap-2 px-6 py-4 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/30 self-start md:self-center disabled:opacity-50 disabled:hover:scale-100 whitespace-nowrap"
          >
             {loadingSuggestions ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
             {loadingSuggestions ? "Analyzing Blogs..." : "Suggest Fresh Topics"}
          </button>
        </div>

        {suggestions.length > 0 && (
           <div className="mt-8 border-t border-stone-800 pt-6 space-y-4 animate-in fade-in duration-300">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">Recommended Topics to write next:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {suggestions.map((item, idx) => (
                    <div key={idx} className="bg-stone-900/50 border border-stone-800 rounded-2xl p-5 hover:border-primary/40 transition-all flex flex-col justify-between gap-4">
                       <div>
                          <div className="flex items-center justify-between">
                             <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{item.category}</span>
                             <span className="text-[10px] text-stone-400 font-semibold">{item.seoScore} SEO Potential</span>
                          </div>
                          <h4 className="font-bold text-white text-base mt-2 leading-snug">{item.title}</h4>
                          <p className="text-stone-300 text-xs mt-1 leading-relaxed">{item.reason}</p>
                       </div>
                       <Link 
                          href={`/admin/blog/new?suggestedTitle=${encodeURIComponent(item.title)}&suggestedCategory=${encodeURIComponent(item.category)}&suggestedDescription=${encodeURIComponent(item.description || '')}`}
                          className="inline-flex items-center justify-center gap-1.5 py-2.5 bg-stone-800 hover:bg-stone-700 hover:text-primary text-white rounded-xl text-xs font-bold transition-all mt-2"
                       >
                          Write This Blog
                          <ArrowRight className="w-3.5 h-3.5 text-primary" />
                       </Link>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
         <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input 
               type="text" 
               placeholder="Search posts by title or category..." 
               className="w-full bg-stone-50 border border-stone-200 rounded-xl px-12 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
         </div>
         <div className="flex items-center gap-2 w-full md:w-auto">
            <button className="flex items-center gap-2 px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-100 transition-colors w-full md:w-auto justify-center">
               <Filter className="w-4 h-4" />
               Filters
            </button>
            <select className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm font-semibold text-stone-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all w-full md:w-auto">
               <option>All Posts</option>
               <option>Published</option>
               <option>Drafts</option>
            </select>
         </div>
      </div>

      {/* Blog Table Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden min-h-[400px]">
         {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
               <Loader2 className="w-10 h-10 text-primary animate-spin" />
               <p className="text-stone-400 font-bold tracking-widest uppercase text-xs">Fetching Articles...</p>
            </div>
         ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead className="bg-stone-50/50 border-b border-stone-200">
                     <tr>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Post Detail</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Category</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400">Date</th>
                        <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-stone-400 text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                     {blogs.map((blog, idx) => (
                        <tr key={idx} className="group hover:bg-stone-50/50 transition-colors">
                           <td className="px-6 py-5 min-w-[300px]">
                              <div className="flex items-center gap-4">
                                 <div className="w-16 h-12 rounded-xl bg-stone-100 flex-shrink-0 overflow-hidden border border-stone-200 group-hover:bg-white transition-colors relative">
                                    {blog.image ? (
                                       <Image src={blog.image} alt={blog.title} fill className="object-cover" />
                                    ) : (
                                       <ImageIcon className="w-5 h-5 text-stone-300 absolute inset-0 m-auto" />
                                    )}
                                 </div>
                                 <div>
                                    <p className="font-semibold text-secondary group-hover:text-primary transition-colors cursor-pointer line-clamp-1">{blog.title}</p>
                                    <p className="text-xs text-stone-400 font-medium pt-0.5">By {blog.author}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <span className="text-xs font-semibold text-stone-600 bg-stone-50 border border-stone-100 px-3 py-1 rounded-full whitespace-nowrap">{blog.category}</span>
                           </td>
                           <td className="px-6 py-5">
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                                blog.status === "Published" || !blog.status
                                  ? "bg-green-50 text-green-600 border-green-100" 
                                  : "bg-orange-50 text-orange-600 border-orange-100"
                              }`}>
                                 {blog.status || "Published"}
                              </span>
                           </td>
                           <td className="px-6 py-5 text-xs font-semibold text-stone-500 whitespace-nowrap" suppressHydrationWarning>
                             {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex items-center justify-end gap-2">
                                 <Link 
                                   href={`/admin/blog/${blog.slug}/edit`}
                                   className="p-2 bg-stone-50 rounded-xl text-stone-400 hover:text-primary hover:bg-stone-100 border border-transparent hover:border-stone-200 transition-all shadow-sm"
                                 >
                                    <Edit2 className="w-4 h-4" />
                                 </Link>
                                 <button 
                                   className="p-2 bg-stone-50 rounded-xl text-stone-400 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all shadow-sm"
                                   onClick={() => handleDelete(blog.id, blog.title)}
                                 >
                                    <Trash2 className="w-4 h-4" />
                                 </button>
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
         {/* Pagination Footer */}
         <div className="bg-stone-50/50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
            <p className="text-sm text-stone-500 font-medium">Showing <span className="font-semibold text-secondary">{blogs.length}</span> articles recorded</p>
         </div>
      </div>
    </div>
  );
}
