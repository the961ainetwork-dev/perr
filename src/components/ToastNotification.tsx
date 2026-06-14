import React from "react";
import { useApp, ToastMessage } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, ArrowRight, Bell, ClipboardList } from "lucide-react";

interface ToastNotificationProps {
  onViewOrder: (orderId: string) => void;
}

export default function ToastContainer({ onViewOrder }: ToastNotificationProps) {
  const { toasts, removeToast } = useApp();

  return (
    <div 
      className="fixed bottom-6 left-6 md:left-auto md:right-6 z-[9999] max-w-sm w-full space-y-3 pointer-events-none"
      id="toast-notification-system-container"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            toast={toast} 
            onDismiss={() => removeToast(toast.id)} 
            onView={() => {
              if (toast.orderId) {
                onViewOrder(toast.orderId);
              }
              removeToast(toast.id);
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface ToastItemProps {
  key?: string;
  toast: ToastMessage;
  onDismiss: () => void;
  onView: () => void;
}

function ToastItem({ toast, onDismiss, onView }: ToastItemProps) {
  // Color configuration depending on type
  const isSuccess = toast.type === "success";
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }}
      className="pointer-events-auto bg-editorial-cream border-2 border-editorial-charcoal shadow-lg text-left overflow-hidden relative"
      role="alert"
    >
      {/* Decorative vertical colored stripe */}
      <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${isSuccess ? "bg-emerald-600" : "bg-editorial-red"}`} />

      <div className="p-4 pl-5">
        <div className="flex items-start gap-3">
          {/* Accent icon */}
          <div className="shrink-0 mt-0.5">
            {isSuccess ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Bell className="w-5 h-5 text-editorial-red" />
            )}
          </div>

          {/* Core content */}
          <div className="flex-1 min-w-0 space-y-1">
            <h4 className="font-serif italic font-bold text-sm text-editorial-charcoal leading-tight">
              {toast.title}
            </h4>
            <p className="text-xs text-[#1A1A1A]/80 font-sans leading-relaxed">
              {toast.message}
            </p>

            {/* Extra call to action context if order reference is linked */}
            {toast.orderId && (
              <button
                onClick={onView}
                className="mt-2.5 inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest font-black text-[#C1121F] hover:text-editorial-charcoal transition-colors cursor-pointer"
                title="View newly queued order status details"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Trace Cargo Route &rarr;</span>
              </button>
            )}
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="shrink-0 p-1 text-editorial-charcoal/40 hover:text-editorial-charcoal hover:bg-stone-100 transition-all rounded-none border border-transparent hover:border-editorial-charcoal/10"
            title="Dismiss notification"
            aria-label="Close notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Decorative timing slider progress line */}
      <motion.div 
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: (toast.duration || 6000) / 1000, ease: "linear" }}
        className={`h-1 ${isSuccess ? "bg-emerald-600/30" : "bg-editorial-red/30"}`}
      />
    </motion.div>
  );
}
