/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import mngwanaCover from "../assets/images/mng.png";
const realBonbonImage = "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80";
import mamaOnyisCover from "../assets/images/mama onyis.png";
const mamaOnyisImage = mamaOnyisCover;
import disruptiveMusicImage from "../assets/images/disruptive_music_1781687568531.jpg";
const disruptiveMusicFallback = "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80";
import sondekaFestivalImage from "../assets/images/sondeka_festival_image_1781688834570.jpg";
import mzeeNdotoCover from "../assets/images/mzee ndoto.png";
import ndotoPage1 from "../assets/images/ndoto_page-0001.jpg";
 
export default function BookCover({ type, className = "", imgClassName = "", showOverlay = false, coverUrl = null }) {
  // If a custom cover URL is provided, and it's not a pre-defined static type, render the custom image cover
  if (coverUrl && type !== "ndoto" && type !== "mngwana" && type !== "disruptive" && type !== "bonbon" && type !== "onyis") {
    return (
      <div className={`relative w-full h-full bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800/40 select-none ${className}`}>
        <img
          src={coverUrl}
          alt="Custom Book Cover"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${imgClassName}`}
        />
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex items-end p-2.5">
            <span className="text-[9px] text-white font-mono uppercase tracking-widest font-semibold">
              ⭐ Custom Read
            </span>
          </div>
        )}
      </div>
    );
  }

  if (type === "ndoto") {
    return (
      <div className={`relative w-full h-full bg-amber-500 rounded-xl overflow-hidden shadow-lg border border-amber-600/20 select-none ${className}`}>
        <img
          src={mzeeNdotoCover}
          alt="Mzee Ndoto's Chapatis"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${imgClassName}`}
        />
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex items-end p-2.5">
            <span className="text-[9px] text-white font-mono uppercase tracking-widest font-semibold">
              ⭐ Original Cover
            </span>
          </div>
        )}
      </div>
    );
  }

  if (type === "mngwana") {
    return (
      <div className={`relative w-full h-full bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-900/40 select-none ${className}`}>
        <img
          src={mngwanaCover}
          alt="Captain Mngwana"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover ${imgClassName}`}
        />
        {showOverlay && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex items-end p-2.5">
            <span className="text-[9px] text-white font-mono uppercase tracking-widest font-semibold">
              ⭐ Premium Read
            </span>
          </div>
        )}
      </div>
    );
  }

  if (type === "disruptive") {
    return (
      <div className={`relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-indigo-500/20 bg-[#0c39f3] flex flex-col justify-between p-3 select-none text-white ${className}`}>
        {/* Cover visual asset featuring person's face merged with majestic mountain summit */}
        <img
          src={disruptiveMusicImage}
          onError={(e) => { e.currentTarget.src = disruptiveMusicFallback; }}
          alt="Disruptive Music"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Transparent glassmorphism gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/45 pointer-events-none z-1" />
        
        {/* Top items: folder/tag styling */}
        <div className="relative z-10 flex gap-1.5 items-start">
          <div className="bg-yellow-400 text-black text-[7px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 uppercase tracking-tight">
            <span className="w-1.5 h-1.5 bg-black rounded-full inline-block shrink-0 animate-ping" />
            stems
          </div>
          <div className="bg-white/20 backdrop-blur-sm text-white text-[7px] font-semibold px-1 rounded uppercase tracking-wider">
            Music 1
          </div>
          <div className="bg-white/20 backdrop-blur-sm text-white text-[7px] font-semibold px-1 rounded uppercase tracking-wider">
            Sharing
          </div>
        </div>

        {/* Central Graphic Block */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center -my-2">
          {/* Subtle pulse flare */}
          <div className="absolute w-20 h-20 bg-pink-500/20 rounded-full blur-md -z-10 animate-pulse" />
        </div>

        {/* Title overlays */}
        <div className="relative z-10 space-y-1 mt-auto">
          <h4 className="text-[14px] font-sans font-black tracking-tighter leading-none text-yellow-300 transform scale-y-110 uppercase select-none">
            DISRUPTIVE MUSIC
          </h4>
          <div className="bg-pink-600/90 text-[7px] text-white px-1.5 py-0.5 rounded font-mono font-bold leading-none inline-block border border-pink-400/20">
            Summit Edition
          </div>
        </div>

        {/* Decorative buttons overlay */}
        <div className="absolute bottom-2 right-2 flex gap-1 scale-75 opacity-90">
          <span className="bg-white/10 px-1 py-0.5 text-[6px] font-bold uppercase rounded text-zinc-300">Face</span>
          <span className="bg-black/40 px-1 py-0.5 text-[6px] font-bold uppercase rounded text-white">Summit</span>
        </div>
      </div>
    );
  }

  if (type === "bonbon") {
    return (
      <div className={`relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-amber-600/20 bg-[#fbc634] flex flex-col justify-between p-3 select-none text-zinc-900 ${className}`}>
        {/* Real French Bonbon Dessert photography cover */}
        <img
          src={realBonbonImage}
          alt="Real Bonbon"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Subtle vignette/shading mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 pointer-events-none z-1" />

        {/* Elegant top tag */}
        <div className="relative z-10 flex justify-between items-start text-[8px] font-mono opacity-90 font-bold uppercase tracking-wider text-amber-250">
          <span>S</span>
          <span>www.risto</span>
        </div>

        {/* Polaroid frame centering dessert detail */}
        <div className="relative z-10 flex-grow flex items-center justify-center my-1.5 opacity-90">
          <div className="bg-white p-1 rounded shadow-lg w-[82px] h-[86px] flex flex-col items-center justify-between border border-amber-805/10 rotate-3 transition-transform hover:rotate-0">
            <div className="relative w-16 h-16 rounded overflow-hidden shadow-inner bg-amber-50">
              <img
                src={realBonbonImage}
                alt="Choc Detail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="text-[6px] font-sans font-bold text-stone-500 tracking-tight uppercase leading-none mt-0.5">
              Choc Bonbon
            </div>
          </div>
        </div>

        {/* Footing typography */}
        <div className="relative z-10 text-center space-y-0.5 mt-auto">
          <h4 className="text-[12px] font-sans font-extrabold tracking-widest text-amber-300 leading-none uppercase">
            BONBON
          </h4>
          <p className="text-[6px] font-mono tracking-widest text-white font-bold leading-none uppercase">
            DESSERTS
          </p>
          <p className="text-[4.5px] font-serif italic text-amber-100 leading-none mt-0.5">
            Handcrafted Masterpiece
          </p>
        </div>
      </div>
    );
  }

  if (type === "onyis") {
    return (
      <div className={`relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-purple-500/20 bg-[#581c87] flex flex-col justify-between p-3 select-none text-white ${className}`}>
        {/* Real Lakeside Fried Fish photography cover */}
        <img
          src={mamaOnyisImage}
          alt="Mama Onyis Tilapia"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        {/* Subtle vignette/shading mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/35 pointer-events-none z-1" />

        {/* Elegant top tag */}
        <div className="relative z-10 flex justify-between items-start text-[8px] font-mono opacity-90 font-bold uppercase tracking-wider text-purple-200">
          <span>Lakeside</span>
          <span>Authentic</span>
        </div>

        {/* Central visual block or title */}
        <div className="relative z-10 flex-grow flex items-center justify-center my-1.5 opacity-90">
          <div className="absolute w-20 h-20 bg-purple-500/20 rounded-full blur-md -z-10 animate-pulse" />
        </div>

        {/* Footing typography */}
        <div className="relative z-10 text-center space-y-0.5 mt-auto">
          <h4 className="text-[12px] font-sans font-extrabold tracking-widest text-yellow-300 leading-none uppercase">
            MAMA ONYIS
          </h4>
          <p className="text-[6px] font-mono tracking-widest text-white font-bold leading-none uppercase">
            LAKESIDE MAGIC
          </p>
          <p className="text-[4.5px] font-serif italic text-purple-100 leading-none mt-0.5">
            Authentic Fried Fish &amp; Nyatiti Songs
          </p>
        </div>
      </div>
    );
  }

  // default: sondeka (Lime-Yellow creative awards poster)
  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden shadow-lg border border-yellow-400/20 bg-[#dbfe00] flex flex-col justify-between p-3 select-none text-white ${className}`}>
      {/* Real Sondeka digital artwork photography background */}
      <img
        src={sondekaFestivalImage}
        alt="Sondeka Festival"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Dynamic light shielding black vignette mask for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-black/45 pointer-events-none z-1" />

      {/* Top Banner overlay */}
      <div className="relative z-10 flex justify-between items-start text-white">
        <span className="text-[6px] font-mono tracking-wider opacity-85">CREATIVE</span>
        <div className="bg-red-600 text-white font-extrabold text-[7px] px-1 rounded animate-bounce">
          50N3KA
        </div>
      </div>

      {/* Animated modern glowing backdrop block */}
      <div className="relative z-10 flex-grow flex items-center justify-center my-1">
        <div className="absolute w-20 h-20 bg-yellow-400/20 rounded-full blur-md -z-10 animate-pulse" />
      </div>

      {/* Big yellow/red footer tags */}
      <div className="relative z-10 space-y-0.5 mt-auto">
        <div className="bg-pink-600 text-white text-[8px] font-black tracking-tight leading-flex text-center py-0.5 rounded transform -skew-y-3 font-serif uppercase">
          SUBMIT
        </div>
        <p className="text-[5.5px] font-sans font-bold tracking-tight text-center text-zinc-200 leading-none">
          CREATIVE WORK
        </p>
        <p className="text-[4.5px] font-mono font-medium tracking-tight text-center text-zinc-400 leading-none">
          www.sondeka.org
        </p>
      </div>

      {/* Top small icon badge details */}
      <div className="absolute top-[40px] right-2 flex flex-col gap-0.5 scale-75 opacity-90 items-center z-10">
        <span className="bg-black text-[5px] font-bold text-white px-0.5 rounded">AWARD</span>
        <span className="text-red-500 text-xs mt-0.5">🏆</span>
      </div>
    </div>
  );
}
