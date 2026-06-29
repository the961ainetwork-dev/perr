import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Gift, Mail, MessageSquare, Sparkles, Check, Send } from "lucide-react";
import { motion } from "motion/react";

export default function GiftCardSection() {
  const { products, addToCart, addToast } = useApp();
  
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [giftMessage, setGiftMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  const amounts = [20, 50, 100, 250];

  // Try to find the actual gift card product or fall back safely
  const giftCardProduct = products.find((p) => p.id === "gift_card") || {
    id: "gift_card",
    name: "Digital Gift Card",
    description: "Give the gift of premium small-batch dills, sweet & spicy peppers, and probiotic-rich ferments.",
    price: 50.00,
    category: "starter",
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800",
    spiceLevel: "None",
    stock: 9999,
    rating: 5.0,
    reviewsCount: 15,
    ingredients: ["Gourmet Hospitality", "Fermentation Passion", "Good Taste"],
    sellerName: "Hamod & Har Official",
    tags: ["giftcard", "digital"],
    size: "Digital Delivery"
  };

  const handleAddToCart = () => {
    // Validate email
    if (!recipientEmail) {
      setEmailError("Recipient email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setEmailError("");

    // Add to cart with metadata
    addToCart(giftCardProduct, 1, recipientEmail, giftMessage, selectedAmount);

    addToast({
      title: "Voucher Added to Basket",
      message: `A $${selectedAmount} Digital Gift Card for ${recipientEmail} has been added. No shipping fees applied!`,
      type: "success"
    });

    // Reset fields
    setRecipientEmail("");
    setGiftMessage("");
  };

  return (
    <section 
      id="digital-gift-card-section" 
      className="my-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      {/* High-Contrast Grid Container */}
      <div className="bg-editorial-charcoal text-editorial-cream overflow-hidden border border-editorial-charcoal shadow-xl relative grid grid-cols-1 lg:grid-cols-12">
        
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {/* Column 1: Live Interactive Card Voucher (Visual Display) - Col span 5 */}
        <div className="lg:col-span-5 bg-[#1C1C1C] p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-800 relative min-h-[350px]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C1121F]"></span>
              <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-stone-400">Hamod &amp; Har Gazette</span>
            </div>
            <h3 className="font-serif italic font-bold text-2xl mt-4 text-editorial-cream">The Brine Voucher</h3>
            <p className="text-stone-400 text-xs mt-2 font-sans leading-relaxed">
              Real-time specimen curation and pickling academy credits. Delivered instantly to any ferment lover worldwide.
            </p>
          </div>

          {/* Golden/Amber High-Contrast Gift Voucher Mockup Card */}
          <div className="my-8 relative group">
            {/* Soft backdrop glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-[#C1121F] rounded-lg blur-md opacity-35 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/30 p-6 rounded-none shadow-2xl space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif italic font-black text-amber-400 text-lg">PROVISION TICKET</h4>
                  <span className="text-[7px] font-mono text-stone-500 uppercase tracking-widest block">No. H&amp;H-{(selectedAmount * 137).toString(16).toUpperCase()}</span>
                </div>
                <div className="bg-amber-400/10 border border-amber-400/30 p-1.5 rounded-none">
                  <Gift className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between border-b border-stone-800 pb-1 text-[10px] font-mono">
                  <span className="text-stone-500 uppercase tracking-wider">VALUE:</span>
                  <span className="text-amber-400 font-bold">${selectedAmount}.00 USD</span>
                </div>
                <div className="flex justify-between border-b border-stone-800 pb-1 text-[10px] font-mono">
                  <span className="text-stone-500 uppercase tracking-wider">RECIPIENT:</span>
                  <span className="text-stone-200 truncate max-w-[180px]">
                    {recipientEmail ? recipientEmail : "awaiting_address@..."}
                  </span>
                </div>
                {giftMessage && (
                  <div className="text-[10px] font-mono pt-1">
                    <span className="text-stone-500 uppercase tracking-wider block">CURATOR NOTE:</span>
                    <p className="text-amber-400/90 italic truncate mt-0.5 font-serif">"{giftMessage}"</p>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-2 text-[8px] font-mono text-stone-500 border-t border-stone-800/60">
                <span>REDEEMABLE AT ANY MEMBER FARM</span>
                <span className="text-[#C1121F] font-bold">EXCLUDES SHIPPING FEE ✓</span>
              </div>
            </div>
          </div>

          <div className="text-[9px] font-mono text-stone-500 flex justify-between">
            <span>ISSUED ELECTRONICALLY</span>
            <span>SECURE CHECKOUT GUARANTEED</span>
          </div>
        </div>

        {/* Column 2: Interactive Controls / Custom Variant Options - Col span 7 */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between space-y-8 bg-editorial-charcoal">
          
          <div className="space-y-6">
            <div>
              <span className="inline-block bg-[#C1121F] text-editorial-cream text-[9px] font-mono uppercase font-bold tracking-widest px-2.5 py-1 mb-3">
                Digital Special Provision
              </span>
              <h2 className="font-serif text-3xl font-black italic tracking-tight text-editorial-cream">
                Gift Card Curation Registry
              </h2>
              <p className="text-stone-300 text-xs mt-2 leading-relaxed">
                Choose a dollar value variant. Fill out your recipe recipient's email coordinates, attach an optional curation message, and commit to checkout. Upon checkout authorization, our system auto-dispatches the secure voucher.
              </p>
            </div>

            {/* Quick-Select Button Group for Variants */}
            <div className="space-y-3">
              <label className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold">
                Select Dollar Variant amount (USD)
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {amounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSelectedAmount(amt)}
                    className={`py-3 font-mono font-bold text-xs uppercase tracking-wider transition-all border ${
                      selectedAmount === amt
                        ? "bg-amber-400 border-amber-400 text-editorial-charcoal scale-[1.03]"
                        : "bg-stone-900 border-stone-800 text-stone-300 hover:border-stone-700 hover:bg-stone-850"
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Recipient Email & Gift Message */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label 
                  htmlFor="recipient-email-input" 
                  className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1"
                >
                  <Mail className="w-3 h-3 text-amber-400" />
                  <span>Recipient Email *</span>
                </label>
                <input
                  id="recipient-email-input"
                  type="email"
                  placeholder="fermenter@example.com"
                  value={recipientEmail}
                  onChange={(e) => {
                    setRecipientEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  className={`w-full bg-stone-900 border ${
                    emailError ? "border-editorial-red" : "border-stone-800 focus:border-amber-400"
                  } p-3 text-stone-100 text-xs font-mono rounded-none focus:outline-none transition-colors`}
                />
                {emailError && (
                  <p className="text-[#C1121F] text-[10px] font-mono mt-1">{emailError}</p>
                )}
              </div>

              <div className="space-y-2">
                <label 
                  htmlFor="gift-message-input" 
                  className="block text-[10px] font-mono uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3 text-amber-400" />
                  <span>Curation message</span>
                </label>
                <input
                  id="gift-message-input"
                  type="text"
                  placeholder="e.g. Keep those cucumbers crispy! Happy Holidays."
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-amber-400 p-3 text-stone-100 text-xs font-mono rounded-none focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Bulleted Perks */}
            <div className="p-3 bg-[#1C1C1C] border border-stone-850 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[10px] font-mono text-stone-400">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-editorial-green shrink-0" />
                <span>Zero Shipping Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-editorial-green shrink-0" />
                <span>Instant Code Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-editorial-green shrink-0" />
                <span>No Expiry Lifetime</span>
              </div>
            </div>
          </div>

          {/* Action trigger button */}
          <button
            onClick={handleAddToCart}
            id="gift-card-add-to-cart-btn"
            className="w-full bg-amber-400 hover:bg-amber-500 text-editorial-charcoal font-bold py-4 text-xs uppercase tracking-widest transition-all rounded-none flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 animate-spin text-[#C1121F]" style={{ animationDuration: "3s" }} />
            <span>Secure Digital Provision to Basket</span>
          </button>
        </div>

      </div>
    </section>
  );
}
