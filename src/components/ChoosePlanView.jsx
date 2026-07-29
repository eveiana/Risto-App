/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import RistoLogo from "./RistoLogo";

export default function ChoosePlanView({
  onBack,
  onSubscribe,
  onOpenTerms,
  isDarkMode,
}) {
  const plans = [
    {
      id: "free",
      tag: "Free",
      price: "$",
      priceSub: "/ month",
      hasDivider: true,
      features: [
        "Campaigns",
        "Explainers",
        "waking-up",
        "Publishing",
        "Gaming",
        "Gaming toolkits",
      ],
    },
    {
      id: "monthly",
      tag: "Monthly",
      price: "10",
      priceSub: "USD per month",
      isPremium: true,
      hasDivider: true,
      features: [
        "Campaigns",
        "Explainers",
        "waking-up",
        "Publishing",
        "Gaming",
        "Gaming toolkits",
      ],
    },
    {
      id: "annual",
      tag: "Annual",
      price: "5",
      priceSub: "USD per month",
      hasDivider: true,
      features: [
        "Campaigns",
        "Explainers",
        "waking-up",
        "Publishing",
        "Gaming",
        "Gaming toolkits",
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      className="absolute inset-0 flex flex-col justify-between p-6 bg-black text-white selection:bg-indigo-500 selection:text-white overflow-y-auto"
      id="choose-plan-view-wrapper"
    >
      {/* Top Header Row with Logo */}
      <div className="flex items-center justify-between" id="choose-plan-header">
        <div className="flex items-center select-none" id="choose-plan-brand-logo">
          <RistoLogo size="custom" className="h-6 w-auto" isDarkTheme={true} />
        </div>
      </div>

      {/* Back button and View Main Header */}
      <div className="relative mt-4 flex flex-col items-start" id="choose-plan-mid-intro">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full text-white hover:text-zinc-200 transition-colors cursor-pointer select-none"
          id="btn-back-choose-plan"
          aria-label="Go back to genres selection"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-sans font-light tracking-tight text-white text-center w-full mt-8 mb-4 sm:mb-8" id="choose-plan-title">
          Choose your plan
        </h2>
      </div>

      {/* Cards Row - Styled exactly as Image 1 with horizontal scrolling on mobile and nice gap margins */}
      <div
        className="flex items-stretch gap-4 md:grid md:grid-cols-3 overflow-x-auto pb-6 px-1 md:overflow-visible transition-all scrollbar-none snap-x snap-mandatory"
        id="plans-cards-container"
      >
        {plans.map((plan) => {
          const isMid = plan.id === "monthly";
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              className={`snap-center shrink-0 w-[78%] sm:w-auto rounded-3xl p-6 flex flex-col justify-between text-center border transition-all ${
                isMid
                  ? "bg-[#18181b] border-zinc-700/60 shadow-[0_15px_30px_rgba(0,0,0,0.4)] ring-1 ring-zinc-700/50 min-h-[460px]"
                  : "bg-[#121214] border-zinc-800/80 shadow-md min-h-[440px]"
              }`}
              id={`plan-card-${plan.id}`}
            >
              {/* Card top banner tag or ID name */}
              <div className="flex justify-end pr-2" id={`tag-container-${plan.id}`}>
                <span className="text-xs font-sans font-semibold text-white tracking-wide select-none">
                  {plan.tag}
                </span>
              </div>

              {/* Amount and Subtitle text */}
              <div className="my-6 space-y-1 block" id={`price-block-${plan.id}`}>
                {plan.price === "$" ? (
                  <div className="text-6xl font-sans font-light tracking-tight text-white flex justify-center items-center h-20">
                    $
                  </div>
                ) : (
                  <div className="text-6xl font-sans font-light tracking-tight text-white flex justify-center items-start h-20">
                    <span>{plan.price}</span>
                    <span className="text-2xl mt-1.5 font-sans font-normal relative block ml-0.5">$</span>
                  </div>
                )}
                <span className="text-[11px] text-white font-sans tracking-wide block uppercase font-medium">
                  {plan.priceSub}
                </span>
              </div>

              {/* Horizontal line divider */}
              <div className="border-t border-zinc-800/80 my-2 mx-4" />

              {/* Features list */}
              <ul className="space-y-2.5 py-4 flex-1 flex flex-col justify-center items-center" id={`features-list-${plan.id}`}>
                {plan.features.map((feat, index) => (
                  <li
                    key={index}
                    className="text-[13px] font-sans text-white font-normal tracking-wide block"
                  >
                    {feat}
                  </li>
                ))}
              </ul>

              {/* Action Subscribe Button */}
              <div className="pt-4" id={`subscribe-btn-wrapper-${plan.id}`}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onSubscribe(plan.tag)}
                  className="w-full py-2.5 px-6 rounded-xl bg-white hover:bg-zinc-100 text-black text-xs font-bold font-sans transition-all shadow-sm cursor-pointer block text-center"
                  id={`btn-subscribe-${plan.id}`}
                >
                  Subscribe
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Styled Footer Block exactly mimicking Image 1 footer section */}
      <div className="w-full pt-10 pb-2 flex items-center justify-between border-t border-zinc-900/40 text-white text-[10px] font-sans" id="choose-plan-footer">
        <div className="flex items-center gap-1">
          <span>© 2025</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenTerms}
            className="hover:text-zinc-200 transition-colors cursor-pointer underline underline-offset-2 decorate-zinc-700"
            id="choose-plan-privacy-link"
          >
            Privacy Policy
          </button>
          <button
            onClick={onOpenTerms}
            className="hover:text-zinc-200 transition-colors cursor-pointer underline underline-offset-2 decorate-zinc-700"
            id="choose-plan-terms-link"
          >
            Terms of Use
          </button>
        </div>
      </div>
    </motion.div>
  );
}
