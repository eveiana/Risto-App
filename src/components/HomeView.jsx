/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { CAPTAIN_MNGWANA_BOOK, MNGWANA_MWONGO_BOOK, DISRUPTIVE_MUSIC_BOOK, BONBON_DESSERTS_BOOK, MZEE_NDOTO_BOOK, MAMA_ONYIS_BOOK, RECOMMENDED_BOOKS } from "../data";
import BookCover from "./BookCover";
import { Search, Headphones, Sparkles, Upload } from "lucide-react";

export default function HomeView({ 
  onReadBook, 
  onEnterDetail, 
  onPlayAudio, 
  isDarkMode,
  searchQuery = "",
  onSearchQueryChange,
  registeredBooks = [],
  onNavigateToLibrary,
  onTriggerRegisterBook,
}) {
  // Let's create the books list exactly as displayed in the screenshots
  const MY_BOOKS = [
    { id: "mngwana-1", type: "mngwana", title: "Captain Mngwana Vs. Kichwa Mbovu", bookData: CAPTAIN_MNGWANA_BOOK },
    { id: "mngwana-3", type: "mngwana", title: "Captain Mngwana Vs. Msema Wongo", bookData: MNGWANA_MWONGO_BOOK },
    { id: "mngwana-disruptive", type: "disruptive", title: "Disruptive Music & Summit", bookData: DISRUPTIVE_MUSIC_BOOK },
    { id: "mngwana-bonbon", type: "bonbon", title: "Real Bonbon Masterpiece", bookData: BONBON_DESSERTS_BOOK },
    { id: "rec-ndoto", type: "ndoto", title: "Mzee Ndoto's Chapati", bookData: MZEE_NDOTO_BOOK },
    { id: "onyis-1", type: "onyis", title: "Mama Onyis", bookData: MAMA_ONYIS_BOOK },
  ];

  // A comprehensive searchable index of all books/stories in the system (Screenshot design specs)
  const searchableChronicles = [
    {
      id: "search-onyis-1",
      title: "Mama Onyis",
      author: "Thayu",
      type: "onyis",
      category: "Drama & Folklore",
      isAudio: false,
      bookData: MAMA_ONYIS_BOOK,
    },
    {
      id: "search-mngwana-kichwa",
      title: "Captain Mngwana Vs. Kichwa Mbovu",
      author: "Thayu Kilili",
      type: "mngwana",
      category: "Nairobi Guardian Saga",
      isAudio: true,
      bookData: CAPTAIN_MNGWANA_BOOK,
    },
    {
      id: "search-mngwana-sondeka",
      title: "Captain Mngwana Vs. Msema Wongo",
      author: "Thayu Kilili",
      type: "mngwana",
      category: "Sondeka Festival Edition",
      isAudio: true,
      bookData: MNGWANA_MWONGO_BOOK,
    },
    {
      id: "search-mngwana-disruptive",
      title: "Disruptive Music & Summit",
      author: "Sondeka Collective",
      type: "disruptive",
      category: "Comic & Audio Premium",
      isAudio: true,
      bookData: DISRUPTIVE_MUSIC_BOOK,
    },
    {
      id: "search-mngwana-bonbon",
      title: "Real Bonbon Masterpiece",
      author: "Artisanal Chef",
      type: "bonbon",
      category: "Co-Branded Gastronomy Series",
      isAudio: true,
      bookData: BONBON_DESSERTS_BOOK,
    },
    ...RECOMMENDED_BOOKS.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      type: b.id === "rec-ndoto" ? "ndoto" : b.id === "rec-onyis" ? "onyis" : "sondeka",
      category: b.id === "rec-ndoto" ? "Drama & Folklore" : b.id === "rec-onyis" ? "Drama & Folklore" : "Nairobi Writers Collective",
      isAudio: false,
      bookData: b.id === "rec-ndoto" ? MZEE_NDOTO_BOOK : b.id === "rec-onyis" ? MAMA_ONYIS_BOOK : {
        id: b.id,
        title: b.title,
        author: b.author,
        genres: ["Showcase"],
        coverUrl: b.coverUrl,
        description: `Experience ${b.title}, an elite graphic novel production from East Africa's storytelling sanctuary.`,
        pages: ["This chronicle will soon feature full cinematic illustrations and Swahili voice overs. Stay premium!"]
      }
    })),
    ...registeredBooks.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      type: "sondeka",
      category: "Uploaded Manuscript",
      isAudio: false,
      bookData: b
    }))
  ];

  const isSearching = searchQuery.trim().length > 0;
  const filteredChronicles = isSearching
    ? searchableChronicles.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`w-full flex-1 flex flex-col ${isDarkMode ? "bg-black text-white" : "bg-zinc-50 text-black"}`}
      id="home-view-wrapper"
    >
      <div className="home-content-container w-full px-5 py-6 space-y-8 select-none flex-1 flex flex-col">
        
        {isSearching ? (
          /* ==================== SCREENSHOT 8: DYNAMIC SEARCH RESULTS SCENE ==================== */
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 text-left flex-1 flex flex-col"
            id="search-results-section"
          >
            {/* Page 8 style Search Bar Capsule inside the feed */}
            <div className="w-full pt-1" id="search-bar-feed-capsule">
              <div className={`flex items-center gap-2.5 px-4 h-11 rounded-full border shadow-sm transition-shadow ${
                isDarkMode 
                  ? "bg-zinc-900/60 border-zinc-800/80 text-white focus-within:border-zinc-700" 
                  : "bg-white border-zinc-200 text-zinc-950 focus-within:border-indigo-400"
              }`}>
                <Search className="w-4 h-4 text-zinc-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Kenyan comics"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange?.(e.target.value)}
                  className="bg-transparent text-xs w-full focus:outline-none placeholder-zinc-500 font-sans"
                  id="feed-live-search-input"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchQueryChange?.("")}
                    className="p-1 text-zinc-500 hover:text-zinc-300 text-[10px] font-bold font-mono"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Search Header Info */}
            <div className="flex justify-between items-center px-1 border-b pb-2.5 border-zinc-800/10">
              <span className="text-[9.5px] font-mono tracking-wider text-[#bf2c11] font-black uppercase">
                Captain Mngwana &amp; Chronicles
              </span>
              <span className={`text-[9.5px] font-mono ${isDarkMode ? "text-zinc-500" : "text-zinc-405"}`}>
                {filteredChronicles.length} found
              </span>
            </div>

            {filteredChronicles.length === 0 ? (
              /* No matching titles view */
              <div className="text-center py-16 flex-1 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-zinc-900/40 border border-zinc-800/50 flex items-center justify-center text-zinc-505">
                  <Search className="w-5 h-5 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold font-sans">No Chronicles Found</h4>
                  <p className="text-[10px] font-mono text-zinc-500 max-w-[220px] mx-auto leading-relaxed">
                    We couldn't track down stories matching that keyword. Try searching for "Captain", "River", or "Kakamega"!
                  </p>
                </div>
              </div>
            ) : (
              /* Matching Grid List exactly styled as seen in Page 8 */
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 pt-1.5 overflow-y-auto max-h-[580px] pb-6 pr-1" id="search-results-grid">
                {filteredChronicles.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEnterDetail(item.bookData)}
                    className="flex flex-col text-left group cursor-pointer"
                  >
                    {/* Cover photo click-trigger */}
                    <div
                      className={`w-full aspect-[4/5] rounded-[2rem] overflow-hidden shrink-0 shadow-md relative group-hover:shadow-indigo-500/10 transition-all border ${
                        isDarkMode ? "border-zinc-900/30" : "border-zinc-200"
                      }`}
                    >
                      {item.id.includes("mngwana") ? (
                        <BookCover type={item.type} />
                      ) : (
                        <img 
                           src={item.bookData.coverUrl} 
                           alt={item.title} 
                           referrerPolicy="no-referrer"
                           className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" 
                        />
                      )}
                      
                      {/* Audio play badge if is audio */}
                      {item.isAudio && (
                        <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center border border-white/10 z-10">
                          <Headphones className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Meta details below cover */}
                    <div className="pt-2 px-1 space-y-0.5">
                      <h4 className="text-[11.5px] font-sans font-black tracking-tight leading-snug line-clamp-2 uppercase group-hover:text-indigo-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className={`text-[9.5px] font-mono italic tracking-wide ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                        by {item.author}
                      </p>
                      
                      <div className="flex items-center gap-1.5 pt-1">
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-mono tracking-wider uppercase font-black text-[#bf2c11]">
                          <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-current shrink-0" />
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <>
            {/* ==================== SCREENSHOT 6: HERO BANNER LAYOUT ==================== */}
            <div className="relative w-full rounded-[2.5rem] overflow-hidden border border-zinc-900/30 shadow-xl bg-black" id="home-hero-banner">
              {/* Background cover image/component */}
              <div className="w-full h-[45vh] md:h-[400px] relative">
                <BookCover type="mngwana" imgClassName="object-top" className="absolute inset-x-0 top-0 w-full h-full object-cover rounded-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent" />
              </div>

              {/* Character Details in modern aesthetic overlays */}
              <div className="p-5 space-y-4 text-left font-sans -mt-10 relative z-10">
                <div className="space-y-1.5">
                  <h2 className="text-xl md:text-2xl font-sans font-black tracking-tight text-white leading-tight">
                    Captain Mngwana Vs. Msema Wongo
                  </h2>
                  <div className="flex flex-wrap items-center gap-1.5" id="home-genres-pill-row">
                    <span className="text-[9px] font-sans font-bold tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-350 uppercase px-2.5 py-0.5 rounded-md">
                      Comic
                    </span>
                    <span className="text-[9px] font-sans font-bold tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-350 uppercase px-2.5 py-0.5 rounded-md">
                      Thriller
                    </span>
                    <span className="text-[9px] font-sans font-bold tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-350 uppercase px-2.5 py-0.5 rounded-md">
                      Action
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed font-sans opacity-95">
                  In the heart of the bustling city of Nairobi, Captain Mngwana, the city's valiant guardian, is peacefully immersed in a critical mystery, until the treacherous storyteller Msema Wongo threatens to rewrite history with his deceitful tales...
                </p>

                {/* Read Now prominent button */}
                <div className="pt-1 flex justify-center">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEnterDetail(CAPTAIN_MNGWANA_BOOK)}
                    className="w-48 py-2 bg-zinc-100 hover:bg-white text-black text-xs font-extrabold uppercase rounded-full shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-colors duration-150"
                  >
                    Read Now
                  </motion.button>
                </div>
              </div>
            </div>

            {/* ==================== SCREENSHOT 6: Upload Book Call-To-Action Banner ==================== */}
            <div 
              className={`w-full rounded-[2rem] p-5 border flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden shadow-sm ${
                isDarkMode 
                  ? "bg-gradient-to-r from-zinc-950/80 via-zinc-900/50 to-black border-zinc-800" 
                  : "bg-gradient-to-r from-indigo-50/60 via-zinc-50 to-white border-zinc-200"
              }`}
              id="home-upload-manuscript-cta"
            >
              <div className="space-y-1.5 text-left max-w-md">
                <span className="inline-flex items-center gap-1 text-[8.5px] font-mono font-black tracking-widest text-[#bf2c11] uppercase">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-current shrink-0" />
                  STORY ARCHIVE ENGAGEMENT
                </span>
                <h3 className={`text-sm font-sans font-black tracking-tight leading-snug uppercase ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                  Do you have your own stories?
                </h3>
                <p className={`text-[10.5px] leading-relaxed font-sans ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                  Instantly batch-upload PDFs, text files (.txt) or markdown drafts (.md) client-side. Read them here or listen using our Swahili/English text-to-speech voice models!
                </p>
              </div>

              {onTriggerRegisterBook && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onTriggerRegisterBook}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-sans text-[11px] font-black tracking-wide uppercase rounded-full shadow-md cursor-pointer flex items-center justify-center gap-2 transition-all self-start sm:self-auto shrink-0 animate-pulse"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>+ Upload Book</span>
                </motion.button>
              )}
            </div>

            {/* ==================== SCREENSHOT 6: "Recommended" Section ==================== */}
            <div className="space-y-4 text-left animate-fade-in" id="home-recommended-section">
              <div className="flex justify-between items-center px-1">
                <h3 className={`text-base font-bold font-sans tracking-tight uppercase opacity-90 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                  Recommended
                </h3>
                {onNavigateToLibrary && (
                  <button
                    onClick={onNavigateToLibrary}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-sans font-bold flex items-center gap-1 cursor-pointer"
                    id="home-recommended-see-all"
                  >
                    See Library →
                  </button>
                )}
              </div>

              <div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 pb-4 pt-1 w-full"
                id="home-recommended-grid"
              >
                {MY_BOOKS.map((recItem) => (
                  <motion.div
                    key={recItem.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onEnterDetail(recItem.bookData)}
                    className="flex flex-col group cursor-pointer w-full text-left transition-all"
                    title={`Open details for "${recItem.title}"`}
                  >
                    {/* Cover ratio box */}
                    <div className="w-full aspect-[4/5] rounded-[1.25rem] overflow-hidden shadow-md hover:shadow-lg transition-all relative border border-zinc-200/10">
                      <BookCover type={recItem.type} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02] text-white" />
                      {recItem.type === "mngwana" && (
                        <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-red-600 text-white font-black text-[7px] px-1.5 py-0.5 rounded-full shadow-md tracking-wider uppercase flex items-center gap-1 z-10" id="mngwana-flagship-badge">
                          <Sparkles className="w-2 h-2 text-yellow-300 fill-current shrink-0" />
                          FLAGSHIP
                        </div>
                      )}
                    </div>
                    
                    {/* Rec Title below */}
                    <h4 className={`text-[11px] font-sans font-bold tracking-tight mt-2.5 leading-tight truncate ${
                      isDarkMode ? "text-zinc-100" : "text-zinc-900"
                    }`}>
                      {recItem.title}
                    </h4>
                    <p className={`text-[9.5px] font-mono mt-0.5 truncate ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                      by {recItem.bookData?.author || "Thayu"}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ==================== SCREENSHOT 6: "My Manuscripts" Section ==================== */}
            {registeredBooks.length > 0 && (
              <div className="space-y-4 text-left animate-fade-in" id="home-custom-manuscripts-section">
                <div className="flex justify-between items-center px-1">
                  <h3 className={`text-base font-bold font-sans tracking-tight uppercase opacity-90 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                    My Manuscripts ({registeredBooks.length})
                  </h3>
                  <div className="flex items-center gap-2.5">
                    {onTriggerRegisterBook && (
                      <button
                        onClick={onTriggerRegisterBook}
                        className="text-[10.5px] md:text-xs text-indigo-400 hover:text-indigo-300 font-sans font-bold flex items-center gap-1.5 cursor-pointer bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-500/20 transition-all"
                        id="home-manuscripts-quick-upload"
                      >
                        <Upload className="w-3 h-3" />
                        <span>+ Upload Book</span>
                      </button>
                    )}
                    {onNavigateToLibrary && (
                      <button
                        onClick={onNavigateToLibrary}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-sans font-bold flex items-center gap-1 cursor-pointer"
                        id="home-manuscripts-see-all"
                      >
                        Manage Library →
                      </button>
                    )}
                  </div>
                </div>

                <div 
                  className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar"
                  style={{ scrollbarWidth: "none" }}
                  id="home-custom-manuscripts-slider"
                >
                  {registeredBooks.map((bookItem) => (
                    <motion.div
                      key={bookItem.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onEnterDetail(bookItem)}
                      className="flex-shrink-0 w-[42vw] max-w-[170px] snap-start group cursor-pointer"
                      title={`Open details for "${bookItem.title}"`}
                      id={`home-book-custom-card-${bookItem.id}`}
                    >
                      <div className="w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden shadow-lg hover:shadow-xl transition-shadow relative border border-zinc-805">
                        <img 
                          src={bookItem.coverUrl} 
                          alt={bookItem.title} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102" 
                        />
                        <span className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shadow-md">
                          Uploaded
                        </span>
                      </div>
                      
                      <h4 className={`text-[11px] font-sans font-bold tracking-tight mt-3 leading-tight truncate ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}>
                        {bookItem.title}
                      </h4>
                      <p className="text-[9px] font-mono text-zinc-500">by {bookItem.author}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </motion.div>
  );
}
