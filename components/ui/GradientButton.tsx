"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "group relative w-full overflow-hidden rounded-md px-2 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300",
          "bg-gradient-to-r from-purple-600 to-indigo-600 hover:shadow-purple-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 cursor-pointer",
          className
        )}
        {...props}
      >
        {/* Text always above the glossy overlay */}
        <span className="relative z-10">{children}</span>

        {/* Built-in glossy shine effect */}
        <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 group-hover:translate-x-[120%] cursor-pointer" />
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";

export { GradientButton };
