import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { 
  DollarSign, 
  ShoppingCart, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  X, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight,
  Database,
  FileJson,
  RefreshCcw,
  Check as CheckedIcon,
  Mail,
  Eye,
  Send,
  Smartphone,
  Monitor
} from "lucide-react";

export default function AdminZone() {
  const {
    products,
    recipes,
    orders,
    sellerSubmissions,
    recipeSubmissions,
    approveProductSubmission,
    rejectProductSubmission,
    approveRecipeSubmission,
    rejectRecipeSubmission,
    updateOrderStatus,
    deleteProduct,
    updateProductStock,
    bulkImportProducts,
    bulkImportRecipes,
    bulkImportReviews,
    resetAllToDefaults,
    addToast,
    reviews
  } = useApp();

  // Selected sub tab: "stats" | "active-products" | "seller-approval-queue" | "orders-fulfillment" | "data-curator" | "newsletter-preview"
  const [adminTab, setAdminTab] = useState<"stats" | "active-products" | "seller-approval-queue" | "orders-fulfillment" | "data-curator" | "newsletter-preview">("stats");

  // Data Curator & Seeder states
  const [jsonText, setJsonText] = useState("");
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [importType, setImportType] = useState<"products" | "recipes">("products");

  // Newsletter Preview states
  const [newsletterSubject, setNewsletterSubject] = useState("Weekly Brine Dispatch: Crispy Spears & Smoked Ghost Chilis");
  const [selectedNewsletterRecipeId, setSelectedNewsletterRecipeId] = useState("");
  const [selectedNewsletterProductId, setSelectedNewsletterProductId] = useState("");
  const [newsletterCustomIntro, setNewsletterCustomIntro] = useState(
    "Greetings fermenters and spice seekers! In this week's release, we consult premium small-batch recipes and present dynamic seasonal jar drops from our organic member network. Elevate your culinary maps with custom lacto-fermented solutions!"
  );
  const [newsletterPreviewDevice, setNewsletterPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [newsletterAudience, setNewsletterAudience] = useState<"both" | "pickle" | "pepper">("both");
  const [newsletterTemplate, setNewsletterTemplate] = useState<"minimalist" | "farmhouse" | "spicy">("minimalist");

  // layout template visual properties configuration
  const templateConfig = useMemo(() => {
    switch (newsletterTemplate) {
      case "farmhouse":
        return {
          wrapperClass: "bg-[#FAF9F6] border-x border-b border-stone-300 p-6 space-y-8 select-none font-sans text-[#2A2421] transition-all duration-300",
          headerBorderClass: "border-b-2 border-emerald-800 pb-4 text-center space-y-2",
          headerTitleClass: "font-serif text-3xl font-bold italic tracking-tight text-emerald-950",
          accentTextClass: "text-[#1B4D3E] font-serif italic text-[11px] block font-bold tracking-widest",
          featuredRecipeBg: "border-2 border-emerald-800/20 bg-[#F4F1EA] p-5 space-y-4 text-left rounded-lg",
          recipeAccentLabel: "text-[9px] font-mono uppercase text-emerald-800 tracking-wider block font-bold",
          recipeButton: "w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-amber-50 font-mono text-[9px] tracking-widest font-bold uppercase text-center cursor-pointer rounded-none block border-none transition-all",
          productCardClass: "bg-[#F4F1EA] border border-[#1B4D3E]/20 p-4 text-left flex flex-col sm:flex-row gap-4 items-center rounded-lg",
          productAccentLabel: "text-[9px] font-mono uppercase text-[#1B4D3E] tracking-widest block font-bold",
          productButton: "w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-mono text-[9px] tracking-widest font-black uppercase text-center cursor-pointer rounded-b-lg block border-t-0 transition-all",
          triviaBg: "p-4 bg-amber-50/35 border border-amber-200/50 text-left text-xs font-sans space-y-2 rounded-lg text-amber-950",
          triviaTitleClass: "font-serif font-extrabold italic text-emerald-950",
          footerLinkClass: "text-emerald-800 hover:underline cursor-pointer",
          accentBorderColor: "border-stone-300"
        };
      case "spicy":
        return {
          wrapperClass: "bg-stone-950 border-x border-b border-red-950/45 p-6 space-y-8 select-none font-sans text-stone-100 transition-all duration-300",
          headerBorderClass: "border-b-4 border-red-600 pb-4 text-center space-y-2 bg-gradient-to-r from-red-950 to-orange-950 p-4 -mx-6 -mt-6 border-t-4 border-t-red-500",
          headerTitleClass: "font-mono text-2xl font-black uppercase tracking-wider text-red-500 italic",
          accentTextClass: "text-orange-500 font-mono tracking-[0.2em] font-bold block uppercase text-[10px]",
          featuredRecipeBg: "border border-red-900 bg-red-950/20 p-5 space-y-4 text-left",
          recipeAccentLabel: "text-[9px] font-mono uppercase text-red-500 tracking-widest block font-black",
          recipeButton: "w-full py-2 bg-red-600 hover:bg-red-700 text-stone-100 font-mono text-[9px] tracking-widest font-bold uppercase text-center cursor-pointer rounded-none block border-none transition-all",
          productCardClass: "bg-stone-900 border border-red-900/40 p-4 text-left flex flex-col sm:flex-row gap-4 items-center",
          productAccentLabel: "text-[9px] font-mono uppercase text-red-500 tracking-widest block font-black",
          productButton: "w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-mono text-[10px] tracking-widest font-black uppercase text-center cursor-pointer rounded-none block border-t-0 transition-all",
          triviaBg: "p-4 bg-red-950/30 border border-red-900/50 text-left text-xs font-sans space-y-2 text-stone-300",
          triviaTitleClass: "font-serif font-black italic text-red-400",
          footerLinkClass: "text-red-500 hover:underline cursor-pointer",
          accentBorderColor: "border-red-900"
        };
      case "minimalist":
      default:
        return {
          wrapperClass: "bg-white border-x border-b border-stone-250 p-6 space-y-8 select-none font-sans text-editorial-charcoal transition-all duration-300",
          headerBorderClass: "border-b-4 border-editorial-charcoal pb-4 text-center space-y-1",
          headerTitleClass: "font-serif text-2xl font-black italic tracking-tight text-editorial-charcoal",
          accentTextClass: "text-[9px] font-mono tracking-[0.2em] text-[#C1121F] font-bold block uppercase",
          featuredRecipeBg: "border border-stone-200 bg-stone-50/50 p-4 space-y-4 text-left",
          recipeAccentLabel: "text-[9px] font-mono uppercase text-[#C1121F] tracking-widest block font-bold",
          recipeButton: "w-full py-2 bg-editorial-charcoal hover:bg-neutral-800 text-[#FAF9F6] font-mono text-[9px] tracking-widest font-bold uppercase text-center cursor-pointer rounded-none border border-transparent block transition-all",
          productCardClass: "bg-[#FAF9F6] border border-editorial-charcoal/15 p-4 text-left flex flex-col sm:flex-row gap-4 items-center",
          productAccentLabel: "text-[9px] font-mono uppercase text-amber-600 tracking-widest block font-bold",
          productButton: "w-full py-2 bg-[#C1121F] hover:bg-red-800 text-white font-mono text-[9px] tracking-widest font-black uppercase text-center cursor-pointer rounded-none block border-t-0 transition-all",
          triviaBg: "p-4 bg-stone-100/40 border border-stone-200 text-left text-xs font-sans space-y-2",
          triviaTitleClass: "font-serif font-bold italic text-stone-800",
          footerLinkClass: "text-[#C1121F] hover:underline cursor-pointer",
          accentBorderColor: "border-stone-200"
        };
    }
  }, [newsletterTemplate]);

  const activeRecipeForNewsletter = useMemo(() => {
    return recipes.find(r => r.id === selectedNewsletterRecipeId) || recipes[0];
  }, [recipes, selectedNewsletterRecipeId]);

  const activeProductForNewsletter = useMemo(() => {
    return products.find(p => p.id === selectedNewsletterProductId) || products[0];
  }, [products, selectedNewsletterProductId]);



  // Inline stock adjustment state helper
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  // Stats summaries
  const totalSalesRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "Cancelled")
      .reduce((acc, o) => acc + o.total, 0);
  }, [orders]);

  const lowStockProductsCount = useMemo(() => {
    return products.filter((p) => p.stock <= 15).length;
  }, [products]);

  const pendingSubmissionsCount = useMemo(() => {
    return (
      sellerSubmissions.filter((s) => s.status === "Pending").length +
      recipeSubmissions.filter((r) => r.status === "Pending").length
    );
  }, [sellerSubmissions, recipeSubmissions]);

  const handleEditStock = (productId: string, currentStock: number) => {
    setEditingProductId(productId);
    setTempStockValue(currentStock);
  };

  const handleSaveStock = (productId: string) => {
    updateProductStock(productId, tempStockValue);
    setEditingProductId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 text-left space-y-8 animate-in fade-in text-editorial-charcoal font-sans" id="admin-zone">
      
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-editorial-charcoal pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#C1121F]">Administrative Desk</span>
          <h2 className="font-serif text-3xl font-bold text-editorial-charcoal italic mt-0.5">
            The Curation Console
          </h2>
          <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-xl font-sans">
            Oversee general batch releases, authenticate member farm recipes, inspect analytics logs, and coordinate active shipping schedules.
          </p>
        </div>

        {/* Tab switch buttons */}
        <div className="flex flex-wrap gap-1 text-xs">
          {[
            { id: "stats", label: "Analytics Overview" },
            { id: "active-products", label: "Stock Inventory" },
            { id: "seller-approval-queue", label: `Sellers approvals (${pendingSubmissionsCount})` },
            { id: "orders-fulfillment", label: `Orders fulfill (${orders.length})` },
            { id: "data-curator", label: "Data Curation & Seed" },
            { id: "newsletter-preview", label: "✉ Newsletter Preview" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              className={`px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold transition-all rounded-none border ${
                adminTab === tab.id
                  ? "bg-editorial-charcoal text-editorial-cream border-editorial-charcoal"
                  : "bg-white text-editorial-charcoal border-editorial-charcoal/15 hover:bg-editorial-gray"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* METRIC SCORE TILE CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-2">
        
        {/* Metric 1 */}
        <div className="bg-white border border-editorial-charcoal/15 p-5 flex items-center justify-between rounded-none text-left">
          <div className="space-y-1">
            <span className="text-[9px] text-[#1A1A1A]/50 font-bold uppercase font-mono tracking-wider">Total Sales Revenue</span>
            <span className="font-mono text-xl font-black text-editorial-charcoal block">${totalSalesRevenue.toFixed(2)}</span>
          </div>
          <span className="w-8 h-8 rounded-none border border-editorial-charcoal/15 text-editorial-charcoal flex items-center justify-center text-xs font-mono font-bold bg-editorial-gray">
            $
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-[#1A1A1A]/15 p-5 flex items-center justify-between rounded-none text-left">
          <div className="space-y-1">
            <span className="text-[9px] text-[#1A1A1A]/50 font-bold uppercase font-mono tracking-wider">Active Orders Logging</span>
            <span className="font-mono text-xl font-black text-editorial-charcoal block">{orders.length} orders</span>
          </div>
          <span className="w-8 h-8 rounded-none border border-editorial-charcoal/15 text-editorial-charcoal flex items-center justify-center text-xs font-mono font-bold bg-editorial-gray">
            #
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-editorial-charcoal/15 p-5 flex items-center justify-between rounded-none text-left">
          <div className="space-y-1">
            <span className="text-[9px] text-editorial-charcoal/50 font-bold uppercase font-mono tracking-wider">Low Stock Warnings</span>
            <span className={`font-mono text-xl font-black block ${lowStockProductsCount > 0 ? "text-editorial-red" : "text-editorial-charcoal"}`}>
              {lowStockProductsCount} items
            </span>
          </div>
          <span className="w-8 h-8 rounded-none border border-editorial-charcoal/15 text-editorial-charcoal flex items-center justify-center text-xs font-mono font-bold bg-editorial-gray">
            !
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-[#1A1A1A]/15 p-5 flex items-center justify-between rounded-none text-left">
          <div className="space-y-1">
            <span className="text-[9px] text-[#1A1A1A]/50 font-bold uppercase font-mono tracking-wider">Applications Pending</span>
            <span className={`font-mono text-xl font-black block ${pendingSubmissionsCount > 0 ? "text-editorial-red font-extrabold" : "text-editorial-charcoal"}`}>
              {pendingSubmissionsCount} items
            </span>
          </div>
          <span className="w-8 h-8 rounded-none border border-editorial-charcoal/15 text-editorial-charcoal flex items-center justify-center text-xs font-mono font-bold bg-editorial-gray">
            ?
          </span>
        </div>

      </div>

      {/* ADMIN TABS PANELS */}

      {/* 1. ANALYTICS OVERVIEW */}
      {adminTab === "stats" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
          
          {/* Revenue chart segment */}
          <div className="lg:col-span-2 bg-white border border-editorial-charcoal/15 p-6 space-y-4 rounded-none">
            <div className="flex justify-between items-center pb-2 border-b border-editorial-charcoal/10">
              <h3 className="font-serif text-base font-bold text-editorial-charcoal italic">Weekly Ledger performance</h3>
              <span className="text-[9px] text-[#C1121F] font-mono tracking-widest uppercase font-bold">Simulated Exchange</span>
            </div>

            {/* Custom SVG line chart visualizer */}
            <div className="h-56 relative flex items-end justify-between px-2 pt-6">
              
              <div className="absolute top-2 left-2 text-[9px] text-editorial-charcoal/60 bg-editorial-gray px-1.5 py-0.5 border border-editorial-charcoal/10 font-mono uppercase tracking-wider">Daily Exchange Peak Values</div>
              
              {/* Reference Grid lines */}
              <div className="absolute inset-y-6 inset-x-0 flex flex-col justify-between pointer-events-none border-b border-dashed border-editorial-charcoal/15">
                <div className="w-full border-t border-editorial-charcoal/10"></div>
                <div className="w-full border-t border-editorial-charcoal/10"></div>
                <div className="w-full border-t border-editorial-charcoal/10"></div>
              </div>

              {[
                { day: "Jun 07", val: 120, height: "h-16", sales: "$120.00" },
                { day: "Jun 08", val: 180, height: "h-24", sales: "$180.00" },
                { day: "Jun 09", val: 90, height: "h-12", sales: "$90.00" },
                { day: "Jun 10", val: 340, height: "h-40", sales: "$340.00" },
                { day: "Jun 11", val: 240, height: "h-28", sales: "$240.00" },
                { day: "Jun 12", val: 410, height: "h-48", sales: "$410.00" },
                { day: "Today", val: 560, height: "h-52", sales: "$560.00" },
              ].map((point, index) => (
                <div key={index} className="flex-1 flex flex-col items-center group relative cursor-pointer">
                  
                  {/* Hover tooltip */}
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-editorial-charcoal text-editorial-cream text-[10px] px-2 py-0.5 font-bold pointer-events-none transition-all duration-150 z-10 font-mono">
                    {point.sales}
                  </div>

                  <div className={`w-8 sm:w-11 ${point.height} bg-editorial-charcoal transition-all rounded-none hover:bg-editorial-red shadow-2xs`}></div>
                  <span className="text-[10px] text-editorial-charcoal/60 block mt-2 font-mono">{point.day}</span>
                </div>
              ))}
            </div>
            
            <p className="text-[9px] text-[#1A1A1A]/50 text-center font-mono uppercase tracking-wider italic pt-1">*Organically generated by real-time sandbox client orders.</p>
          </div>

          {/* Quick lists of products categories */}
          <div className="bg-editorial-gray p-6 border border-editorial-charcoal/15 text-xs text-left space-y-4 rounded-none">
            <h4 className="font-serif text-sm font-bold text-editorial-charcoal italic border-b border-editorial-charcoal/10 pb-1.5">Marketplace Divisions</h4>
            
            <div className="space-y-4">
              {[
                { label: "Pickle Jars 🥒", prc: "50%", count: products.filter(p => p.category === "pickle").length, col: "bg-editorial-green" },
                { label: "Chili Peppers 🌶️", prc: "25%", count: products.filter(p => p.category === "pepper").length, col: "bg-[#C1121F]" },
                { label: "Fused Crisps Oils 🫙", prc: "15%", count: products.filter(p => p.category === "oil").length, col: "bg-editorial-charcoal/60" },
                { label: "Starter Cultures 🧪", prc: "10%", count: products.filter(p => p.category === "starter").length, col: "bg-[#1A1A1A]/30" },
              ].map((share, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider font-bold text-[#1A1A1A]">
                    <span>{share.label}</span>
                    <span>{share.count} items ({share.prc})</span>
                  </div>
                  <div className="w-full bg-[#1A1A1A]/10 h-1.5 rounded-none overflow-hidden">
                    <div className={`${share.col} h-full`} style={{ width: share.prc }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-4 border border-editorial-charcoal/10 rounded-none space-y-1 mt-4">
              <span className="font-mono font-bold text-[9px] text-editorial-charcoal uppercase tracking-wider block">Replenishment Advisory</span>
              <p className="text-[11px] text-[#1A1A1A]/70 font-sans leading-normal">
                If a crop runs dry of inventory, navigate to the <span className="font-bold">Stock Inventory</span> tab above to adjust mock warehouse counts.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* 2. ACTIVE PRODUCTS STOCK MANAGEMENT */}
      {adminTab === "active-products" && (
        <div className="bg-white border border-editorial-charcoal/15 p-6 shadow-sm space-y-4 rounded-none text-left">
          <h3 className="font-serif text-base font-bold italic text-editorial-charcoal border-b border-editorial-charcoal/10 pb-3">Active Customer Catalog (Live CRUD Control)</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-editorial-charcoal border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-editorial-charcoal text-[9px] font-mono text-editorial-charcoal/50 uppercase tracking-widest font-extrabold pb-2">
                  <th className="py-2.5">Product Title</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Base Price</th>
                  <th className="py-2.5">Warehouse Stock</th>
                  <th className="py-2.5">Vended By</th>
                  <th className="py-2.5 text-right">Inventory Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-editorial-charcoal/10 font-sans">
                {products.map((p) => {
                  const isEditing = editingProductId === p.id;
                  const isLow = p.stock <= 15;

                  return (
                    <tr key={p.id} className="hover:bg-editorial-gray transition-colors">
                      <td className="py-3 font-serif font-bold text-[#1A1A1A] flex items-center gap-2.5">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-8 h-8 object-cover rounded-none border border-editorial-charcoal/15"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="block font-serif text-xs font-bold text-editorial-charcoal italic">{p.name}</span>
                          <span className="text-[8px] text-editorial-charcoal/50 font-mono uppercase not-italic">Ref: {p.id}</span>
                        </div>
                      </td>
                      <td className="py-3 capitalize text-editorial-charcoal/80 font-mono text-[11px]">{p.category}</td>
                      <td className="py-3 font-mono font-bold text-editorial-red">${p.price.toFixed(2)}</td>
                      <td className="py-3">
                        {isEditing ? (
                          <div className="flex items-center gap-1 font-mono">
                            <input
                              type="number"
                              value={tempStockValue}
                              onChange={(e) => setTempStockValue(Number(e.target.value))}
                              className="w-14 border border-editorial-charcoal/30 bg-white p-1 text-xs text-editorial-charcoal rounded-none focus:outline-none"
                            />
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              className="bg-editorial-charcoal text-editorial-cream font-mono text-[8.5px] uppercase tracking-wider px-2 py-1"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <span className={`inline-flex items-center gap-1.5 font-mono font-bold ${isLow ? "text-[#C1121F]" : "text-editorial-charcoal"}`}>
                            {p.stock} units
                            {isLow && <span className="bg-[#C1121F]/10 text-[#C1121F] px-1.5 py-0.5 text-[8.5px] font-mono tracking-widest uppercase">LOW</span>}
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-editorial-charcoal/80 font-serif italic">{p.sellerName}</td>
                      <td className="py-3 text-right space-x-2 font-mono text-[10px] uppercase tracking-wider font-extrabold">
                        <button
                          onClick={() => handleEditStock(p.id, p.stock)}
                          className="text-editorial-green hover:underline cursor-pointer"
                        >
                          Alter Stock
                        </button>
                        <span className="text-editorial-charcoal/30">|</span>
                        <button
                          onClick={() => deleteProduct(p.id)}
                          className="text-editorial-red hover:underline cursor-pointer"
                          title="Remove product from customer store"
                        >
                          Wipe Jar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. SELLER AND RECIPE APPLICATIONS QUEUE */}
      {adminTab === "seller-approval-queue" && (
        <div className="space-y-6 text-left">
          
          {/* Sellers submissions */}
          <div className="bg-white border border-editorial-charcoal/15 p-6 shadow-sm space-y-4 rounded-none">
            <h3 className="font-serif text-base font-bold text-editorial-charcoal italic border-b border-editorial-charcoal/10 pb-3 flex items-center justify-between">
              <span>🌾 Incoming Artisanal Crop &amp; Jar Release Requests</span>
              <span className="bg-editorial-gray border border-editorial-charcoal/15 text-editorial-charcoal text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-none font-bold">
                {sellerSubmissions.filter((s) => s.status === "Pending").length} Pending
              </span>
            </h3>

            {sellerSubmissions.filter((s) => s.status === "Pending").length === 0 ? (
              <div className="py-8 text-center text-[#1A1A1A]/50 italic font-serif text-xs">
                No crops jar release requests currently in review queues.
              </div>
            ) : (
              <div className="space-y-4 font-sans text-xs">
                {sellerSubmissions
                  .filter((s) => s.status === "Pending")
                  .map((sub) => (
                    <div key={sub.id} className="p-4 bg-editorial-gray border border-editorial-charcoal/15 rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                      <div className="space-y-2 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-sm font-bold text-editorial-charcoal italic">{sub.name}</span>
                          <span className="bg-editorial-cream border border-editorial-charcoal/15 text-editorial-charcoal px-2 py-0.5 rounded-none text-[8.5px] font-mono uppercase tracking-wider">{sub.spiceLevel} Heat</span>
                          <span className="capitalize bg-editorial-charcoal text-editorial-cream px-2 py-0.5 text-[8.5px] font-mono uppercase tracking-wider">{sub.category}</span>
                        </div>
                        <p className="text-[#1A1A1A]/75 italic leading-relaxed font-serif text-xs">"{sub.description}"</p>
                        <div className="text-[10px] text-editorial-charcoal/60 font-serif">
                          <b>Ingredients:</b> <span className="font-sans not-italic text-[#1A1A1A]">{sub.ingredients.join(", ")}</span> • <b>Vendor Story Name:</b> <span className="font-sans not-italic text-[#1A1A1A]">{sub.sellerName} ({sub.sellerEmail})</span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0 font-mono text-[9px] uppercase tracking-wider">
                        <button
                          onClick={() => approveProductSubmission(sub.id)}
                          className="px-3 py-2 bg-editorial-charcoal text-editorial-cream font-bold hover:bg-editorial-green transition-all rounded-none"
                        >
                          Approve Release ✓
                        </button>
                        <button
                          onClick={() => rejectProductSubmission(sub.id)}
                          className="px-3 py-2 border border-[#C1121F]/20 text-[#C1121F] hover:bg-[#C1121F]/5 transition-all rounded-none"
                        >
                          Reject X
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recipes submissions */}
          <div className="bg-white border border-editorial-charcoal/15 p-6 shadow-sm space-y-4 rounded-none">
            <h3 className="font-serif text-base font-bold text-editorial-charcoal italic border-b border-editorial-charcoal/10 pb-3 flex items-center justify-between">
              <span>📖 Culinary Recipes Cooking Guide Proposals</span>
              <span className="bg-editorial-gray border border-editorial-charcoal/15 text-editorial-charcoal text-[9px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-none font-bold">
                {recipeSubmissions.filter((r) => r.status === "Pending").length} Pending
              </span>
            </h3>

            {recipeSubmissions.filter((r) => r.status === "Pending").length === 0 ? (
              <div className="py-8 text-center text-[#1A1A1A]/50 italic font-serif text-xs">
                No cooking guides currently in review queue.
              </div>
            ) : (
              <div className="space-y-4 font-sans text-xs">
                {recipeSubmissions
                  .filter((r) => r.status === "Pending")
                  .map((rsub) => (
                    <div key={rsub.id} className="p-4 bg-editorial-gray border border-editorial-charcoal/15 rounded-none flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                      <div className="space-y-2 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-serif text-sm font-bold text-editorial-charcoal italic">{rsub.title}</span>
                          <span className="bg-white text-editorial-charcoal border border-editorial-charcoal/10 px-2 py-0.5 text-[8.5px] font-mono uppercase tracking-wider">{rsub.difficulty} Skill</span>
                          <span className="text-editorial-charcoal/60 text-[10px] font-serif italic">Prep {rsub.prepTime} / Cook {rsub.cookTime}</span>
                        </div>
                        <p className="text-[#1A1A1A]/75 italic leading-relaxed font-serif text-xs">"{rsub.description}"</p>
                        <div className="text-[10px] text-editorial-charcoal/60 font-serif font-semibold">
                          <b>Ingredients:</b> <span className="font-sans font-normal text-[#1A1A1A]" >{rsub.ingredients.join(", ")}</span> • <b>Submitted by:</b> <span className="font-sans font-normal text-[#1A1A1A]">{rsub.author} ({rsub.authorEmail})</span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0 font-mono text-[9px] uppercase tracking-wider">
                        <button
                          onClick={() => approveRecipeSubmission(rsub.id)}
                          className="px-3 py-2 bg-editorial-charcoal text-editorial-cream font-bold hover:bg-editorial-green transition-all rounded-none"
                        >
                          Approve Guide ✓
                        </button>
                        <button
                          onClick={() => rejectRecipeSubmission(rsub.id)}
                          className="px-3 py-2 border border-[#C1121F]/20 text-[#C1121F] hover:bg-[#C1121F]/5 transition-all rounded-none"
                        >
                          Reject X
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 4. ORDERS FULFILLMENT INTERFACE */}
      {adminTab === "orders-fulfillment" && (
        <div className="bg-white border border-editorial-charcoal/15 p-6 shadow-sm space-y-4 rounded-none text-left">
          <h3 className="font-serif text-base font-bold italic text-editorial-charcoal border-b border-editorial-charcoal/10 pb-3">Active Order Processing Hub</h3>

          {orders.length === 0 ? (
            <div className="py-8 text-center text-[#1A1A1A]/50 italic font-serif text-xs">
              No active customer order registers found.
            </div>
          ) : (
            <div className="overflow-x-auto text-xs font-sans">
              <table className="w-full text-left text-editorial-charcoal border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-editorial-charcoal text-[9px] font-mono text-editorial-charcoal/50 uppercase tracking-widest font-extrabold pb-2">
                    <th className="py-2.5">Order Reference</th>
                    <th className="py-2.5">Client Profile</th>
                    <th className="py-2.5">Delivery City / Zip</th>
                    <th className="py-2.5">Purchased Items</th>
                    <th className="py-2.5">Subtotal Value</th>
                    <th className="py-2.5 text-right font-mono">Logistics Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-editorial-charcoal/10 font-sans">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-editorial-gray transition-colors">
                      <td className="py-3 font-mono font-bold text-[#C1121F]">{o.id}</td>
                      <td className="py-3">
                        <span className="block font-serif font-bold italic text-editorial-charcoal leading-none">{o.customerName}</span>
                        <span className="text-[10px] text-editorial-charcoal/60 mt-1 block font-mono uppercase">{o.customerEmail}</span>
                      </td>
                      <td className="py-3">
                        <span className="block text-[#1A1A1A] leading-none font-medium">{o.shippingAddress}</span>
                        <span className="text-[10px] text-editorial-charcoal/50 font-mono block mt-1 uppercase">{o.city}, {o.zipCode}</span>
                      </td>
                      <td className="py-3 truncate max-w-[150px] font-serif italic" title={o.items.map((it) => `${it.productName} (x${it.quantity})`).join(", ")}>
                        {o.items.map((it) => `${it.productName} (x${it.quantity})`).join(", ")}
                      </td>
                      <td className="py-3 font-mono font-bold text-editorial-red">${o.total.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        {/* Selector dropdown to process order status and notify client live */}
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                          className={`px-3 py-1.5 border font-mono text-[9px] uppercase tracking-wider font-extrabold cursor-pointer transition-all rounded-none focus:outline-none ${
                            o.status === "Completed" ? "bg-white text-editorial-green border-editorial-green/35" :
                            o.status === "Shipped" ? "bg-white text-[#C1121F] border-[#C1121F]/35 animate-pulse" : "bg-editorial-gray text-editorial-charcoal border-editorial-charcoal/20"
                          }`}
                        >
                          <option value="Pending">Pending Review ⏳</option>
                          <option value="Ready for Shipping">Ready for Courier 🛒</option>
                          <option value="Shipped">Shipped / On Road 🚚</option>
                          <option value="Completed">Completed / Delivered ✅</option>
                          <option value="Cancelled">Cancelled Order ❌</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      {/* 5. DATA CURATION & SEEDING workspace */}
      {adminTab === "data-curator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-in fade-in duration-300">
          
          {/* Seeding Controls - 5 cols */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Instant Population Card */}
            <div className="bg-white border border-editorial-charcoal/15 p-6 space-y-4 rounded-none">
              <div className="flex items-center gap-2 pb-2 border-b border-editorial-charcoal/10">
                <Database className="w-5 h-5 text-[#C1121F]" />
                <h3 className="font-serif text-base font-bold text-editorial-charcoal italic">Instant Population Engine</h3>
              </div>
              <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed font-sans">
                Populate entire artisanal crops or verified client experience logs instantly to enrich listing pages.
              </p>

              <div className="space-y-3 pt-2">
                
                {/* Seed Pack 1 */}
                <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-none flex items-center justify-between gap-3 group hover:border-[#C1121F]/30 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-black uppercase text-[#C1121F] block">Spicy Summer Wild Pepper Pack</span>
                    <span className="text-[10px] text-stone-500 font-sans leading-none block">Seeds 2 ultra-hot ghost &amp; serrano items.</span>
                  </div>
                  <button
                    onClick={() => {
                      const seed = [
                        {
                          "id": "prod-seeder-habanero-" + Date.now(),
                          "name": "Smoked Ghost Peach Pepper Slurry",
                          "description": "Double-wood oak smoked ghost peppers blended with sweet caramelized peaches, vinegar, sea salts and mustard flower seed.",
                          "price": 14.50,
                          "category": "pepper",
                          "image": "https://images.unsplash.com/photo-1588252303782-cb80119cb661?auto=format&fit=crop&q=80&w=800",
                          "spiceLevel": "Extreme",
                          "stock": 42,
                          "rating": 4.9,
                          "reviewsCount": 18,
                          "ingredients": ["Smoked Ghost Peppers", "Caramelized Peaches", "Acorn Vinegar", "Sea Salt", "Mustard Seed"],
                          "sellerName": "Hellfire Highlands Farm",
                          "tags": ["Ghost Pepper", "Extremely Hot", "Smoked", "Artisanal"],
                          "size": "5 oz Bottle",
                          "isSeasonal": true
                        },
                        {
                          "id": "prod-seeder-serrano-" + Date.now(),
                          "name": "Fermented Serrano Lime Spritzy Pickle",
                          "description": "Crisp green serrano pods lacto-fermented with key lime peels, fresh coriander and a delicate trace of coconut flower nectar.",
                          "price": 11.25,
                          "category": "pickle",
                          "image": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=800",
                          "spiceLevel": "Medium",
                          "stock": 35,
                          "rating": 4.8,
                          "reviewsCount": 12,
                          "ingredients": ["Pickled Serrano Pods", "Key Lime Zest", "Coriander Tops", "Garlic", "Lactic Brine"],
                          "sellerName": "Cascadia Ferments Co",
                          "tags": ["Serrano", "Medium Hot", "Lacto-Fermented"],
                          "size": "16 oz Jar"
                        }
                      ];
                      bulkImportProducts(seed as any);
                    }}
                    className="px-3 py-1 bg-editorial-charcoal hover:bg-[#C1121F] text-editorial-cream hover:text-white font-mono text-[9px] uppercase tracking-widest font-black shrink-0 cursor-pointer transition-colors"
                  >
                    + Load Pack
                  </button>
                </div>

                {/* Seed Pack 2 */}
                <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-none flex items-center justify-between gap-3 group hover:border-[#C1121F]/30 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-black uppercase text-[#C1121F] block">Cask Aged Sweet Pickles &amp; Oil Pact</span>
                    <span className="text-[10px] text-stone-500 font-sans leading-none block">Seeds 2 Kentucky-barrel garlic jars.</span>
                  </div>
                  <button
                    onClick={() => {
                      const seed = [
                        {
                          "id": "prod-seeder-bourbon-" + Date.now(),
                          "name": "Bourbon-Cask Sweet Garlic Pickle Chips",
                          "description": "Thick crinkle cut cucumber chips cold packed inside Kentucky white-oak bourbon barrels with dark brown sugar, whole garlic and fresh dill crown.",
                          "price": 12.99,
                          "category": "pickle",
                          "image": "https://images.unsplash.com/photo-1622484211148-716598e04141?auto=format&fit=crop&q=80&w=800",
                          "spiceLevel": "Mild",
                          "stock": 45,
                          "rating": 4.7,
                          "reviewsCount": 24,
                          "ingredients": ["Cucumbers", "Organic Cane Sugar", "Bourbon Extract", "Whole Sweet Garlic", "Fresh Dill Crown"],
                          "sellerName": "Bluegrass Barrel Packing",
                          "tags": ["Bourbon Barrel", "Mild Heat", "Sweet Chips"],
                          "size": "16 oz Jar"
                        },
                        {
                          "id": "prod-seeder-crispOil-" + Date.now(),
                          "name": "Sichuan Peppercorn & Scallion Infused Oil",
                          "description": "Slow simmered premium cold-pressed sesame oil fused with handpicked Sichuan red peppercorns, toasted garlic, and crisp shallot shards.",
                          "price": 16.50,
                          "category": "oil",
                          "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800",
                          "spiceLevel": "Hot",
                          "stock": 28,
                          "rating": 4.9,
                          "reviewsCount": 15,
                          "ingredients": ["Cold-pressed Sesame Oil", "Red Sichuan Peppercorns", "Shallot Crisps", "Toasted Sesame", "Korean Red Chili"],
                          "sellerName": "Lao Gan Craft Oils",
                          "tags": ["Sichuan Peppercorn", "Chili Crisp", "Sesame Oil"],
                          "size": "8.5 oz Bottle",
                          "isSeasonal": false
                        }
                      ];
                      bulkImportProducts(seed as any);
                    }}
                    className="px-3 py-1 bg-editorial-charcoal hover:bg-[#C1121F] text-editorial-cream hover:text-white font-mono text-[9px] uppercase tracking-widest font-black shrink-0 cursor-pointer transition-colors"
                  >
                    + Load Pack
                  </button>
                </div>

                {/* Seed Pack 3 */}
                <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-none flex items-center justify-between gap-3 group hover:border-[#C1121F]/30 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-black uppercase text-[#C1121F] block">Gourmet Culinary Recipes</span>
                    <span className="text-[10px] text-stone-500 font-sans leading-none block">Seeds 1 easy pickled egg cooking recipe guide.</span>
                  </div>
                  <button
                    onClick={() => {
                      const seed = [
                        {
                          "id": "rec-seeder-spicyegg-" + Date.now(),
                          "title": "Devil's Brine Pickled Quail Eggs",
                          "description": "A magnificent pub classic re-imagined: rich quail eggs slow cured in a hot habanero coriander brine, layered with dry mustard seeds.",
                          "prepTime": "20 mins",
                          "cookTime": "10 mins",
                          "difficulty": "Easy",
                          "ingredients": ["12 quail eggs", "2 habaneros", "1 cup cider vinegar", "1 tbsp coriander seed"],
                          "instructions": [
                            "Hard boil quail eggs for exactly 3.5 minutes, then cool immediately in ice water.",
                            "Peel the eggs and pack tightly into a sanitized 12oz jar.",
                            "Bring cider vinegar, sliced habaneros, garlic and coriander to a rolling boil.",
                            "Pour hot brine over the eggs, seal tight, and chill for 72 hours before serving."
                          ],
                          "spiceLevel": "Hot",
                          "author": "Grandmaster Brine Crew",
                          "approved": true,
                          "createdAt": new Date().toISOString()
                        }
                      ];
                      bulkImportRecipes(seed as any);
                    }}
                    className="px-3 py-1 bg-editorial-charcoal hover:bg-[#C1121F] text-editorial-cream hover:text-white font-mono text-[9px] uppercase tracking-widest font-black shrink-0 cursor-pointer transition-colors"
                  >
                    + Load Recipes
                  </button>
                </div>

                {/* Seed Pack 4 */}
                <div className="p-3 bg-stone-50 border border-stone-200/60 rounded-none flex items-center justify-between gap-3 group hover:border-[#C1121F]/30 transition-colors">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono font-black uppercase text-[#C1121F] block">Client Experience Reviews (Rating Boost)</span>
                    <span className="text-[10px] text-stone-500 font-sans leading-none block">Seeds 3 verified positive review records.</span>
                  </div>
                  <button
                    onClick={() => {
                      if (products.length === 0) {
                        addToast({
                          title: "Seeding Failed",
                          message: "Please ensure you have products in your catalog before generating review logs.",
                          type: "warning"
                        });
                        return;
                      }
                      const activeProductIds = products.map(p => p.id);
                      const reviewSeeds = [
                        {
                          "id": "rev-bulk-" + Math.random(),
                          "productId": activeProductIds[0],
                          "author": "Salty Wanderer",
                          "rating": 5,
                          "date": new Date().toISOString().split("T")[0],
                          "comment": "My grandmother and I had high expectations for this brine but it actually exceeded them. Fully recommend!",
                          "verified": true
                        },
                        {
                          "id": "rev-bulk-" + Math.random(),
                          "productId": activeProductIds[0],
                          "author": "Chef Jeremiah",
                          "rating": 4,
                          "date": new Date().toISOString().split("T")[0],
                          "comment": "Unique depth, sweet fermentation complexity. Pairs incredibly well with vintage cheddar.",
                          "verified": true
                        },
                        {
                          "id": "rev-bulk-" + Math.random(),
                          "productId": activeProductIds[activeProductIds.length - 1],
                          "author": "Dr. Fermentation",
                          "rating": 5,
                          "date": new Date().toISOString().split("T")[0],
                          "comment": "Perfect pH balancing. Crisp crunch sound remains even after being chilled for days. Beautifully seasoned.",
                          "verified": true
                        }
                      ];
                      bulkImportReviews(reviewSeeds);
                    }}
                    className="px-3 py-1 bg-editorial-charcoal hover:bg-[#C1121F] text-editorial-cream hover:text-white font-mono text-[9px] uppercase tracking-widest font-black shrink-0 cursor-pointer transition-colors"
                  >
                    + Seed Reviews
                  </button>
                </div>

              </div>

            </div>

            {/* Total Reset Module */}
            <div className="bg-[#FAF3EE] border border-editorial-red/20 p-6 space-y-4 rounded-none">
              <div className="flex items-center gap-2 pb-1">
                <ShieldAlert className="w-5 h-5 text-editorial-red" />
                <h4 className="font-serif text-sm font-bold text-editorial-red">Critical Database Reset</h4>
              </div>
              <p className="text-[11px] text-[#C1121F]/80 leading-relaxed font-sans mt-0.5">
                Wipe all custom-added products, recipes, pending seller queues, client carts, order books, and restore the default curated farm collection.
              </p>
              <button
                onClick={() => {
                  if (confirm("Are you positive you wish to execute a database reset? All custom products and recipes will be vaporized!")) {
                    resetAllToDefaults();
                  }
                }}
                className="w-full py-2 border border-editorial-red text-[#C1121F] bg-white hover:bg-editorial-red hover:text-white font-mono text-[10px] uppercase font-black tracking-widest transition-all cursor-pointer shadow-3xs"
              >
                Purge &amp; Restore Master Dataset
              </button>
            </div>

          </div>

          {/* Schema and Import workspace - 7 cols */}
          <div className="lg:col-span-7 bg-white border border-editorial-charcoal/15 p-6 space-y-4 rounded-none flex flex-col justify-between">
            
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-editorial-charcoal/10">
                <div className="flex items-center gap-2">
                  <FileJson className="w-5 h-5 text-editorial-charcoal" />
                  <h3 className="font-serif text-base font-bold text-editorial-charcoal italic">JSON Database Import &amp; Export</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setImportType("products");
                      setJsonError(null);
                    }}
                    className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider ${importType === "products" ? "bg-editorial-charcoal text-white" : "bg-neutral-100 text-stone-500 hover:bg-neutral-200"}`}
                  >
                    Products Schema
                  </button>
                  <button
                    onClick={() => {
                      setImportType("recipes");
                      setJsonError(null);
                    }}
                    className={`px-2 py-1 text-[9px] font-mono uppercase tracking-wider ${importType === "recipes" ? "bg-editorial-charcoal text-white" : "bg-neutral-100 text-stone-500 hover:bg-neutral-200"}`}
                  >
                    Recipes Schema
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#1A1A1A]/70 leading-normal font-sans">
                Collect raw database schemas from your local records or export current states. Adjust the parameters below in JSON list notation and apply instantly.
              </p>

              {/* Blueprint schema load templates */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const sampleProducts = [
                      {
                        "id": "custom-sample-" + Date.now(),
                        "name": "Heirloom Garlic Polish Spears",
                        "description": "Artisanal brine-filled spear pickles packing double whole garlic cloves, fresh dill blossoms, and dry mustard pods.",
                        "price": 10.99,
                        "category": "pickle",
                        "image": "https://images.unsplash.com/photo-1543257580-7269da773bf5?auto=format&fit=crop&q=80&w=800",
                        "spiceLevel": "Mild",
                        "stock": 30,
                        "rating": 4.6,
                        "reviewsCount": 8,
                        "ingredients": ["Organic Cucumbers", "Lacto-Brine", "Fresh Sweet Garlic Blossoms", "Mustard Seed"],
                        "sellerName": "Vistula Curing Co.",
                        "tags": ["Polish style", "Lacto brined", "Mild Flavor"],
                        "size": "16 oz Jar"
                      }
                    ];
                    setJsonText(JSON.stringify(sampleProducts, null, 2));
                    setJsonError(null);
                  }}
                  className="text-[9px] font-mono text-editorial-green hover:underline uppercase"
                >
                  [📋 Load Sample Products Schema]
                </button>
                <span className="text-stone-300 text-xs font-mono">|</span>
                <button
                  onClick={() => {
                    const sampleRecipes = [
                      {
                        "id": "custom-recipe-sample-" + Date.now(),
                        "title": "Rustic Barrel Bread &amp; Butter Slices",
                        "description": "Old-world country bread and butter chips curated in high sweet brown sugar brines.",
                        "difficulty": "Easy",
                        "prepTime": "15 mins",
                        "cookTime": "5 mins",
                        "ingredients": ["2 Large Cucumbers", "1 tbsp coarse salt", "1 cup organic turbinado sugar", "1 cup cider vinegar"],
                        "instructions": [
                          "Slice raw fresh cucumbers on a mandoline slice set to medium width.",
                          "Coat slices heavily with coarse salt and let drain on towels for an hour.",
                          "Simmer cider vinegar, spices and turbinado wood sugars inside an open saucepan.",
                          "Pack cucumber slices, douse with sweet hot vinegar syrup, and seal securely."
                        ],
                        "spiceLevel": "Mild",
                        "author": "Salty Barrel Kitchens"
                      }
                    ];
                    setJsonText(JSON.stringify(sampleRecipes, null, 2));
                    setJsonError(null);
                  }}
                  className="text-[9px] font-mono text-editorial-green hover:underline uppercase"
                >
                  [📋 Load Sample Recipes Schema]
                </button>
              </div>

              {/* Text Area */}
              <div className="relative">
                <textarea
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    setJsonError(null);
                  }}
                  placeholder={
                    importType === "products"
                      ? "Paste Products JSON array matching the data structure..."
                      : "Paste Recipes JSON array matching the data structure..."
                  }
                  className="w-full h-72 border border-editorial-charcoal/20 rounded-none bg-stone-50 p-3 text-[10px] font-mono leading-relaxed text-editorial-charcoal focus:bg-white focus:outline-none focus:border-editorial-charcoal"
                />
                
                {/* Overlay Schema Indicator */}
                <div className="absolute bottom-2.5 right-2 text-stone-300 font-mono text-[8px] uppercase tracking-widest select-none bg-[#FAF9F6]/80 px-2 py-0.5 border border-stone-200">
                  Target: {importType} block
                </div>
              </div>

              {/* Error Box */}
              {jsonError && (
                <div className="p-3 bg-editorial-red/5 border border-editorial-red/15 rounded-none text-editorial-red font-mono text-[10px] leading-relaxed flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="font-bold uppercase block text-[9px] mb-0.5">Parse Exception Logged:</span>
                    {jsonError}
                  </div>
                </div>
              )}

            </div>

            {/* Actions: Import or Copy clipboard */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-4 border-t border-stone-100">
              
              {/* Copy Database backup */}
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    try {
                      const dataStr = importType === "products" ? JSON.stringify(products, null, 2) : JSON.stringify(recipes, null, 2);
                      navigator.clipboard.writeText(dataStr);
                      addToast({
                        title: "Clipboard Saved",
                        message: `Acquired and exported ${importType === "products" ? products.length : recipes.length} live records to clipboard successfully.`,
                        type: "success"
                      });
                    } catch (e) {
                      addToast({
                        title: "Export Failure",
                        message: "Unable to acquire local copy parameters block.",
                        type: "warning"
                      });
                    }
                  }}
                  className="px-3 py-1.5 border border-editorial-charcoal/15 hover:bg-stone-50 text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-1 cursor-pointer"
                >
                  📥 Export Database JSON ({importType === "products" ? products.length : recipes.length} items)
                </button>
              </div>

              {/* Execute Import */}
              <button
                onClick={() => {
                  if (!jsonText.trim()) {
                    setJsonError("Error: Command terminated because input area is currently vacant.");
                    return;
                  }
                  try {
                    const parsed = JSON.parse(jsonText);
                    if (!Array.isArray(parsed)) {
                      throw new Error("Invalid structure. Root of data collection must be a JSON Array [ ... ].");
                    }

                    // Simple parameter verification
                    if (importType === "products") {
                      parsed.forEach((p, idx) => {
                        if (!p.id || !p.name || typeof p.price !== "number" || !p.category) {
                          throw new Error(`Item at array index [${idx}] lacks mandatory parameters (id, name, price, category or invalid price numeric).`);
                        }
                      });
                      bulkImportProducts(parsed as any);
                    } else {
                      parsed.forEach((r, idx) => {
                        if (!r.id || !r.title || !Array.isArray(r.ingredients) || !Array.isArray(r.instructions)) {
                          throw new Error(`Recipe item at array index [${idx}] lacks mandatory fields (id, title, ingredients array, instructions array).`);
                        }
                      });
                      bulkImportRecipes(parsed as any);
                    }

                    setJsonText("");
                    setJsonError(null);
                  } catch (err: any) {
                    setJsonError(err?.message || "Syntactic failure. Verify you pasted well-formed JSON.");
                  }
                }}
                className="px-6 py-2 bg-[#C1121F] hover:bg-editorial-charcoal text-white hover:text-editorial-cream font-mono text-[10px] uppercase tracking-widest font-black transition-all cursor-pointer shadow-2xs"
              >
                🚀 Process &amp; Seed Collection
              </button>

            </div>

          </div>

        </div>
      )}

      {/* 6. NEWSLETTER DISPATCH PREVIEW */}
      {adminTab === "newsletter-preview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-in fade-in duration-300" id="newsletter-preview-section">
          
          {/* Email Dispatch Control Panel - 5 Columns */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-editorial-charcoal/15 p-6 space-y-5 rounded-none">
              
              <div className="flex items-center gap-2 pb-2 border-b border-editorial-charcoal/10">
                <Mail className="w-5 h-5 text-amber-600" />
                <h3 className="font-serif text-base font-bold text-editorial-charcoal italic">Dispatch Publisher Panel</h3>
              </div>

              <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed font-sans">
                Draft content and select featured listings for the upcoming distribution event. Your choices will propagate instantly to the live visual mock rendering envelope on the right.
              </p>

              {/* Form Controls */}
              <div className="space-y-4 text-xs">
                
                {/* Visual Layout Template Selector */}
                <div className="space-y-1.5 p-3 bg-stone-50 border border-stone-200">
                  <label className="text-[10px] font-mono font-bold uppercase text-editorial-charcoal/60 block">
                    Visual Layout Template
                  </label>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
                    {[
                      { id: "minimalist", label: "Modern Minimalist", icon: "▫️", theme: "Monochrome" },
                      { id: "farmhouse", label: "Rustic Farmhouse", icon: "🌿", theme: "Warm Cozy" },
                      { id: "spicy", label: "Bold & Spicy", icon: "🌶️", theme: "Hot Fire" }
                    ].map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setNewsletterTemplate(tpl.id as any)}
                        className={`px-2.5 py-2 text-left border flex flex-col justify-between transition-all rounded-none cursor-pointer ${
                          newsletterTemplate === tpl.id
                            ? "border-editorial-charcoal bg-white ring-2 ring-editorial-charcoal font-bold"
                            : "border-stone-200 bg-white hover:bg-stone-50 hover:border-editorial-charcoal/40 text-stone-600"
                        }`}
                      >
                        <span className="text-[10px] font-serif font-bold flex items-center gap-1">
                          <span>{tpl.icon}</span>
                          <span>{tpl.label}</span>
                        </span>
                        <span className="text-[8px] font-mono uppercase tracking-tight text-stone-400 mt-1">
                          {tpl.theme}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Line */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-editorial-charcoal/50 block">Subject Headline</label>
                  <input
                    type="text"
                    value={newsletterSubject}
                    onChange={(e) => setNewsletterSubject(e.target.value)}
                    className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2 text-xs focus:bg-white focus:outline-none focus:border-editorial-charcoal font-sans"
                    placeholder="Enter dispatch email subject..."
                  />
                </div>

                {/* Target Audience Segment Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-editorial-charcoal/50 block">Dynamic Reader Segment</label>
                  <select
                    value={newsletterAudience}
                    onChange={(e) => setNewsletterAudience(e.target.value as any)}
                    className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2 text-xs focus:bg-white focus:outline-none focus:border-editorial-charcoal font-mono"
                  >
                    <option value="both">Both Pickles &amp; Peppers (All Registers)</option>
                    <option value="pickle">Pickles Only (Vistula Spears / Ferments)</option>
                    <option value="pepper">Peppers Only (Extreme Cures / Spice Heads)</option>
                  </select>
                </div>

                {/* Selected Recipe selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-[#1A1A1A]/50 block">Featured Culinary Recipe Map</label>
                  <select
                    value={selectedNewsletterRecipeId}
                    onChange={(e) => setSelectedNewsletterRecipeId(e.target.value)}
                    className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2 text-xs focus:bg-white focus:outline-none focus:border-editorial-charcoal font-mono"
                  >
                    <option value="">-- Autoselect Default Recipe --</option>
                    {recipes.map((r) => (
                      <option key={r.id} value={r.id}>
                        [{r.difficulty}] {r.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Product selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-editorial-charcoal/50 block">Featured Micro-Batch Product Drop</label>
                  <select
                    value={selectedNewsletterProductId}
                    onChange={(e) => setSelectedNewsletterProductId(e.target.value)}
                    className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2 text-xs focus:bg-white focus:outline-none focus:border-editorial-charcoal font-mono"
                  >
                    <option value="">-- Autoselect Default Product --</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (${p.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Newsletter Intro editor */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-bold uppercase text-editorial-charcoal/50 block">Editorial Intro Column Copyset</label>
                  <textarea
                    value={newsletterCustomIntro}
                    onChange={(e) => setNewsletterCustomIntro(e.target.value)}
                    rows={4}
                    className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2.5 text-xs focus:bg-white focus:outline-none focus:border-editorial-charcoal font-sans leading-relaxed text-editorial-charcoal"
                    placeholder="Provide a seasonal farm update or master brine recommendation note..."
                  />
                  <span className="text-[9px] text-stone-400 font-mono">* Supports flat text paragraphs. HTML styling auto-wrapped inside dispatch templates.</span>
                </div>

                {/* Dispatch Button Trigger */}
                <div className="pt-2 border-t border-stone-150">
                  <button
                    onClick={() => {
                      addToast({
                        title: "Weekly Dispatch Broadcast",
                        message: `Newsletter queued successfully! Dispatched "${newsletterSubject}" to all active subscribers with a "${newsletterAudience}" preference profile.`,
                        type: "success"
                      });
                    }}
                    className="w-full py-2.5 bg-[#C1121F] hover:bg-stone-900 text-stone-100 px-4 font-mono text-[10px] uppercase font-black tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-3xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Simulate Live Dispatch Release
                  </button>
                </div>

              </div>
            </div>

            {/* Simulated Subscriber stats card */}
            <div className="bg-editorial-gray border border-editorial-charcoal/15 p-5 space-y-3 rounded-none">
              <span className="text-[9px] font-mono font-bold tracking-wider text-[#C1121F] uppercase block">Broadcast Analytics Mock logs</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 border border-stone-200">
                  <span className="block text-stone-500 text-[8px] font-mono uppercase tracking-tight">Active Reach</span>
                  <span className="font-mono text-sm font-black text-editorial-charcoal">1,412</span>
                </div>
                <div className="bg-white p-2.5 border border-stone-200">
                  <span className="block text-stone-500 text-[8px] font-mono uppercase tracking-tight">Open Rate</span>
                  <span className="font-mono text-sm font-black text-editorial-charcoal">84.2%</span>
                </div>
                <div className="bg-white p-2.5 border border-stone-200">
                  <span className="block text-stone-500 text-[8px] font-mono uppercase tracking-tight">CTR Perf</span>
                  <span className="font-mono text-sm font-black text-editorial-charcoal">39.1%</span>
                </div>
              </div>
            </div>

          </div>

          {/* Email Envelope Display Frame - 7 Columns */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Display configuration bar */}
            <div className="flex justify-between items-center bg-stone-100 border border-editorial-charcoal/15 p-3 rounded-none">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-editorial-charcoal/60" />
                <span className="font-serif italic text-xs font-bold text-editorial-charcoal">Interactive Rendered Preview</span>
              </div>

              {/* Form factors */}
              <div className="flex bg-white border border-editorial-charcoal/15">
                <button
                  type="button"
                  onClick={() => setNewsletterPreviewDevice("desktop")}
                  className={`p-1.5 transition-colors ${newsletterPreviewDevice === "desktop" ? "bg-editorial-charcoal text-white" : "text-stone-500 hover:bg-stone-100"}`}
                  title="Desktop Outlook Monitor Wrap"
                  aria-label="Desktop Monitor Display Form-Factor"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setNewsletterPreviewDevice("mobile")}
                  className={`p-1.5 transition-colors ${newsletterPreviewDevice === "mobile" ? "bg-editorial-charcoal text-white" : "text-stone-500 hover:bg-stone-100"}`}
                  title="Mobile Smartphone Wrap"
                  aria-label="Mobile Phone Display Form-Factor"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Real Mail Frame Mock Envelope wrapper */}
            <div className={`transition-all duration-300 mx-auto ${newsletterPreviewDevice === "mobile" ? "max-w-md border-x-8 border-t-12 border-b-16 border-stone-800 rounded-3xl p-1 bg-stone-100 shadow-xl" : "w-full"}`}>
              
              {/* Mail client visual header */}
              <div className="bg-stone-50 border border-stone-200 p-3.5 space-y-1.5 text-xs text-left selection:bg-[#C1121F]/10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider w-16">To:</span>
                  <span className="text-stone-800 font-medium">subscriber@weekly-brine-digest.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider w-16">From:</span>
                  <span className="text-stone-800 font-medium font-mono text-[11px]">dispatch@pickle-pepper.co</span>
                </div>
                <div className="flex items-start gap-2 pt-1 border-t border-stone-150">
                  <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider w-16">Subject:</span>
                  <span className="text-editorial-charcoal font-serif font-black italic">{newsletterSubject || "(No Subject Headline entered)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider w-16">Segment:</span>
                  <span className="bg-amber-100 border border-amber-300/40 text-amber-900 px-1.5 py-0.5 rounded-none text-[8.5px] font-mono uppercase tracking-wider font-bold">
                    {newsletterAudience === "both" ? "All Preference Subscribers" : newsletterAudience === "pickle" ? "Artisanal Pickles Preference Only" : "Spicy Peppers Preference Only"}
                  </span>
                </div>
              </div>

              {/* RENDERED EMAIL BODY CONTENT CONTAINER */}
              <div className={templateConfig.wrapperClass}>
                
                {/* Email Banner brand header */}
                <div className={templateConfig.headerBorderClass}>
                  <span className={templateConfig.accentTextClass}>
                    {newsletterTemplate === "spicy" ? "🔥 COAL-FIRED SPECIES • SPICE LEVELS IN EXCESS 🔥" : "ESTD 1892 • CRAFT FERMENT DISPATCHES"}
                  </span>
                  <h1 className={templateConfig.headerTitleClass}>
                    {newsletterTemplate === "spicy" 
                      ? "The Chili Head Firebrand" 
                      : "The Pickle & Pepper Gazette"}
                  </h1>
                  <div className="flex justify-between items-center text-[8.5px] font-mono text-stone-400 uppercase pt-2 tracking-wider">
                    <span>Issue #34</span>
                    <span>•</span>
                    <span>June 2026</span>
                    <span>•</span>
                    <span>Weekly Curation</span>
                  </div>
                </div>

                {/* Introductory editorial section */}
                <div className="space-y-3.5 text-left leading-relaxed">
                  <p className={`font-serif italic text-base mb-1 ${newsletterTemplate === 'spicy' ? 'text-red-400 font-extrabold' : newsletterTemplate === 'farmhouse' ? 'text-emerald-950 font-bold' : 'text-editorial-charcoal font-bold'}`}>
                    {newsletterTemplate === "spicy" ? "Greetings Spice Fanatic," : "Greetings Brine Aficionado,"}
                  </p>
                  <div className={`${newsletterTemplate === 'spicy' ? 'text-stone-300' : 'text-stone-700'} text-xs sm:text-[13px] leading-relaxed font-sans whitespace-pre-wrap`}>
                    {newsletterCustomIntro || "Write your dynamic issue introduction column text in the panel on the left..."}
                  </div>
                </div>

                {/* 1. FEATURED RECIPE SEGMENT (Dynamic database link) */}
                {activeRecipeForNewsletter ? (
                  <div className={templateConfig.featuredRecipeBg}>
                    <div className="space-y-1">
                      <span className={templateConfig.recipeAccentLabel}>✦ CULINARY MAP OF THE WEEK</span>
                      <h3 className={`font-serif text-base font-bold italic ${newsletterTemplate === 'spicy' ? 'text-red-400' : newsletterTemplate === 'farmhouse' ? 'text-emerald-950' : 'text-editorial-charcoal'}`}>
                        {activeRecipeForNewsletter.title}
                      </h3>
                      <p className={`text-[11px] leading-normal ${newsletterTemplate === 'spicy' ? 'text-stone-400' : 'text-stone-600'}`}>
                        {activeRecipeForNewsletter.description}
                      </p>
                    </div>

                    {/* Meta bar */}
                    <div className={`grid grid-cols-3 gap-2 py-2 border-y ${newsletterTemplate === 'spicy' ? 'border-red-900/60' : 'border-stone-200/60'} text-center font-mono text-[9px]`}>
                      <div>
                        <span className="block text-stone-400 uppercase">Preptime</span>
                        <span className={`font-bold ${newsletterTemplate === 'spicy' ? 'text-stone-300' : 'text-stone-700'}`}>{activeRecipeForNewsletter.prepTime}</span>
                      </div>
                      <div>
                        <span className="block text-stone-400 uppercase">Cooktime</span>
                        <span className={`font-bold ${newsletterTemplate === 'spicy' ? 'text-stone-300' : 'text-stone-700'}`}>{activeRecipeForNewsletter.cookTime}</span>
                      </div>
                      <div>
                        <span className="block text-stone-400 uppercase">Complexity</span>
                        <span className={`font-bold ${newsletterTemplate === 'spicy' ? 'text-red-500 font-black' : 'text-[#C1121F]'}`}>{activeRecipeForNewsletter.difficulty}</span>
                      </div>
                    </div>

                    {/* Link button */}
                    <button
                      type="button"
                      className={templateConfig.recipeButton}
                    >
                      DEDUCE CULINARY MAP →
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-stone-100 border border-dashed border-stone-300 text-center text-xs italic text-stone-500">
                    No active recipes matching catalog criteria.
                  </div>
                )}

                {/* 2. EXCLUSIVE MICRO-BATCH JAR SPONSORSHIP */}
                {activeProductForNewsletter ? (
                  <div className="pt-2">
                    <div className={templateConfig.productCardClass}>
                      <img
                        src={activeProductForNewsletter.image}
                        alt={activeProductForNewsletter.name}
                        className="w-20 h-20 object-cover border border-stone-200 rounded-none shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1.5 w-full">
                        <span className={templateConfig.productAccentLabel}>🚚 FEATURED BATCH ON STREAM</span>
                        <div className="flex items-start justify-between">
                          <h4 className={`font-serif text-sm font-black italic leading-tight ${newsletterTemplate === 'spicy' ? 'text-red-400' : newsletterTemplate === 'farmhouse' ? 'text-emerald-950' : 'text-editorial-charcoal'}`}>
                            {activeProductForNewsletter.name}
                          </h4>
                          <span className={`font-mono text-xs font-bold whitespace-nowrap shrink-0 pl-2 ${newsletterTemplate === 'spicy' ? 'text-red-400' : 'text-editorial-red'}`}>
                            ${activeProductForNewsletter.price.toFixed(2)}
                          </span>
                        </div>
                        <p className={`text-[11px] font-sans leading-relaxed line-clamp-2 ${newsletterTemplate === 'spicy' ? 'text-stone-400' : 'text-stone-600'}`}>
                          {activeProductForNewsletter.description}
                        </p>
                        <div className="text-[9.5px] font-mono text-stone-400 flex items-center justify-between pt-1">
                          <span>Craft: {activeProductForNewsletter.sellerName}</span>
                          <span>Unit Size: {activeProductForNewsletter.size || "16 oz jar"}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={templateConfig.productButton}
                    >
                      ACQUIRE EXCLUSIVE MICRO-BATCH JAR {newsletterTemplate === "spicy" ? "🌶️" : newsletterTemplate === "farmhouse" ? "🌿" : "📦"}
                    </button>
                  </div>
                ) : (
                  <div className="p-4 bg-stone-100 border border-dashed border-stone-300 text-center text-xs italic text-stone-500">
                    No active inventory listings matching crop criteria.
                  </div>
                )}

                {/* 3. QUICK BRINE TRIVIA COLUMN */}
                <div className={templateConfig.triviaBg}>
                  <h5 className={`${templateConfig.triviaTitleClass} text-xs font-mono font-bold`}>
                    {newsletterTemplate === "spicy" ? "🔥 Scoville Level Notice:" : "Farmers Guild Fermenting Rule:"}
                  </h5>
                  <p className={`${newsletterTemplate === 'spicy' ? 'text-stone-300' : 'text-stone-700'} text-[11px] leading-relaxed`}>
                    {newsletterTemplate === "spicy" 
                      ? "When handling extreme ghost chili or carolina reaper compounds, prioritize protective sterile gear. Keep caps tight during initial off-gassing to bind natural flavor capsicums!"
                      : "Always maintain sterile, anaerobic (submerged) conditions. Wild yeasts and airborne molds are locked outside when you keep lacto-active brines locked at 70°F water seals."}
                  </p>
                </div>

                {/* Footnotes & Regulatory Info */}
                <div className={`border-t ${templateConfig.accentBorderColor} pt-6 text-center space-y-3.5 select-none font-sans text-stone-400 leading-normal`}>
                  <p className="text-[9.5px]">
                    You received this dispatch because you signed up for the weekly newsletter subscription at Pickle &amp; Pepper Co. Curation Labs.
                  </p>
                  <p className="text-[8.5px] font-mono tracking-tight text-stone-400">
                    Crafted with pride in Artisan Alley, Cascadia Fermentations Block A.
                  </p>
                  <div className="flex justify-center gap-3.5 text-[9px] font-mono font-bold uppercase">
                    <span className={`${templateConfig.footerLinkClass}`}>Unsubscribe</span>
                    <span>•</span>
                    <span className={`${templateConfig.footerLinkClass}`}>Update Preferences</span>
                    <span>•</span>
                    <span className={`${templateConfig.footerLinkClass}`}>Farmer Registers</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
