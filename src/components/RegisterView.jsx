/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { Eye, EyeOff, Facebook, Instagram, Mail } from "lucide-react";

export default function RegisterView({
  onRegisterSuccess,
  onOpenTerms,
  onNavigateToSignIn,
}) {
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [secureText, setSecureText] = useState(true);
  const [secureConfirmText, setSecureConfirmText] = useState(true);

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!regName.trim()) {
      setError("Please specify your name.");
      return;
    }
    if (!regEmail.trim() || !regEmail.includes("@")) {
      setError("Please specify a valid email address.");
      return;
    }
    if (regPassword.length < 4) {
      setError("Password must contain at least 4 characters.");
      return;
    }
    if (regPassword !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    onRegisterSuccess({ name: regName, email: regEmail });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="absolute inset-0 flex flex-col justify-between p-6 bg-black text-white"
      id="register-view-wrapper"
    >
      {/* Scrollable container inside so keyboard/elements fit well */}
      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-sm mx-auto overflow-y-auto pt-4 pb-4">
        <h2 className="text-2xl font-serif font-medium text-white mb-6 text-center select-none">
          Register
        </h2>

        {/* Error Notification Block */}
        {error && (
          <div className="w-full bg-red-950/45 border border-red-900/50 text-red-400 text-xs py-2 px-3.5 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {/* Name Field */}
          <input
            type="text"
            placeholder="Name"
            value={regName}
            onChange={(e) => setRegName(e.target.value)}
            className="w-full h-12 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 focus:outline-none rounded-lg px-4 text-sm text-white placeholder-zinc-500 transition-colors"
            id="register-name-field"
          />

          {/* Email Field */}
          <input
            type="email"
            placeholder="Email"
            autoCapitalize="none"
            value={regEmail}
            onChange={(e) => setRegEmail(e.target.value)}
            className="w-full h-12 bg-zinc-900 border border-zinc-800 focus:border-zinc-700 focus:outline-none rounded-lg px-4 text-sm text-white placeholder-zinc-500 transition-colors"
            id="register-email-field"
          />

          {/* Password field wrapping */}
          <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-lg focus-within:border-zinc-700 transition-colors">
            <input
              type={secureText ? "password" : "text"}
              placeholder="Password"
              autoCapitalize="none"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              className="w-full h-12 bg-transparent focus:outline-none px-4 text-sm text-white placeholder-zinc-500"
              id="register-password-field"
            />
            <button
              type="button"
              onClick={() => setSecureText(!secureText)}
              className="absolute right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle password view"
              id="register-pwd-eye"
            >
              {secureText ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm Password field wrapping */}
          <div className="relative flex items-center bg-zinc-900 border border-zinc-800 rounded-lg focus-within:border-zinc-700 transition-colors">
            <input
              type={secureConfirmText ? "password" : "text"}
              placeholder="Confirm password"
              autoCapitalize="none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-12 bg-transparent focus:outline-none px-4 text-sm text-white placeholder-zinc-500"
              id="register-confirm-password-field"
            />
            <button
              type="button"
              onClick={() => setSecureConfirmText(!secureConfirmText)}
              className="absolute right-4 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle confirm password view"
              id="register-cpwd-eye"
            >
              {secureConfirmText ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>

          {/* Legal disclaimer */}
          <p className="text-[11px] text-zinc-400 leading-normal text-left pt-1">
            By continuing you confirm that you agree with our{" "}
            <button
              type="button"
              onClick={onOpenTerms}
              className="underline text-white hover:text-zinc-200 cursor-pointer font-medium"
            >
              Terms & Conditions
            </button>
          </p>

          {/* Continue Pill button */}
          <div className="flex justify-center pt-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              onClick={handleSubmit}
              className="w-36 h-11 bg-white hover:bg-zinc-100 text-black font-semibold rounded-full text-sm shadow-md transition-all cursor-pointer"
              id="register-submit-btn"
            >
              Continue
            </motion.button>
          </div>
        </form>

        {/* Alternative line separator */}
        <div className="flex items-center w-full my-6 select-none">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="mx-3.5 text-xs text-zinc-500 font-mono tracking-wide">
            Or register with
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>

        {/* Social auth row links */}
        <div className="flex justify-center gap-8 mb-2">
          <button
            type="button"
            className="text-zinc-400 hover:text-indigo-400 hover:scale-105 transition-all cursor-pointer"
            id="social-fb"
            title="Register with Facebook"
          >
            <Facebook className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="text-zinc-400 hover:text-pink-400 hover:scale-105 transition-all cursor-pointer"
            id="social-ig"
            title="Register with Instagram"
          >
            <Instagram className="w-6 h-6" />
          </button>
          <button
            type="button"
            className="text-zinc-400 hover:text-emerald-400 hover:scale-105 transition-all cursor-pointer"
            id="social-mail"
            title="Register with Email provider"
          >
            <Mail className="w-6 h-6" />
          </button>
        </div>

        {onNavigateToSignIn && (
          <p className="text-xs text-center font-sans mt-3 text-zinc-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onNavigateToSignIn}
              className="font-bold underline text-indigo-400 hover:text-indigo-300 ml-1 cursor-pointer font-sans"
              id="register-nav-signin-btn"
            >
              Sign in here
            </button>
          </p>
        )}
      </div>
    </motion.div>
  );
}
