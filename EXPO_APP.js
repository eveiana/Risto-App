import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Modal,
  Switch,
  Animated,
  Easing,
} from "react-native";
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// =========================================================================
// RISTO BOOK DATA
// =========================================================================
const CAPTAIN_MNGWANA_BOOK = {
  id: "mngwana-1",
  title: "Captain Mngwana Vs. Msema Wongo",
  author: "Thayũ Kilili",
  genres: ["Comic", "Thriller", "Action"],
  coverUrl: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=400&q=80",
  description: "In the heart of the bustling city of Nairobi, Captain Mngwana, the city's valiant guardian, protects authentic stories from the treacherous storyteller Msema Wongo who seeks to delete their history...",
  pages: [
    "Chapter 1: Vs. Kichwa Mbovu\nMngwana was left penniless, unemployed, and with his name completely tarnished. After that, he vowed to save the world, tackling one stupid action at a time. He is now known as Captain Mngwana, fighting the U.J.I.N.G.A pandemic. He developed his own martial arts style called Achu Blesu—a combination of Wushu, Krav Maga, and other techniques. He rides his super bike: Misuli Power!",
    "Chapter 2: The Nairobi Sunrise\nFrom the heights of the KICC Tower, Captain Mngwana watched the city of Nairobi. In his ears, the rumbling harmony of Matatus honking below combined with the wind rushing past. He had spent years defending these streets, but a shadow was crawling forward.",
    "Chapter 3: Enter Msema Wongo\nMsema Wongo was not an ordinary foe. He did not fight with metal or fire; he fought with false memories, whispers, and distorted history. By night, he stood in local squares with a gold-plated megaphone, planting fabricated memories in the minds of the citizens.",
  ],
};

const RECOMMENDED_BOOKS = [
  {
    id: "rec-1",
    title: "The River Between",
    author: "Ngũgĩ wa Thiong'o",
    genres: ["Drama", "History"],
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=300&q=80",
    description: "An elegant portrayal of the physical and cultural divide between adjacent Gikuyu ridges during early colonial times.",
  },
  {
    id: "rec-2",
    title: "Looking for Kakamega",
    author: "Z. K. Onyango",
    genres: ["Thriller", "Folk"],
    coverUrl: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=300&q=80",
    description: "A mysterious modern-day quest that triggers deep connections to oral history inside the Kakamega Forest canopy.",
  },
  {
    id: "rec-3",
    title: "Whispers of the Savannah",
    author: "M. A. Odhiambo",
    genres: ["Action", "Drama"],
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=300&q=80",
    description: "Generational conflicts arise as local clans navigate urban growth vs historical legacy.",
  },
];

const GENERAL_FAQ = [
  { q: "What is Risto?", a: "Risto is a digital storytelling sanctuary for East African comic creators and oral tales." },
  { q: "Who is Captain Mngwana?", a: "The masked hero defending Nairobi from cultural memory thieves!" },
  { q: "Is audio available?", a: "Yes, Risto includes premium Swahili voice acting and ambient tracks." },
];

export default function RistoExpoApp() {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState("splash");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [profile, setProfile] = useState({
    username: "Thayũ Kilili",
    email: "thayu@risto.co",
    mobileNumber: "720 500 355",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  });

  // Search & Selection State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState(CAPTAIN_MNGWANA_BOOK);
  const [readingBook, setReadingBook] = useState(null);

  // Sub-Modals
  const [showFAQ, setShowFAQ] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);

  // Input states
  const [signInEmail, setSignInEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  // Sound Player Animation
  const spinValue = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (isPlaying && (currentScreen === "audio")) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 10000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.stopAnimation();
    }
  }, [isPlaying, currentScreen]);

  const recordSpin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const themeStyle = isDarkMode ? darkTheme : lightTheme;

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    setSearchQuery("");
  };

  const filteredRecommended = RECOMMENDED_BOOKS.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isSearchActive = searchQuery.trim().length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeStyle.bg }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* App Main Content Window */}
      <View style={styles.contentArea}>

        {/* SPLASH SCREEN */}
        {currentScreen === "splash" && (
          <TouchableOpacity
            style={styles.splashContainer}
            activeOpacity={0.9}
            onPress={() => navigateTo("welcome")}
          >
            <View style={styles.blurredOrb1} />
            <Text style={styles.splashBrand}>RISTO</Text>
            <Text style={styles.splashSubtitle}>Just a lion telling its story</Text>
            <Text style={styles.splashTapPrompt}>TAP ANYWHERE TO ENTER</Text>
          </TouchableOpacity>
        )}

        {/* WELCOME SCREEN */}
        {currentScreen === "welcome" && (
          <View style={styles.welcomeContainer}>
            <View style={styles.lionIconBg}>
              <Text style={styles.lionEmoji}>🦁</Text>
            </View>
            <Text style={[styles.welcomeTitle, { color: themeStyle.text }]}>Welcome to Risto</Text>
            <Text style={styles.welcomeDesc}>The visual and oral storytelling sanctuary of Nairobi creators.</Text>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigateTo("register")}>
              <Text style={styles.primaryBtnText}>Join Now</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.secondaryBtn, { borderColor: themeStyle.border }]} onPress={() => navigateTo("signin")}>
              <Text style={[styles.secondaryBtnText, { color: themeStyle.text }]}>Sign In</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>By signing up, you agree to our Terms of Service</Text>
          </View>
        )}

        {/* SIGN IN SCREEN */}
        {currentScreen === "signin" && (
          <View style={styles.authContainer}>
            <TouchableOpacity style={styles.inlineBackBtn} onPress={() => navigateTo("welcome")}>
              <Feather name="arrow-left" size={18} color={themeStyle.text} />
              <Text style={[styles.inlineBackText, { color: themeStyle.text }]}>Back</Text>
            </TouchableOpacity>
            <Text style={[styles.authTitle, { color: themeStyle.text }]}>Sign In</Text>
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#71717a"
              style={[styles.authInput, { color: themeStyle.text, borderColor: themeStyle.border, backgroundColor: isDarkMode ? "#09090b" : "#ffffff" }]}
              value={signInEmail}
              onChangeText={setSignInEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#71717a"
              secureTextEntry
              style={[styles.authInput, { color: themeStyle.text, borderColor: themeStyle.border, backgroundColor: isDarkMode ? "#09090b" : "#ffffff" }]}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={() => {
              setProfile({ ...profile, email: signInEmail || "guest@risto.co" });
              navigateTo("home");
            }}>
              <Text style={styles.primaryBtnText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("register")}>
              <Text style={styles.authLink}>Don't have an account? Join Now</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SIGN UP/REGISTER SCREEN */}
        {currentScreen === "register" && (
          <View style={styles.authContainer}>
            <TouchableOpacity style={styles.inlineBackBtn} onPress={() => navigateTo("welcome")}>
              <Feather name="arrow-left" size={18} color={themeStyle.text} />
              <Text style={[styles.inlineBackText, { color: themeStyle.text }]}>Back</Text>
            </TouchableOpacity>
            <Text style={[styles.authTitle, { color: themeStyle.text }]}>Sign Up</Text>
            <TextInput
              placeholder="Nickname / Pen Name"
              placeholderTextColor="#71717a"
              style={[styles.authInput, { color: themeStyle.text, borderColor: themeStyle.border, backgroundColor: isDarkMode ? "#09090b" : "#ffffff" }]}
              value={regName}
              onChangeText={setRegName}
            />
            <TextInput
              placeholder="Email address"
              placeholderTextColor="#71717a"
              style={[styles.authInput, { color: themeStyle.text, borderColor: themeStyle.border, backgroundColor: isDarkMode ? "#09090b" : "#ffffff" }]}
              value={regEmail}
              onChangeText={setRegEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#71717a"
              secureTextEntry
              style={[styles.authInput, { color: themeStyle.text, borderColor: themeStyle.border, backgroundColor: isDarkMode ? "#09090b" : "#ffffff" }]}
            />
            <TouchableOpacity style={styles.primaryBtn} onPress={() => {
              setProfile({
                ...profile,
                username: regName || "Guest Pen",
                email: regEmail || "new@risto.co"
              });
              navigateTo("genres");
            }}>
              <Text style={styles.primaryBtnText}>Create Account</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("signin")}>
              <Text style={styles.authLink}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* SELECT GENRES SCREEN */}
        {currentScreen === "genres" && (
          <View style={styles.genresContainer}>
            <Text style={[styles.authTitle, { color: themeStyle.text }]}>Select Genres</Text>
            <Text style={styles.welcomeDesc}>Customize your storytelling feed feed preference</Text>

            <View style={styles.genresRow}>
              {["Comic", "Thriller", "Action", "Drama", "History", "Folk"].map((genre) => (
                <TouchableOpacity key={genre} style={[styles.genrePillActive, { borderColor: "#4f46e5" }]}>
                  <Text style={styles.genrePillTextActive}>{genre}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigateTo("plan")}>
              <Text style={styles.primaryBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PLANS SCREEN */}
        {currentScreen === "plan" && (
          <View style={styles.genresContainer}>
            <Text style={[styles.authTitle, { color: themeStyle.text }]}>Choose Plan</Text>
            <Text style={styles.welcomeDesc}>Unlock authentic storytelling visualizers</Text>

            <View style={[styles.planCard, { borderColor: themeStyle.border, backgroundColor: isDarkMode ? "#09090b" : "#f4f4f5" }]}>
              <Text style={styles.planCardHeader}>🦁 LIONHEART TIER</Text>
              <Text style={[styles.planCardPrice, { color: themeStyle.text }]}>$10 / Month</Text>
              <Text style={styles.planCardBenefit}>• Unlimited Kinematic Comics</Text>
              <Text style={styles.planCardBenefit}>• Cinematic Swahili Audio Overlay</Text>
              <Text style={styles.planCardBenefit}>• Direct Artist Revenue Support</Text>
            </View>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigateTo("slides")}>
              <Text style={styles.primaryBtnText}>Activate Lionheart Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigateTo("slides")}>
              <Text style={styles.authLink}>Continue on Free Tier (Limited)</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* TUTORIAL SLIDES */}
        {currentScreen === "slides" && (
          <View style={styles.tutorialContainer}>
            <Text style={styles.tutorialEmoji}>🎨</Text>
            <Text style={[styles.tutorialTitle, { color: themeStyle.text }]}>Visual Audio Narration</Text>
            <Text style={styles.tutorialBody}>Immerse yourself within authentic oral history and digital illustrations crafted in Nairobi, Kenya.</Text>

            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigateTo("home")}>
              <Text style={styles.primaryBtnText}>Enter Risto Workspace</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* HOME VIEW */}
        {currentScreen === "home" && (
          <ScrollView style={styles.homeScroll} showsVerticalScrollIndicator={false}>
            {/* Custom Interactive Search Bar */}
            <View style={[styles.searchBar, { backgroundColor: isDarkMode ? "#18181b" : "#e4e4e7" }]}>
              <Feather name="search" size={16} color="#71717a" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Search Chronicles & Authors..."
                placeholderTextColor="#71717a"
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={[styles.searchInput, { color: themeStyle.text }]}
              />
              {isSearchActive && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {isSearchActive ? (
              <View style={styles.searchResultsSec}>
                <Text style={[styles.sectionHeader, { color: themeStyle.text }]}>Search Results ({filteredRecommended.length + (CAPTAIN_MNGWANA_BOOK.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0)})</Text>

                {CAPTAIN_MNGWANA_BOOK.title.toLowerCase().includes(searchQuery.toLowerCase()) && (
                  <TouchableOpacity style={styles.searchItem} onPress={() => { setSelectedBook(CAPTAIN_MNGWANA_BOOK); navigateTo("detail"); }}>
                    <Image source={{ uri: CAPTAIN_MNGWANA_BOOK.coverUrl }} style={styles.searchCoverImage} />
                    <View style={styles.searchMeta}>
                      <Text style={[styles.searchTitle, { color: themeStyle.text }]}>{CAPTAIN_MNGWANA_BOOK.title}</Text>
                      <Text style={styles.searchAuthor}>by {CAPTAIN_MNGWANA_BOOK.author}</Text>
                      <Text style={styles.searchCategory}>ORIGINAL COMIC PLAY</Text>
                    </View>
                  </TouchableOpacity>
                )}

                {filteredRecommended.map((book) => (
                  <TouchableOpacity key={book.id} style={styles.searchItem} onPress={() => { setSelectedBook(book); navigateTo("detail"); }}>
                    <Image source={{ uri: book.coverUrl }} style={styles.searchCoverImage} />
                    <View style={styles.searchMeta}>
                      <Text style={[styles.searchTitle, { color: themeStyle.text }]}>{book.title}</Text>
                      <Text style={styles.searchAuthor}>by {book.author}</Text>
                      <Text style={styles.searchCategory}>RECOMMENDED READS</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <>
                {/* Visual Premium Title Banner */}
                <View style={styles.heroBanner}>
                  <Image source={{ uri: CAPTAIN_MNGWANA_BOOK.coverUrl }} style={styles.heroCover} />
                  <View style={styles.heroGradientOverlay}>
                    <Text style={styles.heroSubtitle}>★ LIONHEART COMIC PREMIERE</Text>
                    <Text style={styles.heroTitle}>{CAPTAIN_MNGWANA_BOOK.title}</Text>

                    <TouchableOpacity style={styles.readNowBtn} onPress={() => { setSelectedBook(CAPTAIN_MNGWANA_BOOK); navigateTo("detail"); }}>
                      <Text style={styles.readNowText}>LAUNCH CHRONICLE</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Grid Lists */}
                <View style={styles.sliderSec}>
                  <Text style={[styles.sectionHeader, { color: themeStyle.text }]}>TRENDING READS</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sliderContent}>
                    <TouchableOpacity style={styles.sliderItem} onPress={() => { setSelectedBook(CAPTAIN_MNGWANA_BOOK); navigateTo("detail"); }}>
                      <Image source={{ uri: CAPTAIN_MNGWANA_BOOK.coverUrl }} style={styles.sliderCover} />
                      <Text style={[styles.sliderTitle, { color: themeStyle.text }]} numberOfLines={1}>{CAPTAIN_MNGWANA_BOOK.title}</Text>
                      <Text style={styles.sliderAuthor} numberOfLines={1}>{CAPTAIN_MNGWANA_BOOK.author}</Text>
                    </TouchableOpacity>

                    {RECOMMENDED_BOOKS.map((b) => (
                      <TouchableOpacity key={b.id} style={styles.sliderItem} onPress={() => { setSelectedBook(b); navigateTo("detail"); }}>
                        <Image source={{ uri: b.coverUrl }} style={styles.sliderCover} />
                        <Text style={[styles.sliderTitle, { color: themeStyle.text }]} numberOfLines={1}>{b.title}</Text>
                        <Text style={styles.sliderAuthor} numberOfLines={1}>{b.author}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}
          </ScrollView>
        )}

        {/* LIBRARY VIEW */}
        {currentScreen === "library" && (
          <ScrollView style={styles.homeScroll} showsVerticalScrollIndicator={false}>
            {/* Screen Quote Banner */}
            <View style={[styles.quoteCard, { backgroundColor: isDarkMode ? "#18181b" : "#f4f4f5", borderColor: themeStyle.border }]}>
              <View style={styles.quoteCircle}>
                <Text style={styles.quoteQuote}>“</Text>
              </View>
              <Text style={[styles.quoteText, { color: themeStyle.text }]}>
                The sun showers its warmth, and the city buzzes with life. Keep creative fires burning.
              </Text>
              <Text style={styles.quoteAuthor}>— Nairobi Chronicles</Text>
            </View>

            {/* My Books Section */}
            <View style={styles.sliderSec}>
              <Text style={[styles.sectionHeader, { color: themeStyle.text }]}>MY ACTIVE COMICS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sliderContent}>
                <TouchableOpacity style={styles.sliderItem} onPress={() => { setSelectedBook(CAPTAIN_MNGWANA_BOOK); navigateTo("detail"); }}>
                  <Image source={{ uri: CAPTAIN_MNGWANA_BOOK.coverUrl }} style={styles.sliderCover} />
                  <Text style={[styles.sliderTitle, { color: themeStyle.text }]} numberOfLines={1}>{CAPTAIN_MNGWANA_BOOK.title}</Text>
                  <Text style={styles.sliderAuthor}>Thayũ Kilili</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* My Audiobooks Section */}
            <View style={styles.sliderSec}>
              <Text style={[styles.sectionHeader, { color: themeStyle.text }]}>MY SOUNDTRACK PLAYS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sliderContent}>
                <TouchableOpacity style={styles.sliderItem} onPress={() => { setSelectedBook(CAPTAIN_MNGWANA_BOOK); navigateTo("audio"); }}>
                  <Image source={{ uri: CAPTAIN_MNGWANA_BOOK.coverUrl }} style={styles.sliderCover} />
                  <View style={styles.headphoneFloatingBadge}>
                    <Feather name="headphones" size={10} color="#fff" />
                  </View>
                  <Text style={[styles.sliderTitle, { color: themeStyle.text }]} numberOfLines={1}>{CAPTAIN_MNGWANA_BOOK.title}</Text>
                  <Text style={styles.sliderAuthor}>Full Audio Drama</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </ScrollView>
        )}

        {/* FAVORITES VIEW */}
        {currentScreen === "favorites" && (
          <View style={styles.simpleContainer}>
            <Text style={[styles.sectionHeader, { color: themeStyle.text, marginTop: 12 }]}>MY SAVED FAVORITES (1)</Text>
            <TouchableOpacity style={[styles.favItem, { backgroundColor: isDarkMode ? "#18181b" : "#edf2f7" }]} onPress={() => { setSelectedBook(CAPTAIN_MNGWANA_BOOK); navigateTo("detail"); }}>
              <Image source={{ uri: CAPTAIN_MNGWANA_BOOK.coverUrl }} style={styles.favCover} />
              <View style={styles.favMeta}>
                <Text style={[styles.favTitle, { color: themeStyle.text }]}>{CAPTAIN_MNGWANA_BOOK.title}</Text>
                <Text style={styles.favAuthor}>by Thayũ Kilili</Text>
                <Text style={styles.favBadge}>ORIGINAL EXCLUSIVE</Text>
              </View>
              <Feather name="heart" size={18} color="#ef4444" fill="#ef4444" style={{ marginRight: 8 }} />
            </TouchableOpacity>
          </View>
        )}

        {/* PROFILE VIEW */}
        {currentScreen === "profile" && (
          <ScrollView style={styles.homeScroll} showsVerticalScrollIndicator={false}>
            {/* User Profile Card */}
            <View style={[styles.userBadgeCard, { borderColor: themeStyle.border, backgroundColor: isDarkMode ? "#09090b" : "#f7fafc" }]}>
              <Image source={{ uri: profile.avatarUrl }} style={styles.profileAvatar} />
              <View style={styles.profileDetailsRow}>
                <Text style={[styles.profileUsername, { color: themeStyle.text }]}>{profile.username}</Text>
                <Text style={styles.profileEmail}>{profile.email}</Text>
                <TouchableOpacity style={styles.profileEditTrigger} onPress={() => setIsEditProfile(!isEditProfile)}>
                  <Text style={styles.profileEditTriggerText}>{isEditProfile ? "Cancel Options" : "Edit Details"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isEditProfile ? (
              <View style={styles.editProfileForm}>
                <Text style={[styles.formLabel, { color: themeStyle.text }]}>PEN NAME</Text>
                <TextInput
                  value={profile.username}
                  onChangeText={(text) => setProfile({ ...profile, username: text })}
                  style={[styles.authInput, { color: themeStyle.text, borderColor: themeStyle.border, backgroundColor: isDarkMode ? "#09090b" : "#ffffff" }]}
                />

                <Text style={[styles.formLabel, { color: themeStyle.text }]}>KENYAN PHONE CONTACT</Text>
                <View style={styles.phoneInputBox}>
                  <View style={[styles.kenyanFlagView, { borderColor: themeStyle.border }]}>
                    <View style={styles.flagStripeBlack} />
                    <View style={styles.flagStripeRed} />
                    <View style={styles.flagStripeGreen} />
                  </View>
                  <TextInput
                    value={profile.mobileNumber}
                    keyboardType="phone-pad"
                    onChangeText={(text) => setProfile({ ...profile, mobileNumber: text })}
                    style={[styles.authInput, { flex: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, color: themeStyle.text, borderColor: themeStyle.border, backgroundColor: isDarkMode ? "#09090b" : "#ffffff" }]}
                  />
                </View>

                <TouchableOpacity style={styles.primaryBtn} onPress={() => setIsEditProfile(false)}>
                  <Text style={styles.primaryBtnText}>Save Profile Changes</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.menuBox}>
                <TouchableOpacity style={styles.menuItem} onPress={() => setShowNotifications(true)}>
                  <Feather name="bell" size={16} color={isDarkMode ? "#fff" : "#000"} />
                  <Text style={[styles.menuItemText, { color: themeStyle.text }]}>Notifications Inbox</Text>
                  <Feather name="chevron-right" size={14} color="#a1a1aa" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => setShowFAQ(true)}>
                  <Feather name="help-circle" size={16} color={isDarkMode ? "#fff" : "#000"} />
                  <Text style={[styles.menuItemText, { color: themeStyle.text }]}>General FAQ</Text>
                  <Feather name="chevron-right" size={14} color="#a1a1aa" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => setShowPayModal(true)}>
                  <Feather name="shield" size={16} color={isDarkMode ? "#fff" : "#000"} />
                  <Text style={[styles.menuItemText, { color: themeStyle.text }]}>Manage Premium Tier</Text>
                  <Feather name="chevron-right" size={14} color="#a1a1aa" />
                </TouchableOpacity>

                <View style={styles.menuItemToggle}>
                  <View style={styles.menuToggleLabelCol}>
                    <Feather name="moon" size={16} color={isDarkMode ? "#fff" : "#000"} />
                    <Text style={[styles.menuItemTextToggle, { color: themeStyle.text }]}>Dark Appearance</Text>
                  </View>
                  <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
                </View>

                <TouchableOpacity style={styles.menuItem} onPress={() => navigateTo("welcome")}>
                  <Feather name="log-out" size={16} color="#ef4444" />
                  <Text style={[styles.menuItemText, { color: "#ef4444" }]}>Log out account</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        )}

        {/* BOOK DETAIL VIEW */}
        {currentScreen === "detail" && (
          <ScrollView style={styles.homeScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigateTo("home")}>
              <Feather name="arrow-left" size={18} color={themeStyle.text} />
              <Text style={[styles.backBtnText, { color: themeStyle.text }]}>Back</Text>
            </TouchableOpacity>

            <Image source={{ uri: selectedBook.coverUrl }} style={styles.detailCover} />
            <Text style={[styles.detailTitle, { color: themeStyle.text }]}>{selectedBook.title}</Text>
            <Text style={styles.detailAuthor}>Story edited by {selectedBook.author}</Text>

            <View style={styles.genresRowDetail}>
              {(selectedBook.genres || ["Nairobi Showcase"]).map((g) => (
                <View key={g} style={styles.genreBadge}>
                  <Text style={styles.genreBadgeText}>{g}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.detailDesc, { color: isDarkMode ? "#d4d4d8" : "#4a5568" }]}>
              {selectedBook.description}
            </Text>

            <View style={styles.detailActionsCol}>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => navigateTo("reader")}>
                <Text style={styles.primaryBtnText}>📖 Start Reading</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.secondaryBtn, { borderColor: themeStyle.border }]} onPress={() => navigateTo("audio")}>
                <Text style={[styles.secondaryBtnText, { color: themeStyle.text }]}>🎧 Play Swahili Narration</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* AUDIO PLAYER VIEW */}
        {currentScreen === "audio" && (
          <View style={styles.audioContainer}>
            <TouchableOpacity style={[styles.backBtn, { alignSelf: "flex-start", marginLeft: 16 }]} onPress={() => navigateTo("home")}>
              <Feather name="arrow-left" size={18} color={themeStyle.text} />
              <Text style={[styles.backBtnText, { color: themeStyle.text }]}>Back</Text>
            </TouchableOpacity>

            <View style={[styles.discCard, { borderColor: themeStyle.border }]}>
              <Animated.Image
                source={{ uri: selectedBook.coverUrl }}
                style={[styles.rotatingDiscImage, { transform: [{ rotate: recordSpin }] }]}
              />
              <View style={styles.discSpinnerHole} />
            </View>

            <Text style={[styles.audioTitle, { color: themeStyle.text }]}>{selectedBook.title}</Text>
            <Text style={styles.audioAuthor}>Voice Narration: Thayũ Kilili · 128kbps stereo</Text>

            {/* Simulated Animated Visualizer Waves */}
            <View style={styles.visualizerWaveBox}>
              <View style={[styles.waveBar, { height: isPlaying ? 24 : 8 }]} />
              <View style={[styles.waveBar, { height: isPlaying ? 38 : 12 }]} />
              <View style={[styles.waveBar, { height: isPlaying ? 16 : 6 }]} />
              <View style={[styles.waveBar, { height: isPlaying ? 42 : 14 }]} />
              <View style={[styles.waveBar, { height: isPlaying ? 22 : 8 }]} />
              <View style={[styles.waveBar, { height: isPlaying ? 32 : 10 }]} />
            </View>

            {/* Progress Slider */}
            <View style={styles.sliderProgressBox}>
              <View style={styles.sliderBackTrack} />
              <View style={styles.sliderFilledTrack} />
              <View style={styles.sliderPointerDot} />
            </View>
            <View style={styles.timeTextRow}>
              <Text style={styles.timeText}>01:54</Text>
              <Text style={styles.timeText}>05:00</Text>
            </View>

            {/* Playback Controls */}
            <View style={styles.playerControls}>
              <TouchableOpacity>
                <Feather name="skip-back" size={24} color={themeStyle.text} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButtonCircular} onPress={() => setIsPlaying(!isPlaying)}>
                <Feather name={isPlaying ? "pause" : "play"} size={24} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Feather name="skip-forward" size={24} color={themeStyle.text} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* WEBTOON COMIC READER STYLE OVERLAY */}
        {currentScreen === "reader" && (
          <ScrollView style={[styles.homeScroll, { backgroundColor: "#000" }]} showsVerticalScrollIndicator={false}>
            <View style={styles.readerHeaderRow}>
              <TouchableOpacity style={styles.inlineBackBtn} onPress={() => navigateTo("home")}>
                <Feather name="arrow-left" size={18} color="#fff" />
                <Text style={[styles.inlineBackText, { color: "#fff" }]}>Exit Reader</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.crimsonPanelFrame}>
              <Text style={styles.crimsonBadge}>CHAPTER ONE</Text>
              <Text style={styles.crimsonTitle}>Captain Mngwana vs. Kichwa Mbovu</Text>
              <Text style={styles.crimsonText}>
                Mngwana used to work at HEMSA, a governance board, until he was framed for signing an illegal procurement tender. Vowing to defend Nairobi, he developed his exclusive 'Achu Blesu' hybrid combat style.
              </Text>
              <Image source={{ uri: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?auto=format&fit=crop&w=400&q=80" }} style={styles.crimsonHeroImage} />
            </View>

            {/* Interactive Panels */}
            <View style={styles.comicPanelStream}>
              <View style={styles.comicNarrationBorder}>
                <Text style={styles.comicNarrationText}>
                  Kichwa Mbovu, a notorious rowdy matatu tout, commands his driver to speed recklessly across the Nairobi Highway, causing total confusion!
                </Text>
              </View>

              {/* Vector representation of Matatu bus */}
              <View style={styles.busIllustrationContainer}>
                <View style={styles.matatuBusBody}>
                  <View style={styles.matatuBusWindowsRow}>
                    <View style={styles.matatuWindow} />
                    <View style={styles.matatuWindow} />
                    <View style={styles.matatuWindow} />
                  </View>
                  <View style={styles.matatuFenderBar}>
                    <Text style={styles.matatuDecalPrint}>U.J.I.N.G.A BUS</Text>
                  </View>
                  <View style={styles.wheelsRow}>
                    <View style={styles.matatuWheel} />
                    <View style={styles.matatuWheel} />
                  </View>
                </View>

                {/* Speech Bubble */}
                <View style={styles.comicPanelBubble}>
                  <Text style={styles.bubbleText}>BEBA! BEBA! BEBA! KESI BAADAYE!</Text>
                </View>
              </View>

              <View style={styles.darkConfrontPanel}>
                <Text style={styles.comicNarrationTextOnDark}>
                  Captain Mngwana watches closely from the high towers of KICC, aligning his coordinates to terminate the madness once and for all.
                </Text>
                <View style={styles.glowMngwanaHead}>
                  <Text style={styles.ninjaMaskHead}>🥷</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        )}

      </View>

      {/* FIXED FLOATING DOCK NAV */}
      {currentScreen !== "splash" && currentScreen !== "welcome" && currentScreen !== "signin" && currentScreen !== "register" && currentScreen !== "genres" && currentScreen !== "plan" && currentScreen !== "slides" && (
        <View style={[styles.floatingDock, { backgroundColor: isDarkMode ? "#09090b" : "#ffffff", borderTopColor: themeStyle.border }]}>
          <TouchableOpacity style={styles.dockIconBtn} onPress={() => navigateTo("library")}>
            <Feather name="book-open" size={20} color={currentScreen === "library" ? "#3b82f6" : "#71717a"} />
            <Text style={[styles.dockText, { color: currentScreen === "library" ? "#3b82f6" : "#71717a" }]}>Read</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dockIconBtn} onPress={() => { setSelectedBook(CAPTAIN_MNGWANA_BOOK); navigateTo("audio"); }}>
            <Feather name="headphones" size={20} color={currentScreen === "audio" ? "#3b82f6" : "#71717a"} />
            <Text style={[styles.dockText, { color: currentScreen === "audio" ? "#3b82f6" : "#71717a" }]}>Listen</Text>
          </TouchableOpacity>

          {/* Home central Orb Trigger */}
          <TouchableOpacity style={styles.centralOrbBtn} onPress={() => navigateTo("home")}>
            <View style={[styles.centralOrbInner, { backgroundColor: isDarkMode ? "#fbbf24" : "#000" }]}>
              <Feather name="home" size={20} color={isDarkMode ? "#000" : "#fff"} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dockIconBtn} onPress={() => navigateTo("favorites")}>
            <Feather name="heart" size={20} color={currentScreen === "favorites" ? "#3b82f6" : "#71717a"} />
            <Text style={[styles.dockText, { color: currentScreen === "favorites" ? "#3b82f6" : "#71717a" }]}>Saved</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.dockIconBtn} onPress={() => navigateTo("profile")}>
            <Feather name="user" size={20} color={currentScreen === "profile" ? "#3b82f6" : "#71717a"} />
            <Text style={[styles.dockText, { color: currentScreen === "profile" ? "#3b82f6" : "#71717a" }]}>Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* NOTIFICATIONS MODAL */}
      <Modal visible={showNotifications} animationType="slide" transparent>
        <View style={styles.modalBackDrop}>
          <View style={styles.opaqueModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>NOTIFICATIONS</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Feather name="x" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalInnerBody}>
              <View style={styles.notifAlertItem}>
                <Text style={styles.notifAlertTitle}>🦁 LIONHEART PREMIUM ACTIVE</Text>
                <Text style={styles.notifAlertText}>Welcome to Nairobi's high-fidelity creative story circle.</Text>
              </View>
              <View style={styles.notifAlertItem}>
                <Text style={styles.notifAlertTitle}>🔥 CAPTAIN MNGWANA DETAILED CHAPTERS OUT</Text>
                <Text style={styles.notifAlertText}>Explore cinematic oral performances by local creator thayu.</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.modalCloseFullBtn} onPress={() => setShowNotifications(false)}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FAQ MODAL */}
      <Modal visible={showFAQ} animationType="slide" transparent>
        <View style={styles.modalBackDrop}>
          <View style={styles.opaqueModalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalHeaderTitle}>GENERAL FAQ</Text>
              <TouchableOpacity onPress={() => setShowFAQ(false)}>
                <Feather name="x" size={18} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ padding: 16 }}>
              {GENERAL_FAQ.map((faq, idx) => (
                <View key={idx} style={{ marginBottom: 16 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 13, marginBottom: 4 }}>Q: {faq.q}</Text>
                  <Text style={{ color: "#4a5568", fontSize: 13, lineHeight: 18 }}>A: {faq.a}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseFullBtn} onPress={() => setShowFAQ(false)}>
              <Text style={styles.modalCloseText}>Close FAQ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MPESA / CARD PREMIUM CHECKOUT MODAL */}
      <Modal visible={showPayModal} animationType="slide" transparent>
        <View style={styles.modalBackDrop}>
          <ScrollView contentContainerStyle={styles.subScrollWrap}>
            <View style={styles.opaqueModalCardSub}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalHeaderTitle}>RISTO CHECKOUT</Text>
                <TouchableOpacity onPress={() => setShowPayModal(false)}>
                  <Feather name="x" size={18} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.mPesaBanner}>
                <Text style={styles.mPesaLabel}>M-PESA / VISA CHANNELS DEPLOYED</Text>
              </View>

              <View style={{ padding: 16 }}>
                <Text style={styles.subFormLabel}>NAME ON DEBIT CARD</Text>
                <TextInput
                  placeholder="Thayũ Kilili"
                  style={styles.modalInputText}
                  value={cardName}
                  onChangeText={setCardName}
                />

                <Text style={styles.subFormLabel}>CARD NUMBER</Text>
                <TextInput
                  placeholder="4000-xxxx-xxxx-xxxx"
                  style={styles.modalInputText}
                  value={cardNumber}
                  onChangeText={setCardNumber}
                />

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subFormLabel}>EXPIRY DATE</Text>
                    <TextInput
                      placeholder="MM / YY"
                      style={styles.modalInputText}
                      value={cardExpiry}
                      onChangeText={setCardExpiry}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subFormLabel}>CVV CODE</Text>
                    <TextInput
                      placeholder="xxx"
                      secureTextEntry
                      style={styles.modalInputText}
                      value={cardCVV}
                      onChangeText={setCardCVV}
                    />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.modalSuccessBtn} onPress={() => setShowPayModal(false)}>
                <Text style={styles.modalSuccessBtnText}>Confirm $10.00 Subscription</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// =========================================================================
// STANDARD STYLING
// =========================================================================
const lightTheme = {
  bg: "#fafafa",
  text: "#09090b",
  border: "#e4e4e7",
};

const darkTheme = {
  bg: "#000000",
  text: "#ffffff",
  border: "#27272a",
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
  },
  blurredOrb1: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "rgba(79, 70, 229, 0.15)",
    top: SCREEN_HEIGHT / 4,
  },
  splashBrand: {
    fontSize: 54,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 6,
  },
  splashSubtitle: {
    fontSize: 14,
    color: "#a1a1aa",
    marginTop: 8,
    fontWeight: "600",
  },
  splashTapPrompt: {
    position: "absolute",
    bottom: 80,
    fontSize: 11,
    color: "#52525b",
    letterSpacing: 2,
    fontWeight: "700",
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  lionIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1c1917",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  lionEmoji: {
    fontSize: 32,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "900",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  welcomeDesc: {
    fontSize: 14,
    color: "#a1a1aa",
    textAlign: "center",
    marginBottom: 36,
    lineHeight: 20,
  },
  primaryBtn: {
    width: "100%",
    height: 48,
    backgroundColor: "#4f46e5",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  secondaryBtn: {
    width: "100%",
    height: 48,
    backgroundColor: "transparent",
    borderRadius: 24,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  termsText: {
    fontSize: 10,
    color: "#71717a",
  },
  authContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  authTitle: {
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  authInput: {
    width: "100%",
    height: 48,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 13,
    marginBottom: 14,
  },
  authLink: {
    color: "#3b82f6",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 12,
  },
  genresContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  genresRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 32,
  },
  genresRowDetail: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  genrePillActive: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#1c1917",
    borderWidth: 1.5,
    borderRadius: 20,
  },
  genrePillTextActive: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  planCard: {
    width: "100%",
    padding: 20,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 28,
  },
  planCardHeader: {
    color: "#fbbf24",
    fontWeight: "900",
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 2,
  },
  planCardPrice: {
    fontSize: 22,
    fontWeight: "950",
    marginBottom: 16,
  },
  planCardBenefit: {
    color: "#71717a",
    fontSize: 12,
    marginBottom: 8,
  },
  tutorialContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  tutorialEmoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  tutorialTitle: {
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  tutorialBody: {
    fontSize: 13,
    color: "#a1a1aa",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  homeScroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
  },
  clearText: {
    color: "#ef4444",
    fontSize: 12,
    fontWeight: "800",
  },
  searchResultsSec: {
    paddingBottom: 40,
  },
  searchItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchCoverImage: {
    width: 60,
    height: 75,
    borderRadius: 12,
    marginRight: 12,
  },
  searchMeta: {
    flex: 1,
  },
  searchTitle: {
    fontSize: 13,
    fontWeight: "900",
  },
  searchAuthor: {
    fontSize: 11,
    color: "#a1a1aa",
    marginTop: 2,
  },
  searchCategory: {
    fontSize: 8,
    color: "#ef4444",
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 4,
  },
  heroBanner: {
    width: "100%",
    height: 380,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 24,
    backgroundColor: "#000",
  },
  heroCover: {
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.75,
  },
  heroGradientOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  heroSubtitle: {
    color: "#fbbf24",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "950",
    marginBottom: 16,
    textTransform: "uppercase",
  },
  readNowBtn: {
    backgroundColor: "#ffffff",
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  readNowText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 14,
    textTransform: "uppercase",
  },
  sliderSec: {
    marginBottom: 28,
  },
  sliderContent: {
    paddingRight: 16,
  },
  sliderItem: {
    width: 140,
    marginRight: 14,
  },
  sliderCover: {
    width: 140,
    height: 175,
    borderRadius: 20,
    marginBottom: 8,
  },
  sliderTitle: {
    fontSize: 12,
    fontWeight: "900",
  },
  sliderAuthor: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 2,
  },
  headphoneFloatingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  quoteCard: {
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    marginBottom: 24,
  },
  quoteCircle: {
    backgroundColor: "#4f46e5",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  quoteQuote: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
  quoteText: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22,
  },
  quoteAuthor: {
    color: "#71717a",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 8,
  },
  simpleContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  favItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  favCover: {
    width: 50,
    height: 62,
    borderRadius: 10,
    marginRight: 12,
  },
  favMeta: {
    flex: 1,
  },
  favTitle: {
    fontSize: 12,
    fontWeight: "800",
  },
  favAuthor: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 2,
  },
  favBadge: {
    color: "#3b82f6",
    fontSize: 8,
    fontWeight: "900",
    marginTop: 4,
  },
  userBadgeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  profileDetailsRow: {
    flex: 1,
  },
  profileUsername: {
    fontSize: 18,
    fontWeight: "900",
  },
  profileEmail: {
    fontSize: 12,
    color: "#71717a",
    marginTop: 2,
  },
  profileEditTrigger: {
    marginTop: 6,
  },
  profileEditTriggerText: {
    fontSize: 11,
    color: "#4f46e5",
    fontWeight: "700",
  },
  editProfileForm: {
    marginBottom: 32,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 6,
    marginTop: 8,
  },
  phoneInputBox: {
    flexDirection: "row",
  },
  kenyanFlagView: {
    width: 54,
    height: 48,
    borderWidth: 1.5,
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    justifyContent: "space-around",
    alignItems: "stretch",
    paddingVertical: 8,
    backgroundColor: "#000",
  },
  flagStripeBlack: {
    height: 4,
    backgroundColor: "#000000",
  },
  flagStripeRed: {
    height: 4,
    backgroundColor: "#991b1b",
  },
  flagStripeGreen: {
    height: 4,
    backgroundColor: "#166534",
  },
  menuBox: {
    marginBottom: 40,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
  },
  menuItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  menuItemToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#18181b",
  },
  menuToggleLabelCol: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemTextToggle: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "600",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 12,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  inlineBackBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  inlineBackText: {
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 6,
  },
  detailCover: {
    width: "100%",
    height: 240,
    borderRadius: 24,
    marginBottom: 16,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "950",
    letterSpacing: 0.5,
  },
  detailAuthor: {
    fontSize: 13,
    color: "#71717a",
    marginTop: 4,
    marginBottom: 16,
  },
  genreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#4f46e5",
    borderRadius: 14,
  },
  genreBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  detailDesc: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 24,
  },
  detailActionsCol: {
    gap: 12,
    marginBottom: 40,
  },
  audioContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  discCard: {
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginTop: 16,
    marginBottom: 24,
    position: "relative",
    backgroundColor: "#000",
  },
  rotatingDiscImage: {
    width: "100%",
    height: "100%",
    borderRadius: 110,
    opacity: 0.8,
  },
  discSpinnerHole: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000000",
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  audioTitle: {
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  audioAuthor: {
    fontSize: 12,
    color: "#71717a",
    marginTop: 4,
    marginBottom: 24,
  },
  visualizerWaveBox: {
    flexDirection: "row",
    alignItems: "end",
    justifyContent: "center",
    gap: 8,
    height: 44,
    marginBottom: 32,
  },
  waveBar: {
    width: 6,
    backgroundColor: "#4f46e5",
    borderRadius: 3,
  },
  sliderProgressBox: {
    width: "100%",
    height: 4,
    backgroundColor: "#27272a",
    borderRadius: 2,
    position: "relative",
    marginBottom: 8,
  },
  sliderBackTrack: {
    width: "100%",
    height: "100%",
    borderRadius: 2,
  },
  sliderFilledTrack: {
    width: "38%",
    height: "100%",
    backgroundColor: "#4f46e5",
    position: "absolute",
    borderRadius: 2,
  },
  sliderPointerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    position: "absolute",
    top: -4,
    left: "37%",
  },
  timeTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 28,
  },
  timeText: {
    fontSize: 11,
    color: "#71717a",
    fontFamily: "monospace",
  },
  playerControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
    marginBottom: 40,
  },
  playButtonCircular: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  readerHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  readerHeadTitle: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "900",
    marginLeft: 16,
  },
  crimsonPanelFrame: {
    backgroundColor: "#1c1917",
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
  },
  crimsonBadge: {
    color: "#ef4444",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 6,
  },
  crimsonTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  crimsonText: {
    color: "#d4d4d8",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  crimsonHeroImage: {
    width: "100%",
    height: 200,
    borderRadius: 14,
  },
  comicPanelStream: {
    gap: 16,
    paddingBottom: 40,
  },
  comicNarrationBorder: {
    borderLeftWidth: 3,
    borderColor: "#ef4444",
    paddingLeft: 12,
  },
  comicNarrationText: {
    color: "#ffffff",
    fontSize: 12,
    lineHeight: 18,
  },
  busIllustrationContainer: {
    alignItems: "center",
    paddingVertical: 14,
  },
  matatuBusBody: {
    width: "90%",
    height: 90,
    backgroundColor: "#fbbf24",
    borderRadius: 12,
    position: "relative",
    padding: 10,
  },
  matatuBusWindowsRow: {
    flexDirection: "row",
    gap: 10,
  },
  matatuWindow: {
    width: 44,
    height: 24,
    backgroundColor: "#52525b",
    borderRadius: 4,
  },
  matatuFenderBar: {
    position: "absolute",
    bottom: 12,
    left: 10,
    right: 10,
    height: 20,
    backgroundColor: "#27272a",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  matatuDecalPrint: {
    color: "#ef4444",
    fontWeight: "900",
    fontSize: 9,
  },
  wheelsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    bottom: -10,
    left: 0,
    right: 0,
  },
  matatuWheel: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#000",
    borderWidth: 2,
    borderColor: "#71717a",
  },
  comicPanelBubble: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
    marginTop: 20,
    alignSelf: "center",
    borderWidth: 1.5,
    borderColor: "#000",
  },
  bubbleText: {
    color: "#000005",
    fontWeight: "900",
    fontSize: 11,
  },
  darkConfrontPanel: {
    backgroundColor: "#09090b",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  comicNarrationTextOnDark: {
    color: "#a1a1aa",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 16,
  },
  glowMngwanaHead: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#18181b",
    borderColor: "#4f46e5",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  ninjaMaskHead: {
    fontSize: 24,
  },
  floatingDock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 72,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  dockIconBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dockText: {
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
  },
  centralOrbBtn: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    top: -14,
  },
  centralOrbInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  modalBackDrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  opaqueModalCard: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  opaqueModalCardSub: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  modalHeaderTitle: {
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1.5,
  },
  modalInnerBody: {
    paddingVertical: 12,
  },
  notifAlertItem: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f7fafc",
    borderRadius: 14,
  },
  notifAlertTitle: {
    fontSize: 11,
    fontWeight: "900",
    color: "#ef4444",
    marginBottom: 4,
  },
  notifAlertText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#4a5568",
  },
  modalCloseFullBtn: {
    backgroundColor: "#000",
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCloseText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
  subScrollWrap: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
  },
  mPesaBanner: {
    backgroundColor: "#166534",
    paddingVertical: 10,
    alignItems: "center",
  },
  mPesaLabel: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  subFormLabel: {
    fontSize: 9,
    fontWeight: "900",
    color: "#71717a",
    marginBottom: 6,
    marginTop: 10,
  },
  modalInputText: {
    height: 42,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: "#000",
  },
  modalSuccessBtn: {
    backgroundColor: "#166534",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
  },
  modalSuccessBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});
