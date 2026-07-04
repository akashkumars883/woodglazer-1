"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings, Check, X, Shield, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

const GA_ID = "G-GHH86XW9XG";

const applyConsent = (consent: { necessary: boolean; analytics: boolean; marketing: boolean }) => {
  if (typeof window !== "undefined") {
    // Real Google Analytics opt-out trigger
    (window as unknown as { [key: string]: unknown })[`ga-disable-${GA_ID}`] = !consent.analytics;

    // Push custom event to GTM dataLayer if present
    const dataLayer = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    if (dataLayer) {
      dataLayer.push({
        event: "consent_configured",
        consent_necessary: consent.necessary,
        consent_analytics: consent.analytics,
        consent_marketing: consent.marketing,
      });
    }
  }
};

export default function CookieBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Run only on client side to avoid SSR mismatch
    const savedConsent = localStorage.getItem("wood_glazer_cookie_consent");
    if (!savedConsent) {
      // Delay showing the banner slightly for better user transition
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    } else {
      try {
        const consent = JSON.parse(savedConsent);
        setTimeout(() => {
          setPreferences(consent);
          applyConsent(consent);
        }, 0);
      } catch (e) {
        setTimeout(() => {
          setIsOpen(true);
        }, 0);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    localStorage.setItem("wood_glazer_cookie_consent", JSON.stringify(allAccepted));
    applyConsent(allAccepted);
    setIsOpen(false);
  };

  const handleDeclineAll = () => {
    const allDeclined = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    localStorage.setItem("wood_glazer_cookie_consent", JSON.stringify(allDeclined));
    applyConsent(allDeclined);
    setIsOpen(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("wood_glazer_cookie_consent", JSON.stringify(preferences));
    applyConsent(preferences);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-[9999] bg-white/95 backdrop-blur-xl rounded-[2rem] border border-stone-200/80 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] overflow-hidden"
        >
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header / Brief Summary */}
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                <Cookie className="h-5 w-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-stone-900 font-display">Cookie Consent</h4>
                <p className="text-xs text-stone-500 leading-relaxed font-medium">
                  We use cookies to measure site performance, offer personalized features, and provide high-class user experiences. Read our{" "}
                  <Link href="/privacy-policy" className="text-primary hover:underline font-bold">
                    Privacy Policy
                  </Link>{" "}
                  to learn more.
                </p>
              </div>
            </div>

            {/* Configurable Details Accordion */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-stone-100 pt-4 space-y-4"
                >
                  <div className="space-y-3">
                    
                    {/* Strictly Necessary Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="space-y-0.5 max-w-[75%]">
                        <span className="text-xs font-bold text-stone-800 font-display flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5 text-stone-400" /> Necessary
                        </span>
                        <p className="text-[10px] text-stone-400 leading-normal">
                          Required for essential features like site navigation, core security, and form submissions.
                        </p>
                      </div>
                      <span className="text-[10px] font-bold uppercase text-stone-400 bg-stone-200/60 px-2.5 py-1 rounded-md">
                        Always Active
                      </span>
                    </div>

                    {/* Analytics Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="space-y-0.5 max-w-[70%]">
                        <span className="text-xs font-bold text-stone-800 font-display">Performance & Analytics</span>
                        <p className="text-[10px] text-stone-400 leading-normal">
                          Anonymously counts visits and traffic to measure popular pages and optimize layouts.
                        </p>
                      </div>
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                        className={`h-5 w-10 rounded-full transition-colors relative flex items-center ${
                          preferences.analytics ? "bg-primary" : "bg-stone-300"
                        }`}
                      >
                        <motion.span
                          layout
                          className="h-4 w-4 rounded-full bg-white shadow-sm absolute left-0.5"
                          animate={{ x: preferences.analytics ? 20 : 0 }}
                        />
                      </button>
                    </div>

                    {/* Marketing Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-100">
                      <div className="space-y-0.5 max-w-[70%]">
                        <span className="text-xs font-bold text-stone-800 font-display">Personalization & Marketing</span>
                        <p className="text-[10px] text-stone-400 leading-normal">
                          Displays customized highlights, previous work references, and interactive design suggestions.
                        </p>
                      </div>
                      <button
                        onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                        className={`h-5 w-10 rounded-full transition-colors relative flex items-center ${
                          preferences.marketing ? "bg-primary" : "bg-stone-300"
                        }`}
                      >
                        <motion.span
                          layout
                          className="h-4 w-4 rounded-full bg-white shadow-sm absolute left-0.5"
                          animate={{ x: preferences.marketing ? 20 : 0 }}
                        />
                      </button>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Control Panel Toggles */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100/80 hover:bg-stone-100 rounded-xl px-4 py-3 transition-colors shrink-0"
              >
                <Settings className="h-3.5 w-3.5" />
                {showDetails ? "Hide Preferences" : "Customize"}
                {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </button>

              <div className="flex items-center gap-2 w-full justify-end">
                {showDetails ? (
                  <button
                    onClick={handleSavePreferences}
                    className="w-full inline-flex items-center justify-center rounded-xl bg-secondary hover:bg-stone-900 text-white font-bold py-3 text-xs transition-colors"
                  >
                    Save Preferences
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleDeclineAll}
                      className="w-full inline-flex items-center justify-center rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-600 hover:text-stone-900 font-bold py-3 text-xs transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="w-full inline-flex items-center justify-center rounded-xl bg-primary hover:bg-stone-900 text-white font-bold py-3 text-xs transition-all shadow-md hover:shadow-lg"
                    >
                      Accept All
                    </button>
                  </>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
