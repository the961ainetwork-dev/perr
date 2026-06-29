import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { ShoppingCart, ChefHat, Store, Shield, User, Compass, HelpCircle, Search, X, Coins, Sparkles, BookOpen, Activity } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCart: () => void;
  onSelectProduct?: (id: string) => void;
  onSelectRecipe?: (id: string) => void;
}

export default function Header({ activeTab, setActiveTab, openCart, onSelectProduct, onSelectRecipe }: HeaderProps) {
  const { cart, userRole, setUserRole, headerSearchQuery, setHeaderSearchQuery, products, recipes } = useApp();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  
  const [mobileMarketOpen, setMobileMarketOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  
  const trimmedQuery = headerSearchQuery.trim().toLowerCase();
  
  const matchingProducts = useMemo(() => {
    if (!trimmedQuery) return [];
    return products.filter((p) => p.name.toLowerCase().includes(trimmedQuery));
  }, [products, trimmedQuery]);

  const matchingRecipes = useMemo(() => {
    if (!trimmedQuery) return [];
    return recipes.filter((r) => r.title.toLowerCase().includes(trimmedQuery));
  }, [recipes, trimmedQuery]);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const tabs = [
    { id: "market", label: "Marketplace", icon: Store, role: ["customer", "seller", "admin"] },
    { id: "showcase", label: "Collection", icon: Sparkles, role: ["customer", "seller", "admin"] },
    { id: "recipes", label: "Artisan Recipes", icon: ChefHat, role: ["customer", "seller", "admin"] },
    { id: "dropship", label: "Dropship Hub", icon: Coins, role: ["customer", "seller", "admin"] },
    { id: "about", label: "About Us", icon: BookOpen, role: ["customer", "seller", "admin"] },
    { id: "philosophy", label: "Our Philosophy", icon: Activity, role: ["customer", "seller", "admin"] },
    { id: "seller", label: "Seller Kitchen", icon: User, role: ["customer", "seller"] },
    { id: "tracker", label: "Track Orders", icon: Compass, role: ["customer", "seller"] },
    { id: "admin", label: "Admin Kitchen", icon: Shield, role: ["admin"] },
  ];

  return (
    <header className="sticky top-0 z-40 bg-editorial-cream/95 backdrop-blur-md border-b border-editorial-charcoal/10" id="main-header">
      {/* Top bar with quick user testing switcher */}
      <div className="bg-editorial-gray flex items-center justify-between px-6 py-1.5 border-b border-editorial-charcoal/15 text-[10px] text-editorial-charcoal/80 uppercase tracking-widest font-mono">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 bg-editorial-red rounded-full"></span>
          <span>ESTD 1994 &mdash; The Fermentary Specialists</span>
        </div>
        
        {/* Role Switcher */}
        <div className="flex items-center gap-3">
          <span className="font-semibold text-editorial-charcoal/50 hidden sm:inline">Role Filter:</span>
          <div className="flex bg-editorial-cream p-0.5 rounded-xs border border-editorial-charcoal/20">
            {(["customer", "seller", "admin"] as const).map((role) => (
              <button
                key={role}
                id={`role-btn-${role}`}
                onClick={() => {
                  setUserRole(role);
                  // Auto-switch tabs to avoid staying on admin when switching to customer
                  if (role === "customer" && activeTab === "admin") {
                    setActiveTab("market");
                  } else if (role === "seller" && activeTab === "admin") {
                    setActiveTab("seller");
                  } else if (role === "admin") {
                    setActiveTab("admin");
                  }
                }}
                className={`px-3 py-0.5 capitalize font-mono transition-all text-[9px] font-bold ${
                  userRole === role
                    ? "bg-editorial-charcoal text-editorial-cream"
                    : "text-editorial-charcoal/65 hover:text-editorial-charcoal hover:bg-editorial-gray"
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <div 
          onClick={() => setActiveTab("market")} 
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
          id="branding-logo"
        >
          <div className="font-serif text-2xl font-black italic tracking-tighter text-editorial-charcoal group-hover:text-editorial-red transition-colors">
            HAMOD.
          </div>
          <div className="border-l border-editorial-charcoal/20 pl-3">
            <span className="font-serif text-sm font-bold tracking-tight block leading-none text-editorial-charcoal">
              HamodWHarr
            </span>
            <span className="text-[8px] font-mono uppercase tracking-widest text-[#C1121F] font-semibold block mt-0.5">
              Sour &amp; Spicy Heat
            </span>
          </div>
        </div>

        {/* Real-time Global Search Bar with Live Results Dropdown */}
        <div className="flex-1 max-w-[150px] sm:max-w-[220px] md:max-w-[180px] lg:max-w-[280px] xl:max-w-md relative mx-1 md:mx-4" id="header-search-container">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-editorial-charcoal/40 transition-colors pointer-events-none" />
            <input
              type="text"
              id="header-search-bar"
              value={headerSearchQuery}
              onChange={(e) => {
                const val = e.target.value;
                setHeaderSearchQuery(val);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              placeholder="Search name, category, ingredients..."
              className="w-full h-8 pl-8 pr-7 bg-editorial-gray/40 border border-editorial-charcoal/15 text-[10.5px] font-mono tracking-tight text-editorial-charcoal placeholder-editorial-charcoal/30 focus:outline-none focus:border-[#C1121F] focus:bg-white transition-all rounded-none shadow-3xs"
            />
            {headerSearchQuery && (
              <button
                onClick={() => {
                  setHeaderSearchQuery("");
                  setIsDropdownOpen(false);
                }}
                className="absolute right-2 p-0.5 text-editorial-charcoal/45 hover:text-[#C1121F] transition-colors cursor-pointer"
                title="Clear global search"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Floating Dropdown Results Popover */}
          {trimmedQuery && isDropdownOpen && (
            <>
              {/* Invisible Fullscreen Backdrop to safely click out & close */}
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setIsDropdownOpen(false)}
              />
              
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-0 mt-2 w-[280px] sm:w-[400px] bg-[#FAF9F6] border-2 border-editorial-charcoal shadow-xl z-50 text-left"
                id="header-search-dropdown"
              >
                <div className="p-2.5 border-b border-editorial-charcoal/15 bg-editorial-gray flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#C1121F]">Search Results</span>
                  <span className="text-[8px] font-mono uppercase text-editorial-charcoal/40">Found {matchingProducts.length + matchingRecipes.length} Matches</span>
                </div>

                <div className="max-h-[320px] overflow-y-auto divide-y divide-editorial-charcoal/10">
                  
                  {/* PRODUCTS MATCHES */}
                  {matchingProducts.length > 0 && (
                    <div>
                      <div className="bg-editorial-gray/40 px-3 py-1 text-[8px] font-mono font-bold text-editorial-charcoal/50 uppercase tracking-widest">
                        🛒 Marketplace Products ({matchingProducts.length})
                      </div>
                      <div className="p-1 space-y-0.5">
                        {matchingProducts.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setHeaderSearchQuery("");
                              if (onSelectProduct) {
                                onSelectProduct(p.id);
                              } else {
                                setActiveTab("market");
                              }
                            }}
                            className="w-full text-left p-1.5 hover:bg-white flex items-center justify-between gap-3 group transition-colors cursor-pointer border border-transparent hover:border-editorial-charcoal/10"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img 
                                src={p.image} 
                                alt={p.name} 
                                className="w-7 h-7 object-cover border border-editorial-charcoal/10 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="min-w-0">
                                <span className="block text-xs font-serif italic text-editorial-charcoal font-bold truncate group-hover:text-[#C1121F] transition-colors leading-tight">
                                  {p.name}
                                </span>
                                <span className="block text-[8px] font-mono uppercase text-editorial-charcoal/40 leading-none mt-0.5">
                                  By {p.sellerName || p.supplierName} • {p.category}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="block text-xs font-serif font-black text-editorial-charcoal">${p.price.toFixed(2)}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RECIPES MATCHES */}
                  {matchingRecipes.length > 0 && (
                    <div>
                      <div className="bg-editorial-gray/40 px-3 py-1 text-[8px] font-mono font-bold text-editorial-charcoal/50 uppercase tracking-widest">
                        🍳 Cooking Recipes ({matchingRecipes.length})
                      </div>
                      <div className="p-1 space-y-0.5">
                        {matchingRecipes.map((r) => (
                          <button
                            key={r.id}
                            onClick={() => {
                              setIsDropdownOpen(false);
                              setHeaderSearchQuery("");
                              if (onSelectRecipe) {
                                onSelectRecipe(r.id);
                              } else {
                                setActiveTab("recipes");
                              }
                            }}
                            className="w-full text-left p-1.5 hover:bg-white flex items-center justify-between gap-3 group transition-colors cursor-pointer border border-transparent hover:border-editorial-charcoal/10"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-7 h-7 bg-editorial-charcoal text-editorial-cream flex items-center justify-center shrink-0 border border-editorial-charcoal">
                                <ChefHat className="w-3.5 h-3.5 text-editorial-red" />
                              </div>
                              <div className="min-w-0">
                                <span className="block text-xs font-serif italic text-editorial-charcoal font-bold truncate group-hover:text-editorial-green transition-all leading-tight">
                                  {r.title}
                                </span>
                                <span className="block text-[8px] font-mono uppercase text-editorial-charcoal/40 leading-none mt-0.5">
                                  By {r.author} • {r.difficulty}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right">
                              <span className="block text-[9px] font-mono font-bold text-editorial-green">{r.prepTime}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NO MATCHES OVERLAY */}
                  {matchingProducts.length === 0 && matchingRecipes.length === 0 && (
                    <div className="p-6 text-center bg-white space-y-1">
                      <p className="text-xs text-stone-500 italic">No products or culinary guides matched.</p>
                      <p className="text-[7.5px] font-mono text-stone-400 uppercase tracking-widest">Check spelling or use ingredients query keywords</p>
                    </div>
                  )}

                </div>

                <div className="bg-editorial-gray px-2.5 py-1.5 border-t border-editorial-charcoal/10 text-center">
                  <span className="text-[8px] font-mono uppercase text-[#C1121F] font-bold">
                    Click an item to inspect specific specimen details
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Dynamic Center Tabs */}
        <nav className="hidden md:flex items-center gap-5">
          {/* Marketplace Submenu */}
          <div 
            className="relative"
            onMouseEnter={() => setMarketOpen(true)}
            onMouseLeave={() => setMarketOpen(false)}
          >
            <button
              onClick={() => {
                setActiveTab("market");
                setMarketOpen(!marketOpen);
              }}
              className={`flex items-center gap-1.5 px-1 py-1 text-[11px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 cursor-pointer ${
                ["market", "showcase", "recipes", "dropship"].includes(activeTab)
                  ? "border-editorial-red text-editorial-charcoal"
                  : "border-transparent text-editorial-charcoal/40 hover:text-editorial-charcoal"
              }`}
            >
              <Store className="w-3.5 h-3.5 shrink-0" />
              <span>Marketplace</span>
              <span className="text-[8px] opacity-60">▼</span>
            </button>

            {marketOpen && (
              <div className="absolute left-0 mt-1 w-52 bg-[#FAF9F6] border-2 border-editorial-charcoal shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 rounded-none text-left">
                <button
                  onClick={() => { setActiveTab("market"); setMarketOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-mono uppercase tracking-wider hover:bg-editorial-gray flex items-center gap-2 cursor-pointer ${
                    activeTab === "market" ? "text-editorial-red font-black" : "text-editorial-charcoal/80"
                  }`}
                >
                  <Store className="w-3.5 h-3.5 shrink-0" />
                  <span>Marketplace Home</span>
                </button>
                <button
                  onClick={() => { setActiveTab("showcase"); setMarketOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-mono uppercase tracking-wider hover:bg-editorial-gray flex items-center gap-2 cursor-pointer ${
                    activeTab === "showcase" ? "text-editorial-red font-black" : "text-editorial-charcoal/80"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>Collection</span>
                </button>
                <button
                  onClick={() => { setActiveTab("recipes"); setMarketOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-mono uppercase tracking-wider hover:bg-editorial-gray flex items-center gap-2 cursor-pointer ${
                    activeTab === "recipes" ? "text-editorial-red font-black" : "text-editorial-charcoal/80"
                  }`}
                >
                  <ChefHat className="w-3.5 h-3.5 shrink-0" />
                  <span>Artisan Recipes</span>
                </button>
                <button
                  onClick={() => { setActiveTab("dropship"); setMarketOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-mono uppercase tracking-wider hover:bg-editorial-gray flex items-center gap-2 cursor-pointer ${
                    activeTab === "dropship" ? "text-editorial-red font-black" : "text-editorial-charcoal/80"
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 shrink-0" />
                  <span>Dropship Hub</span>
                </button>
              </div>
            )}
          </div>

          {/* About Us Submenu */}
          <div 
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              onClick={() => {
                setActiveTab("about");
                setAboutOpen(!aboutOpen);
              }}
              className={`flex items-center gap-1.5 px-1 py-1 text-[11px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 cursor-pointer ${
                ["about", "philosophy"].includes(activeTab)
                  ? "border-editorial-red text-editorial-charcoal"
                  : "border-transparent text-editorial-charcoal/40 hover:text-editorial-charcoal"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>About Us</span>
              <span className="text-[8px] opacity-60">▼</span>
            </button>

            {aboutOpen && (
              <div className="absolute left-0 mt-1 w-48 bg-[#FAF9F6] border-2 border-editorial-charcoal shadow-lg py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 rounded-none text-left">
                <button
                  onClick={() => { setActiveTab("about"); setAboutOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-mono uppercase tracking-wider hover:bg-editorial-gray flex items-center gap-2 cursor-pointer ${
                    activeTab === "about" ? "text-editorial-red font-black" : "text-editorial-charcoal/80"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 shrink-0" />
                  <span>About Hamod & Har</span>
                </button>
                <button
                  onClick={() => { setActiveTab("philosophy"); setAboutOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[12px] font-mono uppercase tracking-wider hover:bg-editorial-gray flex items-center gap-2 cursor-pointer ${
                    activeTab === "philosophy" ? "text-editorial-red font-black" : "text-editorial-charcoal/80"
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 shrink-0" />
                  <span>Our Philosophy</span>
                </button>
              </div>
            )}
          </div>

          {/* Other tabs */}
          {tabs
            .filter((tab) => tab.role.includes(userRole) && !["market", "showcase", "recipes", "dropship", "about", "philosophy"].includes(tab.id))
            .map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-1 text-[11px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 cursor-pointer ${
                    isActive
                      ? "border-editorial-red text-editorial-charcoal"
                      : "border-transparent text-editorial-charcoal/40 hover:text-editorial-charcoal"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
        </nav>

        {/* Action buttons (Right side) */}
        <div className="flex items-center gap-4">
          {/* Mobile view indicator or quick menu key */}
          <div className="flex md:hidden bg-editorial-gray rounded-sm p-1 border border-editorial-charcoal/10 gap-1">
            {/* Marketplace Button Group on Mobile */}
            <div className="relative">
              <button
                onClick={() => {
                  setActiveTab("market");
                  setMobileMarketOpen(!mobileMarketOpen);
                  setMobileAboutOpen(false);
                }}
                className={`p-2 rounded-xs transition-all flex items-center justify-center cursor-pointer ${
                  ["market", "showcase", "recipes", "dropship"].includes(activeTab)
                    ? "bg-editorial-charcoal text-editorial-cream font-bold"
                    : "text-editorial-charcoal/60 hover:text-editorial-charcoal"
                }`}
                title="Marketplace Menu"
              >
                <Store className="w-3.5 h-3.5" />
                <span className="text-[6.5px] ml-0.5">▼</span>
              </button>

              {mobileMarketOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setMobileMarketOpen(false)} />
                  <div className="absolute left-0 mt-2 w-44 bg-[#FAF9F6] border-2 border-editorial-charcoal shadow-xl z-50 py-1 font-mono text-[11px] uppercase tracking-wider text-left">
                    <button
                      onClick={() => { setActiveTab("market"); setMobileMarketOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-editorial-gray flex items-center gap-1.5 cursor-pointer ${activeTab === "market" ? "text-editorial-red font-bold" : "text-editorial-charcoal"}`}
                    >
                      <Store className="w-3.5 h-3.5 shrink-0" />
                      <span>Market Home</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab("showcase"); setMobileMarketOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-editorial-gray flex items-center gap-1.5 cursor-pointer ${activeTab === "showcase" ? "text-editorial-red font-bold" : "text-editorial-charcoal"}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0" />
                      <span>Collection</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab("recipes"); setMobileMarketOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-editorial-gray flex items-center gap-1.5 cursor-pointer ${activeTab === "recipes" ? "text-editorial-red font-bold" : "text-editorial-charcoal"}`}
                    >
                      <ChefHat className="w-3.5 h-3.5 shrink-0" />
                      <span>Artisan Recipes</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab("dropship"); setMobileMarketOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-editorial-gray flex items-center gap-1.5 cursor-pointer ${activeTab === "dropship" ? "text-editorial-red font-bold" : "text-editorial-charcoal"}`}
                    >
                      <Coins className="w-3.5 h-3.5 shrink-0" />
                      <span>Dropship Hub</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* About Us Button Group on Mobile */}
            <div className="relative">
              <button
                onClick={() => {
                  setActiveTab("about");
                  setMobileAboutOpen(!mobileAboutOpen);
                  setMobileMarketOpen(false);
                }}
                className={`p-2 rounded-xs transition-all flex items-center justify-center cursor-pointer ${
                  ["about", "philosophy"].includes(activeTab)
                    ? "bg-editorial-charcoal text-editorial-cream font-bold"
                    : "text-editorial-charcoal/60 hover:text-editorial-charcoal"
                }`}
                title="About Menu"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="text-[6.5px] ml-0.5">▼</span>
              </button>

              {mobileAboutOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setMobileAboutOpen(false)} />
                  <div className="absolute left-0 mt-2 w-40 bg-[#FAF9F6] border-2 border-editorial-charcoal shadow-xl z-50 py-1 font-mono text-[11px] uppercase tracking-wider text-left">
                    <button
                      onClick={() => { setActiveTab("about"); setMobileAboutOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-editorial-gray flex items-center gap-1.5 cursor-pointer ${activeTab === "about" ? "text-editorial-red font-bold" : "text-editorial-charcoal"}`}
                    >
                      <BookOpen className="w-3.5 h-3.5 shrink-0" />
                      <span>About Us</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab("philosophy"); setMobileAboutOpen(false); }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-editorial-gray flex items-center gap-1.5 cursor-pointer ${activeTab === "philosophy" ? "text-editorial-red font-bold" : "text-editorial-charcoal"}`}
                    >
                      <Activity className="w-3.5 h-3.5 shrink-0" />
                      <span>Our Philosophy</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Other buttons on Mobile */}
            {tabs
              .filter((tab) => tab.role.includes(userRole) && !["market", "showcase", "recipes", "dropship", "about", "philosophy"].includes(tab.id))
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMarketOpen(false);
                      setMobileAboutOpen(false);
                    }}
                    className={`p-2 rounded-xs transition-all cursor-pointer ${
                      isActive ? "bg-editorial-charcoal text-editorial-cream" : "text-editorial-charcoal/60 hover:text-editorial-charcoal"
                    }`}
                    title={tab.label}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                );
              })}
          </div>

          {/* Cart Icon */}
          {userRole !== "admin" && (
            <button
              id="open-cart-btn"
              onClick={openCart}
              className="relative px-4 py-2 bg-transparent text-editorial-charcoal border border-editorial-charcoal hover:bg-editorial-charcoal hover:text-editorial-cream transition-all text-sm font-bold font-mono tracking-widest uppercase flex items-center gap-2"
              aria-label="Toggle shopping cart"
            >
              <span>Basket</span>
              <span className="bg-editorial-red text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cartItemCount}
              </span>
            </button>
          )}

          {/* Current Role Indicator */}
          <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-editorial-charcoal/15">
            <div className="w-9 h-9 border border-editorial-charcoal/30 flex items-center justify-center text-sm">
              {userRole === "admin" ? "👑" : userRole === "seller" ? "🌾" : "🍷"}
            </div>
            <div className="text-left text-xs leading-none">
              <span className="block font-mono text-[9px] uppercase tracking-wider text-editorial-charcoal/40">Provenance</span>
              <span className="text-xs font-bold text-editorial-charcoal capitalize mt-0.5 block">{userRole} view</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
