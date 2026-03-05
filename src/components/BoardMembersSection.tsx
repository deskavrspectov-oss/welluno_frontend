import { useState, useRef, useEffect } from 'react';
import { 
  motion, 
  useInView, 
  AnimatePresence,
  Variants 
} from 'framer-motion';
import { X, ChevronRight } from 'lucide-react';

interface BoardMember {
  id: number;
  name: string;
  role: string;
  boardPosition: string;
  description?: string;
  expertise?: string[];
  color: string;
  achievements?: number;
  years?: number;
  impact?: string;
  contact: {
    linkedin?: string;
    email?: string;
    website?: string;
  };
  quote?: string;
  location?: string;
  previousRoles?: string[];
  image?: string;
}

const boardMembers: BoardMember[] = [
  {
    id: 1,
    name: "Vanshmani Jha",
    role: "Founder",
    boardPosition: "Board Advisory",
    color: "from-blue-500 to-cyan-500",
    contact: {
      email: "vanshmani@welluno.in"
    },
    quote: "Protect your mind with the same commitment you pursue your goals — it is the foundation of everything you build."
  },
  {
    id: 2,
    name: "Kumari Astha",
    role: "CEO",
    boardPosition: "Board Advisory",
    color: "from-purple-500 to-pink-500",
    contact: {
      email: "aastha@welluno.in"
    },
    quote: "Mental health is not separate from success; it is the clarity and strength that make success sustainable."
  },
  {
    id: 3,
    name: "Amit Kant",
    role: "Strategic Advisor",
    boardPosition: "Admin Lead",
    color: "from-amber-500 to-orange-500",
    contact: {
      email: "amit@welluno.in"
    },
    quote: "The strongest strategies — in life and business — begin with a steady, well-supported mind."
  },
  {
    id: 4,
    name: "Raghav Agarwal",
    role: "Chief People Officer",
    boardPosition: "HR Lead",
    color: "from-green-500 to-emerald-500",
    contact: {
      email: "raghav@welluno.in"
    },
    quote: "True resilience is built in small, intentional moments of self-awareness practiced every day."
  }
];

const BoardMembersSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const cardVariants: Variants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }
    }
  };

  const modalVariants: Variants = {
    hidden: { 
      opacity: 0,
      scale: 0.9,
      y: 20 
    },
    visible: { 
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.2 }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedMember) {
        if (e.key === 'Escape') {
          setSelectedMember(null);
        }
        if (e.key === 'ArrowRight') {
          const currentIndex = boardMembers.findIndex(m => m.id === selectedMember.id);
          const nextIndex = (currentIndex + 1) % boardMembers.length;
          setSelectedMember(boardMembers[nextIndex]);
        }
        if (e.key === 'ArrowLeft') {
          const currentIndex = boardMembers.findIndex(m => m.id === selectedMember.id);
          const prevIndex = (currentIndex - 1 + boardMembers.length) % boardMembers.length;
          setSelectedMember(boardMembers[prevIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMember]);

  return (
    <section 
      ref={ref}
      id="board"
      className="relative w-full py-12 md:py-24 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-950 dark:via-black dark:to-gray-900"
      aria-labelledby="board-members-heading"
      itemScope
      itemType="https://schema.org/Organization"
    >
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "WELLUNO Leadership Team",
            "description": "Meet our leadership team driving innovation in corporate wellness.",
            "url": "https://welluno.in",
            "logo": "https://welluno.in/logo.jpg",
            "member": boardMembers.map(member => ({
              "@type": "Person",
              "name": member.name,
              "jobTitle": member.role,
              "email": member.contact.email,
              "sameAs": member.contact.linkedin ? [member.contact.linkedin] : undefined,
              "worksFor": {
                "@type": "Organization",
                "name": "WELLUNO"
              }
            }))
          })
        }}
      />

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-20 dark:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 70%)'
          }} />
        </div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-500/5 to-transparent dark:from-blue-900/10" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-purple-500/5 to-transparent dark:from-purple-900/10" />
        
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full ${
              isDark ? 'bg-blue-400/20' : 'bg-blue-500/10'
            }`}
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh'
            }}
            animate={{
              y: [null, -20, 20, 0],
              x: [null, 10, -10, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20 max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/10 dark:border-blue-500/20 mb-6"
          >
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              Executive Leadership
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            id="board-members-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6"
            itemProp="name"
          >
            Our{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                Leadership
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 blur-sm"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8"
            itemProp="description"
          >
            Dedicated professionals committed to transforming corporate wellness.
          </motion.p>
        </motion.header>

        {/* Board Members Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto"
          role="list"
          aria-label="Board members list"
        >
          {boardMembers.map((member, index) => {
            const isHovered = hoveredIndex === index;
            
            return (
              <motion.article
                key={member.id}
                variants={itemVariants}
                className="relative h-full"
                role="listitem"
                itemScope
                itemType="https://schema.org/Person"
              >
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  whileHover="hover"
                  className="relative h-full cursor-pointer group"
                  onClick={() => setSelectedMember(member)}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setSelectedMember(member);
                    }
                  }}
                  tabIndex={0}
                  aria-label={`View details for ${member.name}, ${member.role}`}
                >
                  {/* Card */}
                  <div className="relative h-full">
                    {/* Glow Effect */}
                    <div className={`
                      absolute -inset-0.5 rounded-2xl blur opacity-0 group-hover:opacity-100
                      transition-all duration-500 ${member.color.replace('from-', 'bg-gradient-to-r from-')}
                    `} />

                    {/* Main Card */}
                    <div className={`
                      relative rounded-2xl p-5 md:p-6 border h-full flex flex-col
                      transition-all duration-300 group-hover:shadow-xl
                      ${isDark 
                        ? 'bg-gray-900/90 backdrop-blur-xl border-gray-800 group-hover:border-gray-700' 
                        : 'bg-white/95 backdrop-blur-sm border-gray-200 group-hover:border-gray-300 shadow-lg'
                      }
                    `}>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        {/* Removed icon placeholder div */}

                        <div className="text-right w-full">
                          <div className={`
                            text-xs font-semibold px-3 py-1 rounded-full inline-block
                            ${isDark 
                              ? 'bg-gray-800 text-gray-300 border border-gray-700' 
                              : 'bg-gray-100 text-gray-700 border border-gray-300'
                            }
                          `}>
                            {member.boardPosition}
                          </div>
                          {member.years ? (
                            <div className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1 justify-end mt-1">
                              <span>{member.years} yrs</span>
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Name & Role */}
                      <div className="mb-4 flex-1">
                        <h3 
                          className="text-lg md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-1"
                          itemProp="name"
                        >
                          {member.name}
                        </h3>
                        <p 
                          className="text-sm text-gray-600 dark:text-gray-400"
                          itemProp="jobTitle"
                        >
                          {member.role}
                        </p>
                        
                        {/* Impact Metric – only if provided */}
                        {member.impact && (
                          <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                            <span className="font-medium truncate">{member.impact}</span>
                          </div>
                        )}

                        {/* Quote Preview – only if provided */}
                        {member.quote && (
                          <div className="mt-3">
                            <blockquote className="text-xs text-gray-500 dark:text-gray-500 italic line-clamp-2">
                              "{member.quote}"
                            </blockquote>
                          </div>
                        )}
                      </div>

                      {/* Expertise – only if any */}
                      {member.expertise && member.expertise.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1.5">
                            {member.expertise.slice(0, 2).map((skill, i) => (
                              <span
                                key={i}
                                className={`
                                  px-2.5 py-1 text-xs rounded-full font-medium
                                  ${isDark 
                                    ? 'bg-gray-800 text-gray-300' 
                                    : 'bg-gray-100 text-gray-700'
                                  }
                                `}
                                itemProp="knowsAbout"
                              >
                                {skill}
                              </span>
                            ))}
                            {member.expertise.length > 2 && (
                              <span className={`
                                px-2.5 py-1 text-xs rounded-full font-medium
                                ${isDark 
                                  ? 'bg-gray-800 text-gray-400' 
                                  : 'bg-gray-100 text-gray-600'
                                }
                              `}>
                                +{member.expertise.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Footer */}
                      <div className={`pt-4 border-t ${
                        isDark ? 'border-gray-800' : 'border-gray-200'
                      }`}>
                        {member.achievements ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-700 dark:text-gray-300">{member.achievements}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-500 ml-1">achievements</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span className="text-xs text-gray-500 dark:text-gray-500">Active</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-end items-center gap-1">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-gray-500 dark:text-gray-500">Active</span>
                          </div>
                        )}
                      </div>

                      {/* Contact hint – only text */}
                      {(member.contact.linkedin || member.contact.email) && (
                        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500 dark:text-gray-400">
                          {member.contact.linkedin && <span>LinkedIn</span>}
                          {member.contact.linkedin && member.contact.email && <span>•</span>}
                          {member.contact.email && <span>Email</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Team Connection Visualization */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="hidden lg:block mt-16"
        >
          <div className="relative h-24 max-w-5xl mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 dark:via-blue-500/30 to-transparent" />
            </div>
            
            <div className="absolute inset-0 flex items-center justify-between px-8">
              {boardMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  animate={{
                    scale: hoveredIndex === index ? 1.5 : 1,
                    boxShadow: hoveredIndex === index 
                      ? `0 0 0 4px ${member.color.split('from-')[1].split(' ')[0]}/20` 
                      : 'none'
                  }}
                  className={`relative w-3 h-3 rounded-full bg-gradient-to-br ${member.color}`}
                >
                  <div className={`
                    absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 rounded-lg
                    text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100
                    transition-opacity duration-300 pointer-events-none
                    ${isDark 
                      ? 'bg-gray-900 text-white border border-gray-800' 
                      : 'bg-white text-gray-900 border border-gray-200 shadow-lg'
                    }
                  `}>
                    {member.name}
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${
                      isDark ? 'bg-gray-900 border-r border-b border-gray-800' : 'bg-white border-r border-b border-gray-200'
                    }`} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-500">
                Collaborative Leadership Network
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedMember(null)}
            >
              {/* Modal */}
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={`
                  relative rounded-2xl overflow-hidden shadow-2xl max-w-4xl w-full max-h-[90vh]
                  ${isDark 
                    ? 'bg-gradient-to-br from-gray-900 to-black border border-gray-800' 
                    : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200'
                  }
                `}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                {/* Header */}
                <div className={`relative p-6 md:p-8 bg-gradient-to-r ${selectedMember.color} overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                      {/* Removed icon placeholder div */}
                      <div className="flex-1 min-w-0">
                        <h3 
                          id="modal-title"
                          className="text-2xl md:text-3xl font-bold text-white truncate"
                          itemProp="name"
                        >
                          {selectedMember.name}
                        </h3>
                        <p className="text-white/90 text-base md:text-lg">
                          {selectedMember.role}
                        </p>
                        {selectedMember.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-sm text-white/80">{selectedMember.location}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-white/20 text-white text-sm font-medium">
                          {selectedMember.boardPosition}
                        </span>
                        <button
                          onClick={() => setSelectedMember(null)}
                          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center hover:rotate-90 focus:outline-none focus:ring-2 focus:ring-white/50"
                          aria-label="Close modal"
                        >
                          <X className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex justify-between">
                      <button
                        onClick={() => {
                          const currentIndex = boardMembers.findIndex(m => m.id === selectedMember.id);
                          const prevIndex = (currentIndex - 1 + boardMembers.length) % boardMembers.length;
                          setSelectedMember(boardMembers[prevIndex]);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Previous board member"
                      >
                        <ChevronRight className="w-4 h-4 rotate-180" />
                        Previous
                      </button>
                      <button
                        onClick={() => {
                          const currentIndex = boardMembers.findIndex(m => m.id === selectedMember.id);
                          const nextIndex = (currentIndex + 1) % boardMembers.length;
                          setSelectedMember(boardMembers[nextIndex]);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all focus:outline-none focus:ring-2 focus:ring-white/50"
                        aria-label="Next board member"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                      {selectedMember.description && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                            About
                          </h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed" itemProp="description">
                            {selectedMember.description}
                          </p>
                        </div>
                      )}

                      {selectedMember.quote && (
                        <div className={`p-4 rounded-lg border ${
                          isDark ? 'bg-gray-800/30 border-gray-700' : 'bg-gray-100 border-gray-300'
                        }`}>
                          <div>
                            <blockquote className="text-sm italic text-gray-700 dark:text-gray-300">
                              "{selectedMember.quote}"
                            </blockquote>
                            <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
                              — {selectedMember.name}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedMember.previousRoles && selectedMember.previousRoles.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                            Previous Experience
                          </h4>
                          <ul className="space-y-2">
                            {selectedMember.previousRoles.map((role, i) => (
                              <li 
                                key={i}
                                className={`flex items-center gap-2 text-sm ${
                                  isDark ? 'text-gray-400' : 'text-gray-600'
                                }`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${selectedMember.color}`} />
                                {role}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                      {selectedMember.expertise && selectedMember.expertise.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                            Core Expertise
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedMember.expertise.map((skill, i) => (
                              <span
                                key={i}
                                className={`
                                  px-3 py-1.5 rounded-full text-xs font-medium
                                  bg-gradient-to-r ${selectedMember.color} bg-opacity-10
                                  border
                                  ${isDark 
                                    ? 'text-gray-300 border-gray-800' 
                                    : 'text-gray-700 border-gray-300'
                                  }
                                `}
                                itemProp="knowsAbout"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {(selectedMember.years || selectedMember.achievements || selectedMember.impact) && (
                        <div className="grid grid-cols-2 gap-3">
                          {selectedMember.years ? (
                            <div className={`p-3 rounded-lg ${
                              isDark ? 'bg-gray-800/20' : 'bg-gray-100'
                            }`}>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Experience</div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {selectedMember.years}+ years
                              </div>
                            </div>
                          ) : null}
                          {selectedMember.achievements ? (
                            <div className={`p-3 rounded-lg ${
                              isDark ? 'bg-gray-800/20' : 'bg-gray-100'
                            }`}>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Achievements</div>
                              <div className="text-lg font-bold text-gray-900 dark:text-white">
                                {selectedMember.achievements}
                              </div>
                            </div>
                          ) : null}
                          {selectedMember.impact ? (
                            <div className={`p-3 rounded-lg col-span-2 ${
                              isDark ? 'bg-gray-800/20' : 'bg-gray-100'
                            }`}>
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Key Impact</div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {selectedMember.impact}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {(selectedMember.contact.linkedin || selectedMember.contact.email || selectedMember.contact.website) && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
                            Connect
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {selectedMember.contact.linkedin && (
                              <a
                                href={selectedMember.contact.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                                  flex items-center gap-2 p-3 rounded-lg transition-all border
                                  ${isDark 
                                    ? 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20' 
                                    : 'bg-blue-500/5 hover:bg-blue-500/10 border-blue-500/10'
                                  }
                                `}
                                itemProp="sameAs"
                              >
                                <span className="text-xs text-gray-700 dark:text-gray-300">LinkedIn</span>
                              </a>
                            )}
                            {selectedMember.contact.email && (
                              <a
                                href={`mailto:${selectedMember.contact.email}`}
                                className={`
                                  flex items-center gap-2 p-3 rounded-lg transition-all border
                                  ${isDark 
                                    ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20' 
                                    : 'bg-purple-500/5 hover:bg-purple-500/10 border-purple-500/10'
                                  }
                                `}
                                itemProp="email"
                              >
                                <span className="text-xs text-gray-700 dark:text-gray-300">Email</span>
                              </a>
                            )}
                            {selectedMember.contact.website && (
                              <a
                                href={selectedMember.contact.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`
                                  flex items-center gap-2 p-3 rounded-lg transition-all border col-span-1 sm:col-span-2
                                  ${isDark 
                                    ? 'bg-gray-800/20 hover:bg-gray-800/30 border-gray-700' 
                                    : 'bg-gray-100 hover:bg-gray-200 border-gray-300'
                                  }
                                `}
                                itemProp="url"
                              >
                                <span className="text-xs text-gray-700 dark:text-gray-300">Personal Website</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className={`p-6 border-t ${
                  isDark ? 'border-gray-800' : 'border-gray-200'
                }`}>
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {selectedMember.contact.website ? (
                      <>
                        <div className="text-sm text-gray-500 dark:text-gray-500 text-center sm:text-left">
                          Board member since {new Date().getFullYear() - (selectedMember.years || 0)}
                        </div>
                        <a
                          href={selectedMember.contact.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-medium text-white
                            bg-gradient-to-r ${selectedMember.color} hover:opacity-90
                            transition-all duration-300
                            flex items-center justify-center gap-2
                          `}
                        >
                          View Full Profile
                        </a>
                      </>
                    ) : (
                      <div className="w-full text-center text-sm text-gray-500 dark:text-gray-500">
                        Board member
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Accessibility Announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {selectedMember ? `Viewing details for ${selectedMember.name}, ${selectedMember.role}. Use arrow keys to navigate between team members or Escape to close.` : ''}
      </div>

      {/* Ambient Glow Effects */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/5 dark:from-blue-500/10 to-transparent pointer-events-none blur-3xl" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl" />
    </section>
  );
};

export default BoardMembersSection;