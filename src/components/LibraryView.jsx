/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Trash2 } from "lucide-react";
import { CAPTAIN_MNGWANA_BOOK, MNGWANA_MWONGO_BOOK, DISRUPTIVE_MUSIC_BOOK, BONBON_DESSERTS_BOOK, MZEE_NDOTO_BOOK, MAMA_ONYIS_BOOK } from "../data";
import BookCover from "./BookCover";

export default function LibraryView({
  onEnterDetail,
  onPlayAudio,
  isDarkMode,
  registeredBooks = [],
  onTriggerRegisterBook,
  isAdmin = false,
  onDeleteBook,
}) {
  const [confirmDeleteId, setConfirmDeleteId] = React.useState(null);

  // Books lists exactly as displayed in Page 14 of PDF, with distinct book data mappings
  const MY_BOOKS = [
    { id: "lib-mngwana-kichwa", type: "mngwana", title: "Captain Mngwana Vs. Kichwa Mbovu", bookData: CAPTAIN_MNGWANA_BOOK },
    { id: "lib-mngwana-3", type: "mngwana", title: "Captain Mngwana Vs. Msema Wongo", bookData: MNGWANA_MWONGO_BOOK },
    { id: "lib-mngwana-1", type: "disruptive", title: "Disruptive Music & Summit", bookData: DISRUPTIVE_MUSIC_BOOK },
    { id: "lib-mngwana-2", type: "bonbon", title: "Real Bonbon Masterpiece", bookData: BONBON_DESSERTS_BOOK },
    { id: "lib-ndoto", type: "ndoto", title: "Mzee Ndoto's Chapati", bookData: MZEE_NDOTO_BOOK },
    { id: "lib-onyis", type: "onyis", title: "Mama Onyis", bookData: MAMA_ONYIS_BOOK },
  ];

  const MY_AUDIOBOOKS = [
    { id: "lib-audio-kichwa", type: "mngwana", title: "Captain Mngwana Vs. Kichwa Mbovu", bookData: CAPTAIN_MNGWANA_BOOK },
    { id: "lib-audio-3", type: "mngwana", title: "Captain Mngwana Vs. Msema Wongo", bookData: MNGWANA_MWONGO_BOOK },
    { id: "lib-audio-1", type: "disruptive", title: "Disruptive Music & Summit", bookData: DISRUPTIVE_MUSIC_BOOK },
    { id: "lib-audio-2", type: "bonbon", title: "Real Bonbon Masterpiece", bookData: BONBON_DESSERTS_BOOK },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`w-full flex-1 flex flex-col ${isDarkMode ? "bg-black text-white" : "bg-zinc-50 text-black"}`}
      id="library-view-container"
    >
      <div className="w-full px-5 py-6 space-y-8 select-none flex-1 flex flex-col pb-12">
        
        {/* ==================== SCREENSHOT 14: Quote Section Card ==================== */}
        <div className="relative pt-4" id="library-quote-card-container">
          {/* Quotation Mark Icon overlapping top-left */}
          <div className="absolute top-0 left-2 z-10 w-11 h-11 bg-black text-white rounded-full flex items-center justify-center font-serif text-3xl font-extrabold shadow-lg border border-zinc-850">
            “
          </div>

          {/* White Card Frame */}
          <div 
            className="w-full bg-white text-zinc-950 px-6 pt-9 pb-5 rounded-[2rem] shadow-xl border border-zinc-100 flex flex-col gap-2 relative"
            id="lib-quote-card"
          >
            <p className="text-xl md:text-2xl font-sans font-medium tracking-tight text-zinc-900 leading-tight">
              The sun showers its warmth, and the city buzzes with life.
            </p>
            <p className="text-[10px] font-mono text-zinc-500 text-right uppercase tracking-wider font-semibold pt-1">
              - Anonymous
            </p>
          </div>
        </div>

        {/* ==================== BOOK REGISTRATION / UPLOAD CARD (USER REQUEST) ==================== */}
        {isAdmin && (
          <div className={`p-5 rounded-[2rem] border relative overflow-hidden flex flex-col gap-3.5 ${
            isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-white border-zinc-200/60 shadow-sm"
          }`} id="lib-register-banner-container">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-full bg-zinc-500/10 text-zinc-600">
                <span className="text-xs">📂</span>
              </div>
              <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-zinc-600">Manuscript Upload</h4>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-sans font-semibold tracking-tight leading-snug">
                Add your own stories, books or transcripts.
              </p>
              <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                Accepts plain text files (.txt, .md) and cover art images. Syncs instantly to Cloud Firestore.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={onTriggerRegisterBook}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-[11px] uppercase rounded-full shadow-md cursor-pointer transition-colors"
              id="lib-trigger-register-btn"
            >
              + Register Book or File
            </motion.button>
          </div>
        )}

        {/* ==================== CUSTOM REGISTERED CHRONICLES ROW ==================== */}
        {registeredBooks.length > 0 && (
          <div className="space-y-4 animate-fade-in" id="lib-registered-books-section">
            <div className="flex justify-between items-center">
              <h3 className={`text-base font-bold font-sans tracking-tight uppercase opacity-90 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                My Registered Chronicles ({registeredBooks.length})
              </h3>
            </div>

            <div 
              className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar"
              style={{ scrollbarWidth: "none" }}
              id="lib-registered-books-slider"
            >
              {registeredBooks.map((bookItem) => (
                <motion.div
                  key={bookItem.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEnterDetail(bookItem)}
                  className="flex-shrink-0 w-[42vw] max-w-[170px] snap-start group cursor-pointer"
                  title={`Open details for "${bookItem.title}"`}
                  id={`lib-book-custom-card-${bookItem.id}`}
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

                    {/* Admin Delete Action overlay */}
                    {isAdmin && (
                      <div className="absolute top-2 right-2 z-20">
                        {confirmDeleteId === bookItem.id ? (
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteBook(bookItem.id, bookItem.docId);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-1 text-[8px] font-mono font-bold bg-red-600 hover:bg-red-500 text-white rounded shadow-md cursor-pointer uppercase"
                              title="Confirm delete"
                            >
                              Delete?
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDeleteId(null);
                              }}
                              className="px-1.5 py-1 text-[8px] font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-white rounded shadow-md cursor-pointer uppercase"
                              title="Cancel"
                            >
                              X
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(bookItem.id);
                            }}
                            className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white shadow-md cursor-pointer backdrop-blur-sm transition-colors"
                            title="Delete Book"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
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

        {/* ==================== SCREENSHOT 14: "My books" Section ==================== */}
        <div className="space-y-4 animate-fade-in" id="lib-my-books-section">
          <div className="flex justify-between items-center">
            <h3 className={`text-base font-bold font-sans tracking-tight uppercase opacity-90 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
              My books
            </h3>
            <span 
              className="text-[10px] font-mono text-indigo-400 font-semibold cursor-pointer select-none" 
              onClick={() => onEnterDetail(CAPTAIN_MNGWANA_BOOK)}
            >
              See All
            </span>
          </div>

          <div 
            className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar"
            style={{ scrollbarWidth: "none" }}
            id="lib-books-slider"
          >
            {MY_BOOKS.map((bookItem) => (
              <motion.div
                key={bookItem.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onEnterDetail(bookItem.bookData)}
                className="flex-shrink-0 w-[130px] snap-start group cursor-pointer"
                title={`Open details for "${bookItem.title}"`}
              >
                {/* 4/5 ratio size container */}
                <div className="w-full aspect-[4/5] rounded-[1.25rem] overflow-hidden shadow-md hover:shadow-lg transition-all relative border border-zinc-250/10">
                  <BookCover type={bookItem.type} coverUrl={bookItem.bookData?.coverUrl || bookItem.coverUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103" />
                  {bookItem.type === "mngwana" && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-red-600 text-white font-black text-[7px] px-1.5 py-0.5 rounded-full shadow-md tracking-wider uppercase z-10" id="lib-mngwana-badge">
                      MAIN STORY
                    </div>
                  )}
                </div>
                
                {/* Book Title below */}
                <h4 className={`text-[11px] font-sans font-bold tracking-tight mt-2.5 leading-tight truncate ${
                  bookItem.type === "mngwana" ? "text-amber-500 font-extrabold" : isDarkMode ? "text-zinc-100" : "text-zinc-900"
                }`}>
                  {bookItem.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ==================== SCREENSHOT 14: "My Audiobooks" Section ==================== */}
        <div className="space-y-4 pb-6" id="lib-my-audiobooks-section">
          <div className="flex justify-between items-center">
            <h3 className={`text-base font-bold font-sans tracking-tight uppercase opacity-90 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
              My Audiobooks
            </h3>
            <span 
              className="text-[10px] font-mono text-indigo-400 font-semibold cursor-pointer select-none" 
              onClick={() => onPlayAudio(CAPTAIN_MNGWANA_BOOK)}
            >
              Listen All
            </span>
          </div>

          <div 
            className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar"
            style={{ scrollbarWidth: "none" }}
            id="lib-audiobooks-slider"
          >
            {MY_AUDIOBOOKS.map((audioItem) => (
              <motion.div
                key={audioItem.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => onPlayAudio(CAPTAIN_MNGWANA_BOOK)}
                className="flex-shrink-0 w-[130px] snap-start group cursor-pointer"
                title={`Listen to "${audioItem.title}"`}
              >
                {/* Audiobook cover aspect ratio representation */}
                <div className="w-full aspect-[4/5] rounded-[1.25rem] overflow-hidden shadow-md hover:shadow-lg transition-all relative border border-zinc-250/10">
                  <BookCover type={audioItem.type} coverUrl={audioItem.coverUrl} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103" />
                  {/* Headphones overlay */}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md p-1 rounded-full border border-white/10 z-10">
                    <span className="text-[9px] text-white">🎧</span>
                  </div>
                  {audioItem.type === "mngwana" && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-red-600 text-white font-black text-[7px] px-1.5 py-0.5 rounded-full shadow-md tracking-wider uppercase z-10" id="lib-audio-mngwana-badge">
                      MAIN
                    </div>
                  )}
                </div>
                
                {/* Audiobook Title below */}
                <h4 className={`text-[11px] font-sans font-bold tracking-tight mt-2.5 leading-tight truncate ${
                  audioItem.type === "mngwana" ? "text-amber-500 font-extrabold" : isDarkMode ? "text-zinc-100" : "text-zinc-900"
                }`}>
                  {audioItem.title}
                </h4>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
