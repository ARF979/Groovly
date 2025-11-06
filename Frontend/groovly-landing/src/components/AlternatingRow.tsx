"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CD } from "./CD";

export type AlternatingRowProps = {
  cdSrc: string;
  side: "left" | "right";
  title: string;
  body: string;
};

export function AlternatingRow({ cdSrc, side, title, body }: AlternatingRowProps) {
  const reducedMotion = useReducedMotion();
  const textMotion = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
      {side === "left" ? (
        <>
          <motion.div className="order-1" {...textMotion}>
            <CD src={cdSrc} side="left" alt={title} />
          </motion.div>
          <motion.div
            className="order-2 max-w-xl text-lg text-muted md:text-xl"
            {...textMotion}
            transition={{
              duration: 0.6,
              delay: reducedMotion ? 0 : 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <h3 className="font-display text-2xl font-semibold text-white md:text-3xl">{title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{body}</p>
          </motion.div>
        </>
      ) : (
        <>
          <motion.div
            className="order-2 md:order-1 max-w-xl text-lg text-muted md:text-xl"
            {...textMotion}
          >
            <h3 className="font-display text-2xl font-semibold text-white md:text-3xl">{title}</h3>
            <p className="mt-3 leading-relaxed text-muted">{body}</p>
          </motion.div>
          <motion.div
            className="order-1 md:order-2"
            {...textMotion}
            transition={{
              duration: 0.6,
              delay: reducedMotion ? 0 : 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <CD src={cdSrc} side="right" alt={title} />
          </motion.div>
        </>
      )}
    </div>
  );
}
