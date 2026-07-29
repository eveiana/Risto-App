/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Bookmark, Star, ArrowLeft, BookOpen, Clock, AlertCircle } from "lucide-react";
import BookCover from "./BookCover";
import RistoLogo from "./RistoLogo";

export default function BookDetailView({ book, onRead, onBack, isDarkMode, isAdmin = false, onDeleteBook }) {
  // Favorites toggle states
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Admin Delete state
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Rating Modal state (Screenshot 2)
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [ratingCompleted, setRatingCompleted] = useState(false);

  // Toast notifications for detail interactions
  const [toastMessage, setToastMessage] = useState(null);

  // Show the rating popup (Screenshot 2) automatically after 2.5 seconds as a rich user demonstration!
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRatingModal(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    triggerToast(!isLiked ? "Saved to your favorites!" : "Removed from favorites.");
  };

  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    triggerToast(!isBookmarked ? "Chapter bookmarked!" : "Bookmark removed.");
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setRatingCompleted(true);
    triggerToast(`Thank you for rating us ${rating} stars!`);
    setTimeout(() => {
      setShowRatingModal(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`min-h-full w-full flex flex-col ${isDarkMode ? "bg-black text-white" : "bg-white text-zinc-950"}`}
      id="book-detail-container"
    >
      {/* Toast Notification element */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 border border-zinc-800 text-white text-xs px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full">
        {/* Back and title bar navigation overlay inside shell */}
        <div className="absolute top-4 left-4 z-30">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md flex items-center justify-center text-white cursor-pointer shadow-md border border-white/10"
            title="Go Back"
            id="detail-back-button"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Poster Banner Graphic (Screenshot 3) */}
        <div className="relative w-full h-[40vh] md:h-[320px] overflow-hidden select-none">
          <img
            src={book.coverUrl}
            onError={(e) => {
              if (book.type === "disruptive") {
                e.currentTarget.src = "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80";
              } else if (book.type === "bonbon") {
                e.currentTarget.src = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80";
              } else if (book.type === "onyis") {
                e.currentTarget.src = "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80";
              } else {
                e.currentTarget.src = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80";
              }
            }}
            alt={book.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top"
          />
          {/* Subtle cinematic gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Title and Detail description card info (Screenshot 3) */}
        <div className="px-5 py-4 space-y-4">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-sans font-bold tracking-tight text-white leading-tight">
              {book.title}
            </h1>
            <div className="flex items-center gap-2" id="detail-genre-tags">
              {(book.genres || ["Folklore"]).map((g) => (
                <span
                  key={g}
                  className="text-[9px] bg-white/10 backdrop-blur-sm text-zinc-300 font-mono tracking-widest uppercase font-semibold px-2 py-0.5 rounded-md border border-white/5"
                >
                  {g}
                </span>
              ))}
              <span className="text-[9px] text-zinc-400 font-mono flex items-center gap-1 ml-auto">
                <Clock className="w-3 h-3" /> 12 min read
              </span>
            </div>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-full opacity-90">
            {book.description}
          </p>

          {/* Core Row of Action button items (Screenshot 3) */}
          <div className="flex items-center gap-3 pt-2" id="detail-action-buttons">
            {/* Read Now pill button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => onRead(book)}
              className="flex-1 bg-white hover:bg-zinc-100 text-black font-extrabold text-xs py-2.5 px-5 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform"
              id="detail-action-read-now"
            >
              <BookOpen className="w-4 h-4 stroke-[2.5]" />
              Read Now
            </motion.button>

            {/* Heart wishlist/favorites quick toggle */}
            <button
              onClick={handleLikeToggle}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isLiked
                  ? "bg-red-600 border-red-600 text-white"
                  : "border-zinc-800 bg-zinc-955/40 hover:border-zinc-500 text-white"
              }`}
              title="Add to Wishlist"
              id="detail-action-heart"
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>

            {/* Bookmark page save toggle */}
            <button
              onClick={handleBookmarkToggle}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                isBookmarked
                  ? "bg-indigo-600 border-indigo-600 text-white"
                  : "border-zinc-800 bg-zinc-955/40 hover:border-zinc-500 text-white"
              }`}
              title="Bookmark Chapter"
              id="detail-action-bookmark"
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
          </div>

          {/* Admin Delete Section for Registered/Custom Books */}
          {isAdmin && (book.isCustom || book.docId || book.userId) && (
            <div className="pt-2" id="detail-admin-delete-section">
              {confirmDelete ? (
                <div className="flex gap-2.5 items-center bg-red-950/40 border border-red-900/40 p-3 rounded-2xl animate-fade-in">
                  <p className="text-xs text-red-200 font-sans font-semibold">Are you sure you want to delete this manuscript?</p>
                  <button
                    onClick={() => {
                      onDeleteBook(book.id, book.docId);
                      setConfirmDelete(false);
                    }}
                    className="ml-auto px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-mono font-bold uppercase rounded-lg shadow cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-mono font-bold uppercase rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="w-full bg-red-950/20 hover:bg-red-900/20 text-red-400 border border-red-900/30 font-bold text-[11px] py-2.5 px-5 rounded-full flex items-center justify-center gap-2 cursor-pointer transition-colors uppercase tracking-wider"
                  id="detail-action-admin-delete"
                >
                  Delete Custom Book / Manuscript
                </button>
              )}
            </div>
          )}

          {/* Chapters Horizontal list of covers (Screenshot 3) */}
          <div className="space-y-3 pt-4">
            <h3 className="text-sm font-sans font-bold tracking-tight text-white uppercase opacity-80">
              Chapters &amp; Pages
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar" style={{ scrollbarWidth: "none" }}>
              {book.pages && Array.from({ 
                length: (book.isPdf && book.pageImages && book.pageImages.length > 0)
                  ? book.pageImages.length
                  : book.pages.length
              }).map((_, index) => {
                const page = book.pages[index];
                let cardTitle = `Page ${index + 1}`;
                let cardSubtitle = "";
                let coverType = book.type || "sondeka"; // Default to book's main cover style

                if (typeof page === "string") {
                  const firstLine = page.trim().split("\n")[0];
                  if (firstLine && (firstLine.toLowerCase().startsWith("chapter") || firstLine.toLowerCase().startsWith("introduction"))) {
                    cardTitle = firstLine;
                  } else {
                    cardTitle = `Chapter ${index + 1}`;
                    cardSubtitle = firstLine.substring(0, 16) + "...";
                  }
                } else if (typeof page === "object") {
                  if (page.type === "cover") {
                    cardTitle = "Cover Page";
                  } else if (page.type === "credits") {
                    cardTitle = "Credits";
                  } else if (page.type === "promo") {
                    cardTitle = "More Books";
                  } else if (page.type === "coloring") {
                    cardTitle = "Interactive Paint";
                  } else {
                    cardTitle = `Page ${index + 1}`;
                  }
                }

                return (
                  <div
                    key={index}
                    onClick={() => {
                      onRead(book, index);
                      triggerToast(`Launching ${cardTitle}...`);
                    }}
                    className="w-24 shrink-0 flex flex-col gap-1.5 cursor-pointer group"
                    id={`chapter-card-${index}`}
                  >
                    <div className="w-24 h-[120px] rounded-xl overflow-hidden shadow-md group-hover:scale-102 transition-transform relative">
                      <BookCover type={coverType} coverUrl={book.coverUrl} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/75 text-white text-[8px] font-mono px-1.5 py-0.5 rounded shadow">
                        p. {index + 1}
                      </div>
                    </div>
                    <span className="text-[10px] text-zinc-300 font-sans font-semibold mt-1 text-center truncate w-full" title={cardTitle}>
                      {cardTitle}
                    </span>
                    {cardSubtitle && (
                      <span className="text-[8px] text-zinc-500 font-mono text-center truncate w-full">
                        {cardSubtitle}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Similar titles row (Screenshot 3) */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-sans font-bold tracking-tight text-white uppercase opacity-80">
                Similar titles
              </h3>
              <button
                onClick={() => setShowRatingModal(true)}
                className="text-[10px] text-indigo-400 hover:underline font-mono"
                id="manual-rating-trigger"
              >
                ⭐ Rate story
              </button>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar" style={{ scrollbarWidth: "none" }}>
              <div
                onClick={() => triggerToast("Loading alternative cosmic chronicles...")}
                className="w-24 shrink-0 flex flex-col gap-1 cursor-pointer group"
              >
                <div className="w-24 h-[120px] rounded-xl overflow-hidden shadow-md">
                  <BookCover type="bonbon" />
                </div>
                <span className="text-[9px] text-zinc-500 font-mono text-center truncate mt-0.5">Dessert Tales</span>
              </div>

              <div
                onClick={() => triggerToast("Loading sound waves series...")}
                className="w-24 shrink-0 flex flex-col gap-1 cursor-pointer group"
              >
                <div className="w-24 h-[120px] rounded-xl overflow-hidden shadow-md">
                  <BookCover type="disruptive" />
                </div>
                <span className="text-[9px] text-zinc-500 font-mono text-center truncate mt-0.5">Disruptive Sound</span>
              </div>

              <div
                onClick={() => triggerToast("Launching Creative Sondeka Awards...")}
                className="w-24 shrink-0 flex flex-col gap-1 cursor-pointer group"
              >
                <div className="w-24 h-[120px] rounded-xl overflow-hidden shadow-md">
                  <BookCover type="sondeka" />
                </div>
                <span className="text-[9px] text-zinc-500 font-mono text-center truncate mt-0.5">VR Nairobi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== SCREENSHOT 2: "Enjoying Risto? Rate Us" Popup overlay modal ==================== */}
      <AnimatePresence>
        {showRatingModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-xs"
            id="rating-modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="w-full max-w-[280px] bg-white text-zinc-950 rounded-[2rem] p-6 text-center shadow-2xl relative border border-zinc-100 flex flex-col items-center gap-4"
              id="rating-modal-card"
            >
              {/* Brand Header Icon */}
              <div className="flex items-center select-none" id="rating-brand-logo">
                <RistoLogo size="custom" className="h-6 w-auto" isDarkTheme={false} />
              </div>

              {/* Central Information */}
              <div className="space-y-1">
                <h3 className="text-lg font-sans font-bold text-black tracking-tight leading-none" id="rating-title">
                  Enjoying Risto?
                </h3>
                <p className="text-xs text-zinc-500 font-sans" id="rating-subtitle">
                  Tap a star to rate us.
                </p>
              </div>

              {/* Star Selection Row (Screenshot 2 style) */}
              <div className="flex items-center justify-center gap-2 py-1" id="rating-stars-row">
                {[1, 2, 3, 4, 5].map((starIdx) => {
                  const isGold = starIdx <= (hoveredRating || selectedRating);
                  return (
                    <button
                      key={starIdx}
                      onClick={() => handleStarClick(starIdx)}
                      onMouseEnter={() => setHoveredRating(starIdx)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className={`cursor-pointer transition-all ${
                        isGold ? "scale-110 text-amber-400" : "text-zinc-300 hover:text-amber-300"
                      }`}
                      title={`Rate ${starIdx} Stars`}
                    >
                      <Star className="w-6 h-6 fill-current stroke-[2]" />
                    </button>
                  );
                })}
              </div>

              {/* Action dismissing buttons */}
              <div className="w-full pt-1">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="w-full bg-black text-white hover:bg-zinc-800 text-xs font-bold font-sans py-3 px-6 rounded-full transition-colors cursor-pointer"
                  id="rating-modal-notnow"
                >
                  Not now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
