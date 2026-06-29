import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Product, Recipe } from "../types";
import { Search, Filter, Flame, Star, ShoppingCart, Info, Check, ArrowRight, X, Sparkles, MessageSquare, AlertCircle, Heart } from "lucide-react";

interface MarketplaceProps {
  onSelectRecipe: (recipeId: string) => void;
  onSetTab: (tab: string) => void;
  searchTerm?: string;
  categoryFilter?: "pickle" | "pepper" | "all";
  onOpenCart?: () => void;
  selectedProductId?: string | null;
  onClearSelectedProduct?: () => void;
}

export default function PicklePepperMarketplace({ 
  onSelectRecipe, 
  onSetTab, 
  categoryFilter = "all", 
  onOpenCart,
  selectedProductId,
  onClearSelectedProduct
}: MarketplaceProps) {
  const { products, recipes, reviews, addReview, addToCart, wishlist, toggleWishlist, headerSearchQuery, setHeaderSearchQuery, addToast } = useApp();

  // B2B Aladdin Alibaba mode states
  const [sourcingMode, setSourcingMode] = useState<"retail" | "wholesale" | "rfq">("retail");

  // Selection state for current wholesale configuring product
  const [wholesaleConfigProduct, setWholesaleConfigProduct] = useState<Product | null>(null);
  const [wholesaleQty, setWholesaleQty] = useState<number>(2); // MOQ default
  const [privateLabel, setPrivateLabel] = useState<boolean>(false);
  const [privateLabelText, setPrivateLabelText] = useState<string>("");
  const [waxSealColor, setWaxSealColor] = useState<string>("gold");

  // RFQ Sourcing States
  const [rfqs, setRfqs] = useState<Array<{
    id: string;
    title: string;
    description: string;
    quantity: number;
    unit: string;
    category: string;
    date: string;
    buyer: string;
    status: "active" | "review" | "awarded";
    bids: Array<{
      id: string;
      sellerName: string;
      pricePerUnit: number;
      deliveryDays: number;
      description: string;
      rating: number;
    }>;
  }>>([
    {
      id: "rfq-101",
      title: "Need 25 Barrels of Organic Traditional Salt-Brined Whole Dill Pickles",
      description: "Looking for traditional lacto-fermented kosher dill pickles in heavy water barrel structures. No added yellow dyes or chemical stabilizers. Must have certification tags.",
      quantity: 25,
      unit: "Barrels (50 Gal)",
      category: "pickle",
      date: "2026-06-12",
      buyer: "Cascadia Sourcing Corp.",
      status: "active",
      bids: [
        {
          id: "bid-101a",
          sellerName: "Grateful Brines",
          pricePerUnit: 185.00,
          deliveryDays: 14,
          description: "We can fulfill 25 premium oak-cured stoneware barrels doused in cascade spring runoff dill brines. Organic certified.",
          rating: 4.8
        },
        {
          id: "bid-101b",
          sellerName: "Smokehouse Pickling Co.",
          pricePerUnit: 172.50,
          deliveryDays: 18,
          description: "Our hickory-brined variant offers incredible depth of color and bite. Shipped stabilized in high grade aseptic food drums.",
          rating: 4.9
        }
      ]
    },
    {
      id: "rfq-102",
      title: "Custom Branded Smoky Serrano Candied Chips in 8oz Custom Jars",
      description: "Sourcing partner for monthly gourmet subscription boxes. We need custom printed labels on sweet serranos. Initially 200 cases of 12 jars.",
      quantity: 200,
      unit: "Cases (12 Jars)",
      category: "pepper",
      date: "2026-06-14",
      buyer: "BiteCraft Subscription Co.",
      status: "active",
      bids: [
        {
          id: "bid-102a",
          sellerName: "Sweet Sting Kitchens",
          pricePerUnit: 88.00,
          deliveryDays: 10,
          description: "We specialize in serrano cane work. Our equipment outputs custom labels effortlessly. Trade assurance included.",
          rating: 4.5
        }
      ]
    }
  ]);

  // Form states to create custom RFQ
  const [newRfqTitle, setNewRfqTitle] = useState("");
  const [newRfqDesc, setNewRfqDesc] = useState("");
  const [newRfqQuantity, setNewRfqQuantity] = useState<number>(10);
  const [newRfqUnit, setNewRfqUnit] = useState("Cases (12 Jars)");
  const [newRfqCategory, setNewRfqCategory] = useState("pickle");

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRfqTitle.trim() || !newRfqDesc.trim()) {
      addToast({
        title: "RFQ Invalid",
        message: "Please specify valid contract criteria, volume metrics, and description specifications.",
        type: "error"
      });
      return;
    }

    const rfqId = `rfq-${Date.now().toString().slice(-4)}`;
    
    // Create new RFQ
    const newRfqEntry = {
      id: rfqId,
      title: newRfqTitle,
      description: newRfqDesc,
      quantity: Number(newRfqQuantity),
      unit: newRfqUnit,
      category: newRfqCategory,
      date: new Date().toISOString().split("T")[0],
      buyer: "My Sourcing Office (Self)",
      status: "active" as const,
      bids: [] as any[]
    };

    setRfqs(prev => [newRfqEntry, ...prev]);
    
    // Clear inputs
    setNewRfqTitle("");
    setNewRfqDesc("");
    setNewRfqQuantity(10);
    
    addToast({
      title: "B2B Contract Posted",
      message: `Your trade RFQ specification [${rfqId}] is now broadcast to all accredited farmers of the network. Competitors have been alerted!`,
      type: "success"
    });

    // Simulated Farmer Bidding in exactly 1.5 seconds!
    setTimeout(() => {
      setRfqs(currentRfqs => {
        return currentRfqs.map(rfq => {
          if (rfq.id === rfqId) {
            // Add a mock response bid
            return {
              ...rfq,
              bids: [
                {
                  id: `bid-sim-1`,
                  sellerName: "Chili Head Farms",
                  pricePerUnit: 79.50,
                  deliveryDays: 7,
                  description: "Automatic Bid: We can supply top grade high crunch pickles at custom sizes. Custom label embossing included at zero extra cost.",
                  rating: 4.7
                },
                {
                  id: `bid-sim-2`,
                  sellerName: "Smokehouse Pickling Co.",
                  pricePerUnit: 74.00,
                  deliveryDays: 12,
                  description: "Competitor Bid: Match and beat proposal with direct barrel logistics and 30-day security escrow trade protection.",
                  rating: 4.9
                }
              ]
            };
          }
          return rfq;
        });
      });

      addToast({
        title: "Competitive Proposals Received!",
        message: `Two accredited farmers submitted proposals to your RFQ: [${newRfqTitle.substring(0, 30)}...] Inspect live quotes now!`,
        type: "info"
      });
    }, 1500);
  };

  const handleAddWholesaleToBasket = (product: Product, qtyCases: number, pricePerCase: number, labelText: string, sealColor: string) => {
    const totalVolume = qtyCases * 12; // 12 jars per case
    const customWholesaleProduct: Product = {
      ...product,
      id: `wholesale-${product.id}-${Date.now()}`,
      name: `📦 [B2B Wholesale Case-Lot] ${product.name} (Qty: ${qtyCases} Cases / ${totalVolume} Jars)`,
      description: `Wholesale contract pack with custom specifications. Engraved Label Text: "${labelText || 'No Custom branding requested (Farm Standard Tag)'}". Custom Wax Seal closure: ${sealColor.toUpperCase() || 'GOLD'}`,
      price: pricePerCase, // per case
      stock: 99999, // unlimited availability for wholesale crop
      size: `${qtyCases} Custom Cases (12x Jars)`,
      sellerName: `${product.sellerName} [Direct B2B Sourcing]`
    };

    addToCart(customWholesaleProduct, qtyCases);
    setWholesaleConfigProduct(null);
    onOpenCart?.();
    addToast({
      title: "B2B Contract Placed",
      message: `Successfully loaded ${qtyCases} customized wholesale cases of ${product.name} into your active procure drawer.`,
      type: "success"
    });
  };

  const handleAcceptBid = (rfqTitle: string, bidSeller: string, pricePerUnit: number, qty: number, unitName: string) => {
    const customContractProduct: Product = {
      id: `contract-${Date.now()}`,
      name: `📋 [Awarded RFQ Contract] Sourced from ${bidSeller}`,
      description: `Fulfilled specification: "${rfqTitle}". Volume: ${qty} ${unitName} at negotiated rate of $${pricePerUnit.toFixed(2)} per unit. Direct farm dispatch logistics selected.`,
      price: pricePerUnit * qty, // bundle price
      stock: 99999,
      category: "pickle",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=800", // generic nice jar
      spiceLevel: "Medium",
      rating: 5,
      reviewsCount: 0,
      ingredients: ["Negotiated Sourced Raw Crop Elements", "Artisan Saline Escrow Seal"],
      sellerName: bidSeller,
      tags: ["RFQ Contract Sourced", "Trade Assurance", "Direct Air Shipping"]
    };

    addToCart(customContractProduct, 1);
    
    // Update RFQ status to awarded
    setRfqs(prev => prev.map(r => r.title === rfqTitle ? { ...r, status: "awarded" as const } : r));

    onOpenCart?.();
    addToast({
      title: "Contract Awarded!",
      message: `Drafted B2B binding contract with ${bidSeller} and queued to your shopping drawer for checkout. Trade protection active.`,
      type: "success"
    });
  };

  // Filters State (Synchronized with Header)
  const search = headerSearchQuery;
  const setSearch = setHeaderSearchQuery;
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSpice, setSelectedSpice] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("default");
  const [showOnlyWishlist, setShowOnlyWishlist] = useState(false);

  // Price range preset and custom slider range states
  const [pricePreset, setPricePreset] = useState<string>("all");
  const [customMaxPrice, setCustomMaxPrice] = useState<number>(30);

  const maxPriceOfAllProducts = useMemo(() => {
    if (!products || products.length === 0) return 30;
    const max = Math.max(...products.map((p) => p.price));
    return Math.ceil(max);
  }, [products]);

  // Sync customMaxPrice with calculated max product price initially
  React.useEffect(() => {
    if (maxPriceOfAllProducts > 0) {
      setCustomMaxPrice(maxPriceOfAllProducts);
    }
  }, [maxPriceOfAllProducts]);

  // Product Selection Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [nutritionProduct, setNutritionProduct] = useState<Product | null>(null);
  
  // Tab within Product Details Modal
  const [modalTab, setModalTab] = useState<"details" | "ingredients" | "reviews" | "recipes">("details");
  
  // Custom Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Compare products state
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Simulated premium data fetching loading state
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // short premium feel transition delay
    return () => clearTimeout(timer);
  }, [
    selectedCategory,
    selectedSpice,
    selectedSort,
    showOnlyWishlist,
    pricePreset,
    customMaxPrice,
    search
  ]);

  const toggleCompareSet = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 4) {
        return prev; // Limit to 4 for clean comparative presentation columns
      }
      return [...prev, productId];
    });
  };

  // Synchronize category selection if prop is toggled by Hero click
  React.useEffect(() => {
    if (categoryFilter !== "all") {
      setSelectedCategory(categoryFilter);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryFilter]);

  // Synchronize deep-linked selected product ID from global search
  React.useEffect(() => {
    if (selectedProductId) {
      const found = products.find((p) => p.id === selectedProductId);
      if (found) {
        setSelectedProduct(found);
        setModalTab("details");
        if (onClearSelectedProduct) {
          onClearSelectedProduct();
        }
      }
    }
  }, [selectedProductId, products, onClearSelectedProduct]);

  // Spice level colors
  const getSpiceColor = (spice: Product["spiceLevel"]) => {
    switch (spice) {
      case "None":
        return "text-editorial-charcoal border-editorial-charcoal/20 bg-editorial-gray";
      case "Mild":
        return "text-[#5C7F12] border-[#5C7F12]/30 bg-[#5C7F12]/5";
      case "Medium":
        return "text-[#D35400] border-[#D35400]/30 bg-[#D35400]/5";
      case "Hot":
        return "text-editorial-red border-editorial-red/30 bg-editorial-red/5";
      case "Extreme":
        return "text-white border-editorial-red bg-editorial-red animate-pulse";
      default:
        return "text-editorial-charcoal border-editorial-charcoal/20 bg-editorial-gray";
    }
  };

  const getSpiceFlame = (spice: Product["spiceLevel"]) => {
    switch (spice) {
      case "None":
        return "🌿 Sweet";
      case "Mild":
        return "🔥 Mild Heat";
      case "Medium":
        return "🔥🔥 Medium Kick";
      case "Hot":
        return "🔥🔥🔥 High Heat";
      case "Extreme":
        return "💥💥💥💥 ACTION RED";
      default:
        return "";
    }
  };

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const query = search.trim().toLowerCase();
        const matchesSearch = !query ||
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          (p.ingredients || []).some((ing) => ing.toLowerCase().includes(query)) ||
          p.description.toLowerCase().includes(query) ||
          p.sellerName.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query));

        const matchesCategory =
          selectedCategory === "all" || p.category === selectedCategory;

        const matchesSpice =
          selectedSpice === "all" || p.spiceLevel === selectedSpice;

        const matchesWishlist = !showOnlyWishlist || wishlist.includes(p.id);

        const matchesPrice = () => {
          if (pricePreset === "all") return true;
          if (pricePreset === "under-10") return p.price < 10;
          if (pricePreset === "10-15") return p.price >= 10 && p.price <= 15;
          if (pricePreset === "above-15") return p.price > 15;
          if (pricePreset === "custom") return p.price <= customMaxPrice;
          return true;
        };

        return matchesSearch && matchesCategory && matchesSpice && matchesWishlist && matchesPrice();
      })
      .sort((a, b) => {
        if (selectedSort === "price-asc") return a.price - b.price;
        if (selectedSort === "price-desc") return b.price - a.price;
        if (selectedSort === "rating") return b.rating - a.rating;
        if (selectedSort === "spice") {
          const spiceRanks: Record<string, number> = { Extreme: 4, Hot: 3, Medium: 2, Mild: 1, None: 0 };
          return spiceRanks[b.spiceLevel] - spiceRanks[a.spiceLevel];
        }
        if (selectedSort === "newest") {
          const idA = parseInt(a.id.replace("prod-", "")) || 0;
          const idB = parseInt(b.id.replace("prod-", "")) || 0;
          return idB - idA;
        }
        return 0; // default order
      });
  }, [products, search, selectedCategory, selectedSpice, selectedSort, showOnlyWishlist, wishlist, pricePreset, customMaxPrice]);

  // Product reviews
  const currentProductReviews = useMemo(() => {
    if (!selectedProduct) return [];
    return reviews.filter((r) => r.productId === selectedProduct.id);
  }, [reviews, selectedProduct]);

  // Product related recipes
  const currentProductRecipes = useMemo(() => {
    if (!selectedProduct) return [];
    return recipes.filter((r) => r.relatedProductIds.includes(selectedProduct.id) && r.approved);
  }, [recipes, selectedProduct]);

  // Handle submitting reviews
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    
    addReview(selectedProduct.id, reviewName, reviewRating, reviewComment);
    
    // Clear and state success
    setReviewName("");
    setReviewRating(5);
    setReviewComment("");
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pb-20 animate-in fade-in duration-300" id="marketplace-zone">
      
      {/* 🇨🇳 ALIBABA / GLOBAL CONTRACT SOURCING PLATFORM BAR */}
      <div className="bg-[#111111] border border-neutral-800 text-stone-100 p-5 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm rounded-none">
        <div className="flex items-center gap-4 text-left">
          <span className="bg-[#FF6600] text-white text-[10px] font-mono font-black uppercase tracking-widest px-3 py-1.5 rounded-none shadow-xs">
            ALISOURCE B2B
          </span>
          <div>
            <h2 className="font-serif text-lg font-bold text-[#FAF9F6] italic tracking-tight">Global Contract Pickling &amp; Pepper Sourcing</h2>
            <p className="text-[10px] text-stone-400 font-sans mt-0.5">Artisanal farm-direct wholesale pipelines, custom wax-capped private labeling, and secure trade assurance logistics.</p>
          </div>
        </div>
        
        {/* Sourcing Tabs select toggles */}
        <div className="flex bg-neutral-900 border border-neutral-800/80 p-1 font-mono text-[11px] w-full md:w-auto overflow-x-auto">
          {[
            { id: "retail", label: "🛒 B2C Individual Jars", desc: "Single Specs" },
            { id: "wholesale", label: "📦 B2B Bulk Case-Lots", desc: "Direct MOQ Contract" },
            { id: "rfq", label: "📋 RFQ Sourcing Deck", desc: "Get Supplier Bids" },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => {
                setSourcingMode(mode.id as any);
                addToast({
                  title: `Switched to ${mode.label}`,
                  message: `Welcome to our professional trade dynamic channel for ${mode.desc}.`,
                  type: "info"
                });
              }}
              className={`px-4 py-2 font-bold transition-all text-center rounded-none shrink-0 whitespace-nowrap cursor-pointer ${
                sourcingMode === mode.id 
                  ? "bg-[#FF6600] text-black" 
                  : "text-stone-300 hover:text-white hover:bg-neutral-800"
              }`}
            >
              <span className="block font-black">{mode.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filters Hub */}
      <div className="bg-white rounded-none p-6 md:p-8 border border-editorial-charcoal/15 space-y-6 mb-8 text-left">
        <div className="flex flex-col md:flex-row gap-4">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-charcoal/50" />
            <input
              type="text"
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search premium dills, sweet cell walls, ghost flakes..."
              className="w-full pl-11 pr-12 py-3 border border-editorial-charcoal/20 text-xs uppercase tracking-widest bg-editorial-gray/50 font-mono focus:outline-none focus:border-editorial-charcoal/60 rounded-none transition-all placeholder:text-editorial-charcoal/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-editorial-charcoal/60 hover:text-editorial-charcoal text-[10px] font-mono uppercase tracking-widest font-bold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Sorter Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#1A1A1A]/40 whitespace-nowrap hidden sm:inline">Sort Order:</span>
            <select
              id="sort-select"
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="px-4 py-3 border border-editorial-charcoal/20 text-xs font-mono uppercase tracking-widest bg-white text-editorial-charcoal focus:outline-none focus:border-editorial-charcoal rounded-none"
            >
              <option value="default">Default Harvests</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="spice">Most Spicy 🌶️</option>
              <option value="newest">Newest Arrivals ✨</option>
            </select>
          </div>
        </div>

        {/* Categories + Spices Filters Row */}
        <div className="flex flex-col xl:flex-row gap-6 justify-between pt-6 border-t border-editorial-charcoal/10">
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono font-bold text-editorial-charcoal/40 tracking-wider uppercase mr-2">Category:</span>
            {[
              { id: "all", label: "All Items", icon: "📦" },
              { id: "pickle", label: "Pickles", icon: "🥒" },
              { id: "pepper", label: "Peppers", icon: "🌶️" },
              { id: "oil", label: "Oils / Crisps", icon: "🫙" },
              { id: "starter", label: "Starters", icon: "🧪" },
            ].map((cat) => (
              <button
                key={cat.id}
                id={`cat-filter-${cat.id}`}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 transition-all text-xs uppercase tracking-widest font-bold border rounded-none ${
                  selectedCategory === cat.id
                    ? "bg-editorial-charcoal text-editorial-cream border-editorial-charcoal"
                    : "bg-white text-editorial-charcoal/60 border-editorial-charcoal/10 hover:border-editorial-charcoal"
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}

            {/* Wishlist Button alongside categories */}
            <button
              id="wishlist-toggle-filter"
              onClick={() => setShowOnlyWishlist(!showOnlyWishlist)}
              className={`px-4 py-2 transition-all text-xs uppercase tracking-widest font-bold border rounded-none flex items-center gap-1.5 ${
                showOnlyWishlist
                  ? "bg-[#C1121F] text-white border-[#C1121F] shadow-sm"
                  : "bg-white text-editorial-charcoal/60 border-editorial-charcoal/10 hover:border-[#C1121F]/50 hover:text-[#C1121F]"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showOnlyWishlist ? "fill-white text-white font-black" : "text-[#C1121F]"}`} />
              <span>Saved ({wishlist.length})</span>
            </button>
          </div>

          {/* Spice level filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-mono font-bold text-editorial-charcoal/40 tracking-wider uppercase mr-2">Heat:</span>
            {[
              { id: "all", label: "All Heats" },
              { id: "None", label: "Pure Sweet" },
              { id: "Mild", label: "Mild" },
              { id: "Medium", label: "Medium 🔥" },
              { id: "Hot", label: "Hot 🔥🔥" },
              { id: "Extreme", label: "Extreme 💥" },
            ].map((spice) => (
              <button
                key={spice.id}
                id={`spice-filter-${spice.id}`}
                onClick={() => setSelectedSpice(spice.id)}
                className={`px-3 py-2 transition-all text-[11px] font-bold border rounded-none font-mono tracking-wider ${
                  selectedSpice === spice.id
                    ? "bg-editorial-red text-white border-editorial-red"
                    : "bg-white text-editorial-charcoal/60 border-editorial-charcoal/10 hover:border-editorial-charcoal"
                }`}
              >
                <span>{spice.label}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Price Range Filter Row */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between pt-6 border-t border-editorial-charcoal/10" id="price-range-filter-container">
          {/* Label + Dropdown Select */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full lg:w-auto">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold text-editorial-charcoal/40 tracking-wider uppercase block">Price Range:</span>
              <p className="text-[11px] text-editorial-charcoal/60 font-sans hidden sm:block">Filter gourmet jars by valuation threshold</p>
            </div>
            
            <select
              id="price-preset-dropdown"
              value={pricePreset}
              onChange={(e) => {
                const val = e.target.value;
                setPricePreset(val);
                if (val === "under-10") {
                  setCustomMaxPrice(10);
                } else if (val === "10-15") {
                  setCustomMaxPrice(15);
                } else if (val === "all") {
                  setCustomMaxPrice(maxPriceOfAllProducts || 30);
                }
              }}
              className="px-4 py-2.5 border border-editorial-charcoal/20 text-xs font-mono uppercase tracking-widest bg-white text-editorial-charcoal focus:outline-none focus:border-editorial-charcoal rounded-none w-full sm:w-64 cursor-pointer"
            >
              <option value="all">Uncapped (Show All Prices)</option>
              <option value="under-10">Under $10.00</option>
              <option value="10-15">$10.00 to $15.00</option>
              <option value="above-15">Premium Tier (Over $15.00)</option>
              <option value="custom">Tactile Slider Range (Custom)</option>
            </select>
          </div>

          {/* Slider Controls with active highlight feedback */}
          <div className="w-full lg:flex-1 max-w-xl flex flex-col sm:flex-row sm:items-center gap-4 bg-[#FAF9F6] border border-editorial-charcoal/10 p-3.5">
            <div className="flex items-center justify-between sm:justify-start gap-3 shrink-0">
              <span className="text-[10px] font-mono font-bold text-editorial-charcoal/40 tracking-wider uppercase">Max Price Cap:</span>
              <span className="bg-[#1A1A1A] text-white font-mono text-xs font-black px-3 py-1.5 rounded-none min-w-[70px] text-center">
                ${customMaxPrice.toFixed(2)}
              </span>
            </div>
            
            <div className="flex-grow flex items-center gap-3">
              <span className="text-[10px] font-mono text-stone-400 font-bold">$1.00</span>
              <input
                type="range"
                id="price-range-slider"
                min="1"
                max={Math.max(30, maxPriceOfAllProducts)}
                step="0.5"
                value={customMaxPrice}
                onChange={(e) => {
                  setCustomMaxPrice(parseFloat(e.target.value));
                  setPricePreset("custom"); // Automatically switch to dynamic custom mode
                }}
                className="flex-grow accent-[#C1121F] bg-stone-200 h-1 cursor-pointer appearance-none rounded-none outline-none"
                aria-label="Filter maximum product price"
              />
              <span className="text-[10px] font-mono text-stone-400 font-bold">${Math.max(30, maxPriceOfAllProducts).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid count summary line */}
      <div className="flex justify-between items-center mb-6 px-1">
        <span className="text-xs uppercase font-mono tracking-widest text-editorial-charcoal/50">
          Showing <span className="text-editorial-charcoal font-black">{filteredProducts.length}</span> signature batches
        </span>
        
        {/* Reset filters helper link */}
        {(search || selectedCategory !== "all" || selectedSpice !== "all" || showOnlyWishlist || pricePreset !== "all") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
              setSelectedSpice("all");
              setShowOnlyWishlist(false);
              setPricePreset("all");
              setCustomMaxPrice(maxPriceOfAllProducts || 30);
            }}
            className="text-xs uppercase font-mono tracking-widest text-[#C1121F] hover:underline font-bold"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Products Grid & B2B RFQ Channel switcher */}
      {sourcingMode === "rfq" ? (
        <div id="rfq-sourcing-portal" className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          
          {/* Broad RFQ Posting Form - 5 Columns */}
          <div className="lg:col-span-5 space-y-6">
            <form onSubmit={handleCreateRfq} className="bg-white border border-editorial-charcoal/15 p-6 space-y-5 text-left shadow-2xs">
              <div className="border-b border-editorial-charcoal/10 pb-3 flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-[#111111] italic flex items-center gap-1.5">
                  📋 Publish Wholesale RFQ Spec
                </h3>
              </div>
              <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                Publish a Request for Quote (RFQ) to broadcast your custom pickling, brining, or specialty pepper specifications to our entire verified farmer network. Competitive bids of member farms appear below in seconds.
              </p>

              <div className="space-y-4 text-xs">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1A1A1A]/50 block">Target Product Spec/Title</label>
                  <input
                    type="text"
                    required
                    value={newRfqTitle}
                    onChange={(e) => setNewRfqTitle(e.target.value)}
                    className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2.5 text-xs focus:bg-white focus:outline-none rounded-none"
                    placeholder="e.g. 50 Barrels of Low-Sodium Organic Kosher Dills"
                  />
                </div>

                {/* Sourcing Category & Volume */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1A1A1A]/50 block">Spec Category</label>
                    <select
                      value={newRfqCategory}
                      onChange={(e) => setNewRfqCategory(e.target.value)}
                      className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2 text-xs font-mono rounded-none"
                    >
                      <option value="pickle">Pickle Curing</option>
                      <option value="pepper">Hot Pepper Drops</option>
                      <option value="oil">Oils &amp; Starters</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1A1A1A]/50 block">Volume Unit</label>
                    <select
                      value={newRfqUnit}
                      onChange={(e) => setNewRfqUnit(e.target.value)}
                      className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2 text-xs font-mono rounded-none"
                    >
                      <option value="Cases (12 Jars)">Cases (12 Jars)</option>
                      <option value="Barrels (50 Gal)">Barrels (50 Gal)</option>
                      <option value="Gallon Drums">Gallon Drums</option>
                      <option value="Bulk Lbs">Bulk Lbs</option>
                    </select>
                  </div>
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1A1A1A]/50 block">Quantity Target (MOQ 10 Units)</label>
                  <input
                    type="number"
                    min="10"
                    required
                    value={newRfqQuantity}
                    onChange={(e) => setNewRfqQuantity(Number(e.target.value))}
                    className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2.5 text-xs font-mono focus:bg-white focus:outline-none rounded-none"
                  />
                </div>

                {/* Detailed Specifications */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1A1A1A]/50 block">Detailed Quality Spec Criteria</label>
                  <textarea
                    required
                    rows={4}
                    value={newRfqDesc}
                    onChange={(e) => setNewRfqDesc(e.target.value)}
                    className="w-full border border-editorial-charcoal/20 bg-stone-50/50 p-2.5 text-xs focus:bg-white focus:outline-none leading-relaxed font-sans rounded-none"
                    placeholder="Describe detailed specifications. e.g. Requires organic garlic cloves, oak-wood barrels curing for 30 days minimum, and 2.5% saline target for trade verification tags..."
                  />
                </div>

                {/* Submit RFQ */}
                <button
                  type="submit"
                  className="w-full py-3 bg-[#FF6600] text-black font-mono tracking-widest font-black uppercase text-center cursor-pointer hover:bg-black hover:text-[#FAF9F6] transition-all rounded-none shadow-3xs"
                >
                  Post To Sourcing Registries 🚀
                </button>
              </div>
            </form>
          </div>

          {/* Active Broadcasts List - 7 Columns */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="bg-white border border-editorial-charcoal/15 p-6 shadow-2xs space-y-4 rounded-none">
              <div className="pb-3 border-b border-editorial-charcoal/10 flex justify-between items-center">
                <h3 className="font-serif text-base font-bold text-editorial-charcoal italic">
                  Live Sourcing Registry Feed ({rfqs.length} Active)
                </h3>
                <span className="text-[10px] font-mono text-stone-400">Escrow Protected Trade Routing</span>
              </div>

              <div className="space-y-5">
                {rfqs.map((rfq) => (
                  <div key={rfq.id} className="border border-stone-150 p-5 space-y-4 hover:border-[#FF6600]/45 transition-all bg-stone-50/25 rounded-none animate-in fade-in duration-200">
                    <div className="flex justify-between items-start gap-3 flex-wrap sm:flex-nowrap">
                      <div>
                        <span className="text-[8px] font-mono bg-neutral-900 text-[#FF6600] font-extrabold px-1.5 py-0.5 uppercase tracking-widest mr-2 inline-block">
                          RFQ SPEC {rfq.id}
                        </span>
                        <span className="text-[9px] font-mono text-stone-400">{rfq.date} • Buyer: {rfq.buyer}</span>
                        <h4 className="font-serif text-md font-bold text-editorial-charcoal mt-2 italic leading-tight">
                          {rfq.title}
                        </h4>
                      </div>
                      <span className={`text-[8px] font-mono uppercase tracking-wider font-extrabold px-2.5 py-1 border leading-none shrink-0 rounded-none ${
                        rfq.status === "awarded" 
                          ? "bg-emerald-50 text-emerald-800 border-emerald-250" 
                          : "bg-[#FF6600]/10 text-[#FF6600] border-[#FF6600]/25 animate-pulse"
                      }`}>
                        {rfq.status === "awarded" ? "✓ Contract Awarded" : "● Seeking Farm Bids"}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 font-sans leading-relaxed">{rfq.description}</p>

                    <div className="bg-white border border-stone-200 p-3 flex justify-between items-center text-[10.5px] font-mono">
                      <span>Volume Requested: <strong className="text-editorial-charcoal">{rfq.quantity} {rfq.unit}</strong></span>
                      <span className="text-stone-300">|</span>
                      <span>Target: <strong className="text-[#FF6600] uppercase">{rfq.category}</strong></span>
                    </div>

                    {/* Bids received area */}
                    <div className="space-y-3 pt-2">
                      <h5 className="font-mono text-[9px] font-bold text-[#1A1A1A]/50 uppercase tracking-widest block">
                        Competitive Proposals Received ({rfq.bids.length})
                      </h5>
                      
                      {rfq.bids.length === 0 ? (
                        <div className="p-4 bg-stone-100/50 border border-dashed border-stone-200 text-center text-xs text-stone-400 italic font-mono">
                          Awaiting pricing responses from verified farms...
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {rfq.bids.map((bid) => (
                            <div key={bid.id} className="bg-stone-50 border border-stone-200 p-4 space-y-3 relative overflow-hidden group rounded-none">
                              <div className="absolute top-0 right-0 bg-[#FF6600] text-black font-mono text-[8.5px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                Verified Supplier
                              </div>
                              <div className="flex justify-between items-start gap-4 flex-wrap sm:flex-nowrap">
                                <div>
                                  <span className="font-serif italic font-bold text-neutral-800 text-sm block">
                                    {bid.sellerName}
                                  </span>
                                  <span className="text-[9px] font-mono text-stone-400">Seller Trust Level: ★ {bid.rating} (All Clear Reviews)</span>
                                </div>
                                <div className="text-right">
                                  <span className="block text-stone-400 text-[9px] font-mono">Quoted Rate</span>
                                  <span className="font-mono text-sm font-black text-rose-800">${bid.pricePerUnit.toFixed(2)}<span className="text-xs font-normal text-stone-400">/{rfq.unit.replace(/Cases|Barrels|Gallon|Bulk\s*/gi, "").replace(/\(.*?\)/, "").trim()}</span></span>
                                </div>
                              </div>

                              <p className="text-[11.5px] text-stone-600 leading-relaxed font-sans italic">{bid.description}</p>

                              <div className="flex justify-between items-center pt-2.5 border-t border-stone-200 font-mono text-[9px] flex-wrap gap-2">
                                <span>Transit Dispatch: <strong className="text-neutral-700">{bid.deliveryDays} Days</strong></span>
                                {rfq.status !== "awarded" ? (
                                  <button
                                    onClick={() => handleAcceptBid(rfq.title, bid.sellerName, bid.pricePerUnit, rfq.quantity, rfq.unit)}
                                    className="px-3.5 py-1.5 bg-black text-stone-100 hover:bg-[#FF6600] hover:text-black transition-all text-[9.5px] font-mono uppercase font-black tracking-widest cursor-pointer rounded-none border border-transparent whitespace-nowrap"
                                  >
                                    Accept Bid &amp; Queue Contract →
                                  </button>
                                ) : (
                                  <span className="text-emerald-700 font-bold font-mono">✓ Contract Awarded</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse" id="product-grid-skeleton">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-none border border-editorial-charcoal/12 overflow-hidden flex flex-col h-full">
                  {/* Product Thumbnail container skeleton */}
                  <div className="relative h-56 bg-stone-100 flex items-center justify-center border-b border-editorial-charcoal/10">
                    <div className="w-10 h-10 bg-stone-200/40" />
                    <div className="absolute top-3 left-3 w-16 h-5 bg-stone-200/60" />
                    <div className="absolute top-3 right-3 w-8 h-8 bg-stone-200/60" />
                    <div className="absolute bottom-3 right-3 w-8 h-8 bg-stone-200/60" />
                  </div>
                  {/* Info block skeleton */}
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-3 text-left">
                      <div className="h-3 bg-stone-200/60 w-3/4" />
                      <div className="h-5 bg-stone-200/85 w-11/12" />
                      <div className="space-y-1.5 pt-1">
                        <div className="h-3 bg-stone-100/95 w-full" />
                        <div className="h-3 bg-stone-100/95 w-5/6" />
                      </div>
                    </div>
                    {/* Rating summary skeleton */}
                    <div className="flex items-center justify-between gap-1.5 pt-1">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, idx) => (
                          <div key={idx} className="w-3 h-3 bg-stone-200/50" />
                        ))}
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-14 h-5 bg-stone-200/50" />
                        <div className="w-12 h-5 bg-stone-200/50" />
                      </div>
                    </div>
                    {/* Line partition & price tag skeleton */}
                    <div className="border-t border-editorial-charcoal/10 pt-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="h-2.5 bg-stone-100 w-10" />
                        <div className="h-5 bg-stone-200/70 w-16" />
                      </div>
                      <div className="h-9 bg-stone-200 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-[#FAF9F6] border border-dashed border-editorial-charcoal/20 rounded-none py-16 text-center max-w-lg mx-auto">
              <AlertCircle className="w-10 h-10 text-editorial-charcoal/30 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-editorial-charcoal italic">No batch matches your filter</h3>
              <p className="text-editorial-charcoal/60 text-xs mt-2 max-w-xs mx-auto font-sans leading-relaxed">
                Try adjusting your heat level, category, or clear search queries. Custom artisanal pickles are waiting!
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedSpice("all");
                  setShowOnlyWishlist(false);
                  setPricePreset("all");
                  setCustomMaxPrice(maxPriceOfAllProducts || 30);
                }}
                className="mt-6 px-5 py-3 bg-editorial-charcoal text-editorial-cream rounded-none text-xs font-mono uppercase tracking-widest font-bold hover:bg-editorial-charcoal/90 transition-all cursor-pointer"
              >
                View All Marketplace Batches
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in" id="product-grid">
          {filteredProducts.map((p) => {
            const hasLowStock = p.stock <= 15;
            return (
              <div
                key={p.id}
                id={`product-card-${p.id}`}
                className="bg-white rounded-none border border-editorial-charcoal/12 overflow-hidden hover:border-editorial-charcoal/35 transition-all flex flex-col group h-full relative"
              >
                {/* Product Thumbnail container */}
                <div className="relative h-56 bg-editorial-gray overflow-hidden cursor-pointer border-b border-editorial-charcoal/10" onClick={() => { setSelectedProduct(p); setModalTab("details"); }}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 scale-101 group-hover:scale-104"
                    referrerPolicy="no-referrer"
                  />
                  {/* Heat badge overlay */}
                  <span className={`absolute top-3 left-3 px-2.5 py-1 text-[9px] font-bold border font-mono uppercase tracking-wider rounded-none ${getSpiceColor(p.spiceLevel)} shadow-2xs`}>
                    {getSpiceFlame(p.spiceLevel)}
                  </span>

                  {/* Heart button overlay */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(p.id);
                    }}
                    className="absolute top-3 right-3 z-15 w-8 h-8 bg-white/95 backdrop-blur-xs border border-editorial-charcoal/15 rounded-none flex items-center justify-center transition-all hover:bg-white hover:border-[#C1121F] shadow-2xs group/heart"
                    title={wishlist.includes(p.id) ? "Remove from Saved" : "Save to Wishlist"}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        wishlist.includes(p.id)
                          ? "fill-[#C1121F] text-[#C1121F] scale-110"
                          : "text-editorial-charcoal/60 group-hover/heart:scale-115"
                      }`}
                    />
                  </button>
                  
                  {/* Category icon */}
                  <span className="absolute bottom-3 right-3 w-8 h-8 bg-white text-editorial-charcoal border border-editorial-charcoal/15 rounded-none flex items-center justify-center text-xs shadow-2xs text-center z-10">
                    {p.category === "pickle" ? "🥒" : p.category === "pepper" ? "🌶️" : p.category === "oil" ? "🫙" : "🧪"}
                  </span>

                  {p.isDropshipped && (
                    <span className="absolute bottom-3 left-3 bg-stone-950 text-amber-400 border border-stone-850 text-[8.5px] font-mono uppercase tracking-widest font-black px-2.5 py-1 rounded-none shadow-2xs z-10">
                      🌍 Direct Sourced
                    </span>
                  )}

                  {p.isSeasonal && (
                    <span className={`absolute ${p.isDropshipped ? 'bottom-11' : 'bottom-3'} left-3 bg-[#E65F2B] text-white border border-[#E65F2B]/10 text-[8.5px] font-mono uppercase tracking-widest font-bold px-2.5 py-1 rounded-none shadow-2xs z-15 animate-pulse`}>
                      🍂 Seasonal Release
                    </span>
                  )}

                  {/* Stock Alert Badge */}
                  {hasLowStock && p.stock > 0 && (
                    <span className="absolute top-13 right-3 bg-[#C1121F] text-white text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-none font-mono z-10 shadow-2xs">
                      Only {p.stock} Left!
                    </span>
                  )}
                  {p.stock === 0 && (
                    <div className="absolute inset-0 bg-editorial-charcoal/60 backdrop-blur-2xs flex items-center justify-center">
                      <span className="bg-white text-editorial-charcoal text-[9px] font-mono tracking-widest uppercase font-extrabold px-3.5 py-1.5 border border-editorial-charcoal shadow-sm">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Info block */}
                <div className="p-5 flex flex-col flex-1 text-left justify-between space-y-4">
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-editorial-charcoal/40 block tracking-widest uppercase font-bold">
                      {p.isDropshipped ? `🌍 Direct Origin: ${p.supplierName}` : `Provenanced From ${p.sellerName}`}
                    </span>
                    <h3 
                      onClick={() => { setSelectedProduct(p); setModalTab("details"); }}
                      className="font-serif text-lg font-bold text-editorial-charcoal hover:text-editorial-red leading-tight line-clamp-1 cursor-pointer"
                    >
                      {p.name}
                    </h3>
                    <p className="text-stone-500 text-xs line-clamp-2 h-8 font-sans leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Rating summary with clickable micro nutrition view trigger */}
                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-editorial-red">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < Math.floor(p.rating) ? "fill-current" : "text-stone-200"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-editorial-charcoal font-sans">{p.rating}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCompareSet(p.id);
                        }}
                        className={`text-[9.5px] font-mono uppercase tracking-widest font-black transition-all flex items-center gap-1 border px-2 py-1 cursor-pointer ${
                          compareIds.includes(p.id)
                            ? "bg-[#C1121F] text-white border-[#C1121F] shadow-2xs"
                            : "bg-white text-editorial-charcoal/70 border-editorial-charcoal/15 hover:bg-stone-50"
                        }`}
                        title={compareIds.includes(p.id) ? "Remove from comparison matrix" : "Compare this specimen side-by-side"}
                      >
                        ⚖️ {compareIds.includes(p.id) ? "In Set" : "Compare"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setNutritionProduct(p);
                        }}
                        className="text-[9.5px] font-mono uppercase tracking-widest font-black text-[#C1121F] hover:text-editorial-charcoal hover:underline transition-all flex items-center gap-1 bg-stone-50 border border-editorial-charcoal/10 px-2 py-1 cursor-pointer"
                        title="View simulated nutritional breakdowns"
                      >
                        🔬 Facts
                      </button>
                    </div>
                  </div>

                  {/* Line partition */}
                  <div className="border-t border-editorial-charcoal/10 pt-4 flex items-center justify-between">
                    {sourcingMode === "wholesale" ? (
                      <>
                        <div className="text-left font-mono">
                          <span className="text-stone-400 text-[8px] block uppercase tracking-wide leading-none mb-1">Custom Case (12 Jars)</span>
                          <span className="text-rose-800 text-[9.5px] font-bold block leading-none mb-1">MOQ: 2 Cases</span>
                          <span className="text-editorial-charcoal font-serif text-sm font-black">
                            ${(p.price * 12 * 0.7).toFixed(2)} - ${(p.price * 12 * 0.9).toFixed(2)} <span className="text-[9px] font-normal text-stone-400">/cs</span>
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setWholesaleConfigProduct(p);
                            setWholesaleQty(2); // MOQ
                            setPrivateLabel(false);
                            setPrivateLabelText("");
                            setWaxSealColor("gold");
                          }}
                          className="bg-[#FF6600] text-black border border-[#FF6600] px-3.5 py-2.5 rounded-none font-mono uppercase tracking-widest text-[9.5px] hover:bg-black hover:text-[#FAF9F6] transition-all shadow-2xs font-extrabold cursor-pointer"
                          title="Configure custom brand private packaging & volume tiers"
                        >
                          Specs &amp; Quote
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          <span className="text-editorial-charcoal/40 text-[9px] block font-mono uppercase tracking-wide leading-none mb-1">Vol: {p.size || "16 oz Jar"}</span>
                          <span className="text-editorial-charcoal font-serif text-lg font-bold">
                            ${p.price.toFixed(2)}
                          </span>
                        </div>

                        {/* Add to cart action buttons */}
                        {p.stock > 0 ? (
                          <button
                            id={`add-to-cart-btn-${p.id}`}
                            onClick={() => {
                              addToCart(p, 1);
                              onOpenCart?.();
                            }}
                            className="bg-editorial-charcoal text-editorial-cream border border-editorial-charcoal p-2.5 rounded-none font-mono uppercase tracking-widest text-[10px] hover:bg-editorial-red hover:border-editorial-red transition-all shadow-2xs cursor-pointer"
                            title="Add delicious jar to shopping cart"
                          >
                            Add to basket
                          </button>
                        ) : (
                          <button
                            className="bg-stone-50 text-stone-400 border border-stone-200 rounded-none px-3 py-2 text-[10px] font-mono uppercase tracking-wide cursor-not-allowed"
                            disabled
                          >
                            Sold Out
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </>
      )}

      {/* B2B WHOLESALE CONFIGURATOR MODAL */}
      {wholesaleConfigProduct && (() => {
        const prod = wholesaleConfigProduct;
        const retailSingleJarPrice = prod.price;
        const baseCasePrice = retailSingleJarPrice * 12; // 12 jars per case
        
        // Dynamic Tier Price calculations:
        // Tier 1 (2-9 cs): 10% off
        // Tier 2 (10-49 cs): 20% off
        // Tier 3 (50+ cs): 30% off
        let discountPct = 0.10;
        let activeTier = "2 - 9 Cases";
        if (wholesaleQty >= 10 && wholesaleQty <= 49) {
          discountPct = 0.20;
          activeTier = "10 - 49 Cases";
        } else if (wholesaleQty >= 50) {
          discountPct = 0.30;
          activeTier = "50+ Cases";
        }

        const rawPricePerCase = baseCasePrice * (1 - discountPct);
        const privateLabelSurcharge = privateLabel ? 3.00 : 0.00;
        const finalPricePerCase = rawPricePerCase + privateLabelSurcharge;
        const totalContractPrice = finalPricePerCase * wholesaleQty;
        const equivalentJarPrice = finalPricePerCase / 12;

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-950/50 backdrop-blur-2xs flex items-center justify-center p-4">
            <div className="bg-white rounded-none max-w-2xl w-full border-2 border-black overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              {/* Modal Header */}
              <div className="p-4 bg-[#111111] text-white flex items-center justify-between text-left">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FF6600] text-black text-[9px] font-mono font-black uppercase tracking-widest px-2.5 py-1">
                    WHOLESALE SPEC
                  </span>
                  <span className="text-[11px] font-mono text-stone-300">Contract Generator • Escrow Secured</span>
                </div>
                <button
                  onClick={() => setWholesaleConfigProduct(null)}
                  className="text-stone-400 hover:text-white font-bold font-mono text-sm uppercase p-1"
                >
                  ✕
                </button>
              </div>

              {/* Scroll Container */}
              <div className="overflow-y-auto flex-1 p-6 space-y-6 text-left">
                <div className="flex gap-4 border-b border-stone-200 pb-4">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-20 h-20 object-cover border border-black/10"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-rose-800 font-bold">Manufacturer: {prod.sellerName}</span>
                    <h3 className="font-serif text-lg font-bold italic text-neutral-900 leading-tight">{prod.name}</h3>
                    <p className="text-[11px] text-stone-500 font-sans mt-0.5 max-w-md line-clamp-1">{prod.description}</p>
                    <div className="flex gap-3 text-[10px] font-mono mt-1 text-stone-400">
                      <span>Ref Jar Vol: {prod.size || "16 oz"}</span>
                      <span>•</span>
                      <span>Singles Spot: ${prod.price.toFixed(2)}/ea</span>
                    </div>
                  </div>
                </div>

                {/* 1. Sourcing volume Discount Matrix */}
                <div className="space-y-3">
                  <h4 className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#1A1A1A]/40 block">
                    1. Volume Discount Tier Matrix
                  </h4>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                    {[
                      { range: "2 - 9 cases", discount: "-10% Off", rate: baseCasePrice * 0.9, info: "Spot contract" },
                      { range: "10 - 49 cases", discount: "-20% Off", rate: baseCasePrice * 0.8, info: "Industrial Lot" },
                      { range: "50+ cases", discount: "-30% Off", rate: baseCasePrice * 0.7, info: "Crop Master Contract" },
                    ].map((tier) => {
                      const isCurrent = activeTier.toLowerCase() === tier.range;
                      return (
                        <div
                          key={tier.range}
                          className={`p-3 border transition-all ${
                            isCurrent
                              ? "bg-[#FF6600]/10 border-[#FF6600] text-black shadow-3xs"
                              : "bg-stone-50/50 border-stone-200 text-stone-500"
                          }`}
                        >
                          <span className="block text-[10px] uppercase font-bold">{tier.range}</span>
                          <span className="block text-sm font-black text-rose-800 mt-1">{tier.discount}</span>
                          <span className="block text-xs font-bold mt-0.5">${tier.rate.toFixed(2)} /cs</span>
                          <span className="text-[8px] text-stone-400 font-normal">{tier.info}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Configure quantity & specs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left Column: Qty & Labeling */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#1A1A1A]/40">
                      2. Sourcing Quantity
                    </h4>
                    
                    <div className="p-4 bg-stone-50 border border-stone-200 space-y-3">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="font-bold text-stone-700">Contract Quantity (Cases)</span>
                        <span className="text-rose-800 text-[10px] font-bold">MOQ: 2</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setWholesaleQty(Math.max(2, wholesaleQty - 1))}
                          className="px-3 py-1.5 bg-neutral-900 text-white font-mono hover:bg-[#FF6600] hover:text-black transition-all cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="2"
                          value={wholesaleQty}
                          onChange={(e) => setWholesaleQty(Math.max(2, Number(e.target.value)))}
                          className="flex-1 text-center font-mono border border-stone-300 text-sm focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setWholesaleQty(wholesaleQty + 1)}
                          className="px-3 py-1.5 bg-neutral-900 text-white font-mono hover:bg-[#FF6600] hover:text-black transition-all cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono block text-center">
                        Total Jars: {wholesaleQty * 12} specimens
                      </span>
                    </div>

                    <div className="space-y-3">
                      <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-stone-50 rounded border border-stone-200 text-xs font-mono">
                        <input
                          type="checkbox"
                          checked={privateLabel}
                          onChange={(e) => setPrivateLabel(e.target.checked)}
                          className="accent-[#FF6600] w-3.5 h-3.5"
                        />
                        <div>
                          <span className="font-bold text-neutral-800 block">Apply Private Branding Labels</span>
                          <span className="text-[9px] text-[#FF6600] font-black tracking-widest block font-mono">+ $3.00 / CASE CONTRACT fee</span>
                        </div>
                      </label>

                      {privateLabel && (
                        <div className="space-y-1.5 animate-in slide-in-from-top-1 duration-200 text-xs">
                          <label className="text-[9px] font-mono text-stone-400 uppercase tracking-wider block">Custom Brand Title To Engrave</label>
                          <input
                            type="text"
                            required
                            value={privateLabelText}
                            onChange={(e) => setPrivateLabelText(e.target.value)}
                            className="w-full border border-stone-300 p-2 text-xs focus:outline-none focus:border-black rounded-none"
                            placeholder="e.g. Trader Joe's Premium Reserve"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Custom Wax Seal & Verification */}
                  <div className="space-y-4">
                    <h4 className="font-mono text-[9px] font-extrabold uppercase tracking-widest text-[#1A1A1A]/40">
                      3. Wax Seal Capping Specification
                    </h4>

                    <div className="p-4 bg-stone-50 border border-stone-200 text-xs space-y-3">
                      <label className="text-[9.5px] font-mono text-stone-500 uppercase block">Choose Aesthetic Capping Wax</label>
                      <select
                        value={waxSealColor}
                        onChange={(e) => setWaxSealColor(e.target.value)}
                        className="w-full p-2 border border-stone-300 bg-white font-mono rounded-none"
                      >
                        <option value="gold">🏅 Imperial Gold (Royal Traditional)</option>
                        <option value="emerald">💚 Emerald Vine (Garden Certified)</option>
                        <option value="crimson">❤️ Crimson Fire (Hot/Spinal Spark)</option>
                        <option value="matte-black">🖤 Pitch Black (Secret Dark Room Ferment)</option>
                        <option value="royal-blue">💙 Ocean Salt (Lacto Certified Marine)</option>
                      </select>
                      <p className="text-[10px] text-stone-400 font-sans italic leading-relaxed">
                        Each individual jar in your custom wholesale case will be hand-dipped in organic hot beeswax matching this tone block.
                      </p>
                    </div>

                    {/* Trade Protection Stamp */}
                    <div className="border border-amber-300 bg-amber-50/50 p-3.5 space-y-1 rounded-none text-left">
                      <div className="flex items-center gap-1 text-amber-900 font-mono text-[10px] font-black uppercase tracking-wider">
                        <span>🛡️ Trade Assurance Protected</span>
                      </div>
                      <p className="text-[10px] text-amber-800 leading-normal font-sans">
                        Contract payment stays locked in trust escrow. Sourced specimens are insured from local farm shipping to destination delivery.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3. Live dynamic Quote Subtotal Breakdown */}
                <div className="bg-neutral-900 text-white p-4 font-mono text-xs rounded-none space-y-2">
                  <span className="text-[9px] text-[#FF6600] font-black uppercase tracking-widest block">
                    Dynamic Wholesale Sourcing Contract Quotation
                  </span>
                  
                  <div className="grid grid-cols-2 gap-1.5 pt-2 text-[11px] text-stone-300">
                    <span>Base rate per case ({activeTier}):</span>
                    <span className="text-right text-white">${rawPricePerCase.toFixed(2)}/cs</span>

                    {privateLabel && (
                      <>
                        <span>Private label surcharge:</span>
                        <span className="text-right text-white">+ $3.00/cs</span>
                      </>
                    )}

                    <span>Total cases requested:</span>
                    <span className="text-right text-white">x {wholesaleQty} cases</span>
                  </div>

                  <div className="border-t border-neutral-800 pt-3 flex justify-between items-baseline">
                    <span className="font-bold text-stone-200 text-xs">Total Sourcing Subtotal:</span>
                    <div className="text-right">
                      <span className="font-serif italic font-black text-lg text-[#FF6600] block">
                        ${totalContractPrice.toFixed(2)}
                      </span>
                      <span className="text-[9px] text-stone-400 block font-mono">
                        (Equivalent rate only: ${(equivalentJarPrice).toFixed(2)} / jar specimen)
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center flex-wrap gap-2 text-xs">
                <span className="text-[10px] font-mono text-stone-400">Escrow Dispatch Pipeline: 10 Days Lead Time</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWholesaleConfigProduct(null)}
                    className="px-4 py-2 border border-stone-300 text-stone-600 font-mono hover:bg-stone-200 uppercase transition-all rounded-none font-bold"
                  >
                    Cancel Sourcing
                  </button>
                  <button
                    onClick={() => handleAddWholesaleToBasket(prod, wholesaleQty, finalPricePerCase, privateLabelText, waxSealColor)}
                    className="px-5 py-2.5 bg-[#FF6600] text-black font-mono hover:bg-black hover:text-[#FAF9F6] uppercase font-bold transition-all rounded-none tracking-widest shadow-md"
                  >
                    Add Contract To Basket 🛒
                  </button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* DYNAMIC PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-editorial-charcoal/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-none max-w-3xl w-full border-2 border-editorial-charcoal overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            id="product-modal"
          >
            {/* Modal Header */}
            <div className="p-4 bg-editorial-gray border-b border-editorial-charcoal/20 flex items-center justify-between text-left">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 text-[9px] font-mono uppercase tracking-widest font-bold border ${getSpiceColor(selectedProduct.spiceLevel)}`}>
                  {getSpiceFlame(selectedProduct.spiceLevel)}
                </span>
                <span className="text-[10px] text-editorial-charcoal/50 font-mono uppercase tracking-wider">Provenance: {selectedProduct.sellerName}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Wishlist toggle inside modal */}
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className="p-1 rounded-none text-editorial-charcoal/55 hover:text-[#C1121F] hover:bg-editorial-gray transition-all border border-transparent hover:border-editorial-charcoal/20"
                  title={wishlist.includes(selectedProduct.id) ? "Remove from Saved" : "Save to Wishlist"}
                >
                  <Heart className={`w-4 h-4 ${wishlist.includes(selectedProduct.id) ? "fill-[#C1121F] text-[#C1121F]" : "text-editorial-charcoal/60"}`} />
                </button>
                <button
                  id="close-product-modal"
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 rounded-none text-editorial-charcoal/50 hover:text-editorial-charcoal hover:bg-editorial-gray transition-all border border-transparent hover:border-editorial-charcoal/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scroll Region wrapper */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6 text-left">
              
              {/* Product Card and visual header */}
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full md:w-56 h-48 md:h-56 object-cover rounded-none border border-editorial-charcoal/15 shadow-xs"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-editorial-red font-bold">{selectedProduct.category} Collection</span>
                    <h2 className="font-serif text-[26px] font-black text-editorial-charcoal mt-1">{selectedProduct.name}</h2>
                    <span className="text-xs text-editorial-charcoal/50 block mt-1">
                      {selectedProduct.isDropshipped ? (
                        <>Import &amp; curation direct from farm crop: <span className="text-[#C1121F] font-black">{selectedProduct.supplierName}</span></>
                      ) : (
                        <>Fermentation craft by certified master: <span className="text-editorial-charcoal font-bold">{selectedProduct.sellerName}</span></>
                      )}
                    </span>

                    {selectedProduct.isSeasonal && (
                      <div id="seasonal-priority-alert" className="mt-3 bg-[#FAF3EE] border-l-3 border-[#E65F2B] px-4 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-pulse">
                        <div className="space-y-0.5">
                          <span className="text-[#E65F2B] text-[10px] font-mono font-black uppercase tracking-wider block">🍂 Limited Seasonal Harvest</span>
                          <span className="text-[11px] text-stone-700 font-sans italic">Custom batch compiled only once a year. Buy before the harvest is retired.</span>
                        </div>
                        <span className="text-[8.5px] font-mono uppercase font-bold text-white bg-[#E65F2B] px-2 py-0.5 rounded-none self-start sm:self-auto shrink-0 tracking-widest">
                          Urgent Release
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-serif font-black text-editorial-red">${selectedProduct.price.toFixed(2)}</span>
                    <span className="text-xs text-[#1A1A1A]/50 pl-4 border-l border-editorial-charcoal/15 font-mono">Vol: <span className="text-[#1A1A1A] font-bold">{selectedProduct.size || "16 oz Jar"}</span></span>
                    <span className={`text-xs ml-auto font-mono uppercase tracking-wider font-bold ${selectedProduct.stock > 10 ? "text-editorial-green" : "text-[#C1121F] animate-pulse"}`}>
                      {selectedProduct.stock > 0 ? `Stock: ${selectedProduct.stock}` : "Sold Out"}
                    </span>
                  </div>

                  {/* Visual trigger to view Nutrition facts from details screen */}
                  <div className="flex justify-start">
                    <button
                      onClick={() => setNutritionProduct(selectedProduct)}
                      className="px-3 py-1.5 border border-[#C1121F] text-[#C1121F] bg-[#FAF9F6] text-[10px] font-mono uppercase font-black tracking-wider hover:bg-[#C1121F] hover:text-white transition-all rounded-none flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>📊 View Nutrition & Ingredient Facts</span>
                    </button>
                  </div>

                  {/* Dynamic internal tabs switcher */}
                  <div className="flex border-b border-editorial-charcoal/15 bg-editorial-gray p-1 rounded-none">
                    {[
                      { id: "details", label: "Heritage Story" },
                      { id: "ingredients", label: "Brine & Elements" },
                      { id: "reviews", label: `Reviews (${currentProductReviews.length})` },
                      { id: "recipes", label: `Artisan Methods (${currentProductRecipes.length})` },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setModalTab(tab.id as any)}
                        className={`flex-1 text-center py-2 rounded-none text-[10px] uppercase font-mono tracking-widest font-bold transition-all ${
                          modalTab === tab.id
                            ? "bg-editorial-charcoal text-editorial-cream shadow-2xs"
                            : "text-editorial-charcoal/50 hover:text-editorial-charcoal hover:bg-white/50"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tab Display Body */}
              <div className="bg-editorial-gray p-6 rounded-none border border-editorial-charcoal/10 mt-4 min-h-[160px]">
                
                {/* 1. Details Tab */}
                {modalTab === "details" && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold text-editorial-charcoal italic">The Brine Heritage Story</h4>
                    <p className="text-editorial-charcoal/80 text-xs leading-relaxed font-sans">{selectedProduct.description}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedProduct.tags.map((tag, i) => (
                        <span key={i} className="text-[9px] uppercase tracking-wider font-mono font-bold bg-white border border-editorial-charcoal/10 text-editorial-charcoal/60 px-2 py-0.5 rounded-none">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Ingredients Tab */}
                {modalTab === "ingredients" && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold text-editorial-charcoal italic">Inside the Jar elements ({selectedProduct.size || "16 oz"})</h4>
                    <p className="text-[#1A1A1A]/70 text-xs leading-relaxed font-sans">
                      All products utilize non-iodized organic minerals and spring water to preserve crispy cell walls. This listing features:
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProduct.ingredients.map((ing, i) => (
                        <span key={i} className="text-xs bg-white border border-editorial-charcoal/15 text-editorial-charcoal px-3 py-1 rounded-none font-medium flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-editorial-green" />
                          <span>{ing}</span>
                        </span>
                      ))}
                    </div>
                    <div className="text-[10px] text-editorial-charcoal/50 bg-white p-3.5 rounded-none border border-editorial-charcoal/10 font-mono leading-relaxed mt-4">
                      NOTICE: Packaged in a cold sterile facility that also processes pickling mustard seeds, organic dill crowns, celery, and local peppers.
                    </div>
                  </div>
                )}

                {/* 3. Customer Reviews Tab */}
                {modalTab === "reviews" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-sm font-bold text-editorial-charcoal italic">Tasting Feedback</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold bg-editorial-charcoal text-editorial-cream px-2 py-0.5 rounded-none">{selectedProduct.rating}</span>
                        <span className="text-[10px] text-editorial-charcoal/50 font-mono uppercase">({selectedProduct.reviewsCount} verified submissions)</span>
                      </div>
                    </div>

                    {/* Review List */}
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2">
                      {currentProductReviews.length === 0 ? (
                        <div className="text-center py-6 text-editorial-charcoal/40 text-xs font-mono uppercase tracking-wider">
                          No reviews for this batch yet. Be the first to add feedback!
                        </div>
                      ) : (
                        currentProductReviews.map((rev) => (
                           <div key={rev.id} className="bg-white p-4 rounded-none border border-editorial-charcoal/10 space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-editorial-charcoal">{rev.author}</span>
                              <span className="text-[10px] font-mono text-editorial-charcoal/40">{rev.date}</span>
                            </div>
                            <div className="flex items-center gap-1 text-editorial-red">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${i < rev.rating ? "fill-current" : "text-stone-200"}`}
                                />
                              ))}
                              {rev.verified && (
                                <span className="text-[9px] font-mono tracking-widest uppercase bg-editorial-green text-white font-bold px-2 py-0.2 rounded-none ml-2">
                                  VERIFIED EATER
                                </span>
                              )}
                            </div>
                            <p className="text-editorial-charcoal/80 text-xs font-sans italic leading-relaxed">
                              "{rev.comment}"
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Submit Review Form */}
                    <form onSubmit={handleReviewSubmit} className="border-t border-editorial-charcoal/15 pt-4 space-y-4 text-left">
                      <span className="text-xs font-mono uppercase tracking-widest font-bold text-[#1A1A1A] block">Add Tasting Notes</span>
                      {reviewSuccess && (
                        <div className="bg-editorial-cream text-editorial-green text-xs p-3 rounded-none border border-editorial-charcoal/25 flex items-center gap-1.5 font-bold font-mono">
                          <Check className="w-3.5 h-3.5 text-editorial-green" />
                          <span>Tasting review recorded. Salutations!</span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-mono font-bold text-editorial-charcoal/40 uppercase block mb-1">Your Name</label>
                          <input
                            type="text"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="e.g. Grandma Dill"
                            required
                            className="w-full border border-editorial-charcoal/30 text-xs p-2.5 rounded-none bg-white font-mono focus:border-editorial-charcoal"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono font-bold text-editorial-charcoal/40 uppercase block mb-1">Star Score</label>
                          <select
                            value={reviewRating}
                            onChange={(e) => setReviewRating(Number(e.target.value))}
                            className="w-full border border-editorial-charcoal/30 text-xs p-2.5 rounded-none bg-white font-mono focus:border-editorial-charcoal"
                          >
                            <option value="5">⭐⭐⭐⭐⭐ Excellent 5/5</option>
                            <option value="4">⭐⭐⭐⭐ Great 4/5</option>
                            <option value="3">⭐⭐⭐ Good 3/5</option>
                            <option value="2">⭐⭐ Fair 2/5</option>
                            <option value="1">⭐ Poor 1/5</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] font-mono font-bold text-editorial-charcoal/40 uppercase block mb-1">Tasting Comments & Flavor Notes</label>
                        <textarea
                          rows={2}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Rate the snap, sour levels, crunch, oil elements..."
                          required
                          className="w-full border border-editorial-charcoal/30 text-xs p-2.5 rounded-none bg-white font-sans focus:border-editorial-charcoal"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="bg-editorial-charcoal text-editorial-cream px-4 py-2 text-xs font-mono uppercase tracking-widest font-bold hover:bg-editorial-red transition-all"
                      >
                        File Evaluation Form
                      </button>
                    </form>
                  </div>
                )}

                {/* 4. Connected Cooking Recipes Tab */}
                {modalTab === "recipes" && (
                  <div className="space-y-4">
                    <h4 className="font-serif text-sm font-bold text-editorial-charcoal italic">Eater Guidelines & Culinary Uses</h4>
                    <p className="text-stone-600 text-xs leading-relaxed font-sans">
                      This specific batch is referenced in the following culinary preparation maps:
                    </p>

                    {currentProductRecipes.length === 0 ? (
                      <div className="text-center py-6 text-editorial-charcoal/40 text-xs font-mono uppercase tracking-wider">
                        No recipe linked to this product yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentProductRecipes.map((rec) => (
                          <div 
                            key={rec.id} 
                            className="bg-white p-4 rounded-none border border-editorial-charcoal/15 hover:border-editorial-charcoal cursor-pointer flex gap-4 transition-colors"
                            onClick={() => {
                              setSelectedProduct(null);
                              onSelectRecipe(rec.id);
                            }}
                          >
                            <img
                              src={rec.image}
                              alt={rec.title}
                              className="w-16 h-16 object-cover rounded-none border border-editorial-charcoal/10"
                              referrerPolicy="no-referrer"
                            />
                            <div className="text-left space-y-1">
                              <span className="text-[9px] font-mono font-bold text-[#C1121F] uppercase tracking-wider">{rec.difficulty} • {rec.prepTime}</span>
                              <h5 className="font-serif text-xs font-bold text-editorial-charcoal line-clamp-1 italic">{rec.title}</h5>
                              <p className="text-[11px] text-[#1A1A1A]/65 line-clamp-1 font-sans">{rec.description}</p>
                              <span className="inline-flex items-center text-[9px] font-mono font-bold uppercase tracking-wider text-editorial-charcoal mt-1">
                                Open Map <ArrowRight className="w-2.5 h-2.5 ml-1 text-editorial-red" />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

            {/* Modal Footer Controls */}
            <div className="bg-editorial-gray p-4 border-t border-editorial-charcoal/20 flex items-center justify-between">
              <span className="text-[9px] text-[#1A1A1A]/40 font-mono uppercase">Reference: BATCH-{selectedProduct.id}</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 border border-editorial-charcoal/20 text-editorial-charcoal rounded-none text-xs font-mono uppercase tracking-widest font-bold hover:bg-editorial-gray transition-all"
                >
                  Close Info
                </button>
                {selectedProduct.stock > 0 ? (
                  <button
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                      onOpenCart?.();
                    }}
                    className="px-5 py-2.5 bg-editorial-charcoal text-editorial-cream rounded-none text-xs font-mono uppercase tracking-widest font-bold flex items-center gap-2 hover:bg-editorial-red transition-all shadow-md border border-editorial-charcoal hover:border-editorial-[#C1121F]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Purchase Batch Specimen &mdash; ${selectedProduct.price.toFixed(2)}</span>
                  </button>
                ) : (
                  <span className="px-4 py-2 bg-stone-250 text-stone-400 text-xs font-mono uppercase tracking-wide border rounded-none">
                    Batch Specimen Sold Out
                  </span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* NUTRITION FACTS MODAL */}
      {nutritionProduct && (() => {
        const nut = (() => {
          const isPickle = nutritionProduct.category === "pickle";
          const isPepper = nutritionProduct.category === "pepper";
          const isOil = nutritionProduct.category === "oil";
          
          let calories = 5;
          let totalFat = 0;
          let satFat = 0;
          let sodium = 290;
          let carbo = 2;
          let sugar = 1;
          let protein = 0;
          let servingSize = "1 oz (28g)";
          let servingsPerContainer = 16;
          
          if (isOil) {
            calories = 120;
            totalFat = 14;
            satFat = 2;
            sodium = 0;
            carbo = 0;
            sugar = 0;
            protein = 0;
            servingSize = "1 tbsp (15mL)";
            servingsPerContainer = 32;
          } else if (isPepper) {
            calories = 15;
            totalFat = 0.2;
            satFat = 0;
            sodium = 140;
            carbo = 3;
            sugar = 2;
            protein = 0.5;
            servingSize = "5-6 slices (30g)";
            servingsPerContainer = 12;
          } else if (nutritionProduct.category === "starter") {
            calories = 0;
            totalFat = 0;
            satFat = 0;
            sodium = 200;
            carbo = 1;
            sugar = 0.5;
            protein = 0;
            servingSize = "1/4 tsp (1.2g)";
            servingsPerContainer = 120;
          }

          const multiplier = (nutritionProduct.id.charCodeAt(0) % 5) * 2;
          if (!isOil && calories > 0) {
            calories += multiplier;
          }
          if (sodium > 0) {
            sodium += (nutritionProduct.id.charCodeAt(1) % 4) * 15;
          }
          if (carbo > 0) {
            carbo += (nutritionProduct.id.charCodeAt(2) % 3) * 0.5;
          }

          return {
            calories,
            totalFat,
            satFat,
            sodium,
            carbo,
            sugar,
            protein,
            servingSize,
            servingsPerContainer
          };
        })();

        // Calculate % values
        const totalFatDV = Math.round((nut.totalFat / 65) * 100);
        const satFatDV = Math.round((nut.satFat / 20) * 100);
        const sodiumDV = Math.round((nut.sodium / 2400) * 100);
        const carboDV = Math.round((nut.carbo / 300) * 100);

        return (
          <div className="fixed inset-0 z-[100] overflow-y-auto bg-editorial-charcoal/40 backdrop-blur-2xs flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-none max-w-sm w-full border-2 border-editorial-charcoal overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-xl p-5 md:p-6"
              id="nutrition-facts-modal"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <span className="text-[10px] font-mono uppercase tracking-widest font-black text-stone-400">Gourmet Verification Panel</span>
                <button
                  onClick={() => setNutritionProduct(null)}
                  className="p-1 text-stone-400 hover:text-editorial-charcoal transition-colors border border-transparent hover:border-editorial-charcoal/10"
                  aria-label="Close nutrition Facts modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Classic Black-Box FDA Label */}
              <div className="border-[3px] border-black p-3.5 text-left font-sans text-black mt-4 bg-white select-none">
                <h2 className="font-extrabold text-3xl leading-none uppercase tracking-tight font-[Helvetica,Arial,sans-serif]">
                  Nutrition Facts
                </h2>
                
                <div className="text-xs border-b-[5px] border-black pt-1 pb-1">
                  <div>{nut.servingsPerContainer} servings per container</div>
                  <div className="flex justify-between font-bold">
                    <span>Serving size</span>
                    <span>{nut.servingSize}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline border-b-[9px] border-black py-1">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold">Amount per serving</span>
                    <span className="text-2xl font-black uppercase leading-none">Calories</span>
                  </div>
                  <span className="text-4xl font-black leading-none">{nut.calories}</span>
                </div>

                {/* % Daily Value Column Header */}
                <div className="text-right text-[10px] font-bold border-b border-black py-1 uppercase tracking-wider">
                  % Daily Value*
                </div>

                {/* Fats breakdown */}
                <div className="border-b border-black py-1 text-xs">
                  <div className="flex justify-between">
                    <span>
                      <strong className="font-extrabold">Total Fat</strong> {nut.totalFat}g
                    </span>
                    <strong className="font-extrabold">{totalFatDV}%</strong>
                  </div>
                  <div className="pl-4 flex justify-between text-stone-700 font-sans">
                    <span>Saturated Fat {nut.satFat}g</span>
                    <span>{satFatDV}%</span>
                  </div>
                  <div className="pl-4 text-stone-700 italic font-sans">
                    Trans Fat 0g
                  </div>
                </div>

                {/* Sodium */}
                <div className="border-b border-black py-1 text-xs flex justify-between">
                  <span>
                    <strong className="font-extrabold">Sodium</strong> {nut.sodium}mg
                  </span>
                  <strong className="font-extrabold">{sodiumDV}%</strong>
                </div>

                {/* Carbohydrates */}
                <div className="border-b border-black py-1 text-xs font-sans">
                  <div className="flex justify-between">
                    <span>
                      <strong className="font-extrabold">Total Carbohydrate</strong> {nut.carbo}g
                    </span>
                    <strong className="font-extrabold">{carboDV}%</strong>
                  </div>
                  <div className="pl-4 flex justify-between text-stone-700 font-sans">
                    <span>Total Sugars {nut.sugar}g</span>
                    <span>--</span>
                  </div>
                </div>

                {/* Protein */}
                <div className="border-b-[5px] border-black py-1 text-xs flex justify-between">
                  <span>
                    <strong className="font-extrabold">Protein</strong> {nut.protein}g
                  </span>
                  <span>--</span>
                </div>

                {/* Footer disclaimer */}
                <div className="text-[8.5px] leading-snug pt-2 text-[#222]">
                  * The % Daily Value (DV) tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
                </div>
              </div>

              {/* Elements & Ingredients summary below label */}
              <div className="mt-4 pt-4 border-t border-stone-200 text-left space-y-2">
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#C1121F] font-bold block">Specimen Elements:</span>
                <p className="text-[11px] text-stone-600 leading-relaxed font-sans font-medium italic">
                  {nutritionProduct.ingredients.join(", ")}
                </p>
                <div className="text-[8.5px] font-mono text-stone-400">
                  Verified organic crop sourcing certified by {nutritionProduct.sellerName}.
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-5 pt-3 border-t border-stone-200">
                <button
                  onClick={() => setNutritionProduct(null)}
                  className="w-full py-2 bg-stone-900 text-white rounded-none text-xs font-mono uppercase tracking-widest font-black hover:bg-[#C1121F] hover:text-white transition-all cursor-pointer"
                >
                  Dismiss Panel
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* Floating Sticky comparison launcher bar when compareIds are present */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#FAF9F6] border-2 border-editorial-charcoal shadow-2xl p-3 md:p-4 max-w-lg w-[calc(100%-2rem)] flex items-center justify-between gap-4 animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <span className="text-lg">⚖️</span>
            <div>
              <span className="text-[10px] font-mono uppercase font-black tracking-widest text-[#C1121F] block">Comparison Matrix Set</span>
              <span className="text-[11px] text-[#1A1A1A]/80 font-sans italic leading-none">{compareIds.length} {compareIds.length === 1 ? "specimen" : "specimens"} selected <span className="text-[9px] text-[#C1121F] font-mono font-bold">(max: 4)</span></span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCompareIds([])}
              className="px-2.5 py-1.5 border border-editorial-charcoal/15 text-stone-500 hover:text-editorial-charcoal text-[10px] font-mono uppercase tracking-wider hover:bg-stone-50 transition-colors cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setIsCompareOpen(true)}
              className="px-4 py-1.5 bg-editorial-charcoal hover:bg-[#C1121F] text-editorial-cream hover:text-white text-[10px] font-mono uppercase tracking-widest font-bold transition-all shadow-xs cursor-pointer"
            >
              Compare Now
            </button>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE COMPARISON MODAL DIALOGUE */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 bg-editorial-charcoal/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div 
            className="bg-[#FAF9F6] rounded-none max-w-4xl w-full border-2 border-editorial-charcoal overflow-hidden animate-in fade-in zoom-in-95 duration-200 shadow-2xl flex flex-col"
            id="comparison-matrix-modal"
          >
            {/* Modal Header */}
            <div className="p-4 border-b-2 border-editorial-charcoal bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚖️</span>
                <div>
                  <h3 className="font-serif italic text-base font-black text-editorial-charcoal">Specimen Feature Matrix</h3>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">Side-by-side craft fermentation parameters &amp; physical features</p>
                </div>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-1 text-editorial-charcoal/50 hover:text-[#C1121F] hover:bg-stone-50 border border-transparent hover:border-editorial-charcoal/15 transition-all"
                title="Close Comparison Sheet"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Comparison Table */}
            <div className="p-4 md:p-6 overflow-y-auto max-h-[80vh] space-y-4">
              {compareIds.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-xs text-stone-500 italic">No specimen profiles inside your selection.</p>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-[#C1121F]">Click "Compare" on marketplace specimens to select</p>
                </div>
              ) : (() => {
                const comparedProducts = products.filter((p) => compareIds.includes(p.id));

                return (
                  <div className="overflow-x-auto border border-editorial-charcoal/15 bg-white shadow-sm">
                    <table className="w-full border-collapse text-left text-xs text-editorial-charcoal table-fixed min-w-[640px]">
                      <thead>
                        <tr className="bg-editorial-gray/60 border-b border-editorial-charcoal/15">
                          <th className="p-3 font-mono text-[9px] uppercase tracking-widest text-editorial-charcoal/50 w-36 border-r border-editorial-charcoal/10">Feature Metric</th>
                          {comparedProducts.map((p) => (
                            <th key={p.id} className="p-3 border-r border-editorial-charcoal/10 relative last:border-r-0">
                              <button
                                onClick={() => toggleCompareSet(p.id)}
                                className="absolute top-2 right-2 p-1 text-stone-400 hover:text-[#C1121F] transition-colors cursor-pointer"
                                title="Dismiss Specimen"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <div className="flex flex-col items-center text-center p-1 space-y-2 mt-2">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-16 h-16 object-cover border border-editorial-charcoal/10 shadow-3xs"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <span className="block text-[8px] font-mono uppercase text-[#C1121F] font-bold leading-none mb-1">{p.category} batch</span>
                                  <span className="block font-serif font-bold italic text-stone-900 text-xs line-clamp-2 md:leading-tight">{p.name}</span>
                                </div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-editorial-charcoal/10">
                        {/* Row: Price */}
                        <tr>
                          <td className="p-3 font-mono text-[9px] uppercase tracking-widest text-editorial-charcoal/50 font-bold bg-editorial-gray/25 border-r border-editorial-charcoal/10">Price &amp; Size</td>
                          {comparedProducts.map((p) => (
                            <td key={p.id} className="p-3 border-r border-editorial-charcoal/10 last:border-r-0">
                              <span className="block text-sm font-serif font-black text-editorial-red">${p.price.toFixed(2)}</span>
                              <span className="block text-[9px] font-mono text-stone-400 uppercase mt-0.5">{p.size || "16 oz Jar"}</span>
                            </td>
                          ))}
                        </tr>
                        {/* Row: Heat & Spice */}
                        <tr>
                          <td className="p-3 font-mono text-[9px] uppercase tracking-widest text-editorial-charcoal/50 font-bold bg-editorial-gray/25 border-r border-editorial-charcoal/10">Heat Index</td>
                          {comparedProducts.map((p) => (
                            <td key={p.id} className="p-3 border-r border-editorial-charcoal/10 last:border-r-0">
                              <span className={`px-2 py-0.5 text-[8px] font-mono uppercase tracking-widest font-black border ${getSpiceColor(p.spiceLevel)}`}>
                                {getSpiceFlame(p.spiceLevel)} {p.spiceLevel}
                              </span>
                            </td>
                          ))}
                        </tr>
                        {/* Row: Rating */}
                        <tr>
                          <td className="p-3 font-mono text-[9px] uppercase tracking-widest text-editorial-charcoal/50 font-bold bg-editorial-gray/25 border-r border-editorial-charcoal/10">Rating Score</td>
                          {comparedProducts.map((p) => (
                            <td key={p.id} className="p-3 border-r border-editorial-charcoal/10 last:border-r-0">
                              <div className="flex items-center gap-1 font-mono">
                                <span className="text-xs font-bold text-stone-900">★ {p.rating}</span>
                                <span className="text-[10px] text-stone-400">({p.reviewsCount} reviews)</span>
                              </div>
                            </td>
                          ))}
                        </tr>
                        {/* Row: Provenance */}
                        <tr>
                          <td className="p-3 font-mono text-[9px] uppercase tracking-widest text-editorial-charcoal/50 font-bold bg-editorial-gray/25 border-r border-editorial-charcoal/10">Sourcing &amp; Maker</td>
                          {comparedProducts.map((p) => (
                            <td key={p.id} className="p-3 border-r border-editorial-charcoal/10 last:border-r-0 text-[11px] font-sans">
                              <span className="font-bold block text-stone-800 leading-none">{p.isDropshipped ? "🌍 Direct Import" : "🏡 Local Craft"}</span>
                              <span className="text-stone-500 text-[10px] italic">{p.isDropshipped ? p.supplierName : p.sellerName}</span>
                            </td>
                          ))}
                        </tr>
                        {/* Row: Ingredients */}
                        <tr>
                          <td className="p-3 font-mono text-[9px] uppercase tracking-widest text-editorial-charcoal/50 font-bold bg-editorial-gray/25 border-r border-editorial-charcoal/10">Recipe Blend</td>
                          {comparedProducts.map((p) => (
                            <td key={p.id} className="p-3 border-r border-editorial-charcoal/10 last:border-r-0 text-[10.5px] text-stone-600 font-sans leading-relaxed italic max-h-[120px] overflow-y-auto">
                              <span className="line-clamp-4 hover:line-clamp-none block transition-all">{p.ingredients.join(", ")}</span>
                            </td>
                          ))}
                        </tr>
                        {/* Row: Tags */}
                        <tr>
                          <td className="p-3 font-mono text-[9px] uppercase tracking-widest text-editorial-charcoal/50 font-bold bg-editorial-gray/25 border-r border-editorial-charcoal/10">Guiding Badges</td>
                          {comparedProducts.map((p) => (
                            <td key={p.id} className="p-3 border-r border-editorial-charcoal/10 last:border-r-0">
                              <div className="flex flex-wrap gap-1">
                                {p.tags.map((t, idx) => (
                                  <span key={idx} className="text-[8px] font-mono uppercase bg-neutral-100 text-[#1a1a1a] border border-stone-200 px-1.5 py-0.5 rounded-none">
                                    {t}
                                  </span>
                                ))}
                                {p.isSeasonal && (
                                  <span className="text-[8px] font-mono uppercase bg-[#FAF3EE] text-[#E65F2B] border border-[#E65F2B]/20 px-1.5 py-0.5 rounded-none font-bold">
                                    Seasonal
                                  </span>
                                )}
                              </div>
                            </td>
                          ))}
                        </tr>
                        {/* Row: Stock */}
                        <tr>
                          <td className="p-3 font-mono text-[9px] uppercase tracking-widest text-editorial-charcoal/50 font-bold bg-editorial-gray/25 border-r border-editorial-charcoal/10">Status &amp; Stock</td>
                          {comparedProducts.map((p) => (
                            <td key={p.id} className="p-3 border-r border-editorial-charcoal/10 last:border-r-0 text-[10.5px] font-mono">
                              {p.stock > 0 ? (
                                <span className="text-editorial-green font-bold">In Stock ({p.stock} left)</span>
                              ) : (
                                <span className="text-[#C1121F] font-bold">Sold Out</span>
                              )}
                            </td>
                          ))}
                        </tr>
                        {/* Row: Action CTAs */}
                        <tr>
                          <td className="p-3 bg-editorial-gray/25 border-r border-editorial-charcoal/10 font-mono text-[9px] text-[#C1121F] font-bold">Direct Basket</td>
                          {comparedProducts.map((p) => (
                            <td key={p.id} className="p-3 border-r border-editorial-charcoal/10 last:border-r-0 text-center">
                              {p.stock > 0 ? (
                                <button
                                  onClick={() => {
                                    addToCart(p, 1);
                                    onOpenCart?.();
                                  }}
                                  className="bg-editorial-charcoal hover:bg-[#C1121F] text-editorial-cream hover:text-white transition-all w-full py-2 px-1 text-[9px] font-mono uppercase tracking-widest font-black rounded-none shadow-3xs cursor-pointer"
                                >
                                  Add to Basket
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  disabled
                                  className="bg-stone-100 text-stone-400 border border-stone-200/50 w-full py-2 px-1 text-[9px] font-mono uppercase text-center cursor-not-allowed"
                                >
                                  Sold Out
                                </button>
                              )}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-editorial-charcoal/15 bg-white flex items-center justify-between">
              <span className="text-[9px] font-mono uppercase tracking-widest text-stone-400 font-bold">
                * Features synced directly with master fermentation catalog
              </span>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="px-5 py-2.5 bg-editorial-charcoal hover:bg-[#C1121F] text-editorial-cream hover:text-white text-xs font-mono uppercase tracking-widest font-black rounded-none shadow-sm cursor-pointer transition-all"
              >
                Dismiss Features Panel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
