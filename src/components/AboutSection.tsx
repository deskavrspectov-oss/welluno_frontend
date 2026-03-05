import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import {
  AlertTriangle, Battery, Users, Brain,
  Zap, Heart, ChevronRight,
  BarChart3, TrendingUp, Shield,
  Users2, Leaf, Coffee, PartyPopper,
  HeartOff, Flame, Clock, Thermometer
} from "lucide-react";
import DecorativeWhyBackground from "./DecorativeWhyBackground";

const problems = [
  {
    id: "workplace-pressure",
    icon: AlertTriangle,
    title: "High Workplace Pressure",
    description:
      "Many employees face constant performance demands, tight deadlines, and long working hours, making it difficult to maintain a healthy work-life balance.",
    stat: "74%",
    statLabel: "report high work stress",
    color: "from-red-500 to-orange-500",
    darkColor: "from-red-600 to-orange-600",
  },
  {
    id: "employee-burnout",
    icon: Battery,
    title: "Rising Burnout Levels",
    description:
      "Sustained workloads and limited recovery time often lead to physical and emotional exhaustion, reducing long-term productivity and motivation.",
    stat: "65%",
    statLabel: "feel at risk of burnout",
    color: "from-amber-500 to-yellow-500",
    darkColor: "from-amber-600 to-yellow-600",
  },
  {
    id: "workplace-connection",
    icon: Users,
    title: "Limited Workplace Connection",
    description:
      "Remote and hybrid work models, while flexible, can reduce opportunities for meaningful social interaction and team bonding.",
    stat: "58%",
    statLabel: "feel socially disconnected",
    color: "from-blue-500 to-cyan-500",
    darkColor: "from-blue-600 to-cyan-600",
  },
  {
    id: "mental-health-support",
    icon: Brain,
    title: "Delayed Mental Health Support",
    description:
      "Many employees seek support only after stress becomes overwhelming, highlighting the need for earlier and more accessible care.",
    stat: "72%",
    statLabel: "seek help after burnout",
    color: "from-purple-500 to-pink-500",
    darkColor: "from-purple-600 to-pink-600",
  },
];


const stats = [
  {
    value: "280M+",
    label: "People affected by depression worldwide",
    icon: Users,
  },
  {
    value: "$1T+",
    label: "Lost productivity from depression and anxiety each year",
    icon: BarChart3,
  },
  {
    value: "60%",
    label: "Employees report work-related stress",
    icon: TrendingUp,
  },
  {
    value: "75%",
    label: "Want better mental health support at work",
    icon: Shield,
  },
];


const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const [activeProblem, setActiveProblem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [brokenText, setBrokenText] = useState(false);

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  // Trigger broken text animation
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setBrokenText(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes crack {
        0% { transform: translateY(0) rotate(0); opacity: 1; }
        100% { transform: translateY(100px) rotate(45deg); opacity: 0; }
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      .animate-crack {
        animation: crack 1.5s ease-out forwards;
      }
      .animate-fadeInUp {
        animation: fadeInUp 0.6s ease-out;
      }
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      .animate-pulse {
        animation: pulse 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Breaking letters animation
  const brokenLetters = ['B', 'r', 'o', 'k', 'e', 'n'];
  const crackAnimations = [
    { x: -50, y: 30, rotate: -25 },
    { x: 30, y: 20, rotate: 15 },
    { x: -20, y: 40, rotate: -10 },
    { x: 40, y: 25, rotate: 20 },
    { x: -35, y: 35, rotate: -15 },
    { x: 25, y: 45, rotate: 10 }
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="py-20 md:py-32 relative overflow-hidden bg-gradient-to-b from-gray-50/50 to-gray-100/30 dark:from-gray-900 dark:to-gray-950 transition-all duration-1000"
    >
      {/* Decorative Why Background - Always visible, hover to erase */}
      <DecorativeWhyBackground
        maxCount={80}
        density={0.95}
        variant="mixed"
        persistRemovals={true}
        storageKey="welluno-why-section-decorations"
        theme="auto"
        removalDuration={350}
        containerClassName="z-0"
        enableAnimations={true}
      />

      {/* Sad/Problem Background Elements */}
      <motion.div
        style={{ y: backgroundY, opacity }}
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
      >
        {/* Cracked glass effect */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-20 bg-red-500/20"
              initial={{ scaleY: 0, opacity: 0 }}
              animate={brokenText ? {
                scaleY: 1,
                opacity: 0.3,
                rotate: Math.random() * 20 - 10
              } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + Math.sin(i) * 20}%`,
                transformOrigin: "top center"
              }}
            />
          ))}
        </div>

        {/* Stress particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-1 h-1 rounded-full ${i % 3 === 0 ? 'bg-red-500/15' :
                  i % 3 === 1 ? 'bg-orange-500/15' : 'bg-amber-500/15'
                }`}
              animate={{
                y: [0, -80, 0],
                x: [0, Math.sin(i) * 40, 0],
                opacity: [0.15, 0.6, 0.15],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/3 via-gray-800/5 to-gray-900/3 dark:from-gray-900/15 dark:via-gray-800/20 dark:to-gray-900/15" />
      </motion.div>

      {/* Decorative stress icons floating */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Thermometer className="w-8 h-8 text-red-500/15" />
        </motion.div>

        <motion.div
          className="absolute bottom-1/3 right-1/3"
          animate={{
            y: [0, 15, 0],
            rotate: [0, -360],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Clock className="w-10 h-10 text-blue-500/15" />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
          }}
        >
          <Flame className="w-6 h-6 text-orange-500/15" />
        </motion.div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-100 dark:border-red-800/30 mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 rounded-full bg-red-500"
            />
            <span className="text-sm font-semibold text-red-700 dark:text-red-300 uppercase tracking-wider">
              The Problem We Solve
            </span>
          </motion.div>

          {/* Breaking "Broken" Text Animation */}
          <div className="relative">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto leading-tight"
            >
              Workplace Wellness is{" "}
              <div className="inline-block relative">
                <span className="sr-only">Broken</span>
                <div className="flex">
                  {brokenLetters.map((letter, index) => (
                    <motion.span
                      key={index}
                      className={`inline-block text-transparent bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-500 dark:to-orange-500 bg-clip-text font-black ${brokenText ? 'transition-all duration-1000' : ''
                        }`}
                      style={brokenText ? {
                        display: 'inline-block',
                        transform: `translate(${crackAnimations[index].x}px, ${crackAnimations[index].y}px) rotate(${crackAnimations[index].rotate}deg)`,
                        opacity: 0.7,
                      } : {}}
                      animate={brokenText ? {
                        y: [0, crackAnimations[index].y],
                        x: [0, crackAnimations[index].x],
                        rotate: [0, crackAnimations[index].rotate],
                        opacity: [1, 0.7, 0.3],
                      } : {}}
                      transition={{
                        duration: 1.5,
                        delay: index * 0.1,
                        ease: "easeOut"
                      }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </div>

                {/* Broken pieces flying out */}
                {brokenText && (
                  <>
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={`piece-${i}`}
                        className="absolute w-2 h-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-sm"
                        initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                        animate={{
                          x: Math.cos(i * 0.5) * 180,
                          y: Math.sin(i * 0.5) * 90 - 40,
                          opacity: 0,
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1.8,
                          delay: i * 0.05,
                          ease: "easeOut"
                        }}
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                      />
                    ))}
                  </>
                )}
              </div>
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Traditional workplace mental health approaches focus on support during difficult moments. We build on this foundation by offering proactive, experience-driven wellness solutions that promote long-term well-being.
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Problems List */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-8">
                <motion.div
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center"
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <HeartOff className="w-4 h-4 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Key Challenges We Face
                </h3>
              </div>

              {problems.map((problem, index) => {
                const ProblemIcon = problem.icon;
                return (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    onMouseEnter={() => setActiveProblem(problem.id)}
                    onMouseLeave={() => setActiveProblem(null)}
                    className={`group relative cursor-pointer transition-all duration-300 ${activeProblem === problem.id ? 'scale-[1.02]' : ''
                      }`}
                  >
                    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 hover:border-red-300 dark:hover:border-red-700 transition-colors">
                      <div className="flex items-start gap-4">
                        <motion.div
                          className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${problem.color} dark:${problem.darkColor} flex items-center justify-center`}
                          whileHover={{ rotate: 8, scale: 1.08 }}
                          transition={{ type: "spring" }}
                        >
                          <ProblemIcon className="w-6 h-6 text-white" />
                        </motion.div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {problem.title}
                            </h4>
                            <div className="text-right">
                              <div className={`text-2xl font-bold bg-gradient-to-br ${problem.color} dark:${problem.darkColor} bg-clip-text text-transparent`}>
                                {problem.stat}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {problem.statLabel}
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 dark:text-gray-300">
                            {problem.description}
                          </p>

                          {/* Progress indicator */}
                          <div className="mt-4 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: problem.stat }}
                              transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                              className={`h-full bg-gradient-to-r ${problem.color} dark:${problem.darkColor}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover highlight */}
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${problem.color} dark:${problem.darkColor} opacity-0 group-hover:opacity-5 transition-opacity duration-300 -z-10`} />

                    {/* Stress particles on hover */}
                    {activeProblem === problem.id && (
                      <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${problem.color}`}
                            animate={{
                              y: [0, -18, 0],
                              x: [0, Math.sin(i) * 8, 0],
                              opacity: [0, 0.7, 0],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                            style={{
                              left: `${20 + i * 15}%`,
                              bottom: 0,
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Right Column - Solution Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-8"
            >
              {/* Solution Focus */}
              <div className="bg-gradient-to-br from-blue-50/90 to-cyan-50/90 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    The Shift We Need
                  </h3>
                </div>

                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  We shift workplace wellness from reactive care to proactive experiences that prevent burnout before it begins.
                </p>

                <div className="space-y-4">
                  {[
                    {
                      text: "Interactive wellness events that encourage relaxation, creativity, and meaningful team engagement",
                      icon: PartyPopper,
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      text: "Community-focused experiences that strengthen relationships and promote a sense of belonging",
                      icon: Users2,
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      text: "Carefully designed activities that support stress management, mental clarity, and emotional balance",
                      icon: Leaf,
                      color: "from-green-500 to-emerald-500",
                    },
                    {
                      text: "Workplace well-being programs that nurture positive culture, motivation, and long-term engagement",
                      icon: Heart,
                      color: "from-red-500 to-orange-500",
                    },
                  ].map((item, i) => {
                    const ItemIcon = item.icon;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                        className="flex items-start gap-3 group"
                      >
                        <motion.div
                          className={`flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mt-1`}
                          whileHover={{ scale: 1.08, rotate: 5 }}
                        >
                          <ItemIcon className="w-4 h-4 text-white" />
                        </motion.div>
                        <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {item.text}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Insights */}
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Quick Insights
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Burnout Reduction</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">+67%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "67%" }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Productivity Gain</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">+32%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "32%" }}
                        transition={{ duration: 1, delay: 0.6 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Connection Increase</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">+45%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "45%" }}
                        transition={{ duration: 1, delay: 0.7 }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Expandable Insight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="bg-gradient-to-br from-gray-50/90 to-white/90 dark:from-gray-800/90 dark:to-gray-900/90 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-sm"
              >
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-full flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                      <Coffee className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Experience Matters
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.div>
                </button>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-300">
                      Teams that experience shared moments of joy and connection report 58% higher job satisfaction
                      and are 41% more likely to stay with their company long-term.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Transition to Solutions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5 }}
        className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-blue-50/50 to-transparent dark:from-blue-900/20 pointer-events-none"
      />
    </section>
  );
};

export default AboutSection;