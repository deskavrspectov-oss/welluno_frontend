import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { 
  Sparkles, Heart, Brain, Sun,
  Zap, Users, Palette, TrendingUp,
  Calendar, Users2, PartyPopper,
  Building, Star, ArrowRight, ChevronDown,
  Activity, MessageSquare, CheckCircle,
  X, Check
} from "lucide-react";

const solutions = [
  {
    icon: Calendar,
    title: "Live Wellness Events",
    description: "In-person sessions that help people disconnect from screens and reconnect with themselves.",
    color: "from-blue-500 to-cyan-500",
    darkColor: "from-blue-400 to-cyan-400",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    delay: 0.1,
    features: ["Guided meditation", "Stress relief workshops", "Outdoor wellness"],
    aiCannot: "AI cannot create physical group experiences",
    wellunoDoes: "We organize immersive in-person wellness events"
  },
  {
    icon: Users2,
    title: "Human Connection",
    description: "Safe spaces where people build trust, share openly, and feel supported.",
    color: "from-rose-500 to-pink-500",
    darkColor: "from-rose-400 to-pink-400",
    iconBg: "bg-gradient-to-br from-rose-500 to-pink-500",
    delay: 0.2,
    features: ["Support circles", "Peer mentoring", "Group discussions"],
    aiCannot: "AI cannot replace real emotional bonding",
    wellunoDoes: "We create meaningful human connections"
  },
  {
    icon: PartyPopper,
    title: "Creative Experiences",
    description: "Hands-on activities that reduce burnout and boost emotional expression.",
    color: "from-amber-500 to-yellow-500",
    darkColor: "from-amber-400 to-yellow-400",
    iconBg: "bg-gradient-to-br from-amber-500 to-yellow-500",
    delay: 0.3,
    features: ["Art therapy", "Music therapy", "Creative workshops"],
    aiCannot: "AI cannot enable physical creative engagement",
    wellunoDoes: "We facilitate real-world creative healing"
  },
  {
    icon: Building,
    title: "Workplace Wellbeing",
    description: "Programs that improve morale, collaboration, and mental health at work.",
    color: "from-purple-500 to-violet-500",
    darkColor: "from-purple-400 to-violet-400",
    iconBg: "bg-gradient-to-br from-purple-500 to-violet-500",
    delay: 0.4,
    features: ["Wellness programs", "Leadership coaching", "Team retreats"],
    aiCannot: "AI cannot influence real workplace behavior",
    wellunoDoes: "We build healthy and supportive work cultures"
  },
];


const SolutionsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [aiProgress] = useState(0);
  const [wellunoProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "5%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 1, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.9]);

  // AI Limitations steps
  const aiLimitationSteps = [
  {
    title: "Share",
    description: "Users talk to AI about stress, anxiety, and daily struggles.",
    icon: MessageSquare,
    color: "from-blue-500 to-cyan-500",
    delay: 0.1
  },
  {
    title: "Reflect",
    description: "AI analyzes patterns and offers basic emotional guidance.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    delay: 0.2
  },
  {
    title: "Connect",
    description: "Users are encouraged to join real wellness activities.",
    icon: Zap,
    color: "from-amber-500 to-orange-500",
    delay: 0.3
  },
  {
    title: "Transform",
    description: "Lasting change happens through human support and real experiences.",
    icon: Heart,
    color: "from-green-500 to-emerald-500",
    delay: 0.4
  },
];


  // Background words and symbols related to solutions
  const backgroundWords = useMemo(() => [
    "WELLNESS", "CONNECT", "GROW", "HEAL", "THRIVE", "BALANCE", 
    "MINDFUL", "PRESENT", "CALM", "FOCUS", "ENERGY", "VITALITY",
    "HARMONY", "PEACE", "JOY", "CLARITY", "PURPOSE", "FLOW",
    "RESILIENCE", "STRENGTH", "RESTORE", "RENEW", "INSPIRE", "CREATE",
    "EMPOWER", "NURTURE", "FLOURISH", "EVOLVE", "TRANSFORM", "BLOOM"
  ], []);

  const backgroundSymbols = useMemo(() => [
    "❤️", "✨", "🌟", "🌱", "🌞", "🌈", "☀️", "⭐", "🌿",
    "💫", "🌻", "🌸", "🍃", "🌊", "🌍", "💧", "🔥", "🌬️"
  ], []);

  // Background content with random positioning - FIXED
  const backgroundContent = useMemo(() => 
    Array.from({ length: 25 }, (_, i) => {
      const isWord = Math.random() > 0.3;
      const content = isWord 
        ? backgroundWords[Math.floor(Math.random() * backgroundWords.length)]
        : backgroundSymbols[Math.floor(Math.random() * backgroundSymbols.length)];
      
      return {
        id: i,
        content,
        isWord,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 15 - 7.5, // Small rotation
        size: isWord ? Math.random() * 0.7 + 0.5 : Math.random() * 0.8 + 0.6,
        delay: Math.random() * 2,
        duration: Math.random() * 15 + 10
      };
    })
  , [backgroundWords, backgroundSymbols]);

  // Optimized particles
  const happyParticles = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 6 + 3,
      delay: Math.random() * 2,
      color: [
        'bg-yellow-400/20',
        'bg-pink-400/20', 
        'bg-blue-400/20',
        'bg-green-400/20',
        'bg-purple-400/20'
      ][Math.floor(Math.random() * 5)]
    }))
  , []);

  // AI limitations data
  const aiLimitations = [
    {
    title: "AI can’t replace real human presence",
    solution: "Welluno connects you with supportive groups and facilitators",
    icon: Users,
    iconColor: "from-purple-500 to-violet-500",
    delay: 0.1
  },
  {
    title: "AI can’t regulate your body in real time",
    solution: "Guided breathing, movement, and relaxation sessions",
    icon: Activity,
    iconColor: "from-pink-500 to-rose-500",
    delay: 0.2
  },
  {
    title: "AI can’t change your physical environment",
    solution: "Outdoor wellness and screen-free experiences",
    icon: Sun,
    iconColor: "from-amber-500 to-yellow-500",
    delay: 0.3
  },
  {
    title: "AI can’t hold you accountable in real life",
    solution: "Personalized routines, check-ins, and habit programs",
    icon: TrendingUp,
    iconColor: "from-green-500 to-emerald-500",
    delay: 0.4
  },
  ];

  // Progress animations
  useEffect(() => {
    if (isInView) {
      const stepInterval = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % aiLimitationSteps.length);
      }, 2500);
      
      return () => {
        clearInterval(stepInterval);
      };
    }
  }, [isInView, aiLimitationSteps.length]);

  // Card click handler
  const handleCardClick = useCallback((index: number) => {
    setActiveCard(activeCard === index ? null : index);
  }, [activeCard]);

  return (
    <section 
      id="solutions" 
      ref={ref}
      className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-cyan-50/30 to-white dark:from-blue-900/20 dark:via-cyan-900/10 dark:to-gray-950 transition-all duration-1000"
    >
      {/* Background Words and Symbols Layer - FIXED POSITIONING */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-all duration-500 z-0 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {backgroundContent.map((item) => (
          <motion.div
            key={item.id}
            className={`absolute select-none will-change-transform ${
              item.isWord 
                ? 'font-light tracking-wider text-gray-300/30 dark:text-gray-600/30'
                : 'text-gray-400/25 dark:text-gray-500/30'
            }`}
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: `${item.size}rem`,
              transform: `rotate(${item.rotation}deg)`,
              zIndex: 0,
            }}
            animate={{
              y: [0, Math.sin(item.id * 0.5) * 10, 0],
              x: [0, Math.cos(item.id * 0.3) * 8, 0],
            }}
            transition={{
              duration: item.duration,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut"
            }}
          >
            {item.content}
          </motion.div>
        ))}
      </div>

      {/* Optimized Background Elements */}
      <motion.div 
        style={{ y: backgroundY, opacity, scale }}
        className="absolute inset-0 pointer-events-none transition-all duration-1000 will-change-transform z-1"
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 via-cyan-100/10 to-pink-100/20 dark:from-blue-900/10 dark:via-cyan-900/5 dark:to-pink-900/10" />
        
        {/* Optimized particles */}
        <div className="absolute inset-0">
          {happyParticles.map((particle) => (
            <motion.div
              key={particle.id}
              className={`absolute rounded-full ${particle.color}`}
              style={{
                width: particle.size,
                height: particle.size,
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.sin(particle.id) * 20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      <div 
        ref={containerRef} 
        className="container mx-auto px-4 sm:px-6 relative z-10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Core Philosophy Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20 border border-blue-200 dark:border-blue-800 mb-8"
          >
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-widest">
              AI + Human Experience = True Wellness
            </span>
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            AI can understand{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 bg-clip-text text-transparent">
              your mind.
            </span>
            <br />
            But it can't{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 dark:from-rose-400 dark:to-pink-300 bg-clip-text text-transparent">
              heal it.
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8"
          >
            Mental health doesn't improve in conversations alone. 
            <span className="block font-semibold text-blue-600 dark:text-blue-400 mt-2">
              It improves in action.
            </span>
          </motion.p>

          {/* Welluno Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-8 max-w-4xl mx-auto"
          >
            <div className="bg-gradient-to-r from-blue-50/50 to-pink-50/50 dark:from-blue-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm">
              <div className="flex items-center justify-center gap-3 mb-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-5 h-5 text-yellow-500" />
                </motion.div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Welluno Reimagines Corporate Wellness
                </h3>
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-5 h-5 text-yellow-500" />
                </motion.div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-center">
                By shifting the focus from reactive mental health care to proactive, 
                human-centered experiences through thoughtfully crafted live events. 
                We bring people together to unwind, connect, and recharge in ways 
                screens and apps cannot.
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* AI Limitations Cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mb-16 md:mb-20"
        >
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            What AI <span className="text-red-500">Can't Do</span> vs. What Welluno{" "}
            <span className="text-green-500">Creates</span>
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {aiLimitations.map((item, index) => {
              const Icon = item.icon;
              const [isFlipped, setIsFlipped] = useState(false);

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: item.delay }}
                  className="h-64"
                  onMouseEnter={() => setIsFlipped(true)}
                  onMouseLeave={() => setIsFlipped(false)}
                >
                  <div className="relative w-full h-full transition-all duration-500">
                    {/* Front - AI Limitation */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl p-6 border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg ${
                        isFlipped ? 'opacity-0' : 'opacity-100'
                      }`}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                    >
                      <div className="flex flex-col items-center text-center h-full">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center mb-4">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                            <X className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">{item.title}</h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">AI limitation</p>
                        <div className="mt-auto pt-4">
                          <span className="text-xs text-gray-500 dark:text-gray-400 inline-flex items-center gap-1">
                            <ChevronDown className="w-4 h-4" />
                            Hover for solution
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    {/* Back - Welluno Solution */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl p-6 bg-gradient-to-br ${item.iconColor} shadow-xl ${
                        isFlipped ? 'opacity-100' : 'opacity-0'
                      }`}
                      animate={{ rotateY: isFlipped ? 0 : -180 }}
                    >
                      <div className="flex flex-col items-center text-center h-full">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <h4 className="text-lg font-bold text-white">{item.solution}</h4>
                        </div>
                        <p className="text-white/90 text-sm">Welluno delivers</p>
                        <div className="mt-auto pt-4">
                          <div className="flex items-center gap-2 text-white/80">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-xs">Real-world impact</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Talk to Action Flow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-16 md:mb-20"
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              From <span className="text-blue-600">Talk</span> to{" "}
              <span className="text-green-600">Action</span>
            </h3>

            <div className="hidden md:block">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 transform -translate-y-1/2 z-0" />

                {/* Steps */}
                <div className="flex justify-between relative z-10">
                  {aiLimitationSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === activeStep;

                    return (
                      <motion.div
                        key={index}
                        className="text-center"
                      >
                        <motion.div
                          animate={{
                            scale: isActive ? 1.1 : 1,
                            y: isActive ? -5 : 0,
                          }}
                          className={`w-20 h-20 rounded-full bg-gradient-to-br ${step.color} p-1 mb-4 mx-auto shadow-lg`}
                        >
                          <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                            <Icon className="w-8 h-8" />
                          </div>
                        </motion.div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-[180px]">
                          {step.description}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Mobile Steps */}
            <div className="md:hidden space-y-6">
              {aiLimitationSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStep;

                return (
                  <motion.div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <motion.div
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} p-1`}
                    >
                      <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                    </motion.div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Main Solutions Grid */}
        <div className="mb-16 md:mb-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12"
          >
            Where{" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Connection
            </span>{" "}
            Creates{" "}
            <span className="bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
              Wellbeing
            </span>
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto items-start">
            {solutions.map((solution, index) => {
              const isActive = activeCard === index;
              
              return (
                <motion.div
                  key={solution.title}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: solution.delay }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                  style={{ 
                    gridRow: isActive ? 'span 2' : 'auto',
                    minHeight: isActive ? 'auto' : '380px'
                  }}
                >
                  <div
                    onClick={() => handleCardClick(index)}
                    className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border transition-all duration-300 p-6 h-full cursor-pointer flex flex-col
                      ${isActive 
                        ? 'border-blue-400 dark:border-blue-500 shadow-xl' 
                        : 'border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl'
                      }`}
                  >
                    {/* Active indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full z-10"
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon removed */}

                    {/* Title */}
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {solution.title}
                    </h4>
                    
                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {solution.description}
                    </p>
                    
                    {/* AI vs Welluno comparison */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <X className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{solution.aiCannot}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400">{solution.wellunoDoes}</p>
                      </div>
                    </div>
                    
                    {/* Expanded features */}
                    <AnimatePresence>
                      {isActive && solution.features && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-4"
                        >
                          <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">KEY FEATURES:</p>
                            <ul className="space-y-2">
                              {solution.features.map((feature, i) => (
                                <motion.li
                                  key={i}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center text-xs text-gray-600 dark:text-gray-300"
                                >
                                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-2" />
                                  {feature}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    
                    {/* Click hint */}
                    <div className="mt-auto pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {isActive ? "Click to collapse" : "Click for details"}
                        </span>
                        <motion.div
                          animate={{ x: isActive ? [0, 5, 0] : 0 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>        
      </div>

      {/* Performance optimized transition gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/80 to-transparent dark:from-gray-950/80 pointer-events-none" />
    </section>
  );
};

export default SolutionsSection;