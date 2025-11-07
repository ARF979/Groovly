'use client';

import { useEffect, useRef } from 'react';

export const StarField = () => {
  const starsRef = useRef<HTMLDivElement>(null);
  const stars2Ref = useRef<HTMLDivElement>(null);
  const stars3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Generate random box shadows for stars
    const generateStars = (count: number) => {
      let shadows = [];
      for (let i = 0; i < count; i++) {
        const x = Math.floor(Math.random() * 2000);
        const y = Math.floor(Math.random() * 2000);
        shadows.push(`${x}px ${y}px #FFF`);
      }
      return shadows.join(', ');
    };

    if (starsRef.current) {
      const shadowsSmall = generateStars(700);
      starsRef.current.style.boxShadow = shadowsSmall;
      const after = starsRef.current.querySelector('.stars-after') as HTMLDivElement;
      if (after) after.style.boxShadow = shadowsSmall;
    }

    if (stars2Ref.current) {
      const shadowsMedium = generateStars(200);
      stars2Ref.current.style.boxShadow = shadowsMedium;
      const after = stars2Ref.current.querySelector('.stars-after') as HTMLDivElement;
      if (after) after.style.boxShadow = shadowsMedium;
    }

    if (stars3Ref.current) {
      const shadowsBig = generateStars(100);
      stars3Ref.current.style.boxShadow = shadowsBig;
      const after = stars3Ref.current.querySelector('.stars-after') as HTMLDivElement;
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
            transform: translateY(-2000px);
          }
        }
      `}</style>

      {/* Stars Layer 1 - Small */}
      <div
        ref={starsRef}
        className="pointer-events-none absolute left-0 top-0 h-px w-px bg-transparent"
        style={{
          animation: 'animStar 50s linear infinite',
        }}
      >
        <div
          className="stars-after absolute left-0 h-px w-px bg-transparent"
          style={{ top: '2000px' }}
        />
      </div>

      {/* Stars Layer 2 - Medium */}
      <div
        ref={stars2Ref}
        className="pointer-events-none absolute left-0 top-0 h-[2px] w-[2px] bg-transparent"
        style={{
          animation: 'animStar 100s linear infinite',
        }}
      >
        <div
          className="stars-after absolute left-0 h-[2px] w-[2px] bg-transparent"
          style={{ top: '2000px' }}
        />
      </div>

      {/* Stars Layer 3 - Large */}
      <div
        ref={stars3Ref}
        className="pointer-events-none absolute left-0 top-0 h-[3px] w-[3px] bg-transparent"
        style={{
          animation: 'animStar 150s linear infinite',
        }}
      >
        <div
          className="stars-after absolute left-0 h-[3px] w-[3px] bg-transparent"
          style={{ top: '2000px' }}
        />
      </div>
    </>
  );
};
