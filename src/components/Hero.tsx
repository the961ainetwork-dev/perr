import React from "react";
import { Flame, Star, Compass, Award } from "lucide-react";

interface HeroProps {
  onSearchCategory: (category: "pickle" | "pepper" | "all") => void;
  activeCategoryFilter: string;
}

export default function Hero({ onSearchCategory, activeCategoryFilter }: HeroProps) {
  return (
    <div className="relative bg-editorial-cream border-b border-editorial-charcoal/10" id="hero-banner">
      
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Copywriting */}
        <div className="lg:col-span-7 text-left space-y-8">
          <div className="inline-flex space-x-3">
            <span className="px-3 py-1 border border-editorial-charcoal rounded-full text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]">
              Featured Harvest
            </span>
            <span className="px-3 py-1 border border-editorial-charcoal/15 rounded-full text-[10px] uppercase font-bold tracking-widest text-editorial-charcoal/50">
              ESTD 1994
            </span>
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7.5xl font-light text-editorial-charcoal leading-[0.95] tracking-tight">
            Old-World <span className="italic block mt-1">Brining.</span>
            <span className="font-bold text-editorial-red block mt-2 ml-12 lg:ml-20">Modern Bite.</span>
          </h1>

          <p className="max-w-xl text-stone-600 text-sm sm:text-base leading-relaxed font-sans">
            Welcome to the ultimate digital marketplace honoring pickles and peppers. Discover small-batch glass jars fermented under cold temperatures, fiery crops, and traditional pickling methodologies designed to elevate your kitchen.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              id="hero-all-btn"
              onClick={() => onSearchCategory("all")}
              className={`px-5 py-3 transition-all text-xs uppercase tracking-[0.2em] font-bold border ${
                activeCategoryFilter === "all"
                  ? "bg-editorial-charcoal text-editorial-cream border-editorial-charcoal shadow-sm"
                  : "bg-white text-editorial-charcoal border-editorial-charcoal/20 hover:border-editorial-charcoal"
              }`}
            >
              <span>The Market (All)</span>
            </button>
            <button
              id="hero-pickles-btn"
              onClick={() => onSearchCategory("pickle")}
              className={`px-5 py-3 transition-all text-xs uppercase tracking-[0.2em] font-bold border ${
                activeCategoryFilter === "pickle"
                  ? "bg-editorial-green text-white border-editorial-green shadow-sm"
                  : "bg-white text-editorial-charcoal border-editorial-charcoal/20 hover:border-editorial-charcoal"
              }`}
            >
              🥒 <span>Dill Pickles</span>
            </button>
            <button
              id="hero-peppers-btn"
              onClick={() => onSearchCategory("pepper")}
              className={`px-5 py-3 transition-all text-xs uppercase tracking-[0.2em] font-bold border ${
                activeCategoryFilter === "pepper"
                  ? "bg-[#C1121F] text-white border-[#C1121F] shadow-sm"
                  : "bg-white text-editorial-charcoal border-editorial-charcoal/20 hover:border-editorial-charcoal"
              }`}
            >
              🌶️ <span>Pepper Harvests</span>
            </button>
          </div>

          {/* Customer Reviews Rating Trust Line */}
          <div className="flex flex-wrap gap-6 pt-6 border-t border-editorial-charcoal/10 text-editorial-charcoal/50 text-[10px] uppercase tracking-wider font-bold">
            <div className="flex items-center gap-1.5">
              <div className="flex text-editorial-red">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="font-extrabold text-[#1A1A1A]">4.9/5 Rating</span>
              <span className="lowercase font-normal text-editorial-charcoal/40">(by 2,400+ pickleheads)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-editorial-green" />
              <span>100% Cold Brine Cured</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-editorial-red" />
              <span>Family Farms Only</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Promo Visual Card */}
        <div className="lg:col-span-5 w-full max-w-sm lg:max-w-md select-none relative group ml-auto">
          <div className="aspect-[3/4] bg-editorial-gray border border-editorial-charcoal/15 p-6 flex flex-col justify-between shadow-xs">
            
            <div className="relative flex-1">
              <img
                src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=650"
                alt="Artisanal pickle jar and peppers"
                className="w-full h-44 object-cover border border-editorial-charcoal/10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-editorial-cream text-editorial-charcoal border border-editorial-charcoal text-[9px] font-mono font-bold px-2 py-0.5">
                $12.99 BATCH
              </div>
            </div>

            <div className="space-y-2 mt-4 text-left">
              <span className="text-[9px] font-mono tracking-widest text-editorial-charcoal/40 uppercase block">Monthly Release No. 42</span>
              <span className="font-serif text-lg font-bold text-editorial-charcoal block italic">Bourbon Barrel Aged Chili Spear</span>
              <p className="text-editorial-charcoal/70 text-xs leading-relaxed font-sans line-clamp-2">
                Infused with garlic cloves, dills, and sweet shallots, aged 30 days in charred oak casks.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-editorial-charcoal/10 pt-3 mt-3">
              <div className="flex gap-2 items-center">
                <span className="font-serif font-black text-editorial-red text-base">$12.99</span>
                <span className="text-[10px] text-editorial-charcoal/40 line-through font-mono">$16.00</span>
              </div>
              <span className="text-[9px] uppercase tracking-widest bg-editorial-green text-white px-2.5 py-1 font-bold">
                Artisan Pick
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
