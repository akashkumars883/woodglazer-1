"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { StructuredData } from "./StructuredData";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  categorySlug: string;
}

export default function FAQSection({ categorySlug }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: Record<string, FAQItem[]> = {
    "wood-polishing-services": [
      {
        question: "What is PU Polish and why is it considered the premium choice?",
        answer: "PU (Polyurethane) Polish is the absolute gold standard for premium woodwork in Delhi NCR. It is a two-component polymer-based coating that provides a high-build, highly flexible protective shield over natural wood grains. It offers unmatched durability, extreme scratch resistance, water resistance, and a gorgeous glass-like high gloss or soft matte finish that does not turn yellow over time."
      },
      {
        question: "How long does professional wood polishing last on furniture?",
        answer: "A professional high-end wood polish like Italian PU can last for 8 to 12 years with basic maintenance. Traditional Melamine polish has a lifespan of 4 to 6 years, while basic spirit polishing generally lasts for 2 to 3 years before requiring a touch-up."
      },
      {
        question: "What is the primary difference between PU Polish and Melamine Polish?",
        answer: "PU polish is extremely elastic, water-resistant, heat-resistant, and suitable for both interior and exterior wood due to its superior UV protection. Melamine, on the other hand, is a thin, brittle acid-cure finish that is budget-friendly but prone to chipping and is recommended exclusively for low-impact interior items."
      },
      {
        question: "How should I maintain and clean my newly polished wood surfaces?",
        answer: "To ensure your polished wood stays pristine, dust daily with a soft, clean microfiber cloth. Never use harsh chemical cleaners, alcohol-based solutions, or abrasive pads. Always use coasters or mats under hot cups and cold glasses, and avoid direct long-exposure sunlight."
      }
    ],
    "carpentry-services": [
      {
        question: "Do you design and install custom modular carpentry?",
        answer: "Yes, we specialize in high-end modular carpentry, including custom modular kitchens, bespoke walk-in wardrobes, luxury TV consoles, accent walls, and tailored solid-wood furniture crafted precisely to match your interior vision."
      },
      {
        question: "What materials and wood types do you use for carpentry projects?",
        answer: "We source only premium grade materials, including action Tesa HDMR (High-Density Moisture-Resistant) boards, IS-710 marine grade boiling-water-proof plywood, and premium seasoned solid hardwoods like Burmese Teak, White Oak, and Mahogany."
      },
      {
        question: "Do you offer physical site measurements and consultations in Gurgaon?",
        answer: "Absolutely! We provide comprehensive physical site measurements, detailed material consultations, and professional design layout planning across Gurgaon, South Delhi, Noida, and the NCR region."
      }
    ]
  };

  const currentFAQs = faqData[categorySlug] || faqData["wood-polishing-services"];

  // Generate FAQPage JSON-LD Schema node
  const faqSchema = {
    "@type": "FAQPage",
    "mainEntity": currentFAQs.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <section className="py-16 bg-gradient-to-b from-stone-50/50 to-stone-100/50 border-t border-stone-200/50">
      <StructuredData data={faqSchema} id={`faq-schema-${categorySlug}`} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary mt-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-stone-500 mt-2">
            Get professional insights from our elite wood craftsmanship team.
          </p>
        </div>

        <div className="space-y-4">
          {currentFAQs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-stone-200/60 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-secondary hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="text-base md:text-lg leading-snug group-hover:translate-x-0.5 transition-transform duration-200">
                    {faq.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center bg-stone-100 text-stone-500 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300 shrink-0 ${
                      isOpen ? "rotate-180 bg-primary/10 text-primary" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-[300px] border-t border-stone-100" : "max-h-0"
                  } overflow-hidden`}
                >
                  <div className="px-6 py-5 text-stone-600 text-sm md:text-base leading-relaxed bg-stone-50/50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
