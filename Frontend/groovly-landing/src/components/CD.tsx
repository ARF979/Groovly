"use client";

import Image from "next/image";
import { motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";

type CDSide = "left" | "right";

export type CDProps = {
  src: string;
  side: CDSide;
  initialSize?: number;
  hoverSize?: number;
  floatAmp?: number;
  rotationSpeed?: number;
  alt?: string;
};

export function CD({
  src,
  side,
  initialSize = 140,
  hoverSize = 220,
  floatAmp = 8,
  rotationSpeed = 12,
  alt = "CD artwork",
}: CDProps) {
  const reducedMotion = useReducedMotion();
  const controls = useAnimationControls();
  const [isActive, setIsActive] = useState(false);

  const scaleTarget = hoverSize / initialSize;
  const drawerWidth = hoverSize + 64;

  const hoverTranslate = useMemo(() => (side === "left" ? 24 : -24), [side]);
  const restTranslate = useMemo(() => (side === "left" ? -initialSize * 0.35 : initialSize * 0.35), [initialSize, side]);

  useEffect(() => {
    if (reducedMotion) {
      return;
    }
    controls.start(() => ({
      rotate: 360,
      transition: {
        duration: rotationSpeed,
        ease: "linear",
        repeat: Infinity,
      },
    }));
  }, [controls, reducedMotion, rotationSpeed]);

  useEffect(() => {
    if (reducedMotion) {
      controls.stop();
    } else if (!isActive) {
      controls.start(() => ({
        rotate: 360,
        transition: {
          duration: rotationSpeed,
          ease: "linear",
          repeat: Infinity,
        },
      }));
    }
  }, [controls, isActive, reducedMotion, rotationSpeed]);

  const handleActivate = () => {
    setIsActive(true);
    if (!reducedMotion) {
      controls.stop();
    }
  };

  const handleDeactivate = () => {
    setIsActive(false);
  };

  return (
    <div
      className={clsx(
        "relative",
        "flex",
        side === "left" ? "justify-start" : "justify-end"
      )}
    >
      <motion.button
        type="button"
        aria-label="Preview Groovly feature artwork"
        onHoverStart={handleActivate}
        onHoverEnd={handleDeactivate}
        onFocus={handleActivate}
        onBlur={handleDeactivate}
        drag={!reducedMotion}
        dragConstraints={{ top: -30, bottom: 30, left: -30, right: 30 }}
        dragElastic={0.16}
        className={clsx(
          "group relative",
          "overflow-hidden",
          "bg-card/70",
          "border border-white/5",
          "backdrop-blur-sm",
          "transition-colors duration-200",
          side === "left" ? "rounded-r-[48px] pl-8 pr-0" : "rounded-l-[48px] pr-8 pl-0"
        )}
        style={{
          width: drawerWidth,
          height: hoverSize,
        }}
        whileHover={
          reducedMotion
            ? undefined
            : {
                boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              }
        }
        whileFocus={
          reducedMotion
            ? undefined
            : {
                boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              }
        }
      >
        <motion.div
          animate={controls}
          className={clsx(
            "relative",
            "bg-surface",
            "border border-white/10",
            "shadow-inner",
            "flex items-center justify-center"
          )}
          initial={false}
          style={{
            width: initialSize,
            height: initialSize,
            borderRadius: "50%",
            translateX: restTranslate,
          }}
          transition={{
            borderRadius: {
              ease: [0.2, 0.8, 0.3, 1],
              duration: 0.18,
            },
          }}
          whileHover={
            reducedMotion
              ? undefined
              : {
                  scale: scaleTarget,
                  borderRadius: "12px",
                  translateX: restTranslate + hoverTranslate,
                }
          }
          whileFocus={
            reducedMotion
              ? undefined
              : {
                  scale: scaleTarget,
                  borderRadius: "12px",
                  translateX: restTranslate + hoverTranslate,
                }
          }
        >
          <motion.div
            className="absolute inset-0"
            animate={
              reducedMotion
                ? undefined
                : {
                    y: [0, -floatAmp, 0],
                  }
            }
            transition={
              reducedMotion
                ? undefined
                : {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          >
            <Image
              src={src}
              alt={alt}
              width={hoverSize}
              height={hoverSize}
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border border-white/40 bg-white/80" />
          </div>
          <div
            className={clsx(
              "pointer-events-none absolute inset-0 transition-opacity duration-300",
              isActive ? "opacity-100" : "opacity-0"
            )}
            style={{
              boxShadow: "inset 0 0 0 2px rgba(255, 209, 102, 0.4)",
            }}
          />
        </motion.div>
      </motion.button>
    </div>
  );
}
