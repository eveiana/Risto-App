/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, User, X, Upload } from "lucide-react";
import RistoLogo from "./RistoLogo";

export default function Header({
  currentScreen,
  setCurrentScreen,
  onSearchQuery,
  isDarkMode,
  onTriggerUpload,
}) {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchQuery) {
      onSearchQuery(searchVal);
    }
  };

  const handleClearSearch = () => {
    setSearchVal("");
    setShowSearchBar(false);
    if (onSearchQuery) onSearchQuery("");
  };

  return (
    <div
      className={`relative w-full h-[60px] flex items-center justify-between px-5 border-b select-none z-20 ${
        isDarkMode
          ? currentScreen === "home"
            ? "bg-black/90 backdrop-blur-md border-zinc-900 text-white"
            : "bg-zinc-900 border-zinc-800 text-white"
          : "bg-white border-zinc-200 text-zinc-900"
      }`}
      id="global-header-bar"
    >
      <AnimatePresence>
        {showSearchBar ? (
          <motion.form
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            onSubmit={handleSearchSubmit}
            className={`absolute inset-0 flex items-center px-4 z-35 gap-2 ${isDarkMode ? "bg-zinc-900" : "bg-white"}`}
          >
            <input
              type="text"
              autoFocus
              placeholder="Search recommended chronicles..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                if (onSearchQuery) onSearchQuery(e.target.value);
              }}
              className={`flex-1 bg-transparent border-none text-sm focus:outline-none ${isDarkMode ? "text-white placeholder-zinc-500" : "text-zinc-900 placeholder-zinc-400"}`}
              id="header-search-input"
            />
            <button
              type="button"
              onClick={handleClearSearch}
              className={`${isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"} cursor-pointer`}
              id="clear-search-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.form>
        ) : null}
      </AnimatePresence>

      {/* Brand logo container */}
      <div
        onClick={() => setCurrentScreen("home")}
        className="flex items-center cursor-pointer group"
        id="header-logo-clickable"
      >
        <RistoLogo size="custom" className="h-7 md:h-8 w-auto transition-transform group-hover:scale-105" isDarkTheme={isDarkMode} />
      </div>

      {/* Profile quick buttons */}
      <div className={`flex items-center gap-2.5 md:gap-4 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
        {onTriggerUpload && (
          <button
            onClick={onTriggerUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-sm hover:shadow hover:scale-103 active:scale-97"
            id="header-upload-book-btn"
            title="Upload Book"
          >
            <Upload className="w-3.5 h-3.5 shrink-0" />
            <span className="font-sans text-[10px] md:text-xs tracking-wide hidden xs:inline">+ Upload Book</span>
            <span className="font-sans text-[10px] md:text-xs tracking-wide xs:hidden">+ Upload</span>
          </button>
        )}

        <button
          onClick={() => setShowSearchBar(true)}
          className={`p-1 transition-colors cursor-pointer ${isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"}`}
          id="header-search-trigger"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentScreen("profile")}
          className={`p-1 transition-colors cursor-pointer ${
            currentScreen === "profile" ? (isDarkMode ? "text-white" : "text-black") : isDarkMode ? "text-zinc-400 hover:text-white" : "text-zinc-500 hover:text-zinc-900"
          }`}
          id="header-profile-trigger"
          title="Your Profile"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
