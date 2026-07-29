/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Sparkles, BookOpen, Heart, RefreshCw, Palette, X, Info } from "lucide-react";
import mzeeNdotoCover from "../assets/images/mzee ndoto.png";
import mamaOnyisCover from "../assets/images/mama onyis.png";
import jebetImage from "../assets/images/jebet .png";
import misadventureImage from "../assets/images/misadventure.png";
import babaPickupImage from "../assets/images/baba pickup.png";
import ndotoPage1 from "../assets/images/ndoto_page-0001.jpg";
import ndotoPage3 from "../assets/images/ndoto_page-0003.jpg";
import ndotoPage4 from "../assets/images/ndoto_page-0004.jpg";
import ndotoPage5 from "../assets/images/ndoto_page-0005.jpg";
import ndotoPage6 from "../assets/images/ndoto_page-0006.jpg";
import ndotoPage7 from "../assets/images/ndoto_page-0007.jpg";
import ndotoPage8 from "../assets/images/ndoto_page-0008.jpg";
import ndotoPage9 from "../assets/images/ndoto_page-0009.jpg";
import ndotoPage10 from "../assets/images/ndoto_page-0010.jpg";

export default function MzeeNdotoPageRenderer({ page, fontSizeClass, isDarkMode, pageImage, onReadPromoBook }) {
  const { type, image, text, title, author, illustrator } = page;

  // State for interactive coloring book page (Page 10)
  const [selectedColor, setSelectedColor] = useState("#f59e0b"); // Default to warm amber
  const [colorFills, setColorFills] = useState({
    background: "#ffffff",
    mzeeSkin: "#ffffff",
    mzeeShirt: "#ffffff",
    mzeeCap: "#ffffff",
    hearth: "#ffffff",
    skillet: "#ffffff",
    chapati: "#ffffff",
    basin: "#ffffff",
    basinChapatis: "#ffffff",
  });

  const [selectedPromoBook, setSelectedPromoBook] = useState(null);

  const handlePartClick = (part) => {
    setColorFills((prev) => ({
      ...prev,
      [part]: selectedColor,
    }));
  };

  const resetColoring = () => {
    setColorFills({
      background: "#ffffff",
      mzeeSkin: "#ffffff",
      mzeeShirt: "#ffffff",
      mzeeCap: "#ffffff",
      hearth: "#ffffff",
      skillet: "#ffffff",
      chapati: "#ffffff",
      basin: "#ffffff",
      basinChapatis: "#ffffff",
    });
  };

  const paletteColors = [
    { name: "Flour/White", value: "#ffffff" },
    { name: "Flame Red", value: "#ef4444" },
    { name: "Gold Chapati", value: "#f59e0b" },
    { name: "Crispy Brown", value: "#78350f" },
    { name: "Forest Basin", value: "#10b981" },
    { name: "Nairobi Sky", value: "#3b82f6" },
    { name: "Warm Charcoal", value: "#374151" },
    { name: "Skin Tone", value: "#b45309" },
  ];

  // Helper to render high-fidelity illustrations
  const renderIllustration = () => {
    if (pageImage) {
      return (
        <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg mb-4">
          <img
            src={pageImage}
            alt={title || "Page illustration"}
            className="w-full h-auto object-contain max-h-[60vh] mx-auto"
            referrerPolicy="no-referrer"
          />
        </div>
      );
    }

    if (page.bookType === "onyis" || image?.startsWith("onyis-")) {
      switch (image) {
        case "onyis-cover":
          return (
            <div className="relative w-full aspect-[3/4] max-h-[50vh] rounded-2xl overflow-hidden shadow-xl border border-purple-500/25 bg-[#581c87] mx-auto select-none">
              <img
                src={mamaOnyisCover}
                alt="Mama Onyis"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          );
        case "onyis-credits":
          return (
            <div className="w-full py-4 border-b border-zinc-800/10 flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center shadow-md mb-2">
                <span className="text-white text-lg font-black font-serif">CG</span>
              </div>
              <span className="text-[9px] font-mono tracking-widest text-zinc-400 font-bold uppercase">
                CREATIVES GARAGE NAIROBI
              </span>
            </div>
          );
        case "onyis-dedication":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 p-8 flex flex-col items-center justify-center min-h-[30vh] select-none">
              <Heart className="w-8 h-8 text-pink-500 mb-3 animate-pulse" />
              <p className="text-sm font-serif italic text-zinc-500 text-center">"To my little girl, you bring me such joy."</p>
            </div>
          );
        case "onyis-stall":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80"
                alt="Mama Onyis Fried Fish Stall"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-onyis":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1544216717-3bbf52512659?auto=format&fit=crop&w=600&q=80"
                alt="Onyis the Clever Boy"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-scaling":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80"
                alt="Scaling fish with closed eyes"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-frying":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80"
                alt="Frying fish with magic music notes"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-lake":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&q=80"
                alt="Lake Victoria Shores"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-queen":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80"
                alt="Mama Onyis, Queen of the Lake"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-bribe":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=600&q=80"
                alt="Bwana Mafisi, greedy businessman bribing politicians"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-sleeping":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1511295742364-92767fa62d9f?auto=format&fit=crop&w=600&q=80"
                alt="Mama Onyis sleeping sad in bed"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-riding":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=600&q=80"
                alt="Riding crocodile back, playing Nyatiti string music"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-destruction":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?auto=format&fit=crop&w=600&q=80"
                alt="Bwana Mafisi crushing stalls with heavy machines"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-meeting":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"
                alt="Confronting Bwana Mafisi with Lake Creatures"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-wave":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=600&q=80"
                alt="A giant hand-shaped tidal wave"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        case "onyis-confused":
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80"
                alt="Mama Onyis waking up on beach, meeting fishermen"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
        default:
          return (
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src={mamaOnyisCover}
                alt="Mama Onyis"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[50vh] mx-auto"
              />
            </div>
          );
      }
    }

    switch (image) {
      case "cover":
        return (
          <div className="relative w-full aspect-[3/4] max-h-[50vh] rounded-2xl overflow-hidden shadow-xl border border-amber-600/20 bg-amber-500 mx-auto select-none">
            <img
              src={mzeeNdotoCover}
              alt="Mzee Ndoto's Chapatis"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        );

      case "credits":
        return (
          <div className="w-full py-4 border-b border-zinc-800/10 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-md mb-2">
              <span className="text-white text-lg font-black font-serif">CG</span>
            </div>
            <span className="text-[9px] font-mono tracking-widest text-zinc-400 font-bold uppercase">
              CREATIVES GARAGE NAIROBI
            </span>
          </div>
        );

      case "green-basin":
        return (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
            <img
              src={ndotoPage3}
              alt="The famous basin of square chapatis"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-h-[50vh] mx-auto"
            />
          </div>
        );

      case "smoke-window":
        return (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
            <img
              src={ndotoPage4}
              alt="Magical aroma drifting"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-h-[50vh] mx-auto"
            />
          </div>
        );

      case "pilau-plate":
        return (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
            <img
              src={ndotoPage5}
              alt="Kenyan spiced pilau feast"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-h-[50vh] mx-auto"
            />
          </div>
        );

      case "red-house":
        return (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
            <img
              src={ndotoPage6}
              alt="The homestead in Machakos"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-h-[50vh] mx-auto"
            />
          </div>
        );

      case "ingredients":
        return (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
            <img
              src={ndotoPage7}
              alt="Secret ingredients"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-h-[50vh] mx-auto"
            />
          </div>
        );

      case "cooking-hearth":
        return (
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
            <img
              src={ndotoPage8}
              alt="Baking on the hearth stove"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-contain max-h-[50vh] mx-auto"
            />
          </div>
        );

      case "other-books": {
        const promoBooks = [
          {
            id: "jebet-the-runner",
            title: "Jebet the Runner",
            tagline: "A heartwarming tale of dreams and running spirits",
            author: "Thayu",
            bgClass: "from-green-50 to-emerald-50 dark:from-emerald-950/20 dark:to-teal-950/25",
            borderClass: "border-emerald-500/25",
            accentColor: "#f97316",
            synopsis: "Jebet is a ten-year-old girl living in the rolling hills of Eldoret. She dreams of running with the speed of the wind, just like her national heroines. Guided by the wisdom of her grandmother and her own fierce determination, Jebet enters her very first school race, discovering that the true magic of running isn't just about winning—it's about finding her own rhythm and spirit.",
            themes: ["Perseverance", "Heritage", "Mentorship", "Self-Belief"],
            coverImage: jebetImage,
            coverSvg: (
              <svg viewBox="0 0 160 220" className="w-full h-full rounded-lg shadow-md select-none">
                <rect width="160" height="220" fill="#f0fdf4" />
                <path d="M0,0 L160,0 L160,80 Q100,60 0,90 Z" fill="#bae6fd" />
                <path d="M0,90 Q50,70 110,85 Q140,80 160,95 L160,220 L0,220 Z" fill="#22c55e" />
                <path d="M0,130 Q80,110 160,140 L160,220 L0,220 Z" fill="#15803d" />
                <path d="M-20,220 L70,140 Q110,135 180,180 L140,220 Z" fill="#b45309" opacity="0.8" />
                <g transform="translate(100, 70)">
                  <path d="M12,45 L25,48 L22,78 L12,78 Z" fill="#111827" />
                  <path d="M14,18 L24,18 L26,45 L10,45 Z" fill="#ef4444" />
                  <rect x="12" y="30" width="12" height="10" fill="#ffffff" />
                  <rect x="15" y="33" width="6" height="4" fill="#111827" />
                  <path d="M17,18 L22,18 L25,8 L19,5 Z" fill="#15803d" />
                  <circle cx="21" cy="0" r="6" fill="#3b2314" />
                  <circle cx="25" cy="-2" r="3" fill="#3b2314" />
                  <path d="M21,6 L21,18" stroke="#3b2314" strokeWidth="2" />
                  <path d="M14,75 L5,100 L-10,110" stroke="#3b2314" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M20,75 L28,95 L40,92" stroke="#3b2314" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <ellipse cx="-10" cy="110" rx="4" ry="2" fill="#9ca3af" />
                  <ellipse cx="40" cy="92" rx="4" ry="2" fill="#9ca3af" />
                  <path d="M12,22 L-2,35 L10,42" stroke="#3b2314" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M24,22 L36,32 L30,44" stroke="#3b2314" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
                <g transform="translate(35, 100)">
                  <path d="M10,20 L22,20 L25,48 L6,48 Z" fill="#2563eb" />
                  <path d="M10,48 L10,68 L5,75" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <path d="M18,48 L22,65 L30,62" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  <circle cx="15" cy="5" r="5.5" fill="#3b2314" />
                  <circle cx="9" cy="2" r="3" fill="#111827" />
                  <circle cx="21" cy="2" r="3" fill="#111827" />
                  <ellipse cx="5" cy="75" rx="3" ry="1.5" fill="#1f2937" />
                  <ellipse cx="30" cy="62" rx="3" ry="1.5" fill="#1f2937" />
                  <path d="M8,22 L0,32 L8,36" stroke="#3b2314" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                  <path d="M20,22 L27,30 L22,38" stroke="#3b2314" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                </g>
                <g transform="translate(10, 12)">
                  <text x="0" y="16" fill="#f97316" fontFamily="sans-serif" fontWeight="900" fontSize="19" letterSpacing="-0.5" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke fill">JEBET</text>
                  <text x="0" y="30" fill="#f97316" fontFamily="sans-serif" fontWeight="900" fontSize="14" letterSpacing="-0.5" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" paintOrder="stroke fill">THE</text>
                  <text x="0" y="46" fill="#f97316" fontFamily="sans-serif" fontWeight="900" fontSize="19" letterSpacing="-0.5" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round" paintOrder="stroke fill">RUNNER</text>
                </g>
                <text x="115" y="208" fill="#15803d" fontFamily="serif" fontSize="9" fontStyle="italic" fontWeight="bold">THAYU</text>
              </svg>
            )
          },
          {
            id: "mama-onyis",
            title: "Mama Onyis",
            tagline: "Secrets of Nairobi's most legendary lakeside culinary magic",
            author: "Thayu",
            bgClass: "from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/25",
            borderClass: "border-indigo-500/25",
            accentColor: "#ec4899",
            synopsis: "In the bustling heart of Nairobi's informal markets, Mama Onyis serves the crunchiest, most flavorful fried tilapia spiced with secret herbs passed down through generations. When a slick corporate restaurant chain sets up next door and threatens her market stall, Mama Onyis and her loyal customers stand together, proving that authentic lakeside culinary traditions, warmth, and love can never be mass-produced.",
            themes: ["Community Solidarity", "Cultural Heritage", "Passion", "Food as Connection"],
            coverImage: mamaOnyisCover,
            coverSvg: (
              <svg viewBox="0 0 160 220" className="w-full h-full rounded-lg shadow-md select-none">
                <defs>
                  <linearGradient id="mamaOnyisSky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e1b4b" />
                    <stop offset="50%" stopColor="#311042" />
                    <stop offset="100%" stopColor="#581c87" />
                  </linearGradient>
                </defs>
                <rect width="160" height="220" fill="url(#mamaOnyisSky)" />
                <path d="M0,90 L160,70 L160,220 L0,220 Z" fill="#475569" opacity="0.3" />
                <line x1="160" y1="40" x2="0" y2="150" stroke="#fef08a" strokeWidth="20" opacity="0.1" />
                <path d="M80,50 C80,10 170,10 170,50 Z" fill="#dc2626" />
                <path d="M80,50 Q125,25 170,50" stroke="#f97316" strokeWidth="1" fill="none" />
                <path d="M100,40 Q135,15 170,50" stroke="#f97316" strokeWidth="1" fill="none" />
                <path d="M120,30 Q145,10 170,50" stroke="#f97316" strokeWidth="1" fill="none" />
                <line x1="130" y1="40" x2="130" y2="150" stroke="#1e2937" strokeWidth="2.5" />
                <g transform="translate(5, 75)">
                  <path d="M50,40 L90,40 L100,100 L40,100 Z" fill="#ec4899" />
                  <ellipse cx="70" cy="12" rx="14" ry="8" fill="#a855f7" />
                  <path d="M58,14 Q70,5 82,14" stroke="#d8b4fe" strokeWidth="1.5" fill="none" />
                  <circle cx="70" cy="22" r="9" fill="#3b2314" />
                  <path d="M66,22 Q70,26 74,22" stroke="#ffffff" strokeWidth="1" fill="none" />
                  <ellipse cx="67" cy="19" rx="1" ry="1.5" fill="#ffffff" />
                  <ellipse cx="73" cy="19" rx="1" ry="1.5" fill="#ffffff" />
                  <path d="M48,42 Q40,55 52,65" stroke="#3b2314" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <path d="M88,42 Q98,55 86,65" stroke="#3b2314" strokeWidth="4" strokeLinecap="round" fill="none" />
                </g>
                <g transform="translate(5, 140)">
                  <circle cx="20" cy="25" r="14" fill="#374151" />
                  <circle cx="20" cy="25" r="12" fill="#ef4444" className="animate-pulse" />
                  <circle cx="20" cy="25" r="7" fill="#f59e0b" />
                  <ellipse cx="20" cy="16" rx="18" ry="4" fill="#111827" />
                </g>
                <path d="M40,140 L150,130 L145,210 L45,210 Z" fill="#1e3a8a" />
                <rect x="52" y="132" width="85" height="15" fill="#e2e8f0" rx="1" transform="rotate(-5, 95, 138)" />
                <ellipse cx="70" cy="138" rx="8" ry="3" fill="#f59e0b" />
                <ellipse cx="90" cy="136" rx="9" ry="3" fill="#f59e0b" />
                <ellipse cx="110" cy="134" rx="8" ry="3" fill="#f59e0b" />
                <g transform="translate(60, 168) rotate(-4)">
                  <text x="0" y="0" fill="#a3e635" fontFamily="cursive, sans-serif" fontWeight="bold" fontSize="12" letterSpacing="0.2">mama onyis</text>
                  <text x="14" y="9" fill="#fef08a" fontFamily="sans-serif" fontSize="5" fontWeight="bold" letterSpacing="0.5">WRITTEN BY THAYU</text>
                </g>
                <g transform="translate(110, 185) rotate(-5)" opacity="0.8">
                  <path d="M0,5 C5,0 15,0 20,4 L24,1 L23,8 L20,6 C15,9 5,9 0,5 Z" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
                  <circle cx="4" cy="4" r="0.5" fill="#ffffff" />
                </g>
              </svg>
            )
          },
          {
            id: "truphena-tales",
            title: "Misadventures of Truphena",
            tagline: "Hilarious, fast-paced tales of a clever village trickster",
            author: "Thayu",
            bgClass: "from-amber-50 to-yellow-50 dark:from-yellow-950/20 dark:to-amber-950/25",
            borderClass: "border-yellow-500/25",
            accentColor: "#ef4444",
            synopsis: "Truphena has a reputation for being the absolute master of mischief in her serene village. From trying to build a homemade wingsuit out of old sugar sacks to chase the village chickens, to cooking up plans that turn the local market completely upside down, Truphena's comical antics bring laughter, chaos, and unexpected life lessons to everyone around him.",
            themes: ["Humour", "Imagination", "Childhood Freedom", "Community Life"],
            coverImage: misadventureImage,
            coverSvg: (
              <svg viewBox="0 0 160 220" className="w-full h-full rounded-lg shadow-md select-none">
                <rect width="160" height="220" fill="#bae6fd" />
                <circle cx="20" cy="40" r="15" fill="#ffffff" opacity="0.6" />
                <circle cx="40" cy="35" r="20" fill="#ffffff" opacity="0.6" />
                <circle cx="130" cy="50" r="22" fill="#ffffff" opacity="0.5" />
                <g transform="translate(5, 110)">
                  <rect x="5" y="25" width="30" height="20" fill="#ca8a04" opacity="0.9" />
                  <polygon points="0,25 20,5 40,25" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
                  <rect x="110" y="25" width="35" height="20" fill="#ca8a04" opacity="0.9" />
                  <polygon points="105,25 127,3 150,25" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
                  <path d="M0,40 C50,35 100,35 160,40 L160,50 L0,50 Z" fill="#b45309" opacity="0.5" />
                </g>
                <path d="M0,150 Q80,140 160,150 L160,220 L0,220 Z" fill="#d97706" />
                <g transform="translate(45, 128)">
                  <path d="M12,18 L32,22 C42,28 45,45 28,40 L10,32 Z" fill="#ffedd5" stroke="#f97316" strokeWidth="1" />
                  <path d="M12,18 L0,14" stroke="#3b2314" strokeWidth="2.5" />
                  <path d="M10,32 L2,52 L-5,54" stroke="#3b2314" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <path d="M22,35 L28,50 L38,48" stroke="#3b2314" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  <circle cx="8" cy="8" r="6" fill="#3b2314" />
                  <path d="M4,10 Q8,13 10,9" stroke="#ffffff" strokeWidth="1" fill="none" />
                  <path d="M12,18 L-8,14 L-15,18" stroke="#3b2314" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </g>
                <g transform="translate(15, 155)">
                  <ellipse cx="14" cy="14" rx="8" ry="6" fill="#ea580c" />
                  <path d="M12,10 C10,5 2,6 6,12" fill="#f97316" stroke="#ea580c" strokeWidth="0.5" />
                  <path d="M16,10 C18,5 26,6 22,12" fill="#f97316" stroke="#ea580c" strokeWidth="0.5" />
                  <path d="M22,14 L28,8 L27,15 Z" fill="#ea580c" />
                  <circle cx="7" cy="10" r="3.5" fill="#ea580c" />
                  <polygon points="5,8 3,10 6,11" fill="#fbbf24" />
                  <path d="M7,7 Q6,3 8,4" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" fill="none" />
                  <line x1="12" y1="20" x2="8" y2="25" stroke="#fbbf24" strokeWidth="1.5" />
                  <line x1="16" y1="20" x2="19" y2="24" stroke="#fbbf24" strokeWidth="1.5" />
                  <path d="M25,22 Q30,18 28,24" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.6" />
                  <circle cx="28" cy="24" r="1.5" fill="#ffffff" opacity="0.5" />
                </g>
                <g transform="translate(10, 15)">
                  <text x="70" y="16" fill="#ef4444" fontFamily="sans-serif" fontWeight="900" fontSize="11" textAnchor="middle" letterSpacing="-0.3" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke fill">MISADVENTURES</text>
                  <text x="70" y="27" fill="#ef4444" fontFamily="sans-serif" fontWeight="900" fontSize="8" textAnchor="middle" stroke="#ffffff" strokeWidth="2" strokeLinejoin="round" paintOrder="stroke fill">OF</text>
                  <text x="70" y="44" fill="#ef4444" fontFamily="sans-serif" fontWeight="900" fontSize="14" textAnchor="middle" letterSpacing="-0.3" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke fill">TRUPHENA</text>
                </g>
                <text x="80" y="208" fill="#111827" fontFamily="serif" fontSize="9" fontStyle="italic" fontWeight="bold" textAnchor="middle">THAYU</text>
              </svg>
            )
          },
          {
            id: "babas-pickup",
            title: "Baba's Pickup",
            tagline: "The adventurous yellow Peugeot rescue machine of Nairobi",
            author: "Thayu",
            bgClass: "from-blue-50 to-sky-50 dark:from-sky-950/20 dark:to-blue-950/25",
            borderClass: "border-sky-500/25",
            accentColor: "#fbbf24",
            synopsis: "Baba's yellow Peugeot pickup is more than just a truck—it's a legendary, mechanical superhero that holds the whole community together. When a heavy rainstorm floods the main road and threatens to cancel the kids' long-awaited school trip, Baba, his high-spirited kids, and the faithful pickup set off on a daring rescue mission across Nairobi, showing that teamwork and courage can conquer any obstacle.",
            themes: ["Ingenuity", "Familial Love", "Resourcefulness", "Adventure"],
            coverImage: babaPickupImage,
            coverSvg: (
              <svg viewBox="0 0 160 220" className="w-full h-full rounded-lg shadow-md select-none">
                <rect width="160" height="220" fill="#38bdf8" />
                <ellipse cx="30" cy="100" rx="30" ry="18" fill="#ffffff" opacity="0.8" />
                <ellipse cx="80" cy="90" rx="45" ry="25" fill="#ffffff" opacity="0.85" />
                <ellipse cx="130" cy="110" rx="35" ry="20" fill="#ffffff" opacity="0.8" />
                <path d="M0,160 Q80,150 160,165 L160,220 L0,220 Z" fill="#4ade80" />
                <g transform="translate(10, 112)">
                  <circle cx="32" cy="62" r="11" fill="#1f2937" />
                  <circle cx="32" cy="62" r="5" fill="#e2e8f0" />
                  <circle cx="112" cy="60" r="11" fill="#1f2937" />
                  <circle cx="112" cy="60" r="5" fill="#e2e8f0" />
                  <path d="M12,30 L55,30 L65,15 L102,15 L105,30 L135,32 L138,55 L8,55 Z" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
                  <path d="M57,28 L64,18 L100,18 L102,28 Z" fill="#111827" />
                  <rect x="4" y="42" width="6" height="10" fill="#9ca3af" />
                  <circle cx="6" cy="45" r="1.5" fill="#fef08a" />
                  <rect x="124" y="36" width="13" height="15" fill="#e11d48" />
                  <rect x="120" y="42" width="16" height="10" fill="#1e2937" />
                  <text x="128" y="49" fill="#ffffff" fontFamily="sans-serif" fontWeight="900" fontSize="5" textAnchor="middle">EUGEO</text>
                  <g transform="translate(68, -14)">
                    <path d="M5,12 L15,12 L18,28 L2,28 Z" fill="#2563eb" />
                    <circle cx="10" cy="5" r="4.5" fill="#3b2314" />
                    <circle cx="8" cy="5" r="1.8" stroke="#ffffff" strokeWidth="0.8" fill="none" />
                    <circle cx="12" cy="5" r="1.8" stroke="#ffffff" strokeWidth="0.8" fill="none" />
                    <line x1="14" y1="14" x2="26" y2="8" stroke="#3b2314" strokeWidth="2.2" strokeLinecap="round" />
                    <polygon points="4,2 10,-3 16,2" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
                  </g>
                  <g transform="translate(108, 12)">
                    <circle cx="4" cy="5" r="3.5" fill="#3b2314" />
                    <path d="M1,8 L7,8 L9,18 L-1,18 Z" fill="#ec4899" />
                    <line x1="5" y1="8" x2="12" y2="1" stroke="#3b2314" strokeWidth="1.5" strokeLinecap="round" />
                  </g>
                </g>
                <g transform="translate(10, 15)">
                  <text x="70" y="16" fill="#facc15" fontFamily="sans-serif" fontWeight="900" fontSize="20" textAnchor="middle" letterSpacing="-0.5" stroke="#dc2626" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke fill">BABA'S</text>
                  <text x="70" y="35" fill="#facc15" fontFamily="sans-serif" fontWeight="900" fontSize="20" textAnchor="middle" letterSpacing="-0.5" stroke="#dc2626" strokeWidth="2.5" strokeLinejoin="round" paintOrder="stroke fill">PICKUP</text>
                </g>
                <text x="80" y="208" fill="#ffffff" fontFamily="serif" fontSize="9" fontStyle="italic" fontWeight="bold" textAnchor="middle">THAYU</text>
              </svg>
            )
          }
        ];

        return (
          <div className="w-full my-4 flex flex-col" id="mzee-promo-container">
            {/* High-fidelity illustrations of the promo page */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 mb-6 bg-zinc-50 dark:bg-zinc-900 select-none">
              <img
                src={ndotoPage9}
                alt="Creatives Garage books catalog"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[40vh] mx-auto"
              />
            </div>

            {/* Bento Interactive Grid */}
            <div className="grid grid-cols-2 gap-4" id="mzee-promo-grid">
              {promoBooks.map((promo) => (
                <button
                  key={promo.id}
                  onClick={() => setSelectedPromoBook(promo)}
                  className={`group relative flex flex-col items-center bg-gradient-to-b ${promo.bgClass} border ${promo.borderClass} p-2 rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-400 active:scale-95`}
                  title={`View details of ${promo.title}`}
                >
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/10 transition-colors pointer-events-none" />
                  
                  <div className="w-full aspect-[4/5] bg-zinc-100 dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm group-hover:shadow-md transition-shadow relative">
                    {promo.coverImage ? (
                      <img
                        src={promo.coverImage}
                        alt={promo.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      promo.coverSvg
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-white/90 dark:bg-zinc-900/90 p-2 rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <Info className="w-4 h-4 text-orange-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-center w-full">
                    <h4 className="text-xs font-serif font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      {promo.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                      By {promo.author}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {/* High-fidelity Details Modal */}
            {selectedPromoBook && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="promo-modal-backdrop">
                <div 
                  className="bg-white dark:bg-zinc-950 rounded-2xl max-w-md w-full border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-2xl relative"
                  id="promo-modal-content"
                >
                  <button
                    onClick={() => setSelectedPromoBook(null)}
                    className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 transition-colors z-10"
                    title="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex flex-col gap-5 p-6">
                    <div className="flex gap-4 items-start">
                      <div className="w-24 h-32 flex-shrink-0 bg-zinc-100 dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg relative">
                        {selectedPromoBook.coverImage ? (
                          <img
                            src={selectedPromoBook.coverImage}
                            alt={selectedPromoBook.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          selectedPromoBook.coverSvg
                        )}
                      </div>

                      <div className="flex-1 text-left flex flex-col">
                        <span className="text-[8px] font-mono font-bold tracking-wider text-orange-600 dark:text-orange-400 uppercase bg-orange-100/60 dark:bg-orange-950/40 px-2 py-0.5 rounded-full w-max">
                          CREATIVES GARAGE
                        </span>
                        <h3 className="text-lg font-serif font-bold text-zinc-900 dark:text-zinc-100 mt-2 leading-tight">
                          {selectedPromoBook.title}
                        </h3>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">
                          Written by {selectedPromoBook.author}
                        </p>
                        
                        <p className="text-xs italic font-serif text-zinc-700 dark:text-zinc-300 mt-2 leading-snug">
                          "{selectedPromoBook.tagline}"
                        </p>
                      </div>
                    </div>

                    <div className="text-left mt-1">
                      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                        {selectedPromoBook.synopsis}
                      </p>
                    </div>

                    <div className="mt-2 text-left">
                      <h5 className="text-[9px] font-mono font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                        Themes
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPromoBook.themes.map((theme, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] font-sans font-medium px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-md border border-zinc-200/50 dark:border-zinc-800/50"
                          >
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedPromoBook(null)}
                      className="px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-xl text-xs font-bold transition-colors font-sans"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        if (selectedPromoBook.id === "mama-onyis" && onReadPromoBook) {
                          onReadPromoBook("mama-onyis");
                          setSelectedPromoBook(null);
                        } else {
                          setSelectedPromoBook({
                            ...selectedPromoBook,
                            showTeaserNotice: true
                          });
                        }
                      }}
                      className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all duration-300 font-sans flex items-center gap-1.5"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      {selectedPromoBook.id === "mama-onyis" ? "Read Full Story" : "Read Teaser"}
                    </button>
                  </div>

                  {/* Inline interactive notice instead of alert window */}
                  {selectedPromoBook.showTeaserNotice && (
                    <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                      <Sparkles className="w-8 h-8 text-amber-400 mb-3 animate-bounce" />
                      <h4 className="text-lg font-serif font-bold text-white mb-1">Coming Soon to RemixStory!</h4>
                      <p className="text-xs text-zinc-300 max-w-xs leading-relaxed mb-6">
                        We are currently crafting high-fidelity illustrations, interactive elements, and multi-lingual voices for "{selectedPromoBook.title}". Stay tuned for the complete launch!
                      </p>
                      <button
                        onClick={() => {
                          setSelectedPromoBook({
                            ...selectedPromoBook,
                            showTeaserNotice: false
                          });
                        }}
                        className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white font-sans text-xs font-bold rounded-xl shadow transition-colors"
                      >
                        Got it!
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      }

      case "coloring-page":
        return (
          <div className="w-full flex flex-col items-center bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl mb-4 shadow-inner animate-fadeIn">
            {/* Original high-fidelity coloring page illustration reference */}
            <div className="relative w-full rounded-2xl overflow-hidden shadow-md border border-zinc-200/50 dark:border-zinc-800/50 mb-5 bg-white select-none">
              <div className="absolute top-2 left-2 bg-black/70 text-white text-[8px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-sm z-10">
                ORIGINAL ARTWORK REFERENCE
              </div>
              <img
                src={ndotoPage10}
                alt="Original Coloring Page Reference"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-contain max-h-[35vh] mx-auto"
              />
            </div>

            <div className="flex items-center justify-between w-full mb-3 select-none">
              <span className="text-xs font-mono font-bold tracking-wide flex items-center gap-1.5 text-zinc-500">
                <Palette className="w-3.5 h-3.5 text-amber-500" />
                TAP REGIONS TO FILL COLOR
              </span>
              <button
                onClick={resetColoring}
                className="flex items-center gap-1 text-[9px] font-mono font-bold uppercase px-2 py-1 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 rounded transition-colors"
                title="Reset coloring"
              >
                <RefreshCw className="w-2.5 h-2.5" />
                Reset
              </button>
            </div>

            {/* Interactive Vector Coloring Canvas */}
            <div className="w-full border border-zinc-300/60 dark:border-zinc-700/60 bg-white rounded-xl p-2 flex justify-center items-center shadow">
              <svg viewBox="0 0 120 100" className="w-48 h-40 filter drop-shadow select-none">
                {/* Kitchen Wall / Background */}
                <rect
                  x="5"
                  y="5"
                  width="110"
                  height="90"
                  rx="6"
                  fill={colorFills.background}
                  stroke="#374151"
                  strokeWidth="1"
                  className="cursor-pointer transition-all hover:brightness-95"
                  onClick={() => handlePartClick("background")}
                />

                {/* Window outlines in background */}
                <rect x="15" y="15" width="25" height="25" fill="none" stroke="#9ca3af" strokeWidth="0.8" strokeDasharray="2,2" />
                <line x1="27.5" y1="15" x2="27.5" y2="40" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="15" y1="27.5" x2="40" y2="27.5" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="2,2" />

                {/* Basin of Chapatis */}
                <g className="cursor-pointer" onClick={() => handlePartClick("basin")}>
                  {/* Basin Exterior */}
                  <ellipse cx="32" cy="78" rx="20" ry="7" fill={colorFills.basin} stroke="#374151" strokeWidth="1" />
                  <path d="M12,78 L52,78 L48,65 L16,65 Z" fill={colorFills.basin} stroke="#374151" strokeWidth="1" />
                </g>

                {/* Basin Chapatis Inside Stack */}
                <g className="cursor-pointer" onClick={() => handlePartClick("basinChapatis")}>
                  <rect x="18" y="61" width="28" height="6" rx="1.5" fill={colorFills.basinChapatis} stroke="#374151" strokeWidth="1" />
                  <rect x="19" y="58" width="26" height="5" rx="1.5" fill={colorFills.basinChapatis} stroke="#374151" strokeWidth="1" />
                </g>

                {/* Hearth Clay Stove */}
                <g className="cursor-pointer" onClick={() => handlePartClick("hearth")}>
                  <path d="M65,85 L105,85 L100,60 L70,60 Z" fill={colorFills.hearth} stroke="#374151" strokeWidth="1" />
                </g>

                {/* Cast Iron Skillet Pan */}
                <ellipse
                  cx="85"
                  cy="58"
                  rx="22"
                  ry="6"
                  fill={colorFills.skillet}
                  stroke="#374151"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handlePartClick("skillet")}
                />

                {/* cooking chapati on skillet */}
                <rect
                  x="74"
                  y="55"
                  width="22"
                  height="6"
                  rx="1"
                  fill={colorFills.chapati}
                  stroke="#374151"
                  strokeWidth="0.8"
                  transform="rotate(-2, 85, 58)"
                  className="cursor-pointer"
                  onClick={() => handlePartClick("chapati")}
                />

                {/* Mzee Ndoto chef character */}
                <g className="cursor-pointer" onClick={() => handlePartClick("mzeeSkin")}>
                  {/* Face with beard */}
                  <circle cx="56" cy="35" r="7" fill={colorFills.mzeeSkin} stroke="#374151" strokeWidth="1" />
                  {/* Beard outlined detail */}
                  <path d="M49,35 Q56,46 63,35 Z" fill="#e5e7eb" stroke="#374151" strokeWidth="0.8" />
                  {/* Smiley line */}
                  <path d="M53,35 Q56,38 59,35" stroke="#374151" strokeWidth="0.5" fill="none" />
                </g>

                {/* Mzee's Traditional Cap (Kofia) */}
                <path
                  d="M50,29 L62,29 L60,24 L52,24 Z"
                  fill={colorFills.mzeeCap}
                  stroke="#374151"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handlePartClick("mzeeCap")}
                />

                {/* Mzee's Vest / Shirt */}
                <path
                  d="M48,42 L64,42 L62,65 L50,65 Z"
                  fill={colorFills.mzeeShirt}
                  stroke="#374151"
                  strokeWidth="1"
                  className="cursor-pointer"
                  onClick={() => handlePartClick("mzeeShirt")}
                />

                {/* Cooking hands reaching to skillet */}
                <path
                  d="M62,48 Q70,48 76,53"
                  stroke="#374151"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  className="cursor-pointer"
                  onClick={() => handlePartClick("mzeeSkin")}
                />

                {/* Steam squiggles lines */}
                <path d="M82,45 Q80,38 84,32" stroke="#9ca3af" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />
                <path d="M90,46 Q92,40 88,34" stroke="#9ca3af" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.4" />

                {/* Barcode details in coloring book back-cover */}
                <g transform="translate(42, 90)" stroke="#374151" strokeWidth="0.8">
                  <line x1="0" y1="0" x2="0" y2="4" />
                  <line x1="2" y1="0" x2="2" y2="4" strokeWidth="1.5" />
                  <line x1="5" y1="0" x2="5" y2="4" />
                  <line x1="7" y1="0" x2="7" y2="4" strokeWidth="2" />
                  <line x1="11" y1="0" x2="11" y2="4" />
                  <line x1="14" y1="0" x2="14" y2="4" strokeWidth="1.5" />
                  <line x1="17" y1="0" x2="17" y2="4" />
                  <line x1="20" y1="0" x2="20" y2="4" strokeWidth="2.5" />
                  <line x1="24" y1="0" x2="24" y2="4" />
                  <line x1="27" y1="0" x2="27" y2="4" strokeWidth="1.2" />
                  <line x1="30" y1="0" x2="30" y2="4" />
                  <line x1="33" y1="0" x2="33" y2="4" strokeWidth="1.8" />
                  <line x1="36" y1="0" x2="36" y2="4" />
                </g>
              </svg>
            </div>

            {/* Colors picker container */}
            <div className="w-full mt-4 flex flex-col gap-2 select-none" id="coloring-palette">
              <span className="text-[10px] font-mono font-bold text-zinc-400">SELECT PAINT COLOR:</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {paletteColors.map((color) => {
                  const isActive = selectedColor === color.value;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.value)}
                      className={`w-7 h-7 rounded-full border-2 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer ${
                        isActive
                          ? "border-amber-500 scale-110 ring-2 ring-amber-500/20 shadow-md"
                          : "border-zinc-300 dark:border-zinc-700"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    >
                      {isActive && (
                        <span className={`text-[10px] font-bold ${color.value === "#ffffff" ? "text-black" : "text-white"}`}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Decorative layout containers depending on page type */}
      {type === "cover" ? (
        <div className="w-full text-center space-y-4">
          {renderIllustration()}
          <div className="pt-2">
            <h1 className="text-3xl font-black tracking-tight uppercase leading-none font-sans mb-1 text-amber-500">
              {title}
            </h1>
            <p className="text-xs font-mono tracking-widest text-zinc-500 font-bold uppercase">
              By {author} · Illustrated by {illustrator}
            </p>
          </div>
          <div className="border-t border-b border-zinc-800/10 py-3 mt-4 text-[11px] font-mono tracking-wider font-extrabold text-zinc-400 dark:text-zinc-500 uppercase select-none">
            PAGE 1 · FRONT COVER
          </div>
        </div>
      ) : type === "credits" ? (
        <div className="w-full text-center space-y-4">
          {renderIllustration()}
          <div
            className={`font-mono text-xs leading-relaxed max-w-sm mx-auto p-4 rounded-xl border whitespace-pre-line ${
              isDarkMode
                ? "bg-zinc-950 border-zinc-900 text-zinc-400"
                : "bg-zinc-100/50 border-zinc-200 text-zinc-600"
            }`}
          >
            {text}
          </div>
          <div className="border-t border-b border-zinc-800/10 py-3 mt-4 text-[11px] font-mono tracking-wider font-extrabold text-zinc-400 dark:text-zinc-500 uppercase select-none">
            PAGE 2 · PUBLISHING DETAILS
          </div>
        </div>
      ) : type === "promo" ? (
        <div className="w-full space-y-4">
          <div className="flex items-center gap-1.5 border-b pb-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-sans font-black tracking-tight uppercase">
              CREATIVES GARAGE RECOMMENDATIONS
            </h3>
          </div>
          <p className="text-xs font-serif leading-relaxed opacity-80 mb-2">
            Loved Mzee Ndoto's square chapatis? Discover our vibrant library of rich, community-focused Kenyan children books and oral legacies!
          </p>
          {renderIllustration()}
          <div className="border-t border-b border-zinc-800/10 py-3 mt-4 text-[11px] font-mono tracking-wider font-extrabold text-zinc-400 dark:text-zinc-500 uppercase select-none">
            PAGE 9 · COMMUNITY CORNER
          </div>
        </div>
      ) : type === "coloring" ? (
        <div className="w-full space-y-3">
          <div className="flex items-center gap-1.5 border-b pb-2 mb-2 select-none">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-sans font-black tracking-tight uppercase">
              LEGACY COLORING CORNER
            </h3>
          </div>
          <p className="text-xs font-serif leading-relaxed opacity-85 mb-2">
            Mzee Ndoto's recipes represent our rich oral traditions, passed down through generations. Fill this page with your own golden colors.
          </p>
          {renderIllustration()}
          <div className="border-t border-b border-zinc-800/10 py-3 mt-3 text-[11px] font-mono tracking-wider font-extrabold text-zinc-400 dark:text-zinc-500 uppercase select-none">
            PAGE 10 · BACK COVER & BARCODE
          </div>
        </div>
      ) : (
        // Standard story page with illustration
        <div className="w-full space-y-4">
          {renderIllustration()}
          <div
            className={`font-serif leading-relaxed text-left whitespace-pre-line select-text ${fontSizeClass} ${
              isDarkMode ? "text-zinc-200" : "text-zinc-800"
            }`}
          >
            {text}
          </div>
        </div>
      )}
    </div>
  );
}
