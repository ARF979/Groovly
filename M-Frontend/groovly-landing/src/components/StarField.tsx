"use client";

import { useEffect, useRef } from "react";

export const StarField = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  const stars2Ref = useRef<HTMLDivElement>(null);
  const stars3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random box shadows for stars covering larger area
    const generateStars = (count: number) => {
      let shadows = [];
      for (let i = 0; i < count; i++) {
        // Use viewport units to ensure coverage across all zoom levels
        const x = Math.floor(Math.random() * 4000);
        const y = Math.floor(Math.random() * 4000);
        shadows.push(`${x}px ${y}px #FFF`);
      }
      return shadows.join(", ");
    };

    if (starsRef.current) {
      const shadowsSmall = generateStars(1000);
      starsRef.current.style.boxShadow = shadowsSmall;
      const after = starsRef.current.querySelector(
        ".stars-after"
      ) as HTMLDivElement;
      if (after) after.style.boxShadow = shadowsSmall;
    }

    if (stars2Ref.current) {
      const shadowsMedium = generateStars(300);
      stars2Ref.current.style.boxShadow = shadowsMedium;
      const after = stars2Ref.current.querySelector(
        ".stars-after"
      ) as HTMLDivElement;
      if (after) after.style.boxShadow = shadowsMedium;
    }

    if (stars3Ref.current) {
      const shadowsBig = generateStars(150);
      stars3Ref.current.style.boxShadow = shadowsBig;
      const after = stars3Ref.current.querySelector(
        ".stars-after"
      ) as HTMLDivElement;
      if (after) after.style.boxShadow = shadowsBig;
    }
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes animStar {
          from {
            transform: translateY(0px);
          }
          to {
            transform: translateY(-4000px);
          }
        }
      `}</style>

      {/* Container to ensure stars cover entire viewport */}
      <div className="pointer-events-none fixed inset-0 h-screen w-screen overflow-hidden">
        {/* Stars Layer 1 - Small */}
        <div
          ref={starsRef}
          className="absolute left-0 top-0 h-px w-px bg-transparent"
          style={{
            animation: "animStar 50s linear infinite",
          }}
        >
          <div
            className="stars-after absolute left-0 h-px w-px bg-transparent"
            style={{ top: "4000px" }}
          />
        </div>

        {/* Stars Layer 2 - Medium */}
        <div
          ref={stars2Ref}
          className="absolute left-0 top-0 h-[2px] w-[2px] bg-transparent"
          style={{
            animation: "animStar 100s linear infinite",
          }}
        >
          <div
            className="stars-after absolute left-0 h-[2px] w-[2px] bg-transparent"
            style={{ top: "4000px" }}
          />
        </div>

        {/* Stars Layer 3 - Large */}
        <div
          ref={stars3Ref}
          className="absolute left-0 top-0 h-[3px] w-[3px] bg-transparent"
          style={{
            animation: "animStar 150s linear infinite",
          }}
        >
          <div
            className="stars-after absolute left-0 h-[3px] w-[3px] bg-transparent"
            style={{ top: "4000px" }}
          />
        </div>
      </div>
    </>
  );
};
