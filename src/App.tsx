import React, { useState, useEffect } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PicklePepperMarketplace from "./components/PicklePepperMarketplace";
import GiftCardSection from "./components/GiftCardSection";
import CollectionShowcase from "./components/CollectionShowcase";
import RecipeBook from "./components/RecipeBook";
import SellerPortal from "./components/SellerPortal";
import MerchantHub from "./components/MerchantHub";
import OrderTracker from "./components/OrderTracker";
import AdminZone from "./components/AdminZone";
import AboutUs from "./components/AboutUs";
import OurPhilosophy from "./components/OurPhilosophy";
import Catalogue from "./components/Catalogue";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import FAQModal from "./components/FAQModal";
import ToastContainer from "./components/ToastNotification";
import Breadcrumbs, { BreadcrumbItem } from "./components/Breadcrumbs";
import { ArrowUp, Compass, Flame, Leaf, Truck, Instagram, Twitter, Pin, Mail, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function MainAppContent() {
  const { userRole, addToast, recipes } = useApp();
  
  // Newsletter Subscription State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterPreference, setNewsletterPreference] = useState<"both" | "pickle" | "pepper">("both");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    
    setNewsletterSubscribed(true);
    addToast({
      title: "Subscription Active",
      message: `Enrolled successfully in our Weekly Brine Dispatch! Guides targeting ${
        newsletterPreference === "both" 
          ? "both pickles & peppers" 
          : newsletterPreference === "pickle" 
            ? "artisanal pickles" 
            : "spicy peppers"
      } will arrive shortly.`,
      type: "success"
    });
  };
  
  // Tab states: "market" | "recipes" | "seller" | "tracker" | "admin"
  const [activeTab, setActiveTab] = useState<string>("market");
  
  // Deep-linking recipe ID passed to RecipeBook
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Deep-linking product ID passed to marketplace
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Cart / Checkout visual switches
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  // Hero category shortcut filter state passed down to marketplace
  const [heroCategoryFilter, setHeroCategoryFilter] = useState<"pickle" | "pepper" | "all">("all");

  // Floating 'Back to Top' button scroll visibility
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroEl = document.getElementById("hero-banner");
      if (heroEl) {
        // Bounding rect bottom <= 0 means scroll past bottom of the Hero section
        const rect = heroEl.getBoundingClientRect();
        setShowScrollTop(rect.bottom <= 0);
      } else {
        // Fallback for tabs where the hero component is not currently rendered
        setShowScrollTop(window.scrollY > 450);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial verification
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleHeroCategorySearch = (category: "pickle" | "pepper" | "all") => {
    setHeroCategoryFilter(category);
    setActiveTab("market");
    
    // Smooth scroll down to marketplace
    const target = document.getElementById("marketplace-zone");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectRecipeFromProduct = (recipeId: string) => {
    setSelectedRecipeId(recipeId);
    setActiveTab("recipes");
    
    // Smooth scroll to top of recipe details page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSelectedRecipe = () => {
    setSelectedRecipeId(null);
  };

  // Dynamic Breadcrumb Items Builder
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [
      { 
        label: "Home", 
        onClick: () => { 
          setActiveTab("market"); 
          setHeroCategoryFilter("all"); 
          setSelectedRecipeId(null); 
          window.scrollTo({ top: 0, behavior: "smooth" });
        } 
      }
    ];

    if (activeTab === "market") {
      items.push({ 
        label: "Marketplace", 
        onClick: () => { 
          setHeroCategoryFilter("all"); 
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        isCurrent: heroCategoryFilter === "all"
      });

      if (heroCategoryFilter !== "all") {
        items.push({
          label: heroCategoryFilter === "pickle" ? "Artisanal Pickles" : "Spicy Peppers",
          onClick: () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
          isCurrent: true
        });
      }
    } else if (activeTab === "showcase") {
      items.push({
        label: "Collection Showcase",
        isCurrent: true
      });
    } else if (activeTab === "recipes") {
      items.push({
        label: "Artisan Recipes",
        onClick: () => {
          setSelectedRecipeId(null);
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        isCurrent: !selectedRecipeId
      });

      if (selectedRecipeId) {
        const matchingRecipe = recipes.find(r => r.id === selectedRecipeId);
        if (matchingRecipe) {
          items.push({
            label: matchingRecipe.title,
            isCurrent: true
          });
        }
      }
    } else if (activeTab === "dropship") {
      items.push({
        label: "Dropship Hub",
        isCurrent: true
      });
    } else if (activeTab === "catalogue") {
      items.push({
        label: "Catalogue",
        isCurrent: true
      });
    } else if (activeTab === "seller") {
      items.push({
        label: "Seller Kitchen",
        isCurrent: true
      });
    } else if (activeTab === "tracker") {
      items.push({
        label: "Track Orders",
        isCurrent: true
      });
    } else if (activeTab === "admin") {
      items.push({
        label: "Admin Kitchen",
        isCurrent: true
      });
    } else if (activeTab === "about") {
      items.push({
        label: "About Us",
        isCurrent: true
      });
    } else if (activeTab === "philosophy") {
      items.push({
        label: "Our Philosophy",
        isCurrent: true
      });
    }

    return items;
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-between font-sans text-stone-805 antialiased">
      <div>
        
        {/* Dynamic Navigation Header */}
        <Header 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            setActiveTab(tab);
            // Clear deeply linked recipe if they manually navigate back to recipe directory index
            if (tab === "recipes") {
              setSelectedRecipeId(null);
            }
          }}
          openCart={() => setIsCartOpen(true)}
          onSelectProduct={(productId) => {
            setSelectedProductId(productId);
            setActiveTab("market");
          }}
          onSelectRecipe={(recipeId) => {
            setSelectedRecipeId(recipeId);
            setActiveTab("recipes");
          }}
        />

        {/* Dynamic Display Panels */}
        <main className="grow">
          
          {/* Central Breadcrumbs */}
          <Breadcrumbs items={getBreadcrumbs()} />
          
          {/* 1. MARKETPLACE TAB */}
          {activeTab === "market" && (
            <div className="animate-in fade-in duration-205">
              <Hero 
                onSearchCategory={handleHeroCategorySearch} 
                activeCategoryFilter={heroCategoryFilter}
              />
              <PicklePepperMarketplace 
                onSelectRecipe={handleSelectRecipeFromProduct}
                onSetTab={setActiveTab}
                categoryFilter={heroCategoryFilter}
                onOpenCart={() => setIsCartOpen(true)}
                selectedProductId={selectedProductId}
                onClearSelectedProduct={() => setSelectedProductId(null)}
              />
              <GiftCardSection />
            </div>
          )}

          {/* COLLECTION SHOWCASE TAB */}
          {activeTab === "showcase" && (
            <div className="animate-in fade-in duration-200">
              <CollectionShowcase onOpenCart={() => setIsCartOpen(true)} />
            </div>
          )}

          {/* 2. ARTISAN RECIPES COOK BOOK TAB */}
          {activeTab === "recipes" && (
            <div className="py-8 animate-in fade-in duration-200">
              <RecipeBook 
                onSetTab={(tab) => {
                  setActiveTab(tab);
                  if (tab === "market") {
                    setHeroCategoryFilter("all");
                  }
                }}
                selectedRecipeId={selectedRecipeId}
                onClearSelectedRecipe={handleClearSelectedRecipe}
                onOpenCart={() => setIsCartOpen(true)}
              />
            </div>
          )}

          {/* 3. ARTISAN DROPSHIP COMMAND CENTRAL PORTAL */}
          {activeTab === "dropship" && (
            <div className="py-8 animate-in fade-in duration-200">
              <MerchantHub />
            </div>
          )}

          {/* 3. ARTISAN SELLER PORTAL TAB */}
          {activeTab === "seller" && (
            <div className="py-8 animate-in fade-in duration-200">
              <SellerPortal />
            </div>
          )}

          {/* 4. SHIPMENTS TRACKING LAB TAB */}
          {activeTab === "tracker" && (
            <div className="py-8 animate-in fade-in duration-200">
              <OrderTracker />
            </div>
          )}

          {/* CATALOGUE TAB */}
          {activeTab === "catalogue" && (
            <div className="py-8 animate-in fade-in duration-200">
              <Catalogue 
                onOpenCart={() => setIsCartOpen(true)}
                onSetTab={setActiveTab}
              />
            </div>
          )}

          {/* 5. ADMIN ZONE TAB */}
          {activeTab === "admin" && userRole === "admin" && (
            <div className="py-8 animate-in fade-in duration-150">
              <AdminZone />
            </div>
          )}

          {/* ABOUT US TAB */}
          {activeTab === "about" && (
            <div className="py-8 animate-in fade-in duration-200">
              <AboutUs />
            </div>
          )}

          {/* OUR PHILOSOPHY TAB */}
          {activeTab === "philosophy" && (
            <div className="py-8 animate-in fade-in duration-200">
              <OurPhilosophy />
            </div>
          )}

        </main>
      </div>

      {/* Cart side sliding drawer panel */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onBeginCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Secure Multi-step Checkout Wizard */}
      <CheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={(orderId) => {
          setActiveTab("tracker");
        }}
      />

      {/* Frequently Asked Questions Directory Manual */}
      <FAQModal 
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
      />

      {/* Dynamic Floating Toast Alerts System */}
      <ToastContainer 
        onViewOrder={(orderId) => {
          setActiveTab("tracker");
          setTimeout(() => {
            const trackerZone = document.getElementById("order-tracker-zone");
            if (trackerZone) {
              trackerZone.scrollIntoView({ behavior: "smooth" });
            }
          }, 150);
        }}
      />

      {/* Gourmet Pickling Manifesto Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-12 px-6" id="app-footer">
        {/* Newsletter Subscription Row */}
        <div className="max-w-7xl mx-auto border-b border-stone-800 pb-10 mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-2 lg:max-w-xl text-left">
            <span className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-bold block">
              ✦ WEEKLY DISPATCH SIGNUP
            </span>
            <h3 className="font-serif text-xl font-bold text-stone-100 tracking-tight">
              Get the Crispy &amp; Spicy Field Digests
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed font-sans">
              Sign up for curated weekly guides, micro-batch fermentation ratios, and live crop updates from our network of artisanal pepper farmers and pickle masters. No industrial filler, ever.
            </p>
          </div>

          <div className="w-full lg:max-w-md text-left">
            {!newsletterSubscribed ? (
              <form 
                onSubmit={handleNewsletterSubscribe}
                className="space-y-3"
                id="newsletter-signup-form"
              >
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative grow">
                    <span className="absolute left-3 top-2.5 text-stone-500">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      id="newsletter-email-input"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="w-full bg-stone-800/80 border border-stone-700 text-stone-100 placeholder-stone-500 text-xs py-2.5 pl-10 pr-3 focus:outline-none focus:border-amber-400 focus:bg-stone-800 transition-all rounded-none"
                    />
                  </div>
                  <button
                    id="newsletter-subscribe-button"
                    type="submit"
                    className="bg-amber-400 hover:bg-white text-stone-950 px-5 py-2.5 text-xs font-mono uppercase tracking-widest font-black transition-all cursor-pointer rounded-none flex items-center justify-center gap-1 shrink-0"
                  >
                    Subscribe
                  </button>
                </div>
                
                {/* Guide Preference Options */}
                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <span className="text-stone-500 text-[10px] font-mono uppercase">Guide Preferences:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-300 hover:text-white transition-colors select-none">
                    <input
                      type="radio"
                      name="newsletter-pref"
                      value="both"
                      checked={newsletterPreference === "both"}
                      onChange={() => setNewsletterPreference("both")}
                      className="accent-amber-400 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>Both Guides</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-300 hover:text-white transition-colors select-none">
                    <input
                      type="radio"
                      name="newsletter-pref"
                      value="pickle"
                      checked={newsletterPreference === "pickle"}
                      onChange={() => setNewsletterPreference("pickle")}
                      className="accent-amber-400 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>Artisanal Pickles</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-stone-300 hover:text-white transition-colors select-none">
                    <input
                      type="radio"
                      name="newsletter-pref"
                      value="pepper"
                      checked={newsletterPreference === "pepper"}
                      onChange={() => setNewsletterPreference("pepper")}
                      className="accent-amber-400 h-3.5 w-3.5 cursor-pointer"
                    />
                    <span>Spicy Peppers</span>
                  </label>
                </div>
              </form>
            ) : (
              <div 
                className="p-4 bg-stone-800/40 border border-emerald-500/20 text-stone-200 text-xs space-y-2 animate-in fade-in duration-300"
                id="newsletter-success-container"
              >
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check className="w-5 h-5 shrink-0" />
                  <span className="font-serif italic text-sm">Subscription Active!</span>
                </div>
                <p className="text-stone-400 leading-relaxed">
                  We've registered <strong className="text-stone-200">{newsletterEmail}</strong> with our 
                  <span className="text-amber-400"> {newsletterPreference === "both" ? "Pickles & Peppers" : newsletterPreference === "pickle" ? "Pickles-Only" : "Peppers-Only"}</span> preference digests. Look out for our weekly guide soon!
                </p>

                {/* Social Media Sharing Panel */}
                <div className="pt-2.5 border-t border-stone-800 space-y-2" id="newsletter-social-share-panel">
                  <span className="text-[9px] font-mono uppercase text-stone-500 tracking-wider block font-bold">Share subscription status:</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `I just subscribed to the HamodWHarr Weekly Dispatch! Can't wait for artisanal pickling & pepper recipes! 🌶️🏺 #hamodwharr`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-stone-800/80 hover:bg-stone-700 hover:text-white text-[9.5px] font-mono uppercase tracking-wider font-bold text-stone-300 py-1.5 px-2.5 transition-all"
                      title="Share subscription on X / Twitter"
                      id="share-twitter-btn"
                    >
                      <Twitter className="w-3 h-3 text-sky-400" />
                      <span>X / Twitter</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => {
                        addToast({
                          message: "Instagram subscription badge image link copied! Share to your feeds or stories 📸",
                          type: "info"
                        });
                        try {
                          navigator.clipboard.writeText("https://hamodwharr-newsletter-badge.png");
                        } catch (err) {}
                      }}
                      className="inline-flex items-center gap-1.5 bg-stone-800/80 hover:bg-stone-700 hover:text-white text-[9.5px] font-mono uppercase tracking-wider font-bold text-stone-300 py-1.5 px-2.5 transition-all text-left cursor-pointer border-none"
                      title="Copy subscription badge for Instagram"
                      id="share-instagram-btn"
                    >
                      <Instagram className="w-3 h-3 text-pink-500" />
                      <span>Instagram</span>
                    </button>

                    <a
                      href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                        "https://hamodwharr-newsletter"
                      )}&media=${encodeURIComponent(
                        "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?q=80&w=600&auto=format&fit=crop"
                      )}&description=${encodeURIComponent(
                        "I just subscribed to the HamodWHarr Weekly Dispatch! Artisanal pickling, small-batch fermentation recipes, & spicy peppers."
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-stone-800/80 hover:bg-stone-700 hover:text-white text-[9.5px] font-mono uppercase tracking-wider font-bold text-stone-300 py-1.5 px-2.5 transition-all"
                      title="Pin your subscription badge"
                      id="share-pinterest-btn"
                    >
                      <Pin className="w-3 h-3 text-red-500" />
                      <span>Pinterest</span>
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setNewsletterEmail("");
                    setNewsletterSubscribed(false);
                  }}
                  className="text-[9px] font-mono uppercase text-amber-500 hover:underline pt-1 block cursor-pointer bg-transparent border-none p-0"
                >
                  Change Email or Subscribe Another Address
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          {/* Col 1 Brand Statement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 select-none">
              <span className="text-2xl">🌶️</span>
              <span className="font-serif text-base font-bold text-stone-100 tracking-tight">
                HamodWHarr
              </span>
            </div>
            <p className="text-xs leading-relaxed text-stone-400 font-sans">
              We are a dedicated network of third-generation picklers and farm gardeners. Rejecting industrial shortcuts, our partner groups practice cold fermentation to seal crisp snaps and complex spicy juices into every glass masonry jar.
            </p>
          </div>

          {/* Col 2 Safe instructions */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-stone-205">Ethical Curing Manifesto</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex gap-2 items-center">
                <Leaf className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>100% Organic Raw Inputs</span>
              </li>
              <li className="flex gap-2 items-center">
                <Flame className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Natural Capsaicin Scorchs Only</span>
              </li>
              <li className="flex gap-2 items-center">
                <Truck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>Insulated Starch Packaging</span>
              </li>
            </ul>
          </div>

          {/* Col 3 Shortcuts */}
          <div className="space-y-3 font-sans text-xs">
            <h4 className="font-serif text-sm font-bold text-stone-205">Network Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => { setActiveTab("market"); setHeroCategoryFilter("all"); }} className="hover:text-amber-400 text-left cursor-pointer transition-colors">Marketplace</button>
              <button onClick={() => { setActiveTab("recipes"); setSelectedRecipeId(null); }} className="hover:text-amber-400 text-left cursor-pointer transition-colors">Recipes guides</button>
              <button onClick={() => setActiveTab("about")} className="hover:text-amber-400 text-left cursor-pointer transition-colors">About Us</button>
              <button onClick={() => setActiveTab("philosophy")} className="hover:text-amber-400 text-left cursor-pointer transition-colors">Our Philosophy</button>
              <button onClick={() => setActiveTab("seller")} className="hover:text-amber-400 text-left cursor-pointer transition-colors">Seller kitchen</button>
              <button onClick={() => setActiveTab("tracker")} className="hover:text-amber-400 text-left cursor-pointer transition-colors">Track orders</button>
              <button onClick={() => setIsFAQOpen(true)} className="hover:text-amber-450 text-left cursor-pointer transition-colors font-bold col-span-2 text-[#C1121F] border-t border-stone-800 pt-2 flex items-center gap-1.5 mt-1">
                <span>✦</span> Frequently Asked Questions
              </button>
            </div>
          </div>

          {/* Col 4 Licensing credit */}
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-stone-205">Artisan Sandbox Notice</h4>
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              All crop applications, payment options, and delivery tracking graphics run completely simulated inside local memory. Registered under Apache-2.0 codes.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mr-1 select-none">Preserve feeds:</span>
              <a
                href="https://instagram.com/hamodwharr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-none border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/50 transition-all bg-stone-900 shadow-2xs"
                title="Instagram Community Link"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com/hamodwharr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-none border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/50 transition-all bg-stone-900 shadow-2xs"
                title="Twitter dispatch channels"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pinterest.com/hamodwharr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-none border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/50 transition-all bg-stone-900 shadow-2xs"
                title="Pinterest preservation boards"
              >
                <Pin className="w-3.5 h-3.5 rotate-45" />
              </a>
            </div>
            <div className="text-[10px] text-stone-504 font-mono pt-1">
              © 2026 HamodWHarr Corporates. Made with pride by local pickleheads.
            </div>
          </div>

        </div>
      </footer>

      {/* Floating Back to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            id="back-to-top-button"
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 15 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={scrollToTop}
            title="Scroll to Top"
            aria-label="Back to top"
            className="fixed bottom-6 right-6 z-40 p-3 bg-[#1A1A1A] hover:bg-[#C1121F] text-[#FAF9F6] hover:text-white transition-colors duration-200 border border-white/10 bg-opacity-95 backdrop-blur-xs rounded-none shadow-md cursor-pointer flex items-center justify-center"
          >
            <ArrowUp className="w-5 h-5 text-current stroke-[2.5px]" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
