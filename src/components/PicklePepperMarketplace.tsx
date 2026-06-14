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
}

export default function PicklePepperMarketplace({ onSelectRecipe, onSetTab, categoryFilter = "all", onOpenCart }: MarketplaceProps) {
  const { products, recipes, reviews, addReview, addToCart, wishlist, toggleWishlist, headerSearchQuery, setHeaderSearchQuery } = useApp();

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
  
  // Tab within Product Details Modal
  const [modalTab, setModalTab] = useState<"details" | "ingredients" | "reviews" | "recipes">("details");
  
  // Custom Review Form State
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Synchronize category selection if prop is toggled by Hero click
  React.useEffect(() => {
    if (categoryFilter !== "all") {
      setSelectedCategory(categoryFilter);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryFilter]);

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
    <div className="max-w-7xl mx-auto px-6 pb-20" id="marketplace-zone">
      
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
              <option value="rating">Top Rated Reviews</option>
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

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
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
            className="mt-6 px-5 py-3 bg-editorial-charcoal text-editorial-cream rounded-none text-xs font-mono uppercase tracking-widest font-bold hover:bg-editorial-charcoal/90 transition-all"
          >
            View All Marketplace Batches
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="product-grid">
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
                      className="font-serif text-base font-bold text-editorial-charcoal hover:text-editorial-red leading-tight line-clamp-1 cursor-pointer italic"
                    >
                      {p.name}
                    </h3>
                    <p className="text-stone-500 text-xs line-clamp-2 h-8 font-sans leading-relaxed">
                      {p.description}
                    </p>
                  </div>

                  {/* Rating summary */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <div className="flex text-editorial-red">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < Math.floor(p.rating) ? "fill-current" : "text-stone-200"}`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-editorial-charcoal font-sans">{p.rating}</span>
                    <span className="text-[9px] text-[#1A1A1A]/40 uppercase font-mono tracking-wide">({p.reviewsCount} reviews)</span>
                  </div>

                  {/* Line partition */}
                  <div className="border-t border-editorial-charcoal/10 pt-4 flex items-center justify-between">
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
                        className="bg-editorial-charcoal text-editorial-cream border border-editorial-charcoal p-2.5 rounded-none font-mono uppercase tracking-widest text-[10px] hover:bg-editorial-red hover:border-editorial-red transition-all shadow-2xs"
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
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
                    <h2 className="font-serif text-2xl font-black text-editorial-charcoal mt-1 italic">{selectedProduct.name}</h2>
                    <span className="text-xs text-editorial-charcoal/50 block mt-1">
                      {selectedProduct.isDropshipped ? (
                        <>Import &amp; curation direct from farm crop: <span className="text-[#C1121F] font-black">{selectedProduct.supplierName}</span></>
                      ) : (
                        <>Fermentation craft by certified master: <span className="text-editorial-charcoal font-bold">{selectedProduct.sellerName}</span></>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-serif font-black text-editorial-red">${selectedProduct.price.toFixed(2)}</span>
                    <span className="text-xs text-[#1A1A1A]/50 pl-4 border-l border-editorial-charcoal/15 font-mono">Vol: <span className="text-[#1A1A1A] font-bold">{selectedProduct.size || "16 oz Jar"}</span></span>
                    <span className={`text-xs ml-auto font-mono uppercase tracking-wider font-bold ${selectedProduct.stock > 10 ? "text-editorial-green" : "text-[#C1121F] animate-pulse"}`}>
                      {selectedProduct.stock > 0 ? `Stock: ${selectedProduct.stock}` : "Sold Out"}
                    </span>
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

    </div>
  );
}
