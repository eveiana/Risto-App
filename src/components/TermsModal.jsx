/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, FileText } from "lucide-react";

export default function TermsModal({ isOpen, onClose }) {
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

          {/* Central Dialog Card */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 flex flex-col max-h-[75vh]"
          >
            {/* Close Cross symbol */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
              id="close-terms-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Title Row */}
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-6 h-6 text-zinc-100" />
              <h3 className="text-xl font-semibold text-white font-sans">
                Terms & Conditions
              </h3>
            </div>

            {/* Horizontal Divider */}
            <div className="w-full h-px bg-zinc-800 mb-4" />

            {/* Terms scroll body */}
            <div className="flex-1 overflow-y-auto pr-1 mb-6 text-sm text-zinc-300 space-y-4 leading-relaxed font-sans">
              <p>
                At CGA (Creative Guardians of Africa), we are the rebels of
                storytelling, the architects of change, and the curators of
                narratives that matter. We do not just tell stories—we craft
                experiences that stir emotions, spark movements, and leave lasting
                imprints on the world.
              </p>
              <p>
                We blend art with technology to create storytelling magic. Whether
                it's through breathtaking films, thought-provoking
                documentaries, immersive augmented reality (AR), interactive
                gaming, soul-stirring podcasts, insightful publishing, or
                electrifying live events, we protect the authentic lore of our
                ancestors.
              </p>
              <p>
                By accessing Risto, you agree to safeguard oral histories, respect
                intellectual property rights of artists, and pledge to never
                allow cybernetic memory thieves (like Msema Wongo) to dilute the
                narrative soil. Integrity is the ultimate shield of our lions.
              </p>
            </div>

            {/* Acceptance Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full py-3 px-4 bg-white hover:bg-zinc-100 text-black font-semibold rounded-full text-sm shadow-md transition-colors cursor-pointer"
              id="accept-terms-btn"
            >
              Agree to terms and conditions
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
