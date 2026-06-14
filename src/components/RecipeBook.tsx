import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Recipe, Product } from "../types";
import { Search, Flame, Clock, Award, CheckCircle2, ShoppingCart, ArrowLeft, ArrowRight, User, Plus, Check, X } from "lucide-react";

interface RecipeBookProps {
  onSetTab: (tab: string) => void;
  selectedRecipeId?: string | null;
  onClearSelectedRecipe?: () => void;
  onOpenCart?: () => void;
}

export default function RecipeBook({ onSetTab, selectedRecipeId, onClearSelectedRecipe, onOpenCart }: RecipeBookProps) {
  const { recipes, products, addToCart } = useApp();

  // Selected recipe state
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedHeat, setSelectedHeat] = useState<string>("all");

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
        return "bg-green-50 text-green-700 border-green-200";
      case "Medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Hard":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-stone-55 text-stone-605";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 text-editorial-charcoal" id="recipe-book-zone">
      
      {/* 1. RECIPE EXPANDED DETAIL PAGE */}
      {activeRecipe ? (
        <div className="space-y-8 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
          
          {/* Back link */}
          <button
            id="back-to-recipes-btn"
            onClick={handleBackToList}
            className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest font-bold text-editorial-charcoal bg-editorial-gray hover:bg-white border border-editorial-charcoal/15 hover:border-editorial-charcoal px-4 py-2 transition-all rounded-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-editorial-red" />
            <span>Back to Artisan Guide Catalog</span>
          </button>

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
                <span className="bg-[#FAF9F6] text-editorial-charcoal font-mono border border-editorial-charcoal/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
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
                <option value="Easy">Simple / Easy</option>
                <option value="Medium">Medium / Interm.</option>
                <option value="Hard">Expert / Chef</option>
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
          {filteredRecipes.length === 0 ? (
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
                    <span className="absolute top-3 right-3 bg-[#C1121F] text-editorial-cream text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5">
                      {rec.difficulty}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col justify-between flex-1 text-left space-y-4">
                    <div className="space-y-2">
                      <span className="text-[8px] font-mono font-bold text-editorial-charcoal/40 tracking-widest uppercase block leading-none">
                        GUIDE REFERENCE • BATCH-{rec.id}
                      </span>
                      <h3 className="font-serif text-base font-bold text-editorial-charcoal group-hover:text-editorial-red transition-colors line-clamp-1 italic">
                        {rec.title}
                      </h3>
                      <p className="text-[#1A1A1A]/70 text-xs line-clamp-2 leading-relaxed font-sans">
                        {rec.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3.5 border-t border-editorial-charcoal/10 text-[9px] font-mono uppercase tracking-wider text-editorial-charcoal/50">
                      <span>By: <span className="text-editorial-charcoal font-bold">{rec.author}</span></span>
                      <span className="inline-flex items-center gap-1 font-bold text-editorial-charcoal group-hover:text-[#C1121F] transition-colors leading-none">
                        Consult Map <ArrowRight className="w-3 h-3 text-editorial-red" />
                      </span>
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
