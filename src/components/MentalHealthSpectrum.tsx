// import { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { 
//   Brain, 
//   AlertCircle, 
//   Shield, 
//   Stethoscope, 
//   TrendingUp, 
//   Zap,
//   HeartPulse,
//   Users,
//   ChevronDown,
//   ChevronUp,
//   Activity,
//   Thermometer,
//   Droplets,
//   Cloud,
//   Clock,
//   Target,
//   Gauge,
//   AlertTriangle,
//   CheckCircle,
//   XCircle,
//   RefreshCw,
//   BrainCircuit,
//   BarChart,
//   Cpu,
//   Heart,
//   ArrowRight,
//   Play,
//   Pause,
//   Info,
//   HelpCircle,
//   BarChart3,
//   LineChart,
//   TrendingDown,
//   Calendar,
//   UserCheck,
//   ShieldCheck,
//   ZapOff,
//   Sunrise,
//   Moon,
//   Brain as BrainIcon
// } from "lucide-react";
// import { cn } from "@/lib/utils";

// interface MentalHealthSpectrumProps {
//   className?: string;
// }

// const MentalHealthSpectrum = ({ className }: MentalHealthSpectrumProps) => {
//   const [activeLayer, setActiveLayer] = useState<"distress" | "disorder" | "prevention">("distress");
//   const [isAnalogExpanded, setIsAnalogExpanded] = useState(false);
//   const [scrollProgress, setScrollProgress] = useState(0);
//   const [currentStage, setCurrentStage] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);
//   const [gaugeValue, setGaugeValue] = useState(30);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const gaugeRef = useRef<HTMLDivElement>(null);
//   const autoPlayTimerRef = useRef<NodeJS.Timeout>();
//   const progressIntervalRef = useRef<NodeJS.Timeout>();
//   const [autoPlayProgress, setAutoPlayProgress] = useState(0);

//   // Distress items with icons and colors
//   const distressItems = [
//     {
//       title: "Stress",
//       description: "A state of mental or emotional strain from adverse circumstances. Your body's 'Fight or Flight' response.",
//       icon: Zap,
//       gradientClasses: "from-amber-500 to-orange-500",
//       bgClass: "bg-amber-500",
//       analogy: "Like a pressure valve building up",
//       tips: ["Take breaks", "Practice breathing", "Talk to someone"]
//     },
//     {
//       title: "Sadness",
//       description: "Natural emotional response to loss or disappointment. Temporary with a clear 'why' behind it.",
//       icon: Droplets,
//       gradientClasses: "from-blue-500 to-cyan-500",
//       bgClass: "bg-blue-500",
//       analogy: "Like passing rain clouds",
//       tips: ["Express feelings", "Engage in hobbies", "Get sunlight"]
//     },
//     {
//       title: "Worry",
//       description: "Cognitive process of thinking about future threats. The brain's alarm system trying to problem-solve.",
//       icon: AlertCircle,
//       gradientClasses: "from-yellow-500 to-amber-500",
//       bgClass: "bg-yellow-500",
//       analogy: "Like a smoke detector checking for fire",
//       tips: ["Write worries down", "Challenge negative thoughts", "Focus on present"]
//     },
//     {
//       title: "Burnout",
//       description: "Emotional, physical, and mental exhaustion from prolonged stress. Makes you feel 'drained' and cynical.",
//       icon: Thermometer,
//       gradientClasses: "from-red-500 to-pink-500",
//       bgClass: "bg-red-500",
//       analogy: "Like a battery at 0%",
//       tips: ["Set boundaries", "Take time off", "Seek support"]
//     }
//   ];

//   // Disorder items
//   const disorderItems = [
//     {
//       title: "Clinical Depression",
//       description: "Not just sadness. Persistent emptiness or hopelessness lasting ≥2 weeks, interfering with daily functioning.",
//       icon: Cloud,
//       gradientClasses: "from-indigo-600 to-purple-600",
//       bgClass: "bg-purple-600",
//       symptom: "Neurochemical changes in brain",
//       duration: "Persistent",
//       treatment: ["Therapy", "Medication", "Lifestyle changes"]
//     },
//     {
//       title: "Anxiety Disorders",
//       description: "Disproportionate fear to threat. The 'alarm' goes off even when there's no fire. Includes physical symptoms.",
//       icon: Activity,
//       gradientClasses: "from-rose-600 to-pink-600",
//       bgClass: "bg-pink-600",
//       symptom: "Stuck fight-or-flight response",
//       duration: "Chronic",
//       treatment: ["Cognitive therapy", "Medication", "Exposure therapy"]
//     }
//   ];

//   // Prevention strategies
//   const preventionStrategies = [
//     {
//       category: "Boundaries",
//       icon: Shield,
//       gradientClasses: "from-emerald-500 to-green-500",
//       bgClass: "bg-emerald-500",
//       items: [
//         "Digital Detox: Set hard stops for work apps after 7 PM",
//         "Power of 'No': Decline obligations exceeding bandwidth",
//         "Work-Life Separation: Designate physical and mental spaces"
//       ],
//       benefit: "Reduces overwhelm by 40%"
//     },
//     {
//       category: "Biological Resilience",
//       icon: HeartPulse,
//       gradientClasses: "from-blue-500 to-cyan-500",
//       bgClass: "bg-blue-500",
//       items: [
//         "Circadian Regularity: Standardize sleep/wake times",
//         "Physical Movement: Exercise as 'manual override' for stress",
//         "Nutrition Balance: Regular meals with brain-supporting foods"
//       ],
//       benefit: "Improves mood regulation by 60%"
//     },
//     {
//       category: "Psychological First Aid",
//       icon: Brain,
//       gradientClasses: "from-violet-500 to-purple-500",
//       bgClass: "bg-purple-500",
//       items: [
//         "Cognitive Reframing: Change self-talk patterns",
//         "Social Connectivity: Face-to-face interactions over social media",
//         "Mindfulness Practice: Daily meditation or grounding exercises"
//       ],
//       benefit: "Enhances coping skills by 75%"
//     },
//     {
//       category: "Corporate Culture",
//       icon: Users,
//       gradientClasses: "from-amber-500 to-orange-500",
//       bgClass: "bg-amber-500",
//       items: [
//         "Psychological Safety: Admit stress without fear",
//         "Protect Izzat (reputation) while being vulnerable",
//         "Regular Check-ins: Manager-employee mental health conversations"
//       ],
//       benefit: "Reduces burnout by 50%"
//     }
//   ];

//   // Mental Gauge stages
//   const gaugeStages = [
//     {
//       level: "Optimal",
//       gradientClasses: "from-emerald-400 to-green-500",
//       bgClass: "bg-emerald-500",
//       description: "Resilient response to stress",
//       features: ["Quick recovery", "Flexible thinking", "Healthy boundaries"],
//       value: 25,
//       recommendation: "Maintain current habits",
//       icon: CheckCircle
//     },
//     {
//       level: "Strained",
//       gradientClasses: "from-yellow-400 to-amber-500",
//       bgClass: "bg-amber-500",
//       description: "Increased but manageable stress",
//       features: ["Longer recovery", "Occasional overwhelm", "Temporary fatigue"],
//       value: 50,
//       recommendation: "Practice stress management",
//       icon: AlertTriangle
//     },
//     {
//       level: "Distressed",
//       gradientClasses: "from-orange-500 to-red-400",
//       bgClass: "bg-orange-500",
//       description: "Chronic stress affecting function",
//       features: ["Persistent anxiety", "Sleep disruption", "Reduced productivity"],
//       value: 75,
//       recommendation: "Seek support & adjust lifestyle",
//       icon: AlertCircle
//     },
//     {
//       level: "Clinical",
//       gradientClasses: "from-red-500 to-rose-600",
//       bgClass: "bg-red-500",
//       description: "Requires professional intervention",
//       features: ["Functional impairment", "Neurochemical changes", "Medical treatment needed"],
//       value: 100,
//       recommendation: "Professional help recommended",
//       icon: Stethoscope
//     }
//   ];

//   // Medical analogy stages with improved timeline
//   const medicalStages = [
//     {
//       stage: "Early Warning Signs",
//       duration: "Days to Weeks",
//       symptoms: ["Sleep changes", "Irritability", "Fatigue", "Mood swings"],
//       intervention: "Self-care & lifestyle adjustments",
//       icon: AlertCircle,
//       gradientClasses: "from-blue-500 to-blue-600",
//       bgClass: "bg-blue-500",
//       analogy: "Like a persistent headache - warning sign to slow down",
//       prevention: "Regular breaks, sleep hygiene, social support"
//     },
//     {
//       stage: "Chronic Distress",
//       duration: "Weeks to Months",
//       symptoms: ["Burnout symptoms", "Anxiety", "Social withdrawal", "Physical pain"],
//       intervention: "Professional support recommended",
//       icon: Thermometer,
//       gradientClasses: "from-amber-500 to-amber-600",
//       bgClass: "bg-amber-500",
//       analogy: "Like chronic bronchitis - needs rest and medical attention",
//       prevention: "Therapy consultation, workload reduction, mindfulness"
//     },
//     {
//       stage: "Pre-Clinical",
//       duration: "Months",
//       symptoms: ["Functional impairment", "Hopelessness", "Physical symptoms", "Isolation"],
//       intervention: "Therapy & medical evaluation",
//       icon: Activity,
//       gradientClasses: "from-orange-500 to-orange-600",
//       bgClass: "bg-orange-500",
//       analogy: "Like walking pneumonia - still functional but suffering",
//       prevention: "Urgent professional help, medical leave, intensive therapy"
//     },
//     {
//       stage: "Clinical Disorder",
//       duration: "Months to Years",
//       symptoms: ["Neurochemical changes", "Diagnosable condition", "Severe impairment", "Suicidal thoughts"],
//       intervention: "Comprehensive treatment plan",
//       icon: Stethoscope,
//       gradientClasses: "from-red-500 to-red-600",
//       bgClass: "bg-red-500",
//       analogy: "Like chronic illness - requires ongoing treatment",
//       prevention: "Medical treatment, long-term therapy, support groups"
//     }
//   ];

//   // Recovery data
//   const recoveryData = [
//     {
//       title: "Distress Recovery",
//       timeline: "24-72 hours to baseline",
//       description: "Typically resolves within days to weeks with proper self-care",
//       icon: RefreshCw,
//       gradientClasses: "from-blue-500 to-cyan-500",
//       interventions: ["Rest", "Social support", "Stress management", "Sleep hygiene"],
//       successRate: "90% with early intervention"
//     },
//     {
//       title: "Burnout Recovery",
//       timeline: "3-6 months with intervention",
//       description: "Requires structured recovery and lifestyle changes",
//       icon: Target,
//       gradientClasses: "from-purple-500 to-pink-500",
//       interventions: ["Therapy", "Work adjustments", "Mindfulness", "Exercise routine"],
//       successRate: "75% with consistent effort"
//     },
//     {
//       title: "Disorder Treatment",
//       timeline: "6+ months treatment plan",
//       description: "Long-term management with professional treatment and support",
//       icon: BrainCircuit,
//       gradientClasses: "from-red-500 to-rose-500",
//       interventions: ["Medication", "Psychotherapy", "Support groups", "Lifestyle changes"],
//       successRate: "60-80% with comprehensive treatment"
//     }
//   ];

//   // Personal assessment questions
//   const assessmentQuestions = [
//     {
//       question: "How often do you feel overwhelmed?",
//       options: ["Rarely", "Sometimes", "Often", "Constantly"]
//     },
//     {
//       question: "How is your sleep quality?",
//       options: ["Excellent", "Good", "Fair", "Poor"]
//     },
//     {
//       question: "Do you find joy in daily activities?",
//       options: ["Always", "Often", "Sometimes", "Rarely"]
//     },
//     {
//       question: "How connected do you feel to others?",
//       options: ["Very connected", "Somewhat", "Occasionally", "Isolated"]
//     }
//   ];

//   // Scroll progress effect
//   useEffect(() => {
//     const handleScroll = () => {
//       const section = document.getElementById('mental-health-tips');
//       if (section) {
//         const rect = section.getBoundingClientRect();
//         const progress = Math.min(Math.max((window.innerHeight - rect.top) / (rect.height * 0.7), 0), 1);
//         setScrollProgress(progress);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   // Auto-rotate through medical stages
//   useEffect(() => {
//     if (isAnalogExpanded && isAutoPlaying) {
//       autoPlayTimerRef.current = setInterval(() => {
//         setCurrentStage((prev) => (prev + 1) % medicalStages.length);
//         setAutoPlayProgress(0);
//       }, 5000);
//     }
    
//     return () => {
//       if (autoPlayTimerRef.current) {
//         clearInterval(autoPlayTimerRef.current);
//       }
//       if (progressIntervalRef.current) {
//         clearInterval(progressIntervalRef.current);
//       }
//     };
//   }, [isAnalogExpanded, isAutoPlaying, medicalStages.length]);

//   // Auto-play progress bar
//   useEffect(() => {
//     if (isAnalogExpanded && isAutoPlaying) {
//       progressIntervalRef.current = setInterval(() => {
//         setAutoPlayProgress(prev => {
//           if (prev >= 100) {
//             setCurrentStage(prevStage => (prevStage + 1) % medicalStages.length);
//             return 0;
//           }
//           return prev + 0.2; // 0.2% per 10ms for 5 seconds total
//         });
//       }, 10);
//     }
    
//     return () => {
//       if (progressIntervalRef.current) {
//         clearInterval(progressIntervalRef.current);
//       }
//     };
//   }, [isAnalogExpanded, isAutoPlaying, medicalStages.length]);

//   // Interactive gauge effect
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (gaugeRef.current && isDragging) {
//         const rect = gaugeRef.current.getBoundingClientRect();
//         const x = ((e.clientX - rect.left) / rect.width) * 100;
//         const normalizedValue = Math.min(Math.max(x, 0), 100);
//         setGaugeValue(normalizedValue);
//       }
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//     };

//     document.addEventListener('mousemove', handleMouseMove);
//     document.addEventListener('mouseup', handleMouseUp);

//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDragging]);

//   // Handle medical stage click
//   const handleStageClick = (index: number) => {
//     setCurrentStage(index);
//     setAutoPlayProgress(0);
//     setIsAutoPlaying(false);
//     setTimeout(() => setIsAutoPlaying(true), 5000);
//   };

//   // Handle auto-play toggle
//   const toggleAutoPlay = () => {
//     if (!isAutoPlaying) {
//       setAutoPlayProgress(0);
//     }
//     setIsAutoPlaying(!isAutoPlaying);
//   };

//   // Handle gauge click/drag
//   const handleGaugeClick = (e: React.MouseEvent) => {
//     if (gaugeRef.current) {
//       const rect = gaugeRef.current.getBoundingClientRect();
//       const x = ((e.clientX - rect.left) / rect.width) * 100;
//       const normalizedValue = Math.min(Math.max(x, 0), 100);
//       setGaugeValue(normalizedValue);
//     }
//   };

//   const handleGaugeMouseDown = () => {
//     setIsDragging(true);
//   };

//   // Calculate needle rotation based on gauge value
//   const getNeedleRotation = () => {
//     // Map 0-100% to -90deg to 90deg
//     return -90 + (gaugeValue / 100) * 180;
//   };

//   // Get current gauge stage based on value
//   const getCurrentGaugeStage = () => {
//     if (gaugeValue <= 25) return gaugeStages[0];
//     if (gaugeValue <= 50) return gaugeStages[1];
//     if (gaugeValue <= 75) return gaugeStages[2];
//     return gaugeStages[3];
//   };

//   // Get action recommendations based on gauge value
//   const getActionRecommendations = () => {
//     if (gaugeValue <= 25) {
//       return [
//         "Continue regular self-care practices",
//         "Maintain healthy boundaries",
//         "Stay socially connected"
//       ];
//     } else if (gaugeValue <= 50) {
//       return [
//         "Practice daily mindfulness",
//         "Increase physical activity",
//         "Improve sleep hygiene"
//       ];
//     } else if (gaugeValue <= 75) {
//       return [
//         "Consider professional counseling",
//         "Take regular breaks",
//         "Delegate tasks when possible"
//       ];
//     } else {
//       return [
//         "Seek immediate professional help",
//         "Discuss with healthcare provider",
//         "Build strong support network"
//       ];
//     }
//   };

//   return (
//     <section 
//       id="mental-health-tips"
//       className={cn(
//         "relative min-h-screen py-20 overflow-hidden",
//         "bg-gradient-to-b from-gray-50 to-white",
//         "dark:from-gray-900 dark:to-gray-950",
//         className
//       )}
//     >
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <motion.div
//           className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-3xl dark:from-blue-500/10 dark:to-purple-500/10"
//           animate={{
//             x: [0, 100, 0],
//             y: [0, -50, 0],
//           }}
//           transition={{
//             duration: 20,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />
//         <motion.div
//           className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 blur-3xl dark:from-emerald-500/10 dark:to-cyan-500/10"
//           animate={{
//             x: [0, -80, 0],
//             y: [0, 60, 0],
//           }}
//           transition={{
//             duration: 25,
//             repeat: Infinity,
//             ease: "linear"
//           }}
//         />
//       </div>

//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
//         {/* Section Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           className="text-center mb-16"
//         >
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 mb-6">
//             <BrainIcon className="w-5 h-5 text-blue-500 dark:text-blue-400" />
//             <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
//               Mental Health Spectrum
//             </span>
//           </div>
          
//           <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
//             <span className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
//               From Distress to Disorder
//             </span>
//           </h2>
          
//           <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
//             Understanding the continuum of mental health responses in today's fast-paced world
//           </p>
//         </motion.div>

//         {/* Interactive Layer Selector */}
//         <div className="flex flex-col lg:flex-row gap-8 mb-12">
//           {/* Navigation Tabs */}
//           <div className="lg:w-1/4">
//             <div className="sticky top-24 space-y-2">
//               {[
//                 { id: "distress" as const, label: "Human Response Layer", icon: AlertCircle, bgClass: "bg-blue-500" },
//                 { id: "disorder" as const, label: "Clinical Layer", icon: Stethoscope, bgClass: "bg-purple-500" },
//                 { id: "prevention" as const, label: "Prevention Strategies", icon: Shield, bgClass: "bg-emerald-500" }
//               ].map((tab) => {
//                 const Icon = tab.icon;
//                 return (
//                   <motion.button
//                     key={tab.id}
//                     onClick={() => setActiveLayer(tab.id)}
//                     className={cn(
//                       "w-full text-left p-4 rounded-xl transition-all duration-300",
//                       "flex items-center gap-4 group",
//                       activeLayer === tab.id
//                         ? `bg-blue-50 dark:bg-gray-800/80 border-l-4 ${tab.bgClass}`
//                         : "bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 border-l-4 border-transparent hover:border-gray-300 dark:hover:border-gray-600"
//                     )}
//                     whileHover={{ x: 4 }}
//                   >
//                     <div className={cn(
//                       "p-2 rounded-lg",
//                       activeLayer === tab.id 
//                         ? `${tab.bgClass} text-white`
//                         : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
//                     )}>
//                       <Icon className="w-5 h-5" />
//                     </div>
//                     <span className={cn(
//                       "font-semibold",
//                       activeLayer === tab.id
//                         ? "text-gray-900 dark:text-white"
//                         : "text-gray-700 dark:text-gray-300"
//                     )}>
//                       {tab.label}
//                     </span>
//                   </motion.button>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:w-3/4">
//             <AnimatePresence mode="wait">
//               {/* DISTRESS LAYER */}
//               {activeLayer === "distress" && (
//                 <motion.div
//                   key="distress"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   className="space-y-8"
//                 >
//                   <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800/30">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
//                         <AlertCircle className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                           The "Human Response" Layer
//                         </h3>
//                         <p className="text-blue-600 dark:text-blue-400">
//                           Normal reactions to abnormal situations
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-6">
//                       {distressItems.map((item, index) => {
//                         const Icon = item.icon;
//                         return (
//                           <motion.div
//                             key={item.title}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="group relative"
//                           >
//                             <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-blue-900/10">
//                               <div className="flex items-start gap-4">
//                                 <div className={`p-3 rounded-lg bg-gradient-to-br ${item.gradientClasses}`}>
//                                   <Icon className="w-6 h-6 text-white" />
//                                 </div>
//                                 <div className="flex-1">
//                                   <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
//                                     {item.title}
//                                   </h4>
//                                   <p className="text-gray-600 dark:text-gray-300 mb-3">
//                                     {item.description}
//                                   </p>
//                                   <div className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-3">
//                                     {item.analogy}
//                                   </div>
//                                   <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                                     <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                       <Zap className="w-4 h-4 text-amber-500" />
//                                       Quick Tips:
//                                     </div>
//                                     <div className="flex flex-wrap gap-2">
//                                       {item.tips.map((tip, idx) => (
//                                         <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
//                                           {tip}
//                                         </span>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* DISORDER LAYER */}
//               {activeLayer === "disorder" && (
//                 <motion.div
//                   key="disorder"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   className="space-y-8"
//                 >
//                   <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-8 border border-purple-200 dark:border-purple-800/30">
//                     <div className="flex items-center gap-3 mb-6">
//                       <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
//                         <Stethoscope className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                           The "Clinical" Layer
//                         </h3>
//                         <p className="text-purple-600 dark:text-purple-400">
//                           When distress evolves into neurochemical changes
//                         </p>
//                       </div>
//                     </div>

//                     <div className="space-y-6">
//                       {disorderItems.map((item, index) => {
//                         const Icon = item.icon;
//                         return (
//                           <motion.div
//                             key={item.title}
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: index * 0.2 }}
//                             className="group relative"
//                           >
//                             <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-purple-900/10">
//                               <div className="flex flex-col md:flex-row gap-6">
//                                 <div className={`p-4 rounded-xl bg-gradient-to-br ${item.gradientClasses} min-w-[80px] h-[80px] flex items-center justify-center`}>
//                                   <Icon className="w-8 h-8 text-white" />
//                                 </div>
//                                 <div className="flex-1">
//                                   <div className="flex flex-wrap items-center gap-3 mb-3">
//                                     <h4 className="text-xl font-bold text-gray-900 dark:text-white">
//                                       {item.title}
//                                     </h4>
//                                     <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
//                                       {item.duration}
//                                     </span>
//                                   </div>
//                                   <p className="text-gray-600 dark:text-gray-300 mb-4">
//                                     {item.description}
//                                   </p>
//                                   <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 mb-4">
//                                     <Activity className="w-4 h-4" />
//                                     <span className="font-medium">{item.symptom}</span>
//                                   </div>
//                                   <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                                     <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                                       <ShieldCheck className="w-4 h-4 text-green-500" />
//                                       Effective Treatments:
//                                     </div>
//                                     <div className="flex flex-wrap gap-2">
//                                       {item.treatment.map((treatment, idx) => (
//                                         <span key={idx} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
//                                           {treatment}
//                                         </span>
//                                       ))}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </motion.div>
//               )}

//               {/* PREVENTION LAYER */}
//               {activeLayer === "prevention" && (
//                 <motion.div
//                   key="prevention"
//                   initial={{ opacity: 0, x: 20 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -20 }}
//                   className="space-y-8"
//                 >
//                   <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800/30">
//                     <div className="flex items-center gap-3 mb-8">
//                       <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500">
//                         <Shield className="w-6 h-6 text-white" />
//                       </div>
//                       <div>
//                         <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
//                           Prevention Strategies
//                         </h3>
//                         <p className="text-emerald-600 dark:text-emerald-400">
//                           Building mental immunity in fast-paced environments
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid md:grid-cols-2 gap-6">
//                       {preventionStrategies.map((strategy, index) => {
//                         const Icon = strategy.icon;
//                         return (
//                           <motion.div
//                             key={strategy.category}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1 }}
//                             className="group relative"
//                           >
//                             <div className="relative bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-500 transition-all duration-300 h-full hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-emerald-900/10">
//                               <div className={`p-3 rounded-lg bg-gradient-to-br ${strategy.gradientClasses} w-fit mb-4`}>
//                                 <Icon className="w-6 h-6 text-white" />
//                               </div>
//                               <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
//                                 {strategy.category}
//                               </h4>
//                               <ul className="space-y-3 mb-4">
//                                 {strategy.items.map((item, idx) => (
//                                   <motion.li
//                                     key={idx}
//                                     initial={{ opacity: 0, x: -10 }}
//                                     animate={{ opacity: 1, x: 0 }}
//                                     transition={{ delay: index * 0.1 + idx * 0.05 }}
//                                     className="flex items-start gap-3"
//                                   >
//                                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
//                                     <span className="text-gray-600 dark:text-gray-300">
//                                       {item}
//                                     </span>
//                                   </motion.li>
//                                 ))}
//                               </ul>
//                               <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//                                 <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
//                                   <TrendingUp className="w-4 h-4" />
//                                   {strategy.benefit}
//                                 </div>
//                               </div>
//                             </div>
//                           </motion.div>
//                         );
//                       })}
//                     </div>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>

      
//       </div>
//     </section>
//   );
// };

// export default MentalHealthSpectrum;

import React from 'react'

const MentalHealthSpectrum = () => {
  return (
    <div>
      
    </div>
  )
}

export default MentalHealthSpectrum
