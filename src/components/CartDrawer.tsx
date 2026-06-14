import React, { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { ShoppingCart, Plus, Minus, Trash2, X, Info, ShieldAlert, ArrowRight } from "lucide-react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onBeginCheckout: () => void;
}

export default function CartDrawer({ isOpen, onClose, onBeginCheckout }: CartDrawerProps) {
  const { cart, updateCartQuantity, removeFromCart } = useApp();

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  // Free shipping threshold target: $45
  const FREE_SHIPPING_THRESHOLD = 45;
  const distanceToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;
  const isFreeShipping = distanceToFreeShipping <= 0;
  const shippingPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-backdrop" aria-modal="true" role="dialog">
      {/* Background slide panel overlay */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-editorial-charcoal/30 backdrop-blur-3xs"
      ></div>

      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-editorial-cream shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-250 border-l border-editorial-charcoal/25">
        
        {/* Header Drawer */}
        <div className="p-5 border-b border-editorial-charcoal/15 flex items-center justify-between bg-editorial-gray">
          <div className="flex items-center gap-2 text-editorial-charcoal">
            <ShoppingCart className="w-4 h-4 text-editorial-red" />
            <span className="font-serif text-lg font-bold italic">Your Selection</span>
            <span className="bg-editorial-charcoal text-editorial-cream font-mono font-bold text-[9px] px-2 py-0.5 uppercase tracking-widest">
              {cart.reduce((acc, item) => acc + item.quantity, 0)} Items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2 border border-editorial-charcoal/10 hover:border-editorial-charcoal hover:bg-white text-editorial-charcoal/50 hover:text-editorial-charcoal text-[9px] font-mono tracking-widest uppercase transition-all"
            id="close-cart-btn"
          >
            Close
          </button>
        </div>

        {/* Dynamic Free Shipping Milestone Bar */}
        {cart.length > 0 && (
          <div className="bg-white p-5 border-b border-editorial-charcoal/10 space-y-3.5 text-left">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-wider">
              {isFreeShipping ? (
                <span className="text-editorial-green font-bold">🎉 Complimentary Shipping Unlocked</span>
              ) : (
                <span className="text-[#1A1A1A]/70">
                  Add <span className="font-bold text-[#1A1A1A]">${distanceToFreeShipping.toFixed(2)}</span> more for free shipping
                </span>
              )}
              <span className="font-bold text-[#1A1A1A]">
                Est: ${subtotal.toFixed(2)} / ${FREE_SHIPPING_THRESHOLD}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-editorial-gray h-1 rounded-none overflow-hidden">
              <div 
                className="bg-editorial-charcoal h-full rounded-none transition-all duration-300"
                style={{ width: `${shippingPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Item Slots */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-4xl">🏺</span>
              <div className="space-y-2">
                <h4 className="font-serif text-base font-bold text-editorial-charcoal italic">Your harvest basket is empty</h4>
                <p className="text-stone-500 text-xs px-6 leading-relaxed font-sans">
                  Browse our gourmet small-batch listings, dills, and sweet peppers. We guarantee crisp snappings!
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-editorial-charcoal text-editorial-cream text-[10px] uppercase font-mono tracking-widest font-bold transition-all"
              >
                Explore Batches
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div 
                  key={item.product.id} 
                  className="p-4 bg-white border border-editorial-charcoal/10 rounded-none flex items-center justify-between gap-4 text-left"
                  id={`cart-item-${item.product.id}`}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover border border-editorial-charcoal/10 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <span className="text-[8px] font-mono uppercase tracking-widest text-[#C1121F] font-bold block leading-none">{item.product.sellerName}</span>
                    <h5 className="font-serif text-xs font-bold text-editorial-charcoal truncate italic pr-2">{item.product.name}</h5>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-editorial-charcoal font-sans">${item.product.price.toFixed(2)}</span>
                      <span className="text-[9px] text-[#1A1A1A]/40 uppercase font-mono">Vol: {item.product.size || "16 oz"}</span>
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex items-center bg-editorial-gray border border-editorial-charcoal/15 rounded-none p-0.5">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 text-editorial-charcoal/50 hover:text-editorial-charcoal hover:bg-white transition-all"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-[10px] font-bold text-editorial-charcoal font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-editorial-charcoal/50 hover:text-editorial-charcoal hover:bg-white transition-all"
                        disabled={item.quantity >= item.product.stock}
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#1A1A1A]/30 hover:text-[#C1121F] transition-colors p-1"
                      title="Remove jar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer footer summaries */}
        {cart.length > 0 && (
          <div className="bg-editorial-gray border-t border-editorial-charcoal/15 p-5 space-y-4">
            <div className="space-y-2 text-[11px] text-editorial-charcoal/80 text-left">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-mono font-bold text-editorial-charcoal">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-mono font-bold text-editorial-charcoal">
                  {isFreeShipping ? <span className="text-editorial-green font-bold">COMPLIMENTARY</span> : `$${subtotal > 40 ? "4.99" : "8.99"}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Est. Local Taxes (calculated):</span>
                <span className="font-mono font-bold text-editorial-charcoal">${(subtotal * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t border-editorial-charcoal/10 pt-2 flex justify-between text-xs font-bold uppercase tracking-wider">
                <span className="font-serif font-black text-editorial-charcoal italic">Estimated Total</span>
                <span className="font-mono font-black text-editorial-red text-base">
                  ${(subtotal + (isFreeShipping ? 0 : (subtotal > 40 ? 4.99 : 8.99)) + subtotal * 0.08).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Micro secure label */}
            <div className="p-2 border border-editorial-charcoal/10 text-[9px] uppercase tracking-wider font-mono text-editorial-charcoal/50 flex items-center justify-between">
              <span>🔒 Encrypted Link</span>
              <span>100% Sandbox Certified</span>
            </div>

            <button
              id="begin-checkout-btn"
              onClick={onBeginCheckout}
              className="w-full bg-editorial-charcoal text-editorial-cream border border-editorial-charcoal hover:bg-editorial-red hover:border-editorial-red font-bold py-3.5 rounded-none text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-[0.15em]"
            >
              <span>Commit Purchase</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
