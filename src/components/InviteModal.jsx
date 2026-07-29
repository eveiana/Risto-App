/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles, Star, Mail, Facebook, Instagram, Copy, Check } from "lucide-react";
import RistoLogo from "./RistoLogo";

export default function InviteModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://ristostories.app/invite/thayu-kilili");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

          {/* Dialog Card Container */}
          <motion.div
            initial={{ scale: 0.95, y: 15, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 15, opacity: 0 }}
            className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl z-10 flex flex-col items-center"
          >
            {/* Close Toggle */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close invite modal"
              id="close-invite-btn"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invite subtle header */}
            <div className="flex items-center gap-1.5 self-start opacity-30 text-white mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider font-sans">
                Invite a friend
              </span>
            </div>

            {/* Brand Logo Display */}
            <div className="flex items-center select-none mb-3" id="invite-brand-logo">
              <RistoLogo size="custom" className="h-8 w-auto" isDarkTheme={true} />
            </div>

            {/* Star Rating Container */}
            <div className="flex items-center gap-0.5 text-zinc-100 mb-4 bg-zinc-800/30 py-1 px-3 rounded-full border border-zinc-805">
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
              {/* Half star rendered natively */}
              <div className="relative w-3.5 h-3.5 text-yellow-500 overflow-hidden inline-flex">
                <Star className="absolute top-0 left-0 w-3.5 h-3.5 text-yellow-500 fill-yellow-500" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />
                <Star className="absolute top-0 left-0 w-3.5 h-3.5 text-zinc-600" />
              </div>
              <span className="text-xs font-mono font-semibold text-zinc-300 ml-1.5">4.8 / 5</span>
            </div>

            {/* Manifesto block paragraph */}
            <p className="text-xs text-zinc-300 text-center leading-relaxed font-sans opacity-90 max-w-[280px] mb-6">
              Because silence is not an option. Too many important stories remain
              in the shadows, unheard and unseen. CGA was built to change that.
              We exist to amplify voices, spotlight change-makers, and turn
              missions into movements.
            </p>

            {/* Social Platform Share triggers */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-full flex items-center justify-center transition-all cursor-pointer"
                title="Share on Instagram"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>

              {/* Whatsapp Custom Icon */}
              <a
                href="https://wa.me"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-full flex items-center justify-center transition-all cursor-pointer"
                title="Share via WhatsApp"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              <a
                href="mailto:?subject=Read Risto Stories WITH Me&body=Check this out!"
                className="w-10 h-10 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-full flex items-center justify-center transition-all cursor-pointer"
                title="Share via Email"
              >
                <Mail className="w-4.5 h-4.5" />
              </a>

              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-full flex items-center justify-center transition-all cursor-pointer"
                title="Share on Facebook"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>

              <button
                onClick={handleCopyLink}
                className="w-10 h-10 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-500 rounded-full flex items-center justify-center transition-all cursor-pointer relative"
                title="Copy Invite Link"
                id="copy-invite-link-btn"
              >
                {copied ? (
                  <Check className="w-4.5 h-4.5 text-emerald-400" />
                ) : (
                  <Copy className="w-4.5 h-4.5" />
                )}
              </button>
            </div>

            {/* Copied alert toast inside modal */}
            <AnimatePresence>
              {copied && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 px-3 py-1 bg-emerald-950/55 border border-emerald-800/40 text-emerald-400 text-xs font-medium rounded-full"
                >
                  Link copied to clipboard!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
