"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface UniversityBrandProps {
  size?: "sm" | "md" | "lg" | "xl";
  layout?: "horizontal" | "vertical" | "compact";
  className?: string;
  subtitle?: string;
  logoClassName?: string;
  showSubtitle?: boolean;
}

export function UniversityBrand({
  size = "md",
  layout = "horizontal",
  className,
  subtitle,
  logoClassName,
  showSubtitle = true,
}: UniversityBrandProps) {
  // Dimension mappings (pure logo image dimensions with NO border/frame)
  const logoDimensions = {
    sm: { width: 48, height: 48, box: "w-12 h-12" },
    md: { width: 68, height: 68, box: "w-16 h-16 sm:w-17 sm:h-17" },
    lg: { width: 92, height: 92, box: "w-22 h-22 sm:w-24 sm:h-24" },
    xl: { width: 120, height: 120, box: "w-28 h-28 sm:w-32 sm:h-32" },
  };

  const textSizes = {
    sm: {
      telugu: "text-[11.5px] leading-tight font-telugu",
      hindi: "text-[12px] leading-tight font-hindi font-bold",
      english: "text-[12.5px] leading-tight font-sans font-extrabold",
    },
    md: {
      telugu: "text-xs sm:text-[13px] leading-snug font-telugu",
      hindi: "text-[13px] sm:text-[14px] leading-snug font-hindi font-bold",
      english: "text-sm sm:text-base leading-snug font-sans font-extrabold",
    },
    lg: {
      telugu: "text-sm sm:text-base leading-snug font-telugu font-bold",
      hindi: "text-base sm:text-lg leading-snug font-hindi font-bold",
      english: "text-lg sm:text-xl leading-snug font-sans font-extrabold",
    },
    xl: {
      telugu: "text-base sm:text-xl md:text-2xl leading-snug font-telugu font-bold",
      hindi: "text-lg sm:text-2xl md:text-[26px] leading-snug font-hindi font-bold",
      english: "text-xl sm:text-2xl md:text-3xl leading-tight font-sans font-black tracking-tight",
    },
  };

  const currentLogo = logoDimensions[size];
  const currentText = textSizes[size];

  if (layout === "compact") {
    return (
      <div className={cn("flex items-center gap-3.5", className)}>
        {/* Pure Emblem with NO frame/border */}
        <div className="relative shrink-0 flex items-center justify-center w-12 h-12">
          <Image
            src="/uohyd-logo.png"
            alt="University of Hyderabad"
            width={48}
            height={48}
            className="object-contain w-full h-full drop-shadow-xs"
            priority
          />
        </div>
        <div className="min-w-0 text-left space-y-0.5 select-none">
          <div className="font-bold text-[#8B1D1D] text-[11px] leading-tight font-telugu truncate">
            హైదరాబాదు విశ్వవిద్యాలయం
          </div>
          <div className="font-bold text-[#8B1D1D] text-[11.5px] leading-tight font-hindi truncate">
            हैदराबाद विश्वविद्यालय
          </div>
          <div className="font-extrabold text-[#8B1D1D] text-[12px] leading-tight font-sans tracking-tight truncate">
            University of Hyderabad
          </div>
        </div>
      </div>
    );
  }

  if (layout === "vertical") {
    return (
      <div className={cn("flex flex-col items-center text-center space-y-3", className)}>
        {/* Pure Emblem with NO frame/border */}
        <div
          className={cn(
            "relative shrink-0 flex items-center justify-center",
            currentLogo.box,
            logoClassName
          )}
        >
          <Image
            src="/uohyd-logo.png"
            alt="University of Hyderabad"
            width={currentLogo.width}
            height={currentLogo.height}
            className="object-contain w-full h-full drop-shadow-sm"
            priority
          />
        </div>
        <div className="space-y-1 select-none">
          <div className={cn("font-bold text-[#8B1D1D] tracking-wide", currentText.telugu)}>
            హైదరాబాదు విశ్వవిద్యాలయం
          </div>
          <div className={cn("font-bold text-[#8B1D1D] tracking-wide", currentText.hindi)}>
            हैदराबाद विश्वविद्यालय
          </div>
          <div className={cn("text-[#8B1D1D] font-extrabold tracking-tight", currentText.english)}>
            University of Hyderabad
          </div>
          {showSubtitle && subtitle && (
            <p className="text-xs text-on-surface-variant max-w-md mx-auto pt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3.5 sm:gap-4 md:gap-5", className)}>
      {/* Pure Emblem with NO frame/border */}
      <div
        className={cn(
          "relative shrink-0 flex items-center justify-center",
          currentLogo.box,
          logoClassName
        )}
      >
        <Image
          src="/uohyd-logo.png"
          alt="University of Hyderabad Logo"
          width={currentLogo.width}
          height={currentLogo.height}
          className="object-contain w-full h-full drop-shadow-sm"
          priority
        />
      </div>
      <div className="flex flex-col justify-center text-left space-y-0.5 select-none min-w-0">
        <div className={cn("font-bold text-[#8B1D1D] tracking-wide", currentText.telugu)}>
          హైదరాబాదు విశ్వవిద్యాలయం
        </div>
        <div className={cn("font-bold text-[#8B1D1D] tracking-wide", currentText.hindi)}>
          हैदराबाद विश्वविद्यालय
        </div>
        <div className={cn("text-[#8B1D1D] font-extrabold tracking-tight", currentText.english)}>
          University of Hyderabad
        </div>
        {showSubtitle && subtitle && (
          <p className="text-[11px] text-on-surface-variant font-medium pt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
