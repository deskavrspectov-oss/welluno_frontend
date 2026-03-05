import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Sparkles, Heart, Users, Rocket, ArrowRight, Target, Shield, Brain } from "lucide-react";
import SurpriseButton from "./SurpriseButton";
import { Button } from "./ui/button";

const floatingVariants = {
  animate: (delay: number = 0) => ({
    y: [0, -15, 0],
    rotate: [0, 5, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut" as const,
    },
  }),
};

const HeroSection = () => {
  const ref = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isWorkHovered, setIsWorkHovered] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  // Detect dark mode
  useEffect(() => {
    const updateDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    updateDarkMode();
    
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  // Animated particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 8,
  }));

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 lg:pt-20 transition-colors duration-500"
    >
      {/* Main background gradient */}
      <div className={`absolute inset-0 transition-all duration-500 ${
        isDarkMode 
          ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800" 
          : "bg-gradient-to-br from-blue-50 via-background to-purple-50"
      }`} />
      
      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${
              isDarkMode ? "bg-primary/15" : "bg-primary/10"
            }`}
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.sin(particle.id) * 40, 0],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.id * 0.3,
            }}
          />
        ))}
      </div>

      {/* Parallax Background Elements */}
      <motion.div 
        style={{ y, scale }} 
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {/* Large gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl ${
            isDarkMode 
              ? "bg-gradient-to-br from-primary/15 via-coral/10 to-transparent" 
              : "bg-gradient-to-br from-primary/10 via-coral/5 to-transparent"
          }`}
        />
        
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className={`absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl ${
            isDarkMode 
              ? "bg-gradient-to-br from-gold/15 via-primary/10 to-transparent" 
              : "bg-gradient-to-br from-gold/10 via-primary/5 to-transparent"
          }`}
        />

        {/* Center orb */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl ${
            isDarkMode 
              ? "bg-gradient-to-br from-primary/15 via-coral/15 to-gold/15" 
              : "bg-gradient-to-br from-primary/10 via-coral/10 to-gold/10"
          }`}
        />
      </motion.div>

      {/* Animated grid pattern */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" 
          : "bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]"
      } bg-[size:40px_40px] opacity-30`} />

      {/* Floating decorative elements */}
      <motion.div
        custom={0}
        variants={floatingVariants}
        animate="animate"
        className="absolute top-20 left-4 sm:left-8"
      >
        <div className="relative">
          <div className={`absolute inset-0 rounded-full blur-md ${
            isDarkMode ? "bg-primary/20" : "bg-primary/15"
          }`} />
          <Sparkles className="relative w-5 h-5 sm:w-6 sm:h-6 text-gold" />
        </div>
      </motion.div>
      
      <motion.div
        custom={1}
        variants={floatingVariants}
        animate="animate"
        className="absolute top-24 right-4 sm:right-8"
      >
        <div className="relative">
          <div className={`absolute inset-0 rounded-full blur-md ${
            isDarkMode ? "bg-coral/20" : "bg-coral/15"
          }`} />
          <Heart className="relative w-5 h-5 sm:w-6 sm:h-6 text-coral" />
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div 
        style={{ opacity }} 
        className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Launch Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className={`inline-flex items-center gap-2 backdrop-blur-sm rounded-full px-4 sm:px-5 py-2 mb-6 sm:mb-8 shadow-lg border ${
              isDarkMode 
                ? "bg-gray-800/50 border border-gray-700/50" 
                : "bg-white/70 border border-gray-200/50"
            }`}
          >
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative flex h-2 w-2"
            >
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </motion.span>
            <motion.span 
              className={`text-xs sm:text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Launching Soon 
            </motion.span>
          </motion.div>

          {/* SEO H1: Corporate Mental Wellness Platform in India */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`text-lg sm:text-xl md:text-2xl font-medium tracking-wide mb-2 ${
              isDarkMode ? "text-primary/80" : "text-primary"
            }`}
          >
            Corporate Mental Wellness Platform in India
          </motion.h1>

          {/* Main Heading (now H2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4 sm:mb-6"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
              <span className="block mb-1">
                <span className={`${
                  isDarkMode ? "text-white" : "text-gray-900"
                } font-display`}>Let's Make</span>{" "}
                <motion.span 
                  className="relative inline-block font-bebas tracking-wider cursor-pointer"
                  onMouseEnter={() => setIsWorkHovered(true)}
                  onMouseLeave={() => setIsWorkHovered(false)}
                  style={{ perspective: 1000 }}
                >
                  {/* Rainbow gradient overlay that disappears on hover */}
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary via-coral to-gold bg-[length:200%_100%] bg-clip-text text-transparent"
                    animate={{ 
                      opacity: isWorkHovered ? 0 : 1,
                      backgroundPosition: isWorkHovered ? "100% 50%" : "0% 50%"
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: "easeInOut"
                    }}
                  >
                    WORK
                  </motion.span>
                  
                  {/* Solid text underneath */}
                  <span className={`relative ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  } font-bebas tracking-wider`}>
                    WORK
                  </span>
                  
                  {/* Shine effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: isWorkHovered ? "100%" : "-100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                </motion.span>
              </span>
              <span className="block">
                <span className={`${
                  isDarkMode ? "text-white" : "text-gray-900"
                } font-display`}>Human</span>{" "}
                <motion.span 
                  className="font-script text-coral inline-block"
                  animate={{ 
                    rotate: [0, 3, -3, 0],
                    y: [0, -3, 0]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  Again
                </motion.span>
              </span>
            </h2>
          </motion.div>

          {/* Animated underline */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "160px" }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="h-1 bg-gradient-to-r from-primary via-coral to-gold rounded-full mx-auto mb-4 sm:mb-6"
          />

          {/* SEO H3: AI-powered emotional insights & live workplace wellness experiences */}
          <motion.h3
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className={`text-xl sm:text-2xl md:text-3xl font-semibold mb-3 ${
              isDarkMode ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Live, human-led workplace wellness experiences that reduce stress, prevent burnout, and build stronger teams.
          </motion.h3>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 font-medium"
          >
            <motion.span 
              className={`font-script inline-flex items-center gap-2 ${
                isDarkMode ? "text-gold" : "text-gold"
              }`}
              animate={{ 
                scale: [1, 1.03, 1],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              Own Your Story
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.span>
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={`text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Corporate wellness reimagined with{" "}
            <span className={`font-semibold ${isDarkMode ? "text-primary" : "text-primary"}`}>
              thoughtfully crafted live experiences
            </span>{" "}
            that{" "}
            <span className={`font-semibold ${isDarkMode ? "text-coral" : "text-coral"}`}>
              spark connection
            </span>{" "}
            and help people{" "}
            <span className={`font-semibold ${isDarkMode ? "text-gold" : "text-gold"}`}>
              truly feel alive
            </span>
            .
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4 mb-8 sm:mb-12"
          >
            <SurpriseButton
              href="#launch"
              variant="hero"
              size="lg"
              surpriseType="rainbow"
              className="w-full sm:w-auto group"
            >
              <span className="flex items-center gap-2">
                <motion.div
                  animate={{ 
                    rotate: 360,
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                >
                  <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
                Join the Movement
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </SurpriseButton>
            
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className={`w-full sm:w-auto relative overflow-hidden group backdrop-blur-sm ${
                isDarkMode 
                  ? "border-gray-700 hover:border-primary/50 text-gray-300 hover:text-white bg-gray-900/30" 
                  : "border-gray-300 hover:border-primary/50 text-gray-700 hover:text-gray-900 bg-white/50"
              }`}
            >
              <a href="#about" className="relative">
                <span className="relative z-10 flex items-center gap-2">
                  Learn More
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
                <motion.div
                  className={`absolute inset-0 ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-100"
                  }`}
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </a>
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 sm:mt-12 flex flex-wrap justify-center items-center gap-3 sm:gap-4 px-4"
          >
            {[
              { icon: Shield, text: "Prevention-First", color: "text-primary", bgColor: "bg-primary/10" },
              { icon: Brain, text: "Human Touch", color: "text-coral", bgColor: "bg-coral/10" },
              { icon: Target, text: "Built for All", color: "text-gold", bgColor: "bg-gold/10" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                className={`flex items-center gap-2 backdrop-blur-sm px-4 py-2.5 rounded-xl border ${
                  isDarkMode 
                    ? "bg-gray-800/40 border-gray-700/50 text-gray-300" 
                    : "bg-white/40 border-gray-200/50 text-gray-700"
                }`}
              >
                <motion.div
                  animate={{ 
                    rotate: [0, 8, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  className={`p-1.5 rounded-full ${item.bgColor}`}
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                </motion.div>
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;