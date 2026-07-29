/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Headphones, Volume2, VolumeX, Search, User, Music } from "lucide-react";
import RistoLogo from "./RistoLogo";

// =========================================================================
// Real-time Procedural Synthesizer and Drum Machine using the Web Audio API
// =========================================================================
class RistoSynth {
  constructor(bookType = "default", onStepCallback = null) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.bookType = bookType;
    this.onStep = onStepCallback;
    this.isPlaying = false;
    this.bpm = bookType === "disruptive" ? 128 : bookType === "bonbon" ? 92 : 112;
    this.step = 0;
    this.timerId = null;
    this.volume = 0.2; // default volume
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.value = this.volume;
    this.masterVolume.connect(this.ctx.destination);
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.ctx && this.masterVolume) {
      this.masterVolume.gain.setValueAtTime(volume, this.ctx.currentTime);
    }
  }

  start() {
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    this.isPlaying = true;
    this.step = 0;
    const stepDuration = 60 / this.bpm / 2; // eighth notes
    
    const scheduler = () => {
      if (!this.isPlaying) return;
      this.playStep(this.step);
      if (this.onStep) {
        this.onStep(this.step);
      }
      this.step = (this.step + 1) % 16;
      this.timerId = setTimeout(scheduler, stepDuration * 1000);
    };
    
    scheduler();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  playStep(step) {
    const now = this.ctx.currentTime;
    
    // Play Drum Beats depending on type
    if (this.bookType === "disruptive") {
      // Electronic industrial beat
      if (step % 4 === 0) {
        this.synthKick(now, 0.45);
      }
      if (step % 4 === 2) {
        this.synthHihat(now, 0.16);
      }
      
      const notes = [110, 130.81, 146.83, 164.81, 196.00, 220, 293.66, 329.63];
      const note = notes[step % notes.length];
      if (step % 3 !== 0) {
        this.synthPluck(note, now, "sawtooth", 0.12, 0.16);
      }
    } else if (this.bookType === "bonbon") {
      // Soft sensory dessert lofi bells
      if (step % 8 === 0) {
        this.synthKick(now, 0.28);
      }
      if (step % 4 === 2) {
        this.synthHihat(now, 0.08);
      }
      
      const bells = [261.63, 293.66, 329.63, 392.00, 440, 523.25, 587.33, 659.25];
      const seedNotes = [0, 4, 2, 5, 1, 6, 3, 7];
      const nIndex = seedNotes[step % seedNotes.length];
      if (step % 4 === 0 || step % 4 === 3) {
        this.synthPluck(bells[nIndex], now, "sine", 0.1, 0.65); 
      }
    } else {
      // Default: Nairobi futuristic electronic beat
      if (step % 4 === 0 || step % 8 === 3) {
        this.synthKick(now, 0.38);
      }
      if (step % 4 === 2) {
        this.synthHihat(now, 0.12);
      }
      
      const scales = [146.83, 164.81, 196.00, 220.00, 246.94, 293.66, 329.63];
      const note = scales[(step * 3) % scales.length];
      if (step % 2 === 0) {
        this.synthPluck(note, now, "triangle", 0.16, 0.28);
      }
    }
  }

  synthKick(time, vol = 0.5) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.masterVolume);
      
      osc.frequency.setValueAtTime(150, time);
      osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.24);
      
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.24);
      
      osc.start(time);
      osc.stop(time + 0.25);
    } catch (e) {}
  }

  synthHihat(time, vol = 0.15) {
    try {
      const bufferSize = this.ctx.sampleRate * 0.04; 
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = "highpass";
      filter.frequency.setValueAtTime(8000, time);
      
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterVolume);
      
      noise.start(time);
      noise.stop(time + 0.05);
    } catch (e) {}
  }

  synthPluck(freq, time, type = "triangle", vol = 0.15, release = 0.2) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, time);
      
      if (type === "sawtooth") {
        osc.frequency.setValueAtTime(freq * 1.05, time);
        osc.frequency.exponentialRampToValueAtTime(freq, time + 0.02);
      }
      
      gain.gain.setValueAtTime(vol, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + release);
      
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(type === "sawtooth" ? 850 : 1500, time);
      if (type === "sawtooth") {
        lowpass.frequency.exponentialRampToValueAtTime(160, time + release);
      }
      
      osc.connect(lowpass);
      lowpass.connect(gain);
      gain.connect(this.masterVolume);
      
      osc.start(time);
      osc.stop(time + release + 0.02);
    } catch (e) {}
  }

  close() {
    this.stop();
    try {
      if (this.ctx) {
        this.ctx.close();
      }
    } catch (e) {}
  }
}

export default function AudioPlayerView({ book, onBack, isDarkMode }) {
  // Simple functional state tracker representing a real audiobook player timeline!
  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(25); // Starts at some point like in screenshot
  const [elapsedSeconds, setElapsedSeconds] = useState(225); // 3m 45s
  const [volume, setVolume] = useState(0.2); // Default volume level
  const [isMuted, setIsMuted] = useState(false);
  const [vizBars, setVizBars] = useState([35, 15, 60, 45, 80, 50, 20, 65, 40, 30, 55, 25]);
  const totalDurationSeconds = 720; // 12m 00s

  const intervalRef = useRef(null);
  const synthRef = useRef(null);

  // Initialize synth or stop it
  useEffect(() => {
    // Generate a beautiful localized bouncing behavior on step trigger
    const handleStep = (stepNumber) => {
      setVizBars((prev) => {
        const isKickAccent = stepNumber % 4 === 0;
        return prev.map((bar, index) => {
          const randomFactor = Math.random() * 25 - 12;
          let target = isKickAccent ? 85 : 45;
          if (index % 3 === 0) target += 20;
          if (index % 5 === 0) target -= 15;
          return Math.max(10, Math.min(100, Math.round(target + randomFactor)));
        });
      });
    };

    if (isPlaying) {
      if (!synthRef.current) {
        synthRef.current = new RistoSynth(book.type || "default", handleStep);
      }
      synthRef.current.setVolume(isMuted ? 0 : volume);
      synthRef.current.start();
    } else {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    }
  }, [isPlaying, book.type]);

  // Handle Volume change
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Clean up synth context on exit
  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.close();
        synthRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (prev >= totalDurationSeconds) {
            setIsPlaying(false);
            return totalDurationSeconds;
          }
          const nextVal = prev + 1;
          setProgressPercent((nextVal / totalDurationSeconds) * 100);
          return nextVal;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleSliderChange = (e) => {
    const percent = parseFloat(e.target.value);
    setProgressPercent(percent);
    const newSeconds = Math.round((percent / 100) * totalDurationSeconds);
    setElapsedSeconds(newSeconds);
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const skipForward = () => {
    setElapsedSeconds((prev) => {
      const nextVal = Math.min(prev + 15, totalDurationSeconds);
      setProgressPercent((nextVal / totalDurationSeconds) * 100);
      return nextVal;
    });
  };

  const skipBackward = () => {
    setElapsedSeconds((prev) => {
      const nextVal = Math.max(prev - 15, 0);
      setProgressPercent((nextVal / totalDurationSeconds) * 100);
      return nextVal;
    });
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (newVol > 0) {
      setIsMuted(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 15 }}
      className="absolute inset-0 z-30 flex flex-col bg-black text-white selection:bg-indigo-500 selection:text-white"
      id="audio-player-view"
    >
      {/* Top Header Row matching screenshots */}
      <div className="flex items-center justify-between px-5 h-14 border-b border-zinc-900 bg-black z-20">
        <button
          onClick={onBack}
          className="flex items-center justify-center p-1 hover:opacity-80 cursor-pointer text-white"
          id="audio-player-back-btn"
          title="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center select-none" id="audio-player-logo">
          <RistoLogo size="custom" className="h-6 w-auto" isDarkTheme={true} />
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <Search className="w-5 h-5 opacity-40 shrink-0" />
          <User className="w-5 h-5 opacity-40 shrink-0" />
        </div>
      </div>

      {/* Main player layout viewport */}
      <div className="flex-1 flex flex-col justify-between px-6 pt-4 pb-12 overflow-y-auto select-none">
        
        {/* Cover Art Artwork Frame - Captures the full visual aesthetic of Image 4 */}
        <div className="relative w-full aspect-square max-w-[280px] mx-auto rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-900 group">
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
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Bottom third darkened overlay banner housing centered titles (strictly matching Image 4 layout description) */}
          <div className="absolute inset-x-0 bottom-0 bg-black/65 backdrop-blur-md border-t border-white/5 py-4 px-3 text-center flex flex-col gap-0.5">
            <h3 className="text-sm font-sans font-extrabold tracking-tight text-white line-clamp-1">
              {book.title}
            </h3>
            <span className="text-[10px] text-zinc-400 font-sans tracking-wide">
              Written by {book.author || "John Smith"} &middot; Voiced by {book.voicedBy || "Janet Doe"}
            </span>
          </div>

          {/* Floating Headphones active status indicator badge */}
          <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/10 p-2.5 rounded-full">
            <Headphones className={`w-4 h-4 text-indigo-400 ${isPlaying ? "animate-bounce" : "opacity-80"}`} />
          </div>
        </div>

        {/* Dynamic active audio visualizer */}
        <div className="h-12 w-full max-w-[280px] mx-auto flex items-end justify-center gap-1.5 px-2 bg-zinc-950/40 rounded-xl py-2 my-2 border border-zinc-900/40">
          {vizBars.map((barHeight, idx) => (
            <div
              key={idx}
              className="w-1.5 bg-gradient-to-t from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-150"
              style={{
                height: `${isPlaying ? barHeight : 4}%`,
                opacity: isPlaying ? 0.9 : 0.25,
              }}
            />
          ))}
        </div>

        {/* Dynamic controls and scrubber block */}
        <div className="w-full max-w-[320px] mx-auto space-y-6">
          
          {/* Scrubber section */}
          <div className="space-y-2">
            <div className="relative w-full">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={progressPercent}
                onChange={handleSliderChange}
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white transition-all focus:outline-none"
                id="audio-scrubber"
              />
              {/* Active slider feedback background coloring */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-white rounded-lg pointer-events-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Time labels matching high-fidelity formats */}
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
              <span>{formatTime(elapsedSeconds)}</span>
              <span>{formatTime(totalDurationSeconds)}</span>
            </div>
          </div>

          {/* Core Player Trigger controls (Back, Play/Pause, Forward) */}
          <div className="flex items-center justify-between px-6">
            {/* Skip Back 15s */}
            <button
              onClick={skipBackward}
              className="w-12 h-12 rounded-full border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/30 flex items-center justify-center text-zinc-300 transition-all cursor-pointer"
              title="Skip Back 15s"
              id="player-control-prev"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Main Play Circle Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 bg-white hover:bg-zinc-100 text-black rounded-full flex items-center justify-center font-bold shadow-xl cursor-pointer transition-transform"
              id="player-control-play-pause"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current stroke-[2.5]" />
              ) : (
                <Play className="w-6 h-6 fill-current translate-x-0.5 stroke-[2.5]" />
              )}
            </motion.button>

            {/* Skip Forward 15s */}
            <button
              onClick={skipForward}
              className="w-12 h-12 rounded-full border border-zinc-800 hover:border-zinc-500 hover:bg-zinc-900/30 flex items-center justify-center text-zinc-300 transition-all cursor-pointer"
              title="Skip Forward 15s"
              id="player-control-next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Interactive Sound Volume adjustment Slider bar */}
          <div className="flex items-center justify-between gap-3 px-4 py-1.5 bg-zinc-900/40 rounded-full border border-zinc-800">
            <button
              onClick={toggleMute}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-indigo-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="0.5"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-400 focus:outline-none"
              title="Adjust Volume"
            />
            <span className="text-[9px] font-mono text-zinc-400 w-8 text-right">
              {isMuted ? "MUTED" : `${Math.round(volume * 200)}%`}
            </span>
          </div>

          {/* Quick Sound/Volume adjustment tip */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 font-mono text-center pt-1">
            <Music className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
            <span>High Fidelity Auditory Synthesizer &bull; Studio Stereo</span>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
