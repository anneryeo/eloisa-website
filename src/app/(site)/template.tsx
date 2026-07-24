"use client";

import { motion } from "framer-motion";

/**
 * Soft entrance for every section page. A template remounts per navigation
 * (unlike a layout), which is what lets the fade re-run on each route change.
 * Exit animations are intentionally skipped — App Router swaps pages
 * immediately, and holding the old page hostage would add latency.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
