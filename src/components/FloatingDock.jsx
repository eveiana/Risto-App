/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, Headphones, Home, Heart, Bookmark, AlertCircle, X } from "lucide-react";

export default function FloatingDock({
  currentScreen,
  setCurrentScreen,
  onReadTrigger,
  onPlayAudioTrigger,
  isDarkMode,
}) {
  const [activeAlert, setActiveAlert] = useState(null);

  const triggerAlert = (message) => {
    setActiveAlert(message);
    setTimeout(() => {
      setActiveAlert(null);
    }, 3000);
  };

  // Determine active slot index (0 to 4) based on screen state
  let activeIndex = 2; // Default to Home (center)
  if (currentScreen === "library" || currentScreen === "book-detail") {
    activeIndex = 0;
  } else if (currentScreen === "audio-player") {
    activeIndex = 1;
  } else if (currentScreen === "home") {
    activeIndex = 2;
  } else if (currentScreen === "favorites") {
    activeIndex = 3;
  } else if (currentScreen === "profile") {
    activeIndex = 4; // Or on ProfileView, active slot can highlight Bookmark
  }

  const handleTabClick = (index) => {
    if (index === 0) {
      setCurrentScreen("library");
    } else if (index === 1) {
      setCurrentScreen("audio-player");
    } else if (index === 2) {
      setCurrentScreen("home");
    } else if (index === 3) {
      setCurrentScreen("favorites");
    } else if (index === 4) {
      setCurrentScreen("profile");
    }
  };

  // Tabs structure representing the 5 bottom navigation buttons
  const tabs = [
    { id: "library", label: "Library", icon: BookOpen },
    { id: "audio", label: "Listen", icon: Headphones },
    { id: "home", label: "Home", icon: Home },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "profile", label: "Profile", icon: Bookmark },
  ];

  return (
    <div className="absolute bottom-5 left-0 right-0 px-4 z-40 select-none pointer-events-none">
      {/* Alert toast inside floating viewport if needed */}
      <AnimatePresence>
        {activeAlert && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mb-3 mx-auto w-fit max-w-[280px] bg-zinc-900 border border-zinc-805 text-zinc-300 text-xs font-medium py-2.5 px-4 rounded-full flex items-center justify-between gap-1.5 shadow-xl pointer-events-auto"
          >
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{activeAlert}</span>
            </div>
            <button
              onClick={() => setActiveAlert(null)}
              className="text-zinc-500 hover:text-white cursor-pointer ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating navigation dock main frame */}
      <div className={`w-full max-w-sm mx-auto h-[64px] rounded-full shadow-2xl flex items-center justify-between px-4 pointer-events-auto relative border ${
        isDarkMode 
          ? "bg-white border-zinc-300 text-black shadow-lg"
          : "bg-zinc-950/95 border-zinc-900 text-white shadow-[0_20px_50px_rgba(0,0,0,0.8)]" 
      }`}>
        {tabs.map((tab, idx) => {
          const Icon = tab.icon;
          const isActive = activeIndex === idx;

          if (isActive) {
            // Elevated Home/Active Orb Circle container (strictly matches designated slot index!)
            return (
              <div key={tab.id} className="relative w-14 h-14 flex items-center justify-center -mt-6 z-20">
                <motion.button
                  layoutId="activeOrb"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabClick(idx)}
                  className={`w-[56px] h-[56px] rounded-full flex items-center justify-center shadow-xl border-4 cursor-pointer ${
                    isDarkMode 
                      ? "bg-zinc-900 text-white border-white"
                      : "bg-amber-400 text-black border-zinc-950" 
                  }`}
                  title={tab.label}
                  id={`dock-${tab.id}-orb`}
                >
                  <Icon className="w-5 h-5 stroke-[2.5]" />
                </motion.button>
              </div>
            );
          }

          // Inactive flat icon button (Solid black/gray in modern look, highly visible!)
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(idx)}
              className={`w-12 h-12 flex items-center justify-center hover:scale-108 transition-all cursor-pointer z-10 ${
                isDarkMode 
                  ? "text-zinc-500 hover:text-zinc-950"
                  : "text-zinc-400 hover:text-white"
              }`}
              title={tab.label}
              id={`dock-${tab.id}-btn`}
            >
              <Icon className="w-5 h-5 stroke-[2]" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
