/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import RistoLogo from "./RistoLogo";

export default function WelcomeView({
  onSignIn,
  onRegister,
  onOpenPrivacyTerms,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="absolute inset-0 flex flex-col justify-between p-6 bg-black text-white selection:bg-zinc-800 selection:text-white"
      id="welcome-view-wrapper"
    >
      {/* Top branding logo aligned left */}
      <div className="pt-6 pl-4 flex justify-start z-10" id="welcome-logo-container">
        <RistoLogo size="md" isDarkTheme={true} className="scale-105" />
      </div>

      {/* Quote Body Container */}
      <div className="flex-1 flex flex-col justify-center items-start text-left px-5 max-w-md mx-auto -mt-6">
        {/* Large stylized double quotations */}
        <span className="text-white text-[70px] font-serif font-bold leading-none block select-none -mb-3 opacity-95">
          “
        </span>

        {/* Proverb Content - Sleek Sans Serif with line height */}
        <h2 className="text-[25px] md:text-3xl font-sans font-normal tracking-wide leading-snug text-white pr-2">
          We do not inherit the earth from our ancestors, we borrow it from our children
        </h2>

        {/* Attribution Right-aligned under the block */}
        <p className="text-zinc-400 text-xs font-sans mt-3.5 w-full text-right pr-4 tracking-wide opacity-85">
          - African proverb
        </p>
      </div>

      {/* Controls and Footer */}
      <div className="w-full max-w-md mx-auto space-y-12 pb-2">
        {/* Horizontal Action Buttons */}
        <div className="flex gap-5 px-4" id="welcome-action-buttons">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onSignIn}
            className="flex-1 py-3.5 bg-[#18181b]/90 hover:bg-[#27272a] text-zinc-400 hover:text-white font-medium rounded-2xl text-sm transition-all cursor-pointer text-center border-none shadow-sm"
            id="welcome-signin-btn"
          >
            Sign in
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onRegister}
            className="flex-1 py-3.5 bg-white hover:bg-zinc-100 text-black font-semibold rounded-2xl text-sm transition-all shadow-md cursor-pointer text-center border-none"
            id="welcome-register-btn"
          >
            Register
          </motion.button>
        </div>

        {/* Brand Footer Metadata in corner-wise split */}
        <div className="flex justify-between items-center px-4 text-[11px] text-zinc-500 font-sans tracking-wide" id="welcome-footer">
          <span className="flex items-center gap-1 select-none font-sans font-light">
            <span className="text-sm font-sans">©</span> 2025
          </span>
          <div className="flex gap-5">
            <button
              onClick={onOpenPrivacyTerms}
              className="hover:text-zinc-300 underline cursor-pointer bg-transparent border-none p-0 text-zinc-500 font-sans"
            >
              Privacy Policy
            </button>
            <button
              onClick={onOpenPrivacyTerms}
              className="hover:text-zinc-350 underline cursor-pointer bg-transparent border-none p-0 text-zinc-500 font-sans"
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

