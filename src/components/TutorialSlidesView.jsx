/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, BookOpen, Shield, Headphones, ArrowRight, Check } from "lucide-react";
import RistoLogo from "./RistoLogo";
import mngwanaCover from "../assets/images/mng.png";

export default function TutorialSlidesView({
  onBack,
  onComplete,
  isDarkMode,
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  const slides = [
    {
      title: "Welcome to Risto",
      subtitle: "The Kenyan Storytelling Sanctuary",
      body: "Risto connects you with authentic digital stories, graphic novels, audiobooks, and webtoons created by East Africa's finest visual artists and narrators.",
      icon: BookOpen,
      color: "from-blue-600/20 via-indigo-600/10 to-transparent",
      accent: "text-white",
    },
    {
      title: "Defend Our History",
      subtitle: "Join Captain Mngwana's Watch",
      body: "The deceitful chronicler Msema Wongo is implanting false cybernetic memories on the streets of Nairobi. Watch over the authentic legends and protect our real oral history.",
      icon: Shield,
      imageUrl: mngwanaCover,
      color: "from-rose-600/20 via-pink-600/10 to-transparent",
      accent: "text-white",
    },
    {
      title: "A Sensory Journey",
      subtitle: "High-Fidelity Audiobooks",
      body: "Experience standard-setting voiceovers, local theatrical actors, atmospheric Nairobi street sounds, and soothing African ambient soundscapes while you read.",
      icon: Headphones,
      color: "from-teal-600/20 via-emerald-600/10 to-transparent",
      accent: "text-white",
    },
  ];

  const handleNext = () => {
    if (activeIdx < slides.length - 1) {
      setActiveIdx(activeIdx + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      setActiveIdx(activeIdx - 1);
    } else {
      onBack();
    }
  };

  const currentSlide = slides[activeIdx];
  const IconComponent = currentSlide.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`absolute inset-0 flex flex-col justify-between p-6 ${
        isDarkMode ? "bg-black text-white" : "bg-zinc-50 text-zinc-900"
      } overflow-y-auto selection:bg-indigo-500`}
      id="tutorial-slides-view"
    >
      {/* Top Header Logo Row */}
      <div className="flex items-center justify-between" id="tutorial-header">
        <div className="flex items-center select-none" id="tutorial-brand-logo">
          <RistoLogo size="custom" className="h-6 w-auto" isDarkTheme={isDarkMode} />
        </div>
        <button
          onClick={onComplete}
          className="text-xs font-mono font-bold tracking-wider text-zinc-500 hover:text-white transition-colors cursor-pointer select-none uppercase px-3 py-1 rounded bg-zinc-900/30 border border-zinc-800/10"
        >
          Skip
        </button>
      </div>

      {/* Main Slide Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center py-6 px-2 relative" id="slides-body-wrapper">
        
        {/* Dynamic color orb in background */}
        <div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
          <div className={`w-64 h-64 rounded-full bg-gradient-to-tr ${currentSlide.color} blur-[60px] opacity-70 transition-all duration-700`} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center max-w-sm"
          >
            {/* Visual Icon Badge Frame */}
            <div className={`w-20 h-20 rounded-2xl bg-zinc-900/40 border border-zinc-800/40 backdrop-blur-md flex items-center justify-center mb-8 shadow-xl relative overflow-hidden`}>
              {currentSlide.imageUrl ? (
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <IconComponent className={`w-9 h-9 ${currentSlide.accent} stroke-[1.8]`} />
              )}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${currentSlide.color} opacity-40 blur-sm -z-10`} />
            </div>

            {/* Slide Headings */}
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-white mb-2">
              {currentSlide.subtitle}
            </span>
            <h2 className="text-3xl font-sans font-extrabold tracking-tight mb-4 select-none leading-tight">
              {currentSlide.title}
            </h2>

            {/* Slide Body Description */}
            <p className="text-sm md:text-base text-zinc-400 font-sans font-light leading-relaxed px-1">
              {currentSlide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation and Pagination Controls */}
      <div className="space-y-6 max-w-sm mx-auto w-full" id="tutorial-footer-controls">
        
        {/* Progress Pagination Dots Indicator */}
        <div className="flex items-center justify-center gap-2" id="tutorial-progress-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIdx === idx ? "w-6 bg-white" : "w-2 bg-zinc-800 hover:bg-zinc-700"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Navigation Action Buttons Row */}
        <div className="flex gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handlePrev}
            className="flex-1 py-3.5 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 font-semibold rounded-xl text-sm transition-all border border-zinc-850 cursor-pointer text-center select-none flex items-center justify-center gap-1.5"
            id="btn-tutorial-prev"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex-grow-[1.5] py-3.5 bg-white hover:bg-zinc-100 text-black font-semibold rounded-xl text-sm transition-all shadow-md cursor-pointer select-none flex items-center justify-center gap-1.5 font-sans"
            id="btn-tutorial-next"
          >
            {activeIdx === slides.length - 1 ? (
              <>
                Let's Go!
                <Check className="w-4 h-4 text-black stroke-[3]" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
