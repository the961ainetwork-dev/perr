import React from "react";
import { motion } from "motion/react";
import { Activity, Brain, ShieldAlert, Sparkles, AlertCircle, Heart } from "lucide-react";

export default function OurPhilosophy() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-left" id="our-philosophy-page">
      {/* Editorial Header */}
      <div className="border-b-2 border-editorial-charcoal pb-8 mb-12 text-center md:text-left">
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#C1121F] font-bold block mb-3">
          ✦ SCIENTIFIC MANIFESTO
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-editorial-charcoal leading-tight">
          Our Philosophy
        </h1>
        <p className="mt-4 font-serif text-lg text-editorial-charcoal/70 leading-relaxed max-w-2xl">
          The Deep Dive: Why Traditional Fermentation Matters
        </p>
      </div>

      {/* Philosophy Introduction */}
      <div className="bg-editorial-gray p-8 border border-editorial-charcoal/10 mb-12 space-y-4">
        <p className="text-base text-editorial-charcoal leading-relaxed font-serif">
          In a world of mass-produced, heavily processed foods, true fermentation is an art form. For generations, traditional Lebanese kitchens have relied on time, salt, and nature to preserve the harvest—long before the invention of modern refrigeration. At Hamed &amp; Har, we honor this heritage by doing things the real way.
        </p>
        <div className="pt-4 border-t border-editorial-charcoal/10 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-editorial-red" />
          <span className="font-mono text-xs text-editorial-charcoal/60 uppercase tracking-wider font-bold">
            Here is what happens beneath the surface of a truly authentic, naturally fermented batch:
          </span>
        </div>
      </div>

      {/* 4 Pillars Grid / Accordion / Blocks */}
      <div className="space-y-12">
        {/* Pillar 1 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-editorial-charcoal/10 pb-10">
          <div className="md:col-span-4 flex items-baseline gap-3">
            <span className="font-serif text-4xl font-extrabold text-[#C1121F]">1.</span>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-editorial-charcoal">
                The Science of Lactic Acid Fermentation
              </h3>
              <span className="text-[10px] font-mono text-editorial-green uppercase tracking-wider font-semibold block">
                The Real Pickle Process
              </span>
            </div>
          </div>
          <div className="md:col-span-8 text-sm text-editorial-charcoal/80 leading-relaxed space-y-3 font-sans">
            <p>
              When you see commercial pickles in a supermarket, they are often just raw vegetables soaked in heated, pasteurized white vinegar. This process kills all bacteria (both good and bad) and offers zero probiotic benefits.
            </p>
            <p>
              Our traditional method is completely different. We submerge fresh, crisp ingredients in a carefully balanced saltwater brine. Over days and weeks, naturally occurring <strong>Lactobacillus</strong> bacteria wake up and begin to feed on the natural sugars in the vegetables. As they do, they produce lactic acid. This acid is what gives our authentic pickles that mouth-watering, complex tang—no artificial vinegar required.
            </p>
          </div>
        </div>

        {/* Pillar 2 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-editorial-charcoal/10 pb-10">
          <div className="md:col-span-4 flex items-baseline gap-3">
            <span className="font-serif text-4xl font-extrabold text-[#C1121F]">2.</span>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-editorial-charcoal">
                Prebiotics vs. Probiotics
              </h3>
              <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider font-semibold block">
                The Ultimate Team
              </span>
            </div>
          </div>
          <div className="md:col-span-8 text-sm text-editorial-charcoal/80 leading-relaxed space-y-3 font-sans">
            <p>
              You know about probiotics, but to get the most out of them, they need food. That is where prebiotics come in.
            </p>
            <p>
              Prebiotics are the tough, fibrous parts of the vegetables (like cucumbers, turnips, and cabbage) that our bodies cannot digest on their own.
            </p>
            <p>
              When you eat a naturally fermented vegetable, you are getting a powerful two-for-one deal: the living probiotic bacteria and the prebiotic fiber they need to thrive once they reach your gut. Scientists call this a <strong>"synbiotic"</strong> food, and it is the ultimate way to support digestion.
            </p>
          </div>
        </div>

        {/* Pillar 3 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start border-b border-editorial-charcoal/10 pb-10">
          <div className="md:col-span-4 flex items-baseline gap-3">
            <span className="font-serif text-4xl font-extrabold text-[#C1121F]">3.</span>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-editorial-charcoal">
                The Gut-Brain Connection
              </h3>
              <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider font-semibold block">
                The Second Brain
              </span>
            </div>
          </div>
          <div className="md:col-span-8 text-sm text-editorial-charcoal/80 leading-relaxed space-y-3 font-sans">
            <p>
              Did you know your gut is often called your "second brain"? The gut microbiome produces about 90% of your body's serotonin—the chemical responsible for stabilizing your mood and promoting happiness.
            </p>
            <p>
              By regularly eating naturally fermented, probiotic-rich foods, you are not just helping your stomach digest food; you are actually supporting your mental clarity, reducing inflammation, and maintaining steady energy levels throughout the day.
            </p>
          </div>
        </div>

        {/* Pillar 4 */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-10">
          <div className="md:col-span-4 flex items-baseline gap-3">
            <span className="font-serif text-4xl font-extrabold text-[#C1121F]">4.</span>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-editorial-charcoal">
                Alive and Kicking
              </h3>
              <span className="text-[10px] font-mono text-purple-600 uppercase tracking-wider font-semibold block">
                Active &amp; Carbonated
              </span>
            </div>
          </div>
          <div className="md:col-span-8 text-sm text-editorial-charcoal/80 leading-relaxed space-y-3 font-sans">
            <p>
              Because true fermentation creates a living food, you might notice a slight fizz or a popping sound when you open a fresh jar. That is a sign of life! It means the active cultures are healthy, strong, and ready to go to work for your immune system.
            </p>
            <div className="p-4 bg-emerald-50/50 border border-emerald-500/20 text-emerald-950 rounded-none flex gap-3 mt-3">
              <span className="text-xl">🦠</span>
              <p className="text-xs font-mono">
                No pasteurization. No high-heat sterilization post-packaging. Our live cultures are active and continue to break down starches slowly inside your refrigerator, intensifying the authentic taste over months!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
