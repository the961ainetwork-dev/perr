import React from "react";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  isCurrent?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="bg-stone-100/60 border-b border-stone-200/60 py-3 px-6 select-none"
      id="global-breadcrumbs"
    >
      <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-2 text-[10.5px] font-mono uppercase tracking-wider text-stone-500">
        
        {/* Base Home Link */}
        <button
          onClick={() => {
            // Find the home/first item or fallback
            if (items[0] && items[0].onClick) {
              items[0].onClick();
            }
          }}
          className="flex items-center gap-1.5 hover:text-[#C1121F] hover:underline transition-colors focus:outline-none font-bold"
          title="Go to main marketplace"
        >
          <Home className="w-3.5 h-3.5 text-stone-400 stroke-[2px]" />
          <span>Home</span>
        </button>

        {/* Dynamic Items */}
        {items.map((item, idx) => {
          // If the first item is home, skip rendering duplicate label to keep it neat
          if (idx === 0 && (item.label.toLowerCase() === "home" || item.label.toLowerCase() === "marketplace")) {
            return null;
          }

          return (
            <React.Fragment key={`${item.label}-${idx}`}>
              <ChevronRight className="w-3 h-3 text-stone-400 shrink-0 stroke-[2px]" />
              
              {item.isCurrent || !item.onClick ? (
                <span className="text-[#C1121F] font-extrabold truncate max-w-[180px] sm:max-w-[300px]">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={item.onClick}
                  className="hover:text-[#C1121F] hover:underline transition-colors focus:outline-none font-bold text-stone-600 truncate max-w-[150px] sm:max-w-[250px]"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
