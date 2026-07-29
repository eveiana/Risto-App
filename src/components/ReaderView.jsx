/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useContext, useRef } from "react";
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FirebaseContext } from '../contexts/FirebaseContext';
import { OperationType, handleFirestoreError } from '../lib/firebaseError';
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Type, Layers } from "lucide-react";
import mngwanaCover from "../assets/images/mng.png";
import ComicChapterOne from "./ComicChapterOne";
import MzeeNdotoPageRenderer from "./MzeeNdotoPageRenderer";

export default function ReaderView({ book, initialPage = 0, onBack, isDarkMode, onReadAnotherBook }) {
  const { user } = useContext(FirebaseContext) || {};
  const isComic = book.genres && (book.genres.includes("Comic") || book.genres.includes("Action"));
  const [readMode, setReadMode] = useState(isComic ? "webtoon" : "ebook");
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [viewStyle, setViewStyle] = useState("single"); // "single" for page-by-page, "scroll" for continuous
  const [fontSizeClass, setFontSizeClass] = useState("text-lg");
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    return () => {
      const duration = (Date.now() - startTimeRef.current) / 1000;
      if (user && book && book.id) {
        const logRef = doc(db, 'reading_logs', `${user.uid}_${book.id}_${startTimeRef.current}`);
        setDoc(logRef, {
          userId: user.uid,
          bookId: book.id,
          duration: duration,
          timestamp: new Date()
        }).catch(error => {
          handleFirestoreError(error, OperationType.WRITE, `reading_logs/${user.uid}_${book.id}_${startTimeRef.current}`);
        });
      }
    };
  }, []);

  useEffect(() => {
    if (user && book && book.id) {
      const progressRef = doc(db, 'reading_progress', `${user.uid}_${book.id}`);
      setDoc(progressRef, {
        userId: user.uid,
        chapterId: book.id,
        progress: currentPage + 1,
      }, { merge: true }).catch(error => {
        handleFirestoreError(error, OperationType.WRITE, `reading_progress/${user.uid}_${book.id}`);
      });
    }
  }, [currentPage, user, book]);

  const totalPages = (book.isPdf && book.pageImages && book.pageImages.length > 0)
    ? book.pageImages.length
    : book.pages.length;
  const containerRef = useRef(null);

  const scrollToPage = (index) => {
    const el = containerRef.current?.querySelector(`#story-page-block-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(index);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      if (viewStyle === "single") {
        setCurrentPage(currentPage + 1);
      } else {
        scrollToPage(currentPage + 1);
      }
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      if (viewStyle === "single") {
        setCurrentPage(currentPage - 1);
      } else {
        scrollToPage(currentPage - 1);
      }
    }
  };

  const cycleFontSize = () => {
    if (fontSizeClass === "text-base") setFontSizeClass("text-lg");
    else if (fontSizeClass === "text-lg") setFontSizeClass("text-xl");
    else setFontSizeClass("text-base");
  };

  // Handle scrolling to the exact selected page index on load (Continuous eBook mode only)
  useEffect(() => {
    if (initialPage > 0 && readMode === "ebook" && viewStyle === "scroll") {
      const scrollTimer = setTimeout(() => {
        scrollToPage(initialPage);
      }, 350); // Small, seamless delay for container rendering
      return () => clearTimeout(scrollTimer);
    }
  }, [initialPage, readMode, viewStyle]);

  useEffect(() => {
    if (readMode !== "ebook" || viewStyle !== "scroll" || !containerRef.current) return;

    const observerOptions = {
      root: containerRef.current,
      rootMargin: "-15% 0px -25% 0px",
      threshold: 0.1,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = parseInt(entry.target.getAttribute("data-page-index"), 10);
          if (!isNaN(index)) {
            setCurrentPage(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    const pageElements = containerRef.current.querySelectorAll(".story-page-block");
    pageElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [readMode, viewStyle, totalPages, containerRef.current]);

  // Structured Webtoon Panel graphics mock generator
  const webtoonPanels = [
    {
      chapter: "CHAPTER 1",
      title: "The Golden Sunrise",
      soundEffect: "WHOOSH!",
      visualBg: "bg-gradient-to-b from-orange-500/30 via-indigo-950/40 to-black/85",
      graphicNode: (
        <div className="w-full relative h-48 rounded-2xl overflow-hidden border border-orange-500/25 bg-gradient-to-tr from-amber-600 via-pink-600 to-indigo-950 flex items-center justify-center">
          <img
            src={mngwanaCover}
            alt="Captain Mngwana watches Nairobi"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-top opacity-90 brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
          <div className="absolute bottom-0 w-full h-1/3 bg-black/55 flex items-end justify-center pb-2">
            <span className="font-mono text-[8.5px] text-zinc-300 tracking-widest uppercase">KICC RISTO WATCH</span>
          </div>
        </div>
      ),
      dialogue: "(Thinking) Nairobi rises in a golden haze... guard the real stories.",
      narration: "From the heights of the KICC Tower, Captain Mngwana watches the bustling city of Nairobi."
    },
    {
      chapter: "CHAPTER 2",
      title: "The False Preacher",
      soundEffect: "BZZT! BZZT!",
      visualBg: "bg-gradient-to-b from-violet-950/45 via-black/40 to-black/90",
      graphicNode: (
        <div className="w-full relative h-48 rounded-2xl overflow-hidden border border-purple-500/25 bg-gradient-to-tr from-indigo-950 via-purple-900 to-zinc-900 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" />
          <span className="text-6xl select-none sm:text-7xl animate-pulse">📢</span>
          <div className="absolute top-4 left-4 bg-white text-black text-[9px] font-bold p-2 rounded-2xl rounded-bl-none shadow-md max-w-[140px] leading-tight select-none">
            "Why submit to the real sun when my twilight can be whatever you desire?"
          </div>
          <div className="absolute bottom-2 right-2 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase rotate-3">
            Msema Wongo
          </div>
        </div>
      ),
      dialogue: "He fights not with fire, but with counterfeit memories and distorted history.",
      narration: "Msema Wongo plants fabricated stories in local squares using his gold megaphone."
    },
    {
      chapter: "CHAPTER 3",
      title: "The Nairobi Café Alliance",
      soundEffect: "CLINK!",
      visualBg: "bg-gradient-to-b from-emerald-950/40 via-zinc-950/60 to-black/90",
      graphicNode: (
        <div className="w-full relative h-48 rounded-2xl overflow-hidden border border-emerald-500/25 bg-gradient-to-t from-zinc-900 via-stone-850 to-emerald-900 flex items-center justify-center">
          <img
            src={mngwanaCover}
            alt="Captain Mngwana with Kilili"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-35 filter grayscale scale-110"
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 flex gap-4 items-center">
            <span className="text-5xl select-none filter drop-shadow">☕</span>
            <span className="text-4xl select-none filter drop-shadow">📓</span>
          </div>
          <div className="absolute bottom-4 left-6 bg-amber-500 text-black font-extrabold text-[8px] px-2 py-0.5 rounded shadow">
            Kilili's Ledger
          </div>
        </div>
      ),
      dialogue: "Mngwana, the youngsters are swapping real ancestors' soil for his virtual illusions!",
      narration: "At a street cafe near Tom Mboya Street, Captain Mngwana meets his old companion, Kilili."
    },
    {
      chapter: "CHAPTER 4",
      title: "The Battle of Central Library",
      soundEffect: "KRAAKKK!",
      visualBg: "bg-gradient-to-b from-indigo-950/50 via-yellow-950/30 to-black/95",
      graphicNode: (
        <div className="w-full relative h-56 rounded-2xl overflow-hidden border-2 border-yellow-400/30 bg-gradient-to-b from-[#e3fc02] via-orange-500 to-black flex flex-col items-center justify-center p-4">
          <img
            src={mngwanaCover}
            alt="Captain Mngwana Power Battle"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-75 mix-blend-screen brightness-120"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative z-10 flex gap-6 items-center">
            <div className="relative w-14 h-14 rounded-full border border-white/20 overflow-hidden bg-black/40">
              <img
                src={mngwanaCover}
                alt="Captain Mngwana face avatar"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <span className="text-4xl text-white font-mono font-black animate-pulse drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] tracking-tighter">VS</span>
            <span className="text-5xl select-none animate-bounce filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">📢</span>
          </div>
          
          <div className="relative z-10 bg-red-600 text-white font-black text-center text-[10px] py-1 px-4 rounded-full mt-4 border border-red-400 shadow-md">
            THE REAL NAIROBI REMEMBERS!
          </div>
        </div>
      ),
      dialogue: "Stories belong to the lions who lived them, not to the tricksters who paint them!",
      narration: "Captain Mngwana overrides the archive server with generations of songs, shattering Wongo's megaphone!"
    }
  ];

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 180 }}
      className={`absolute inset-0 z-30 flex flex-col ${
        isDarkMode ? "bg-black text-white" : "bg-zinc-50 text-black"
      }`}
      id="reader-view-overlay"
    >
      {/* Reader View Header */}
      <div
        className={`flex items-center justify-between px-4 h-15 border-b shrink-0 ${
          isDarkMode ? "border-zinc-900 bg-black" : "border-zinc-200 bg-white"
        }`}
        id="reader-view-header"
      >
        <button
          onClick={onBack}
          className="flex items-center justify-center p-2 hover:opacity-80 cursor-pointer select-none"
          id="reader-back-btn"
          aria-label="Exit reader view"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Layout Mode Toggler Segmented Control */}
        {isComic ? (
          <div className="flex bg-zinc-900/60 p-1 rounded-lg border border-zinc-800" id="reader-mode-toggle">
            <button
              onClick={() => setReadMode("ebook")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all select-none ${
                readMode === "ebook"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              id="tab-ebook-reader"
            >
              <BookOpen className="w-3.5 h-3.5" />
              eBook
            </button>
            <button
              onClick={() => setReadMode("webtoon")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold cursor-pointer transition-all select-none ${
                readMode === "webtoon"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              id="tab-webtoon-viewer"
            >
              <Layers className="w-3.5 h-3.5" />
              Webtoon
            </button>
          </div>
        ) : (
          <div className="flex bg-zinc-900/60 p-1 rounded-lg border border-zinc-850" id="reader-style-toggle">
            <button
              type="button"
              onClick={() => setViewStyle("single")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-sans uppercase font-bold cursor-pointer transition-all select-none ${
                viewStyle === "single"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              id="tab-single-page"
            >
              Page-by-Page
            </button>
            <button
              type="button"
              onClick={() => setViewStyle("scroll")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-sans uppercase font-bold cursor-pointer transition-all select-none ${
                viewStyle === "scroll"
                  ? "bg-white text-black shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              id="tab-continuous-scroll"
            >
              Continuous
            </button>
          </div>
        )}

        {/* Font size toggler */}
        {readMode === "ebook" && !book.isPdf ? (
          <button
            onClick={cycleFontSize}
            className={`flex items-center gap-1 p-1 px-2.5 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
              isDarkMode
                ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300"
                : "border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
            }`}
            id="reader-font-btn"
            title="Adjust Text Size"
          >
            <Type className="w-3.5 h-3.5" />
            {fontSizeClass === "text-base" ? "Sm" : fontSizeClass === "text-lg" ? "Md" : "Lg"}
          </button>
        ) : book.isPdf ? (
          <div className="flex items-center gap-1 p-1 px-2.5 rounded-md border text-[10px] font-mono font-bold tracking-wider text-amber-500 bg-amber-500/10 border-amber-500/20" id="reader-pdf-badge">
            ORIGINAL PDF
          </div>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center select-none border border-zinc-850/30 rounded-full" id="webtoon-scroll-status">
            <span className="text-[10px] font-mono font-bold text-teal-400 shrink-0">SCROLL</span>
          </div>
        )}
      </div>

      {/* RENDER MODE: eBook Continuous Scrollable Layout */}
      {readMode === "ebook" && (
        <div 
          ref={containerRef}
          className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center selection:bg-indigo-500 selection:text-white relative scroll-smooth" 
          id="ebook-canvas-wrapper"
        >
          {/* Cover & General Metadata Section */}
          <div className="max-w-2xl mx-auto w-full mb-8 text-center" id="ebook-info-banner">
            <div className="flex flex-wrap justify-center gap-1.5 mb-3">
              {book.genres.map((g) => (
                <span
                  key={g}
                  className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2.5 py-0.5 rounded-full ${
                    isDarkMode
                      ? "bg-zinc-900 border border-zinc-800 text-zinc-300"
                      : "bg-zinc-200 border border-zinc-300 text-zinc-700"
                  }`}
                >
                  {g}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-serif font-black tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">
              {book.title}
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              By {book.author} · {viewStyle === "single" ? "Page-by-Page Mode" : "Scroll Down to Read Continuous Story"}
            </p>
          </div>

          {/* Book Pages Container */}
          <div className="space-y-8 max-w-2xl mx-auto w-full pb-28" id="ebook-page-stream">
            {viewStyle === "single" ? (
              <div 
                id={`story-page-block-${currentPage}`}
                className={`story-page-block transition-all duration-300 rounded-2xl p-5 sm:p-8 border ${
                  isDarkMode 
                    ? "bg-zinc-900/40 border-zinc-850/80 text-zinc-100 shadow-xl backdrop-blur-sm" 
                    : "bg-white border-zinc-200 text-zinc-900 shadow-sm"
                }`}
              >
                {/* Page Indicator Tag */}
                <div className="flex items-center justify-between pb-3 mb-6 border-b border-zinc-800/10 dark:border-zinc-200/10 font-mono text-[9px] opacity-40">
                  <span className="uppercase tracking-widest">{book.title}</span>
                  <span>Page {currentPage + 1} of {totalPages}</span>
                </div>

                {book.isPdf ? (
                  <div className="w-full flex justify-center items-center overflow-hidden py-1">
                    <img
                      src={book.pageImages?.[currentPage] || book.coverUrl}
                      alt={`Page ${currentPage + 1}`}
                      className="w-full h-auto object-contain max-h-[82vh] mx-auto rounded-md shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : typeof book.pages[currentPage] === "object" ? (
                  <MzeeNdotoPageRenderer
                    page={book.pages[currentPage]}
                    fontSizeClass={fontSizeClass}
                    isDarkMode={isDarkMode}
                    pageImage={book.pageImages?.[currentPage]}
                    onReadPromoBook={onReadAnotherBook}
                  />
                ) : (
                  <>
                    <div className="mb-4">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-500 uppercase block">
                        CHAPTER {currentPage + 1}
                      </span>
                    </div>
                    {book.pageImages && book.pageImages[currentPage] && (
                      <div className="w-full mb-6 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                        <img
                          src={book.pageImages[currentPage]}
                          alt={`Page ${currentPage + 1}`}
                          className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                    <div
                      className={`font-serif leading-relaxed text-left whitespace-pre-line select-text ${fontSizeClass} ${
                        isDarkMode ? "text-zinc-200" : "text-zinc-800"
                      }`}
                    >
                      {book.pages[currentPage]}
                    </div>
                  </>
                )}
              </div>
            ) : (
              Array.from({ length: totalPages }).map((_, index) => {
                const page = book.pages[index];
                return (
                  <div 
                    key={index} 
                    id={`story-page-block-${index}`}
                    data-page-index={index}
                    className={`story-page-block transition-all duration-300 rounded-2xl p-5 sm:p-8 border ${
                      isDarkMode 
                        ? "bg-zinc-900/40 border-zinc-850/80 text-zinc-100 shadow-xl backdrop-blur-sm" 
                        : "bg-white border-zinc-200 text-zinc-900 shadow-sm"
                    }`}
                  >
                    {/* Page Indicator Tag */}
                    <div className="flex items-center justify-between pb-3 mb-6 border-b border-zinc-800/10 dark:border-zinc-200/10 font-mono text-[9px] opacity-40">
                      <span className="uppercase tracking-widest">{book.title}</span>
                      <span>Page {index + 1} of {totalPages}</span>
                    </div>

                    {book.isPdf ? (
                      <div className="w-full flex justify-center items-center overflow-hidden py-1">
                        <img
                          src={book.pageImages?.[index] || book.coverUrl}
                          alt={`Page ${index + 1}`}
                          className="w-full h-auto object-contain max-h-[82vh] mx-auto rounded-md shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : typeof page === "object" ? (
                      <MzeeNdotoPageRenderer
                        page={page}
                        fontSizeClass={fontSizeClass}
                        isDarkMode={isDarkMode}
                        pageImage={book.pageImages?.[index]}
                        onReadPromoBook={onReadAnotherBook}
                      />
                    ) : (
                      <>
                        {/* Sub-header inside text-only block */}
                        <div className="mb-4">
                          <span className="text-[10px] font-mono font-bold tracking-widest text-indigo-500 uppercase block">
                            CHAPTER {index + 1}
                          </span>
                        </div>
                        {book.pageImages && book.pageImages[index] && (
                          <div className="w-full mb-6 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-md">
                            <img
                              src={book.pageImages[index]}
                              alt={`Page ${index + 1}`}
                              className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <div
                          className={`font-serif leading-relaxed text-left whitespace-pre-line select-text ${fontSizeClass} ${
                            isDarkMode ? "text-zinc-200" : "text-zinc-800"
                          }`}
                        >
                          {page}
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Floating Navigation & Progress Controls */}
          <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 max-w-md w-[calc(100%-2rem)] mx-auto p-4 mb-4 rounded-2xl border backdrop-blur-md shadow-2xl z-20 flex flex-col gap-2.5 transition-all duration-300 ${
            isDarkMode 
              ? "bg-black/85 border-zinc-800 text-white shadow-indigo-500/5" 
              : "bg-white/95 border-zinc-200 text-black shadow-zinc-400/20"
          }`} id="ebook-floating-controls">
            {/* Progress bar */}
            <div className="w-full bg-zinc-800/20 dark:bg-zinc-800/50 h-1 rounded-full overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-40">Reading Progress</span>
                <span className="text-xs font-semibold font-mono">
                  Page {currentPage + 1} of {totalPages}
                </span>
              </div>

              {/* Navigation Arrows & Jump Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPage === 0}
                  onClick={handlePrev}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    currentPage === 0
                      ? "opacity-30 cursor-not-allowed border-transparent"
                      : isDarkMode
                      ? "border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-white"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 text-black"
                  }`}
                  id="reader-prev-btn"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Quick Page Jump Selector */}
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-200/50 dark:border-zinc-800/50">
                  <span className="text-[9px] font-mono opacity-50 mr-0.5">JUMP</span>
                  <select
                    value={currentPage}
                    onChange={(e) => {
                      const idx = parseInt(e.target.value, 10);
                      if (viewStyle === "single") {
                        setCurrentPage(idx);
                      } else {
                        scrollToPage(idx);
                      }
                    }}
                    className="bg-transparent text-xs font-mono font-bold border-none outline-none focus:ring-0 cursor-pointer text-indigo-500 dark:text-indigo-400"
                    id="page-jump-dropdown"
                  >
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <option key={i} value={i} className={isDarkMode ? "bg-zinc-950 text-white" : "bg-white text-black"}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={handleNext}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    currentPage === totalPages - 1
                      ? "opacity-30 cursor-not-allowed border-transparent"
                      : isDarkMode
                      ? "border-zinc-800 bg-zinc-950 hover:border-zinc-700 text-white"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 text-black"
                  }`}
                  id="reader-next-btn"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER MODE: Webtoon Continuously Scrollable Graphic Canvas Layout */}
      {readMode === "webtoon" && (
        <div className={`flex-1 overflow-y-auto ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`} id="webtoon-canvas-wrapper">
          
          {/* Top cover header of the Webtoon viewer */}
          <div className={`w-full py-8 px-5 text-center border-b ${isDarkMode ? "border-zinc-900" : "border-zinc-200"}`}>
            <h1 className="text-2xl font-serif font-black tracking-tight leading-tight max-w-sm mb-1">
              {book.title}
            </h1>
            <p className={`text-[11px] font-mono ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
              Story: {book.author} · Graphic layout: Continuous
            </p>
          </div>

          {/* CHAPTER ONE COMIC PAGES (As requested by user) */}
          {isComic && <ComicChapterOne />}

          {/* Heading for subsequent chapters/storylines */}
          <div className={`pt-10 pb-4 px-5 text-center border-t border-b ${isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-zinc-100 border-zinc-200"}`}>
            <h3 className="text-lg font-serif font-black uppercase tracking-tight">
              Chapter Two: Vs. Msema Wongo
            </h3>
            <p className="text-[10px] font-mono text-zinc-500 mt-1 text-center">
              Scroll down to witness the battle of Central Library!
            </p>
          </div>

          {/* Webtoon Panels stream */}
          <div className="p-4 space-y-12 max-w-md mx-auto" id="webtoon-panels-list">
            {webtoonPanels.map((panel, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10px" }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className={`rounded-xl p-5 border ${isDarkMode ? "border-zinc-800" : "border-zinc-200"}`}
                id={`webtoon-panel-${idx}`}
              >
                {/* Panel Chapter & Title Header info */}
                <div className="flex justify-between items-center mb-3.5 select-none" id={`webtoon-panel-header-${idx}`}>
                  <span className={`text-[9px] font-mono font-bold tracking-widest uppercase ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                    {panel.chapter}
                  </span>
                  <span className="text-xs font-sans font-semibold tracking-tight">
                    {panel.title}
                  </span>
                </div>

                {/* Main Comic Illustrated Graphic Node panel markup */}
                <div className="my-3.5 relative" id={`webtoon-graphic-box-${idx}`}>
                  {panel.graphicNode}
                </div>

                {/* Speech dialogue layout box */}
                <div className={`border p-3 rounded-lg my-3 flex items-start gap-2 max-w-full ${isDarkMode ? "bg-zinc-900 border-zinc-800" : "bg-zinc-100 border-zinc-200"}`}>
                  <span className="text-base">💬</span>
                  <p className={`text-[11.5px] font-sans font-medium tracking-wide leading-relaxed italic ${isDarkMode ? "text-emerald-400" : "text-emerald-700"}`}>
                    {panel.dialogue}
                  </p>
                </div>

                {/* Third-party narrative block */}
                <p className={`text-[12.5px] font-serif font-light leading-relaxed pt-1.5 text-center border-t ${isDarkMode ? "text-zinc-300 border-zinc-800" : "text-zinc-700 border-zinc-200"}`}>
                  {panel.narration}
                </p>
              </motion.div>
            ))}
          </div>

          {/* End of Webtoon footer info container */}
          <div className={`py-14 px-5 text-center border-t ${isDarkMode ? "bg-zinc-950 border-zinc-900" : "bg-zinc-100 border-zinc-200"}`}>
            <span className="text-3xl mb-3 select-none text-center">🦁</span>
            <h3 className="text-sm font-sans font-black tracking-tight uppercase select-none">
              To be continued...
            </h3>
            <p className="text-[10px] font-mono text-zinc-500 mt-1 max-w-xs text-center">
              Mngwana continues his noble defense. Share this Nairobi risto with your friends!
            </p>
            <button
              onClick={onBack}
              className={`mt-6 py-2.5 px-6 font-sans font-bold text-xs rounded-lg transition-transform hover:scale-103 select-none active:scale-97 cursor-pointer ${isDarkMode ? "bg-white text-black" : "bg-black text-white"}`}
            >
              Back to library
            </button>
          </div>

        </div>
      )}
    </motion.div>
  );
}
