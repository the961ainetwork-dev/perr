import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Product } from "../types";
import { ShoppingCart, Check, X, ArrowRight, HelpCircle, FileText, Sparkles, CreditCard, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CatalogueProps {
  onOpenCart?: () => void;
  onSetTab: (tab: string) => void;
}

export default function Catalogue({ onOpenCart, onSetTab }: CatalogueProps) {
  const { products, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, placeOrder, addToast } = useApp();

  // Quantities selection map
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  // Probiotics option selection map (defaults to "Active Probiotics")
  const [probiotics, setProbiotics] = useState<Record<string, "Active" | "Pasteurized">>({});

  // Continue shopping modal state
  const [showContinueModal, setShowContinueModal] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);

  // Inline checkout wizard states
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");
  const [checkoutZip, setCheckoutZip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");

  // Order placed success state
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // Helper to parse weight to Oz and KG
  const getWeightInfo = (size: string | undefined) => {
    if (!size) return { oz: "16 oz", kg: "0.45 kg" };
    const numMatch = size.match(/\d+/);
    if (numMatch) {
      const oz = parseInt(numMatch[0], 10);
      const kg = (oz * 0.0283495).toFixed(2);
      return { oz: `${oz} oz`, kg: `${kg} kg` };
    }
    return { oz: size, kg: "0.45 kg" };
  };

  // Get current quantity for input field
  const getSelectedQty = (id: string) => quantities[id] ?? 1;

  // Set quantity with limits
  const handleQtyChange = (id: string, val: number, stock: number) => {
    const limited = Math.max(1, Math.min(stock, val));
    setQuantities((prev) => ({ ...prev, [id]: limited }));
  };

  // Add item to cart
  const handleOrderClick = (product: Product) => {
    const qty = getSelectedQty(product.id);
    const probOption = probiotics[product.id] ?? "Active";
    
    // Add to cart with probiotic option preserved in giftMessage
    addToCart(product, qty, undefined, `Probiotics Option: ${probOption}`);
    
    setLastAddedProduct(product);
    setShowContinueModal(true);

    addToast({
      title: "Item Added to Cart",
      message: `Enrolled ${qty}x ${product.name} with ${probOption} Cultures.`,
      type: "success"
    });
  };

  // Compute live subtotal & totals of current cart
  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.selectedPrice !== undefined ? item.selectedPrice : item.product.price;
      return acc + price * item.quantity;
    }, 0);
  }, [cart]);

  const shippingCost = cart.length > 0 ? (cartSubtotal > 40 ? 4.99 : 8.99) : 0;
  const estimatedTax = cartSubtotal * 0.08;
  const grandTotal = cartSubtotal + shippingCost + estimatedTax;

  // Execute Order (Complete Payment)
  const handleExecuteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      addToast({
        title: "Cart is Empty",
        message: "Add some items to your cart before checking out.",
        type: "warning"
      });
      return;
    }

    if (!checkoutName.trim() || !checkoutEmail.trim() || !checkoutAddress.trim() || !checkoutCity.trim() || !checkoutZip.trim()) {
      addToast({
        title: "Missing Fields",
        message: "Please complete all shipping address and contact fields.",
        type: "warning"
      });
      return;
    }

    try {
      const orderResult = placeOrder({
        customerName: checkoutName,
        customerEmail: checkoutEmail,
        shippingAddress: checkoutAddress,
        city: checkoutCity,
        zipCode: checkoutZip,
        paymentMethod: paymentMethod,
      });

      setSuccessOrder(orderResult);
      addToast({
        title: "Order Executed!",
        message: `Invoice ${orderResult.id} registered. Total: $${orderResult.total.toFixed(2)}`,
        type: "success"
      });

      // Clear input fields
      setCheckoutName("");
      setCheckoutEmail("");
      setCheckoutAddress("");
      setCheckoutCity("");
      setCheckoutZip("");
    } catch (err: any) {
      addToast({
        title: "Error Placing Order",
        message: err.message || "An unexpected error occurred during execution.",
        type: "warning"
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 font-sans text-editorial-charcoal relative text-[13.5px] sm:text-[15.5px]" id="catalogue-view">
      
      {/* Decorative Title Block */}
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 bg-editorial-charcoal text-editorial-cream px-3 py-1 text-[12px] font-mono uppercase tracking-widest font-extrabold">
          <span>🏺 GLOBAL REGISTRY CATALOGUE 🏺</span>
        </div>
        <h2 className="font-serif text-4xl sm:text-5xl font-extrabold italic text-editorial-charcoal leading-tight tracking-tight">
          The Curated Crop Specimens Index
        </h2>
        <p className="text-sm text-editorial-charcoal/70 max-w-xl mx-auto font-serif italic">
          Inspect, evaluate, and order small-batch live lacto-fermented specimens directly from our cooperative farmers. Configure custom active probiotics per item.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* THE CENTRAL PRODUCTS INDEX TABLE (FULL WIDTH) */}
        <div className="w-full space-y-6">
          <div className="bg-white border-2 border-editorial-charcoal/15 shadow-sm overflow-hidden">
            <div className="p-4 bg-editorial-charcoal text-editorial-cream border-b border-editorial-charcoal flex justify-between items-center">
              <span className="font-mono text-[12px] uppercase tracking-widest font-bold">Specimens Catalog Registry</span>
              <span className="text-[12px] font-mono uppercase px-2 py-0.5 bg-editorial-red text-white font-bold">{products.length} Items Listed</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13.5px] whitespace-nowrap min-w-[700px]">
                <thead>
                  <tr className="bg-editorial-gray/60 text-editorial-charcoal/70 uppercase tracking-widest font-mono text-[11px] border-b border-editorial-charcoal/10 font-bold">
                    <th className="p-3">ID</th>
                    <th className="p-3">Specimen Spec</th>
                    <th className="p-3 w-1/3 min-w-[320px]">Description</th>
                    <th className="p-3">KG Equivalent</th>
                    <th className="p-3">Probiotics Option</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-center">Order Selection</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-editorial-charcoal/10">
                  {products.map((p) => {
                    const weight = getWeightInfo(p.size);
                    const selectedProb = probiotics[p.id] ?? "Active";
                    const selectedQty = getSelectedQty(p.id);
                    const isOutOfStock = p.stock <= 0;

                    return (
                      <tr key={p.id} className="hover:bg-editorial-gray/15 transition-colors group" id={`specimen-row-${p.id}`}>
                        {/* ID */}
                        <td className="p-3 font-mono text-[11.5px] font-bold text-editorial-red">
                          #{p.id.replace("prod-", "")}
                        </td>

                        {/* SPECIMEN NAME & IMAGE */}
                        <td className="p-3">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-8 h-8 object-cover border border-editorial-charcoal/10 shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-serif italic font-extrabold text-sm block text-editorial-charcoal group-hover:text-editorial-red transition-all">
                                {p.name}
                              </span>
                              <span className="inline-block px-1.5 py-0.5 mt-0.5 font-mono text-[10px] font-bold uppercase tracking-widest bg-stone-100 text-stone-600 border border-stone-200">
                                {p.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* DESCRIPTION */}
                        <td className="p-3 whitespace-normal text-[12.5px] leading-relaxed text-editorial-charcoal/80">
                          {p.description}
                        </td>

                        {/* KG EQUIVALENT */}
                        <td className="p-3 font-mono text-stone-500 font-medium">
                          {weight.kg}
                        </td>

                        {/* PROBIOTICS OPTION SELECTOR */}
                        <td className="p-3">
                          <select
                            value={selectedProb}
                            onChange={(e) => setProbiotics((prev) => ({ ...prev, [p.id]: e.target.value as "Active" | "Pasteurized" }))}
                            className="bg-stone-50 border border-editorial-charcoal/15 p-1 text-[12px] font-mono focus:outline-none focus:border-editorial-red rounded-none font-bold"
                          >
                            <option value="Active">🟢 Live Probiotic</option>
                            <option value="Pasteurized">⚪ Pasteurized</option>
                          </select>
                        </td>

                        {/* PRICE */}
                        <td className="p-3 text-right font-serif font-black text-sm text-editorial-charcoal">
                          ${p.price.toFixed(2)}
                        </td>

                        {/* ORDER BUTTON & QTY INPUT */}
                        <td className="p-3 text-center">
                          {isOutOfStock ? (
                            <span className="px-2 py-1 bg-red-50 text-red-600 border border-red-200 font-mono text-[10px] font-extrabold uppercase tracking-widest">
                              Sold Out
                            </span>
                          ) : (
                            <div className="flex items-center justify-center gap-1.5">
                              <div className="flex items-center border border-editorial-charcoal/15 bg-stone-50 h-7">
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(p.id, selectedQty - 1, p.stock)}
                                  className="px-1.5 text-xs text-editorial-charcoal/60 hover:text-editorial-charcoal font-bold cursor-pointer"
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  max={p.stock}
                                  value={selectedQty}
                                  onChange={(e) => handleQtyChange(p.id, parseInt(e.target.value, 10) || 1, p.stock)}
                                  className="w-8 text-center bg-transparent text-[13px] font-mono font-extrabold focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleQtyChange(p.id, selectedQty + 1, p.stock)}
                                  className="px-1.5 text-xs text-editorial-charcoal/60 hover:text-editorial-charcoal font-bold cursor-pointer"
                                >
                                  +
                                </button>
                              </div>
                              <button
                                onClick={() => handleOrderClick(p)}
                                className="h-7 px-3 bg-editorial-charcoal hover:bg-editorial-red text-editorial-cream text-[12px] font-mono uppercase tracking-widest font-black transition-all rounded-none cursor-pointer flex items-center justify-center gap-1"
                                id={`order-btn-${p.id}`}
                              >
                                <span>Order</span>
                                <ShoppingCart className="w-3 h-3 shrink-0" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* DYNAMIC BACK TO CATALOGUE ACTION BAR */}
          <div className="bg-stone-50 border border-[#FAF9F6]/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-serif font-extrabold italic text-editorial-charcoal text-base">Need Help Customizing?</h4>
              <p className="text-[13px] text-editorial-charcoal/60 leading-relaxed max-w-md">
                Our brine specialists configure specific lactic fermentation metrics for multi-gallon commercial orders. Access our tracking portal for wholesale requests.
              </p>
            </div>
            <button
              onClick={() => onSetTab("tracker")}
              className="px-4 py-2 border border-editorial-charcoal hover:bg-editorial-charcoal hover:text-white text-[12px] font-mono uppercase tracking-wider font-extrabold transition-all shrink-0 rounded-none cursor-pointer"
            >
              Consult Shipment Logs 📋
            </button>
          </div>
        </div>
      </div>

      {/* SECURE CHECKOUT & ORDER SUMMARY PANEL AT THE END OF THE PAGE */}
      {cart.length > 0 && (
        <div className="mt-12 pt-8 border-t-2 border-editorial-charcoal/20 space-y-6 animate-in fade-in duration-200" id="order-execution-block">
          <div className="text-left space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl font-black italic text-editorial-charcoal">
              🏺 Order Execution & Barter Summary
            </h3>
            <p className="text-sm text-editorial-charcoal/60 font-serif italic">
              Review your selected specimen crops in the temporary registry and complete secure dispatch info.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LIVE ORDER SUMMARY */}
            <div className="lg:col-span-5 bg-white border-2 border-editorial-charcoal shadow-md p-5 space-y-5">
              <div className="pb-3 border-b border-editorial-charcoal/20 flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-base">📋</span>
                  <h3 className="font-serif font-extrabold italic text-base text-editorial-charcoal">Order Exec Summary</h3>
                </div>
                <span className="font-mono text-[11px] uppercase tracking-wider text-stone-500">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </div>

              <div className="space-y-4">
                {/* Cart Items List */}
                <div className="divide-y divide-stone-100 max-h-[220px] overflow-y-auto pr-1">
                  {cart.map((item, idx) => {
                    const price = item.selectedPrice !== undefined ? item.selectedPrice : item.product.price;
                    return (
                      <div key={idx} className="py-2.5 flex items-start justify-between gap-3 text-left">
                        <div className="min-w-0">
                          <span className="block font-serif italic text-sm font-bold text-editorial-charcoal leading-tight truncate">
                            {item.product.name}
                          </span>
                          <span className="block font-mono text-[10px] uppercase text-stone-500 leading-none mt-1">
                            {item.quantity}x @ ${price.toFixed(2)} each
                          </span>
                          {item.giftMessage && (
                            <span className="block font-mono text-[9.5px] text-amber-600 font-extrabold uppercase mt-0.5">
                              🌿 {item.giftMessage}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-mono text-sm text-stone-700 font-bold">
                            ${(price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-stone-300 hover:text-editorial-red transition-colors cursor-pointer"
                            title="Remove specimen"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal Calculations */}
                <div className="bg-stone-50 p-3 border border-stone-200 text-sm space-y-1.5 font-mono">
                  <div className="flex justify-between text-stone-500">
                    <span>Items Subtotal:</span>
                    <span className="font-bold text-stone-700">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Estimated Tax (8%):</span>
                    <span className="font-bold text-stone-700">${estimatedTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500">
                    <span>Secure Delivery Fee:</span>
                    <span className="font-bold text-stone-700">
                      {shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-dashed border-stone-300 pt-2 flex justify-between font-serif font-black italic text-base text-editorial-charcoal">
                    <span>Grand Total Value:</span>
                    <span className="font-mono text-base not-italic text-editorial-red">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between gap-2 text-[11px] font-mono uppercase tracking-widest pt-1">
                  <button
                    onClick={() => {
                      clearCart();
                      addToast({
                        title: "Cart Emptied",
                        message: "All items cleared from temporary registry.",
                        type: "info"
                      });
                    }}
                    className="px-2.5 py-1.5 border border-stone-300 hover:bg-stone-100 hover:text-editorial-red text-stone-500 transition-all font-bold rounded-none cursor-pointer"
                  >
                    Clear Registry
                  </button>
                  <button
                    onClick={onOpenCart}
                    className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-editorial-charcoal transition-all font-bold rounded-none cursor-pointer flex items-center gap-1"
                  >
                    <span>View Large Cart</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* SECURE DIRECT PAYMENT & EXECUTE FORM */}
            <div className="lg:col-span-7 bg-[#1C2D18] text-white border-2 border-editorial-charcoal shadow-md p-5 space-y-4 text-left">
              <div className="pb-2 border-b border-white/10 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-serif font-extrabold italic text-base text-white">Execute Secure Payment</h3>
              </div>

              <form onSubmit={handleExecuteOrder} className="space-y-3.5 font-sans text-sm">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="checkout-name-input" className="font-mono text-[11px] uppercase tracking-widest text-white/50 block font-bold">
                    Recipient Full Name
                  </label>
                  <input
                    id="checkout-name-input"
                    type="text"
                    required
                    placeholder="E.g. Captain Cucumber"
                    value={checkoutName}
                    onChange={(e) => setCheckoutName(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-emerald-400 p-2 text-white placeholder-white/30 rounded-none focus:outline-none transition-colors text-sm"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="checkout-email-input" className="font-mono text-[11px] uppercase tracking-widest text-white/50 block font-bold">
                    Email Address
                  </label>
                  <input
                    id="checkout-email-input"
                    type="email"
                    required
                    placeholder="name@fermentation.org"
                    value={checkoutEmail}
                    onChange={(e) => setCheckoutEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-emerald-400 p-2 text-white placeholder-white/30 rounded-none focus:outline-none transition-colors text-sm"
                  />
                </div>

                {/* Shipping Address */}
                <div className="space-y-1">
                  <label htmlFor="checkout-address-input" className="font-mono text-[11px] uppercase tracking-widest text-white/50 block font-bold">
                    Delivery Address
                  </label>
                  <input
                    id="checkout-address-input"
                    type="text"
                    required
                    placeholder="123 Dill Barrel Lane"
                    value={checkoutAddress}
                    onChange={(e) => setCheckoutAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/15 focus:border-emerald-400 p-2 text-white placeholder-white/30 rounded-none focus:outline-none transition-colors text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* City */}
                  <div className="space-y-1">
                    <label htmlFor="checkout-city-input" className="font-mono text-[11px] uppercase tracking-widest text-white/50 block font-bold">
                      City
                    </label>
                    <input
                      id="checkout-city-input"
                      type="text"
                      required
                      placeholder="Brinesburg"
                      value={checkoutCity}
                      onChange={(e) => setCheckoutCity(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-emerald-400 p-2 text-white placeholder-white/30 rounded-none focus:outline-none transition-colors text-sm"
                    />
                  </div>
                  {/* ZIP */}
                  <div className="space-y-1">
                    <label htmlFor="checkout-zip-input" className="font-mono text-[11px] uppercase tracking-widest text-white/50 block font-bold">
                      ZIP Code
                    </label>
                    <input
                      id="checkout-zip-input"
                      type="text"
                      required
                      placeholder="90210"
                      value={checkoutZip}
                      onChange={(e) => setCheckoutZip(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 focus:border-emerald-400 p-2 text-white placeholder-white/30 rounded-none focus:outline-none transition-colors text-sm"
                    />
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-widest text-white/50 block font-bold">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[12px] font-mono">
                    <label className={`border p-2 flex items-center gap-1.5 cursor-pointer transition-all ${paymentMethod === "Credit Card" ? "bg-white/10 border-emerald-400 text-white" : "border-white/10 text-white/60 hover:border-white/20"}`}>
                      <input
                        type="radio"
                        name="pay-method"
                        value="Credit Card"
                        checked={paymentMethod === "Credit Card"}
                        onChange={() => setPaymentMethod("Credit Card")}
                        className="sr-only"
                      />
                      <CreditCard className="w-3.5 h-3.5 shrink-0" />
                      <span>Credit Card</span>
                    </label>
                    <label className={`border p-2 flex items-center gap-1.5 cursor-pointer transition-all ${paymentMethod === "Brine Gold Coins" ? "bg-white/10 border-emerald-400 text-white" : "border-white/10 text-white/60 hover:border-white/20"}`}>
                      <input
                        type="radio"
                        name="pay-method"
                        value="Brine Gold Coins"
                        checked={paymentMethod === "Brine Gold Coins"}
                        onChange={() => setPaymentMethod("Brine Gold Coins")}
                        className="sr-only"
                      />
                      <span>🪙 Brine Gold</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-sm font-mono uppercase tracking-widest font-black transition-all rounded-none cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                    id="execute-payment-btn"
                  >
                    <span>Execute Order &amp; Pay ${grandTotal.toFixed(2)}</span>
                    <Check className="w-4 h-4 shrink-0" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: CONTINUE SHOPPING FLOW POPUP */}
      <AnimatePresence>
        {showContinueModal && lastAddedProduct && (
          <div className="fixed inset-0 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-4 border-editorial-charcoal p-6 max-w-md w-full text-center space-y-6 shadow-2xl relative"
              id="continue-shopping-modal"
            >
              <button
                onClick={() => setShowContinueModal(false)}
                className="absolute top-3 right-3 text-stone-400 hover:text-editorial-charcoal cursor-pointer"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-2">
                <span className="text-3xl">🛒</span>
                <h4 className="font-serif font-extrabold italic text-editorial-charcoal text-xl">
                  Successfully Enrolled!
                </h4>
                <p className="text-sm text-stone-600 font-sans">
                  You added <strong className="text-editorial-charcoal font-bold">{lastAddedProduct.name}</strong> to your temporary registry.
                </p>
              </div>

              {/* Order summary visualization in Continue Shopping Modal */}
              <div className="bg-stone-50 border border-stone-200 p-3 text-left space-y-1.5 rounded-none font-mono text-[12px]">
                <span className="text-stone-400 uppercase text-[10px] font-bold block">Current Order Summary:</span>
                <div className="flex justify-between font-bold text-stone-700">
                  <span>Subtotal Value:</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-stone-700">
                  <span>Grand Total Value:</span>
                  <span className="text-editorial-red">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <p className="font-serif text-sm font-bold text-editorial-charcoal">
                  Would you like to continue shopping or proceed to payment execution?
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] font-mono uppercase tracking-wider">
                  <button
                    onClick={() => {
                      setShowContinueModal(false);
                      addToast({
                        title: "Continuing Shopping",
                        message: "Keep browsing the specimens registry.",
                        type: "info"
                      });
                    }}
                    className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-editorial-charcoal border border-stone-300 font-bold transition-all rounded-none cursor-pointer"
                  >
                    Yes, Continue Browsing
                  </button>
                  <button
                    onClick={() => {
                      setShowContinueModal(false);
                      // Scroll user directly to the execution checkout block
                      setTimeout(() => {
                        const target = document.getElementById("order-execution-block");
                        if (target) {
                          target.scrollIntoView({ behavior: "smooth" });
                        }
                      }, 100);
                      addToast({
                        title: "Payment Redirection",
                        message: "Secure payment panel centered below.",
                        type: "info"
                      });
                    }}
                    className="w-full py-2 bg-editorial-charcoal text-[#FAF9F6] hover:bg-editorial-red font-bold transition-all rounded-none cursor-pointer"
                  >
                    No, Pay &amp; Checkout 💰
                  </button>
                </div>

                <div className="pt-2 border-t border-stone-150">
                  <button
                    onClick={() => {
                      setShowContinueModal(false);
                      if (onOpenCart) {
                        onOpenCart();
                      }
                    }}
                    className="text-[11px] font-mono text-stone-400 hover:text-editorial-charcoal uppercase tracking-widest font-extrabold flex items-center justify-center gap-1 mx-auto cursor-pointer"
                  >
                    <span>Or direct me to full Cart Drawer</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: SUCCESS RECEIPT SUMMARY POPUP */}
      <AnimatePresence>
        {successOrder && (
          <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-4 border-[#1C2D18] p-6 max-w-md w-full space-y-6 shadow-2xl relative text-left"
              id="order-success-receipt"
            >
              <div className="text-center space-y-2">
                <span className="text-4xl">🎉</span>
                <h3 className="font-serif font-extrabold italic text-2xl text-editorial-charcoal">
                  Invoice Executed Successfully
                </h3>
                <p className="text-[12px] font-mono uppercase text-emerald-600 font-extrabold tracking-widest">
                  Secure Barter Transaction Complete
                </p>
              </div>

              {/* RECEIPT SUMMARY FOR THE ORDER TO EXECUTE */}
              <div className="border border-dashed border-stone-300 p-4 font-mono text-[12.5px] text-stone-700 bg-stone-50 space-y-3.5">
                <div className="flex justify-between border-b border-dashed border-stone-200 pb-2">
                  <span className="font-bold text-stone-500">REGISTRY INVOICE:</span>
                  <span className="font-black text-editorial-red">{successOrder.id}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-stone-400 uppercase text-[10px] font-bold block">RECIPIENT SPEC:</span>
                  <p className="font-sans font-bold text-editorial-charcoal text-sm">{successOrder.customerName}</p>
                  <p className="font-sans text-stone-600">{successOrder.customerEmail}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-stone-400 uppercase text-[10px] font-bold block">SHIPPING DESTINATION:</span>
                  <p className="font-sans font-medium text-stone-700 italic">
                    {successOrder.shippingAddress}, {successOrder.city} - {successOrder.zipCode}
                  </p>
                </div>

                <div className="space-y-1.5 border-t border-dashed border-stone-200 pt-2.5">
                  <span className="text-stone-400 uppercase text-[10px] font-bold block">ACQUIRED CROP RECORD:</span>
                  <div className="max-h-[100px] overflow-y-auto space-y-1 pr-1 text-[12px]">
                    {successOrder.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between">
                        <span className="truncate max-w-[200px]">
                          {item.quantity}x {item.productName}
                        </span>
                        <span className="font-bold shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-dashed border-stone-300 pt-2.5 space-y-1 text-right">
                  <div className="flex justify-between text-stone-500">
                    <span>Tax &amp; Delivery:</span>
                    <span>${successOrder.shippingAndTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-editorial-charcoal font-black text-sm font-serif italic pt-1 border-t border-dotted border-stone-200">
                    <span>Total Barter Cost:</span>
                    <span className="font-mono not-italic text-editorial-red text-sm">${successOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setSuccessOrder(null);
                    onSetTab("tracker");
                  }}
                  className="w-full py-2.5 bg-[#1C2D18] hover:bg-editorial-red text-editorial-cream text-[12px] font-mono uppercase tracking-widest font-black transition-all rounded-none cursor-pointer text-center"
                >
                  Track Live Shipment Status 🚚
                </button>
                <button
                  onClick={() => {
                    setSuccessOrder(null);
                    onSetTab("market");
                  }}
                  className="w-full py-2 text-stone-500 hover:text-editorial-charcoal text-[11px] font-mono uppercase tracking-widest font-bold transition-all text-center cursor-pointer border border-transparent hover:border-stone-200"
                >
                  Close Receipt &amp; Return Home
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
