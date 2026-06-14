import React, { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { WHOLESALE_CATALOG_ITEMS, WholesaleProduct } from "../data/wholesaleCatalog";
import { Product, Order } from "../types";
import { 
  ArrowUpRight, 
  TrendingUp, 
  Coins, 
  PackageCheck, 
  PackageOpen, 
  Truck, 
  Edit3, 
  PlusCircle, 
  HelpCircle, 
  ArrowRight, 
  MapPin, 
  Search, 
  AlertCircle, 
  Trash2, 
  Check, 
  X, 
  DollarSign, 
  Briefcase, 
  RefreshCw,
  Clock,
  ExternalLink,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DropshipState {
  status: "unpaid" | "processing" | "shipped" | "completed";
  paidAt?: string;
  shippedAt?: string;
  trackingNumber?: string;
  carrier?: string;
}

export default function MerchantHub() {
  const { 
    products, 
    orders, 
    importDropshipProduct, 
    deleteProduct, 
    updateOrderStatus 
  } = useApp();

  // Active Hub tab: "analytics" | "sourcing" | "storefront" | "orders" | "academy"
  const [activeHubTab, setActiveHubTab] = useState<"analytics" | "sourcing" | "storefront" | "orders" | "academy">("analytics");

  // Wholesale search filter
  const [wholesaleSearch, setWholesaleSearch] = useState("");
  const [selectedWholesaleCategory, setSelectedWholesaleCategory] = useState<string>("all");

  // Sourcing product focus
  const [configuringProduct, setConfiguringProduct] = useState<WholesaleProduct | null>(null);
  
  // Custom margin settings
  const [markupPrice, setMarkupPrice] = useState<number>(12.99);
  const [customName, setCustomName] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  // Notification bubble
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // In-portal B2B wholesale payment modal
  const [payingForOrderProduct, setPayingForOrderProduct] = useState<{ 
    orderId: string; 
    product: Product; 
    quantity: number;
    wholesaleCost: number;
  } | null>(null);

  // Simulated B2B banking state
  const [ccNumber, setCcNumber] = useState("4000 1245 8892 0019");
  const [isProcessingB2B, setIsProcessingB2B] = useState(false);

  // Active order in tracking view on the map
  const [viewingTrackerOrderId, setViewingTrackerOrderId] = useState<string | null>(null);
  const [trackerStep, setTrackerStep] = useState<number>(0);

  // Dropship orders metadata local storage persistence
  const [dropshipOrdersState, setDropshipOrdersState] = useState<Record<string, DropshipState>>(() => {
    const saved = localStorage.getItem("p_m_dropship_orders");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("p_m_dropship_orders", JSON.stringify(dropshipOrdersState));
  }, [dropshipOrdersState]);

  const triggerToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(""), 4500);
  };

  // Compute Active Storefront Dropshipped Listings
  const merchandisedProducts = useMemo(() => {
    return products.filter((p) => p.isDropshipped === true);
  }, [products]);

  // Compute relevant client orders containing merchandised items
  const dropshipCustomerOrders = useMemo(() => {
    const list: Array<{
      order: Order;
      productId: string;
      productName: string;
      retailPrice: number;
      quantity: number;
      image: string;
      isDropshippedProduct: boolean;
      dropshipInfo?: Product;
    }> = [];

    orders.forEach((o) => {
      o.items.forEach((item) => {
        // Check if the product ordered has the dropshipped flag
        const matchingProduct = products.find((p) => p.id === item.productId);
        if (matchingProduct?.isDropshipped) {
          list.push({
            order: o,
            productId: item.productId,
            productName: item.productName,
            retailPrice: item.price,
            quantity: item.quantity,
            image: item.image,
            isDropshippedProduct: true,
            dropshipInfo: matchingProduct,
          });
        }
      });
    });

    return list;
  }, [orders, products]);

  // Sync dropship status from storage or default to 'unpaid' for any new matching orders
  useEffect(() => {
    let updated = false;
    const nextState = { ...dropshipOrdersState };

    dropshipCustomerOrders.forEach((item) => {
      const key = `${item.order.id}-${item.productId}`;
      if (!nextState[key]) {
        nextState[key] = {
          status: "unpaid",
        };
        updated = true;
      }
    });

    if (updated) {
      setDropshipOrdersState(nextState);
    }
  }, [dropshipCustomerOrders]);

  // Financial Analytics Calculations
  const analyticsData = useMemo(() => {
    let totalRevenue = 0;
    let totalWholesalePaid = 0;
    let totalItemsFulfilled = 0;
    let totalItemsPending = 0;

    dropshipCustomerOrders.forEach((item) => {
      const key = `${item.order.id}-${item.productId}`;
      const state = dropshipOrdersState[key] || { status: "unpaid" };
      const wholesaleAmount = (item.dropshipInfo?.wholesaleCost || 4.00) * item.quantity;
      const retailAmount = item.retailPrice * item.quantity;

      if (state.status !== "unpaid") {
        totalWholesalePaid += wholesaleAmount;
        totalRevenue += retailAmount;
        totalItemsFulfilled += item.quantity;
      } else {
        totalItemsPending += item.quantity;
      }
    });

    const netProfit = totalRevenue - totalWholesalePaid;
    const avgProfitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalWholesalePaid,
      netProfit,
      avgProfitMargin,
      totalItemsFulfilled,
      totalItemsPending,
      totalOrders: dropshipCustomerOrders.length,
    };
  }, [dropshipCustomerOrders, dropshipOrdersState]);

  // Handle configuration edit
  const handleOpenConfigurator = (whProd: WholesaleProduct) => {
    setConfiguringProduct(whProd);
    setMarkupPrice(whProd.suggestedMSRP);
    setCustomName(`Curated ${whProd.name}`);
    setCustomDescription(whProd.description);
  };

  // Publish to customer marketplace
  const handlePublishListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configuringProduct) return;

    // Avoid double listings of same orig-id
    const alreadyListed = products.some(
      (p) => p.isDropshipped && p.originalProductId === configuringProduct.id
    );

    if (alreadyListed) {
      triggerToast(`You have already active listed "${configuringProduct.name}" in your catalog.`, "error");
      setConfiguringProduct(null);
      return;
    }

    const newProduct: Product = {
      id: `dp-prod-${Date.now()}`,
      name: customName || configuringProduct.name,
      description: customDescription || configuringProduct.description,
      price: markupPrice,
      category: configuringProduct.category,
      image: configuringProduct.image,
      spiceLevel: configuringProduct.spiceLevel,
      stock: configuringProduct.supplyLimit, // backed directly by Supplier Capacity
      rating: 5.0,
      reviewsCount: 0,
      ingredients: configuringProduct.ingredients,
      sellerName: configuringProduct.sellerName,
      tags: [...configuringProduct.tags, "Dropship Curated"],
      size: configuringProduct.size,
      isDropshipped: true,
      wholesaleCost: configuringProduct.wholesaleCost,
      supplierName: configuringProduct.supplierName,
      originalProductId: configuringProduct.id,
    };

    importDropshipProduct(newProduct);
    triggerToast(`"${newProduct.name}" successfully listed to live Marketplace at $${newProduct.price.toFixed(2)}`, "success");
    setConfiguringProduct(null);
    setActiveHubTab("storefront");
  };

  const handleRemoveListing = (productId: string, name: string) => {
    deleteProduct(productId);
    triggerToast(`Listing "${name}" successfully deleted from live customer index.`, "success");
  };

  // Pay B2B Wholesale Core Function
  const handleWholesaleB2BPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingForOrderProduct) return;

    setIsProcessingB2B(true);

    setTimeout(() => {
      const key = `${payingForOrderProduct.orderId}-${payingForOrderProduct.product.id}`;
      
      setDropshipOrdersState((prev) => ({
        ...prev,
        [key]: {
          status: "processing",
          paidAt: new Date().toISOString(),
          trackingNumber: `TRK-UPS-${Math.floor(10000000 + Math.random() * 90000000)}`,
          carrier: "UPS Express Freight",
        },
      }));

      // Update the main customer order status in context to reflect fulfillment progress
      updateOrderStatus(payingForOrderProduct.orderId, "Ready for Shipping");

      setIsProcessingB2B(false);
      setPayingForOrderProduct(null);
      triggerToast(`B2B Invoice Settled! Order successfully routed & packed at Supplier's warehouse.`, "success");
      
      // Auto open tracking visualizer
      setViewingTrackerOrderId(payingForOrderProduct.orderId);
      setTrackerStep(1); // Crock Packing initiated
    }, 1800);
  };

  // Simulate carrier progress
  const accelerateShipment = (orderId: string, productId: string) => {
    const key = `${orderId}-${productId}`;
    const nextStatus = dropshipOrdersState[key];
    if (!nextStatus) return;

    if (nextStatus.status === "processing") {
      setDropshipOrdersState((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: "shipped", shippedAt: new Date().toISOString() },
      }));
      updateOrderStatus(orderId, "Shipped");
      setTrackerStep(3); // In transit
      triggerToast("Supplier dispatched freight truck! Live tracking route updated.", "success");
    } else if (nextStatus.status === "shipped") {
      setDropshipOrdersState((prev) => ({
        ...prev,
        [key]: { ...prev[key], status: "completed" },
      }));
      updateOrderStatus(orderId, "Completed");
      setTrackerStep(4); // Delivered
      triggerToast("Courier handed package to customer. Order Cycle finalized!", "success");
    }
  };

  // Filter Catalog
  const filteredWholesale = useMemo(() => {
    return WHOLESALE_CATALOG_ITEMS.filter((item) => {
      const matchesSearch = 
        item.name.toLowerCase().includes(wholesaleSearch.toLowerCase()) ||
        item.description.toLowerCase().includes(wholesaleSearch.toLowerCase()) ||
        item.ingredients.some((ing) => ing.toLowerCase().includes(wholesaleSearch.toLowerCase())) ||
        item.supplierName.toLowerCase().includes(wholesaleSearch.toLowerCase());

      const matchesCat = selectedWholesaleCategory === "all" || item.category === selectedWholesaleCategory;
      return matchesSearch && matchesCat;
    });
  }, [wholesaleSearch, selectedWholesaleCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-24 text-left text-editorial-charcoal font-sans" id="merchant-hub-portal">
      
      {/* Dynamic Toast notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 p-4 border shadow-md font-mono text-xs flex items-center gap-2 rounded-none ${
              toastType === "success" 
                ? "bg-[#FAF9F6] border-emerald-500 text-emerald-800" 
                : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            {toastType === "success" ? <Check className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banner Hub Header */}
      <div className="bg-white border border-editorial-charcoal/15 p-6 mb-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm rounded-none">
        <div className="space-y-1.5 z-10 relative">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 text-[8.5px] bg-[#C1121F] text-white font-mono uppercase font-bold tracking-widest leading-none">
              B2B MERCHANDISING PORTAL
            </span>
            <span className="font-mono text-[9px] text-[#C1121F] font-extrabold animate-pulse">
              ● REAL-TIME INTERACTIVE PIPELINE
            </span>
          </div>
          <h1 className="font-serif text-3xl font-bold italic tracking-tight text-editorial-charcoal">
            The Dropship &amp; Merchandising Suite
          </h1>
          <p className="text-xs text-[#1A1A1A]/70 leading-relaxed max-w-2xl font-sans">
            Source organic wholesale batches directly from verified supplier crops. Configure margins, push customized products into the consumer marketplace, pay bills with secure one-click routing, and monitor shipping networks.
          </p>
        </div>

        {/* Global tab Switcher row */}
        <div className="flex flex-wrap gap-2 shrink-0 z-10">
          <button
            onClick={() => setActiveHubTab("analytics")}
            className={`px-4 py-2 border font-mono uppercase text-[9px] font-bold tracking-wider rounded-none transition-all ${
              activeHubTab === "analytics"
                ? "bg-editorial-charcoal text-white border-editorial-charcoal"
                : "bg-stone-50 text-editorial-charcoal/70 border-editorial-charcoal/15 hover:bg-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 inline mr-1" />
            Analytics
          </button>
          <button
            onClick={() => setActiveHubTab("sourcing")}
            className={`px-4 py-2 border font-mono uppercase text-[9px] font-bold tracking-wider rounded-none transition-all ${
              activeHubTab === "sourcing"
                ? "bg-[#C1121F] text-white border-[#C1121F] shadow-xs"
                : "bg-stone-50 text-editorial-charcoal/70 border-editorial-charcoal/15 hover:bg-white"
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 inline mr-1" />
            Source Catalog
          </button>
          <button
            onClick={() => setActiveHubTab("storefront")}
            className={`px-4 py-2 border font-mono uppercase text-[9px] font-bold tracking-wider rounded-none transition-all ${
              activeHubTab === "storefront"
                ? "bg-editorial-charcoal text-white border-editorial-charcoal"
                : "bg-stone-50 text-editorial-charcoal/70 border-editorial-charcoal/15 hover:bg-white"
            }`}
          >
            <PackageCheck className="w-3.5 h-3.5 inline mr-1" />
            My Listings ({merchandisedProducts.length})
          </button>
          <button
            onClick={() => setActiveHubTab("orders")}
            className={`px-4 py-2 border font-mono uppercase text-[9px] font-bold tracking-wider rounded-none transition-all relative ${
              activeHubTab === "orders"
                ? "bg-editorial-charcoal text-white border-editorial-charcoal"
                : "bg-stone-50 text-editorial-charcoal/70 border-editorial-charcoal/15 hover:bg-white"
            }`}
          >
            <Truck className="w-3.5 h-3.5 inline mr-1" />
            Fulfillment Queue
            {analyticsData.totalItemsPending > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#C1121F] text-white text-[8px] flex items-center justify-center font-bold animate-bounce font-sans">
                {analyticsData.totalItemsPending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveHubTab("academy")}
            className={`px-4 py-2 border font-mono uppercase text-[9px] font-bold tracking-wider rounded-none transition-all ${
              activeHubTab === "academy"
                ? "bg-editorial-charcoal text-white border-editorial-charcoal"
                : "bg-stone-50 text-editorial-charcoal/70 border-editorial-charcoal/15 hover:bg-white"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 inline mr-1" />
            Dropship School
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: EXECUTIVE ANALYTICS SCREEN */}
      {/* ========================================================= */}
      {activeHubTab === "analytics" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Key Metrics grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-5 border border-editorial-charcoal/12 text-left relative overflow-hidden rounded-none shadow-3xs" id="analytic-revenue">
              <span className="text-[8px] font-mono font-black text-editorial-charcoal/50 uppercase tracking-widest block mb-2">
                RETAIL SALES REVENUE
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-black text-editorial-charcoal">
                  ${analyticsData.totalRevenue.toFixed(2)}
                </span>
                <span className="text-[8px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1 py-0.5 uppercase tracking-wider">
                  +100% Sourced
                </span>
              </div>
              <p className="text-[10px] text-editorial-charcoal/50 font-serif italic mt-2">
                Retail price sales from imported listings.
              </p>
            </div>

            <div className="bg-white p-5 border border-editorial-charcoal/12 text-left relative overflow-hidden rounded-none shadow-3xs" id="analytic-wholesale">
              <span className="text-[8px] font-mono font-black text-[#C1121F]/60 uppercase tracking-widest block mb-2">
                WHOLESALE COSTS (COGS)
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-black text-[#C1121F]">
                  ${analyticsData.totalWholesalePaid.toFixed(2)}
                </span>
                <span className="text-[8px] font-mono text-[#C1121F] font-bold bg-red-50 px-1 py-0.5 uppercase tracking-wider">
                  Paid To Suppliers
                </span>
              </div>
              <p className="text-[10px] text-editorial-charcoal/50 font-serif italic mt-2">
                B2B catalog cost values paid to farm vendors.
              </p>
            </div>

            <div className="bg-white p-5 border border-editorial-charcoal/12 text-left relative overflow-hidden rounded-none shadow-3xs" id="analytic-profit">
              <span className="text-[8px] font-mono font-black text-emerald-800 uppercase tracking-widest block mb-2">
                NET MERCHANDISER PROFIT
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-mono font-black text-emerald-700">
                  ${analyticsData.netProfit.toFixed(2)}
                </span>
                <span className="text-[8px] font-mono text-emerald-600 font-bold bg-emerald-100 px-1 py-0.5 uppercase tracking-wider">
                  Net Surplus
                </span>
              </div>
              <p className="text-[10px] text-editorial-charcoal/50 font-serif italic mt-2">
                Retained income surplus (Sales minus Cost of Goods).
              </p>
            </div>

            <div className="bg-stone-900 p-5 text-white text-left relative overflow-hidden rounded-none" id="analytic-margin">
              <span className="text-[8px] font-mono font-bold text-stone-400 uppercase tracking-widest block mb-1">
                GROSS PROFIT MARGIN
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-3xl font-mono font-black text-amber-400">
                  {analyticsData.avgProfitMargin.toFixed(1)}%
                </span>
                <span className="text-[8.5px] font-mono text-amber-400 font-extrabold block">
                  AVERAGE
                </span>
              </div>
              <p className="text-[10px] text-stone-400 font-serif italic mt-2">
                Wholesale leverage ratio markup margin.
              </p>
            </div>

          </div>

          {/* Interactive Live Simulator Tracker Console */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Graph visual list */}
            <div className="lg:col-span-2 bg-white border border-editorial-charcoal/15 p-6 rounded-none text-left">
              <h3 className="font-serif text-lg font-bold text-editorial-charcoal italic border-b border-editorial-charcoal/10 pb-3 block">
                Storefront Merchandising Profitability Index
              </h3>
              
              {merchandisedProducts.length === 0 ? (
                <div className="py-16 text-center text-[#1A1A1A]/40 italic font-serif space-y-3">
                  <p>You have not listed any merchandised products from the Sourcing folder.</p>
                  <button
                    onClick={() => setActiveHubTab("sourcing")}
                    className="px-4 py-2 bg-editorial-charcoal text-white font-mono uppercase text-[9.5px] tracking-wider font-bold"
                  >
                    Go Source Wholesale Items
                  </button>
                </div>
              ) : (
                <div className="space-y-6 pt-4 font-sans">
                  <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
                    Contrast the wholesale cost paid to agrarian suppliers versus the customer retail price. The gap represents your 100% passive net yield earnings!
                  </p>
                  
                  <div className="space-y-4">
                    {merchandisedProducts.map((p) => {
                      const wholesalePrice = p.wholesaleCost || 4.00;
                      const retailPrice = p.price;
                      const profitUnit = retailPrice - wholesalePrice;
                      const marginPercent = (profitUnit / retailPrice) * 100;
                      
                      // Percent widths for bars
                      const maxTarget = 20; // scale reference
                      const wholesalePercent = Math.min(100, (wholesalePrice / maxTarget) * 100);
                      const retailPercent = Math.min(100, (retailPrice / maxTarget) * 100);

                      return (
                        <div key={p.id} className="p-3 bg-stone-50 border border-stone-200 rounded-none space-y-2.5">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-serif font-black text-sm text-editorial-charcoal italic">{p.name}</h4>
                              <p className="text-[10px] text-editorial-charcoal/50 font-mono uppercase">Supplier: {p.supplierName || "Direct"}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                                Unit Net: +${profitUnit.toFixed(2)} ({marginPercent.toFixed(0)}% Margin)
                              </span>
                            </div>
                          </div>

                          <div className="space-y-1.5 font-mono text-[9px]">
                            {/* Wholesale Cost bar */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                              <span className="col-span-3 text-editorial-charcoal/60 text-right uppercase font-bold">Wholesale Cost</span>
                              <div className="col-span-7 bg-stone-200 h-3 rounded-none overflow-hidden relative">
                                <div 
                                  className="h-full bg-editorial-charcoal transition-all duration-500"
                                  style={{ width: `${wholesalePercent}%` }}
                                ></div>
                              </div>
                              <span className="col-span-2 text-editorial-charcoal font-black">${wholesalePrice.toFixed(2)}</span>
                            </div>

                            {/* Retail list price bar */}
                            <div className="grid grid-cols-12 gap-2 items-center">
                              <span className="col-span-3 text-[#C1121F] text-right uppercase font-bold">Your Retail Price</span>
                              <div className="col-span-7 bg-stone-200 h-3 rounded-none overflow-hidden relative">
                                <div 
                                  className="h-full bg-[#C1121F] transition-all duration-500"
                                  style={{ width: `${retailPercent}%` }}
                                ></div>
                              </div>
                              <span className="col-span-2 text-editorial-charcoal font-bold">${retailPrice.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Quick Simulation instructions */}
            <div className="space-y-6">
              <div className="bg-stone-900 text-stone-200 p-6 border border-stone-850 rounded-none text-left font-sans">
                <span className="text-[8.5px] uppercase font-mono font-bold text-amber-400 tracking-wider">
                  How Slicing the Value Chain Works
                </span>
                <h4 className="font-serif text-lg font-bold italic text-white mt-1 mb-3">
                  The Dropshipping Lifecycle
                </h4>
                
                <ol className="space-y-4 text-xs font-serif leading-relaxed text-stone-300">
                  <li className="flex gap-2.5">
                    <span className="font-mono text-amber-400 font-bold border border-amber-400/30 w-5 h-5 flex items-center justify-center shrink-0">1</span>
                    <p className="font-sans text-[11px]">
                      <strong>Sourcing import</strong>: Pick fine crocks. You markup the listings and push them live to the consumer Marketplace tab with custom price structures.
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-mono text-amber-400 font-bold border border-amber-400/30 w-5 h-5 flex items-center justify-center shrink-0">2</span>
                    <p className="font-sans text-[11px]">
                      <strong>Customer Purchase</strong>: Go to <strong>Marketplace</strong> in another tab (or your buyer account), register an order under your name, and checkout.
                    </p>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="font-mono text-amber-400 font-bold border border-amber-400/30 w-5 h-5 flex items-center justify-center shrink-0">3</span>
                    <p className="font-sans text-[11px]">
                      <strong>Fulfillment Settlement</strong>: Open your <strong>Fulfillment Queue</strong> here, pay the Supplier wholesale invoice (e.g. $4.00), and trigger automated supply-chain dispatch tracking!
                    </p>
                  </li>
                </ol>

                <div className="mt-6 pt-4 border-t border-stone-800 flex justify-between">
                  <button 
                    onClick={() => setActiveHubTab("sourcing")}
                    className="px-3.5 py-1.5 bg-[#C1121F] text-white text-[9px] font-mono uppercase tracking-widest font-bold hover:bg-red-700 rounded-none"
                  >
                    Open Source
                  </button>
                  <button 
                    onClick={() => setActiveHubTab("orders")}
                    className="px-3.5 py-1.5 bg-stone-800 text-amber-400 text-[9px] font-mono uppercase tracking-widest font-bold hover:bg-stone-700 rounded-none"
                  >
                    Fulfill Orders
                  </button>
                </div>
              </div>

              {/* Network Health Check list */}
              <div className="bg-white border border-editorial-charcoal/15 p-5 text-left rounded-none">
                <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#C1121F] font-bold block mb-3">
                  SUPPLY-CHAIN INFRASTRUCTURE STATUS
                </span>
                
                <div className="space-y-2 text-xs font-sans">
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-editorial-charcoal/70">Mount Hood Hub Curing</span>
                    <span className="text-[9px] font-mono uppercase text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5">ONLINE / Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-editorial-charcoal/70">Sichuan Valley Express</span>
                    <span className="text-[9px] font-mono uppercase text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5">ONLINE / Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-editorial-charcoal/70">Islander Preserve Depot</span>
                    <span className="text-[9px] font-mono uppercase text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5">ONLINE / Active</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-editorial-charcoal/70">Lactobacillus starters</span>
                    <span className="text-[9px] font-mono uppercase text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5">ONLINE / Sterile</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ACTIVE B2B SOURCING DIRECTORY CATALOG */}
      {/* ========================================================= */}
      {activeHubTab === "sourcing" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-stone-100 p-4 border border-editorial-charcoal/10 flex flex-col md:flex-row gap-4 items-center justify-between rounded-none text-left">
            
            {/* Search segment */}
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-editorial-charcoal/40" />
              <input 
                type="text" 
                value={wholesaleSearch}
                onChange={(e) => setWholesaleSearch(e.target.value)}
                placeholder="Search premium wholesale items, ingredients, location origin..."
                className="w-full text-xs border border-editorial-charcoal/20 pl-9 pr-4 py-2.5 focus:outline-none bg-white font-mono rounded-none"
              />
            </div>

            {/* Category tabs filters */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto overflow-x-auto">
              {["all", "pickle", "pepper", "oil", "starter"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedWholesaleCategory(cat)}
                  className={`px-3 py-1.5 text-[9px] font-mono uppercase font-bold tracking-wider rounded-none border transition-all ${
                    selectedWholesaleCategory === cat
                      ? "bg-editorial-charcoal text-white border-editorial-charcoal"
                      : "bg-white text-editorial-charcoal border-editorial-charcoal/10 hover:border-editorial-charcoal"
                  }`}
                >
                  {cat === "all" ? "All Crops" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Wholesale products grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWholesale.map((wh) => {
              // Calculate default earnings estimations
              const targetCost = wh.wholesaleCost;
              const defaultMSRP = wh.suggestedMSRP;
              const marginEarned = defaultMSRP - targetCost;
              const marginPercent = (marginEarned / defaultMSRP) * 100;
              
              // Check if they already listed it
              const isAdded = products.some(
                (p) => p.isDropshipped && p.originalProductId === wh.id
              );

              return (
                <div 
                  key={wh.id}
                  className="bg-white border border-editorial-charcoal/15 flex flex-col justify-between hover:border-editorial-charcoal/45 transition-all rounded-none overflow-hidden relative"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-44 bg-stone-100 border-b border-stone-200">
                      <img 
                        src={wh.image} 
                        alt={wh.name} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-stone-900 border border-stone-800 text-amber-400 font-mono text-[8.5px] uppercase font-bold tracking-widest">
                        Wholesale Cost: ${wh.wholesaleCost.toFixed(2)}
                      </span>
                      <span className="absolute bottom-2 right-2 w-6.5 h-6.5 bg-white text-editorial-charcoal border border-editorial-charcoal/10 flex items-center justify-center text-xs shadow-3xs">
                        {wh.category === "pickle" ? "🥒" : wh.category === "pepper" ? "🌶️" : wh.category === "oil" ? "🫙" : "🧪"}
                      </span>
                    </div>

                    {/* Specimen Description */}
                    <div className="p-4 space-y-2 text-left">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-serif text-[15px] font-bold text-editorial-charcoal italic">{wh.name}</h4>
                        <span className="font-mono text-[9px] text-[#C1121F] bg-[#C1121F]/5 font-bold px-1.5 py-0.5 border border-[#C1121F]/15 shrink-0 uppercase tracking-tight">
                          Spice: {wh.spiceLevel}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#1A1A1A]/70 leading-relaxed font-sans line-clamp-3">
                        {wh.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="bg-[#FAF9F6] p-2 border border-stone-200/60 rounded-none text-left">
                          <span className="text-[7.5px] font-mono text-[#1A1A1A]/40 uppercase tracking-wider block">Farm Supplier</span>
                          <span className="text-[10px] font-mono text-[#1A1A1A]/80 font-bold block truncate">{wh.supplierName}</span>
                        </div>
                        <div className="bg-[#FAF9F6] p-2 border border-stone-200/60 rounded-none text-left">
                          <span className="text-[7.5px] font-mono text-[#1A1A1A]/40 uppercase tracking-wider block">Fulfillment Capacity</span>
                          <span className="text-[10px] font-mono text-[#1A1A1A]/80 font-black text-editorial-green block">{wh.supplyLimit} jars max bulk</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Estimator Bottom bar */}
                  <div className="p-4 border-t border-editorial-charcoal/10 bg-stone-50/70 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 font-bold">Recommended MSRP</span>
                      <span className="font-mono font-bold text-editorial-charcoal">${defaultMSRP.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-700 font-black">Projected Profit Margin</span>
                      <span className="font-mono font-bold text-emerald-700 font-black">+${marginEarned.toFixed(2)} ({marginPercent.toFixed(0)}%)</span>
                    </div>

                    <div className="pt-1.5">
                      {isAdded ? (
                        <div className="w-full text-center py-2 border border-emerald-500/20 bg-emerald-50 text-emerald-800 text-[9.5px] font-mono uppercase font-bold tracking-widest flex items-center justify-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Pushing Live in store</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenConfigurator(wh)}
                          className="w-full py-2 bg-editorial-charcoal text-[#FDFCFA] text-[9.5px] font-mono uppercase tracking-widest font-bold hover:bg-[#C1121F] transition-all rounded-none flex items-center justify-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                          <span>Configure Margins &amp; List</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* SOURCING DETAILS CONFIGURATION SLIDE OVER MODAL */}
          {configuringProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-3xs p-4 animate-in fade-in duration-200">
              <div className="bg-[#FCFCF9] border-2 border-editorial-charcoal p-6 max-w-lg w-full text-left space-y-6 shadow-2xl relative rounded-none animate-in zoom-in-95 duration-150">
                
                <button 
                  onClick={() => setConfiguringProduct(null)}
                  className="absolute top-4 right-4 text-editorial-charcoal/65 hover:text-[#C1121F] hover:bg-[#C1121F]/10 p-1 cursor-pointer transition-colors"
                  title="Close configure pane"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1 block pb-3 border-b border-editorial-charcoal/10">
                  <span className="text-[8.5px] font-mono text-[#C1121F] uppercase font-black tracking-widest block font-bold">
                    CRAFT PRICING MARGIN CALCULATOR
                  </span>
                  <h3 className="font-serif text-xl font-bold italic text-editorial-charcoal">
                    Configure {configuringProduct.name}
                  </h3>
                </div>

                <form onSubmit={handlePublishListing} className="space-y-4 font-sans text-xs">
                  
                  {/* Read only info boxes */}
                  <div className="grid grid-cols-2 gap-3 font-mono text-[10px]">
                    <div className="bg-[#FAF9F6] p-2.5 border border-stone-200">
                      <span className="text-[8px] text-editorial-charcoal/40 block uppercase tracking-wider">Wholesale Cost (Your Invoice)</span>
                      <span className="text-sm font-bold block text-editorial-charcoal">${configuringProduct.wholesaleCost.toFixed(2)}</span>
                    </div>
                    <div className="bg-[#FAF9F6] p-2.5 border border-stone-200">
                      <span className="text-[8px] text-[#C1121F]/60 block uppercase tracking-wider">Recommended MSRP Listing</span>
                      <span className="text-sm font-bold block text-editorial-charcoal">${configuringProduct.suggestedMSRP.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Markup Configuration */}
                  <div>
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">
                      Set Your Storefront Price (USD $)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 font-mono text-xs font-bold text-editorial-charcoal">$</span>
                      <input 
                        type="number" 
                        step="0.01" 
                        min={configuringProduct.wholesaleCost + 1.00}
                        value={markupPrice}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setMarkupPrice(isNaN(val) ? configuringProduct.wholesaleCost + 1.00 : val);
                        }}
                        className="w-full text-xs font-mono font-bold border border-editorial-charcoal/20 pl-7 pr-3 py-2.5 bg-white focus:outline-none focus:border-[#C1121F] rounded-none"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-editorial-charcoal/50 block mt-1 italic font-serif">
                      *Ensure your price accounts for customer value. A healthy profit margin keeps your brine pipelines funded.
                    </span>
                  </div>

                  {/* On-the-fly Math Display */}
                  {markupPrice > configuringProduct.wholesaleCost && (
                    <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-none flex items-center justify-between font-mono text-xs">
                      <div>
                        <span className="text-[8px] text-emerald-700 block uppercase font-bold">YOUR NET PROFIT PER JAR</span>
                        <span className="text-sm font-black text-emerald-800">+${(markupPrice - configuringProduct.wholesaleCost).toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[8px] text-emerald-700 block uppercase font-bold">Markup Return Percentage</span>
                        <span className="text-sm font-black text-emerald-800">
                          {(((markupPrice - configuringProduct.wholesaleCost) / markupPrice) * 100).toFixed(0)}% Profit Margin
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Fields for branding */}
                  <div>
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">
                      Custom Curated Product Listing Name
                    </label>
                    <input 
                      type="text" 
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder={configuringProduct.name}
                      className="w-full text-xs border border-editorial-charcoal/20 p-2.5 bg-white focus:outline-none rounded-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">
                      Branded Storefront Description
                    </label>
                    <textarea 
                      rows={3}
                      value={customDescription}
                      onChange={(e) => setCustomDescription(e.target.value)}
                      placeholder={configuringProduct.description}
                      className="w-full text-xs border border-editorial-charcoal/20 p-2.5 bg-white focus:outline-none rounded-none"
                      required
                    ></textarea>
                  </div>

                  <div className="pt-2 flex gap-3 justify-end font-mono">
                    <button
                      type="button"
                      onClick={() => setConfiguringProduct(null)}
                      className="px-4 py-2 border border-editorial-charcoal/15 text-[#1A1A1A]/70 text-[9.5px] uppercase hover:bg-stone-100 rounded-none cursor-pointer"
                    >
                      Dismiss
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-editorial-charcoal text-[#FDFCFA] text-[9.5px] uppercase font-bold hover:bg-[#C1121F] transition-all rounded-none flex items-center justify-center gap-1.5"
                    >
                      <PlusCircle className="w-3.5 h-3.5 text-amber-500" />
                      <span>Push Specimen live into store</span>
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: CURRENT MERCHANDISED LISTINGS MANAGER */}
      {/* ========================================================= */}
      {activeHubTab === "storefront" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          <div className="bg-white border border-editorial-charcoal/15 p-6 rounded-none text-left">
            <h3 className="font-serif text-lg font-bold text-editorial-charcoal italic border-b border-editorial-charcoal/10 pb-3">
              Active Storefront Dropship Listings ({merchandisedProducts.length})
            </h3>
            
            {merchandisedProducts.length === 0 ? (
              <div className="py-20 text-center text-[#1A1A1A]/50 italic font-serif space-y-4 max-w-md mx-auto">
                <p>No dropshipped listings actively live on your customer storefront. Source high-shelf-life jars from our agricultural suppliers network!</p>
                <button
                  onClick={() => setActiveHubTab("sourcing")}
                  className="px-5 py-2.5 bg-editorial-charcoal text-white font-mono uppercase text-[9px] tracking-widest font-bold"
                >
                  Browse Wholesale Suppliers
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs text-[#1A1A1A]/80 border-collapse">
                  <thead>
                    <tr className="border-b border-editorial-charcoal text-[8.5px] font-mono text-editorial-charcoal/50 uppercase tracking-widest font-extrabold pb-2 bg-stone-50">
                      <th className="p-3">Storefront Display Name &amp; Specimen Detail</th>
                      <th className="p-3">Wholesale Cost</th>
                      <th className="p-3">Your Retail MSRP</th>
                      <th className="p-3">Calculated Net Margin %</th>
                      <th className="p-3">Current Global Stock</th>
                      <th className="p-3 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-editorial-charcoal/10 font-sans">
                    {merchandisedProducts.map((p) => {
                      const wholesale = p.wholesaleCost || 4.50;
                      const retail = p.price;
                      const marginDiff = retail - wholesale;
                      const marginPercent = (marginDiff / retail) * 100;

                      return (
                        <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                          <td className="p-3 font-serif italic text-sm text-editorial-charcoal font-bold flex gap-3 items-center">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-10 h-10 object-cover border border-editorial-charcoal/10 rounded-none shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span>{p.name}</span>
                              <span className="block text-[8px] font-mono uppercase text-editorial-charcoal/40 not-italic">
                                Sourced via: {p.supplierName} • {p.size}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 font-mono font-bold text-editorial-charcoal/60">${wholesale.toFixed(2)}</td>
                          <td className="p-3 font-mono font-black text-[#C1121F]">${retail.toFixed(2)}</td>
                          <td className="p-3 font-mono font-bold text-emerald-800">
                            <span className="bg-emerald-50 border border-emerald-150 px-2 py-0.5 inline-block">
                              +${marginDiff.toFixed(2)} ({marginPercent.toFixed(0)}%)
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-editorial-green">{p.stock} units available</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleRemoveListing(p.id, p.name)}
                              className="px-2.5 py-1.5 border border-red-200 text-[#C1121F] bg-red-50 hover:bg-[#C1121F] hover:text-white transition-all text-[8.5px] font-mono uppercase font-bold tracking-wider rounded-none cursor-pointer inline-flex items-center gap-1"
                              title="Delete listing from Marketplace"
                            >
                              <Trash2 className="w-3 h-3" />
                              Remove Listing
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Prompt to buy */}
          {merchandisedProducts.length > 0 && (
            <div className="bg-editorial-cream border border-editorial-charcoal/15 p-5 flex items-center gap-4 text-editorial-charcoal text-xs rounded-none text-left">
              <span className="text-2xl shrink-0">🛒</span>
              <div>
                <span className="font-mono font-black uppercase text-[9.5px] text-[#C1121F]">READY FOR TRAFFIC SIMULATOR</span>
                <p className="font-sans leading-relaxed text-xs pt-0.5 text-[#1A1A1A]/79">
                  Your custom-priced specimens are now active in the main <strong>Marketplace</strong> tab! Switch to the marketplace or select products to add them to your cart. Complete a test customer order, and you'll see those items appear under the <strong>Fulfillment Queue</strong> tab on this dashboard!
                </p>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DROPSHIP ORDERS & AUTOMATED FULFILLMENT PIPELINE */}
      {/* ========================================================= */}
      {activeHubTab === "orders" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          <div className="bg-white border border-editorial-charcoal/15 p-6 rounded-none text-left">
            <h3 className="font-serif text-lg font-bold text-editorial-charcoal italic border-b border-editorial-charcoal/10 pb-3">
              Dropship Order Fulfillment Desk &amp; Routing
            </h3>
            
            {dropshipCustomerOrders.length === 0 ? (
              <div className="py-20 text-center text-[#1A1A1A]/50 italic font-serif space-y-4 max-w-md mx-auto">
                <p>No customer orders containing dropshipped items have been detected in this sandbox session yet.</p>
                <div className="p-4 bg-stone-50 border border-stone-200 text-left text-xs font-sans not-italic leading-relaxed text-[#1A1A1A]/70">
                  <strong>Testing flow sequence:</strong>
                  <ol className="list-decimal pl-4 mt-2 space-y-1 text-[11px]">
                    <li>Source a product from the directory in the tab above.</li>
                    <li>Toggle to <strong>Marketplace</strong>, select the imported item, add to cart, and checkout.</li>
                    <li>Re-open this <strong>Fulfillment Queue</strong> tab to fulfill the wholesale order!</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs text-[#1A1A1A]/80 border-collapse">
                  <thead>
                    <tr className="border-b border-editorial-charcoal text-[8.5px] font-mono text-editorial-charcoal/50 uppercase tracking-widest font-extrabold pb-2 bg-stone-50">
                      <th className="p-3">Customer Order ID</th>
                      <th className="p-3">Storefront Specimen</th>
                      <th className="p-3">Retail Price Sourced</th>
                      <th className="p-3">Wholesale Due Invoice</th>
                      <th className="p-3">Fulfillment Progress</th>
                      <th className="p-3 text-right">Automated Dispatch Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-editorial-charcoal/10 font-sans">
                    {dropshipCustomerOrders.map((item) => {
                      const key = `${item.order.id}-${item.productId}`;
                      const state = dropshipOrdersState[key] || { status: "unpaid" };
                      const supplierInvoice = (item.dropshipInfo?.wholesaleCost || 4.20) * item.quantity;
                      const customerPaidAmount = item.retailPrice * item.quantity;
                      const netProfit = customerPaidAmount - supplierInvoice;

                      return (
                        <tr key={key} className="hover:bg-stone-50 transition-colors">
                          <td className="p-3 font-mono font-bold">
                            <span className="text-editorial-charcoal block text-[11px]">{item.order.id}</span>
                            <span className="text-[8.5px] text-[#1A1A1A]/40 block uppercase not-italic">
                              {item.order.customerName}
                            </span>
                          </td>
                          <td className="p-3 font-serif italic text-sm text-editorial-charcoal font-bold">
                            <div className="flex items-center gap-2">
                              <img 
                                src={item.image} 
                                alt={item.productName} 
                                className="w-8 h-8 object-cover border border-editorial-charcoal/10" 
                                referrerPolicy="no-referrer"
                              />
                              <div>
                                <span>{item.productName}</span>
                                <span className="block text-[8.5px] font-mono uppercase text-[#1A1A1A]/40 not-italic">
                                  Qty Ordered: {item.quantity} • {item.dropshipInfo?.supplierName || "Artisan Supplier"}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-emerald-850 font-bold">
                            ${customerPaidAmount.toFixed(2)}
                            <span className="block text-[8px] text-[#1A1A1A]/40 font-mono uppercase not-italic">Consumer MSRP Paid</span>
                          </td>
                          <td className="p-3 font-mono text-[#C1121F] font-bold">
                            ${supplierInvoice.toFixed(2)}
                            <span className="block text-[8px] text-[#1A1A1A]/40 font-mono uppercase not-italic">Wholesale Invoice</span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2.5 py-1 text-[8.5px] font-mono font-bold uppercase border ${
                              state.status === "unpaid"
                                ? "bg-amber-50 text-amber-800 border-amber-250 font-bold"
                                : state.status === "processing"
                                ? "bg-blue-50 text-blue-800 border-blue-250"
                                : state.status === "shipped"
                                ? "bg-indigo-50 text-indigo-800 border-indigo-250"
                                : "bg-green-50 text-green-800 border-green-250"
                            }`}>
                              {state.status === "unpaid" && "⏳ Unpaid B2B Invoice"}
                              {state.status === "processing" && "⚙️ Supplier Packing"}
                              {state.status === "shipped" && "🚚 Freight In-Transit"}
                              {state.status === "completed" && "✓ Completed Circular Handover"}
                            </span>
                            
                            {state.trackingNumber && (
                              <span className="block text-[8.5px] font-mono text-editorial-charcoal/45 mt-1 underline select-all">
                                {state.trackingNumber}
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-right space-y-1.5 min-w-[155px]">
                            {state.status === "unpaid" ? (
                              <button
                                onClick={() => setPayingForOrderProduct({
                                  orderId: item.order.id,
                                  product: item.dropshipInfo || {} as Product,
                                  quantity: item.quantity,
                                  wholesaleCost: item.dropshipInfo?.wholesaleCost || 4.20,
                                })}
                                className="px-3 py-2 bg-[#C1121F] text-white text-[8.5px] font-mono uppercase font-black hover:bg-neutral-800 tracking-wider shadow-sm rounded-none cursor-pointer w-full flex items-center justify-center gap-1"
                              >
                                <Coins className="w-3.5 h-3.5" />
                                <span>Pay Supplier ${supplierInvoice.toFixed(2)}</span>
                              </button>
                            ) : state.status === "processing" ? (
                              <div className="space-y-1">
                                <button
                                  onClick={() => accelerateShipment(item.order.id, item.productId)}
                                  className="px-3 py-1.5 bg-blue-600 text-white text-[8px] font-mono uppercase font-bold tracking-tight hover:bg-indigo-700 rounded-none cursor-pointer w-full flex items-center justify-center gap-1"
                                >
                                  <Truck className="w-3 h-3 text-amber-300" />
                                  <span>Simulate Dispatch</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setViewingTrackerOrderId(item.order.id);
                                    setTrackerStep(1);
                                  }}
                                  className="text-[9px] hover:underline font-bold text-editorial-charcoal/60 uppercase block text-center w-full"
                                >
                                  Open Track Map map
                                </button>
                              </div>
                            ) : state.status === "shipped" ? (
                              <div className="space-y-1">
                                <button
                                  onClick={() => accelerateShipment(item.order.id, item.productId)}
                                  className="px-3 py-1.5 bg-emerald-700 text-white text-[8px] font-mono uppercase font-bold tracking-tight hover:bg-emerald-800 rounded-none cursor-pointer w-full flex items-center justify-center gap-1"
                                >
                                  <PackageCheck className="w-3 h-3" />
                                  <span>Confirm Handover</span>
                                </button>
                                <button
                                  onClick={() => {
                                    setViewingTrackerOrderId(item.order.id);
                                    setTrackerStep(3);
                                  }}
                                  className="text-[9px] hover:underline font-bold text-editorial-charcoal/60 uppercase block text-center w-full"
                                >
                                  Open Track Map map
                                </button>
                              </div>
                            ) : (
                              <div className="text-center py-2 text-editorial-green font-mono text-[9px] font-extrabold flex items-center justify-center gap-1 leading-none">
                                <PlusCircle className="w-4 h-4 text-editorial-green fill-green-100" />
                                <span>Cycle Completed (+${netProfit.toFixed(2)})</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SIMULATED ROUTE TRACKING CARD */}
          {viewingTrackerOrderId && (
            <div className="bg-stone-900 text-stone-300 p-6 border-2 border-amber-400 rounded-none text-left relative overflow-hidden animate-in slide-in-from-bottom duration-250">
              <button
                onClick={() => setViewingTrackerOrderId(null)}
                className="absolute top-4 right-4 text-stone-550 hover:text-[#C1121F] hover:bg-white/10 p-1 rounded-none cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[8.5px] font-mono font-bold text-amber-400 block tracking-widest uppercase">
                AUTOMATED B2B ROUTE TELEMETRY SIMULATION
              </span>
              <h4 className="font-serif text-lg font-bold italic text-white mt-1">
                Active Supplier Freight Dispatch Monitor: {viewingTrackerOrderId}
              </h4>
              
              {/* Telemetry Route steps graphics */}
              <div className="mt-8 relative font-sans">
                <div className="absolute top-1/2 left-[5%] right-[5%] h-0.5 bg-stone-800 z-0"></div>
                
                <div className="grid grid-cols-5 relative z-10 text-center font-mono">
                  {[
                    { label: "B2B Payment Settle", desc: "Escrow Secured", icon: "💳" },
                    { label: "Supplier Packing", desc: "Sterile Seals", icon: "🏺" },
                    { label: "Freight Dispatch", desc: "UPS Cargo Truck", icon: "🚚" },
                    { label: "Distribution Center", desc: "Sorting Hubs", icon: "📦" },
                    { label: "Delivered Settle", desc: "Buyer Confirmed", icon: "🏠" },
                  ].map((step, idx) => {
                    const isActive = idx <= trackerStep;
                    const isCurrent = idx === trackerStep;
                    return (
                      <div key={idx} className="space-y-2">
                        <div className={`w-10 h-10 mx-auto rounded-none border flex items-center justify-center text-sm transition-all duration-300 ${
                          isCurrent 
                            ? "bg-amber-400 border-amber-400 text-stone-900 scale-110 shadow-lg"
                            : isActive 
                            ? "bg-stone-800 border-stone-700 text-white" 
                            : "bg-stone-950 border-stone-850 text-stone-600"
                        }`}>
                          <span className={`${isCurrent ? "animate-bounce" : ""}`}>{step.icon}</span>
                        </div>
                        <div className="space-y-0.5">
                          <span className={`text-[9px] block uppercase font-bold font-mono tracking-tight ${isActive ? "text-amber-400" : "text-stone-500"}`}>{step.label}</span>
                          <span className="text-[7.5px] font-mono block text-stone-500">{step.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier Simulation Control */}
              <div className="mt-8 pt-4 border-t border-stone-800 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="text-xs text-stone-400 font-sans">
                  <strong>Carrier Tracking Details</strong>: UPS Custom Cargo lines. Shipped on sterile, insulated isothermal starch cases to maintain raw crisp lactic acids!
                </div>
                <div className="flex gap-2 justify-end font-mono">
                  {trackerStep < 4 ? (
                    <button
                      onClick={() => {
                        // Find matching order - product and trigger carrier movement
                        const matchingItem = dropshipCustomerOrders.find((d) => d.order.id === viewingTrackerOrderId);
                        if (matchingItem) {
                          accelerateShipment(viewingTrackerOrderId, matchingItem.productId);
                        }
                      }}
                      className="px-4 py-2 bg-amber-400 text-stone-900 text-[10px] uppercase font-black hover:bg-white tracking-widest flex items-center gap-1.5 rounded-none"
                    >
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Accelerate Transit Chain</span>
                    </button>
                  ) : (
                    <div className="py-2 px-4 bg-emerald-950/40 border border-emerald-900 text-emerald-450 text-[10px] uppercase font-bold flex items-center gap-1 rounded-none">
                      <Check className="w-3.5 h-3.5" />
                      <span>Courier Handover finalized successfully</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* IN-PORTAL B2B SECURE GATEWAY MODAL */}
          {payingForOrderProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-3xs p-4 animate-in fade-in duration-200">
              <div className="bg-white border-4 border-stone-900 p-6 max-w-md w-full text-left space-y-6 shadow-2xl relative rounded-none animate-in zoom-in-95 duration-150">
                <button
                  onClick={() => setPayingForOrderProduct(null)}
                  className="absolute top-4 right-4 text-editorial-charcoal/65 hover:text-[#C1121F] hover:bg-red-50 p-1 rounded-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-1 block border-b border-editorial-charcoal/10 pb-3 font-sans">
                  <span className="px-2 py-0.5 text-[8px] bg-stone-900 text-[#FAF9F6] font-mono uppercase font-bold tracking-widest leading-none">
                    SECURE B2B ESCROW PAYWAY
                  </span>
                  <h3 className="font-serif text-xl font-bold italic text-editorial-charcoal mt-1">
                    Route Wholesale Settlement
                  </h3>
                </div>

                <div className="space-y-4 font-sans text-xs">
                  {/* Invoice card */}
                  <div className="bg-[#FAF9F6] border border-stone-200 p-3 rounded-none space-y-2">
                    <div className="flex justify-between font-mono text-[9px] uppercase text-[#1A1A1A]/40 font-bold">
                      <span>SUPPLIER crop INV#</span>
                      <span>{payingForOrderProduct.orderId}</span>
                    </div>
                    <div className="flex justify-between italic font-serif">
                      <span>
                        {payingForOrderProduct.product.name} (x{payingForOrderProduct.quantity})
                      </span>
                      <span className="font-sans font-black text-editorial-charcoal">
                        ${(payingForOrderProduct.wholesaleCost * payingForOrderProduct.quantity).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[10px] text-editorial-charcoal/50 leading-relaxed font-sans pt-1">
                      Destined Supplier: <strong>{payingForOrderProduct.product.supplierName || "Brining Partner"}</strong>
                    </p>
                  </div>

                  <form onSubmit={handleWholesaleB2BPayment} className="space-y-4 font-sans text-xs">
                    <div>
                      <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">
                        Corporate Merchant Card Number
                      </label>
                      <input
                        type="text"
                        value={ccNumber}
                        onChange={(e) => setCcNumber(e.target.value)}
                        className="w-full text-xs font-mono border border-editorial-charcoal/20 p-2.5 focus:outline-none bg-white rounded-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="09/28"
                          className="w-full text-xs font-mono border border-editorial-charcoal/20 p-2.5 focus:outline-none bg-white rounded-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">
                          Escrow CV2
                        </label>
                        <input
                          type="password"
                          placeholder="●●●"
                          className="w-full text-xs font-mono border border-editorial-charcoal/20 p-2.5 focus:outline-none bg-white rounded-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3 justify-end font-mono">
                      <button
                        type="button"
                        onClick={() => setPayingForOrderProduct(null)}
                        className="px-4 py-2 border border-stone-200 text-[#1A1A1A]/70 text-[9px] uppercase hover:bg-stone-50 rounded-none cursor-pointer"
                      >
                        Abort
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessingB2B}
                        className="px-5 py-2.5 bg-stone-900 hover:bg-emerald-850 text-white font-black text-[9.5px] uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-1.5"
                      >
                        {isProcessingB2B ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-300" />
                            <span>Routing wire...</span>
                          </>
                        ) : (
                          <>
                            <Coins className="w-3.5 h-3.5 text-amber-400" />
                            <span>Authorize Routing Payment</span>
                          </>
                        )}
                      </button>
                    </div>

                  </form>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 5: DROPSHIP ACADEMY GLOSSARY */}
      {/* ========================================================= */}
      {activeHubTab === "academy" && (
        <div className="space-y-6 animate-in fade-in duration-200 text-left">
          
          <div className="bg-white border border-editorial-charcoal/15 p-6 rounded-none space-y-6">
            <div className="border-b border-editorial-charcoal/10 pb-4">
              <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#C1121F] font-black">
                BRINE NETWORK COMMERCIAL LIBRARY
              </span>
              <h3 className="font-serif text-2xl font-bold italic text-editorial-charcoal mt-1">
                The Dropshipper's Glossary
              </h3>
              <p className="text-xs text-[#1A1A1A]/72 leading-relaxed font-sans pt-1">
                Brush up on essential ecommerce vocabulary and supply-chain logistics. Understanding these keys differentiates amateur resellers from high-growth pickling magnates!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="p-4 bg-stone-50 border border-stone-200 rounded-none space-y-1">
                <span className="text-xs uppercase font-mono font-black text-[#C1121F]">Wholesale Sourcing Cost</span>
                <p className="text-xs leading-relaxed text-[#1A1A1A]/75 font-sans pt-1">
                  The discounted unit cost of goods defined by the primary farm supplier (e.g., $3.50). You purchase items at this price only after a real consumer pays you the higher retail price.
                </p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-none space-y-1">
                <span className="text-xs uppercase font-mono font-black text-editorial-charcoal">Suggested MSRP Markup</span>
                <p className="text-xs leading-relaxed text-[#1A1A1A]/75 font-sans pt-1">
                  Manufacturer Suggested Retail Price. Represents the optimal consumer pricing threshold designed to protect brand reputation while granting lucrative margins.
                </p>
              </div>

              <div className="p-4 bg-[#FDFCFA] border border-stone-200 rounded-none space-y-1">
                <span className="text-xs uppercase font-mono font-black text-emerald-800">Net Retained Margin</span>
                <p className="text-xs leading-relaxed text-[#1A1A1A]/75 font-sans pt-1">
                  The retained dollar surplus calculated as are cumulative gross customer retail revenues minus supplier invoices. Also known as gross trade arbitrage.
                </p>
              </div>

              <div className="p-4 bg-[#FDFCFA] border border-stone-200 rounded-none space-y-1">
                <span className="text-xs uppercase font-mono font-black text-editorial-green">FOB Origin Shipping</span>
                <p className="text-xs leading-relaxed text-[#1A1A1A]/75 font-sans pt-1">
                  Free On Board shipping. Signifies that title of owner shifts from supply greenhouses to the commercial cargo truck immediately upon loading and dispatching at the packing dock.
                </p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-none space-y-1">
                <span className="text-xs uppercase font-mono font-black text-editorial-charcoal">Fulfillment Latency</span>
                <p className="text-xs leading-relaxed text-[#1A1A1A]/75 font-sans pt-1">
                  The staged delay time from customer purchase until supplier cargo pickup. Brining lines feature custom 1-3 days fermentation buffers to inspect seal pressure.
                </p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 rounded-none space-y-1">
                <span className="text-xs uppercase font-mono font-black text-[#C1121F]">Lacto-Enzymes Reserve</span>
                <p className="text-xs leading-relaxed text-[#1A1A1A]/75 font-sans pt-1">
                  The active raw probiotic microorganisms in storage. Keeping supply counts synchronized is highly critical to avoid overselling unfermented fluid jars.
                </p>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
