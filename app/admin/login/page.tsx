"use client";

import { useState } from "react";
import { loginAdmin } from "../actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, ShieldCheck, Loader2, Sparkles, ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import { siteConfig } from "@/lib/site";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(result.error || "Login failed");
      }
    } catch (err: unknown) {
      console.error("Login fatal error:", err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-accent/40 selection:text-secondary">
      <div className="absolute top-1/4 -left-20 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(circle, #5a120f 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-white rounded-[2.5rem] border border-border shadow-[0_24px_50px_-16px_rgba(83,24,17,0.08)] overflow-hidden">
          {/* Top Branding Section */}
          <div className="pt-14 pb-8 px-8 sm:px-10 text-center space-y-6">
             <div className="inline-block transition-transform duration-500 hover:scale-[1.02]">
               <Image
                 src="/brand/wood-glazer-logo.png"
                 alt="Wood Glazer"
                 width={170}
                 height={60}
                 className="mx-auto object-contain h-12 sm:h-14 w-auto"
                 priority
                 unoptimized
               />
             </div>
             
             <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-display font-medium text-secondary tracking-tight">
                   Admin Panel
                </h1>
             </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="px-8 sm:px-10 pb-12 space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
               <div className="flex items-center justify-between ml-1 text-[12px] font-semibold text-muted">
                  <label htmlFor="admin-email" className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-primary" />
                    Email Address
                  </label>
               </div>
               
               <div className="relative group/input">
                 <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-primary transition-colors">
                   <Mail className="w-4 h-4" />
                 </div>
                 
                 <input 
                   required
                   id="admin-email"
                   type="email" 
                   placeholder="admin@woodglazer.com"
                   className="w-full bg-surface border border-border rounded-xl pl-12 pr-6 py-4 text-secondary placeholder:text-stone-350 focus:border-primary focus:bg-white focus:ring-4 focus:ring-ring transition-all outline-none text-sm font-medium"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   autoFocus
                 />
               </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2 relative">
               <div className="flex items-center justify-between ml-1 text-[12px] font-semibold text-muted">
                  <label htmlFor="admin-key" className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                    Enter Password
                  </label>
               </div>
               
               <div className="relative group/input">
                 <div className="absolute left-5 top-1/2 -translate-y-1/2 text-muted group-focus-within/input:text-primary transition-colors">
                   <Lock className="w-4 h-4" />
                 </div>
                 
                 <input 
                   required
                   id="admin-key"
                   type={showPassword ? "text" : "password"} 
                   placeholder="Enter your password"
                   className="w-full bg-surface border border-border rounded-xl pl-12 pr-12 py-4 text-secondary placeholder:text-stone-350 focus:border-primary focus:bg-white focus:ring-4 focus:ring-ring transition-all outline-none text-sm font-medium"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 />

                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-secondary transition-colors p-1"
                   aria-label={showPassword ? "Hide security key" : "Show security key"}
                 >
                   {showPassword ? (
                     <EyeOff className="w-4 h-4" />
                   ) : (
                     <Eye className="w-4 h-4" />
                   )}
                 </button>
               </div>

               {error && (
                 <p className="absolute -bottom-6 left-1 text-[10px] font-bold text-secondary uppercase tracking-widest animate-in fade-in duration-300">
                   Error: {error}
                 </p>
               )}
            </div>

            <div className="pt-6">
               <button 
                 disabled={loading}
                 type="submit"
                 className="w-full bg-secondary hover:bg-primary text-white py-4 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-secondary/10 hover:shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 group"
               >
                 {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                 ) : (
                    <>
                      Login to Dashboard
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                 )}
               </button>
            </div>
          </form>

          {/* Footer Card Section */}
          <div className="bg-surface border-t border-border px-10 py-5 flex items-center justify-center gap-2">
             <span className="text-[14px] font-semibold text-muted">Secure Login</span>
          </div>
        </div>

        {/* Outer Branding */}
        <p className="text-center mt-10 text-muted/60 text-[10px] font-bold uppercase tracking-widest leading-loose">
          Secure access engineered by <br/>
          <span className="text-primary font-bold tracking-[0.2em]">{siteConfig.name} Custom Interiors</span>
        </p>
      </div>
    </div>
  );
}
