/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Eye, EyeOff, Facebook, Instagram, Mail, KeyRound, Check } from "lucide-react";
import RistoLogo from "./RistoLogo";

export default function SignInView({
  onSignInSuccess,
  onBack,
  onNavigateToRegister,
  onOpenTerms,
  defaultEmail = "evalineatieno857@gmail.com",
  isDarkMode = true,
}) {
  // Mode selection: "login" or "forgot"
  const [formMode, setFormMode] = useState("login");

  // Sign In inputs
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("Otherwise");
  const [secureText, setSecureText] = useState(true);
  const [error, setError] = useState("");

  // Forgot password inputs
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryCode, setRecoveryCode] = useState("");
  const [verifyCodeInput, setVerifyCodeInput] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [secureNewText, setSecureNewText] = useState(true);
  const [recoveryStep, setRecoveryStep] = useState("request");

  const [isLoading, setIsLoading] = useState(false);

  // Handle standard login submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please specify a valid email address.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSignInSuccess(email);
    }, 850);
  };

  // Step 1: Submit Forgot Password request
  const handleForgotRequest = (e) => {
    e.preventDefault();
    setError("");

    if (!recoveryEmail.trim() || !recoveryEmail.includes("@")) {
      setError("Please specify a valid email address.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Generate a mock security verify code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setRecoveryCode(code);
      setRecoveryStep("verify");
    }, 1000);
  };

  // Step 2: Verification of security code + set new password
  const handleForgotVerify = (e) => {
    e.preventDefault();
    setError("");

    if (verifyCodeInput !== recoveryCode) {
      setError("Incorrect safety verification code. Please check and retry.");
      return;
    }
    if (newPassword.length < 4) {
      setError("New password must be at least 4 characters long.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setPassword(newPassword); // Update current form password text
      setEmail(recoveryEmail);  // Make email ready for login form
      setRecoveryStep("success");
    }, 1000);
  };

  const handleReturnToLogin = () => {
    setFormMode("login");
    setError("");
    setRecoveryStep("request");
    setVerifyCodeInput("");
    setNewPassword("");
    setNewPasswordConfirm("");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex flex-col justify-between p-6 bg-black text-white selection:bg-zinc-800 selection:text-white"
      id="signin-view-wrapper"
    >
      {/* Top branding logo aligned left */}
      <div className="pt-6 pl-4 flex justify-between items-center z-10 w-full animate-fade-in" id="signin-logo-container">
        <div 
          onClick={formMode === "login" ? onBack : handleReturnToLogin} 
          className="cursor-pointer active:scale-95 transition-transform"
          title="Back"
        >
          <RistoLogo size="md" isDarkTheme={true} className="scale-105" />
        </div>
      </div>

      {/* Main Core Form Block */}
      <div className="flex-1 flex flex-col justify-center w-full max-w-sm mx-auto px-4 z-10">
        <AnimatePresence mode="wait">
          {formMode === "login" ? (
            /* ==================== LOGIN MODE SCREEN ==================== */
            <motion.div
              key="login-form-div"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-7"
            >
              {/* Centered Sign in header */}
              <div className="text-center select-none pt-4 mb-2">
                <h2 className="text-[32px] font-sans font-light tracking-wide text-white">
                  Sign in
                </h2>
              </div>

              {/* Error Alert Display */}
              {error && (
                <div className="w-full bg-red-950/40 border border-red-900/40 text-red-400 text-xs py-2.5 px-4 rounded-xl text-center font-sans tracking-wide">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email address field */}
                <div className="space-y-1">
                  <input
                    type="email"
                    placeholder="Email"
                    autoCapitalize="none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-14 bg-[#1c1c1e] text-white border-none rounded-2xl px-6 text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-800 transition-all font-sans"
                    id="signin-email-field"
                    required
                  />
                </div>

                {/* Password field & Forgot Password trigger */}
                <div className="space-y-2">
                  <div className="relative flex items-center bg-[#1c1c1e] rounded-2xl focus-within:ring-1 focus-within:ring-zinc-800 transition-all">
                    <input
                      type={secureText ? "password" : "text"}
                      placeholder="Password"
                      autoCapitalize="none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-14 bg-transparent focus:outline-none px-6 pr-14 text-sm text-white placeholder-zinc-500 font-sans"
                      id="signin-password-field"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSecureText(!secureText)}
                      className="absolute right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      aria-label="Toggle password view"
                      id="signin-pwd-eye"
                    >
                      {secureText ? <Eye className="w-4 h-4 opacity-75" /> : <EyeOff className="w-4 h-4 opacity-75" />}
                    </button>
                  </div>

                  {/* Right-aligned Forgot Password */}
                  <div className="flex justify-end pt-1 pr-1">
                    <button
                      type="button"
                      onClick={() => setFormMode("forgot")}
                      className="text-xs font-sans text-zinc-300 hover:text-white cursor-pointer hover:underline transition"
                      id="signin-forgot-pwd-trigger"
                    >
                      Forgot Password
                    </button>
                  </div>
                </div>

                {/* Continue button (pure white styled capsule) */}
                <div className="flex justify-center pt-8">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-44 h-12 bg-white hover:bg-zinc-100 text-black font-semibold rounded-full text-base transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm font-sans"
                    id="signin-submit-btn"
                  >
                    {isLoading ? (
                      <span className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Or sign in with block separator */}
              <div className="space-y-6 pt-4">
                <div className="flex items-center w-full select-none max-w-xs mx-auto">
                  <div className="flex-1 h-[0.5px] bg-[#27272a]/60" />
                  <span className="mx-4 text-[13px] text-zinc-300 font-sans tracking-wide">
                    Or sign in with
                  </span>
                  <div className="flex-1 h-[0.5px] bg-[#27272a]/60" />
                </div>

                {/* Social Login circles */}
                <div className="flex justify-center gap-10 items-center">
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    className="text-white hover:text-zinc-200 transition-colors cursor-pointer p-1"
                    onClick={() => onSignInSuccess("demo.facebook@risto.app")}
                    id="signin-social-fb"
                    title="Sign in with Facebook"
                  >
                    <Facebook className="w-7 h-7 stroke-[1.8]" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    className="text-white hover:text-zinc-200 transition-colors cursor-pointer p-1"
                    onClick={() => onSignInSuccess("demo.instagram@risto.app")}
                    id="signin-social-ig"
                    title="Sign in with Instagram"
                  >
                    <Instagram className="w-7 h-7 stroke-[1.8]" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    className="text-white hover:text-zinc-200 transition-colors cursor-pointer p-1"
                    onClick={() => onSignInSuccess("demo.mail@risto.app")}
                    id="signin-social-mail"
                    title="Sign in with Email"
                  >
                    <Mail className="w-7 h-7 stroke-[1.8]" />
                  </motion.button>
                </div>
              </div>

              {/* Register link */}
              <p className="text-xs text-center font-sans mt-2 text-zinc-400">
                Don't have an offline account yet?{" "}
                <button
                  type="button"
                  onClick={onNavigateToRegister}
                  className="font-bold underline text-indigo-400 hover:text-indigo-300 ml-1 cursor-pointer"
                  id="signin-nav-register-btn"
                >
                  Register here
                </button>
              </p>
            </motion.div>
          ) : (
            /* ==================== FORGOT PASSWORD MODE SCREEN ==================== */
            <motion.div
              key="forgot-password-div"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="w-full space-y-6"
            >
              <div className="text-center select-none space-y-2">
                <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto border border-zinc-800 mb-2">
                  <KeyRound className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-sans font-normal text-white">
                  Recover Credentials
                </h3>
                <p className="text-[11px] font-sans text-zinc-400 max-w-[240px] mx-auto leading-normal">
                  We'll generate an instant verification code to safely recover your credentials.
                </p>
              </div>

              {error && (
                <div className="w-full bg-red-950/40 border border-red-900/40 text-red-400 text-xs py-2.5 px-4 rounded-xl text-center font-sans">
                  {error}
                </div>
              )}

              {recoveryStep === "request" && (
                /* Step A: Email request input form */
                <form onSubmit={handleForgotRequest} className="space-y-5 font-sans">
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    autoCapitalize="none"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    className="w-full h-14 bg-[#1c1c1e] text-white border-none rounded-2xl px-6 text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-800 transition-all font-sans"
                    id="forgot-email-field"
                    required
                  />

                  <div className="flex justify-center pt-2">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-48 h-12 bg-white hover:bg-zinc-100 text-black font-semibold rounded-full text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
                      id="forgot-request-btn"
                    >
                      {isLoading ? (
                        <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      ) : (
                        "Receive Code"
                      )}
                    </motion.button>
                  </div>
                </form>
              )}

              {recoveryStep === "verify" && (
                /* Step B: Enter Verification Code and New Password */
                <form onSubmit={handleForgotVerify} className="space-y-4 font-sans">
                  {/* Instant recovery code visual layout block */}
                  <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500/15 text-amber-500 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                      🔑
                    </div>
                    <div>
                      <p className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-zinc-500">Auto generated code:</p>
                      <p className="text-sm font-mono font-black text-amber-400">{recoveryCode}</p>
                    </div>
                  </div>

                  <input
                    type="text"
                    placeholder={`Enter code ${recoveryCode}`}
                    maxLength={4}
                    value={verifyCodeInput}
                    onChange={(e) => setVerifyCodeInput(e.target.value)}
                    className="w-full h-14 bg-[#1c1c1e] text-center font-mono tracking-widest text-lg text-white border-none rounded-2xl px-6 focus:outline-none focus:ring-1 focus:ring-zinc-800 transition-all"
                    id="forgot-code-element"
                    required
                  />

                  <div className="relative flex items-center bg-[#1c1c1e] rounded-2xl focus-within:ring-1 focus-within:ring-zinc-800 transition-all">
                    <input
                      type={secureNewText ? "password" : "text"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-14 bg-transparent focus:outline-none px-6 pr-12 text-sm text-white placeholder-zinc-500 font-sans"
                      id="forgot-new-password-field"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSecureNewText(!secureNewText)}
                      className="absolute right-5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                      id="forgot-new-pwd-eye"
                    >
                      {secureNewText ? <Eye className="w-4 h-4 opacity-75" /> : <EyeOff className="w-4 h-4 opacity-75" />}
                    </button>
                  </div>

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    className="w-full h-14 bg-[#1c1c1e] text-white border-none rounded-2xl px-6 text-sm placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-800 transition-all font-sans"
                    id="forgot-new-password-confirm-field"
                    required
                  />

                  <div className="flex justify-center pt-2">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={isLoading}
                      className="w-48 h-12 bg-white hover:bg-zinc-100 text-black font-semibold rounded-full text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
                      id="forgot-save-btn"
                    >
                      {isLoading ? (
                        <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                      ) : (
                        "Update Password"
                      )}
                    </motion.button>
                  </div>
                </form>
              )}

              {recoveryStep === "success" && (
                /* Step C: Display success message */
                <div className="space-y-4 text-center font-sans py-4 select-none">
                  <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5 text-green-400 stroke-[3]" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-widest font-mono">Password updated</h4>
                  <p className="text-xs text-zinc-400 max-w-[250px] mx-auto leading-relaxed">
                    Credentials recovered! You can now log into Risto securely.
                  </p>
                  
                  <button
                    type="button"
                    onClick={handleReturnToLogin}
                    className="text-xs font-bold py-3 px-6 rounded-full bg-white hover:bg-zinc-100 text-black transition-colors cursor-pointer w-full mt-2 font-sans"
                    id="forgot-success-back-btn"
                  >
                    Back to Sign In
                  </button>
                </div>
              )}

              {/* Navigation help back to Login */}
              {recoveryStep !== "success" && (
                <button
                  type="button"
                  onClick={handleReturnToLogin}
                  className="text-xs block text-center mx-auto cursor-pointer hover:underline pt-2 text-zinc-400 hover:text-white font-sans"
                  id="forgot-nav-back-login"
                >
                  Return to normal sign in
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Brand Footer Metadata in corner-wise split */}
      <div className="flex justify-between items-center px-4 text-[11px] text-zinc-500 font-sans tracking-wide pt-4 z-10" id="welcome-footer">
        <span className="flex items-center gap-1 select-none font-sans font-light">
          <span className="text-sm font-sans">©</span> 2025
        </span>
        <div className="flex gap-5">
          <button
            type="button"
            onClick={onOpenTerms}
            className="hover:text-zinc-350 underline cursor-pointer bg-transparent border-none p-0 text-zinc-550 font-sans text-[11px]"
          >
            Privacy Policy
          </button>
          <button
            type="button"
            onClick={onOpenTerms}
            className="hover:text-zinc-350 underline cursor-pointer bg-transparent border-none p-0 text-zinc-550 font-sans text-[11px]"
          >
            Terms of Use
          </button>
        </div>
      </div>
    </motion.div>
  );
}
