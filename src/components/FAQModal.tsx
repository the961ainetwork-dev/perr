import React, { useState, useMemo } from "react";
import { X, Search, ChevronDown, ChevronRight, HelpCircle, Truck, RefreshCw, Award } from "lucide-react";

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  id: string;
  category: "shipping" | "curation" | "technical";
  question: string;
  answer: string;
}

export default function FAQModal({ isOpen, onClose }: FAQModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "shipping" | "curation" | "technical">("all");
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    "ship-insulated": true, // open the first one by default
  });

  const faqData: FAQItem[] = [
    {
      id: "ship-insulated",
      category: "shipping",
      question: "How are the heavy glass masonry jars safely insulated for shipment?",
      answer: "We reject typical bubblewrap and petrochemical grids. All glass jars are snuggled in 100% biodegradable starch-insulated structural shells. These shells maintain stable temperatures in cargo trucks and digest completely under tap water in seconds. If a courier mishandles a batch and a jar reaches you cracked, alert us for an immediate replacement dispatch.",
    },
    {
      id: "ship-[#C1121F]",
      category: "shipping",
      question: "Why do you restrict shipping routes to fast-transit windows?",
      answer: "Because we practice cold-pack bottling with zero chemical pasteurization, our live, probiotic cultures are sensitive to deep ambient heat in transit warehouses. To shield the jar crispness, orders are shipped in insulated crates structured to arrive in under three days.",
    },
    {
      id: "practice-ferment",
      category: "curation",
      question: "What separates cold lacto-fermentation from standard factory canning?",
      answer: "Standard grocery store canning boils the jars to pasteurize the contents. While this makes shelf life indefinite, the high heat cooks the cucumbers, destroying their natural 'crunch' and killing all beneficial enzymes. Our micro-farms age our cucumbers in salt brine for 14 to 28 days under cold room controls. This generates beneficial organic acids while preserving an incredibly loud, crisp snap.",
    },
    {
      id: "practice-heat",
      category: "curation",
      question: "Why does the capsaicin heat level vary slightly from batch to batch?",
      answer: "Our partner cultivators practice dry-land farming, meaning we do not over-irrigate crops to artificially swell pepper weight. This results in concentrated, pure essential oils. Capsaicin potency naturally fluctuates based on seasonal sunlight intervals and clay soil variables. We label our products with honest heat ranks, but minor variation is the true signature of small-batch agriculture.",
    },
    {
      id: "usage-brine",
      category: "curation",
      question: "Can I safely reuse the artisan spicy pickling brine after the cucumbers are finished?",
      answer: "Absolutely! The brine is packed with rich garlic, organic vinegars, and capsaicin zest. It makes a beautiful marinade for slow-cooked barbecue pork, a sharp brine for raw chicken breast, or a perfect salty splash for an elegant dry martini cocktail.",
    },
    {
      id: "tech-bulge",
      category: "technical",
      question: "What should I do if my jar lid has a slight dome shape or bulges upwards?",
      answer: "Do not worry! Live ferments are biologically active and naturally exhale trace carbon dioxide gases, especially during temperature shifts. A slight dome in the metal lid or a light carbonated hiss upon unsealing is proof that your batch is alive and thriving. Keep refrigerated once opened to calm the active flora.",
    },
    {
      id: "tech-sim",
      category: "technical",
      question: "Is this payment framework real? Am I going to be charged money?",
      answer: "Absolutely not. HamodWHarr is a fully fledged administrative sandbox and culinary simulation kitchen. No active charges are placed on any credit card credentials you input here, and courier delivery tracking panels represent mock regional logistics data populated locally in your browser memory.",
    },
  ];

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFAQs = useMemo(() => {
    return faqData.filter((item) => {
      const matchesCategory = activeCategory === "all" || item.category === activeCategory;
      const cleanQuery = searchQuery.toLowerCase();
      const matchesSearch =
        item.question.toLowerCase().includes(cleanQuery) ||
        item.answer.toLowerCase().includes(cleanQuery);
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-editorial-charcoal/30 backdrop-blur-xs flex items-center justify-center p-4"
      id="faq-modal"
    >
      <div className="bg-editorial-cream rounded-none max-w-2xl w-full border border-editorial-charcoal/25 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col text-left text-editorial-charcoal font-sans">
        
        {/* Header */}
        <div className="p-5 bg-editorial-gray border-b border-editorial-charcoal/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C1121F]">Instructional Archives</span>
            <h3 className="font-serif text-2xl font-bold italic mt-0.5">The Curation FAQ Manual</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 border border-editorial-charcoal/10 hover:border-editorial-charcoal text-editorial-charcoal/50 hover:text-editorial-charcoal text-[9px] font-mono tracking-widest uppercase transition-all rounded-none bg-white font-bold cursor-pointer"
          >
            Close
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-5 bg-white border-b border-editorial-charcoal/10 space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-editorial-charcoal/40" />
            <input
              type="text"
              placeholder="Search techniques, shipping rules, or spice chemistry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-editorial-charcoal/15 text-xs text-editorial-charcoal rounded-none bg-editorial-gray/20 focus:bg-white focus:outline-none focus:border-[#C1121F] font-sans placeholder-editorial-charcoal/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-[9px] font-mono font-bold uppercase text-[#C1121F] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Categories Tab Pill Selector */}
          <div className="flex flex-wrap gap-1">
            {[
              { id: "all", label: "ALL TOPICS", icon: <HelpCircle className="w-3 h-3" /> },
              { id: "shipping", label: "LOGISTICS & TRANSIT", icon: <Truck className="w-3 h-3" /> },
              { id: "curation", label: "CLAY & CURING", icon: <Award className="w-3 h-3" /> },
              { id: "technical", label: "TECHNICAL SAFETY", icon: <RefreshCw className="w-3 h-3" /> },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider font-bold transition-all rounded-none border flex items-center gap-1.5 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-editorial-charcoal text-editorial-cream border-editorial-charcoal"
                    : "bg-white text-editorial-charcoal/60 border-editorial-charcoal/10 hover:border-editorial-charcoal/30 hover:bg-editorial-gray"
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* FAQ Scrollable Accordion Content */}
        <div className="p-5 overflow-y-auto space-y-3 bg-editorial-gray/25 grow max-h-[50vh]">
          {filteredFAQs.length === 0 ? (
            <div className="py-8 text-center text-editorial-charcoal/50 italic font-serif text-sm">
              No archives matched your search parameters. Try searching "brine" or "bulge".
            </div>
          ) : (
            filteredFAQs.map((faq) => {
              const isExpanded = expandedItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-white border border-editorial-charcoal/10 transition-colors duration-150 hover:border-editorial-charcoal/25"
                >
                  {/* Accordion Trigger Head */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-4 flex items-center justify-between text-left font-serif font-bold text-sm text-editorial-charcoal italic hover:bg-editorial-gray/40 transition-colors cursor-pointer select-none"
                  >
                    <span className="pr-4">{faq.question}</span>
                    <span className="shrink-0 text-[#C1121F]">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-[#C1121F]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-editorial-charcoal/40" />
                      )}
                    </span>
                  </button>

                  {/* Accordion Collapsible Panel */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 font-sans text-xs text-[#1A1A1A]/75 leading-relaxed border-t border-editorial-charcoal/5 animate-in slide-in-from-top-1 duration-100">
                      <p>{faq.answer}</p>
                      
                      {/* Topic Category stamp */}
                      <span className="inline-block mt-3 text-[8.5px] font-mono tracking-widest uppercase font-extrabold px-1.5 py-0.5 bg-editorial-gray text-editorial-charcoal/50">
                        Topic ID: L-{faq.category}
                      </span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Advisory */}
        <div className="p-5 bg-white border-t border-editorial-charcoal/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs">
          <div className="space-y-0.5 max-w-md">
            <span className="font-bold text-editorial-charcoal">Still seeking brine answers?</span>
            <p className="text-editorial-charcoal/60 text-[11px] leading-snug">
              Our partner kitchens are staffed around the clock. Dispatch your queries directly onto our administrative portal desk for tailored curation diagnostics.
            </p>
          </div>
          <a
            href="mailto:support@hamodwharr.com"
            className="shrink-0 bg-editorial-charcoal text-editorial-cream font-mono text-[9px] uppercase tracking-wider font-bold py-2.5 px-4 text-center hover:bg-[#C1121F] transition-all"
          >
            ARTISAN SUPPORT DESK
          </a>
        </div>

      </div>
    </div>
  );
}
