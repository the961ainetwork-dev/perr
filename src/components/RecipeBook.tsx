import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Recipe, Product } from "../types";
import { Search, Flame, Clock, Award, CheckCircle2, ShoppingCart, ArrowLeft, ArrowRight, User, Plus, Check, X, Printer, Star, Atom, Calculator, MessageSquare, Send, HelpCircle, Sparkles } from "lucide-react";

interface RecipeBookProps {
  onSetTab: (tab: string) => void;
  selectedRecipeId?: string | null;
  onClearSelectedRecipe?: () => void;
  onOpenCart?: () => void;
}

export default function RecipeBook({ onSetTab, selectedRecipeId, onClearSelectedRecipe, onOpenCart }: RecipeBookProps) {
  const { recipes, products, addToCart, recipeReviews, addRecipeReview } = useApp();

  // Selected recipe state
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

  // Recipe Review Form States
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedHeat, setSelectedHeat] = useState<string>("all");

  // Simulated premium data fetching loading state
  const [isLoading, setIsLoading] = useState(true);

  // Fermentation Science Lab & AI Advisor state variables
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [vegWeight, setVegWeight] = useState<number>(1000); // grams
  const [waterVolume, setWaterVolume] = useState<number>(1000); // ml
  const [salinityTarget, setSalinityTarget] = useState<number>(3.0); // % percentage
  const [vegType, setVegType] = useState<"cucumber" | "pepper" | "cabbage" | "other">("cucumber");
  
  const [chatLog, setChatLog] = useState<Array<{ role: "user" | "model"; text: string }>>([
    {
      role: "model",
      text: "Greetings, fellow fermenter! I am **The Brine Master**, your AI guide to exquisite lacto-fermentation. Adjust the salinity slider to examine salt grain values, or ask me anything about yeasts, soft textures, oak leaves, container seals, or spice indices below!"
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput;
    setChatInput("");
    
    // Add user message to log
    const updatedLog = [...chatLog, { role: "user" as const, text: userMsg }];
    setChatLog(updatedLog);
    setIsChatLoading(true);

    try {
      // Send chat log to express backend endpoint `/api/gemini/advisor`
      const res = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          previousMessages: updatedLog.slice(0, -1) // pass historical frames
        }),
      });

      const data = await res.json();
      
      setChatLog(prev => [...prev, { role: "model" as const, text: data.reply }]);
    } catch (err: any) {
      console.error(err);
      setChatLog(prev => [
        ...prev,
        { 
          role: "model" as const, 
          text: "❗ *Brine connection timeout.* The Brine Master is slightly delayed. Please make sure that your **Express Server is active** or check your secrets panels." 
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // short premium feel transition delay
    return () => clearTimeout(timer);
  }, [searchQuery, selectedDifficulty, selectedHeat]);

  // Sync with prop if navigated from a product link
  React.useEffect(() => {
    if (selectedRecipeId) {
      setActiveRecipeId(selectedRecipeId);
    }
  }, [selectedRecipeId]);

  const handleBackToList = () => {
    setActiveRecipeId(null);
    if (onClearSelectedRecipe) {
      onClearSelectedRecipe();
    }
  };

  const handleRecipeReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeRecipeId) return;
    addRecipeReview(activeRecipeId, reviewName, reviewRating, reviewComment);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 5000);
  };

  // Trending Now recipes: highest ratings, limit 3
  const trendingRecipes = useMemo(() => {
    return [...recipes]
      .filter((r) => r.approved && r.rating !== undefined && r.rating > 0)
      .sort((a, b) => {
        if ((b.rating || 0) !== (a.rating || 0)) {
          return (b.rating || 0) - (a.rating || 0);
        }
        return (b.reviewsCount || 0) - (a.reviewsCount || 0);
      })
      .slice(0, 3);
  }, [recipes]);

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      if (!r.approved) return false; // only approved by admin!

      const matchesSearch =
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDifficulty =
        selectedDifficulty === "all" || r.difficulty === selectedDifficulty;

      const matchesHeat =
        selectedHeat === "all" || r.spiceLevel === selectedHeat;

      return matchesSearch && matchesDifficulty && matchesHeat;
    });
  }, [recipes, searchQuery, selectedDifficulty, selectedHeat]);

  // Retrieve current active recipe
  const activeRecipe = useMemo(() => {
    if (!activeRecipeId) return null;
    return recipes.find((r) => r.id === activeRecipeId);
  }, [recipes, activeRecipeId]);

  // Find products associated with the active recipe
  const linkedProducts = useMemo(() => {
    if (!activeRecipe) return [];
    return products.filter((p) => activeRecipe.relatedProductIds.includes(p.id));
  }, [products, activeRecipe]);

  const getDifficultyColor = (diff: Recipe["difficulty"]) => {
    switch (diff) {
      case "Easy":
        return "bg-emerald-50 text-emerald-800 border-emerald-200/80";
      case "Advanced":
        return "bg-amber-50 text-amber-800 border-amber-200/80";
      case "Time-Intensive":
        return "bg-purple-50 text-purple-800 border-purple-200/80";
      default:
        return "bg-stone-50 text-stone-700 border-stone-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 text-editorial-charcoal" id="recipe-book-zone">
      
      {/* 1. RECIPE EXPANDED DETAIL PAGE */}
      {activeRecipe ? (
        <>
          {/* Action Toolbar on Screen */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4 print:hidden">
            {/* Back link */}
            <button
              id="back-to-recipes-btn"
              onClick={handleBackToList}
              className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest font-bold text-editorial-charcoal bg-editorial-gray hover:bg-white border border-editorial-charcoal/15 hover:border-editorial-charcoal px-4 py-2 transition-all rounded-none cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-editorial-red" />
              <span>Back to Artisan Guide Catalog</span>
            </button>

            {/* Print Recipe Button */}
            <button
              id="print-recipe-btn"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest font-bold text-[#FAF9F6] bg-[#C1121F] hover:bg-editorial-charcoal border border-transparent px-4 py-2.5 transition-all rounded-none cursor-pointer"
              title="Print clean text-only card of this recipe"
            >
              <Printer className="w-3.5 h-3.5 text-[#FAF9F6]" />
              <span>Print Recipe Card</span>
            </button>
          </div>

          {/* Interactive Screen Details wrapper (hidden during browser print) */}
          <div className="print:hidden space-y-8 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
            
            {/* Recipe Hero Masthead */}
          <div className="bg-editorial-charcoal text-editorial-cream rounded-none overflow-hidden relative border border-editorial-charcoal/40 min-h-[300px] flex items-end">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-editorial-charcoal/50 to-transparent z-10"></div>
            <img
              src={activeRecipe.image}
              alt={activeRecipe.title}
              className="absolute inset-0 w-full h-full object-cover opacity-45 pointer-events-none"
              referrerPolicy="no-referrer"
            />

            {/* Title / Meta block overlay */}
            <div className="relative z-20 p-6 md:p-10 space-y-4 max-w-4xl text-left">
              <div className="flex flex-wrap gap-2.5">
                <span className={`border px-2.5 py-0.5 text-[9px] font-bold font-mono uppercase tracking-wider ${getDifficultyColor(activeRecipe.difficulty)} bg-white/95 backdrop-blur-xs shadow-xs`}>
                  {activeRecipe.difficulty} Skill
                </span>
                <span className="bg-[#C1121F] text-editorial-cream border border-transparent px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                  🔥 {activeRecipe.spiceLevel} Spice Heat
                </span>
              </div>

              <h1 className="font-serif text-3xl md:text-5xl font-bold leading-tight tracking-tight italic text-white">
                {activeRecipe.title}
              </h1>

              <p className="text-stone-200 text-sm md:text-base leading-relaxed font-sans max-w-2xl">
                {activeRecipe.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-editorial-cream/15 text-stone-300 text-[10px] font-mono uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-editorial-red" />
                  <span>Curated by: <span className="text-white font-bold">{activeRecipe.author}</span></span>
                </div>
                {activeRecipe.rating !== undefined && activeRecipe.rating > 0 ? (
                  <div className="flex items-center gap-1">
                    <span className="text-amber-400 font-bold block text-sm leading-none -mt-1">★</span>
                    <span>Rating: <span className="text-white font-bold">{activeRecipe.rating.toFixed(1)} / 5.0 ({activeRecipe.reviewsCount})</span></span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-stone-400 font-bold block text-sm leading-none -mt-1">★</span>
                    <span>Rating: <span className="text-[#a59f99] font-bold">Unrated</span></span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-editorial-green" />
                  <span>Prep: <span className="text-white font-bold">{activeRecipe.prepTime}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-editorial-green" />
                  <span>Cook: <span className="text-white font-bold">{activeRecipe.cookTime}</span></span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout: Cooking on Left, Shopping on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Ingredients & Prep */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Ingredients Card */}
              <div className="bg-white p-6 rounded-none border border-editorial-charcoal/15 space-y-5">
                <h3 className="font-serif text-lg font-bold text-editorial-charcoal pb-3 border-b border-editorial-charcoal/15 italic">
                  Required Ingredients List
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-3 text-editorial-charcoal text-xs leading-relaxed font-sans border-b border-editorial-gray pb-2">
                      <span className="w-5 h-5 bg-editorial-gray text-editorial-charcoal border border-editorial-charcoal/15 flex items-center justify-center text-[9px] font-mono font-bold shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Directions */}
              <div className="bg-white p-6 rounded-none border border-editorial-charcoal/15 space-y-6">
                <h3 className="font-serif text-lg font-bold text-editorial-charcoal pb-3 border-b border-editorial-charcoal/15 italic">
                  Methodology &amp; Assembly Steps
                </h3>
                <div className="space-y-6">
                  {activeRecipe.instructions.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="w-8 h-8 bg-editorial-charcoal text-editorial-cream font-mono font-bold flex items-center justify-center text-xs shrink-0 rounded-none">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {i < activeRecipe.instructions.length - 1 && (
                          <div className="w-[1px] bg-editorial-charcoal/15 grow my-2"></div>
                        )}
                      </div>
                      <div className="text-left space-y-1 py-1">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-editorial-charcoal/40">Direction Stage {i + 1}</span>
                        <p className="text-editorial-charcoal text-xs sm:text-sm font-sans leading-relaxed">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Side Column: Integrated Marketplace "Click-to-Buy Ingredients" */}
            <div className="space-y-6">
              
              <div className="bg-editorial-gray p-6 rounded-none border border-editorial-charcoal/20 space-y-4 text-left">
                <div className="inline-flex p-2 bg-white border border-editorial-charcoal/10 text-editorial-red rounded-none">
                  <Award className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-base font-bold text-editorial-charcoal italic">
                  Specimen Pairings
                </h4>
                <p className="text-[#1A1A1A]/70 text-xs font-sans leading-relaxed">
                  The following curated jar batches correspond exactly to the flavor requirements of this preparation map. Add specimen jars to your selection:
                </p>

                <div className="space-y-3 pt-2">
                  {linkedProducts.length === 0 ? (
                    <div className="text-xs text-[#1A1A1A]/50 italic bg-white p-4 border border-editorial-charcoal/10">
                      No matching small-batch specimens are currently linked. Consult the general marketplace catalogs.
                    </div>
                  ) : (
                    linkedProducts.map((p) => (
                      <div key={p.id} className="bg-white p-3 border border-editorial-charcoal/10 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-10 h-10 object-cover border border-editorial-charcoal/10 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="text-left min-w-0">
                            <h5 className="font-serif text-[11px] font-bold text-editorial-charcoal truncate pr-1 italic">{p.name}</h5>
                            <span className="text-[9px] text-[#1A1A1A]/60 block font-mono">${p.price.toFixed(2)}</span>
                          </div>
                        </div>

                        {p.stock > 0 ? (
                          <button
                            onClick={() => {
                              addToCart(p, 1);
                              onOpenCart?.();
                            }}
                            className="bg-editorial-charcoal text-editorial-cream text-[9px] font-mono tracking-wider px-2 py-1.5 uppercase font-bold hover:bg-editorial-red whitespace-nowrap transition-colors"
                          >
                            Add Specimen
                          </button>
                        ) : (
                          <span className="text-[8px] font-mono font-bold text-stone-400 uppercase tracking-wider bg-editorial-gray px-2 py-1 border border-editorial-charcoal/10">
                            Depleted
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>

                <button
                  onClick={() => onSetTab("market")}
                  className="w-full text-center py-2.5 bg-editorial-charcoal text-editorial-cream hover:bg-editorial-red hover:border-editorial-red text-xs font-mono font-bold uppercase tracking-widest transition-colors block mt-4"
                >
                  Consult Catalog
                </button>
              </div>

              {/* Flavor Pairing Tip */}
              <div className="bg-white p-5 border border-editorial-charcoal/15 text-xs text-left space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-red block">💡 Kitchen Note</span>
                <p className="text-[#1A1A1A]/75 font-sans leading-relaxed">
                  We highly recommend sanitizing your glassware with boiling water for 10 minutes prior to launching experimental lacto fermentations inside standard home setups.
                </p>
              </div>

            </div>

          </div>

          {/* Recipe Ratings & Feedback Section */}
          <div className="border-t border-editorial-charcoal/15 pt-8 space-y-6">
            <h3 className="font-serif text-xl font-bold tracking-tight text-editorial-charcoal italic text-left">
              Artisan Guide Feedback &amp; Ratings
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Left Side: Reviews List (takes 2 cols if wide) */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/60 pb-2 border-b border-editorial-charcoal/10 text-left">
                  Reviews &amp; Culinary Advice ({recipeReviews.filter(rev => rev.recipeId === activeRecipe.id).length})
                </h4>
                
                {recipeReviews.filter(rev => rev.recipeId === activeRecipe.id).length === 0 ? (
                  <div className="bg-[#FAF9F6] p-6 text-center border border-editorial-charcoal/10">
                    <p className="text-xs text-stone-500 italic">No feedback entries recorded for this map. Be the first to share your result!</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                    {recipeReviews
                      .filter(rev => rev.recipeId === activeRecipe.id)
                      .map((rev) => (
                        <div key={rev.id} className="bg-white p-4 border border-editorial-charcoal/10 space-y-2 text-left">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-editorial-charcoal font-serif italic">{rev.author}</span>
                            <span className="text-[9px] font-mono text-stone-400">{rev.date}</span>
                          </div>
                          
                          {/* Stars */}
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < rev.rating ? "fill-current" : "text-stone-200"}`}
                              />
                            ))}
                          </div>
                          
                          <p className="text-stone-700 text-xs leading-relaxed font-sans">
                            {rev.comment}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Right Side: Leave a Feedback Form (takes 1 col) */}
              <div className="bg-[#FAF9F6] p-5 border border-editorial-charcoal/15 space-y-4 text-left">
                <h4 className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal">
                  Add Star Rating &amp; Notes
                </h4>
                
                {reviewSuccess && (
                  <div className="bg-editorial-cream text-editorial-green text-xs p-3.5 border border-editorial-charcoal/25 font-mono font-bold flex items-center gap-2">
                    <Check className="w-4 h-4 text-editorial-green" />
                    <span>Rating submitted. Salutations!</span>
                  </div>
                )}

                <form onSubmit={handleRecipeReviewSubmit} className="space-y-4 text-left">
                  <div>
                    <label className="text-[9px] font-mono font-bold text-editorial-charcoal/40 uppercase block mb-1">Kitchen Moniker / Name</label>
                    <input
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g. Master Fermenter"
                      required
                      className="w-full border border-editorial-charcoal/20 text-xs p-2.5 rounded-none bg-white font-mono focus:border-editorial-charcoal focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-editorial-charcoal/40 uppercase block mb-1">Star Score</label>
                    <div className="flex items-center gap-1 bg-white border border-editorial-charcoal/20 p-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                          title={`${star} Star${star > 1 ? "s" : ""}`}
                        >
                          <Star
                            className={`w-5 h-5 ${star <= reviewRating ? "text-amber-500 fill-current" : "text-stone-200"}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-editorial-charcoal/40 uppercase block mb-1">Culinary Advice / Comment</label>
                    <textarea
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your adjustment ratios, pH notes, or crisp results..."
                      required
                      className="w-full border border-editorial-charcoal/20 text-xs p-2.5 rounded-none bg-white font-sans focus:border-editorial-charcoal focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-editorial-charcoal text-editorial-cream text-[10px] font-mono uppercase tracking-widest font-bold hover:bg-[#C1121F] hover:text-[#FAF9F6] transition-all rounded-none cursor-pointer"
                  >
                    Post Recipe Notes
                  </button>
                </form>
              </div>

            </div>
          </div>

        </div>
        
        {/* Clean, Text-Only Printed Recipe Card Layout (visible ONLY in print mode) */}
        <div className="hidden print:block text-black space-y-6 max-w-3xl mx-auto p-8 font-sans border-2 border-black bg-white" id="printable-recipe-card">
          
          {/* Cover header block */}
          <div className="border-b-4 border-black pb-4 text-center space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] block text-stone-600 font-bold">Gourmet Fermenter Masterguide</span>
            <h1 className="font-serif text-3xl font-black italic tracking-tight">{activeRecipe.title}</h1>
            <p className="text-xs italic text-stone-600 max-w-xl mx-auto">{activeRecipe.description}</p>
            
            <div className="flex flex-wrap justify-center items-center gap-4 mt-4 pt-3 border-t border-stone-200 text-[10px] font-mono uppercase tracking-widest font-bold text-stone-700">
              <span>By: {activeRecipe.author}</span>
              <span>•</span>
              <span>Prep: {activeRecipe.prepTime}</span>
              <span>•</span>
              <span>Cook: {activeRecipe.cookTime}</span>
              <span>•</span>
              <span>Heat: {activeRecipe.spiceLevel}</span>
              <span>•</span>
              <span>Skill: {activeRecipe.difficulty}</span>
            </div>
          </div>

          {/* Ingredients Segment */}
          <div className="space-y-3 pt-2">
            <h2 className="font-serif text-base font-black border-b-2 border-black pb-1 uppercase tracking-tight">Required Ingredients Checklist</h2>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
              {activeRecipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 py-0.5">
                  <span className="inline-block w-3.5 h-3.5 border border-black align-middle shrink-0 mt-0.5"></span>
                  <span className="leading-snug">{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Preparation Directions */}
          <div className="space-y-4 pt-4">
            <h2 className="font-serif text-base font-black border-b-2 border-black pb-1 uppercase tracking-tight">Methodology Instructions</h2>
            <ol className="space-y-4 text-xs">
              {activeRecipe.instructions.map((step, i) => (
                <li key={i} className="space-y-1">
                  <span className="font-mono font-extrabold text-[9px] uppercase tracking-wider block text-stone-500">Stage {String(i + 1).padStart(2, "0")}</span>
                  <p className="leading-relaxed text-stone-900">{step}</p>
                </li>
              ))}
            </ol>
          </div>

          {/* Disclaimer & Footer context */}
          <div className="border-t border-stone-300 pt-4 mt-8 flex justify-between items-center text-[8.5px] font-mono text-stone-400">
            <span>Verified Pickle &amp; Pepper Hub Authentic Specimen</span>
            <span>Compiled on {new Date().toLocaleDateString()}</span>
          </div>
          
        </div>
      </>
      ) : isLabOpen ? (
        /* 3. INTERACTIVE FERMENTATION SCIENCE LAB & AI ADVISOR VIEW */
        <div className="space-y-8 text-left animate-in fade-in duration-200" id="science-lab-view">
          
          {/* Lab Header block with back action button */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-editorial-charcoal pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-600 flex items-center gap-1">
                <Atom className="w-3.5 h-3.5 animate-spin-slow text-amber-500" />
                <span>Fermentation Science Desk</span>
              </span>
              <h2 className="font-serif text-3xl font-bold text-editorial-charcoal italic mt-0.5">
                The Lacto-Fermentation Science Lab
              </h2>
              <p className="text-[#1A1A1A]/70 text-xs sm:text-sm mt-1 max-w-xl font-sans">
                Calibrate custom salinity curves, calculate precise salt mass weight, and consult **The Brine Master AI Advisor** for troubleshooting.
              </p>
            </div>
            
            <button
              id="close-lab-btn"
              onClick={() => setIsLabOpen(false)}
              className="px-4 py-2 text-[10px] font-mono uppercase tracking-widest font-bold text-editorial-charcoal bg-editorial-gray hover:bg-white border border-editorial-charcoal/15 hover:border-editorial-charcoal transition-all rounded-none cursor-pointer"
            >
              ← Close &amp; Return to Recipes
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: INTERACTIVE CALIBRATOR & CROCK SIMULATOR */}
            <div className="lg:col-span-7 bg-white border border-editorial-charcoal/15 p-6 space-y-6 text-left">
              <div className="flex items-center gap-2 border-b border-editorial-charcoal/10 pb-3">
                <Calculator className="w-4 h-4 text-editorial-red" />
                <h3 className="font-serif text-base font-black italic text-editorial-charcoal">Salinity Calibration Engine</h3>
              </div>

              {/* Presets and Inputs */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-mono font-bold text-editorial-charcoal/60 uppercase block mb-1">
                      Vegetable Specimen Mass (g)
                    </label>
                    <input
                      type="number"
                      value={vegWeight}
                      onChange={(e) => setVegWeight(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-editorial-gray border border-editorial-charcoal/20 px-3 py-2 text-xs font-mono rounded-none"
                    />
                    <div className="flex mt-1.5 gap-1.5 overflow-x-auto pb-1">
                      {[
                        { label: "1 Small Jar (500g)", val: 500 },
                        { label: "Standard Crock (1.5kg)", val: 1500 },
                        { label: "Bulk Vat (5kg)", val: 5000 }
                      ].map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setVegWeight(p.val)}
                          className="px-2 py-0.5 bg-stone-100 text-[8px] font-mono hover:bg-stone-200 border border-stone-300/40 rounded-none shrink-0"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-editorial-charcoal/60 uppercase block mb-1">
                      Pure Water / Solvent Volume (ml)
                    </label>
                    <input
                      type="number"
                      value={waterVolume}
                      onChange={(e) => setWaterVolume(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full bg-editorial-gray border border-editorial-charcoal/20 px-3 py-2 text-xs font-mono rounded-none"
                    />
                    <div className="flex mt-1.5 gap-1.5 overflow-x-auto pb-1">
                      {[
                        { label: "1 Pint (473ml)", val: 470 },
                        { label: "1 Quart (946ml)", val: 940 },
                        { label: "Half Gallon (1.89L)", val: 1890 }
                      ].map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setWaterVolume(p.val)}
                          className="px-2 py-0.5 bg-stone-100 text-[8px] font-mono hover:bg-stone-200 border border-stone-300/40 rounded-none shrink-0"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="text-[9px] font-mono font-bold text-editorial-charcoal/60 uppercase block mb-1 font-bold">
                      Specimen Category
                    </label>
                    <select
                      value={vegType}
                      onChange={(e) => setVegType(e.target.value as any)}
                      className="w-full bg-white border border-editorial-charcoal/20 px-3 py-2 text-xs font-sans rounded-none"
                    >
                      <option value="cucumber">Crisp Cucumbers (Half/Full Sour)</option>
                      <option value="pepper">Hot Chili Mash / Whole Peppers</option>
                      <option value="cabbage">Sauerkraut Cabbage (Dry Salted)</option>
                      <option value="other">Tuber Roots, Shrubs &amp; Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] font-mono font-bold text-editorial-charcoal/60 uppercase block mb-1 font-bold">
                      Desired Salinity Curve: <span className="text-editorial-red font-mono">{salinityTarget.toFixed(1)}%</span>
                    </label>
                    <input
                      type="range"
                      min="1.0"
                      max="6.0"
                      step="0.1"
                      value={salinityTarget}
                      onChange={(e) => setSalinityTarget(parseFloat(e.target.value))}
                      className="w-full h-1 bg-stone-200 rounded-none appearance-none cursor-pointer accent-[#C1121F] mt-2.5"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-stone-400 mt-1">
                      <span>1.0% (Ultra-Mild)</span>
                      <span>3.0% (Balanced)</span>
                      <span>6.0% (Extreme)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Calculations Readout */}
              {(() => {
                const totalGramsMass = Math.round((vegWeight + waterVolume) * (salinityTarget / 100) * 10) / 10;
                const waterOnlyGrams = Math.round(waterVolume * (salinityTarget / 100) * 10) / 10;
                
                // Conversions
                const totalTsp = Math.round((totalGramsMass / 4.8) * 10) / 10;
                const totalTsb = Math.round((totalGramsMass / 14.4) * 10) / 10;
                
                const waterOnlyTsp = Math.round((waterOnlyGrams / 4.8) * 10) / 10;
                const waterOnlyTsb = Math.round((waterOnlyGrams / 14.4) * 10) / 10;

                // Salinity Warning Level / Colors
                let alertColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
                let alertTitle = "🟢 Optimal Salinity Range";
                let alertMsg = "Lactic acid bacteria thrives safely! Optimal pathogen suppression and texture retention.";
                let waterTint = "bg-emerald-500/10 border-emerald-400/30";
                let bubblesActive = true;

                if (salinityTarget < 2.0) {
                  alertColor = "text-[#C1121F] bg-[#C1121F]/5 border-[#C1121F]/15 animate-pulse";
                  alertTitle = "⚠️ Mold Danger Zone";
                  alertMsg = "Pathogen suppression is too weak. High vulnerability to soft texture and noxious mold colonies!";
                  waterTint = "bg-amber-600/15 border-amber-500/25";
                } else if (salinityTarget > 4.5) {
                  alertColor = "text-amber-800 bg-amber-50 border-amber-200";
                  alertTitle = "⚠️ Stuck Fermentation Zone";
                  alertMsg = "Extreme salinity limits lactic bacteria activity. Bubbling slows, and vegetables taste aggressively salty.";
                  waterTint = "bg-sky-500/10 border-sky-400/30";
                  bubblesActive = false;
                }

                // Vegetable specific recommendations
                let crispTip = "";
                if (vegType === "cucumber") {
                  crispTip = "💡 Cucumber Secret: Toss in a clean grape leaf or oak leaf! The natural organic tannins keep the cucumber cell walls crisp and snapping.";
                } else if (vegType === "pepper") {
                  crispTip = "💡 Hot Chiles Tip: Always keep peppers entirely submerged below the brine line. Floating parts have an 85% mold accumulation rate.";
                } else if (vegType === "cabbage") {
                  crispTip = "💡 Cabbage Secret: Use dry salting! Shred cabbage directly, massage with salt for 10 minutes until heavy pools of natural juices emerge.";
                } else {
                  crispTip = "💡 Custom Crop Secret: Ensure a sterile jar, and keep the temperature around 68-72°F (20-22°C) for clean lactobacillus strains.";
                }

                return (
                  <div className="space-y-4">
                    {/* Diagnosis Panel */}
                    <div className={`p-4 border ${alertColor} text-left space-y-1`}>
                      <span className="text-xs font-mono uppercase font-black tracking-wider block">{alertTitle}</span>
                      <p className="text-[11px] leading-relaxed font-sans">{alertMsg}</p>
                    </div>

                    {/* Math results cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Formula 1: True Lacto (Total mass) */}
                      <div className="border border-editorial-charcoal/15 p-4 space-y-2 bg-[#FAF9F6]">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 font-bold block">METHOD I: PURE LACTO-FERMENT</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-serif font-bold text-editorial-charcoal italic">{totalGramsMass}g</span>
                          <span className="text-[10px] font-mono text-stone-400 font-bold">Total Salt Mass</span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-sans leading-relaxed">
                          Salt ratio applied to both veggies + water volume together. Ideal for traditional crock jars.
                        </p>
                        <div className="flex justify-between items-center text-[10px] bg-white px-2 py-1.5 border border-stone-200/80 font-mono text-xs mt-1.5">
                          <span>Volume Equivalents:</span>
                          <span className="font-extrabold text-editorial-red">~{totalTsp} tsp / ~{totalTsb} tbsp</span>
                        </div>
                      </div>

                      {/* Formula 2: Brine Volume only */}
                      <div className="border border-editorial-charcoal/15 p-4 space-y-2 bg-[#FAF9F6]">
                        <span className="text-[9px] font-mono uppercase tracking-widest text-stone-500 font-bold block">METHOD II: WATER BRINE ONLY</span>
                        <div className="flex items-baseline justify-between">
                          <span className="text-2xl font-serif font-bold text-editorial-charcoal italic">{waterOnlyGrams}g</span>
                          <span className="text-[10px] font-mono text-stone-400 font-bold">Brine Liquid Salt</span>
                        </div>
                        <p className="text-[10px] text-stone-500 font-sans leading-relaxed">
                          Salt ratio applied purely to water body. Recommended for quick mason jar canning.
                        </p>
                        <div className="flex justify-between items-center text-[10px] bg-white px-2 py-1.5 border border-stone-200/80 font-mono text-xs mt-1.5">
                          <span>Volume Equivalents:</span>
                          <span className="font-extrabold text-editorial-red">~{waterOnlyTsp} tsp / ~{waterOnlyTsb} tbsp</span>
                        </div>
                      </div>
                    </div>

                    {/* Secret crisp tip block */}
                    <div className="bg-editorial-gray p-3.5 border-l-4 border-amber-505 text-left text-[11px] italic font-sans text-[#1A1A1A]/90 mt-2">
                      {crispTip}
                    </div>

                    {/* GORGEOUS VISUAL CROCK PORTRAYAL */}
                    <div className="border border-editorial-charcoal/15 bg-stone-50 p-6 flex flex-col items-center justify-center space-y-4 relative overflow-hidden min-h-[300px]" id="visual-crock-simulator">
                      <span className="text-[8.5px] font-mono text-stone-400 font-bold uppercase tracking-widest absolute top-4">Interactive Bubbling Specimen Test Tube</span>

                      <div className="relative w-40 h-56 bg-white/70 border-4 border-stone-700 shadow-xl rounded-b-3xl rounded-t-lg overflow-hidden flex flex-col justify-end mt-4">
                        <div className="absolute top-0 inset-x-0 h-4 bg-stone-700/80 border-b border-stone-600"></div>
                        <div className={`absolute inset-x-0 bottom-0 top-10 ${waterTint} transition-all duration-300 flex flex-col justify-end p-2 overflow-hidden`}>
                          
                          <div className="flex flex-wrap justify-center gap-2 relative z-10 select-none pb-6">
                            {vegType === "cucumber" && (
                              <>
                                <div className="w-10 h-10 rounded-full border border-emerald-800/25 bg-emerald-600/30 flex items-center justify-center text-lg animate-bounce duration-1000">🥒</div>
                                <div className="w-10 h-10 rounded-full border border-emerald-800/25 bg-emerald-600/30 flex items-center justify-center text-lg animate-bounce duration-800 delay-100">🥒</div>
                                <div className="w-9 h-9 rounded-full border border-emerald-800/25 bg-emerald-600/30 flex items-center justify-center text-lg animate-bounce duration-1200 delay-200">🥒</div>
                              </>
                            )}
                            {vegType === "pepper" && (
                              <>
                                <div className="w-10 h-10 rounded-full border border-red-800/25 bg-red-600/30 flex items-center justify-center text-lg animate-bounce duration-1000">🌶️</div>
                                <div className="w-10 h-10 rounded-full border border-orange-800/25 bg-orange-600/30 flex items-center justify-center text-lg animate-bounce duration-800 delay-100">🌶️</div>
                                <div className="w-9 h-9 rounded-full border border-amber-800/25 bg-amber-600/30 flex items-center justify-center text-lg animate-bounce duration-1200 delay-200">🌶️</div>
                              </>
                            )}
                            {vegType === "cabbage" && (
                              <>
                                <div className="w-10 h-10 rounded-full border border-green-800/25 bg-green-600/20 flex items-center justify-center text-lg animate-bounce duration-800">🥬</div>
                                <div className="w-10 h-10 rounded-full border border-green-800/25 bg-green-600/20 flex items-center justify-center text-lg animate-bounce duration-1200 delay-100">🥬</div>
                              </>
                            )}
                            {vegType === "other" && (
                              <>
                                <div className="w-10 h-10 rounded-full border border-amber-800/25 bg-amber-600/30 flex items-center justify-center text-lg animate-bounce">🥕</div>
                                <div className="w-10 h-10 rounded-full border border-amber-800/25 bg-amber-600/30 flex items-center justify-center text-lg animate-bounce delay-150">🧅</div>
                              </>
                            )}
                          </div>

                          {bubblesActive && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                              {[1, 2, 3, 4, 5, 6, 7].map((b) => (
                                <div
                                  key={b}
                                  className="absolute w-2 h-2 rounded-full bg-white/70 animate-bounce"
                                  style={{
                                    bottom: "10px",
                                    left: `${b * 12 + 6}%`,
                                    animationDelay: `${b * 0.15}s`,
                                    animationDuration: `${0.8 + (b * 0.2) % 1.0}s`
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="absolute right-2 top-10 bottom-4 flex flex-col justify-between text-[7px] font-mono text-stone-500 font-extrabold select-none pointer-events-none">
                          <span>MAX —</span>
                          <span>750ml —</span>
                          <span>500ml —</span>
                          <span>250ml —</span>
                          <span>MIN —</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500 bg-stone-200/60 px-2.5 py-1">
                        Crock Salinity: {salinityTarget.toFixed(1)}% ({bubblesActive ? "Bubbling Active" : "No Bubbles"})
                      </span>
                    </div>

                  </div>
                );
              })()}

            </div>

            {/* COLUMN 2: THE BRINE MASTER AI GURU CHAT */}
            <div className="lg:col-span-5 bg-white border border-editorial-charcoal/15 flex flex-col justify-between min-h-[600px] rounded-none overflow-hidden" id="advisor-chat-portal">
              
              <div className="p-4 bg-editorial-charcoal text-editorial-cream border-b border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white italic leading-tight">The Brine Master Guru</h4>
                    <span className="text-[8px] font-mono font-bold text-amber-400 uppercase tracking-widest block">Lacto-Ferment Professional Advisor</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setChatLog([
                      {
                        role: "model",
                        text: "Logs purged. Restating index! Greetings fellow seeker. How may I guide your lacto-fermentation ratios or crisp targets today?"
                      }
                    ]);
                  }}
                  className="text-stone-400 hover:text-white text-[9px] font-mono uppercase tracking-widest border border-stone-800 hover:border-stone-500 px-2 py-1 rounded-none transition-all cursor-pointer"
                >
                  Purge Logs
                </button>
              </div>

              {/* Chat output scrolling panel */}
              <div className="p-4 grow overflow-y-auto max-h-[420px] min-h-[380px] bg-[#FAF9F6] space-y-4">
                {chatLog.map((c, i) => (
                  <div
                    key={i}
                    className={`flex ${c.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in duration-150`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 border ${
                        c.role === "user"
                          ? "bg-editorial-charcoal text-white border-editorial-charcoal rounded-none rounded-tl-lg"
                          : "bg-white text-editorial-charcoal border-stone-200/90 rounded-none rounded-tr-lg"
                      } text-xs leading-relaxed space-y-1`}
                    >
                      <span className="text-[8px] font-mono uppercase tracking-widest block font-bold text-stone-400">
                        {c.role === "user" ? "YOU / CULINARIAN" : "THE BRINE MASTER"}
                      </span>
                      <p className="whitespace-pre-wrap font-sans">
                        {c.text}
                      </p>
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-white text-editorial-charcoal border border-stone-200 p-3 max-w-[80%] rounded-none rounded-tr-lg">
                      <span className="text-[8px] font-mono uppercase tracking-widest block font-bold text-stone-400">THE BRINE MASTER</span>
                      <div className="flex items-center gap-1.5 py-1.5">
                        <div className="w-1.5 h-1.5 bg-editorial-charcoal rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-editorial-charcoal rounded-full animate-bounce [animation-delay:0.1s]"></div>
                        <div className="w-1.5 h-1.5 bg-editorial-charcoal rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat controls & Quick Ask suggestions */}
              <div className="p-4 border-t border-stone-100 bg-white space-y-3">
                <div className="space-y-1">
                  <span className="text-[8px] font-mono uppercase tracking-wider text-stone-400 block font-bold">Frequently Consulted Topics:</span>
                  <div className="flex flex-wrap gap-1">
                    {[
                      "Crisp pickle guidelines",
                      "Kahm yeast vs bad mold",
                      "Ideal chili mash salinity",
                      "Sterilization safety metrics"
                    ].map((topic, tIdx) => (
                      <button
                        key={tIdx}
                        type="button"
                        onClick={() => {
                          setChatInput(`Explain details regarding: ${topic}`);
                        }}
                        disabled={isChatLoading}
                        className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-editorial-charcoal text-[9px] font-mono hover:text-[#C1121F] border border-stone-300/40 transition-colors rounded-none text-left shrink-0 truncate max-w-[200px]"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask standard brining issues..."
                    disabled={isChatLoading}
                    className="grow border border-stone-200 px-3 py-2 text-xs focus:outline-none focus:border-editorial-charcoal rounded-none disabled:opacity-50 font-sans"
                  />
                  <button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="p-2.5 bg-[#C1121F] text-white hover:bg-editorial-charcoal transition-all rounded-none disabled:opacity-40 cursor-pointer flex items-center justify-center aspect-square"
                    title="Send Fermentation Inquiry"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>

            </div>

          </div>

        </div>
      ) : (
        /* 2. RECIPES LIST SEARCH BOARD */
        <div className="space-y-8 text-left animate-in fade-in duration-200">
          
          {/* Header title segment */}
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-editorial-red text-[11px] font-mono font-bold uppercase tracking-[0.25em] block">ARTISAN CUISINE MAPS</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-editorial-charcoal italic leading-none">
              A Culinary Index
            </h2>
            <p className="text-[#1A1A1A]/70 text-xs sm:text-sm font-sans leading-relaxed">
              Browse professional masterguides covering canning, dry-fermentation, brining, heat scaling, and wood-smoking techniques from independent growers.
            </p>
          </div>

          {/* Prominent Science Lab Banner */}
          <div className="bg-gradient-to-r from-editorial-charcoal to-stone-900 text-editorial-cream p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-800" id="science-lab-banner">
            <div className="space-y-2 text-left md:max-w-xl">
              <div className="flex items-center gap-2">
                <Atom className="w-5 h-5 text-amber-500 animate-spin-slow" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500">Fermentation Science Desk</span>
              </div>
              <h3 className="font-serif text-2xl font-bold italic text-white mt-1">Lacto-Fermentation Science Lab</h3>
              <p className="text-stone-300 text-xs sm:text-sm font-sans leading-relaxed">
                Unlock our interactive brine salinity calculator, visual micro-bubbling crock simulator, and secure chat with **The Brine Master AI Guru** to ensure sterile, crispy, award-winning jars!
              </p>
            </div>
            <button
              id="open-lab-btn"
              onClick={() => setIsLabOpen(true)}
              className="px-6 py-3 bg-[#C1121F] text-[#FAF9F6] text-xs font-mono font-bold uppercase tracking-wider rounded-none hover:bg-white hover:text-black hover:border-editorial-charcoal transition-all font-bold shrink-0 shadow-lg cursor-pointer"
            >
              🚀 Launch Science Lab &amp; AI Advisor
            </button>
          </div>

          {/* Trending Now Highlight Section */}
          {trendingRecipes.length > 0 && (
            <div className="space-y-4 bg-[#FAF9F6] border border-editorial-charcoal/15 p-5 animate-in fade-in duration-300" id="recipes-trending-section">
              <div className="flex items-center gap-2 border-b border-editorial-charcoal/10 pb-2.5">
                <Flame className="w-3.5 h-3.5 text-[#C1121F] animate-pulse shrink-0" />
                <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-[#C1121F]">
                  Trending Now • Highly Acclaimed Ratios
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingRecipes.map((rec) => (
                  <div
                    key={`trending-${rec.id}`}
                    id={`trending-recipe-card-${rec.id}`}
                    onClick={() => setActiveRecipeId(rec.id)}
                    className="group relative bg-white border border-editorial-charcoal/10 hover:border-[#C1121F] hover:shadow-xs transition-all p-4 flex flex-col justify-between cursor-pointer text-left rounded-none overflow-hidden"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8px] font-mono font-bold tracking-widest uppercase text-editorial-charcoal/40">
                        <span>GUIDE REFERENCE • BATCH-{rec.id}</span>
                        <span className="flex items-center gap-0.5 text-amber-500 font-extrabold text-[10px]">
                          ★ {rec.rating?.toFixed(1) || "5.0"}
                        </span>
                      </div>
                      
                      <h4 className="font-serif text-sm font-black text-editorial-charcoal group-hover:text-editorial-red transition-colors italic leading-snug line-clamp-1">
                        {rec.title}
                      </h4>
                      
                      <p className="text-stone-600 text-[11px] line-clamp-2 leading-relaxed font-sans">
                        {rec.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2.5 mt-3 border-t border-editorial-charcoal/5 text-[9px] font-mono uppercase tracking-wider text-editorial-charcoal/50">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-editorial-red shrink-0" />
                        <span>{rec.prepTime}</span>
                      </span>
                      <span className="flex items-center gap-1 font-bold text-editorial-charcoal group-hover:text-[#C1121F] transition-all">
                        Inspect Map →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Filters with clear, high-contrast inputs */}
          <div className="bg-[#FAF9F6] border border-editorial-charcoal/15 p-4 md:p-5 flex flex-col md:flex-row gap-4 items-center" id="recipe-search-filter-controls">
            
            {/* Search inputs with absolute positioned icons */}
            <div className="relative flex-grow w-full md:w-auto">
              <span className="sr-only">Search Recipe Map Database</span>
              <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-editorial-charcoal/40 pointer-events-none" />
              <input
                id="recipe-text-search-bar"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter recipes by title or ingredients (e.g., jalapeño, garlic, brining)..."
                className="w-full pl-10 pr-10 py-3 bg-white border border-editorial-charcoal/20 text-xs focus:outline-none focus:border-editorial-charcoal text-editorial-charcoal font-sans rounded-none transition-all placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-2.5 p-1 text-editorial-charcoal/40 hover:text-editorial-charcoal transition-colors cursor-pointer"
                  title="Clear search text query"
                  aria-label="Clear recipe search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Skill Difficulty select */}
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-start">
              <span className="text-[9px] font-mono font-bold text-editorial-charcoal/60 uppercase tracking-widest">Skill</span>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white border border-editorial-charcoal/20 py-2 px-3 text-xs font-bold font-mono uppercase rounded-none"
              >
                <option value="all">All Difficulty Levels</option>
                <option value="Easy">Easy</option>
                <option value="Advanced">Advanced</option>
                <option value="Time-Intensive">Time-Intensive</option>
              </select>
            </div>

            {/* Heat level option */}
            <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-between md:justify-start">
              <span className="text-[9px] font-mono font-bold text-editorial-charcoal/60 uppercase tracking-widest">Spice</span>
              <select
                value={selectedHeat}
                onChange={(e) => setSelectedHeat(e.target.value)}
                className="bg-white border border-editorial-charcoal/20 py-2 px-3 text-xs font-bold font-mono uppercase rounded-none"
              >
                <option value="all">All Heat Ranges</option>
                <option value="Mild">Mild Heat</option>
                <option value="Medium">Medium Zing</option>
                <option value="Hot">Hot Ferment</option>
                <option value="Extreme">Extreme Sting</option>
              </select>
            </div>

          </div>

          {/* Recipe Grid listing */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse" id="recipe-grid-skeleton">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white border border-editorial-charcoal/15 overflow-hidden flex flex-col rounded-none">
                  {/* Live card thumbnail mockup */}
                  <div className="relative h-48 bg-stone-100 flex items-center justify-center">
                    <div className="w-10 h-10 bg-stone-200/40" />
                    <span className="absolute bottom-3 left-3 bg-stone-200/60 w-20 h-5" />
                    <span className="absolute top-3 right-3 bg-stone-200/60 w-14 h-5" />
                  </div>
                  {/* Detailed metadata segment mockup */}
                  <div className="p-5 flex flex-col justify-between flex-1 text-left space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="h-3 bg-stone-200/60 w-24" />
                        <div className="h-3 bg-stone-200/60 w-10" />
                      </div>
                      <div className="h-5 bg-stone-200/85 w-3/4" />
                      <div className="space-y-1.5 pt-1">
                        <div className="h-3 bg-stone-100/95 w-full" />
                        <div className="h-3 bg-stone-100/95 w-5/6" />
                      </div>
                    </div>
                    {/* Footnote alignment mockup */}
                    <div className="flex items-center justify-between pt-3.5 border-t border-editorial-charcoal/10">
                      <div className="h-3 bg-stone-200/60 w-20" />
                      <div className="h-3 bg-stone-200/60 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="py-16 bg-[#FAF9F6] border border-dashed border-editorial-charcoal/15 text-center">
              <Clock className="w-8 h-8 text-editorial-charcoal/20 mx-auto mb-2" />
              <p className="text-xs text-editorial-charcoal/40 font-mono uppercase tracking-wider">No recipe maps match your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredRecipes.map((rec) => (
                <div
                  key={rec.id}
                  id={`recipe-card-${rec.id}`}
                  onClick={() => setActiveRecipeId(rec.id)}
                  className="bg-white border border-editorial-charcoal/15 hover:border-editorial-charcoal transition-all overflow-hidden flex flex-col cursor-pointer group rounded-none"
                >
                  <div className="relative h-48 bg-editorial-gray overflow-hidden">
                    <img
                      src={rec.image}
                      alt={rec.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#FAF9F6] border border-editorial-charcoal/15 text-editorial-charcoal text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5">
                      ⏱ {rec.prepTime} Prep
                    </span>
                    <span className={`absolute top-3 right-3 border px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${getDifficultyColor(rec.difficulty)} bg-white/95 backdrop-blur-xs shadow-xs`}>
                      {rec.difficulty}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1 text-left space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[8px] font-mono font-bold tracking-widest uppercase leading-none text-editorial-charcoal/40">
                        <span>GUIDE REFERENCE • BATCH-{rec.id}</span>
                        {rec.rating !== undefined && rec.rating > 0 ? (
                          <span className="flex items-center gap-0.5 text-amber-500 font-extrabold text-[10px]">
                            ★ {rec.rating.toFixed(1)} <span className="text-stone-400 font-normal">({rec.reviewsCount})</span>
                          </span>
                        ) : (
                          <span className="text-[#968472] text-[9px] font-extrabold uppercase tracking-wide">★ NEW</span>
                        )}
                      </div>
                      <h3 className="font-serif text-base font-bold text-editorial-charcoal group-hover:text-editorial-red transition-colors line-clamp-1 italic">
                        {rec.title}
                      </h3>
                      <p className="text-[#1A1A1A]/70 text-xs line-clamp-2 leading-relaxed font-sans">
                        {rec.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-editorial-charcoal/10 text-[9px] font-mono uppercase tracking-wider text-[#1A1A1A]/50">
                      <span>By: <span className="text-editorial-charcoal font-bold">{rec.author}</span></span>
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveRecipeId(rec.id);
                            setTimeout(() => window.print(), 150);
                          }}
                          className="p-1.5 hover:text-editorial-red hover:bg-editorial-gray text-editorial-charcoal/60 transition-all rounded-none"
                          title="Print Clean Recipe Card"
                          aria-label={`Print ${rec.title} recipe`}
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <span className="inline-flex items-center gap-1 font-bold text-editorial-charcoal group-hover:text-[#C1121F] transition-colors leading-none">
                          Consult Map <ArrowRight className="w-3 h-3 text-editorial-red" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
