import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { X, CheckCircle2, ArrowRight, ArrowLeft, CreditCard, Shield, MapPin, Printer } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (orderId: string) => void;
}

export default function CheckoutModal({ isOpen, onClose, onOrderCompleted }: CheckoutModalProps) {
  const { cart, placeOrder } = useApp();

  // Multi-step phase: 1 (Shipping), 2 (Payment), 3 (Success Receipt)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State: Shipping
  const [customerName, setCustomerName] = useState("Jane Doe");
  const [customerEmail, setCustomerEmail] = useState("jane.doe@example.com");
  const [shippingAddress, setShippingAddress] = useState("721 Vineyard Road, Apt C");
  const [city, setCity] = useState("Portland");
  const [zipCode, setZipCode] = useState("97201");
  const [phone, setPhone] = useState("(503) 555-0142");

  // Form State: Payment
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [paymentMethod, setPaymentMethod] = useState("Visa ending 4444");

  // Generated Order Receipt object
  const [placedOrderDetails, setPlacedOrderDetails] = useState<any>(null);
  const [invoicePrinted, setInvoicePrinted] = useState(false);

  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  }, [cart]);

  const shippingCost = subtotal > 45 ? 0 : (subtotal > 40 ? 4.99 : 8.99);
  const taxCost = parseFloat((subtotal * 0.08).toFixed(2));
  const orderTotal = parseFloat((subtotal + shippingCost + taxCost).toFixed(2));

  // Forward Action trigger
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !shippingAddress) return;
    setStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardCvv) return;

    // Simulate order placement
    const newOrder = placeOrder({
      customerName,
      customerEmail,
      shippingAddress,
      city,
      zipCode,
      paymentMethod,
    });

    setPlacedOrderDetails(newOrder);
    setInvoicePrinted(false);
    setStep(3);
  };

  const handleFinishCheckout = () => {
    if (placedOrderDetails) {
      onOrderCompleted(placedOrderDetails.id);
    }
    onClose();
    setStep(1);
    setPlacedOrderDetails(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-editorial-charcoal/30 backdrop-blur-xs flex items-center justify-center p-4" id="checkout-modal">
      <div className="bg-editorial-cream rounded-none max-w-2xl w-full border border-editorial-charcoal/25 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="p-5 bg-editorial-gray border-b border-editorial-charcoal/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-editorial-charcoal text-sm font-mono font-bold uppercase tracking-wider">
              {step === 1 ? "Step I: Shipment Registry" : step === 2 ? "Step II: Secured Clearance" : "Step III: Batch Specimen Receipt"}
            </span>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-1 px-2.5 border border-editorial-charcoal/10 hover:border-editorial-charcoal text-editorial-charcoal/50 hover:text-editorial-charcoal text-[9px] font-mono tracking-widest uppercase transition-all rounded-none bg-white"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Scroll display area */}
        <div className="overflow-y-auto p-6 flex-1 text-left space-y-6">
          
          {/* Progress indicators */}
          {step !== 3 && (
            <div className="flex items-center justify-center gap-4 text-[10px] font-mono uppercase tracking-wider text-editorial-charcoal/40">
              <span className={step === 1 ? "text-editorial-red font-bold" : "text-editorial-charcoal/60"}>I. Delivery Specs</span>
              <span className="w-10 h-px bg-editorial-charcoal/15"></span>
              <span className={step === 2 ? "text-editorial-red font-bold" : "text-editorial-charcoal/60"}>II. Sec. Payment</span>
              <span className="w-10 h-px bg-editorial-charcoal/15"></span>
              <span>III. Manifest Cleared</span>
            </div>
          )}

          {/* PHASE 1: SHIPPING FORM */}
          {step === 1 && (
            <form onSubmit={handleShippingSubmit} className="space-y-4">
              <div className="bg-white p-4 rounded-none text-editorial-charcoal text-xs border border-editorial-charcoal/15 flex items-start gap-2.5 leading-relaxed font-sans">
                <MapPin className="w-4.5 h-4.5 text-[#C1121F] mt-0.5 shrink-0" />
                <span>Our batch logistics employ climate-regulated transport to keep small-batch ferments preserved. Consignments are packed using insulated organic starch mats.</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-editorial-charcoal block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full border border-editorial-charcoal/20 rounded-none p-2.5 text-xs bg-white text-editorial-charcoal font-sans"
                    placeholder="E.g. Clara Dill"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-editorial-charcoal block mb-1">Email Coordinates</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full border border-editorial-charcoal/20 rounded-none p-2.5 text-xs bg-white text-editorial-charcoal font-sans"
                    placeholder="chef@dillevents.com"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest text-editorial-charcoal block mb-1">Physical Street Address</label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                  className="w-full border border-editorial-charcoal/20 rounded-none p-2.5 text-xs bg-white text-editorial-charcoal font-sans"
                  placeholder="e.g. 102 Brining Springs Lane"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 pb-1">
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A] block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full border border-editorial-charcoal/20 rounded-none p-2.5 text-xs bg-white text-editorial-charcoal font-sans"
                  />
                </div>
                <div>
                  <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A] block mb-1">Zip Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="w-full border border-editorial-charcoal/20 rounded-none p-2.5 text-xs bg-white text-editorial-charcoal font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest text-editorial-charcoal block mb-1">Telephone Contact</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full border border-editorial-charcoal/20 rounded-none p-2.5 text-xs bg-white text-editorial-charcoal font-mono"
                />
              </div>

              {/* Order total summaries inline */}
              <div className="bg-[#FAF9F6] p-4 border border-editorial-charcoal/15 flex items-center justify-between text-xs font-sans">
                <div>
                  <span className="text-[#1A1A1A]/50 block uppercase tracking-wider text-[9px] font-mono">Consignment Manifest Valuation</span>
                  <span className="text-editorial-charcoal font-bold font-serif italic">Total with Custom Clearance & Taxes:</span>
                </div>
                <span className="font-mono text-base font-black text-editorial-red">${orderTotal.toFixed(2)}</span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-[10px] uppercase font-mono tracking-wider font-bold text-editorial-charcoal/60 hover:text-editorial-charcoal hover:underline"
                >
                  Back to Basket
                </button>
                <button
                  type="submit"
                  className="px-5 py-3 bg-editorial-charcoal text-editorial-cream rounded-none text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-editorial-red transition-all shadow-md"
                >
                  <span>Authorize Checkout Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* PHASE 2: SECURED PAYMENT FORM */}
          {step === 2 && (
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="bg-white p-4 rounded-none text-editorial-charcoal text-xs border border-editorial-charcoal/15 flex items-start gap-2.5 leading-relaxed font-sans">
                <Shield className="w-4.5 h-4.5 text-[#C1121F] mt-0.5 shrink-0" />
                <span>Encrypted secure Sandbox gateway. Test records are handled locally under browser memory; no actual card transactions will occur.</span>
              </div>

              <div>
                <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A] block mb-2">Select Clearance Gateway</label>
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("Visa ending 4444");
                      setCardNumber("4111 2222 3333 4444");
                    }}
                    className={`p-4 rounded-none border font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-xs uppercase tracking-widest font-mono ${
                      paymentMethod.includes("Visa")
                        ? "border-editorial-charcoal bg-white text-editorial-charcoal font-black"
                        : "border-editorial-charcoal/10 bg-editorial-gray/10 hover:bg-white text-editorial-charcoal/50"
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-editorial-red" />
                    <span>Visa / Credit card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("Google Pay");
                      setCardNumber("•••• •••• •••• GPay");
                    }}
                    className={`p-4 rounded-none border font-bold flex flex-col items-center justify-center gap-1.5 transition-all text-xs uppercase tracking-widest font-mono ${
                      paymentMethod === "Google Pay"
                        ? "border-editorial-charcoal bg-white text-editorial-charcoal font-black"
                        : "border-editorial-charcoal/10 bg-editorial-gray/10 hover:bg-white text-editorial-charcoal/50"
                    }`}
                  >
                    <span>🎯</span>
                    <span>Express G-Pay</span>
                  </button>
                </div>
              </div>

              {paymentMethod !== "Google Pay" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A] block mb-1">Secured Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                      className="w-full border border-editorial-charcoal/20 rounded-none p-2.5 text-xs bg-white text-editorial-charcoal font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A] block mb-1">Expiration MM/YY</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        required
                        className="w-full border border-editorial-charcoal/20 rounded-none p-2.5 text-xs bg-white text-editorial-charcoal font-mono"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase font-bold tracking-widest text-[#1A1A1A] block mb-1">CVV Pin</label>
                      <input
                        type="password"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        required
                        maxLength={4}
                        className="w-full border border-editorial-charcoal/20 rounded-none p-2.5 text-xs bg-white text-editorial-charcoal font-mono"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order total summaries inline */}
              <div className="bg-[#FAF9F6] p-4 border border-editorial-charcoal/15 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#1A1A1A]/50 block text-[9px] font-mono uppercase">Destined coordinates: {city}, {zipCode}</span>
                  <span className="text-editorial-charcoal font-bold font-serif italic">Total Certified Amount:</span>
                </div>
                <span className="font-mono text-base font-black text-editorial-green">${orderTotal.toFixed(2)}</span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-editorial-charcoal/20 text-editorial-charcoal text-[10px] font-mono uppercase tracking-widest rounded-none hover:bg-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Info</span>
                </button>
                <button
                  type="submit"
                  id="submit-payment-btn"
                  className="px-6 py-3 bg-[#C1121F] text-editorial-cream text-xs font-mono font-bold uppercase tracking-widest hover:bg-editorial-charcoal transition-all shadow-md"
                >
                  Confirm Order &mdash; ${orderTotal.toFixed(2)}
                </button>
              </div>
            </form>
          )}

          {/* PHASE 3: RECEIPT SUCCESS PAGE */}
          {step === 3 && placedOrderDetails && (
            <div className="space-y-6 text-center animate-in fade-in duration-300">
              <div className="space-y-2">
                <span className="text-4xl block">🏺</span>
                <h3 className="font-serif text-2xl font-bold text-editorial-charcoal italic">
                  Brine Jar Confirmed
                </h3>
                <p className="text-xs text-stone-605 max-w-sm mx-auto font-sans leading-relaxed">
                  Excellent snap choices, {placedOrderDetails.customerName}! Your order is cleared inside our memory state under reference number:
                </p>
                <div className="inline-block bg-white border border-editorial-charcoal p-2 py-1 font-mono font-bold text-xs uppercase tracking-widest text-[#C1121F]">
                  REF: {placedOrderDetails.id}
                </div>
              </div>

              {/* Printable Invoice Block */}
              <div className="bg-white border border-editorial-charcoal/25 rounded-none p-5 text-left text-xs font-sans space-y-4 max-w-md mx-auto shadow-sm">
                <div className="flex justify-between pb-3 border-b border-editorial-charcoal/20">
                  <div>
                    <span className="font-serif font-bold text-base block italic text-editorial-charcoal heading-class">Invoice Receipt</span>
                    <span className="text-[10px] text-editorial-charcoal/50 font-mono">Date: {placedOrderDetails.createdAt.split("T")[0]}</span>
                  </div>
                  <span className="text-editorial-green bg-[#FAF9F6] border border-editorial-green/20 px-2 py-0.5 font-bold text-[9px] tracking-widest uppercase font-mono">
                    CLEARED
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-editorial-charcoal/50 uppercase tracking-widest block mb-0.5">Purchased Jar Specimens</span>
                  {placedOrderDetails.items.map((it: any, i: number) => (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                      <span className="text-editorial-charcoal">{it.productName} <span className="text-editorial-charcoal/40 font-mono font-bold">x{it.quantity}</span></span>
                      <span className="font-mono font-bold text-editorial-charcoal">${(it.price * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-editorial-charcoal/10 pt-3 space-y-1 text-[11px] font-mono text-[#1A1A1A]/80">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${placedOrderDetails.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Logistics Packaging:</span>
                    <span>{placedOrderDetails.shippingAndTax > 5 ? `$${placedOrderDetails.shippingAndTax}` : "COMPLIMENTARY"}</span>
                  </div>
                  <div className="flex justify-between font-bold text-editorial-red text-xs border-t border-dashed border-editorial-charcoal/20 pt-1.5">
                    <span>Final Amount Paid:</span>
                    <span>${placedOrderDetails.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-editorial-charcoal/15 pt-3 text-[10.5px] text-editorial-charcoal/70 space-y-0.5">
                  <span className="font-bold text-editorial-charcoal block text-[10px] uppercase font-mono tracking-widest">Delivery Specs</span>
                  <span className="font-serif italic">{placedOrderDetails.customerName}</span>
                  <span className="block">{placedOrderDetails.shippingAddress}</span>
                  <span className="block">{placedOrderDetails.city}, Zip Code {placedOrderDetails.zipCode}</span>
                </div>

                <div className="bg-editorial-gray p-3 border border-editorial-charcoal/10 text-[10px] text-editorial-charcoal/70 leading-relaxed">
                  🚚 <span className="font-mono uppercase text-[9px] font-bold">Logistic Alert:</span> Brined canisters are gathered for shipment tomorrow. Under oversight of Brine Express. Estimated arrival window: 3-4 solar days.
                </div>
              </div>

              {/* Inline print trigger state */}
              {invoicePrinted && (
                <div className="p-3 bg-editorial-green/10 text-editorial-green border border-editorial-green/20 text-xs font-mono uppercase tracking-wider max-w-md mx-auto">
                  ✓ Dispatch Print Queue Active. Manifest exported smoothly!
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setInvoicePrinted(true)}
                  className="px-4 py-2 border border-editorial-charcoal/20 text-editorial-charcoal text-[10px] font-mono uppercase tracking-widest font-bold rounded-none hover:bg-white flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4 text-editorial-red" />
                  <span>Print Invoice Specimen</span>
                </button>
                <button
                  id="finish-checkout-btn"
                  onClick={handleFinishCheckout}
                  className="px-5 py-2.5 bg-editorial-charcoal text-editorial-cream text-[10px] font-mono uppercase tracking-widest font-bold rounded-none hover:bg-editorial-red hover:border-editorial-red transition-all"
                >
                  Verify Status Now
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
