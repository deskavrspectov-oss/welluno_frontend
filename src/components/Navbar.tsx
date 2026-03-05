import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // <-- new import
import { Menu, X, Moon, Sun, Sparkles, ChevronRight, ExternalLink, Gamepad2, Brain, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import wellunoLogo from "@/assets/welluno-logo.jpg";

// Updated navLinks – now includes Blog link
const navLinks = [
  { href: "#about", label: "What", emoji: "" },
  { href: "#wellness-game", label: "Play", emoji: "" },
  { href: "#spectrum", label: "Mental Health", emoji: "", icon: Brain },
  { href: "#solutions", label: "How", emoji: "" },
  { href: "#events", label: "For Me", emoji: "" },
  { href: "#organizations", label: "For Organizations", emoji: "" },
  { href: "#board", label: "Team", emoji: "" },
  { href: "#community", label: "Community", emoji: "" },
  { href: "/blog", label: "Blog", emoji: "" }, // <-- new link
  { href: "#community", label: "Join Waitlist", emoji: "✨", icon: Sparkles },
];

const Navbar = () => {
  const navigate = useNavigate(); // <-- new hook
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHover, setActiveHover] = useState("");
  const navRef = useRef<HTMLElement>(null);

  // Check initial dark mode from system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
    }
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Updated navigation handler – uses react-router for internal paths
  const handleNavClick = (href: string) => {
    if (href.startsWith("/")) {
      navigate(href); // use React Router for internal pages like /blog
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsOpen(false);
  };

  // Function to get text color based on scroll and dark mode
  const getTextColor = () => {
    if (isDark) {
      return "text-white";
    } else {
      return scrolled ? "text-gray-900" : "text-gray-900";
    }
  };

  // Function to get background based on scroll and dark mode
  const getBackground = () => {
    if (isDark) {
      return scrolled 
        ? "bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-2xl" 
        : "bg-transparent";
    } else {
      return scrolled 
        ? "bg-white/98 backdrop-blur-xl border-b border-gray-200 shadow-xl" 
        : "bg-transparent";
    }
  };

  // Check if a link is the Waitlist/Launch CTA
  const isCtaLink = (label: string) => {
    return label === "Join Waitlist";
  };

  // Check if a link is Mental Health
  const isHealthTipsLink = (label: string) => {
    return label === "Mental Health";
  };

  return (
    <>
      {/* Navigation */}
      <motion.header
        ref={navRef}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.22, 1, 0.36, 1],
          delay: 0.1 
        }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getBackground()}`}
      >
        {/* Animated background gradient - Only show when scrolled */}
        {scrolled && (
          <motion.div 
            className="absolute inset-0"
            animate={{
              background: isDark ? [
                "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, rgba(236,72,153,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, rgba(245,158,11,0.15) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, rgba(59,130,246,0.15) 0%, transparent 50%)",
              ] : [
                "radial-gradient(circle at 0% 0%, rgba(99,102,241,0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, rgba(236,72,153,0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, rgba(245,158,11,0.08) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, rgba(59,130,246,0.08) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* Subtle overlay for better text contrast when scrolled */}
        {scrolled && (
          <div className={`absolute inset-0 ${
            isDark 
              ? "bg-gradient-to-b from-gray-900/90 via-gray-900/85 to-gray-900/90" 
              : "bg-gradient-to-b from-white/95 via-white/90 to-white/95"
          }`} />
        )}

        {/* Floating particles - Only in dark mode or when scrolled */}
        {(isDark || scrolled) && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-[2px] h-[2px] rounded-full ${
                  isDark ? "bg-primary/50" : "bg-primary/30"
                }`}
                animate={{
                  x: [0, Math.sin(i) * 60, 0],
                  y: [0, Math.cos(i) * 30, 0],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Infinity,
                  delay: i * 0.3,
                }}
                style={{
                  left: `${15 + i * 12}%`,
                  top: `${15 + i * 5}%`,
                }}
              />
            ))}
          </div>
        )}

        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center gap-2 sm:gap-3 group relative"
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div
                variants={{
                  hover: { 
                    scale: 1.05,
                    transition: {
                      duration: 0.2,
                      ease: "easeOut"
                    }
                  },
                  tap: { scale: 0.95 }
                }}
                className="relative"
              >
                {/* Logo glow effect */}
                <motion.div
                  className={`absolute inset-0 rounded-xl blur-lg ${
                    isDark 
                      ? "bg-gradient-to-br from-primary/60 to-coral/60" 
                      : "bg-gradient-to-br from-primary/40 to-coral/40"
                  }`}
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
                
                {/* Logo image */}
                <img
                  src={wellunoLogo}
                  alt="Welluno Logo"
                  className="relative h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl object-cover border-2 shadow-xl"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                  }}
                />
                
                {/* Logo border animation */}
                <motion.div
                  className="absolute inset-0 rounded-xl border-2"
                  animate={{
                    borderColor: isDark 
                      ? ["rgba(99,102,241,0.3)", "rgba(99,102,241,0.6)", "rgba(99,102,241,0.3)"]
                      : ["rgba(99,102,241,0.2)", "rgba(99,102,241,0.4)", "rgba(99,102,241,0.2)"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
              
              <div className="flex flex-col items-start">
                <motion.span
                  className={`text-xl sm:text-2xl lg:text-3xl font-bold font-display tracking-tight ${getTextColor()}`}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  WELLUNO
                </motion.span>
                <motion.span
                  className={`text-xs sm:text-sm mt-0.5 font-medium ${
                    isDark 
                      ? scrolled ? "text-gray-300" : "text-gray-400"
                      : scrolled ? "text-gray-600" : "text-gray-600"
                  }`}
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Own Your Story
                </motion.span>
              </div>

              {/* Logo hover effect trail */}
              <motion.div
                className="absolute -inset-3 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0"
                initial={{ opacity: 0, x: -10 }}
                variants={{
                  hover: {
                    opacity: 1,
                    x: 10,
                    transition: {
                      duration: 0.3,
                      ease: "easeOut",
                    },
                  },
                }}
              />
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1 relative">
              {/* Animated background for active hover */}
              <AnimatePresence>
                {activeHover && !isCtaLink(navLinks.find(link => link.href === activeHover)?.label || "") && (
                  <motion.div
                    layoutId="navHoverBg"
                    className={`absolute h-12 rounded-xl backdrop-blur-sm ${
                      isDark
                        ? "bg-gradient-to-r from-primary/20 to-coral/20 border border-white/10 shadow-lg"
                        : "bg-gradient-to-r from-primary/10 to-coral/10 border border-gray-200/50 shadow-md"
                    }`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
              </AnimatePresence>

              {navLinks.map((link, index) => {
                const isCta = isCtaLink(link.label);
                const isHealthTips = isHealthTipsLink(link.label);
                const Icon = link.icon;
                
                return (
                  <motion.div
                    key={`${link.href}-${link.label}`}
                    className="relative"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        delay: index * 0.08 + 0.2,
                        duration: 0.3,
                      }
                    }}
                    onMouseEnter={() => !isCta && setActiveHover(link.href)}
                    onMouseLeave={() => !isCta && setActiveHover("")}
                  >
                    {isCta ? (
                      <motion.div
                        className="relative"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button 
                          variant="hero" 
                          size="lg" 
                          onClick={() => handleNavClick(link.href)}
                          className="relative overflow-hidden group px-6 ml-2"
                        >
                          <motion.span
                            className="relative z-10 flex items-center gap-2 font-semibold"
                            animate={{ scale: [1, 1.02, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Sparkles className="w-5 h-5" />
                            Join Waitlist
                          </motion.span>
                          
                          {/* Animated gradient background */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary via-coral to-gold"
                            animate={{
                              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            style={{
                              backgroundSize: "200% 200%",
                            }}
                          />
                          
                          {/* Shine effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "100%" }}
                            transition={{ duration: 0.5 }}
                          />
                          
                          {/* Glow effect */}
                          <motion.div
                            className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-coral/30 to-gold/30 blur-xl"
                            animate={{
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.button
                        onClick={() => handleNavClick(link.href)}
                        className={`px-3 py-3 rounded-xl font-medium relative z-10 transition-all duration-200 text-sm xl:text-base ${
                          isDark
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-700 hover:text-gray-900"
                        } ${isHealthTips ? "font-semibold" : ""}`}
                        whileHover={{ 
                          scale: 1.03,
                          transition: { type: "spring", stiffness: 400 }
                        }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span className="relative flex items-center gap-2">
                          {link.label === "Play" && (
                            <motion.span
                              animate={{ 
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 0.9, 1]
                              }}
                              transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                              }}
                              className="text-lg"
                            >
                              🎮
                            </motion.span>
                          )}
                          {link.emoji && link.label !== "Play" && (
                            <span className="text-lg">{link.emoji}</span>
                          )}
                          {Icon && !link.emoji && (
                            <Icon className="w-4 h-4" />
                          )}
                          {link.label}
                          <motion.span
                            className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full"
                            style={{
                              background: isHealthTips 
                                ? "linear-gradient(to right, #8b5cf6, #ec4899)" // Purple to pink for mental health
                                : "linear-gradient(to right, var(--primary), var(--gold))"
                            }}
                            initial={false}
                            animate={{ 
                              width: activeHover === link.href ? "100%" : "0%" 
                            }}
                            transition={{ duration: 0.2 }}
                          />
                        </span>
                        
                        {/* Special indicator for Mental Health */}
                        {isHealthTips && (
                          <motion.div
                            className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                            }}
                          />
                        )}
                        
                        {/* Floating particles on hover */}
                        {activeHover === link.href && (
                          <motion.div
                            className="absolute inset-0 overflow-hidden pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={i}
                                className={`absolute w-[2px] h-[2px] rounded-full ${
                                  isDark ? "bg-primary" : "bg-primary"
                                }`}
                                animate={{
                                  y: [0, -15, 0],
                                  x: [0, Math.sin(i) * 8, 0],
                                  opacity: [0, 1, 0],
                                }}
                                transition={{
                                  duration: 1.2,
                                  delay: i * 0.1,
                                  repeat: Infinity,
                                }}
                                style={{
                                  left: `${25 + i * 16}%`,
                                  bottom: 0,
                                }}
                              />
                            ))}
                          </motion.div>
                        )}
                      </motion.button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Right side buttons - Now only dark mode toggle since CTA is in nav */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Dark mode toggle */}
              <motion.button
                onClick={() => setIsDark(!isDark)}
                className={`relative p-2 rounded-xl border transition-all duration-200 group ${
                  isDark
                    ? scrolled
                      ? "bg-gray-800/50 border-gray-700 hover:border-primary/50 hover:bg-gray-800/70"
                      : "bg-gray-800/40 border-gray-700/50 hover:border-primary/50 hover:bg-gray-800/60"
                    : scrolled
                      ? "bg-gray-100/90 border-gray-300 hover:border-primary/50 hover:bg-gray-200/90"
                      : "bg-white/40 border-gray-300/50 hover:border-primary/50 hover:bg-white/60"
                }`}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <>
                    <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-yellow-500/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </>
                ) : (
                  <>
                    <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0.1, 0.25, 0.1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </>
                )}
                
                {/* Toggle particles */}
                <motion.div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  initial={false}
                  animate={isDark ? "light" : "dark"}
                  variants={{
                    light: {
                      transition: { staggerChildren: 0.05 }
                    },
                    dark: {
                      transition: { staggerChildren: 0.05 }
                    }
                  }}
                >
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-[1px] h-[1px] rounded-full"
                      variants={{
                        light: {
                          scale: [0, 1, 0],
                          opacity: [0, 0.8, 0],
                          x: [0, Math.cos(i) * 12],
                          y: [0, Math.sin(i) * 12],
                        },
                        dark: {
                          scale: [0, 1, 0],
                          opacity: [0, 0.8, 0],
                          x: [0, -Math.cos(i) * 12],
                          y: [0, -Math.sin(i) * 12],
                        }
                      }}
                      transition={{ duration: 0.6 }}
                      style={{
                        left: "50%",
                        top: "50%",
                        backgroundColor: isDark ? '#fbbf24' : '#3b82f6'
                      }}
                    />
                  ))}
                </motion.div>
              </motion.button>

              {/* Mobile Menu Toggle */}
              <motion.button
                className={`lg:hidden p-2 rounded-xl transition-all duration-200 relative ${
                  isDark
                    ? "hover:bg-gray-800/50 text-gray-200"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 45, opacity: 0 }}
                      className="relative"
                    >
                      <X size={22} />
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-primary/10"
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 45, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -45, opacity: 0 }}
                      className="relative"
                    >
                      <Menu size={22} />
                      <motion.div
                        className={`absolute inset-0 rounded-lg ${
                          isDark ? "bg-white/5" : "bg-black/5"
                        }`}
                        animate={{ 
                          scale: [1, 1.1, 1],
                          opacity: [0.4, 0.7, 0.4],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Enhanced Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Animated Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-lg lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                mass: 0.8,
              }}
              className={`fixed top-0 right-0 bottom-0 z-50 w-full sm:w-96 max-w-full border-l shadow-2xl lg:hidden overflow-hidden ${
                isDark 
                  ? "bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 border-gray-800" 
                  : "bg-gradient-to-b from-white via-gray-50 to-gray-100 border-gray-200"
              }`}
            >
              {/* Menu Header */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`flex items-center justify-between p-6 border-b ${
                  isDark 
                    ? "border-gray-800 bg-gradient-to-r from-gray-800 to-gray-900" 
                    : "border-gray-200 bg-gradient-to-r from-gray-100 to-white"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <motion.div
                      className={`absolute inset-0 rounded-xl blur-md ${
                        isDark 
                          ? "bg-gradient-to-br from-primary/40 to-coral/40" 
                          : "bg-gradient-to-br from-primary/30 to-coral/30"
                      }`}
                      animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.3, 0.5, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <img
                      src={wellunoLogo}
                      alt="Welluno Logo"
                      className={`relative h-12 w-12 rounded-xl object-cover border-2 ${
                        isDark ? "border-gray-700" : "border-gray-300"
                      }`}
                    />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-bold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}>
                      WELLUNO
                    </h3>
                    <p className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}>
                      Own Your Story
                    </p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? "hover:bg-gray-800 text-gray-300" 
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={24} />
                </motion.button>
              </motion.div>

              {/* Menu Items */}
              <div className="p-4 space-y-2">
                {navLinks.map((link, index) => {
                  const isCta = isCtaLink(link.label);
                  const isHealthTips = isHealthTipsLink(link.label);
                  const Icon = link.icon;
                  
                  return (
                    <motion.button
                      key={`mobile-${link.href}-${link.label}`}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ 
                        delay: index * 0.08 + 0.2,
                        type: "spring",
                        stiffness: 100
                      }}
                      onClick={() => handleNavClick(link.href)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                        isDark
                          ? "hover:bg-gray-800/50 text-gray-200 hover:text-white"
                          : "hover:bg-gray-100 text-gray-800 hover:text-gray-900"
                      } ${isCta ? "bg-gradient-to-r from-primary/10 to-coral/10 border border-primary/20" : ""}`}
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-lg font-medium flex items-center gap-3">
                        {link.emoji && <span className="text-xl">{link.emoji}</span>}
                        {Icon && !link.emoji && <Icon className="w-5 h-5" />}
                        {link.label}
                        {isHealthTips && (
                          <span className="text-xs px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400 rounded-full">
                            New
                          </span>
                        )}
                      </span>
                      <motion.div
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 + 0.3 }}
                      >
                        {isCta ? (
                          <Sparkles className="w-5 h-5 text-amber-500" />
                        ) : (
                          <ChevronRight className={`w-5 h-5 transition-all duration-200 ${
                            isDark 
                              ? "text-gray-500 group-hover:text-primary group-hover:translate-x-1" 
                              : "text-gray-400 group-hover:text-primary group-hover:translate-x-1"
                          }`} />
                        )}
                      </motion.div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Dark mode toggle in mobile menu */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className={`absolute bottom-0 left-0 right-0 p-6 border-t ${
                  isDark 
                    ? "border-gray-800 bg-gradient-to-t from-gray-900 via-gray-900 to-transparent" 
                    : "border-gray-200 bg-gradient-to-t from-white via-gray-50 to-transparent"
                }`}
              >
                <motion.button
                  onClick={() => setIsDark(!isDark)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 w-full justify-center ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isDark ? (
                    <>
                      <Sun className="w-5 h-5 text-yellow-400" />
                      <span className="text-sm font-medium">Switch to Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium">Switch to Dark Mode</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-coral to-gold z-50 origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: scrolled ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        style={{ 
          transformOrigin: "0%",
          boxShadow: "0 0 15px rgba(245,158,11,0.4)" 
        }}
      />
    </>
  );
};

export default Navbar;