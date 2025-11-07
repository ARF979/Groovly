"use client";

import clsx from "clsx";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

type CDSide = "left" | "right";

export type CDProps = {
  src: string;
  side: CDSide;
  /** Optional override if you need a different disc diameter. */
  size?: number;
  alt?: string;
};

export function CD({ src, side, size = 310, alt = "CD artwork" }: CDProps) {
  const reducedMotion = useReducedMotion();

  return (
    <div 
      className={clsx(
        "group relative overflow-hidden",
        side === "left" ? "rounded-r-[40px]" : "rounded-l-[40px]",
        "bg-gradient-to-br from-[#2a2a2f] via-[#35353a] to-[#252529]",
        "border border-white/5",
        "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)]",
        "transition-all duration-700 ease-out"
      )}
      style={{ 
        height: size, 
        width: size * 1.0
      }}
    >
      <div
        className={clsx(
          "absolute top-0",
          "overflow-hidden",
          "bg-gradient-to-br from-[#111] via-[#181818] to-[#050505]",
          "shadow-[0_45px_120px_-30px_rgba(0,0,0,0.85)] ring-1 ring-white/10",
          "transition-all duration-700 ease-out",
          side === "left" 
            ? "-left-[155px] rounded-full group-hover:left-0 group-hover:rounded-r-[40px]" 
            : "-right-[155px] rounded-full group-hover:right-0 group-hover:rounded-l-[40px]",
          !reducedMotion && "animate-spin-slow group-hover:animate-none"
        )}
        style={{ 
          width: size, 
          height: size
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority
          quality={100}
          sizes={`${size}px`}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 rounded-full border-[5px] border-white/80 transition-opacity duration-700 group-hover:opacity-0" />

        <div
          className={clsx(
            "pointer-events-none absolute inset-0 rounded-full",
            "bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_55%)]",
            "opacity-0 transition-opacity duration-700 ease-out",
            !reducedMotion && "group-hover:opacity-100"
          )}
        />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-700 group-hover:opacity-0">
          <div
            className={clsx(
              "relative flex h-[100px] w-[100px] items-center justify-center rounded-full",
              "bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300",
              "shadow-[0_2px_12px_rgba(0,0,0,0.3),inset_0_1px_3px_rgba(255,255,255,0.8)]",
              "border border-gray-400/40",
              "transition-all duration-500 ease-out",
              !reducedMotion && "group-hover:scale-110"
            )}
          >
            <div className="absolute inset-[8px] rounded-full border border-gray-400/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" />
            <div className="absolute inset-[16px] rounded-full border border-gray-300/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]" />
            
            <div
              className={clsx(
                "relative h-[40px] w-[40px] rounded-full",
                "bg-gradient-to-br from-white via-gray-100 to-gray-200",
                "shadow-[0_1px_6px_rgba(0,0,0,0.2),inset_0_-1px_3px_rgba(0,0,0,0.1),inset_0_1px_2px_rgba(255,255,255,0.9)]",
                "border border-gray-300/50",
                "transition-transform duration-500 ease-out",
                !reducedMotion && "group-hover:scale-90"
              )}
            >
              <div className="absolute inset-[6px] rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 shadow-[inset_0_1px_3px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>

        <div
          className={clsx(
            "pointer-events-none absolute -bottom-10 left-1/2 h-24 w-36 -translate-x-1/2",
            "rounded-full bg-gradient-to-t from-accent/50 via-transparent to-transparent blur-3xl",
            "opacity-0 transition-all duration-500 ease-out",
            !reducedMotion && "group-hover:-translate-y-6 group-hover:opacity-90"
          )}
        />

        <div
          className={clsx(
            "pointer-events-none absolute inset-0",
            "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.2),transparent_70%)]"
          )}
        />
      </div>
    </div>
  );
}
