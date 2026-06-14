import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Plus, Check, Trash2, ArrowRight, UserPlus, FileText, Sparkles, Send, AlertTriangle, HelpCircle } from "lucide-react";

export default function SellerPortal() {
  const {
    sellerSubmissions,
    recipeSubmissions,
    submitSellerProduct,
    submitSellerRecipe,
  } = useApp();

  // Registration state
  const [partnerRegistered, setPartnerRegistered] = useState(() => {
    return localStorage.getItem("p_m_partner_registered") === "true";
  });
  const [vendorName, setVendorName] = useState(() => {
    return localStorage.getItem("p_m_vendor_name") || "";
  });
  const [vendorEmail, setVendorEmail] = useState(() => {
    return localStorage.getItem("p_m_vendor_email") || "";
  });
  const [vendorBio, setVendorBio] = useState("");

  // Product submission form state
  const [prodName, setProdName] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodPrice, setProdPrice] = useState("8.99");
  const [prodCategory, setProdCategory] = useState<"pickle" | "pepper" | "oil" | "starter">("pickle");
  const [prodSpice, setProdSpice] = useState<"None" | "Mild" | "Medium" | "Hot" | "Extreme">("Medium");
  const [prodIngredientsText, setProdIngredientsText] = useState("Organic cucumbers, dill weeds, garlic, salt, vinegar");
  
  // Recipe submission form state
  const [recTitle, setRecTitle] = useState("");
  const [recDescription, setRecDescription] = useState("");
  const [recDifficulty, setRecDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [recPrep, setRecPrep] = useState("15 mins");
  const [recCook, setRecCook] = useState("10 mins");
  const [recIngredientsText, setRecIngredientsText] = useState("Pickles, bread, mustard, cheese");
  const [recStepsText, setRecStepsText] = useState("Layer pickles on cheese; Grill bread on flat-top skillet");
  
  // Tab within portal: "overview" | "product-form" | "recipe-form" | "submissions"
  const [portalTab, setPortalTab] = useState<"overview" | "product-form" | "recipe-form" | "submissions">("overview");

  // Success messages alerts
  const [formSuccess, setFormSuccess] = useState("");

  // Handle partner registration
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vendorName || !vendorEmail) return;
    localStorage.setItem("p_m_partner_registered", "true");
    localStorage.setItem("p_m_vendor_name", vendorName);
    localStorage.setItem("p_m_vendor_email", vendorEmail);
    setPartnerRegistered(true);
    setFormSuccess("Congratulations! Your kitchen is now globally registered in the Brine Networks.");
    setTimeout(() => setFormSuccess(""), 4000);
  };

  // Submit product
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) return;

    const listIngredients = prodIngredientsText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    submitSellerProduct({
      name: prodName,
      description: prodDescription,
      price: parseFloat(prodPrice) || 9.99,
      category: prodCategory,
      spiceLevel: prodSpice,
      ingredients: listIngredients,
      sellerName: vendorName || "Independent Kitchen Partner",
      sellerEmail: vendorEmail || "partner@kitchen.net",
    });

    // Reset Form
    setProdName("");
    setProdDescription("");
    setProdIngredientsText("");
    setFormSuccess("Your delicious product has been logged! Check the 'My Submissions' monitor to see review queues.");
    setPortalTab("submissions");
    setTimeout(() => setFormSuccess(""), 4500);
  };

  // Submit recipe
  const handleRecipeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTitle || !recDescription) return;

    const listIng = recIngredientsText
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    const listSteps = recStepsText
      .split(";")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    submitSellerRecipe({
      title: recTitle,
      description: recDescription,
      difficulty: recDifficulty,
      prepTime: recPrep,
      cookTime: recCook,
      ingredients: listIng,
      instructions: listSteps,
      spiceLevel: "Medium", // default intermediate spice
      author: vendorName || "Independent Chef Partner",
      authorEmail: vendorEmail || "partner@kitchen.net",
    });

    setRecTitle("");
    setRecDescription("");
    setRecIngredientsText("");
    setRecStepsText("");
    setFormSuccess("Your culinary recipe guide has been queued for review! Check 'My Submissions' tab.");
    setPortalTab("submissions");
    setTimeout(() => setFormSuccess(""), 4500);
  };

  // Submissions status badges
  const getSubmissionBadgeColor = (status: "Pending" | "Approved" | "Rejected") => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border-amber-205";
      case "Approved":
        return "bg-green-100 text-green-800 border-green-250";
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-250";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 text-left text-editorial-charcoal" id="seller-portal-zone">
      
      {/* 1. NOT REGISTERED SCREEN */}
      {!partnerRegistered ? (
        <div className="max-w-lg mx-auto bg-white border border-editorial-charcoal/15 p-6 md:p-8 space-y-6 mt-6 rounded-none">
          <div className="text-center space-y-2">
            <span className="text-3xl text-editorial-red block pb-2">👨‍🌾</span>
            <span className="text-editorial-red text-[10px] font-mono font-bold uppercase tracking-[0.2em] block">PARTNER ENLISTMENT</span>
            <h2 className="font-serif text-2xl font-bold italic text-editorial-charcoal">
              The Artisan Kitchen Portal
            </h2>
            <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
              Are you a local crop grower, grandmother preserving garlic brines, or a master of premium peppery mashes? Host your small batches on Brine &amp; Bite!
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4 font-sans">
            <div>
              <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Brand or Seller Kitchen Name</label>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                placeholder="e.g., Grandma's Copper Jars, Hot Volcano Sprints"
                required
                className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none rounded-none bg-white font-medium"
              />
            </div>

            <div>
              <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Primary Email Address</label>
              <input
                type="email"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
                placeholder="e.g., chef@coppersmith.com"
                required
                className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none rounded-none bg-white font-medium"
              />
            </div>

            <div>
              <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">A brief story about your brining ethos (Optional)</label>
              <textarea
                rows={3}
                value={vendorBio}
                onChange={(e) => setVendorBio(e.target.value)}
                placeholder="Explain your organic acids, barrel-aging procedures, or why you worship chilis..."
                className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none rounded-none bg-white font-medium"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-editorial-charcoal text-editorial-cream text-[10px] font-mono uppercase tracking-widest font-bold hover:bg-editorial-red hover:border-editorial-red transition-all flex items-center justify-center gap-1.5 rounded-none"
            >
              <UserPlus className="w-4 h-4 text-editorial-green" />
              <span>Register Kitchen &amp; Start Selling</span>
            </button>
          </form>

          <p className="text-[9px] text-editorial-charcoal/40 text-center font-mono uppercase tracking-wider">
            🔒 Sandbox Environment. All inputs persistent to browser storage.
          </p>
        </div>
      ) : (
        /* 2. MAIN SELLER PORTAL CONTENT (IF REGISTERED) */
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Welcome Dashboard Banner Header */}
          <div className="bg-editorial-gray p-6 border border-editorial-charcoal/15 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-none">
            <div className="space-y-1">
              <span className="text-[9px] text-[#C1121F] font-mono font-extrabold uppercase tracking-widest">Independent Artisan Control Centre</span>
              <h2 className="font-serif text-2xl font-bold italic text-editorial-charcoal">
                Welcome, {vendorName || "Artisan Chef"}!
              </h2>
              <div className="flex gap-4 text-xs font-serif text-[#1A1A1A]/70 italic pt-1">
                <span>Account: <span className="font-sans font-bold not-italic font-mono text-[10px] bg-white border border-editorial-charcoal/10 px-1.5">{vendorEmail}</span></span>
                <span>Active Status: <span className="font-sans font-extrabold not-italic text-[10px] uppercase text-editorial-green">Sandbox Verified</span></span>
              </div>
            </div>

            {/* Switchers button group */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setPortalTab("overview")}
                className={`px-4 py-1.5 text-[9px] font-mono uppercase tracking-wider font-bold transition-all rounded-none ${
                  portalTab === "overview"
                    ? "bg-editorial-charcoal text-editorial-cream"
                    : "bg-white text-editorial-charcoal border border-editorial-charcoal/15 hover:bg-editorial-gray"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setPortalTab("product-form")}
                className={`px-4 py-1.5 text-[9px] font-mono uppercase tracking-wider font-bold transition-all rounded-none ${
                  portalTab === "product-form"
                    ? "bg-[#C1121F] text-editorial-cream shadow-2xs animate-pulse"
                    : "bg-white text-editorial-charcoal border border-editorial-charcoal/15 hover:bg-editorial-gray"
                }`}
              >
                + List Product
              </button>
              <button
                onClick={() => setPortalTab("recipe-form")}
                className={`px-4 py-1.5 text-[9px] font-mono uppercase tracking-wider font-bold transition-all rounded-none ${
                  portalTab === "recipe-form"
                    ? "bg-editorial-charcoal text-editorial-cream"
                    : "bg-white text-editorial-charcoal border border-editorial-charcoal/15 hover:bg-editorial-gray"
                }`}
              >
                + Post Recipe
              </button>
              <button
                onClick={() => setPortalTab("submissions")}
                className={`px-4 py-1.5 text-[9px] font-mono uppercase tracking-wider font-bold transition-all rounded-none ${
                  portalTab === "submissions"
                    ? "bg-editorial-charcoal text-editorial-cream font-bold"
                    : "bg-white text-editorial-charcoal border border-editorial-charcoal/15 hover:bg-editorial-gray"
                }`}
              >
                All Submissions ({sellerSubmissions.length + recipeSubmissions.length})
              </button>
            </div>
          </div>

          {/* Toast notifications */}
          {formSuccess && (
            <div className="bg-[#FAF9F6] border border-editorial-green/30 p-4 text-editorial-green text-xs font-mono uppercase tracking-wider flex items-center gap-2 animate-bounce rounded-none">
              <Check className="w-4 h-4 text-editorial-green shrink-0" />
              <span>{formSuccess}</span>
            </div>
          )}

          {/* DYNAMIC TAB COMPONENT PANELS */}
          
          {/* 2A. OVERVIEW TAB */}
          {portalTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Guidelines Segment */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 border border-editorial-charcoal/15 space-y-4 rounded-none">
                  <h3 className="font-serif text-lg font-bold text-editorial-charcoal italic pb-2 border-b border-editorial-charcoal/10">
                    Artisan Partner Guidelines
                  </h3>
                  <p className="text-[#1A1A1A]/75 text-xs leading-relaxed font-sans">
                    Welcome to the specialized Brine circle. Unlike grocery mass-producers, our clientele seeks rich oak-barrel fermentations, authentic peppery scaling, and precise culinary steps. To publish successfully:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="bg-[#FAF9F6] p-4 space-y-1.5 border border-editorial-charcoal/10 rounded-none text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-green block">🥒 Snaps Matter</span>
                      <p className="text-[#1A1A1A]/70 text-xs leading-normal font-sans pt-1">
                        Disclose exact herbs, grape leaf preservation tricks, and mineral ratios. Crispy snap is the visual baseline for fine selection!
                      </p>
                    </div>

                    <div className="bg-[#FAF9F6] p-4 space-y-1.5 border border-editorial-charcoal/10 rounded-none text-left">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-red block">🌶️ Heat Declaration</span>
                      <p className="text-[#1A1A1A]/70 text-xs leading-normal font-sans pt-1">
                        Be precise: mild banana slices, scorching habanero mashes, or vaporized ghost pepper scales. Users respect the Scoville details.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-editorial-charcoal/10 flex justify-between">
                    <button
                      onClick={() => setPortalTab("product-form")}
                      className="px-4 py-2.5 bg-editorial-charcoal text-editorial-cream text-[10px] font-mono uppercase tracking-wider transition-colors hover:bg-editorial-red"
                    >
                      List a Product Batch
                    </button>
                    <button
                      onClick={() => setPortalTab("recipe-form")}
                      className="px-4 py-2.5 bg-editorial-gray text-editorial-charcoal border border-editorial-charcoal/15 text-[10px] font-mono uppercase tracking-wider transition-colors hover:bg-white"
                    >
                      Post Cooking Guide
                    </button>
                  </div>
                </div>

                {/* Micro simulator testing warning */}
                <div className="bg-editorial-cream p-5 border border-editorial-charcoal/15 flex gap-4 text-editorial-charcoal text-xs rounded-none">
                  <AlertTriangle className="w-5 h-5 text-editorial-red shrink-0" />
                  <div className="space-y-1.5">
                    <span className="font-mono font-bold uppercase tracking-widest text-[9.5px] text-editorial-red block">Sandbox Routing Advisory</span>
                    <p className="text-xs leading-relaxed font-sans">
                      This represents an active simulation. Once you submit, click <span className="font-bold underline">Admin Role</span> in the master header. You can review, deny, or publish submitted items directly into the general customer listings!
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick stats on right */}
              <div className="space-y-6">
                <div className="bg-editorial-gray p-6 border border-editorial-charcoal/15 space-y-4 rounded-none text-left">
                  <h4 className="font-serif text-sm font-bold text-editorial-charcoal italic">Registry Profile</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 border border-editorial-charcoal/10">
                      <span className="text-[8px] font-mono text-[#1A1A1A]/40 font-bold block uppercase tracking-wider">MEMBER SEED</span>
                      <span className="text-lg font-mono font-black text-editorial-charcoal">
                        {sellerSubmissions.length + recipeSubmissions.length}
                      </span>
                    </div>
                    <div className="bg-white p-3 border border-editorial-charcoal/10">
                      <span className="text-[8px] font-mono text-[#1A1A1A]/40 font-bold block uppercase tracking-wider">STATE</span>
                      <span className="text-[10px] font-mono font-bold text-[#C1121F] block mt-1 uppercase">SANDBOX</span>
                    </div>
                  </div>

                  <div className="p-4 bg-white border border-editorial-charcoal/10 rounded-none space-y-2 text-xs">
                    <span className="font-mono font-bold uppercase text-[9px] text-editorial-charcoal/55 block">Tuning &amp; Signing</span>
                    <p className="text-[#1A1A1A]/70 text-[11px] leading-relaxed">
                      To dislodge or deregister this simulated profile from local browser cookies, click below:
                    </p>
                    <button
                      onClick={() => {
                        localStorage.removeItem("p_m_partner_registered");
                        setPartnerRegistered(false);
                      }}
                      className="text-[10px] text-[#C1121F] hover:underline font-mono uppercase tracking-widest font-bold mt-2 inline-block border border-[#C1121F]/20 px-2 py-1 hover:bg-[#C1121F]/5 transition-colors"
                    >
                      Deregister Vendor
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 2B. PRODUCT FORM TAB */}
          {portalTab === "product-form" && (
            <div className="bg-white border border-editorial-charcoal/15 p-6 md:p-8 max-w-2xl mx-auto space-y-6 rounded-none shadow-sm">
              <div className="space-y-1 border-b border-editorial-charcoal/10 pb-4">
                <h3 className="font-serif text-xl font-bold italic text-editorial-charcoal">Propose Product Batch Specimen</h3>
                <p className="text-xs text-[#1A1A1A]/60 font-sans">Register a pickle jar, capsicum hot oil, dry herbs, or starter cultures for administrative review.</p>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Product Headline Name</label>
                    <input
                      type="text"
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      placeholder="e.g., Grandma's Ghost Peppers"
                      required
                      className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white rounded-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Target Retail Price (USD $)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={prodPrice}
                      onChange={(e) => setProdPrice(e.target.value)}
                      required
                      className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white font-mono rounded-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Division Segment</label>
                    <select
                      value={prodCategory}
                      onChange={(e) => setProdCategory(e.target.value as any)}
                      className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white text-editorial-charcoal font-sans rounded-none"
                    >
                      <option value="pickle">Pickle (Cucumbers, veggies, krauts) 🥒</option>
                      <option value="pepper">Pepper (Whole peppers, chilis, mashes) 🌶️</option>
                      <option value="oil">Oils / Spiced Chili Crisps 🫙</option>
                      <option value="starter">Starter Kits / Culture Packs 🧪</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono font-bold text-[#C1121F] block mb-1">Scoville Category Profile</label>
                    <select
                      value={prodSpice}
                      onChange={(e) => setProdSpice(e.target.value as any)}
                      className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white text-editorial-charcoal font-sans rounded-none"
                    >
                      <option value="None">None (Sweet/Tangy only) 🌱</option>
                      <option value="Mild">Mild (Warming) 🔥</option>
                      <option value="Medium">Medium (Gentle kick) 🔥🔥</option>
                      <option value="Hot">Hot (Scorching) 🔥🔥🔥</option>
                      <option value="Extreme">Extreme (Scoville Overload!) 💥</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Gourmet Narrative Description</label>
                  <textarea
                    rows={3}
                    value={prodDescription}
                    onChange={(e) => setProdDescription(e.target.value)}
                    placeholder="Describe lactic fermentation durations, oak chips, smoke parameters, recipe pairings..."
                    required
                    className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white rounded-none"
                  ></textarea>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Disclosed Ingredients (comma-separated)</label>
                  <input
                    type="text"
                    value={prodIngredientsText}
                    onChange={(e) => setProdIngredientsText(e.target.value)}
                    placeholder="Cucumbers, Vinegar, Spring water, Salt, Organic Garlic, Dill"
                    required
                    className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white rounded-none"
                  />
                  <span className="text-[10px] text-editorial-charcoal/50 block mt-1.5 italic font-serif">
                    *Artificial flavors, chemical dyes, or processed stabilizers are barred in the Brine Exchange guidelines.
                  </span>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setPortalTab("overview")}
                    className="px-4 py-2 border border-editorial-charcoal/15 text-[#1A1A1A]/80 font-mono uppercase text-[9px] hover:bg-editorial-gray rounded-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-editorial-charcoal text-editorial-cream font-mono uppercase text-[10px] hover:bg-editorial-red hover:border-editorial-red tracking-wider font-bold rounded-none flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Specimen Register</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2C. RECIPE FORM TAB */}
          {portalTab === "recipe-form" && (
            <div className="bg-white border border-editorial-charcoal/15 p-6 md:p-8 max-w-2xl mx-auto space-y-6 rounded-none shadow-sm">
              <div className="space-y-1 border-b border-editorial-charcoal/10 pb-4">
                <h3 className="font-serif text-xl font-bold italic text-editorial-charcoal">Submit Culinary Guide</h3>
                <p className="text-xs text-[#1A1A1A]/60 font-sans">Share experimental cooking instruction sets linking directly to your small-batch products.</p>
              </div>

              <form onSubmit={handleRecipeSubmit} className="space-y-4 font-sans text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Recipe Title</label>
                    <input
                      type="text"
                      value={recTitle}
                      onChange={(e) => setRecTitle(e.target.value)}
                      placeholder="e.g., Crispy Dill Pickle Popper Wraps"
                      required
                      className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white rounded-none"
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Skill Requirement</label>
                    <select
                      value={recDifficulty}
                      onChange={(e) => setRecDifficulty(e.target.value as any)}
                      className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white font-mono rounded-none"
                    >
                      <option value="Easy">Easy / Simple (Under 30 mins)</option>
                      <option value="Medium">Medium / Interm. (Staged Ferments)</option>
                      <option value="Hard">Expert / Master Class (Aseptic work)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Preparation Time</label>
                    <input
                      type="text"
                      value={recPrep}
                      onChange={(e) => setRecPrep(e.target.value)}
                      placeholder="e.g., 20 mins"
                      required
                      className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white rounded-none"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Cooking Time</label>
                    <input
                      type="text"
                      value={recCook}
                      onChange={(e) => setRecCook(e.target.value)}
                      placeholder="e.g., 15 mins"
                      required
                      className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white rounded-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Recipe Summary Synopsis</label>
                  <textarea
                    rows={3}
                    value={recDescription}
                    onChange={(e) => setRecDescription(e.target.value)}
                    placeholder="Briefly state taste profile notes, vinegar scaling, and texture..."
                    required
                    className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white rounded-none"
                  ></textarea>
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Necessary Ingredients (comma-separated)</label>
                  <input
                    type="text"
                    value={recIngredientsText}
                    onChange={(e) => setRecIngredientsText(e.target.value)}
                    placeholder="2 cups vinegar cucumbers, 1 cup butter, sourdough loaf"
                    required
                    className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white rounded-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] uppercase font-mono font-bold text-editorial-charcoal/50 block mb-1">Milestone Stages (semicolon-separated ';')</label>
                  <textarea
                    rows={3}
                    value={recStepsText}
                    onChange={(e) => setRecStepsText(e.target.value)}
                    placeholder="Thoroughly pat dry pickle slices; Prepare deep butter flour mix; Coat each coin and fry for 4 minutes"
                    required
                    className="w-full border border-editorial-charcoal/20 p-2.5 text-xs focus:outline-none bg-white rounded-none whitespace-pre-wrap"
                  ></textarea>
                  <p className="text-[10px] text-editorial-charcoal/50 mt-1 italic font-serif">Separate logical steps with a semicolon. The app renders stage-by-stage counts.</p>
                </div>

                <div className="pt-4 flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setPortalTab("overview")}
                    className="px-4 py-2 border border-editorial-charcoal/15 text-[#1A1A1A]/80 font-mono uppercase text-[9px] hover:bg-editorial-gray rounded-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-editorial-charcoal text-editorial-cream font-mono uppercase text-[10px] hover:bg-editorial-red hover:border-editorial-red tracking-wider font-bold rounded-none"
                  >
                    Commit Recipe guide
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2D. MY SUBMISSIONS TRACKER TAB */}
          {portalTab === "submissions" && (
            <div className="space-y-6">
              
              {/* Product Submissions */}
              <div className="bg-white p-6 border border-editorial-charcoal/15 space-y-4 rounded-none">
                <h3 className="font-serif text-lg font-bold text-editorial-charcoal italic border-b border-editorial-charcoal/10 pb-3">
                  My Prepared Product Jars Submissions ({sellerSubmissions.length})
                </h3>

                {sellerSubmissions.length === 0 ? (
                  <div className="py-8 text-center text-[#1A1A1A]/50 italic font-serif">
                    No small-batch specimens submitted during this session.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1A1A1A]/80 border-collapse">
                      <thead>
                        <tr className="border-b border-editorial-charcoal text-[9px] font-mono text-editorial-charcoal/50 uppercase tracking-widest font-extrabold pb-2">
                          <th className="py-2.5">Jar Batch Name</th>
                          <th className="py-2.5">Category</th>
                          <th className="py-2.5">Proposed Price</th>
                          <th className="py-2.5">Spice Grade</th>
                          <th className="py-2.5 text-right">Submission Queue Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-editorial-charcoal/10 font-sans">
                        {sellerSubmissions.map((sub) => (
                          <tr key={sub.id} className="hover:bg-editorial-gray transition-colors">
                            <td className="py-3 font-serif italic text-sm text-editorial-charcoal font-bold">
                              {sub.name}
                              <span className="block text-[9px] text-[#1A1A1A]/50 font-normal font-mono uppercase not-italic">By Chef {sub.sellerName}</span>
                            </td>
                            <td className="py-3 capitalize text-[#1A1A1A]/70 font-mono text-[11px]">{sub.category}</td>
                            <td className="py-3 font-mono font-bold text-editorial-red">${sub.price.toFixed(2)}</td>
                            <td className="py-3 text-[11px]">{sub.spiceLevel} Heat</td>
                            <td className="py-3 text-right">
                              <span className={`inline-block px-2.5 py-1 rounded-none text-[8px] font-mono font-bold uppercase tracking-wider border ${getSubmissionBadgeColor(sub.status)}`}>
                                {sub.status === "Pending" ? "⏳ Sandbox Queue Pending" : sub.status === "Approved" ? "✓ Approved Live" : "Rejected"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Recipe Submissions */}
              <div className="bg-white p-6 border border-editorial-charcoal/15 space-y-4 rounded-none">
                <h3 className="font-serif text-lg font-bold text-editorial-charcoal italic border-b border-editorial-charcoal/10 pb-3">
                  My Cooking Recipe Guide Submissions ({recipeSubmissions.length})
                </h3>

                {recipeSubmissions.length === 0 ? (
                  <div className="py-8 text-center text-[#1A1A1A]/50 italic font-serif">
                    No custom fermentation recipe files submitted yet in this session.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-[#1A1A1A]/80 border-collapse">
                      <thead>
                        <tr className="border-b border-editorial-charcoal text-[9px] font-mono text-editorial-charcoal/50 uppercase tracking-widest font-bold pb-2">
                          <th className="py-2.5">Recipe Title</th>
                          <th className="py-2.5">Skill Level</th>
                          <th className="py-2.5">Prep / Cook Duration</th>
                          <th className="py-2.5 text-right font-mono">Queue Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-editorial-charcoal/10 font-sans">
                        {recipeSubmissions.map((rsub) => (
                          <tr key={rsub.id} className="hover:bg-editorial-gray transition-colors">
                            <td className="py-3 font-serif italic text-sm text-editorial-charcoal font-bold">
                              {rsub.title}
                              <span className="block text-[9px] text-[#1A1A1A]/50 font-normal font-mono uppercase not-italic">Author: {rsub.author}</span>
                            </td>
                            <td className="py-3 font-mono text-[11px]">{rsub.difficulty}</td>
                            <td className="py-3 text-[#1A1A1A]/70 text-[11px]">Prep {rsub.prepTime} / Cook {rsub.cookTime}</td>
                            <td className="py-3 text-right">
                              <span className={`inline-block px-2.5 py-1 rounded-none text-[8px] font-mono font-bold uppercase tracking-wider border ${getSubmissionBadgeColor(rsub.status)}`}>
                                {rsub.status === "Pending" ? "⏳ Queue Review" : rsub.status === "Approved" ? "✓ Authorized Guide" : "Rejected"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
