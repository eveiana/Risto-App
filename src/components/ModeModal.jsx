/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sun, Moon } from "lucide-react";

export default function ModeModal({
  isOpen,
  onClose,
  isDarkMode,
  setIsDarkMode,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Central Dialog */}
          <motion.div
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 flex flex-col items-center justify-center text-center"
          >
            {/* Close Toggle */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close mode modal"
              id="close-mode-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-sm font-medium text-zinc-400 mb-4 tracking-wider uppercase font-mono">
              Appearance Mode
            </span>

            {/* Mode selection track frame */}
            <div className="flex bg-black border border-zinc-800 rounded-xl p-1.5 w-44 gap-1.5">
              {/* Light button option */}
              <button
                onClick={() => setIsDarkMode(false)}
                className={`flex-1 flex justify-center items-center py-2.5 rounded-lg transition-all cursor-pointer ${
                  !isDarkMode
                    ? "bg-white text-black shadow-md font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
                id="mode-light-btn"
                title="Light Mode"
              >
                <Sun className="w-5 h-5" />
              </button>

              {/* Dark button option */}
              <button
                onClick={() => setIsDarkMode(true)}
                className={`flex-1 flex justify-center items-center py-2.5 rounded-lg transition-all cursor-pointer ${
                  isDarkMode
                    ? "bg-white text-black shadow-md font-semibold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
                id="mode-dark-btn"
                title="Dark Mode"
              >
                <Moon className="w-5 h-5" />
              </button>
            </div>

            <p className="mt-4 text-xs text-zinc-500 font-sans leading-normal max-w-[200px]">
              Toggles between midnight slate and bright daylight mode across all reader feeds.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
