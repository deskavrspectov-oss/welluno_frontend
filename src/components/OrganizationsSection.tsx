import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  TrendingUp, 
  Heart, 
  Users, 
  Shield, 
  ArrowRight, 
  Building2, 
  Sparkles, 
  Target, 
  Zap, 
  BarChart3,
  ChevronRight,
  Eye,
  Calendar,
  Bell,
  MessageSquare
} from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    stat: "32%",
    label: "Productivity Boost",
    description: "Happier employees perform better",
    gradient: "from-emerald-500 to-teal-400",
    darkGradient: "from-emerald-400 to-teal-300",
  },
  {
    icon: Heart,
    stat: "67%",
    label: "Reduced Burnout",
    description: "Prevention-first approach works",
    gradient: "from-rose-500 to-pink-400",
    darkGradient: "from-rose-400 to-pink-300",
  },
  {
    icon: Users,
    stat: "4x",
    label: "Better Retention",
    description: "People stay where they thrive",
    gradient: "from-blue-500 to-cyan-400",
    darkGradient: "from-blue-400 to-cyan-300",
  },
  {
    icon: Shield,
    stat: "89%",
    label: "Feel Supported",
    description: "Real community, real care",
    gradient: "from-violet-500 to-purple-400",
    darkGradient: "from-violet-400 to-purple-300",
  },
];

// Navigation handler
const handleNavigation = (link: string) => {
  if (link.startsWith('#')) {
    const element = document.querySelector(link);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  } else if (link.startsWith('http')) {
    window.open(link, '_blank');
  } else {
    console.log('Navigating to:', link);
  }
};

const OrganizationsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const [surpriseActive, setSurpriseActive] = useState(false);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // Add CSS variables and styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      :root {
        --color-emerald-500: #10b981;
        --color-teal-400: #2dd4bf;
        --color-emerald-400: #34d399;
        --color-teal-300: #5eead4;
        --color-rose-500: #f43f5e;
        --color-pink-400: #f472b6;
        --color-rose-400: #fb7185;
        --color-pink-300: #f9a8d4;
        --color-blue-500: #3b82f6;
        --color-cyan-400: #22d3ee;
        --color-blue-400: #60a5fa;
        --color-cyan-300: #67e8f9;
        --color-violet-500: #8b5cf6;
        --color-purple-400: #c084fc;
        --color-violet-400: #a78bfa;
        --color-purple-300: #d8b4fe;
      }
      
      .dark {
        --color-emerald-500: #10b981;
        --color-teal-400: #2dd4bf;
        --color-emerald-400: #34d399;
        --color-teal-300: #5eead4;
        --color-rose-500: #f43f5e;
        --color-pink-400: #f472b6;
        --color-rose-400: #fb7185;
        --color-pink-300: #f9a8d4;
        --color-blue-500: #3b82f6;
        --color-cyan-400: #22d3ee;
        --color-blue-400: #60a5fa;
        --color-cyan-300: #67e8f9;
        --color-violet-500: #8b5cf6;
        --color-purple-400: #c084fc;
        --color-violet-400: #a78bfa;
        --color-purple-300: #d8b4fe;
      }
      
      .confetti {
        position: fixed;
        width: 10px;
        height: 10px;
        pointer-events: none;
        z-index: 9999;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Confetti function
  const triggerConfetti = () => {
    setSurpriseActive(true);
    setTimeout(() => setSurpriseActive(false), 1000);
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 4)]};
        top: 50%;
        left: 50%;
        border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(confetti);
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 20 + Math.random() * 20;
      const x = Math.cos(angle) * velocity;
      const y = Math.sin(angle) * velocity;
      
      confetti.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${x}vw, ${y}vh) rotate(${360}deg)`, opacity: 0 }
      ], {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
      }).onfinish = () => confetti.remove();
    }
  };

  // Helper function to get gradient colors
  const getGradientColors = (gradientString: string) => {
    const colors = gradientString.split('from-')[1].split(' to-');
    const fromColor = colors[0].split(' ')[0];
    const toColor = colors[1].split(' ')[0];
    return { fromColor, toColor };
  };

  return (
    <section 
      id="organizations" 
      ref={ref}
      className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div style={{ y: backgroundY }} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-200/20 to-teal-200/20 dark:from-blue-900/10 dark:to-teal-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-amber-200/20 to-yellow-200/20 dark:from-amber-900/10 dark:to-yellow-900/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header - Fixed dark mode text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border border-blue-100 dark:border-blue-800/30 mb-4"
          >
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              For Organizations
            </span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Invest in Your People,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300 bg-clip-text text-transparent">
              Watch Them Flourish
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Mental wellness isn't just good ethics—it's{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">good business</span>.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Content - UPDATED TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6 mb-8">
              {[
                {
                  icon: Eye,
                  text: "Actionable culture insights for leadership",
                  subtext: "Understand team engagement and well-being through participation trends and event feedback.",
                  color: "text-blue-600 dark:text-blue-400"
                },
                {
                  icon: Calendar,
                  text: "Customized wellness programs",
                  subtext: "Tailored live experiences designed around your team's needs, energy levels, and culture.",
                  color: "text-emerald-600 dark:text-emerald-400"
                },
                {
                  icon: Sparkles,
                  text: "Event-based engagement employees actually enjoy",
                  subtext: "Wellness that feels natural, social, and voluntary — not forced or screen-based.",
                  color: "text-amber-600 dark:text-amber-400"
                },
                {
                  icon: Bell,
                  text: "Early signals, shared safely",
                  subtext: "Anonymous feedback and observations that help identify stress points before burnout escalates.",
                  color: "text-purple-600 dark:text-purple-400"
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                  className="group bg-white dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      <item.icon className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.text}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.subtext}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button with Confetti */}
            <motion.button
              onClick={() => {
                handleNavigation('#contact');
                triggerConfetti();
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-500 dark:to-teal-400 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Partner With Us
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Sparkle effect */}
              {surpriseActive && (
                <div className="absolute inset-0">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                      initial={{
                        x: '50%',
                        y: '50%',
                        scale: 0,
                      }}
                      animate={{
                        x: `${(i - 2) * 50 + 50}%`,
                        y: `${Math.sin(i) * 50 + 50}%`,
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.button>
            
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
              Schedule a strategy session with our experts
            </p>
          </motion.div>

          {/* Right Stats Grid - Fixed dark mode text and transitions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-4 sm:gap-6"
          >
            {benefits.map((benefit, index) => {
              const gradientColors = getGradientColors(benefit.gradient);
              
              return (
                <motion.div
                  key={benefit.label}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.4 + index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -5
                  }}
                  className="relative group"
                >
                  <div 
                    onClick={() => handleNavigation(`#benefit-${index}`)}
                    className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <motion.div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${benefit.gradient} dark:${benefit.darkGradient} mb-4`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: "spring" }}
                    >
                      <benefit.icon className="w-6 h-6 text-white" />
                    </motion.div>

                    {/* Stat number with gradient - fixed dark mode */}
                    <div 
                      className="text-3xl font-bold mb-2 bg-clip-text text-transparent"
                      style={{
                        backgroundImage: `linear-gradient(135deg, 
                          rgb(var(--${gradientColors.fromColor})),
                          rgb(var(--${gradientColors.toColor}))
                        )`
                      }}
                    >
                      {benefit.stat}
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
                      {benefit.label}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {benefit.description}
                    </p>

                    {/* Hover indicator */}
                    <motion.div
                      className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -5 }}
                      animate={{ x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronRight className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>    

        {/* Quote - Fixed dark mode text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 text-center"
        >
          <blockquote className="text-xl italic text-gray-800 dark:text-gray-200 max-w-2xl mx-auto px-4">
            "Take care of your employees and they'll take care of your business."
          </blockquote>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">— Richard Branson</p>
        </motion.div>

        {/* Hidden benefit sections for navigation */}
        <div className="hidden">
          {benefits.map((benefit, index) => (
            <div key={index} id={`benefit-${index}`} className="h-px" />
          ))}
        </div>
      </div>

      {/* Confetti container */}
      <div className="fixed inset-0 pointer-events-none z-50" id="confetti-container" />
    </section>
  );
};

export default OrganizationsSection;