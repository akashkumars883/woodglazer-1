import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/lib/site";
import Link from "next/link";
import Image from "next/image";

const navigationItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const serviceItems = [
  { href: "/services/wood-polishing-services", label: "Wood Polishing" },
  { href: "/services/carpentry-services", label: "Carpentry Services" },
  { href: "/services/wallpaper-and-interior-panels", label: "Wallpaper & Panels" },
];

// Custom Social Icons to avoid library version issues
const FacebookIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16.4a4.4 4.4 0 110-8.8 4.4 4.4 0 010 8.8zm6.487-11.595a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" clipRule="evenodd" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-black text-stone-300 pt-16 pb-8 border-t border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-4 lg:px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1 space-y-8">
            <Link href="/" className="inline-block -ml-2 sm:-ml-4 group">
              <Image
                src="/brand/wood-glazer-logo.png"
                alt="Wood Glazer"
                width={100}
                height={80}
                className="opacity-90 grayscale brightness-[60] contrast-100 group-hover:opacity-100 transition-all duration-500 object-contain object-left h-16 sm:h-20 lg:h-24 w-40"
                unoptimized
              />
            </Link>
            <p className="text-sm leading-relaxed text-stone-400 max-w-sm font-medium">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-5">
              {[
                { icon: InstagramIcon, href: "https://www.instagram.com/wood_glazer/" },
                { icon: FacebookIcon, href: "https://www.facebook.com/woodglazers/" },
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 border border-white/5 hover:border-primary/50"
                >
                  <social.icon />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-white font-display font-medium text-lg mb-8 tracking-wide">Quick Links</h4>
            <ul className="space-y-4">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-stone-400 hover:text-primary transition-all duration-300 text-sm font-medium flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h4 className="text-white font-display font-medium text-lg mb-8 tracking-wide">Services</h4>
            <ul className="space-y-4">
              {serviceItems.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-stone-400 hover:text-primary transition-all duration-300 text-sm font-medium flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 h-px bg-primary mr-0 group-hover:mr-2 transition-all duration-300" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-1">
            <h4 className="text-white font-display font-medium text-lg mb-8 tracking-wide">Contact Us</h4>
            <ul className="space-y-6">
              {[
                { icon: Phone, label: "Call Us", value: "+91 9717048359" },
                { icon: Mail, label: "Email Us", value: "woodglazer@gmail.com" },
              ].map((item) => (
                <li key={item.label} className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-sm">
                    <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest mb-1">{item.label}</p>
                    <p className="text-stone-300 font-bold group-hover:text-primary transition-colors">{item.value}</p>
                  </div>
                </li>
              ))}
              <li className="flex gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-primary/50 transition-colors">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="text-stone-500 font-bold uppercase text-[10px] tracking-widest mb-1">Our Office</p>
                  <p className="text-stone-300 font-medium leading-relaxed">
                    B-474, Basement, Greenfield Colony, Faridabad, Haryana - 121010
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-stone-500 text-xs font-medium">
            © {new Date().getFullYear()} Wood Glazer. All rights reserved.
          </p>
          <div className="flex gap-8 text-stone-500 text-xs font-medium">
            <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
