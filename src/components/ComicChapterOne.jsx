/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import mngwanaCover from "../assets/images/mng.png";

export default function ComicChapterOne() {
  return (
    <div className="w-full flex flex-col bg-zinc-950 font-sans select-none" id="comic-chapter-one-container">
      {/* ==================== UPPER CRIMSON STORY PANEL ==================== */}
      <div 
        className="w-full bg-[#c2272d] text-white px-5 sm:px-8 py-10 flex flex-col relative overflow-hidden" 
        style={{
          // Give it a subtle comic halftone dot pattern using radial gradients
          backgroundImage: "radial-gradient(rgba(0,0,0,0.15) 15%, transparent 16%)",
          backgroundSize: "8px 8px"
        }}
        id="comic-red-story-card"
      >
        {/* Glow behind character */}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-amber-400/20 blur-3xl rounded-full pointer-events-none" />

        <div className="space-y-1 mb-8 text-center" id="comic-red-card-header">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-amber-300 font-extrabold block">
            Chapter One
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-widest uppercase leading-none drop-shadow-md">
            Captain Mngwana vs Kichwa Mbovu
          </h2>
        </div>

        {/* Story Paragraphs exactly as shown in screenshot */}
        <div className="space-y-5 text-center text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-sans font-medium text-red-50" id="comic-origin-narratives">
          <p className="drop-shadow-sm">
            Mngwana used to work at HEMSA, a government organisation, until they prosecuted him for illegally issuing a tender. Mngwana insisted on his innocence. He told the investigators that someone forged his signature and that his boss's nephew received the tender! Mngwana was just the scapegoat. No one listened to him. They left him penniless, unemployed, and with his name completely tarnished. After that Mngwana vowed to save the world, tackling one stupid action at a time. He is now known as Captain Mngwana, the masked crusader whose life's purpose is to fight the U.J.I.N.G.A pandemic.
          </p>
          <p className="drop-shadow-sm">
            He goes after corrupt leaders, fake pastors, litterbugs and any other person engaged in silly activities that ruin our society. As his work became more dangerous, he recognised the need to train himself in combat. He developed his own martial arts style called Achu Blesu. A combination of Wushu learned from Chinese films on VHS, Krav Maga from Rambo movies and other styles from watching Batman and Robin. To aid him in his war on U.J.I.N.G.A he uses his own inventions and innovations, including his super bike! Misuli Power!
          </p>
        </div>

        {/* Dynamic High-Quality Illustration of Captain Mngwana (Replacing old custom SVG) */}
        <div className="relative w-full max-w-sm mx-auto mt-6 rounded-[2rem] overflow-hidden shadow-2xl border-[4px] border-black bg-zinc-950 flex flex-col justify-end" id="hero-image-wrapper">
          <div className="relative aspect-[3/4] w-full">
            <img 
              src={mngwanaCover} 
              alt="Captain Mngwana" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top"
            />
            {/* Elegant transparent overlay badge inside the frame */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-mono font-extrabold text-amber-400 tracking-widest uppercase">
                  ACTIVE DEPLOYMENT
                </span>
                <span className="text-xs font-black text-white uppercase tracking-tight">
                  Captain Mngwana
                </span>
              </div>
              <span className="text-[10px] font-mono font-black bg-[#e3fc02] text-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                MISULI POWER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== LOWER COMIC GRID STRIP ==================== */}
      <div className="w-full bg-white text-zinc-950 p-4 sm:p-6 space-y-8" id="comic-panels-grid">
        
        {/* PANEL 1: MAD MATATU OUTRAGE */}
        <div className="border-[3px] border-black rounded-3xl p-4 flex flex-col md:flex-row gap-5 bg-stone-50 relative overflow-hidden shadow-md" id="comic-panel-card-1">
          {/* Narrative text box fixed in top-left manner */}
          <div className="bg-white border-2 border-black p-3.5 rounded-2xl max-w-full md:max-w-xs text-[11px] sm:text-xs text-left font-sans font-bold leading-relaxed shadow-sm shrink-0 z-10" id="panel-1-narration-box">
            Kichwa Mbovu is a 27-year-old rowdy matatu tout. He harasses people (even elderly women) when they don't get into his matatu fast enough. His driver also speeds down the road and overtakes like a madman.
          </div>

          {/* Visual animation canvas */}
          <div className="flex-1 min-h-[220px] bg-sky-100 rounded-2xl relative border-2 border-black overflow-hidden flex items-center justify-center p-3" id="panel-1-graphics-canvas">
            {/* Dynamic visual comic sky */}
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-sky-200 to-sky-300" />
            
            {/* Motion Speed Lines */}
            <div className="absolute inset-x-0 top-1/2 h-1 bg-white/60 opacity-90" />
            
            {/* Mad Matatu orange bus (SVG illustration) */}
            <svg viewBox="0 0 280 160" className="w-full max-w-[240px] drop-shadow-xl select-none relative z-10">
              {/* Road shadow */}
              <ellipse cx="140" cy="135" rx="100" ry="12" fill="rgba(0,0,0,0.18)" />

              {/* Matatu Main Frame Orange */}
              <path d="M 30 50 L 220 50 L 250 100 L 250 120 L 30 120 Z" fill="#ea580c" stroke="#000" strokeWidth="4" />
              {/* Roof Rack */}
              <line x1="45" y1="45" x2="190" y2="45" stroke="#111" strokeWidth="4" />
              
              {/* Windows panels */}
              <rect x="45" y="58" width="35" height="25" rx="3" fill="#93c5fd" stroke="#000" strokeWidth="2" />
              <rect x="90" y="58" width="35" height="25" rx="3" fill="#93c5fd" stroke="#000" strokeWidth="2" />
              <rect x="135" y="58" width="35" height="25" rx="3" fill="#93c5fd" stroke="#000" strokeWidth="2" />
              <rect x="180" y="58" width="30" height="25" rx="3" fill="#1e3a8a" stroke="#000" strokeWidth="2" /> {/* Windshield front */}
              
              {/* Wheels */}
              <circle cx="70" cy="120" r="18" fill="#111" stroke="#000" strokeWidth="2" />
              <circle cx="70" cy="120" r="8" fill="#e5e7eb" />
              <circle cx="190" cy="120" r="18" fill="#111" stroke="#000" strokeWidth="2" />
              <circle cx="190" cy="120" r="8" fill="#e5e7eb" />

              {/* "MAD-DRIVER" decal printed on side panel */}
              <rect x="50" y="94" width="130" height="15" rx="2" fill="#000" />
              <text x="115" y="105" fill="#facc15" fontSize="8.5" fontFamily="monospace" fontWeight="950" textAnchor="middle" letterSpacing="0.5">
                MAD-DRIVER
              </text>

              {/* Headlights emitting aggressive beams */}
              <polygon points="250,105 280,95 280,125" fill="rgba(253,224,71,0.5)" />
            </svg>

            {/* Spewing Dialogue Bubble: BEBA! BEBA! BEBA!... */}
            <div 
              className="absolute bottom-3 right-3 bg-white text-zinc-950 px-3.5 py-3 rounded-2xl border-3 border-black text-[9.5px] font-black leading-tight tracking-wider uppercase font-mono shadow-md text-center max-w-[125px] transform rotate-2"
              id="comic-bubble-1"
            >
              BEBA! <br />
              BEBA! <br />
              BEBA! <br />
              BAHA, JERI, <br />
              BURU. FINJE <br />
              KAKI ENDA!
              {/* Little speech pointer */}
              <div className="absolute -left-2.5 bottom-4 w-3 h-3 bg-white border-l-3 border-b-3 border-black transform rotate-45" />
            </div>
          </div>
        </div>

        {/* PANEL 2: STEALTH CHRONICLES & BULLY COUNTERS */}
        <div className="border-[3px] border-black rounded-3xl p-4 flex flex-col md:flex-row-reverse gap-5 bg-stone-50 relative overflow-hidden shadow-md" id="comic-panel-card-2">
          {/* Narrative text box */}
          <div className="bg-white border-2 border-black p-3.5 rounded-2xl max-w-full md:max-w-xs text-[11px] sm:text-xs text-left font-sans font-bold leading-relaxed shadow-sm shrink-0 z-10" id="panel-2-narration-box">
            He constantly bullies other drivers, overcharges his clients and pesters young girls. The only people he seems to fear are the police. Captain Mngwana has dreams of crushing their operation in the future.
          </div>

          {/* Visual animation canvas for shadow confrontation */}
          <div className="flex-1 min-h-[220px] bg-zinc-950 rounded-2xl relative border-2 border-black overflow-hidden flex items-center justify-between p-4" id="panel-2-graphics-canvas">
            {/* Dark alley glow backdrop */}
            <div className="absolute inset-0 bg-radial-gradient from-indigo-900/40 to-black" />
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black to-transparent" />

            {/* Glowing Police siren lights to signal the only fear */}
            <div className="absolute top-2 left-2 flex gap-1">
              <span className="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping inline-block" />
              <span className="w-3.5 h-3.5 rounded-full bg-blue-600 animate-pulse inline-block" />
            </div>

            {/* Simple Graphic Vector: Captain Mngwana's glowing visor in the shadows */}
            <div className="w-24 h-full relative flex items-center justify-center shrink-0 z-10">
              <svg viewBox="0 0 100 120" className="w-full h-full text-red-500">
                {/* Hooded head outline */}
                <path d="M 10 90 Q 50 10 90 90 Z" fill="#111" stroke="#374151" strokeWidth="2.5" />
                {/* Glowing White Goggles in dark slit */}
                <ellipse cx="40" cy="65" rx="10" ry="5" fill="#fff" className="animate-pulse" />
                <ellipse cx="60" cy="65" rx="10" ry="5" fill="#fff" className="animate-pulse" />
                <path d="M 35 75 Q 50 82 65 75" stroke="#fff" strokeWidth="2" fill="none" />
              </svg>
            </div>

            {/* Dialogue Bubble: BEBA! BEBA! BEBA! */}
            <div 
              className="bg-white text-zinc-950 px-3.5 py-3 rounded-2xl border-3 border-black text-[10px] font-black leading-tight tracking-wider uppercase font-mono shadow-md text-center max-w-[115px] transform -rotate-2 relative z-10"
              id="comic-bubble-2"
            >
              BEBA! <br />
              BEBA! <br />
              BEBA! <br />
              BAHA, JERI, <br />
              BURU!
              {/* Speech pointer */}
              <div className="absolute -right-2.5 top-4 w-3 h-3 bg-white border-r-3 border-t-3 border-black transform rotate-45" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
