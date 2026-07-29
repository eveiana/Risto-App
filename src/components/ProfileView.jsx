/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Info,
  Bell,
  Sun,
  Moon,
  Volume2,
  Award,
  List,
  Bug,
  HelpCircle,
  Sparkles,
  LogOut,
  ChevronRight,
  Check,
  X,
  Mail,
  MailOpen,
  Trash2,
  ThumbsUp,
  ThumbsDown,
  ShoppingCart,
  CreditCard,
  Lock,
} from "lucide-react";
import { GENERAL_FAQ } from "../data";
import BookCover from "./BookCover";

const COUNTRIES = [
  { code: "KE", name: "Kenya (+254)", dialCode: "+254", flag: "🇰🇪" },
  { code: "UG", name: "Uganda (+256)", dialCode: "+256", flag: "🇺🇬" },
  { code: "TZ", name: "Tanzania (+255)", dialCode: "+255", flag: "🇹🇿" },
  { code: "RW", name: "Rwanda (+250)", dialCode: "+250", flag: "🇷🇼" },
  { code: "ZA", name: "South Africa (+27)", dialCode: "+27", flag: "🇿🇦" },
  { code: "NG", name: "Nigeria (+234)", dialCode: "+234", flag: "🇳🇬" },
  { code: "US", name: "United States (+1)", dialCode: "+1", flag: "🇺🇸" },
  { code: "GB", name: "United Kingdom (+44)", dialCode: "+44", flag: "🇬🇧" },
  { code: "DE", name: "Germany (+49)", dialCode: "+49", flag: "🇩🇪" },
  { code: "IN", name: "India (+91)", dialCode: "+91", flag: "🇮🇳" },
];

function parseInitialPhone(mobileNumber) {
  const raw = mobileNumber || "";
  for (const c of COUNTRIES) {
    if (raw.startsWith(c.dialCode)) {
      return {
        country: c,
        number: raw.slice(c.dialCode.length).trim(),
      };
    }
  }
  // Try back compatible
  return {
    country: COUNTRIES[0], // Kenya
    number: raw.trim(),
  };
}

export default function ProfileView({
  profile,
  setProfile,
  profileView,
  setProfileView,
  onLogout,
  onGoHome,
  onTriggerMode,
  onTriggerInvite,
  isDarkMode,
  onOpenTerms,
}) {
  // Local edit states
  const parsedPhone = parseInitialPhone(profile.mobileNumber);
  const [selectedCountry, setSelectedCountry] = useState(parsedPhone.country);
  const [editMobile, setEditMobile] = useState(parsedPhone.number);
  const [editName, setEditName] = useState(profile.username);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPassword, setEditPassword] = useState(profile.password || "Otherwise");
  const [editAvatarUrl, setEditAvatarUrl] = useState(profile.avatarUrl);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profileView === "edit") {
      setEditAvatarUrl(profile.avatarUrl);
      const parsed = parseInitialPhone(profile.mobileNumber);
      setSelectedCountry(parsed.country);
      setEditMobile(parsed.number);
    }
  }, [profileView, profile.avatarUrl, profile.mobileNumber]);

  // State trackers for the polished design overlay modals (Screenshots 6, 8, 9)
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // States for other inline/sub-menu settings option toggles
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVisible, setSoundVisible] = useState(false);
  const [wishlistVisible, setWishlistVisible] = useState(false);
  const [bugVisible, setBugVisible] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [subVisible, setSubVisible] = useState(false);

  // States for Page 27 Subscription Modal
  const [subCardName, setSubCardName] = useState("");
  const [subCardNumber, setSubCardNumber] = useState("");
  const [subCardExpiry, setSubCardExpiry] = useState("");
  const [subCardCVV, setSubCardCVV] = useState("");
  const [subFormSuccess, setSubFormSuccess] = useState(false);
  const [subPaying, setSubPaying] = useState(false);

  // Active wishlist and checkout experience
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [paymentConfirmItem, setPaymentConfirmItem] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const wishlistItems = [
    {
      id: "wishlist-1",
      title: "Captain Mngwana Vs. Msema Wongo",
      author: "Thayu Kilili",
      coverType: "disruptive",
    },
    {
      id: "wishlist-2",
      title: "Captain Mngwana Vs. Msema Wongo",
      author: "Thayu Kilili",
      coverType: "bonbon",
    },
    {
      id: "wishlist-3",
      title: "Captain Mngwana Vs. Msema Wongo",
      author: "Thayu Kilili",
      coverType: "disruptive",
    },
  ];

  const handleBuyPress = (item) => {
    setPaymentConfirmItem(item);
  };

  const handleConfirmPayment = () => {
    if (!paymentConfirmItem) return;
    setPaymentLoading(true);
    setTimeout(() => {
      setPurchasedItems((prev) => [...prev, paymentConfirmItem.id]);
      setToastMessage(`Story "${paymentConfirmItem.title}" unlocked successfully! 🎉`);
      setShowSuccessToast(true);
      setPaymentLoading(false);
      setPaymentConfirmItem(null);
      setTimeout(() => {
        setShowSuccessToast(false);
      }, 3505);
    }, 1200);
  };

  const [bugReportText, setBugReportText] = useState("");
  const [bugCategory, setBugCategory] = useState("Audio playback");
  const [bugSending, setBugSending] = useState(false);
  const [bugSubmitted, setBugSubmitted] = useState(false);
  const [reportedBugs, setReportedBugs] = useState([
    {
      id: "#RST-201",
      category: "Comic panels loading",
      text: "Sometimes images on the second page flicker or clip on mobile viewport size.",
      status: "Resolved",
      date: "May 28, 2026",
    }
  ]);

  // Mock notifications array inside state so they are dynamic & clean (Screenshot 9)
  const [notifs, setNotifs] = useState([
    {
      id: 1,
      title: "Subscription due",
      message: "Because silence is not an option. Keep the creative fires of Nairobi burning.",
      unread: true,
    },
    {
      id: 2,
      title: "Captain Mngwana 2 out!",
      message: "Because silence is not an option. Join the protector of East Africa's oral libraries now.",
      unread: true,
    },
  ]);

  // Mock FAQ feedback ratings state (Screenshot 6)
  const [faqFeedback, setFaqFeedback] = useState({});

  const menuOptions = [
    { id: "about", label: "About Us", icon: Info, hasArrow: true },
    { id: "notifications", label: "Notifications", icon: Bell, hasArrow: true },
    { id: "mode", label: "Mode", icon: isDarkMode ? Moon : Sun, hasArrow: true },
    { id: "sound", label: "Sound", icon: Volume2, hasArrow: true },
    { id: "subscription", label: "Subscription", icon: Award, hasArrow: true },
    { id: "wishlist", label: "Wishlist", icon: List, hasArrow: true },
    { id: "bug", label: "Report a Bug", icon: Bug, hasArrow: true },
    { id: "faq", label: "FAQ", icon: HelpCircle, hasArrow: true },
    { id: "invite", label: "Invite a friend", icon: Sparkles, hasArrow: true },
  ];

  const handleMenuPress = (id) => {
    if (id === "mode") {
      onTriggerMode();
    } else if (id === "invite") {
      onTriggerInvite();
    } else if (id === "logout") {
      setShowLogoutConfirm(true);
    } else if (id === "notifications") {
      setShowNotificationsModal(true);
    } else if (id === "faq") {
      setShowFAQModal(true);
    } else if (id === "sound") {
      setSoundVisible(!soundVisible);
    } else if (id === "wishlist") {
      setWishlistVisible(!wishlistVisible);
    } else if (id === "bug") {
      setBugVisible(!bugVisible);
      setBugSubmitted(false);
    } else if (id === "about") {
      setAboutVisible(!aboutVisible);
    } else if (id === "subscription") {
      setSubVisible(!subVisible);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setProfile({
      ...profile,
      username: editName,
      mobileNumber: selectedCountry.dialCode + " " + editMobile.trim(),
      email: editEmail,
      password: editPassword,
      avatarUrl: editAvatarUrl,
    });
    setProfileView("main");
  };

  const handleSendBug = (e) => {
    e.preventDefault();
    if (bugReportText.trim()) {
      setBugSending(true);
      
      setTimeout(() => {
        const newBugId = `#RST-${Math.floor(202 + Math.random() * 798)}`;
        const dateStr = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        // Add the new ticket details
        setReportedBugs((prev) => [
          {
            id: newBugId,
            category: bugCategory,
            text: bugReportText.trim(),
            status: "Under Review",
            date: dateStr,
          },
          ...prev,
        ]);

        setToastMessage(`Bug ${newBugId} logged. Thank you! 🛠️`);
        setShowSuccessToast(true);
        setBugReportText("");
        setBugSending(false);
        setBugSubmitted(true);

        setTimeout(() => {
          setShowSuccessToast(false);
        }, 3500);

        setTimeout(() => {
          setBugSubmitted(false);
        }, 1500);
      }, 1000);
    }
  };

  // Notification methods
  const toggleReadNotif = (id) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const deleteNotif = (id) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  };

  // FAQ feedback methods
  const selectFAQFeedback = (idx, type) => {
    setFaqFeedback((prev) => ({
      ...prev,
      [idx]: prev[idx] === type ? null : type,
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`w-full flex flex-col ${isDarkMode ? "bg-black text-white" : "bg-zinc-50 text-black"}`}
      id="profile-view-wrapper"
    >
      <div className="profile-inner-wrapper px-5 py-4 select-none">
        {/* Navigation row details */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (profileView === "edit") {
                setProfileView("main");
              } else {
                onGoHome();
              }
            }}
            className="p-1 hover:opacity-80 transition-opacity cursor-pointer text-current"
            id="profile-back-arrow"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-serif font-semibold tracking-wide">
            {profileView === "edit" ? "Edit Profile" : "Profile"}
          </h2>
          <div className="w-5" />
        </div>

        {/* SUBVIEW E1: MAIN PROFILE DASHBOARD */}
        {profileView === "main" && (
          <div className="space-y-6">
            {/* User Info Block */}
            <div className={`flex items-center gap-4 border p-4 rounded-xl ${isDarkMode ? "bg-zinc-900/35 border-zinc-800/50 text-white" : "bg-white border-zinc-200 text-black"}`}>
              <img
                src={profile.avatarUrl}
                alt={profile.username}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-xl object-cover border border-zinc-800/40"
              />
              <div className="flex-1 text-left space-y-1">
                <h3 className={`text-base font-bold font-sans ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                  {profile.username}
                </h3>
                <p className={`text-xs font-mono italic ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>{profile.email}</p>
                <div className="pt-1.5">
                  <button
                    onClick={() => setProfileView("edit")}
                    className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer border ${isDarkMode ? "bg-zinc-900 hover:bg-zinc-800 text-white border-zinc-800" : "bg-zinc-100 hover:bg-zinc-200 text-black border-zinc-300"}`}
                    id="edit-profile-trigger-btn"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* General Sub-options details inline togglers */}
            <AnimatePresence>
              {aboutVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`border p-4 rounded-xl text-left text-sm font-sans overflow-hidden ${
                    isDarkMode ? "bg-zinc-900/30 border-zinc-850 text-zinc-300" : "bg-white border-zinc-200 text-zinc-850"
                  }`}
                >
                  <p className="font-semibold block mb-1">Risto Collective</p>
                  <p className="text-xs leading-relaxed opacity-90">
                    Risto is a visual and oral storytelling sanctuary created in combination with Nairobi comic creators to preserve genuine East African folk histories.
                  </p>
                </motion.div>
              )}

              {soundVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`border p-4 rounded-xl text-left text-sm font-sans overflow-hidden flex items-center justify-between ${
                    isDarkMode ? "bg-zinc-900/30 border-zinc-850 text-zinc-300" : "bg-white border-zinc-200 text-zinc-850"
                  }`}
                >
                  <span className="font-semibold">Audio player background sounds:</span>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer ${
                      soundEnabled ? "bg-black" : "bg-zinc-400"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                        soundEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </motion.div>
              )}

              {bugVisible && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className={`border p-4 rounded-xl text-left text-sm font-sans overflow-hidden space-y-4 ${
                    isDarkMode ? "bg-zinc-900/30 border-zinc-850 text-zinc-350" : "bg-white border-zinc-200 text-zinc-800"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-black font-extrabold">Report an Issue</span>
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                      Spotted a bug on the visual art panels or audio recordings? Submit details directly below.
                    </p>
                  </div>

                  {bugSubmitted ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center text-xs text-white py-3 font-bold flex flex-col items-center gap-1 bg-white/10 rounded-xl border border-white/25"
                    >
                      <Check className="w-5 h-5 text-emerald-500" />
                      Bug report transmitted successfully!
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSendBug} className="space-y-3">
                      <div>
                        <label className={`block text-[10px] font-mono uppercase mb-1 font-bold ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                          Category:
                        </label>
                        <select
                          value={bugCategory}
                          onChange={(e) => setBugCategory(e.target.value)}
                          className={`w-full text-xs rounded p-2 focus:outline-none focus:border-black border ${
                            isDarkMode 
                              ? "bg-zinc-950 border-zinc-800 text-white" 
                              : "bg-zinc-50 border-zinc-200 text-zinc-900"
                          }`}
                        >
                          <option value="Audio playback">Audio playback (headphones / sound)</option>
                          <option value="Comic illustration">Comic illustration (panels / pages)</option>
                          <option value="Payments / sub KES">Payments / Subscription KES</option>
                          <option value="Interface layout">Interface layout / Theme contrast</option>
                          <option value="Search issue">Search bar / Results</option>
                          <option value="Other">Other critical issue</option>
                        </select>
                      </div>

                      <div>
                        <label className={`block text-[10px] font-mono uppercase mb-1 font-bold ${isDarkMode ? "text-zinc-500" : "text-zinc-455"}`}>
                          Bug Description:
                        </label>
                        <textarea
                          placeholder="What screen element or action failed?"
                          value={bugReportText}
                          onChange={(e) => setBugReportText(e.target.value)}
                          rows={2}
                          className={`w-full focus:outline-none focus:border-black rounded p-2 text-xs resize-none border ${
                            isDarkMode 
                              ? "bg-zinc-950 border-zinc-800 text-white placeholder-zinc-650" 
                              : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400"
                          }`}
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={bugSending}
                        className="text-xs font-bold py-2 px-5 bg-black hover:bg-zinc-800 text-white rounded-lg transition-all w-full flex items-center justify-center gap-1.5 cursor-pointer shadow-sm select-none"
                      >
                        {bugSending ? (
                          <>
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                            <span>Transmitting Ticket...</span>
                          </>
                        ) : (
                          "Submit Ticket"
                        )}
                      </button>
                    </form>
                  )}

                  {/* Bug List History Table */}
                  {reportedBugs.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-zinc-100/10">
                      <div className="flex justify-between items-center text-[10px] uppercase font-mono font-bold">
                        <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>Report Logs</span>
                        <span className="text-zinc-400">({reportedBugs.length})</span>
                      </div>
                      <div className="space-y-2 pr-1 max-h-[140px] overflow-y-auto">
                        {reportedBugs.map((bug) => (
                          <div 
                            key={bug.id} 
                            className={`p-2.5 rounded-xl border text-[11px] font-sans flex flex-col gap-1.5 ${
                              isDarkMode ? "bg-zinc-950/50 border-zinc-800" : "bg-zinc-50 border-zinc-150"
                            }`}
                          >
                            <div className="flex justify-between items-start font-sans">
                              <div className="space-y-0.5">
                                <span className={`font-black uppercase tracking-wider text-[9px] px-1.5 py-0.5 rounded-full ${
                                  bug.status === "Resolved" 
                                  ? "bg-white/10 text-white border border-white/20" 
                                    : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                }`}>
                                  {bug.status}
                                </span>
                                <span className={`text-[10px] font-mono italic block pt-1 ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>
                                  {bug.date} &bull; {bug.category}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-extrabold text-zinc-400">{bug.id}</span>
                            </div>
                            <p className={`italic ${isDarkMode ? "text-zinc-350" : "text-zinc-600"}`}>
                              &ldquo;{bug.text}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Settings Menu Options List (Contrasting icons set to BLACK in light mode!) */}
            <div className={`rounded-xl divide-y border shadow-md ${isDarkMode ? "bg-zinc-900/10 border-zinc-800/15 divide-zinc-850" : "bg-white border-zinc-200 divide-zinc-200"}`}>
              {menuOptions.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleMenuPress(item.id)}
                    className={`w-full flex items-center justify-between py-3.5 px-3 transition-colors text-left cursor-pointer font-sans ${
                      isDarkMode ? "hover:bg-zinc-900/40 text-white" : "hover:bg-zinc-100 text-zinc-950"
                    }`}
                    id={`menu-item-${item.id}`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Icons black in light mode */}
                      <Icon className={`w-5 h-5 ${isDarkMode ? "text-zinc-300 opacity-80" : "text-black font-semibold stroke-[2.5]"}`} />
                      <span className={`text-sm ${isDarkMode ? "text-zinc-300 font-medium" : "text-zinc-950 font-bold"}`}>
                        {item.label}
                      </span>
                    </div>
                    {item.hasArrow && (
                      <ChevronRight className={`w-4 h-4 ${isDarkMode ? "text-zinc-500 hover:text-white" : "text-zinc-650"}`} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Design Footer containing Logout on Left and Privacy Policy / Terms of Use on Right */}
            <div className="pt-6 pb-2 mt-2 flex items-center justify-between select-none" id="profile-footer-row">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(true)}
                className={`flex items-center gap-2 py-1.5 hover:opacity-80 transition-opacity cursor-pointer ${isDarkMode ? "text-zinc-300 hover:text-white" : "text-black hover:text-zinc-700"}`}
                id="footer-logout-btn"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-extrabold font-sans">Logout</span>
              </button>

              <div className="flex items-center gap-4 text-[10px] font-sans font-bold">
                <button
                  type="button"
                  onClick={() => onOpenTerms?.()}
                  className={`hover:opacity-80 transition-opacity cursor-pointer underline underline-offset-2 ${
                    isDarkMode ? "text-zinc-400 hover:text-zinc-200 decoration-zinc-600" : "text-zinc-650 hover:text-black decoration-zinc-400"
                  }`}
                  id="footer-privacy-btn"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => onOpenTerms?.()}
                  className={`hover:opacity-80 transition-opacity cursor-pointer underline underline-offset-2 ${
                    isDarkMode ? "text-zinc-400 hover:text-zinc-200 decoration-zinc-600" : "text-zinc-650 hover:text-black decoration-zinc-400"
                  }`}
                  id="footer-terms-btn"
                >
                  Terms of Use
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUBVIEW E2: EDIT PROFILE FORM */}
        {profileView === "edit" && (
          <form onSubmit={handleSaveEdit} className="space-y-4 text-left font-sans">
            {/* Avatar Edit Large Center */}
            <div className="flex flex-col items-center gap-2 py-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-32 h-40 rounded-xl overflow-hidden border shadow-md group cursor-pointer transition-all hover:border-zinc-500 ${
                  isDarkMode ? "border-zinc-805" : "border-zinc-300"
                }`}
                title="Click to browse your own profile picture"
              >
                <img
                  src={editAvatarUrl}
                  alt="Large User Avatar"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                {/* Visual Change Overlay text */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity gap-1">
                  <span className="text-[10px] font-sans font-black text-white uppercase tracking-wider bg-black px-2.5 py-1 rounded-full border border-white/25">
                    Browse Pic
                  </span>
                </div>
              </div>
              
              {/* Secret file input component */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id="avatar-file-input"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`text-[11px] font-sans font-bold flex items-center gap-1.5 py-1.5 px-4 rounded-full border shadow-xs select-none cursor-pointer transition-all ${
                  isDarkMode
                    ? "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white"
                    : "bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-black"
                }`}
                id="profile-browse-pic-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                Browse your own picture
              </button>
            </div>

            {/* Input field collections */}
            <div className="space-y-4">
              <div>
                <label className={`text-[10px] font-mono tracking-wider block mb-1.5 uppercase font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  User Name:
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full h-11 border focus:outline-none rounded-lg px-4 text-sm transition-colors ${
                    isDarkMode ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-white" : "bg-white border-zinc-300 text-black"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-[10px] font-mono tracking-wider block mb-1.5 uppercase font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  Mobile Number:
                </label>
                {/* Interactive Mobile Input with Country Code Selector */}
                <div className="flex w-full items-center">
                  <div className="relative flex items-center shrink-0">
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => {
                        const next = COUNTRIES.find((c) => c.code === e.target.value);
                        if (next) setSelectedCountry(next);
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      title="Select Country Code"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code} className="text-black bg-white">
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>

                    <div
                      className={`flex justify-center items-center gap-1.5 px-3 w-20 h-11 border border-r-0 rounded-l-lg transition-colors select-none ${
                        isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-zinc-100 border-zinc-300 text-black"
                      }`}
                      title={`${selectedCountry.name} (${selectedCountry.dialCode})`}
                    >
                      <span className="text-lg leading-none shrink-0" role="img" aria-label={selectedCountry.name}>
                        {selectedCountry.flag}
                      </span>
                      <span className="text-xs font-mono font-bold tracking-tight">
                        {selectedCountry.dialCode}
                      </span>
                    </div>
                  </div>
                  <input
                    type="tel"
                    value={editMobile}
                    onChange={(e) => setEditMobile(e.target.value)}
                    placeholder="720 500 355"
                    className={`flex-1 h-11 border focus:outline-none rounded-r-lg px-3 text-sm transition-colors ${
                      isDarkMode ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-white" : "bg-white border-zinc-300 text-black"
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`text-[10px] font-mono tracking-wider block mb-1.5 uppercase font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  Email Address:
                </label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className={`w-full h-11 border focus:outline-none rounded-lg px-4 text-sm transition-colors ${
                    isDarkMode ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-white" : "bg-white border-zinc-300 text-black"
                  }`}
                  required
                />
              </div>

              <div>
                <label className={`text-[10px] font-mono tracking-wider block mb-1.5 uppercase font-bold ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`}>
                  Change Password:
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className={`w-full h-11 border focus:outline-none rounded-lg px-4 text-sm transition-colors ${
                    isDarkMode ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-white" : "bg-white border-zinc-300 text-black"
                  }`}
                />
              </div>
            </div>

            {/* Commit save changes submit */}
            <div className="pt-2">
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`px-5 py-2.5 font-bold rounded-md text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                  isDarkMode ? "bg-zinc-100 hover:bg-white text-black" : "bg-black hover:bg-zinc-800 text-white"
                }`}
                id="edit-profile-save-btn"
              >
                Done editing
              </motion.button>
            </div>
          </form>
        )}
      </div>

      {/* ==================== SCREENSHOT 9: "Notifications" Full Screen/Glass Overlay Card ==================== */}
      <AnimatePresence>
        {showNotificationsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" id="notif-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-[320px] bg-white text-zinc-950 rounded-[2rem] p-5 shadow-2xl relative border border-zinc-100 flex flex-col gap-4 overflow-hidden"
              id="notif-modal-card"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-black stroke-[2.5]" />
                  <h3 className="text-base font-sans font-extrabold text-black tracking-tight uppercase leading-none">
                    Notifications
                  </h3>
                </div>
                <button
                  onClick={() => setShowNotificationsModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-650 cursor-pointer text-black"
                  title="Close Notifications"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {notifs.length === 0 ? (
                  <div className="text-center py-8 text-zinc-400 italic text-xs font-sans">
                    Your notifications feed is clean!
                  </div>
                ) : (
                  notifs.map((n) => (
                    <div
                      key={n.id}
                      className={`p-3 rounded-2xl border transition-all relative group flex flex-col gap-1.5 ${
                        n.unread ? "bg-zinc-100 border-zinc-200" : "bg-zinc-50/50 border-zinc-150"
                      }`}
                    >
                      <div className="flex items-start justify-between min-w-0">
                        <div className="flex items-baseline gap-1.5 min-w-0">
                          {n.unread && (
                            <span className="w-2 h-2 rounded-full bg-black shrink-0 inline-block" />
                          )}
                          <h4 className="text-xs font-extrabold text-zinc-950 truncate leading-tight">
                            {n.title}
                          </h4>
                        </div>
                      </div>

                      <p className="text-[10px] text-zinc-550 leading-relaxed font-sans pr-6">
                        {n.message}
                      </p>

                      <div className="flex items-center justify-end gap-1 px-1 pt-1 border-t border-zinc-100/50 mt-1 opacity-90">
                        <button
                          onClick={() => toggleReadNotif(n.id)}
                          className="w-7 h-7 rounded-md hover:bg-zinc-100 flex items-center justify-center text-zinc-650 cursor-pointer"
                          title={n.unread ? "Mark as Read" : "Mark as Unread"}
                        >
                          {n.unread ? (
                            <MailOpen className="w-3.5 h-3.5 text-zinc-600" />
                          ) : (
                            <Mail className="w-3.5 h-3.5 text-black" />
                          )}
                        </button>

                        <button
                          onClick={() => deleteNotif(n.id)}
                          className="w-7 h-7 rounded-md hover:bg-red-50 flex items-center justify-center text-red-650 cursor-pointer group"
                          title="Delete Notification"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:text-red-700" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <button
                onClick={() => setShowNotificationsModal(false)}
                className="w-full bg-black text-white hover:bg-zinc-900 text-xs font-bold font-sans py-3 px-6 rounded-full transition-colors cursor-pointer text-center"
              >
                Close Inbox
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SCREENSHOT 6: "FAQ" Full Screen/Glass Overlay Card ==================== */}
      <AnimatePresence>
        {showFAQModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" id="faq-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-[320px] bg-white text-zinc-950 rounded-[2rem] p-5 shadow-2xl relative border border-zinc-100 flex flex-col gap-4 overflow-hidden"
              id="faq-modal-card"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-black stroke-[2.5]" />
                  <h3 className="text-base font-sans font-extrabold text-black tracking-tight uppercase leading-none">
                    FAQ
                  </h3>
                </div>
                <button
                  onClick={() => setShowFAQModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center text-zinc-650 cursor-pointer text-black"
                  title="Close FAQs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                {GENERAL_FAQ.map((faqItem, idx) => {
                  const rating = faqFeedback[idx];
                  return (
                    <div key={idx} className="p-3.5 bg-zinc-50/50 border border-zinc-150 rounded-2xl flex flex-col gap-1.5 text-left">
                      <h4 className="text-xs font-sans font-extrabold text-zinc-950 leading-snug">
                        Q: {faqItem.q}
                      </h4>
                      <p className="text-[10px] text-zinc-550 italic leading-relaxed font-sans font-medium">
                        Because silence is not an option. {faqItem.a}
                      </p>
                      
                      <div className="flex items-center justify-between border-t border-zinc-100/50 pt-2 mt-1 mx-0.5">
                        <span className="text-[9px] text-zinc-400 font-mono">Was this useful?</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => selectFAQFeedback(idx, "up")}
                            className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                              rating === "up"
                                ? "bg-white border-white text-black"
                                : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-500"
                            }`}
                            title="Useful thumbs up"
                          >
                            <ThumbsUp className="w-3 h-3 fill-current stroke-[2]" />
                          </button>

                          <button
                            onClick={() => selectFAQFeedback(idx, "down")}
                            className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                              rating === "down"
                                ? "bg-red-500 border-red-500 text-white"
                                : "bg-white border-zinc-200 hover:bg-zinc-100 text-zinc-500"
                            }`}
                            title="Not useful thumbs down"
                          >
                            <ThumbsDown className="w-3 h-3 fill-current stroke-[2]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setShowFAQModal(false)}
                className="w-full bg-black text-white hover:bg-zinc-900 text-xs font-bold font-sans py-3 px-6 rounded-full transition-colors cursor-pointer text-center"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SCREENSHOT 27: "Subscription & Checkout" Full Screen Card/Overlay ==================== */}
      <AnimatePresence>
        {subVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="subscription-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-[340px] bg-zinc-950/85 backdrop-blur-xl text-white rounded-[2rem] p-5 shadow-2xl relative border border-zinc-800/60 flex flex-col gap-4 overflow-y-auto max-h-[92vh] no-scrollbar"
              id="subscription-modal-card"
            >
              <div className="flex items-center justify-between pb-1 select-none">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-white/90 stroke-[2.5]" />
                  <h3 className="text-sm font-sans font-extrabold tracking-tight uppercase leading-none text-white">
                    Subscription
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setSubVisible(false);
                    setSubFormSuccess(false);
                  }}
                  className="text-white hover:text-zinc-300 transition-colors font-sans text-xl font-extrabold cursor-pointer select-none leading-none pb-0.5"
                  title="Close Subscription"
                  type="button"
                >
                  X
                </button>
              </div>

              <div className="border-b border-zinc-805/30 mb-0.5" />

              {/* My Account Status */}
              <div className="text-left font-sans space-y-2">
                <h4 className="text-xs font-sans font-extrabold text-white tracking-tight uppercase underline decoration-zinc-800 underline-offset-4">
                  My account
                </h4>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 shrink-0">
                    <img
                      src={profile.avatarUrl}
                      alt={profile.username}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-sans font-extrabold text-white leading-tight">
                        Monthly Subscription
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setToastMessage("Your premium tier is optimized to the max!");
                          setShowSuccessToast(true);
                          setTimeout(() => setShowSuccessToast(false), 2000);
                        }}
                        className="bg-black text-[9px] text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded-md hover:bg-zinc-900 transition-colors cursor-pointer leading-tight font-extrabold uppercase"
                      >
                        Update subscription
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium mt-1">Next payment 00/00/00</p>
                  </div>
                </div>
              </div>

              {/* Form State Success feedback */}
              {subFormSuccess ? (
                <div className="flex flex-col items-center gap-3 py-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center border border-white/20">
                    <Check className="w-6 h-6 text-white stroke-[3]" />
                  </div>
                  <h4 className="text-sm font-bold font-sans">Payment Details Updated!</h4>
                  <p className="text-xs text-zinc-400 leading-normal max-w-[240px]">
                    Your subscription payment method has been refreshed successfully.
                  </p>
                </div>
              ) : (
                /* Payment form block integrated as a sleek nested black box card */
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubPaying(true);
                    setTimeout(() => {
                      setSubPaying(false);
                      setSubFormSuccess(true);
                      setToastMessage("Payment settings updated!");
                      setShowSuccessToast(true);
                      setTimeout(() => setShowSuccessToast(false), 2000);
                    }, 1500);
                  }}
                  className="bg-black p-4.5 rounded-[1.25rem] border border-zinc-900 space-y-4 text-left font-sans"
                >
                  <div className="space-y-1 select-none">
                    <p className="text-xs font-sans font-extrabold tracking-tight text-white mb-0.5">
                      Update Payment details
                    </p>
                    <p className="text-[9.5px] text-zinc-400">
                      Accepted payment methods
                    </p>
                    <div className="flex gap-2.5 pt-1.5 items-center select-none" id="sub-payments-row">
                      {/* M-PESA */}
                      <span className="text-[10.5px] font-sans font-black tracking-tighter text-white">
                        <span className="text-[8.5px] italic font-bold">m-</span>PESA
                      </span>
                      {/* VISA */}
                      <span className="border border-white/40 px-1 py-0 px-1 rounded-[3px] text-[8px] font-sans font-black italic tracking-wider text-white leading-none">
                        VISA
                      </span>
                      {/* Mastercard logo custom interlocking transparent shapes */}
                      <div className="flex items-center -space-x-1.5 select-none">
                        <div className="w-3.5 h-3.5 rounded-full border border-white/40 bg-white/15" />
                        <div className="w-3.5 h-3.5 rounded-full border border-white/40 bg-white/20" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9.5px] font-sans font-bold text-white block mb-1">
                      Name on card
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      value={subCardName}
                      onChange={(e) => setSubCardName(e.target.value)}
                      className="w-full h-9 bg-zinc-900/60 border border-zinc-800/80 focus:border-zinc-700 focus:outline-none rounded-xl px-3.5 text-xs text-white placeholder-zinc-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-[9.5px] font-sans font-bold text-white block mb-1">
                      Card number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="xxxx-xxxx-xxxx"
                      value={subCardNumber}
                      onChange={(e) => setSubCardNumber(e.target.value)}
                      className="w-full h-9 bg-zinc-900/60 border border-zinc-800/80 focus:border-zinc-700 focus:outline-none rounded-xl px-3.5 text-xs text-white placeholder-zinc-500 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9.5px] font-sans font-bold text-white block mb-1">
                        Expiry date
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="MM/YY"
                        value={subCardExpiry}
                        onChange={(e) => setSubCardExpiry(e.target.value)}
                        className="w-full h-9 bg-zinc-900/60 border border-zinc-800/80 focus:border-zinc-700 focus:outline-none rounded-xl px-3.5 text-xs text-white placeholder-zinc-500 text-center transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[9.5px] font-sans font-bold text-white block mb-1">
                        Security code
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          required
                          maxLength={4}
                          placeholder="CVV"
                          value={subCardCVV}
                          onChange={(e) => setSubCardCVV(e.target.value)}
                          className="w-full h-9 bg-zinc-900/60 border border-zinc-800/80 focus:border-zinc-700 focus:outline-none rounded-xl pl-3.5 pr-8 text-xs text-white placeholder-zinc-500 transition-colors"
                        />
                        <Info className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-start">
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={subPaying}
                      className="bg-white hover:bg-zinc-100 text-black text-xs font-bold font-sans rounded-md px-3 py-1.5 shadow-md cursor-pointer flex items-center justify-center gap-1.5 transition-all"
                    >
                      {subPaying ? (
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin inline-block" />
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5 text-black stroke-[2.5]" />
                          <span>Pay $10</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubVisible(false);
                    setSubFormSuccess(false);
                  }}
                  className="w-[140px] py-2.5 bg-white hover:bg-zinc-100 text-black text-xs font-extrabold font-sans rounded-md transition-colors cursor-pointer block text-center shadow-md leading-none"
                  id="btn-sub-complete-dismiss"
                >
                  Complete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SCREENSHOT 8: "Logout" Confirmation Full Screen/Glass Overlay Card ==================== */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" id="logout-overlay-frame">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="w-full max-w-[280px] bg-white text-zinc-950 rounded-[2rem] p-6 text-center shadow-2xl relative border border-zinc-100 flex flex-col items-center gap-4"
              id="logout-modal"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 select-none flex items-center justify-center border border-red-250">
                <LogOut className="w-5 h-5 text-red-600 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-sans font-bold text-black tracking-tight leading-none text-center">
                  Logout
                </h3>
                <p className="text-xs text-zinc-550 font-sans leading-normal">
                  We hate to see you go but we can&apos;t wait for you to come back.
                </p>
              </div>

              <div className="w-full space-y-2 pt-2">
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    onLogout();
                  }}
                  className="w-full bg-black text-white hover:bg-zinc-900 text-xs font-bold font-sans py-3 px-6 rounded-full transition-colors cursor-pointer"
                  id="btn-sure-logout"
                >
                  Yap! Sure.
                </button>

                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="w-full bg-zinc-100 hover:bg-zinc-200 text-zinc-650 text-xs font-bold font-sans py-2.5 px-6 rounded-full transition-colors cursor-pointer"
                  id="btn-keep-here"
                >
                  Keep me here!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== ACTIVE WISHLIST OVERLAY MODAL ==================== */}
      <AnimatePresence>
        {wishlistVisible && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs" id="wishlist-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className={`w-full max-w-[340px] rounded-[2rem] p-5 shadow-2xl relative border flex flex-col gap-4 overflow-hidden ${
                isDarkMode 
                  ? "bg-[#121214] border-zinc-805 text-white" 
                  : "bg-white border-zinc-150 text-zinc-950"
              }`}
              id="wishlist-modal-card"
            >
              <div className="flex items-center justify-between border-b pb-3 border-zinc-800/30">
                <div className="flex items-center gap-2">
                  <List className={`w-5 h-5 ${isDarkMode ? "text-zinc-400" : "text-black"}`} />
                  <h3 className="text-base font-sans font-extrabold tracking-tight uppercase leading-none">
                    Wishlist
                  </h3>
                </div>
                <button
                  onClick={() => setWishlistVisible(false)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors ${
                    isDarkMode 
                      ? "bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800" 
                      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                  }`}
                  title="Close Wishlist"
                  type="button"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {wishlistItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex gap-4 p-3 rounded-2xl border transition-all ${
                      isDarkMode 
                        ? "bg-zinc-900/40 border-[#1c1c1f] text-white" 
                        : "bg-zinc-50 border-zinc-200 text-black shadow-xs"
                    }`}
                  >
                    <div className="w-20 aspect-[4/5] rounded-xl overflow-hidden shrink-0 shadow-md">
                      <BookCover type={item.coverType} />
                    </div>

                    <div className="flex-1 flex flex-col justify-center text-left space-y-2.5 min-w-0">
                      <div className="space-y-0.5">
                        <h4 className="text-xs font-extrabold truncate leading-tight">
                          {item.title}
                        </h4>
                        <p className={`text-[10px] font-mono italic ${isDarkMode ? "text-zinc-400" : "text-zinc-505"}`}>
                          by {item.author}
                        </p>
                      </div>

                      {purchasedItems.includes(item.id) ? (
                        <div className="text-white text-[9.5px] font-bold font-sans flex items-center gap-1 py-1 px-2.5 bg-white/10 rounded-full w-fit border border-white/20">
                          <Check className="w-3.5 h-3.5" />
                          Purchased
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleBuyPress(item)}
                          className={`py-1.5 px-4 rounded-full text-[10px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all hover:scale-102 active:scale-98 w-fit ${
                            isDarkMode 
                              ? "bg-white text-black hover:bg-zinc-200" 
                              : "bg-black text-white hover:bg-zinc-800"
                          }`}
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          Buy now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className={`text-[9.5px] font-sans leading-normal text-center italic opacity-85 px-1 ${
                isDarkMode ? "text-zinc-400" : "text-zinc-650"
              }`}>
                Added titles directly synchronize on your phone for full high-fidelity visual and vocal narration access.
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== SECURE CHECKOUT PAYMENTS CONFIRMATION DIALOG ==================== */}
      <AnimatePresence>
        {paymentConfirmItem && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" id="checkout-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className={`w-full max-w-[290px] rounded-[2rem] p-6 text-center shadow-2xl relative border flex flex-col items-center gap-4 ${
                isDarkMode ? "bg-zinc-950 border-zinc-800 text-white" : "bg-white border-zinc-200 text-zinc-905"
              }`}
              id="checkout-modal"
            >
              <div className="w-12 h-12 rounded-full bg-zinc-200/50 flex items-center justify-center border border-zinc-300">
                <CreditCard className="w-5 h-5 text-black stroke-[2.5]" />
              </div>

              <div className="space-y-1 text-center font-sans">
                <h3 className="text-base font-sans font-bold tracking-tight">
                  Secure Checkout
                </h3>
                <p className={`text-xs ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
                  Unlock custom high-fidelity illustrations, complete voice narration & offline access.
                </p>
              </div>

              <div className={`p-3 rounded-xl border w-full text-left font-sans space-y-1.5 ${
                isDarkMode ? "bg-zinc-900/60 border-zinc-850" : "bg-zinc-50 border-zinc-150"
              }`}>
                <div className="flex justify-between items-baseline min-w-0">
                  <span className={`text-[10px] uppercase font-mono tracking-wider ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>Title:</span>
                  <span className="text-xs font-bold truncate max-w-[150px]">{paymentConfirmItem.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className={`text-[10px] uppercase font-mono tracking-wider ${isDarkMode ? "text-zinc-500" : "text-zinc-400"}`}>Price:</span>
                  <span className="font-mono font-black text-[#bf2c11] text-xs">150 KES</span>
                </div>
                <div className="flex justify-between items-center text-[10px] border-t pt-1.5 select-none border-zinc-805/10">
                  <span className={isDarkMode ? "text-zinc-500" : "text-zinc-400"}>Payment Provider:</span>
                  <span className="font-bold text-black">M-PESA / Card</span>
                </div>
              </div>

              <div className="w-full space-y-2 pt-1 font-sans">
                <button
                  onClick={handleConfirmPayment}
                  disabled={paymentLoading}
                  className="w-full bg-black text-white hover:bg-zinc-800 text-xs font-bold py-3 px-6 rounded-full transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  type="button"
                >
                  {paymentLoading ? (
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin inline-block" />
                  ) : (
                    <span>Confirm Pay 150 KES</span>
                  )}
                </button>

                <button
                  onClick={() => setPaymentConfirmItem(null)}
                  disabled={paymentLoading}
                  className={`w-full text-xs font-bold py-2.5 px-6 rounded-full transition-colors cursor-pointer ${
                    isDarkMode ? "bg-zinc-900 hover:bg-zinc-800 text-zinc-350" : "bg-zinc-105 hover:bg-zinc-200 text-zinc-700"
                  }`}
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================== INTERACTIVE TOAST SUCCESS NOTICE ==================== */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-60 w-full max-w-[300px] bg-white text-black p-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-zinc-200"
            id="toast-success-alert"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Check className="w-5 h-5 text-white stroke-[3]" />
            </div>
            <div className="text-left flex-1 min-w-0">
              <p className="text-[11px] font-sans font-black uppercase tracking-wider leading-none mb-0.5">Payment Successful</p>
              <p className="text-[10px] font-sans opacity-95 truncate">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
