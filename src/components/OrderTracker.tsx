import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Clock, Truck, CheckCircle2, Globe, MapPin, Search, RefreshCw } from "lucide-react";

export default function OrderTracker() {
  const { orders } = useApp();

  // Selected Order ID state default to first pending or shipped
  const [selectedOrderId, setSelectedOrderId] = useState<string>(() => {
    if (orders.length > 0) return orders[0].id;
    return "";
  });

  const activeOrder = useMemo(() => {
    return orders.find((o) => o.id === selectedOrderId);
  }, [orders, selectedOrderId]);

  // Stage steps index calculation
  const getStatusIndex = (status: string) => {
    switch (status) {
      case "Pending":
        return 1;
      case "Ready for Shipping":
        return 2;
      case "Shipped":
        return 3;
      case "Completed":
        return 4;
      default:
        return 1;
    }
  };

  const statusIndex = activeOrder ? getStatusIndex(activeOrder.status) : 1;

  // Custom coordinate calculation for mockup map line movement
  const mapDotPercent = useMemo(() => {
    if (statusIndex === 1) return 10;
    if (statusIndex === 2) return 35;
    if (statusIndex === 3) return 70;
    return 100;
  }, [statusIndex]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20 text-left space-y-8 text-editorial-charcoal" id="order-tracker-zone">
      <div className="space-y-2">
        <span className="text-editorial-red text-[10px] font-mono font-bold uppercase tracking-[0.2em] block">SHIPPING LEDGERS</span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-editorial-charcoal italic leading-none">
          Artisan Courier Trace
        </h2>
        <p className="text-[#1A1A1A]/70 text-xs sm:text-sm max-w-2xl font-sans">
          Trace active log entries, dispatch updates, and climate-controlled courier positions carrying your small-batch pickle specimen canisters.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 border border-dashed border-editorial-charcoal/20 rounded-none text-center max-w-lg mx-auto bg-editorial-gray/50">
          <Truck className="w-10 h-10 text-editorial-charcoal/30 mx-auto mb-3" />
          <h3 className="font-serif text-base font-bold text-editorial-charcoal italic">No active shipment logs registered</h3>
          <p className="text-[#1A1A1A]/60 text-xs mt-1 leading-relaxed px-12 font-sans">
            Once you commit an order, the status pipeline of small-batch shipments will appear instantly for real-time sandbox analysis.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Order list selections */}
          <div className="space-y-4">
            <span className="text-[9px] font-mono font-bold text-editorial-charcoal/60 uppercase tracking-widest block">Consignment Registry ({orders.length})</span>
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {orders.map((o) => {
                const isSelected = o.id === selectedOrderId;
                const statusColor = 
                  o.status === "Completed" ? "text-editorial-green bg-white border border-editorial-green/20" :
                  o.status === "Shipped" ? "text-[#C1121F] bg-white border border-[#C1121F]/20" : "text-editorial-charcoal bg-[#FAF9F6] border border-editorial-charcoal/20";

                return (
                  <button
                    key={o.id}
                    id={`track-order-card-${o.id}`}
                    onClick={() => setSelectedOrderId(o.id)}
                    className={`w-full text-left p-4 rounded-none border transition-all text-xs flex justify-between items-start gap-4 ${
                      isSelected
                        ? "border-editorial-charcoal bg-white ring-[1px] ring-editorial-charcoal shadow-sm"
                        : "border-editorial-charcoal/10 bg-[#FAF9F6] hover:border-editorial-charcoal/40"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex justify-between items-center bg-transparent">
                        <span className="font-mono font-black text-editorial-charcoal text-xs">{o.id}</span>
                        <span className="text-[9px] text-[#1A1A1A]/50 font-bold font-mono uppercase tracking-wider">{o.createdAt.split("T")[0]}</span>
                      </div>
                      <p className="text-[#1A1A1A]/70 font-sans line-clamp-1 pr-1 italic">
                        Batch: {o.items.map((it) => it.productName).join(", ")}
                      </p>
                      <span className="font-mono text-editorial-red font-bold block">${o.total.toFixed(2)}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-none text-[8px] font-mono font-bold uppercase tracking-wider shrink-0 ${statusColor}`}>
                      {o.status}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Active Tracking panel */}
          <div className="lg:col-span-2 space-y-6">
            {activeOrder ? (
              <div className="bg-white rounded-none border border-editorial-charcoal/15 shadow-xs overflow-hidden divide-y divide-editorial-charcoal/15 text-left">
                
                {/* Header overview block info */}
                <div className="p-6 bg-editorial-gray flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[9px] font-mono text-editorial-charcoal/40 font-bold uppercase tracking-widest block">Specimen Ledger Active</span>
                    <h3 className="font-serif text-lg font-bold text-editorial-charcoal block mt-1 italic">Manifest Num: <span className="font-mono text-editorial-red text-base font-black not-italic">{activeOrder.id}</span></h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-[#1A1A1A]/40 block uppercase tracking-wider">Method: {activeOrder.paymentMethod}</span>
                    <span className="text-editorial-red font-serif font-black text-xl block">${activeOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Progress milestone track steps */}
                <div className="p-6 md:p-8 space-y-6">
                  
                  {/* Milestones horizontal bar */}
                  <div className="relative">
                    {/* Horizontal link line */}
                    <div className="absolute top-4.5 left-4 right-4 h-[1px] bg-editorial-charcoal/15 -z-10"></div>
                    <div 
                      className="absolute top-4.5 left-4 h-[1px] bg-editorial-charcoal -z-10 transition-all duration-300"
                      style={{ width: `${((statusIndex - 1) / 3) * 100}%` }}
                    ></div>

                    <div className="grid grid-cols-4 text-center">
                      {[
                        { step: 1, label: "Registered", sub: "Specimen logged", icon: Clock },
                        { step: 2, label: "Brining", sub: "Canned at Labs", icon: RefreshCw },
                        { step: 3, label: "Transiting", sub: "Under Dispatch", icon: Truck },
                        { step: 4, label: "Secured", sub: "Handed Over", icon: CheckCircle2 },
                      ].map((mil) => {
                        const Icon = mil.icon;
                        const hasPassed = statusIndex >= mil.step;
                        const isCurrent = statusIndex === mil.step;

                        return (
                          <div key={mil.step} className="flex flex-col items-center">
                            <span className={`w-9 h-9 rounded-none border flex items-center justify-center transition-all ${
                              hasPassed
                                ? "bg-editorial-charcoal border-editorial-charcoal text-editorial-cream shadow-sm scale-102"
                                : "bg-white border-editorial-charcoal/15 text-editorial-charcoal/30"
                            }`}>
                              <Icon className={`w-4 h-4 ${isCurrent ? "animate-pulse" : ""}`} />
                            </span>
                            <span className={`text-[10px] font-mono uppercase tracking-wider font-bold block mt-3 ${hasPassed ? "text-editorial-charcoal" : "text-editorial-charcoal/40"}`}>{mil.label}</span>
                            <span className="text-[9px] text-[#1A1A1A]/40 hidden sm:block mt-0.5">{mil.sub}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Vector Map Simulation Drawing */}
                <div className="p-6 space-y-3 bg-editorial-cream/30">
                  <span className="text-[9px] font-mono font-bold text-editorial-charcoal/40 uppercase tracking-widest block">Logistical Position Map</span>
                  
                  <div className="h-44 sm:h-56 bg-editorial-charcoal rounded-none relative overflow-hidden border border-editorial-charcoal/30">
                    {/* SVG map visual trace */}
                    <svg className="absolute inset-0 w-full h-full text-editorial-cream opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M 50,50 Q 150,120 220,60 T 400,100 T 600,60" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 4" />
                      <circle cx="50" cy="50" r="3" fill="#C1121F" />
                      <circle cx="220" cy="60" r="3" fill="#C1121F" />
                      <circle cx="440" cy="90" r="3" fill="#C1121F" />
                      <circle cx="600" cy="60" r="3" fill="#E6DFD3" />
                    </svg>

                    {/* Sim labels */}
                    <div className="absolute top-4 left-4 bg-editorial-charcoal/90 border border-editorial-cream/15 p-2.5 text-left text-[10px] text-editorial-cream font-mono">
                      <span className="font-bold text-[#E6DFD3] block leading-none uppercase text-[9px]">Hub: Labs Portland</span>
                      <span className="block text-stone-400 mt-1">Origin Facility</span>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-editorial-charcoal/90 border border-editorial-cream/15 p-2.5 text-left text-[10px] text-editorial-cream font-mono">
                      <span className="font-bold text-editorial-red block leading-none uppercase text-[9px]">Destination Clearance</span>
                      {activeOrder.city && <span className="block mt-1">Ref: {activeOrder.city}, ZIP {activeOrder.zipCode}</span>}
                    </div>

                    {/* Animated moving vehicle indicator */}
                    {statusIndex < 4 ? (
                      <div 
                        className="absolute w-8 h-8 bg-[#C1121F] rounded-none border border-editorial-cream flex items-center justify-center text-white shadow-md transition-all duration-1000 ease-out font-mono font-bold text-xs"
                        style={{
                          left: `${mapDotPercent}%`,
                          top: "43%",
                          transform: "translate(-50%, -50%)"
                        }}
                      >
                        🚚
                      </div>
                    ) : (
                      <div 
                        className="absolute w-8 h-8 bg-editorial-green rounded-none border border-editorial-cream flex items-center justify-center text-white shadow-md font-mono font-bold text-xs"
                        style={{
                          left: "100%",
                          top: "43%",
                          transform: "translate(-100%, -50%)"
                        }}
                      >
                        ✓
                      </div>
                    )}

                    {/* Live delivery map label */}
                    <div className="absolute inset-x-0 bottom-4 text-center">
                      <span className="inline-block bg-editorial-cream text-editorial-charcoal text-[9px] px-3 py-1 border border-editorial-charcoal rounded-none font-mono tracking-widest uppercase font-bold">
                        {statusIndex === 4 ? "Package Delivered Successfully!" : `Specimen transport ${mapDotPercent}% along transit line`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cart breakdown listing detail */}
                <div className="p-6 space-y-4">
                  <span className="text-[9px] font-mono font-bold text-editorial-charcoal/40 uppercase tracking-widest block">Inspected Itemization List</span>
                  <div className="space-y-3">
                    {activeOrder.items.map((it: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-xs text-editorial-charcoal border-b border-editorial-gray pb-2">
                        <div className="flex gap-3 items-center min-w-0">
                          <img
                            src={it.image}
                            alt={it.productName}
                            className="w-10 h-10 object-cover border border-editorial-charcoal/10"
                            referrerPolicy="no-referrer"
                          />
                          <span className="font-serif text-xs italic font-bold text-editorial-charcoal truncate">{it.productName} <span className="text-stone-450 font-mono font-bold not-italic font-sans text-[10px] bg-editorial-gray border border-editorial-charcoal/10 px-1.5 ml-1">x{it.quantity}</span></span>
                        </div>
                        <span className="font-mono font-bold text-editorial-charcoal">${(it.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-16 text-center text-editorial-charcoal/40 text-xs bg-editorial-gray border border-dashed border-editorial-charcoal/15 font-mono uppercase tracking-wider">
                Select a consignment ledger on the left to trace position.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
