import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle,
  Ticket
} from "lucide-react";

// Categories definition
const categories = [
  { id: 'all', label: 'All Events', subtitle: '' },
  { id: 'culture-builders', label: 'Culture Builders', subtitle: 'Events' },
  { id: 'daily-resets', label: 'Daily Resets', subtitle: 'Sessions' },
  { id: 'deep-dives', label: 'Deep Dives', subtitle: 'Workshops' },
  { id: 'ultimate-getaways', label: 'Ultimate Getaways', subtitle: 'Trips' },
];

// Events data – attendees now set between 10 and 15
const events = [
  // Culture Builders
  {
    id: 1,
    title: "Corporate Calm Events",
    description: "Bring mindfulness and stress reduction techniques to your workplace. Enhance focus and well-being.",
    date: "Every Tuesday",
    time: "10:00 AM",
    // location: "Virtual / On-site",
    attendees: 12,
    category: "culture-builders",
    color: "from-blue-500 to-indigo-500",
    darkColor: "from-blue-600 to-indigo-600",
    price: "Contact us",
    spots: "Available",
    duration: "1 hour",
    level: "All Levels",
    type: "hybrid",
    tags: ["corporate"]
  },
  {
    id: 2,
    title: "Peace of Mind Programs",
    description: "A series of sessions designed to cultivate inner peace and emotional resilience.",
    date: "Every Thursday",
    time: "6:00 PM",
    // location: "Virtual",
    attendees: 15,
    category: "culture-builders",
    color: "from-teal-500 to-cyan-500",
    darkColor: "from-teal-600 to-cyan-600",
    price: "Free",
    spots: "Unlimited",
    duration: "45 mins",
    level: "Beginner",
    type: "virtual",
    tags: ["free", "weekly"]
  },
  // Daily Resets
  {
    id: 3,
    title: "Zen Den Sessions",
    description: "Short guided meditations to reset your mind during a busy day.",
    date: "Daily",
    time: "12:00 PM & 3:00 PM",
    // location: "Virtual",
    attendees: 14,
    category: "daily-resets",
    color: "from-green-500 to-emerald-500",
    darkColor: "from-green-600 to-emerald-600",
    price: "Free",
    spots: "Unlimited",
    duration: "15 mins",
    level: "All Levels",
    type: "virtual",
    tags: ["free", "daily"]
  },
  {
    id: 4,
    title: "Mindfulness Mastery Classes",
    description: "Deepen your mindfulness practice with expert guidance and techniques.",
    date: "Mondays & Wednesdays",
    time: "9:00 AM",
    // location: "Virtual",
    attendees: 10,
    category: "daily-resets",
    color: "from-purple-500 to-violet-500",
    darkColor: "from-purple-600 to-violet-600",
    price: "$15/session",
    spots: "5 left",
    duration: "1 hour",
    level: "Intermediate",
    type: "virtual",
    tags: ["series"]
  },
  {
    id: 5,
    title: "Brain Break Sessions",
    description: "Quick, fun activities to recharge your brain and boost creativity.",
    date: "Tue & Thu",
    time: "2:30 PM",
    // location: "Virtual",
    attendees: 13,
    category: "daily-resets",
    color: "from-yellow-500 to-amber-500",
    darkColor: "from-yellow-600 to-amber-600",
    price: "Free",
    spots: "Unlimited",
    duration: "10 mins",
    level: "All Levels",
    type: "virtual",
    tags: ["free", "quick"]
  },
  // Deep Dives
  {
    id: 6,
    title: "Stress-Busting Workshops",
    description: "Intensive workshops to identify stress triggers and learn coping strategies.",
    date: "First Saturday monthly",
    time: "10:00 AM - 2:00 PM",
    // location: "In-person (various cities)",
    attendees: 12,
    category: "deep-dives",
    color: "from-red-500 to-orange-500",
    darkColor: "from-red-600 to-orange-600",
    price: "$50",
    spots: "3 left",
    duration: "4 hours",
    level: "All Levels",
    type: "in-person",
    tags: ["workshop"]
  },
  {
    id: 7,
    title: "The Happy Human Workshops",
    description: "Explore the science of happiness and practice exercises to boost joy.",
    date: "Mar 20, 2025",
    time: "1:00 PM - 5:00 PM",
    // location: "Bangalore",
    attendees: 11,
    category: "deep-dives",
    color: "from-pink-500 to-rose-500",
    darkColor: "from-pink-600 to-rose-600",
    price: "$60",
    spots: "4 left",
    duration: "4 hours",
    level: "Intermediate",
    type: "in-person",
    tags: ["workshop"]
  },
  {
    id: 8,
    title: "Burnout-to-Bright Sessions",
    description: "A transformative program for those feeling overwhelmed. Reclaim your energy.",
    date: "Apr 10-12, 2025",
    time: "9:00 AM - 4:00 PM",
    // location: "Rishikesh",
    attendees: 10,
    category: "deep-dives",
    color: "from-indigo-500 to-purple-500",
    darkColor: "from-indigo-600 to-purple-600",
    price: "$199",
    spots: "2 left",
    duration: "3 days",
    level: "All Levels",
    type: "in-person",
    tags: ["retreat"]
  },
  // Ultimate Getaways
  {
    id: 9,
    title: "Wellness Waves Retreats",
    description: "A rejuvenating beach retreat with yoga, meditation, and wellness workshops.",
    date: "May 5-9, 2025",
    time: "Full days",
    // location: "Goa",
    attendees: 14,
    category: "ultimate-getaways",
    color: "from-cyan-500 to-sky-500",
    darkColor: "from-cyan-600 to-sky-600",
    price: "$899",
    spots: "3 left",
    duration: "5 days",
    level: "All Levels",
    type: "in-person",
    tags: ["retreat", "beach"]
  },
  {
    id: 10,
    title: "Recharge & Relax Trips",
    description: "Short weekend getaways focused on relaxation and self-care.",
    date: "Various weekends",
    time: "Fri-Sun",
    // location: "Multiple locations",
    attendees: 13,
    category: "ultimate-getaways",
    color: "from-emerald-500 to-teal-500",
    darkColor: "from-emerald-600 to-teal-600",
    price: "$399",
    spots: "5 left",
    duration: "3 days",
    level: "All Levels",
    type: "in-person",
    tags: ["weekend"]
  },
  {
    id: 11,
    title: "The Great Escape Retreats",
    description: "A luxury retreat in the mountains to disconnect and recharge.",
    date: "Jun 15-20, 2025",
    time: "Full days",
    // location: "Manali",
    attendees: 15,
    category: "ultimate-getaways",
    color: "from-blue-500 to-indigo-500",
    darkColor: "from-blue-600 to-indigo-600",
    price: "$1299",
    spots: "2 left",
    duration: "6 days",
    level: "All Levels",
    type: "in-person",
    tags: ["luxury", "mountain"]
  },
];

// Map category ids to display names
const categoryDisplay: Record<string, string> = {
  'culture-builders': 'Culture Builders',
  'daily-resets': 'Daily Resets',
  'deep-dives': 'Deep Dives',
  'ultimate-getaways': 'Ultimate Getaways',
};

const EventsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [hoveredEvent, setHoveredEvent] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.2, 1, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  // Add CSS for animations
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes slide-up {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes pulse-subtle {
        0%, 100% { opacity: 0.8; }
        50% { opacity: 1; }
      }
      .animate-fade-in {
        animation: fade-in 0.4s ease-out;
      }
      .animate-slide-up {
        animation: slide-up 0.5s ease-out;
      }
      .animate-pulse-subtle {
        animation: pulse-subtle 2s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleRegister = (eventId: number, eventTitle: string) => {
    if (registeredEvents.includes(eventId)) return;

    setRegisteredEvents([...registeredEvents, eventId]);
    
    // Subtle confetti effect (unchanged)
    for (let i = 0; i < 20; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
          position: fixed;
          width: 8px;
          height: 8px;
          background: ${['#FFD700', '#4ECDC4', '#FF6B6B'][Math.floor(Math.random() * 3)]};
          top: 50%;
          left: 50%;
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
          pointer-events: none;
          z-index: 9999;
          opacity: 0.9;
        `;
        document.body.appendChild(confetti);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 10 + Math.random() * 10;
        const x = Math.cos(angle) * velocity;
        const y = Math.sin(angle) * velocity;
        
        confetti.animate([
          { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
          { transform: `translate(${x}vw, ${y}vh) rotate(${180}deg)`, opacity: 0 }
        ], {
          duration: 800 + Math.random() * 800,
          easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)'
        }).onfinish = () => confetti.remove();
      }, i * 40);
    }

    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-[10000] animate-fade-in';
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-xl">🎉</span>
        <div>
          <div class="font-bold text-sm">Registration Confirmed!</div>
          <div class="text-xs opacity-90">See you at ${eventTitle}</div>
        </div>
      </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 4000);
  };

  // Filter events based on active category
  const filteredEvents = events.filter(event => 
    activeFilter === 'all' || event.category === activeFilter
  );

  return (
    <section 
      id="events" 
      ref={ref}
      className="py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      {/* Animated Background (unchanged) */}
      <motion.div 
        style={{ y: backgroundY, opacity, scale }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent dark:via-blue-600/5" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/10 to-transparent dark:via-blue-600/5" />
        
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-teal-300/10 to-emerald-300/10 dark:from-teal-900/5 dark:to-emerald-900/5 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -40, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
          className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-purple-300/10 to-pink-300/10 dark:from-purple-900/5 dark:to-pink-900/5 rounded-full blur-3xl"
        />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.8, 
            ease: [0.4, 0, 0.2, 1],
            delay: 0.1
          }}
          className="text-center mb-14 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ 
              type: "spring", 
              stiffness: 100,
              damping: 15,
              delay: 0.2 
            }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border border-blue-100 dark:border-blue-800/30 mb-8 shadow-sm"
          >
            <Ticket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-widest">
              Wellness Events
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 0.7, 
              delay: 0.3,
              ease: "easeOut" 
            }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Transform Your{" "}
            <span className="text-gray-400 dark:text-gray-500 line-through">Routine</span>{" "}
            into{" "}
            <span className="bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 dark:from-blue-400 dark:via-teal-300 dark:to-emerald-400 bg-clip-text text-transparent">
              Experience
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ 
              duration: 0.6, 
              delay: 0.4,
              ease: "easeOut" 
            }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed"
          >
            Join curated wellness events that blend mindfulness, connection, and joy. 
            From virtual sessions to immersive retreats, find your perfect experience.
          </motion.p>
        </motion.div>

        {/* Category Filter Tabs (unchanged) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ 
            duration: 0.6, 
            delay: 0.5,
            ease: "easeOut" 
          }}
          className="mb-10 md:mb-14"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-3">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex flex-col items-center ${
                  activeFilter === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-500 dark:to-teal-400 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <span>{category.label}</span>
                {category.subtitle && (
                  <span className="text-[10px] opacity-80">{category.subtitle}</span>
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto mb-16 md:mb-20">
          {filteredEvents.map((event, index) => {
            const isRegistered = registeredEvents.includes(event.id);
            const isHovered = hoveredEvent === event.id;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  duration: 0.7, 
                  delay: 0.6 + index * 0.1,
                  ease: [0.4, 0, 0.2, 1],
                  type: "spring",
                  stiffness: 90
                }}
                whileHover={{ 
                  y: -6,
                  transition: { 
                    duration: 0.3,
                    ease: "easeOut"
                  }
                }}
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
                className="group relative"
              >
                {/* Main Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  {/* Gradient Header - now only contains title and badges */}
                  <div className="relative h-28 flex-shrink-0 overflow-hidden">
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${event.color} dark:${event.darkColor}`}
                      animate={{
                        scale: isHovered ? 1.1 : 1,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: "easeOut"
                      }}
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white bg-white/20 backdrop-blur-sm">
                        {categoryDisplay[event.category] || event.category}
                      </span>
                    </div>
                    
                    {/* Price Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <motion.div
                        animate={event.spots.includes('left') ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="px-2.5 py-1 rounded-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm font-bold shadow-lg">
                          {event.price}
                        </span>
                      </motion.div>
                    </div>
                    
                    {/* Event Title - now alone in header */}
                    <div className="absolute bottom-3 left-4 right-4 z-10">
                      <motion.h3
                        animate={{
                          y: isHovered ? -3 : 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut"
                        }}
                        className="text-lg font-bold text-white drop-shadow-lg"
                      >
                        {event.title}
                      </motion.h3>
                    </div>
                  </div>

                  {/* Event Details - description moved here */}
                  <div className="p-5 flex-1 flex flex-col">
                    {/* Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 min-w-0">
                        <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{event.time}</span>
                      </div>
                      {/* <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{event.location}</span>
                      </div> */}
                      <div className="flex items-center gap-2 min-w-0">
                        <Users className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <span className="text-xs text-gray-700 dark:text-gray-300">{event.attendees} joined</span>
                      </div>
                    </div>

                    {/* Status & Meta */}
                    <div className="flex items-center justify-between mb-5">
                      <motion.div
                        className="flex items-center gap-2"
                        animate={event.spots.includes('left') ? { 
                          scale: [1, 1.05, 1]
                        } : {}}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                      >
                        <div className={`w-2 h-2 rounded-full ${
                          event.spots === 'Unlimited' ? 'bg-green-500' : 
                          event.spots.includes('left') ? 'bg-amber-500 animate-pulse-subtle' : 
                          'bg-red-500'
                        }`} />
                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          {event.spots}
                        </span>
                      </motion.div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        {event.duration}
                      </div>
                      <div className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                        {event.level}
                      </div>
                    </div>

                    {/* Register Button */}
                    <motion.button
                      onClick={() => handleRegister(event.id, event.title)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isRegistered}
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 relative overflow-hidden mt-auto ${
                        isRegistered
                          ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-600 dark:text-gray-400 cursor-default'
                          : `bg-gradient-to-r ${event.color} dark:${event.darkColor} text-white shadow-lg hover:shadow-xl`
                      }`}
                    >
                      <motion.span
                        className="relative z-10 flex items-center justify-center gap-2"
                        animate={isRegistered ? {} : {
                          x: [0, 2, 0]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 2
                        }}
                      >
                        {isRegistered ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                            <span className="text-gray-700 dark:text-gray-300">Registered</span>
                          </>
                        ) : (
                          <>
                            Reserve Your Spot
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </motion.span>
                      
                      {!isRegistered && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                        />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;