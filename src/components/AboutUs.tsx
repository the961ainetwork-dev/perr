import React from "react";
import { motion } from "motion/react";
import { Leaf, Flame, Utensils, BookOpen, GraduationCap, Heart } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 text-left" id="about-us-page">
      {/* Editorial Header */}
      <div className="border-b-2 border-editorial-charcoal pb-8 mb-12 text-center md:text-left">
        <span className="text-[11px] font-mono tracking-widest uppercase text-[#C1121F] font-bold block mb-3">
          ✦ OUR HISTORY & MISSION
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-black tracking-tight text-editorial-charcoal leading-tight">
          About Hamod & Har
        </h1>
        <p className="mt-4 font-serif text-lg text-editorial-charcoal/70 leading-relaxed max-w-2xl">
          A dedicated journey celebrating Lebanese hospitality, genuine cold fermentation craftsmanship, and gut-friendly, fiery flavors.
        </p>
      </div>

      {/* Main Content Layout with Grid and Text */}
      <div className="space-y-12">
        {/* Section 1: Lebanese Heritage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Leaf className="w-5 h-5 text-editorial-green shrink-0" />
              <h2 className="font-serif text-2xl font-bold text-editorial-charcoal">
                Rooted in Lebanese Heritage
              </h2>
            </div>
            <div className="text-sm text-editorial-charcoal/80 leading-relaxed space-y-4 font-sans">
              <p>
                At Hamod & Har, we believe that the best food tells a story. Our journey is deeply rooted in the rich traditions of authentic Lebanese hospitality, where every meal is a celebration and every guest is treated like family.
              </p>
              <p>
                For generations, the Lebanese kitchen has mastered the art of preservation—capturing the bright, bold flavors of the harvest to be enjoyed year-round. We created Hamod & Har to bring that exact same authenticity to your table. We do not cut corners, and we do not use artificial shortcuts. We rely on time-honored fermentation methods to craft probiotic-rich foods that nourish the body and comfort the soul.
              </p>
            </div>
          </div>
          <div className="md:col-span-4 bg-editorial-gray p-6 border border-editorial-charcoal/10">
            <h3 className="font-mono text-[10px] tracking-widest uppercase text-editorial-charcoal/40 font-bold block mb-3">
              THE PROVENANCE
            </h3>
            <span className="text-3xl block mb-2">🏺</span>
            <p className="text-xs font-mono leading-relaxed text-editorial-charcoal/70">
              Lebanese preservation is called "Mouneh". It relies purely on the cycles of nature, raw sea salt, and solar energy to secure absolute crispness and rich nutrients.
            </p>
          </div>
        </div>

        {/* Section 2: Partner in the Kitchen */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-t border-editorial-charcoal/10 pt-12">
          <div className="md:col-span-4 md:order-last bg-editorial-gray p-6 border border-editorial-charcoal/10">
            <h3 className="font-mono text-[10px] tracking-widest uppercase text-editorial-charcoal/40 font-bold block mb-3">
              YOUR KITCHEN COMPANION
            </h3>
            <span className="text-3xl block mb-2">🧑‍🍳</span>
            <p className="text-xs font-mono leading-relaxed text-editorial-charcoal/70">
              Each jar is shipped with custom QR guides directing you to tested family recipe sheets. We turn basic meals into gourmet visual spreads.
            </p>
          </div>
          <div className="md:col-span-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <Utensils className="w-5 h-5 text-amber-600 shrink-0" />
              <h2 className="font-serif text-2xl font-bold text-editorial-charcoal">
                Your Partner in the Kitchen
              </h2>
            </div>
            <div className="text-sm text-editorial-charcoal/80 leading-relaxed space-y-4 font-sans">
              <p>
                We are more than just a pantry staple; we are here to help you cook! We know that using fermented foods can sometimes feel intimidating, which is why we are dedicated to supporting cooks of all skill levels.
              </p>
              <p className="font-medium text-editorial-charcoal">
                When you explore our store, you will also find:
              </p>
              <ul className="space-y-4 text-xs font-mono text-editorial-charcoal/90">
                <li className="flex gap-3">
                  <span className="text-editorial-red">✦</span>
                  <div>
                    <strong className="text-editorial-charcoal block uppercase text-[10px]">A Growing Library of Online Recipes:</strong>
                    <span className="text-editorial-charcoal/70">From traditional Lebanese mezze to modern fusion dishes, we provide step-by-step guides on how to make our pickles and probiotics the star of your meals.</span>
                  </div>
                </li>
                <li className="flex gap-3">
                  <span className="text-editorial-red">✦</span>
                  <div>
                    <strong className="text-editorial-charcoal block uppercase text-[10px]">Tips & Tricks for Cooks:</strong>
                    <span className="text-editorial-charcoal/70">Whether you are looking to elevate a simple sandwich, add the perfect tangy crunch to a salad, or balance a rich stew, we are here to share the culinary secrets that make Lebanese cuisine so unforgettable.</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: The Pepper Section */}
        <div className="bg-[#1A1A1A] text-white p-8 md:p-10 border border-editorial-charcoal/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Flame className="w-6 h-6 text-editorial-red shrink-0" />
              <h2 className="font-serif text-2xl font-bold text-white">
                Turn Up the Heat: The "Har" Pepper Section
              </h2>
            </div>
            <span className="bg-editorial-red text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 font-bold">
              Sour &amp; Spicy Core
            </span>
          </div>

          <div className="text-sm text-stone-300 leading-relaxed font-sans">
            <p>
              You cannot have "Hamod & Har" (Sour & Spicy) without a true dedication to heat! For those who crave a fiery kick, we have created a dedicated Pepper Section. This isn't just about pure spice; it is about complex, fermented heat that enhances your food rather than overpowering it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 border border-white/10 bg-white/5 space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                01. AUTHENTIC PROFILES
              </div>
              <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                Carefully selected heirloom pepper varieties fermented to absolute perfection, capturing deep capsaicin esters.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-white/5 space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                02. BALANCED HEAT
              </div>
              <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                A structured gradient of heat, ranging from a mild warming tingle to an intense, bold, lingering burn.
              </p>
            </div>

            <div className="p-4 border border-white/10 bg-white/5 space-y-2">
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                03. GUT-FRIENDLY SPICE
              </div>
              <p className="text-[11px] text-stone-400 font-sans leading-relaxed">
                All the fiery, complex flavor you love, loaded with natural lacto-probiotics your digestive system craves.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
