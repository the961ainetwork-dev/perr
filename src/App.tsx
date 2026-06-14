import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import PicklePepperMarketplace from "./components/PicklePepperMarketplace";
import RecipeBook from "./components/RecipeBook";
import SellerPortal from "./components/SellerPortal";
import OrderTracker from "./components/OrderTracker";
import AdminZone from "./components/AdminZone";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import FAQModal from "./components/FAQModal";
import { Compass, Flame, Leaf, Truck, Instagram, Twitter, Pin } from "lucide-react";

function MainAppContent() {
  const { userRole } = useApp();
  
  // Tab states: "market" | "recipes" | "seller" | "tracker" | "admin"
  const [activeTab, setActiveTab] = useState<string>("market");
  
  // Deep-linking recipe ID passed to RecipeBook
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  // Cart / Checkout visual switches
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  // Hero category shortcut filter state passed down to marketplace
  const [heroCategoryFilter, setHeroCategoryFilter] = useState<"pickle" | "pepper" | "all">("all");

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
        />

        {/* Dynamic Display Panels */}
        <main className="grow">
          
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
              />
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
              />
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

          {/* 5. ADMIN ZONE TAB */}
          {activeTab === "admin" && userRole === "admin" && (
            <div className="py-8 animate-in fade-in duration-150">
              <AdminZone />
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

      {/* Gourmet Pickling Manifesto Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-12 px-6" id="app-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          {/* Col 1 Brand Statement */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 select-none">
              <span className="text-2xl">🌶️</span>
              <span className="font-serif text-base font-bold text-stone-100 tracking-tight">
                Brine &amp; Bite
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
                href="https://instagram.com/brineandbite"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-none border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/50 transition-all bg-stone-900 shadow-2xs"
                title="Instagram Community Link"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com/brineandbite"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-none border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/50 transition-all bg-stone-900 shadow-2xs"
                title="Twitter dispatch channels"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://pinterest.com/brineandbite"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-none border border-stone-800 flex items-center justify-center text-stone-400 hover:text-amber-400 hover:border-amber-400/50 transition-all bg-stone-900 shadow-2xs"
                title="Pinterest preservation boards"
              >
                <Pin className="w-3.5 h-3.5 rotate-45" />
              </a>
            </div>
            <div className="text-[10px] text-stone-504 font-mono pt-1">
              © 2026 Brine &amp; Bite Corporates. Made with pride by local pickleheads.
            </div>
          </div>

        </div>
      </footer>

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
