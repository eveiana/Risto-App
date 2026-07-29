/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import RistoLogo from "./RistoLogo";

export default function SplashView({ onProceed }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      onClick={onProceed}
      className="absolute inset-0 flex flex-col justify-center items-center bg-black cursor-pointer select-none"
      id="splash-view-wrapper"
    >
      {/* Decorative ambient blurred backing orb */}
      <div className="absolute top-1/4 left-1/4 w-36 h-36 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-36 h-36 bg-zinc-650/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Logo */}
      <div className="text-center z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex items-center cursor-pointer"
          id="splash-logo-container"
        >
          <RistoLogo size="custom" className="h-16 md:h-20 w-auto" isDarkTheme={true} />
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 0.8 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-zinc-400 text-sm mt-3 font-sans tracking-wide"
        >
          Just a lion telling its story
        </motion.p>
      </div>

      {/* Guide pointer */}
      <motion.span
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-28 text-zinc-600 text-xs tracking-widest uppercase font-mono"
      >
        Tap anywhere to enter
      </motion.span>

      {/* Footer copyright */}
      <div className="absolute bottom-10">
        <span className="text-zinc-600 text-xs font-mono">© 2025</span>
      </div>
    </motion.div>
  );
}
