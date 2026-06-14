import React from "react";
import { useApp } from "../context/AppContext";
import { ShoppingCart, ChefHat, Store, Shield, User, Compass, HelpCircle } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openCart: () => void;
}

export default function Header({ activeTab, setActiveTab, openCart }: HeaderProps) {
  const { cart, userRole, setUserRole } = useApp();
  
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const tabs = [
    { id: "market", label: "Marketplace", icon: Store, role: ["customer", "seller", "admin"] },
    { id: "recipes", label: "Artisan Recipes", icon: ChefHat, role: ["customer", "seller", "admin"] },
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
          className="flex items-center gap-3 cursor-pointer select-none group"
          id="branding-logo"
        >
          <div className="font-serif text-2xl font-black italic tracking-tighter text-editorial-charcoal group-hover:text-editorial-red transition-colors">
            FERMENT.
          </div>
          <div className="border-l border-editorial-charcoal/20 pl-3">
            <span className="font-serif text-sm font-bold tracking-tight block leading-none text-editorial-charcoal">
              Brine &amp; Bite
            </span>
            <span className="text-[8px] font-mono uppercase tracking-widest text-[#C1121F] font-semibold block mt-0.5">
              Vinegar &amp; Heat
            </span>
          </div>
        </div>

        {/* Dynamic Center Tabs */}
        <nav className="hidden md:flex items-center gap-4">
          {tabs
            .filter((tab) => tab.role.includes(userRole))
            .map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-1 py-1 text-[11px] uppercase tracking-[0.2em] font-bold transition-all border-b-2 ${
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
          <div className="flex md:hidden bg-editorial-gray rounded-sm p-1 border border-editorial-charcoal/10">
            {tabs
              .filter((tab) => tab.role.includes(userRole))
              .map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-2 rounded-xs transition-all ${
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
