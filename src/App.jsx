/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FirebaseContext } from "./contexts/FirebaseContext";

// Modular Views
import SplashView from "./components/SplashView";
import WelcomeView from "./components/WelcomeView";
import SignInView from "./components/SignInView";
import RegisterView from "./components/RegisterView";
import HomeView from "./components/HomeView";
import LibraryView from "./components/LibraryView";
import ProfileView from "./components/ProfileView";
import ReaderView from "./components/ReaderView";
import BookDetailView from "./components/BookDetailView";
import GenresView from "./components/GenresView";
import AudioPlayerView from "./components/AudioPlayerView";
import FavoritesView from "./components/FavoritesView";
import ChoosePlanView from "./components/ChoosePlanView";
import TutorialSlidesView from "./components/TutorialSlidesView";

// Global Layout Components
import Header from "./components/Header";
import FloatingDock from "./components/FloatingDock";

// Overlays and Modals
import TermsModal from "./components/TermsModal";
import ModeModal from "./components/ModeModal";
import InviteModal from "./components/InviteModal";
import RegisterBookModal from "./components/RegisterBookModal";

// Services and persistent book registries
import { getUserBooks, saveUserBook, deleteUserBook } from "./lib/userBooksService";

// Top Bar Decorative Icons (for smartphone status mockup)
import { Wifi, Battery, Shield } from "lucide-react";
import { CAPTAIN_MNGWANA_BOOK, MZEE_NDOTO_BOOK, MAMA_ONYIS_BOOK } from "./data";

export default function App() {
  // Navigation State Trackers
  const [currentScreen, setCurrentScreen] = useState("start");
  const [profileView, setProfileView] = useState("main");
  const [detailSourceScreen, setDetailSourceScreen] = useState("home");

  // Overlay Modals Visibility States
  const [isModeModalVisible, setIsModeModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isRegisterBookModalOpen, setIsRegisterBookModalOpen] = useState(false);
  const [deleteSuccessBanner, setDeleteSuccessBanner] = useState(null);

  // User Profile Field States (prepopulated matching design specification)
  const [profile, setProfile] = useState({
    username: "Thayu",
    mobileNumber: "720 500 355",
    email: "thayu.whatever@gmail.com",
    password: "12345",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  });

  const { user, profile: firebaseProfile } = useContext(FirebaseContext) || {};

  useEffect(() => {
    if (firebaseProfile) {
      setProfile((prev) => ({
        ...prev,
        ...firebaseProfile,
      }));
    }
  }, [firebaseProfile]);

  // Persistent user registered books registry
  const [registeredBooks, setRegisteredBooks] = useState([]);

  // Theme & Appearance Configurations
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [deviceTime, setDeviceTime] = useState("");

  // Load custom books from cloud Firestore or local fallback
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const books = await getUserBooks();
        setRegisteredBooks(books);
      } catch (err) {
        console.error("Error fetching registered chronicles:", err);
      }
    };
    fetchBooks();
  }, [profile?.email, user?.uid]);

  const handleRegisterBookOnCloud = async (newBook) => {
    try {
      await saveUserBook(newBook);
      const updatedBooks = await getUserBooks();
      setRegisteredBooks(updatedBooks);
    } catch (err) {
      console.error("Failed to archive custom chronicle on cloud:", err);
    }
  };

  const handleDeleteBook = async (bookId, docId) => {
    try {
      const deletedBook = registeredBooks.find(b => b.id === bookId || b.docId === docId);
      const title = deletedBook ? deletedBook.title : "Book";
      
      await deleteUserBook(bookId, docId);
      const updatedBooks = await getUserBooks();
      setRegisteredBooks(updatedBooks);
      
      setDeleteSuccessBanner(title);
      setTimeout(() => {
        setDeleteSuccessBanner(null);
      }, 7000);

      // If we are currently viewing the deleted book, go back to the library view
      if (selectedDetailBook && (selectedDetailBook.id === bookId || selectedDetailBook.docId === docId)) {
        setSelectedDetailBook(null);
        setCurrentScreen("library");
      }
    } catch (err) {
      console.error("Failed to delete custom chronicle:", err);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setDeviceTime(`${hours}:${minutes} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 15000);
    return () => clearInterval(interval);
  }, []);

  // Search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Clear search query when current screen changes so it doesn't linger across context shifts
  useEffect(() => {
    setSearchQuery("");
  }, [currentScreen]);

  // Active Reading Material
  const [readingBook, setReadingBook] = useState(null);
  const [selectedDetailBook, setSelectedDetailBook] = useState(null);

  // Resolves placeholder "Mzee Ndoto's Chapati" with the actual uploaded PDF book from registeredBooks if present
  const resolveBookWithUploadedNdoto = (book) => {
    if (!book) return book;
    const isNdoto = 
      (book.title && (
        book.title.toLowerCase().includes("ndoto") || 
        book.title.toLowerCase().includes("chapati") || 
        book.title.toLowerCase().includes("mzee")
      )) ||
      book.id === "rec-ndoto" ||
      book.id === "ndoto-1" ||
      book.id === "lib-ndoto";
      
    if (isNdoto) {
      // Look for any uploaded book containing 'ndoto', 'chapati', or 'mzee' in title, description or content
      const uploadedNdoto = registeredBooks.find(b => {
        const titleMatch = b.title && (
          b.title.toLowerCase().includes("ndoto") || 
          b.title.toLowerCase().includes("chapati") || 
          b.title.toLowerCase().includes("mzee")
        );
        const descMatch = b.description && (
          b.description.toLowerCase().includes("ndoto") || 
          b.description.toLowerCase().includes("chapati")
        );
        const pagesMatch = b.pages && b.pages.some(p => {
          const text = typeof p === "string" ? p : (p.text || "");
          return text.toLowerCase().includes("ndoto") || text.toLowerCase().includes("chapati");
        });
        return titleMatch || descMatch || pagesMatch;
      });

      return {
        ...MZEE_NDOTO_BOOK,
        ...book,
        ...(uploadedNdoto || {}),
        id: (uploadedNdoto && uploadedNdoto.id) || book.id || MZEE_NDOTO_BOOK.id,
        title: (uploadedNdoto && uploadedNdoto.title) || book.title || MZEE_NDOTO_BOOK.title,
        author: (uploadedNdoto && uploadedNdoto.author) || book.author || MZEE_NDOTO_BOOK.author,
        pages: MZEE_NDOTO_BOOK.pages, // Guarantee 10 high-fidelity illustrated/interactive pages
        pageImages: uploadedNdoto && uploadedNdoto.pageImages, // Preserve exact pictures from the uploaded PDF
        coverUrl: MZEE_NDOTO_BOOK.coverUrl,
        description: MZEE_NDOTO_BOOK.description,
        genres: MZEE_NDOTO_BOOK.genres, // Guarantee correct genres (Drama & Folklore, preventing comic-webtoon mode defaults)
        type: "ndoto" // Guarantee exact book type reference
      };
    }
    return book;
  };

  // Flow State Actions
  const handleProceedFromSplash = () => {
    setCurrentScreen("welcome");
  };

  const handleRegisterSuccess = (userData) => {
    setProfile((prev) => ({
      ...prev,
      username: userData.name,
      email: userData.email,
    }));
    setCurrentScreen("genres");
  };

  const handleLogout = () => {
    setProfileView("main");
    setReadingBook(null);
    setCurrentScreen("welcome");
  };

  // Shortcut triggers to toggle reading mode
  const handleTriggerPrimaryRead = () => {
    setSelectedDetailBook(CAPTAIN_MNGWANA_BOOK);
    setCurrentScreen("book-detail");
  };

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center transition-colors duration-500 overflow-hidden relative ${
        isDarkMode ? "bg-zinc-950 text-white" : "bg-neutral-50 text-zinc-950"
      }`}
      id="app-page-wrapper"
    >
      {/* High-fidelity responsive dynamic blurred ambient backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-[100px] opacity-25 pointer-events-none transition-all duration-[1200ms] scale-110"
        style={{
          backgroundImage: readingBook
            ? `url(${readingBook.coverUrl})`
            : selectedDetailBook
            ? `url(${selectedDetailBook.coverUrl})`
            : "radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(168,85,247,0.12) 50%, rgba(236,72,153,0.06) 100%)",
        }}
      />

      {/* Elegant, premium full-screen canvas container */}
      <div
        className={`relative w-full h-screen overflow-hidden flex flex-col transition-all duration-300 ${
          isDarkMode ? "bg-black" : "bg-white"
        }`}
        id="device-mockup-frame"
      >
        {/* SLIM HIGH-FIDELITY MOBILE STATUS BAR */}
        <div className="w-full h-11 shrink-0 px-6 pt-1 flex items-center justify-between z-40 select-none bg-transparent pointer-events-none text-xs font-bold tracking-tight">
          {/* Precise timezone-local system time state */}
          <span className={`font-sans tracking-tight text-[11px] ${isDarkMode ? "text-zinc-300" : "text-zinc-800"}`}>
            {deviceTime || "10:42 AM"}
          </span>

          {/* Custom Network, Wifi and Power Level Status Signals */}
          <div className="flex items-center gap-1.5">
            <div className={`flex gap-[2.5px] items-end h-[9px] ${isDarkMode ? "text-zinc-300" : "text-zinc-800"}`} title="Cellular LTE active">
              <div className="w-[2px] h-1 bg-current rounded-3xs" />
              <div className="w-[2px] h-1.5 bg-current rounded-3xs" />
              <div className="w-[2px] h-2 bg-current rounded-3xs" />
              <div className="w-[2px] h-[9px] bg-current rounded-3xs" />
            </div>
            
            <Wifi className={`w-3.5 h-3.5 ${isDarkMode ? "text-zinc-300" : "text-zinc-800"}`} />

            <div className="flex items-center gap-1" title="Battery 95% charged">
              <span className={`text-[9px] font-mono font-bold opacity-80 ${isDarkMode ? "text-zinc-400" : "text-zinc-650"}`}>95%</span>
              <Battery className={`w-3.5 h-3.5 ${isDarkMode ? "text-zinc-300" : "text-zinc-800"}`} />
            </div>
          </div>
        </div>

        {/* CONTAINER FOR CORE CONTENT ROUTING */}
        <div
          className={`flex-1 w-full flex flex-col font-sans transition-colors duration-500 select-none overflow-hidden relative ${
            isDarkMode ? "bg-black text-white" : "bg-white text-zinc-900"
          }`}
          id="app-container"
        >
          {currentScreen !== "start" && currentScreen !== "welcome" && currentScreen !== "signin" && currentScreen !== "register" && currentScreen !== "genres" && currentScreen !== "choose-plan" && currentScreen !== "tutorial-slides" && currentScreen !== "audio-player" && !readingBook ? (
            <Header
              currentScreen={currentScreen}
              setCurrentScreen={setCurrentScreen}
              onSearchQuery={setSearchQuery}
              isDarkMode={isDarkMode}
              onTriggerUpload={() => setIsRegisterBookModalOpen(true)}
            />
          ) : null}

          {/* ==================== CORE ROUTER FEEDS ==================== */}
          <div className="flex-1 w-full h-full overflow-y-auto relative flex flex-col pb-[92px]">
            <AnimatePresence>
              {deleteSuccessBanner && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mx-4 mt-3 p-4 bg-emerald-950/95 border border-emerald-800/60 rounded-2xl shadow-xl flex flex-col gap-1.5 z-50 text-white relative"
                  id="app-delete-success-banner"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">✅</span>
                    <span className="text-xs font-sans font-extrabold uppercase tracking-wide text-emerald-300">Manuscript Deleted Successfully</span>
                    <button
                      onClick={() => setDeleteSuccessBanner(null)}
                      className="ml-auto text-zinc-400 hover:text-white font-mono text-xs p-1"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-[11px] font-sans text-emerald-100 leading-normal">
                    The custom chronicle "{deleteSuccessBanner}" has been completely removed.
                  </p>
                  <p className="text-[10px] font-mono text-zinc-300 leading-tight">
                    You can re-upload this story at any time using the <span className="text-amber-400 font-bold font-sans">Manuscript Upload</span> panel in your Library tab.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {currentScreen === "start" && (
              <SplashView onProceed={handleProceedFromSplash} />
            )}

            {currentScreen === "welcome" && (
              <WelcomeView
                onSignIn={() => setCurrentScreen("signin")}
                onRegister={() => setCurrentScreen("register")}
                onOpenPrivacyTerms={() => setIsTermsModalVisible(true)}
              />
            )}

            {currentScreen === "signin" && (
              <SignInView
                onSignInSuccess={(email) => {
                  setProfile((prev) => ({
                    ...prev,
                    email: email,
                  }));
                  setCurrentScreen("home");
                }}
                onBack={() => setCurrentScreen("welcome")}
                onNavigateToRegister={() => setCurrentScreen("register")}
                onOpenTerms={() => setIsTermsModalVisible(true)}
                defaultEmail={profile.email}
                isDarkMode={isDarkMode}
              />
            )}

            {currentScreen === "register" && (
              <RegisterView
                onRegisterSuccess={handleRegisterSuccess}
                onOpenTerms={() => setIsTermsModalVisible(true)}
                onNavigateToSignIn={() => setCurrentScreen("signin")}
              />
            )}

            {currentScreen === "genres" && (
              <GenresView
                onNext={(selected) => {
                  setCurrentScreen("choose-plan");
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {currentScreen === "choose-plan" && (
              <ChoosePlanView
                onBack={() => setCurrentScreen("genres")}
                onSubscribe={(plan) => {
                  setCurrentScreen("tutorial-slides");
                }}
                onOpenTerms={() => setIsTermsModalVisible(true)}
                isDarkMode={isDarkMode}
              />
            )}

            {currentScreen === "tutorial-slides" && (
              <TutorialSlidesView
                onBack={() => setCurrentScreen("choose-plan")}
                onComplete={() => {
                  setCurrentScreen("home");
                }}
                isDarkMode={isDarkMode}
              />
            )}

            {currentScreen === "home" && (
              <HomeView
                onReadBook={(book, initialPage = 0) => setReadingBook({ ...resolveBookWithUploadedNdoto(book), initialPage })}
                onEnterDetail={(book) => {
                  setSelectedDetailBook(resolveBookWithUploadedNdoto(book));
                  setDetailSourceScreen("home");
                  setCurrentScreen("book-detail");
                }}
                onPlayAudio={(book) => {
                  setSelectedDetailBook(resolveBookWithUploadedNdoto(book));
                  setDetailSourceScreen("home");
                  setCurrentScreen("audio-player");
                }}
                onNavigateToLibrary={() => setCurrentScreen("library")}
                isDarkMode={isDarkMode}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                registeredBooks={registeredBooks}
                onTriggerRegisterBook={() => setIsRegisterBookModalOpen(true)}
              />
            )}

            {currentScreen === "library" && (
              <LibraryView
                onEnterDetail={(book) => {
                  setSelectedDetailBook(resolveBookWithUploadedNdoto(book));
                  setDetailSourceScreen("library");
                  setCurrentScreen("book-detail");
                }}
                onPlayAudio={(book) => {
                  setSelectedDetailBook(resolveBookWithUploadedNdoto(book));
                  setDetailSourceScreen("library");
                  setCurrentScreen("audio-player");
                }}
                isDarkMode={isDarkMode}
                registeredBooks={registeredBooks}
                onTriggerRegisterBook={() => setIsRegisterBookModalOpen(true)}
                isAdmin={profile?.email === "evalineatieno857@gmail.com"}
                onDeleteBook={handleDeleteBook}
              />
            )}

            {currentScreen === "favorites" && (
              <FavoritesView
                onEnterDetail={(book) => {
                  setSelectedDetailBook(resolveBookWithUploadedNdoto(book));
                  setDetailSourceScreen("favorites");
                  setCurrentScreen("book-detail");
                }}
                onPlayAudio={(book) => {
                  setSelectedDetailBook(resolveBookWithUploadedNdoto(book));
                  setDetailSourceScreen("favorites");
                  setCurrentScreen("audio-player");
                }}
                isDarkMode={isDarkMode}
                searchQuery={searchQuery}
              />
            )}

            {currentScreen === "book-detail" && (
              <BookDetailView
                book={resolveBookWithUploadedNdoto(selectedDetailBook) || CAPTAIN_MNGWANA_BOOK}
                onRead={(book, initialPage = 0) => setReadingBook({ ...resolveBookWithUploadedNdoto(book), initialPage })}
                onBack={() => setCurrentScreen(detailSourceScreen)}
                isDarkMode={isDarkMode}
                isAdmin={profile?.email === "evalineatieno857@gmail.com"}
                onDeleteBook={handleDeleteBook}
              />
            )}

            {currentScreen === "audio-player" && (
              <AudioPlayerView
                book={resolveBookWithUploadedNdoto(selectedDetailBook) || CAPTAIN_MNGWANA_BOOK}
                onBack={() => setCurrentScreen(detailSourceScreen)}
                isDarkMode={isDarkMode}
              />
            )}

            {currentScreen === "profile" && (
              <ProfileView
                profile={profile}
                setProfile={setProfile}
                profileView={profileView}
                setProfileView={setProfileView}
                onLogout={handleLogout}
                onGoHome={() => setCurrentScreen("home")}
                onTriggerMode={() => setIsModeModalVisible(true)}
                onTriggerInvite={() => setIsInviteModalVisible(true)}
                isDarkMode={isDarkMode}
                onOpenTerms={() => setIsTermsModalVisible(true)}
              />
            )}

            {/* Immersive e-reader state layering */}
            {readingBook && (
              <ReaderView
                book={resolveBookWithUploadedNdoto(readingBook)}
                initialPage={readingBook.initialPage || 0}
                onBack={() => setReadingBook(null)}
                isDarkMode={isDarkMode}
                onReadAnotherBook={(newBookId) => {
                  if (newBookId === "mama-onyis") {
                    setReadingBook({ ...MAMA_ONYIS_BOOK, initialPage: 0 });
                  }
                }}
              />
            )}
          </div>

          {/* ==================== FIXED FLOATING DOCK NAV ==================== */}
          {currentScreen !== "start" && currentScreen !== "welcome" && currentScreen !== "register" && currentScreen !== "genres" && currentScreen !== "choose-plan" && currentScreen !== "tutorial-slides" && !readingBook ? (
            <FloatingDock
              currentScreen={currentScreen}
              setCurrentScreen={setCurrentScreen}
              onReadTrigger={handleTriggerPrimaryRead}
              onPlayAudioTrigger={() => {
                setSelectedDetailBook(CAPTAIN_MNGWANA_BOOK);
                setCurrentScreen("audio-player");
              }}
              isDarkMode={isDarkMode}
            />
          ) : null}
        </div>
      </div>

      {/* ==================== HELPER AND CONTROL OVERLAYS ==================== */}
      <TermsModal
        isOpen={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
      />

      <ModeModal
        isOpen={isModeModalVisible}
        onClose={() => setIsModeModalVisible(false)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      <InviteModal
        isOpen={isInviteModalVisible}
        onClose={() => setIsInviteModalVisible(false)}
      />

      <RegisterBookModal
        isOpen={isRegisterBookModalOpen}
        onClose={() => setIsRegisterBookModalOpen(false)}
        onRegisterBook={handleRegisterBookOnCloud}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
