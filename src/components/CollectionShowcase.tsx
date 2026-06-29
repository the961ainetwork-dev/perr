import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Product } from "../types";
import { 
  Search, 
  ShoppingBag, 
  Check, 
  Flame, 
  Sparkles, 
  Heart, 
  RefreshCw, 
  ArrowLeft, 
  Clock, 
  ShieldAlert, 
  Info, 
  Percent, 
  Star, 
  Share2, 
  BadgeHelp,
  ChevronRight,
  Truck,
  FileText
} from "lucide-react";
import { motion } from "motion/react";

interface CollectionShowcaseProps {
  onOpenCart: () => void;
}

export default function CollectionShowcase({ onOpenCart }: CollectionShowcaseProps) {
  const { addToCart, addToast } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "pickle" | "pepper" | "oil" | "starter">("all");
  
  // High-fidelity local states for the interactive detailed view
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [caseQuantity, setCaseQuantity] = useState<number>(1);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false);
  const [activeMainImage, setActiveMainImage] = useState<string | null>(null);

  // The 15 master products from the uploaded HamodWHarr brand labels
  const showcaseProducts: Product[] = [
    {
      id: "showcase-1",
      name: "Fermented Bloody Mary Pickles",
      description: "We've all heard of putting pickles in a Bloody Mary, but why not put Bloody Mary ingredients in some pickles?! Full of probiotic power, aged to pure tangy perfection.",
      price: 10.99,
      category: "pickle",
      image: "/assets/input_file_1.png",
      spiceLevel: "Medium",
      stock: 60,
      rating: 4.9,
      reviewsCount: 38,
      ingredients: ["Fresh Cucumbers", "Vineripe Tomatoes", "Horseradish Root", "Celery Seeds", "Fresh Garlic", "Black Peppercorns", "Sea Salt", "Purified Water", "Active Probiotic Cultures"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Probiotic", "Bloody Mary", "Tangy", "Levantine Tradition"],
      size: "16 oz Jar",
    },
    {
      id: "showcase-2",
      name: "Fermented Beets",
      description: "A symphony of spices, sweetness, and unbeatable crispness. The perfect harmony of sweet, sour, and satisfying crunch from active lacto-fermented beetroot.",
      price: 9.49,
      category: "pickle",
      image: "/assets/input_file_2.png",
      spiceLevel: "None",
      stock: 45,
      rating: 4.8,
      reviewsCount: 22,
      ingredients: ["Organic Red Beetroots", "Sliced Carrots", "Fresh Garlic", "Rosemary Sprigs", "Peppery Mash", "Spring Water", "Ancient Sea Salt", "Probiotic Enzymes"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Vitamins", "Heart Health", "Sweet & Sour", "Unbeatable Crispness"],
      size: "14 oz Jar",
    },
    {
      id: "showcase-3",
      name: "Fermented Hot Sauce",
      description: "A symphony of spices, sweetness, and unbeatable crispness. Features several beneficial vitamins, minerals, and capsaicin components that improve gut and heart health.",
      price: 8.99,
      category: "pepper",
      image: "/assets/input_file_3.png",
      spiceLevel: "Hot",
      stock: 40,
      rating: 4.9,
      reviewsCount: 54,
      ingredients: ["Fermented Red Chilies", "Jalapenos", "Garlic Cloves", "Sea Salt", "Apple Cider Vinegar", "Wild Levant Spices", "Cultured Starter"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Capsaicin", "Metabolism Boost", "Fiery", "Living Probiotics"],
      size: "8 oz Bottle",
    },
    {
      id: "showcase-4",
      name: "Fermented Cucumbers",
      description: "Tangy, crunchy, and packed with dill, garlic, and pickling spice. Zero Vinegar. 100% Natural Probiotic Power. Raw, Unpasteurized, and Packed with Gut-Friendly Goodness.",
      price: 9.99,
      category: "pickle",
      image: "/assets/input_file_4.png",
      spiceLevel: "None",
      stock: 75,
      rating: 4.9,
      reviewsCount: 61,
      ingredients: ["Crisp Cucumbers", "Fresh Dill Sprigs", "Garlic Cloves", "Mustard Seeds", "Black Peppercorns", "Bay Leaves", "Sea Salt", "Mineral Water"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Zero Vinegar", "Dill & Garlic", "Probiotic Power", "Raw & Living"],
      size: "16 oz Jar",
    },
    {
      id: "showcase-5",
      name: "Pickled Special Carrots and Peppers",
      description: "Electric and packed with deep, tangy flavor notes. This isn't just a pickle; it's a bridge to our roots. Crisp, gut-friendly, and steeped in aromatic spices.",
      price: 8.49,
      category: "pepper",
      image: "/assets/input_file_5.png",
      spiceLevel: "Medium",
      stock: 35,
      rating: 4.7,
      reviewsCount: 16,
      ingredients: ["Vibrant Carrots", "Sweet Bell Peppers", "Red Cabbage", "Wild Thyme", "Sesame Seeds", "Coriander", "Vinegar Brine"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Heritage Recipe", "Aromatic Spices", "Beta-Carotene", "Deep Tang"],
      size: "12 oz Jar",
    },
    {
      id: "showcase-6",
      name: "Special Pickled Thyme, Mustard Seeds, and Carrots",
      description: "Steeped in authentic Levantine preservation techniques, every jar delivers a bright, gut-friendly snap that connects modern wellness with raw, time-honored hospitality.",
      price: 11.49,
      category: "pickle",
      image: "/assets/input_file_6.png",
      spiceLevel: "Mild",
      stock: 30,
      rating: 5.0,
      reviewsCount: 29,
      ingredients: ["Fresh Wild Thyme", "Whole Mustard Seeds", "Sliced Carrots", "Green Cucumbers", "Red Peppers", "Garlic", "Levantine Salt Brine"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Thyme Extract", "Levantine Hospitality", "Immune Defense", "Crisp Snap"],
      size: "14 oz Jar",
    },
    {
      id: "showcase-7",
      name: "Jalapeño & Red Bell Pepper",
      description: "A beautifully balanced recipe that pairs the sharp kick of jalapeños with the juicy sweetness of red bell peppers. A perfect balance of tang and crunch.",
      price: 9.29,
      category: "pepper",
      image: "/assets/input_file_7.png",
      spiceLevel: "Hot",
      stock: 42,
      rating: 4.8,
      reviewsCount: 33,
      ingredients: ["Sliced Jalapeno Peppers", "Sweet Red Bell Peppers", "Red Onions", "Garlic", "Cabbage", "Sea Salt", "Vinegar", "Organic Spices"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Jalapeno Kick", "Antioxidants", "Juicy Sweetness", "Fiery Tang"],
      size: "12 oz Jar",
    },
    {
      id: "showcase-8",
      name: "Onion To Top",
      description: "An authentic Lebanese kick with some extra heat and earthy flavors. A perfect balance of tang, cabbage, caraway seeds, and robust onion slices.",
      price: 8.99,
      category: "pickle",
      image: "/assets/input_file_8.png",
      spiceLevel: "Medium",
      stock: 50,
      rating: 4.8,
      reviewsCount: 25,
      ingredients: ["Pearl Red Onions", "Red Cabbage", "Sesame Seeds", "Black Caraway", "Hot Red Chili Flakes", "Garlic", "Vinegar", "Himalayan Sea Salt"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Lebanese Kick", "Caraway Infused", "Earthy Flavor", "Prebiotic Fibers"],
      size: "10 oz Jar",
    },
    {
      id: "showcase-9",
      name: "Jalapeños Escabeche Gourmet Style",
      description: "Consider the jalapeño escabeche recipe as a side dish. It can accompany any of your best dishes. Think tacos, enchiladas, or delicious premium burgers!",
      price: 9.79,
      category: "pepper",
      image: "/assets/input_file_9.png",
      spiceLevel: "Hot",
      stock: 38,
      rating: 4.9,
      reviewsCount: 41,
      ingredients: ["Whole Jalapeno Peppers", "Sliced Carrots", "Yellow Onions", "Garlic Bulbs", "Apple Cider Vinegar", "Dried Oregano", "Bay Leaves", "Olive Oil"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Escabeche Style", "Taco Companion", "Spicy Side", "Olive Oil Base"],
      size: "16 oz Jar",
    },
    {
      id: "showcase-10",
      name: "Effervescent Probiotic Lemonade",
      description: "This isn't just lemonade; it's a living, breathing ecosystem in a glass. Transforming the classic Lebanese summer staple into a raw, probiotic engine.",
      price: 6.99,
      category: "starter",
      image: "/assets/input_file_10.png",
      spiceLevel: "None",
      stock: 80,
      rating: 5.0,
      reviewsCount: 72,
      ingredients: ["Freshly Squeezed Lemons", "Organic Ginger Root", "Cane Sugar (consumed by cultures)", "Active Probiotic Starter Culture", "Pure Spring Water"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Effervescent", "Lebanese Lemonade", "Ginger Spike", "Sparkling Hydration"],
      size: "12 oz Glass Bottle",
    },
    {
      id: "showcase-11",
      name: "Makdous Al Zaytoun",
      description: "A much-appreciated side dish that makes presence in every meal; a step further they are a rich, harmonious, and highly interesting Levantine appetizer.",
      price: 12.99,
      category: "oil",
      image: "/assets/input_file_11.png",
      spiceLevel: "Medium",
      stock: 28,
      rating: 4.9,
      reviewsCount: 19,
      ingredients: ["Baby Eggplants", "Chopped Walnuts", "Garlic Cloves", "Jalapeno Green & Red Chilies", "Extra Virgin Olive Oil", "Sea Salt"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Traditional Side", "Walnut Stuffed", "Olive Oil Soak", "Appetizer"],
      size: "14 oz Jar",
    },
    {
      id: "showcase-12",
      name: "Makdous (The Jewel of the Levantine Pantry)",
      description: "Hand-stuffed with crushed walnuts, sharp garlic, and vibrant peppers, then submerged in pure, cold-pressed olive oil. A heavy, luxurious bite designed to anchor the breakfast table.",
      price: 13.49,
      category: "oil",
      image: "/assets/input_file_12.png",
      secondaryImage: "/assets/input_file_0.png",
      spiceLevel: "Medium",
      stock: 30,
      rating: 5.0,
      reviewsCount: 47,
      ingredients: ["Heirloom Baby Eggplants", "Fresh Walnuts", "Red Bell Peppers", "Garlic Cloves", "Cold-Pressed Olive Oil", "Sea Salt"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Levantine Jewel", "Luxurious Bite", "Cold-Pressed Oil", "Traditional Masterpiece"],
      size: "16 oz Jar",
    },
    {
      id: "showcase-13",
      name: "Ogórki Kiszone Polish Style Cucumbers",
      description: "Naturally Fermented for a Happy Gut and a Bold Bite. Zero Vinegar. 100% Natural Probiotic Power. Raw, Unpasteurized, and Packed with Gut-Friendly Goodness.",
      price: 10.49,
      category: "pickle",
      image: "/assets/input_file_13.png",
      spiceLevel: "None",
      stock: 48,
      rating: 4.9,
      reviewsCount: 31,
      ingredients: ["Whole Cucumbers", "Horseradish Root", "Garlic Bulbs", "Dill Crowns", "Cherry Leaves", "Oak Leaves", "Salt", "Purified Well Water"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Polish Style", "Zero Vinegar", "Wild Fermented", "Horseradish Kick"],
      size: "16 oz Jar",
    },
    {
      id: "showcase-14",
      name: "Oijangji Korean Style Cucumbers",
      description: "A structural integrity and deeply balanced flavor profile. Steeped in authentic Korean-style preservation and salt-pressing techniques for an unmatched crunch.",
      price: 10.99,
      category: "pickle",
      image: "/assets/input_file_14.png",
      spiceLevel: "Mild",
      stock: 44,
      rating: 4.8,
      reviewsCount: 15,
      ingredients: ["Crisp Kirby Cucumbers", "Coarse Sea Salt", "Sesame Oil", "Toasted Sesame Seeds", "Scallions", "Korean Chili Thread"],
      sellerName: "HamodWHarr Reserve",
      tags: ["Korean Style", "Salt-Pressed", "Sesame Aroma", "Maximum Crunch"],
      size: "12 oz Jar",
    },
    {
      id: "showcase-15",
      name: "Pickled Sweet Peppers Gourmet Style",
      description: "Ultimate Sandwich and BBQ Upgrade. An upgraded, nostalgic favorite, every jar is crafted for that quintessential sweet-and-sour balance.",
      price: 8.79,
      category: "pepper",
      image: "/assets/input_file_15.png",
      spiceLevel: "None",
      stock: 55,
      rating: 4.8,
      reviewsCount: 20,
      ingredients: ["Sweet Bell Peppers", "Organic Cane Sugar", "Distilled Vinegar", "Mustard Seeds", "Celery Seeds", "Coriander", "Bay Leaf"],
      sellerName: "HamodWHarr Reserve",
      tags: ["BBQ Upgrade", "Sweet & Sour", "Sandwich Topping", "Antioxidant Rich"],
      size: "14 oz Jar",
    }
  ];

  // Filters logic for broad catalog list
  const filteredProducts = showcaseProducts.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ingredients.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === "all" || p.category === activeFilter;

    return matchesSearch && matchesFilter;
  });

  // Toggle wishlist state
  const handleToggleWishlist = (id: string) => {
    if (wishlistedIds.includes(id)) {
      setWishlistedIds(prev => prev.filter(item => item !== id));
      addToast({
        title: "Removed from Wishlist",
        message: "Specimen removed from your private laboratory wishlist.",
        type: "success"
      });
    } else {
      setWishlistedIds(prev => [...prev, id]);
      addToast({
        title: "Added to Wishlist",
        message: "Specimen catalogued into your custom procurement wishlist.",
        type: "success"
      });
    }
  };

  // Trigger Detail View instead of direct cart insertion on initial Shop Now click
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setActiveMainImage(product.image);
    setCaseQuantity(1);
    setConfirmationModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle final purchase confirmation
  const handleConfirmAddToCart = (asWholesaleCase: boolean) => {
    if (!selectedProduct) return;
    
    // Calculate final price multiplier
    const finalProduct = { ...selectedProduct };
    if (asWholesaleCase) {
      finalProduct.price = parseFloat((selectedProduct.price * 12 * 0.85).toFixed(2)); // 15% discount
      finalProduct.name = `${selectedProduct.name} [Wholesale Case of 12]`;
    }

    addToCart(finalProduct, caseQuantity);
    
    addToast({
      title: "Basket Updated",
      message: `${caseQuantity}x ${finalProduct.name} added.`,
      type: "success"
    });

    setConfirmationModal(true);
  };

  // Get similar items from category
  const relatedProducts = selectedProduct
    ? showcaseProducts
        .filter((item) => item.category === selectedProduct.category && item.id !== selectedProduct.id)
        .slice(0, 3)
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10" id="collection-showcase-zone">
      
      {/* -------------------- DETAIL VIEW MODE -------------------- */}
      {selectedProduct ? (
        <div className="space-y-12 animate-in fade-in duration-300" id="product-detailed-page">
          
          {/* Breadcrumb / Navigation bar */}
          <div className="flex flex-wrap items-center justify-between border-b border-editorial-charcoal/20 pb-4">
            <button 
              onClick={() => {
                setSelectedProduct(null);
                setConfirmationModal(false);
              }}
              className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-editorial-charcoal hover:text-[#C1121F] transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-[#C1121F]" />
              <span>Back to Specimen Catalog</span>
            </button>

            <div className="flex items-center gap-1.5 text-xs text-editorial-charcoal/40 font-mono">
              <span>Hamod w Harr</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="capitalize">{selectedProduct.category}s</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-editorial-charcoal font-bold">{selectedProduct.name}</span>
            </div>
          </div>

          {/* Master Product Aesthetic Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Visual Showcase & Badging (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-4">
                <div className="border-4 border-editorial-charcoal bg-white relative aspect-square shadow-md overflow-hidden">
                  <img 
                    src={activeMainImage || selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Visual badges overlay */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-[#C1121F] text-white text-[9px] font-mono uppercase tracking-widest font-black px-2.5 py-1">
                      LAB SPECIMEN #{selectedProduct.id.split("-")[1]}
                    </span>
                    {selectedProduct.spiceLevel !== "None" && (
                      <span className="bg-editorial-charcoal text-white text-[9px] font-mono uppercase tracking-wider font-extrabold px-2 py-0.5 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#C1121F]" /> {selectedProduct.spiceLevel} Heat
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm border border-editorial-charcoal/30 px-3 py-1.5 font-mono text-[9px] text-editorial-charcoal uppercase tracking-widest">
                    Live Culture Certified
                  </div>
                </div>

                {/* Multi-angle Gallery Selector for Makdous or other items with secondary assets */}
                {selectedProduct.secondaryImage && (
                  <div className="grid grid-cols-2 gap-3" id="multi-angle-gallery">
                    <button
                      type="button"
                      onClick={() => setActiveMainImage(selectedProduct.image)}
                      className={`flex flex-col items-center gap-1.5 p-2 bg-stone-50 border transition-all hover:bg-stone-100 ${
                        activeMainImage === selectedProduct.image || !activeMainImage
                          ? "border-[#C1121F] bg-white ring-2 ring-[#C1121F]/10"
                          : "border-editorial-charcoal/20"
                      }`}
                    >
                      <div className="w-12 h-12 overflow-hidden border border-editorial-charcoal/10 bg-white">
                        <img src={selectedProduct.image} alt="Artisanal label" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-tight text-editorial-charcoal uppercase">
                        Artisanal Label
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMainImage(selectedProduct.secondaryImage)}
                      className={`flex flex-col items-center gap-1.5 p-2 bg-stone-50 border transition-all hover:bg-stone-100 ${
                        activeMainImage === selectedProduct.secondaryImage
                          ? "border-[#C1121F] bg-white ring-2 ring-[#C1121F]/10"
                          : "border-editorial-charcoal/20"
                      }`}
                    >
                      <div className="w-12 h-12 overflow-hidden border border-editorial-charcoal/10 bg-white">
                        <img src={selectedProduct.secondaryImage} alt="Premium bottle" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <span className="text-[10px] font-mono font-bold tracking-tight text-editorial-charcoal uppercase">
                        Premium Bottle
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {/* Lab Certification / Technical Spec Box */}
              <div className="border-2 border-editorial-charcoal p-4 bg-stone-50 space-y-3">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-editorial-charcoal flex items-center gap-1.5 border-b border-editorial-charcoal/15 pb-2">
                  <Clock className="w-4 h-4 text-editorial-green" /> Living Ferment Assay Data
                </h4>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono text-editorial-charcoal/80">
                  <div>
                    <span className="block text-[8px] uppercase text-editorial-charcoal/40 font-bold">Standard Size</span>
                    <span className="font-bold">{selectedProduct.size} Glass Jar</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-editorial-charcoal/40 font-bold">Fermenting Span</span>
                    <span>10 - 14 Days</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-editorial-charcoal/40 font-bold">Target pH Range</span>
                    <span className="font-mono">3.4 - 3.7 pH</span>
                  </div>
                  <div>
                    <span className="block text-[8px] uppercase text-editorial-charcoal/40 font-bold">Active Microflora</span>
                    <span className="text-[10px]">L. plantarum, L. brevis</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Literary Specs, Pricing & Purchase Suite (7 cols) */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C1121F] font-bold block mb-2">
                  HAMOD W HARR ARTISANAL RESERVE
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-black text-editorial-charcoal leading-tight">
                  {selectedProduct.name}
                </h2>
                <div className="flex items-center gap-4 mt-3 text-xs font-mono">
                  <div className="flex items-center gap-1 text-editorial-charcoal/60">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span className="font-bold text-editorial-charcoal">{selectedProduct.rating}</span>
                    <span>({selectedProduct.reviewsCount} gourmet evaluations)</span>
                  </div>
                  <span>•</span>
                  <span className="text-[#C1121F] font-bold uppercase tracking-wider">In Stock &amp; Raw Active</span>
                </div>
              </div>

              {/* Expanded Literary Description & Marketing Pitch */}
              <div className="space-y-4">
                <p className="text-base text-editorial-charcoal/90 leading-relaxed font-serif">
                  We present this exquisite culinary specimen to discerning palates. Utilizing a centuries-old Levantine methodology passed down through generational households, this batch relies entirely on dry-salting and water-pressing methods. We introduce zero artificial acetic acid (vinegar) in our core pickle recipes—relying purely on wild, lacto-fermented acids to achieve an deep, multi-layered sour snap that cannot be replicated by factory food mechanics.
                </p>
                <div className="bg-[#C1121F]/5 border-l-4 border-[#C1121F] p-4 font-sans text-sm text-editorial-charcoal/85">
                  <span className="font-mono text-[10px] uppercase font-bold text-[#C1121F] block mb-1">Curation Heritage Note</span>
                  "{selectedProduct.description}"
                </div>
              </div>

              {/* Ingredients & Benefits Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-editorial-charcoal/15">
                <div>
                  <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-editorial-charcoal mb-2">
                    Verified Raw Botanical Bill:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.ingredients.map((ing, idx) => (
                      <span key={idx} className="text-[10px] bg-editorial-gray/60 border border-editorial-charcoal/10 px-2.5 py-1 font-mono text-editorial-charcoal">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-[#C1121F] mb-2">
                    Beneficial Properties:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-editorial-charcoal">
                    {selectedProduct.tags.map((tag, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-editorial-green" />
                        <span>{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* WooCommerce Interactive Procurement Suite */}
              <div className="border-4 border-editorial-charcoal p-6 bg-white space-y-6">
                
                {/* Pricing & Wholeseller Toggle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-editorial-charcoal/15 pb-4">
                  <div>
                    <span className="text-[9px] font-mono uppercase text-editorial-charcoal/40 font-bold block mb-1">Artisanal Price</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-serif font-black text-editorial-charcoal">
                        ${selectedProduct.price.toFixed(2)}
                      </span>
                      <span className="text-xs text-editorial-charcoal/50 font-mono">per standard {selectedProduct.size} jar</span>
                    </div>
                  </div>

                  <div className="bg-stone-50 border border-editorial-charcoal/15 p-2 px-3 text-xs font-mono text-right">
                    <span className="text-[#C1121F] font-bold flex items-center gap-1 justify-end">
                      <Percent className="w-3.5 h-3.5" /> Save 15% with Cases!
                    </span>
                    <span className="text-[9px] text-editorial-charcoal/50 block">Get 12 jars packed in cedar straw</span>
                  </div>
                </div>

                {/* Case quantity Selector & Procurement triggers */}
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs uppercase font-bold text-editorial-charcoal">Quantity:</span>
                    <div className="flex border border-editorial-charcoal">
                      <button 
                        onClick={() => setCaseQuantity(Math.max(1, caseQuantity - 1))}
                        className="px-3 py-1 bg-stone-100 hover:bg-stone-200 border-r border-editorial-charcoal font-bold text-sm"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-white font-mono font-bold text-sm flex items-center">{caseQuantity}</span>
                      <button 
                        onClick={() => setCaseQuantity(caseQuantity + 1)}
                        className="px-3 py-1 bg-stone-100 hover:bg-stone-200 border-l border-editorial-charcoal font-bold text-sm"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleToggleWishlist(selectedProduct.id)}
                      className={`ml-auto p-2 border border-editorial-charcoal hover:bg-red-50 transition-colors ${
                        wishlistedIds.includes(selectedProduct.id) ? "bg-red-50 text-[#C1121F]" : "text-editorial-charcoal"
                      }`}
                      title="Add specimen to wishlist"
                    >
                      <Heart className={`w-5 h-5 ${wishlistedIds.includes(selectedProduct.id) ? "fill-[#C1121F]" : ""}`} />
                    </button>
                  </div>

                  {/* Actions buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <button
                      onClick={() => handleConfirmAddToCart(false)}
                      className="bg-[#C1121F] hover:bg-editorial-charcoal text-white font-mono text-xs font-bold uppercase tracking-widest py-3 px-6 transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Buy Individual Jars</span>
                    </button>

                    <button
                      onClick={() => handleConfirmAddToCart(true)}
                      className="bg-white hover:bg-editorial-charcoal hover:text-white text-editorial-charcoal border-2 border-editorial-charcoal font-mono text-xs font-bold uppercase tracking-widest py-3 px-6 transition-all flex items-center justify-center gap-2"
                    >
                      <Percent className="w-4 h-4 text-editorial-green" />
                      <span>Buy Wholesale Case (12x)</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Confirmation Message & Workflow Router */}
                {confirmationModal && (
                  <div className="border border-editorial-green bg-editorial-green/5 p-4 space-y-3 animate-in slide-in-from-bottom-2 duration-200" id="post-procure-router">
                    <div className="flex items-center gap-2 text-editorial-green text-xs font-mono font-bold">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>Specimen locked &amp; allocated in your temporary basket!</span>
                    </div>
                    <p className="text-xs text-editorial-charcoal/70">
                      Would you like to complete this procurement transaction right now, or continue exploring the Hamod w Harr master directory?
                    </p>
                    <div className="flex flex-wrap gap-2.5 pt-1">
                      <button
                        onClick={onOpenCart}
                        className="bg-editorial-charcoal text-white text-[9px] font-mono font-bold uppercase tracking-wider px-3.5 py-2 hover:bg-[#C1121F] transition-all"
                      >
                        Move to Cart &amp; Checkout
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(null);
                          setConfirmationModal(false);
                        }}
                        className="border border-editorial-charcoal text-editorial-charcoal text-[9px] font-mono font-bold uppercase tracking-wider px-3.5 py-2 hover:bg-stone-50 transition-all"
                      >
                        Do More Shopping
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Gastronomic Pairing & Serving Guide */}
              <div className="bg-stone-50 border border-editorial-charcoal/10 p-5 space-y-3">
                <span className="text-[10px] font-mono uppercase tracking-widest font-black text-editorial-green block">
                  GASTRONOMIC PAIRING SUITE &amp; CHEF'S PROTOCOL
                </span>
                <p className="text-xs text-editorial-charcoal/80 leading-relaxed">
                  To experience the absolute peak complexity of Hamod w Harr ferments, slice very thin and rest at room temperature for 5 minutes prior to consumption. Excellent when draped over charcoal-fired kafta skewers, served alongside labneh drizzled with wild olive oil, or paired with high-fat, triple-crème artisanal cheeses.
                </p>
              </div>

            </div>

          </div>

          {/* Related / Suggested Specimens Section (WooCommerce Feature) */}
          <div className="border-t-2 border-editorial-charcoal pt-10" id="related-specimens-suite">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-editorial-charcoal/40 font-bold block">RECOMMENDED SYNERGIES</span>
                <h3 className="font-serif text-xl font-bold text-editorial-charcoal">Related Culinary Specimens</h3>
              </div>
              <span className="text-[10px] font-mono uppercase text-[#C1121F] font-bold">PROBIOTIC DIVERSITY REC</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => handleProductClick(p)}
                  className="bg-white border border-editorial-charcoal/20 p-4 hover:border-editorial-charcoal transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="aspect-video w-full overflow-hidden bg-editorial-gray border border-editorial-charcoal/10">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[8px] font-mono uppercase text-editorial-charcoal/40">{p.size} jar</span>
                      <h4 className="font-serif text-sm font-bold text-editorial-charcoal group-hover:text-[#C1121F] transition-colors line-clamp-1">{p.name}</h4>
                    </div>
                    <p className="text-[11px] text-editorial-charcoal/60 line-clamp-2 leading-relaxed">"{p.description}"</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-dashed border-editorial-charcoal/10 mt-3">
                    <span className="font-serif font-black text-xs text-editorial-charcoal">${p.price.toFixed(2)}</span>
                    <span className="text-[8.5px] font-mono uppercase font-bold text-[#C1121F] flex items-center gap-0.5">
                      Explore Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : (
        /* -------------------- CATALOG LIST MODE -------------------- */
        <div className="space-y-12 animate-in fade-in duration-300">
          
          {/* Editorial Brand Banner */}
          <div className="border-4 border-editorial-charcoal p-6 sm:p-10 bg-white relative overflow-hidden text-center" id="brand-heritage-hero">
            <div className="absolute top-0 right-0 p-4 font-mono text-[9px] text-editorial-charcoal/30 uppercase tracking-widest hidden md:block">
              Official Master Catalog — Specimen Collection
            </div>
            
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#C1121F] font-extrabold block mb-3">
              ESTABLISHED IN TRADITIONAL SOUR &amp; SPICY CRAFT
            </span>
            
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-editorial-charcoal tracking-tight mb-4">
              HAMOD W HARR
            </h1>
            
            <p className="max-w-3xl mx-auto text-sm leading-relaxed text-editorial-charcoal/80 font-sans border-t border-b border-editorial-charcoal/10 py-5 my-5">
              Welcome to the ultimate intersection of sour complexity and spicy heat. Guided by the rich tradition of Levantine preservation and modern probiotic science, we present our complete 15-specimen master collection. Click any specimen's <strong className="text-[#C1121F]">Shop Now</strong> trigger to inspect its laboratory assay sheet, full biological ingredients list, and place gourmet orders.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono uppercase tracking-wider text-editorial-charcoal/60 mt-4">
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-editorial-green" /> 100% Raw &amp; Living</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-editorial-green" /> Levantine Traditional Methods</span>
              <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-editorial-green" /> Zero Fillers or Artificial Vinegar</span>
            </div>
          </div>

          {/* Interactive Controls Panel */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-editorial-gray/40 border border-editorial-charcoal/10 p-4" id="showcase-controls">
            {/* Category Switches */}
            <div className="flex flex-wrap gap-2">
              {(["all", "pickle", "pepper", "oil", "starter"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider border transition-all ${
                    activeFilter === cat
                      ? "bg-editorial-charcoal text-white border-editorial-charcoal"
                      : "bg-white text-editorial-charcoal border-editorial-charcoal/15 hover:bg-editorial-gray"
                  }`}
                >
                  {cat === "all" ? "All Showcase" : cat + "s"}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="w-full md:w-80 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-charcoal/40" />
              <input
                type="text"
                placeholder="Search by ingredients, tags, or names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-editorial-charcoal/20 text-xs font-mono text-editorial-charcoal focus:outline-none focus:border-[#C1121F]"
              />
            </div>
          </div>

          {/* Grid List of 15 Master Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="showcase-products-grid">
            {filteredProducts.map((p) => {
              return (
                <div 
                  key={p.id}
                  className="bg-white border-2 border-editorial-charcoal hover:shadow-lg transition-all flex flex-col justify-between"
                  id={`showcase-card-${p.id}`}
                >
                  {/* Image & Header */}
                  <div>
                    <div className="relative aspect-video w-full overflow-hidden bg-editorial-gray border-b border-editorial-charcoal">
                      <img 
                        src={p.image} 
                        alt={p.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-2.5 right-2.5 bg-editorial-charcoal text-editorial-cream text-[8.5px] font-mono uppercase tracking-widest font-bold py-1 px-2">
                        {p.size}
                      </div>
                      {p.spiceLevel !== "None" && (
                        <div className="absolute bottom-2.5 left-2.5 bg-[#C1121F] text-white text-[8px] font-mono uppercase font-black tracking-widest py-1 px-2 flex items-center gap-1">
                          <Flame className="w-3 h-3" /> {p.spiceLevel} Heat
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-4">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-widest text-editorial-charcoal/40 block leading-none mb-1.5">
                          {p.category} specimen
                        </span>
                        <h3 className="font-serif text-xl font-bold text-editorial-charcoal leading-tight">
                          {p.name}
                        </h3>
                      </div>

                      {/* Brand Marketing Message (Quote style) */}
                      <blockquote className="border-l-2 border-[#C1121F] pl-3 text-xs text-editorial-charcoal/70 font-sans leading-relaxed py-0.5">
                        "{p.description}"
                      </blockquote>

                      {/* Ingredients Section */}
                      <div className="pt-2 border-t border-editorial-charcoal/10">
                        <span className="text-[9px] font-mono uppercase text-editorial-charcoal/40 font-bold tracking-wider block mb-1.5">
                          Specimen Ingredients:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {p.ingredients.slice(0, 4).map((ing, idx) => (
                            <span 
                              key={idx}
                              className="text-[9.5px] bg-editorial-gray text-editorial-charcoal/90 border border-editorial-charcoal/5 px-2 py-0.5 font-mono"
                            >
                              {ing}
                            </span>
                          ))}
                          {p.ingredients.length > 4 && (
                            <span className="text-[9px] text-[#C1121F] font-mono font-bold self-center">
                              +{p.ingredients.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Health Benefits Section */}
                      <div className="pt-2 border-t border-editorial-charcoal/10">
                        <span className="text-[9px] font-mono uppercase text-[#C1121F] font-bold tracking-wider block mb-2">
                          Medicinal &amp; Culinary Benefits:
                        </span>
                        <ul className="space-y-1 text-xs text-editorial-charcoal/85">
                          {p.tags.slice(0, 2).map((tag, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3.5 h-3.5 text-editorial-green shrink-0 mt-0.5" />
                              <span>{tag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Price & Shop Now Footer */}
                  <div className="p-5 pt-0">
                    <div className="flex items-center justify-between pt-4 border-t-2 border-dashed border-editorial-charcoal/15 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono uppercase text-editorial-charcoal/40 font-bold leading-none mb-1">
                          MSRP price
                        </span>
                        <span className="text-lg font-serif font-black text-editorial-charcoal">
                          ${p.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleProductClick(p)}
                        className="bg-[#C1121F] hover:bg-editorial-charcoal text-white font-mono text-[10px] font-bold uppercase tracking-widest py-2.5 px-4 rounded-none transition-all flex items-center gap-1.5 shrink-0"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Shop Now</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State when zero results */}
          {filteredProducts.length === 0 && (
            <div className="border-2 border-dashed border-editorial-charcoal/20 p-12 text-center bg-white space-y-2">
              <p className="font-serif text-lg text-editorial-charcoal/60">No specimen matched your criteria.</p>
              <p className="text-[10px] font-mono text-editorial-charcoal/40 uppercase tracking-widest">Try clearing filters or looking up broad terms like "Cucumbers"</p>
            </div>
          )}

        </div>
      )}

      {/* -------------------- MANDATORY T&C POLICY FOOTER SECTION -------------------- */}
      <div className="border-t-4 border-editorial-charcoal mt-16 pt-8 bg-stone-50 p-6 md:p-10 space-y-6" id="procurement-terms-and-conditions">
        <div className="flex items-center gap-2 border-b border-editorial-charcoal/15 pb-4">
          <FileText className="w-5 h-5 text-[#C1121F]" />
          <h3 className="font-serif text-lg font-bold text-editorial-charcoal uppercase tracking-wider">
            Terms &amp; Conditions of Artisanal Online Procurement
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-editorial-charcoal/80 leading-relaxed font-sans">
          
          <div className="space-y-2">
            <h4 className="font-mono text-[10px] font-bold uppercase text-[#C1121F] tracking-wider">
              1. Live &amp; Unpasteurized Culture Warning
            </h4>
            <p>
              All Hamod w Harr specimens are completely raw, unpasteurized, and actively fermenting live food items. Naturally occurring pressure, effervescence, and slight liquid leakage around the lid are fully expected indicators of active, healthy probiotic microflora. Refrigerate immediately upon receipt to stabilize carbonation and slow organic acid generation.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-[10px] font-bold uppercase text-editorial-charcoal tracking-wider">
              2. Logistics &amp; Thermal Protection
            </h4>
            <p>
              Due to the living biology of our Levantine specimens, shipments are fulfilled inside insulated cellulose shells containing organic ice packs. The buyer is responsible for retrieving shipped parcels promptly. Hamod w Harr holds no liability for specimens left under extreme temperatures or sunlight for more than 4 hours post-delivery.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-mono text-[10px] font-bold uppercase text-editorial-charcoal tracking-wider">
              3. Refund &amp; Specimen Substitution Policy
            </h4>
            <p>
              Since our food items are active cultures, all sales are final once transit has initialized. If a jar suffers terminal structural breakdown during shipping, contact our registry portal within 24 hours with a photographic specimen code to receive a complimentary replacement or instant ledger credit.
            </p>
          </div>

        </div>

        <div className="border-t border-editorial-charcoal/15 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] font-mono text-editorial-charcoal/50 uppercase tracking-wider">
          <span>Official Hamod w Harr Gazette Legal Registry</span>
          <span>Last Updated: June 2026</span>
        </div>
      </div>

    </div>
  );
}
