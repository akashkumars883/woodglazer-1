import { 
  Eye, 
  FileEdit, 
  TrendingUp, 
  Package, 
  ArrowUpRight,
  FileText,
  Users,
  CheckCircle2,
  Clock
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import QuickActionsClient from "@/components/admin/QuickActionsClient";

export const dynamic = "force-dynamic";

function formatRelativeTime(dateString?: string) {
  if (!dateString) return "Recently";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return diffMins <= 1 ? "Just now" : `${diffMins} mins ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "1 hr ago" : `${diffHours} hrs ago`;
  } else {
    return diffDays === 1 ? "Yesterday" : `${diffDays} days ago`;
  }
}

export default async function AdminDashboard() {
  // Fetch real counts from Supabase
  const { count: servicesCount } = await supabase
    .from("service_categories")
    .select("*", { count: 'exact', head: true });

  const { count: blogCount } = await supabase
    .from("blog_posts")
    .select("*", { count: 'exact', head: true });

  const { data: inquiries } = await supabase
    .from("inquiries")
    .select("*", { count: 'exact' })
    .order("created_at", { ascending: false });

  // Fetch real recent sub-service updates
  const { data: recentSubServices } = await supabase
    .from("sub_services")
    .select(`
      title,
      created_at,
      service_categories (
        title
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  interface SubServiceWithCategory {
    title: string;
    created_at: string;
    service_categories: {
      title: string;
    } | null;
  }

  const realUpdates = ((recentSubServices || []) as unknown as SubServiceWithCategory[]).map((sub) => ({
    title: sub.title,
    category: sub.service_categories?.title || "Specialty Woodwork",
    status: "Published",
    date: formatRelativeTime(sub.created_at)
  }));

  const displayUpdates = realUpdates.length > 0 ? realUpdates : [
    { title: "Melamine Polish", category: "Wood Polishing", status: "Published", date: "2 hours ago" },
    { title: "Residential Carpentry", category: "Carpentry", status: "Published", date: "5 hours ago" },
    { title: "Office Fit-Out", category: "Commercial", status: "Draft", date: "1 day ago" }
  ];

  const unreadLeadsCount = (inquiries || []).filter(i => !i.viewed).length;
  const leadsCount = inquiries?.length || 0;

  // Fetch real total_visits from site_settings table
  const { data: visitsData } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "total_visits")
    .single();

  let realVisits = 0; // Fallback to 0 if not initialized
  if (visitsData && visitsData.value) {
    const val = visitsData.value as { count?: number } | number;
    if (typeof val === "number") {
      realVisits = val;
    } else if (val && typeof val === "object" && typeof val.count === "number") {
      realVisits = val.count;
    }
  }

  const stats = [
    { name: "Total Visits", value: realVisits.toLocaleString(), icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Total Leads", value: leadsCount.toString(), icon: Users, color: "text-red-600", bg: "bg-red-50" },
    { name: "Total Categories", value: servicesCount?.toString() || "0", icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Blog Posts", value: blogCount?.toString() || "0", icon: FileText, color: "text-green-600", bg: "bg-green-50" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-semibold text-secondary">Dashboard Overview</h1>
           <p className="text-stone-500 font-medium">Welcome back, Team Wood Glazer. Here&apos;s what&apos;s happening today.</p>
        </div>
        <Link 
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
           <FileEdit className="w-5 h-5" />
           New Blog Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
             <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-full">
                   <TrendingUp className="w-4 h-4" />
                   12%
                </div>
             </div>
             <div>
                <p className="text-stone-500 font-medium text-sm">{stat.name}</p>
                <h3 className="text-3xl font-semibold text-secondary mt-1">{stat.value}</h3>
             </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 space-y-6">
            {/* Recent Service Updates Card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h3 className="font-bold text-secondary text-lg">Recent Service Updates</h3>
                  <Link href="/admin/services" className="text-sm font-bold text-primary hover:underline italic">View All</Link>
               </div>
               <div className="p-0">
                  {displayUpdates.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-6 hover:bg-stone-50 transition-colors border-b border-stone-50 last:border-0">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                             <Package className="w-5 h-5 text-stone-500" />
                          </div>
                          <div>
                             <p className="font-bold text-secondary">{item.title}</p>
                             <p className="text-xs text-stone-500">{item.category}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.status === "Published" ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                             {item.status}
                          </span>
                          <span className="text-xs text-stone-400 font-medium">{item.date}</span>
                          <ArrowUpRight className="w-4 h-4 text-stone-300" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Recent Customer Inquiries Card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
               <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                  <h3 className="font-bold text-secondary text-lg">Recent Customer Inquiries</h3>
                  <Link href="/admin/leads" className="text-sm font-bold text-primary hover:underline italic">View All</Link>
               </div>
               <div className="p-0 divide-y divide-stone-50">
                  {(inquiries || []).slice(0, 3).map((lead) => (
                    <div key={lead.id} className="p-6 flex items-center justify-between hover:bg-stone-50 transition-colors">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center font-bold text-secondary text-sm">
                             {lead.name[0]?.toUpperCase() || "C"}
                          </div>
                          <div>
                             <p className="font-bold text-secondary text-sm">{lead.name}</p>
                             <p className="text-xs text-stone-500 line-clamp-1">{lead.service || "General Inquiry"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4 shrink-0">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${!lead.viewed ? "bg-red-50 text-red-600 border border-red-100 animate-pulse" : "bg-stone-50 text-stone-400"}`}>
                             {!lead.viewed ? "NEW" : "Viewed"}
                          </span>
                          <span className="text-xs text-stone-400 font-medium">{formatRelativeTime(lead.created_at)}</span>
                       </div>
                    </div>
                  ))}
                  {(inquiries || []).length === 0 && (
                    <div className="p-8 text-center text-stone-400 text-sm">
                       No customer inquiries received yet.
                    </div>
                  )}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-stone-900 rounded-2xl p-8 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-125 transition-transform duration-500" />
               <h3 className="text-xl font-bold mb-2 relative z-10">SEO Tip of the Day</h3>
               <p className="text-stone-400 text-sm leading-relaxed mb-6 relative z-10 italic">
                  &quot;Ensure every blog post has at least 3 internal links to your service pages to boost ranking.&quot;
               </p>
               <button className="text-primary font-bold text-sm hover:underline">Learn More</button>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
               <h3 className="font-bold text-secondary mb-4">Quick Links</h3>
               <div className="space-y-4">
                <Link 
                  href="/admin/leads"
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all group shadow-sm ${
                    unreadLeadsCount > 0 
                      ? "bg-red-50 border-red-100 hover:border-red-300" 
                      : "bg-stone-50 border-stone-100 hover:border-primary hover:bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className={`w-5 h-5 group-hover:scale-110 transition-transform ${unreadLeadsCount > 0 ? "text-red-500" : "text-primary"}`} />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-bold text-secondary">Manage Inquiries</span>
                      {unreadLeadsCount > 0 && (
                        <span className="text-[10px] font-black uppercase text-red-500 tracking-widest">{unreadLeadsCount} new leads</span>
                      )}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-primary transition-colors" />
                </Link>

                <Link 
                  href="/admin/settings"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-primary hover:bg-white transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold text-secondary">SEO & Keywords</span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-primary transition-colors" />
                </Link>
                
                <QuickActionsClient 
                  realVisits={realVisits}
                  leadsCount={leadsCount}
                  servicesCount={servicesCount || 0}
                  blogCount={blogCount || 0}
                />
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}
