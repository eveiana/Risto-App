/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Heart, BookOpen, Headphones } from "lucide-react";
import { CAPTAIN_MNGWANA_BOOK, MNGWANA_MWONGO_BOOK } from "../data";
import BookCover from "./BookCover";

export default function FavoritesView({ 
  onEnterDetail, 
  onPlayAudio, 
  isDarkMode,
  searchQuery = ""
}) {
  // Prepopulated with user's favorite chronicle matching design data
  const favoritesList = [
    {
      id: "fav-1",
      book: CAPTAIN_MNGWANA_BOOK,
      type: "disruptive",
      tag: "Comic & Audio Available",
    },
    {
      id: "fav-2",
      book: MNGWANA_MWONGO_BOOK,
      type: "disruptive",
      tag: "Comic & Audio Available",
    },
  ];

  const isSearching = searchQuery.trim().length > 0;
  const filteredFavoritesList = isSearching
    ? favoritesList.filter(
        (item) =>
          item.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : favoritesList;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`w-full flex-1 flex flex-col justify-start px-5 py-6 ${
        isDarkMode ? "bg-black text-white" : "bg-zinc-50 text-black"
      }`}
      id="favorites-view-wrapper"
    >
      <div className="space-y-4 text-left select-none">
        {/* Header Title */}
        <div className="flex items-center gap-2 border-b border-zinc-800/20 pb-3">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <h2 className="text-lg font-serif font-semibold tracking-wide">
            Your Wishlist
          </h2>
        </div>

        <p className="text-xs text-zinc-500 leading-relaxed font-sans italic opacity-85">
          These elements are saved to your offline profile. You can access their visual panels and voice narration on the move.
        </p>

        {filteredFavoritesList.length === 0 ? (
          <div className="text-center py-16 text-zinc-400 text-xs italic font-sans flex flex-col items-center gap-2">
            <Heart className="w-8 h-8 text-zinc-700 stroke-[1.5]" />
            {isSearching ? "No matching saved stories found." : "Your wishlist of stories is currently empty!"}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 pt-2" id="favorites-grid">
            {filteredFavoritesList.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 p-3 rounded-2xl border transition-all ${
                  isDarkMode
                    ? "bg-zinc-900/35 border-zinc-800/40 text-white"
                    : "bg-white border-zinc-200 text-black shadow-sm"
                }`}
              >
                {/* Book cover aspect */}
                <div
                  onClick={() => onEnterDetail(item.book)}
                  className="w-20 aspect-[4/5] hover:scale-103 transition-transform cursor-pointer rounded-xl overflow-hidden shrink-0 shadow-md"
                >
                  <BookCover type={item.type} />
                </div>

                {/* Book info content block */}
                <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5 text-left">
                  <div className="space-y-0.5">
                    <h3
                      onClick={() => onEnterDetail(item.book)}
                      className="text-xs font-extrabold truncate hover:underline hover:text-indigo-400 cursor-pointer"
                    >
                      {item.book.title}
                    </h3>
                    <p className="text-[10px] text-zinc-400 font-mono italic">
                      by {item.book.author}
                    </p>
                    <span className="inline-block text-[8px] tracking-wider uppercase font-mono font-black mt-1 text-[#bf2c11]">
                      {item.tag}
                    </span>
                  </div>

                  {/* Core Action triggers row (Read, Listen) */}
                  <div className="flex items-center gap-2 pt-1.5 border-t border-zinc-100/10">
                    <button
                      onClick={() => onEnterDetail(item.book)}
                      className={`py-1.5 px-3 rounded-lg text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        isDarkMode
                          ? "bg-white hover:bg-zinc-100 text-black"
                          : "bg-black hover:bg-zinc-800 text-white"
                      }`}
                      title="Read Chapter Now"
                    >
                      <BookOpen className="w-3 h-3 stroke-[2.5]" />
                      Read
                    </button>

                    <button
                      onClick={() => onPlayAudio(item.book)}
                      className={`py-1.5 px-3 rounded-lg text-[9px] font-semibold border flex items-center gap-1 cursor-pointer transition-all ${
                        isDarkMode
                          ? "border-zinc-800 hover:bg-zinc-805 text-zinc-350"
                          : "border-zinc-300 hover:bg-zinc-100 text-zinc-950"
                      }`}
                      title="Play Audio Play"
                    >
                      <Headphones className="w-3 h-3" />
                      Listen
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
