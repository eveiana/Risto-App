/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, User } from "lucide-react";
import RistoLogo from "./RistoLogo";

export default function GenresView({ onNext, isDarkMode }) {
  // We're displaying 12 buttons structured into 3 columns exactly as in Image 7:
  // Column 1: Fantasy, Comedy, Horror, Experimental
  // Column 2: Sci-fi, Crime, Romance, Thriller
  // Column 3: Sci-fi, Crime, Romance, Thriller
  // Pre-selected categories from the design screenshot: Fantasy (Col 1), Romance (Col 2), Romance (Col 3).
  const [selections, setSelections] = useState({
    "col1-0": true, // Fantasy
    "col2-2": true, // Romance Col 2
    "col3-2": true, // Romance Col 3
  });

  const columns = [
    {
      id: "col1",
      items: [
        { label: "Fantasy", id: "col1-0" },
        { label: "Comedy", id: "col1-1" },
        { label: "Horror", id: "col1-2" },
        { label: "Experimental", id: "col1-3" },
      ],
    },
    {
      id: "col2",
      items: [
        { label: "Sci-fi", id: "col2-0" },
        { label: "Crime", id: "col2-1" },
        { label: "Romance", id: "col2-2" },
        { label: "Thriller", id: "col2-3" },
      ],
    },
    {
      id: "col3",
      items: [
        { label: "Sci-fi", id: "col3-0" },
        { label: "Crime", id: "col3-1" },
        { label: "Romance", id: "col3-2" },
        { label: "Thriller", id: "col3-3" },
      ],
    },
  ];

  const toggleSelect = (id) => {
    setSelections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const selectedCount = Object.values(selections).filter(Boolean).length;
  const canProceed = selectedCount >= 3;

  const handleNextClick = () => {
    if (canProceed) {
      // Gather friendly names
      const selectedNames = [];
      columns.forEach((col) => {
        col.items.forEach((item) => {
          if (selections[item.id]) {
            selectedNames.push(item.label);
          }
        });
      });
      onNext(selectedNames);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="absolute inset-0 flex flex-col justify-between p-6 bg-black text-white selection:bg-white selection:text-black"
      id="genres-view-wrapper"
    >
      {/* Dynamic Header Block */}
      <div className="flex items-center justify-between pb-3" id="genres-onboarding-header">
        <div className="flex items-center select-none" id="genres-brand-logo">
          <RistoLogo size="custom" className="h-8 w-auto" isDarkTheme={true} />
        </div>
        <div className="flex items-center gap-6 text-white">
          <Search className="w-6 h-6" />
          <User className="w-6 h-6" />
        </div>
      </div>

      {/* Title block */}
      <div className="my-auto py-4 space-y-2">
        <h2 className="text-4xl font-sans font-bold text-white tracking-tighter leading-none pt-2" id="onboarding-genre-title">
          Let&apos;s get to know each other
        </h2>
        <div className="space-y-0.5">
          <p className="text-xl font-sans font-medium text-white">
            What do you fancy?
          </p>
          <p className="text-sm text-zinc-300 font-sans">
            (Select a minimum of 3)
          </p>
        </div>

        {/* 3 Columns Grid exactly mimicking Screenshot */}
        <div className="grid grid-cols-3 gap-3 px-1 pt-8 pb-2 select-none" id="genres-selection-grid">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col gap-3">
              {column.items.map((item) => {
                const isSelected = !!selections[item.id];
                return (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSelect(item.id)}
                    className={`w-full py-4 px-2 rounded-2xl text-sm font-sans font-medium leading-none tracking-tight border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-black border-white shadow-md"
                        : "bg-transparent text-zinc-300 border-zinc-700 hover:text-white hover:border-zinc-500 shadow-sm"
                    }`}
                    id={`genre-btn-${item.id}`}
                    title={`Toggle ${item.label}`}
                  >
                    {item.label}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Fixed next action button and footer bar */}
      <div className="w-full max-w-sm mx-auto pb-6 space-y-10 flex flex-col items-center">
        <motion.button
          whileTap={{ scale: 0.96 }}
          disabled={!canProceed}
          onClick={handleNextClick}
          className={`w-full py-4 font-sans font-semibold rounded-full text-base transition-all shadow-md cursor-pointer text-center tracking-wide ${
            canProceed
              ? "bg-white hover:bg-zinc-200 text-black"
              : "bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed"
          }`}
          id="genres-next-btn"
        >
          Next
        </motion.button>

        {/* Traditional Branding Footer copy */}
        <div className="w-full flex justify-between items-center text-xs text-zinc-300 font-sans">
          <span>© 2025</span>
          <div className="flex gap-4">
            <span className="underline cursor-pointer">Privacy Policy</span>
            <span className="underline cursor-pointer">Terms of Use</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
