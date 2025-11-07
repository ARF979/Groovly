"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type HeroDynamicTextProps = {
  words?: string[];
  interval?: number;
};

const DEFAULT_WORDS = ["Party", "Road Trip", "Study Session", "DJ Battle"];

export function HeroDynamicText({ words = DEFAULT_WORDS, interval = 2500 }: HeroDynamicTextProps) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const currentWord = useMemo(() => words[index % words.length], [index, words]);

  useEffect(() => {
    if (words.length <= 1) {
      return;
    }
    const timer = setInterval(() => {
      setIndex((prev: number) => (prev + 1) % words.length);
    }, interval);
    return () => clearInterval(timer);
  }, [interval, words.length]);

  return (
    <div className="relative inline-flex items-baseline">
      <span className="text-xl uppercase tracking-[0.6em] text-accent/70">for</span>
      <div className="ml-4 h-8 overflow-hidden font-display text-3xl font-semibold text-white md:text-4xl">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={currentWord}
            className="block"
            initial={reducedMotion ? false : { opacity: 0, y: 16 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
            transition={{
              opacity: {
                duration: reducedMotion ? 0 : 0.24,
                ease: "easeOut",
              },
              y: {
                duration: reducedMotion ? 0 : 0.24,
                ease: "easeOut",
              },
            }}
          >
            {currentWord}
            <span className="ml-1 inline-block w-3 animate-blink text-accent">_</span>
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
