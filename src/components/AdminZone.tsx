import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { DollarSign, ShoppingCart, ShieldAlert, Sparkles, Check, X, Trash2, Edit2, CheckCircle2, AlertTriangle, ChevronRight } from "lucide-react";

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
  } = useApp();

  // Selected sub tab: "stats" | "active-products" | "seller-approval-queue" | "orders-fulfillment"
  const [adminTab, setAdminTab] = useState<"stats" | "active-products" | "seller-approval-queue" | "orders-fulfillment">("stats");

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

    </div>
  );
}
