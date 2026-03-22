"use client";

import { motion } from "framer-motion";

// 8 hand-placed paths spread evenly across a 1440×900 viewport.
// Each flows from a different region so no zone is crowded.
const PATHS = [
  // Top-left → bottom-right (shallow diagonal)
  { id: 0, d: "M -80 80 C 200 40 500 200 760 380 C 1020 560 1260 740 1540 860",  w: 1.4 },
  // Top-right → bottom-left (shallow diagonal)
  { id: 1, d: "M 1520 60 C 1200 120 900 280 640 420 C 380 560 160 720 -120 880", w: 1.6 },
  // Top-center → bottom-left (steep)
  { id: 2, d: "M 680 -60 C 520 120 340 340 160 520 C 0 700 -80 820 -160 960",    w: 1.2 },
  // Top-center → bottom-right (steep)
  { id: 3, d: "M 760 -60 C 920 120 1100 340 1280 520 C 1440 700 1520 820 1600 960", w: 1.2 },
  // Upper band — nearly horizontal, left to right
  { id: 4, d: "M -180 200 C 240 160 580 200 860 230 C 1140 260 1340 210 1620 190", w: 1.0 },
  // Lower band — nearly horizontal, right to left
  { id: 5, d: "M 1620 680 C 1280 650 940 700 660 670 C 380 640 180 700 -160 720",  w: 1.0 },
  // Left-side arc — gentle curve from top to bottom
  { id: 6, d: "M 160 -80 C 80 200 180 420 140 620 C 100 820 60 920 20 1040",      w: 1.3 },
  // Right-side arc — gentle curve from top to bottom
  { id: 7, d: "M 1280 -80 C 1360 200 1260 420 1300 620 C 1340 820 1380 920 1420 1040", w: 1.3 },
];

export function BackgroundPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {PATHS.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#0F6E56"
            strokeWidth={path.w}
            strokeOpacity={0.28 + path.id * 0.018}
            strokeLinecap="round"
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.4, 0.7, 0.4],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 22 + (path.id % 5) * 4,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
