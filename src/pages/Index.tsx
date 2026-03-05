import { useEffect, useRef, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import SEOHead from "@/components/SEOHead";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import MentalHealthGame from "@/components/MentalHealthGame";
import SolutionsSection from "@/components/SolutionsSection";
import EventsSection from "@/components/EventsSection";
import OrganizationsSection from "@/components/OrganizationsSection";
import PortfolioSection from "@/components/PortfolioSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";
import RainbowDivider from "@/components/RainbowDivider";
import BoardMembersSection from "@/components/BoardMembersSection";
import MentalHealthSpectrum from "@/components/MentalHealthSpectrum";
import { ChevronUp, ChevronDown, MessageCircle, HelpCircle } from "lucide-react";

const Index = () => {
  // --- State & refs (browser-friendly types)
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [showScrollHint, setShowScrollHint] = useState<boolean>(true);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isScrollingToSection, setIsScrollingToSection] = useState<boolean>(false);

  const scrollTimeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);
  const lastScrollY = useRef<number>(0);
  const scrollDirection = useRef<"up" | "down">("down");
  const isScrollingRef = useRef<boolean>(false);

  // --- Sections list (used for navigation dots & counts)
  const sections = [
    { id: "hero", name: "Home" },
    { id: "about", name: "What" },
    { id: "spectrum", name: "Spectrum" },
    { id: "game", name: "Play" },
    { id: "solutions", name: "How" },
    { id: "events", name: "For Me" },
    { id: "organizations", name: "For Organizations" },
    { id: "portfolio", name: "Portfolio" },
    { id: "board", name: "Team" },
    { id: "community", name: "Community" },
    { id: "faq", name: "FAQ" },
    { id: "footer", name: "Contact" },
  ];

  // --- Add custom scrollbar & base styles (cleanup on unmount)
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Custom scrollbar */
      ::-webkit-scrollbar { width: 8px; height: 8px; }
      ::-webkit-scrollbar-track { background: rgba(243,244,246,0.5); border-radius: 4px; }
      ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #3b82f6, #8b5cf6); border-radius: 4px; transition: background 0.3s ease; }
      ::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, #60a5fa, #a78bfa); }
      .dark ::-webkit-scrollbar-track { background: rgba(31,41,55,0.5); }
      .dark ::-webkit-scrollbar-thumb { background: linear-gradient(180deg, #1d4ed8, #7c3aed); }
      body { margin: 0; padding: 0; overflow-x: hidden; scroll-behavior: smooth; }
      html { scroll-behavior: smooth; scroll-padding-top: 80px; }
      section { scroll-margin-top: 80px; }
      #mental-health-section { scroll-margin-top: 100px; }
      .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      .scrollbar-hide::-webkit-scrollbar { display: none; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // --- Scroll progress calculation
  const updateScrollProgress = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const progress = Math.max(0, Math.min(1, scrollY / (documentHeight - windowHeight)));

    setScrollProgress((prev) => {
      if (Math.abs(progress - prev) > 0.001) return progress;
      return prev;
    });

    scrollDirection.current = scrollY > lastScrollY.current ? "down" : "up";
    lastScrollY.current = scrollY;
  }, []);

  // --- Main scroll handler (throttled with RAF)
  const handleScroll = useCallback(() => {
    if (isScrollingRef.current || isScrollingToSection) return;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      updateScrollProgress();

      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      let foundIndex = currentSection;
      const scrollPosition = scrollY + windowHeight * 0.4;
      const isAtBottom = scrollY + windowHeight >= documentHeight - 10;

      if (isAtBottom) {
        foundIndex = sections.length - 1;
      } else {
        for (let i = 0; i < sections.length; i++) {
          const sec = sectionRefs.current[i];
          if (!sec) continue;
          const sectionTop = sec.offsetTop - 100;
          const sectionBottom = sectionTop + sec.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            foundIndex = i;
            break;
          }
        }
      }

      if (foundIndex !== currentSection) {
        setCurrentSection(foundIndex);
      }

      if (scrollY > 100 && showScrollHint) {
        setShowScrollHint(false);
      }
    });
  }, [currentSection, isScrollingToSection, showScrollHint, sections.length, updateScrollProgress]);

  // --- Attach scroll listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    // run once to populate state
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  // --- ensure initial progress update after mount
  useEffect(() => {
    const t = window.setTimeout(() => updateScrollProgress(), 500);
    return () => window.clearTimeout(t);
  }, [updateScrollProgress]);

  // --- Smooth scroll to section
  const scrollToSection = useCallback(
    (index: number) => {
      if (index < 0 || index >= sections.length) return;

      setIsScrollingToSection(true);
      isScrollingRef.current = true;
      setCurrentSection(index);

      if (index === sections.length - 1) {
        // footer / bottom
        window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight, behavior: "smooth" });
      } else {
        const section = sectionRefs.current[index];
        if (!section) return;
        const navbarHeight = 80;
        const targetTop = Math.max(0, section.offsetTop - navbarHeight);
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrollingToSection(false);
        isScrollingRef.current = false;
        scrollTimeoutRef.current = null;
      }, 700);
    },
    [sections.length]
  );

  // --- helper to create stable ref callbacks
  const createSectionRef = useCallback((index: number) => {
    return (el: HTMLElement | null) => {
      sectionRefs.current[index] = el;
    };
  }, []);

  // --- Render
  return (
    <>
      <SEOHead />
      <main className="min-h-screen overflow-x-hidden relative bg-white dark:bg-gray-900">
        {/* Scroll progress bar */}
        <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-200 ease-out"
            style={{
              width: `${scrollProgress * 100}%`,
              transform: `translateX(${scrollProgress === 0 ? "-0.5%" : "0%"})`,
            }}
          />
        </div>

        {/* Navigation dots (desktop) */}
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col gap-3">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(index)}
              className="relative group p-1 focus:outline-none"
              aria-label={`Go to ${section.name}`}
            >
              <div className="w-2 h-2 rounded-full transition-all duration-200 flex items-center justify-center">
                <div
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    currentSection === index
                      ? "bg-blue-600 dark:bg-blue-400 scale-100"
                      : "bg-gray-400 dark:bg-gray-600 scale-75 group-hover:scale-100 group-hover:bg-blue-400 dark:group-hover:bg-blue-500"
                  }`}
                />
              </div>

              <div className="absolute right-full mr-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="bg-gray-800 dark:bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded whitespace-nowrap shadow-lg">
                  {section.name}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Scroll arrows (desktop) */}
        <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:flex flex-col gap-2 items-center">
          {currentSection > 0 && (
            <button
              onClick={() => scrollToSection(currentSection - 1)}
              className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
              aria-label="Previous section"
            >
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}

          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 my-1 flex items-center gap-1">
            <span>{currentSection + 1}</span>
            <span>/</span>
            <span>{sections.length}</span>
          </div>

          {currentSection < sections.length - 1 && (
            <button
              onClick={() => scrollToSection(currentSection + 1)}
              className="w-10 h-10 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200"
              aria-label="Next section"
            >
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Scroll hint */}
        {showScrollHint && currentSection === 0 && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 animate-bounce pointer-events-none">
            <div className="flex flex-col items-center gap-1">
              <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex items-start justify-center p-1">
                <div className="w-1 h-2 bg-gray-500 dark:bg-gray-400 rounded-full animate-pulse" />
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">Scroll to explore</div>
            </div>
          </div>
        )}

        {/* WhatsApp CTA */}
        <div className="fixed bottom-4 left-4 z-40 md:bottom-6 md:left-6">
          <a
            href="https://chat.whatsapp.com/Cu27SfhZvDLC73AhnQ8nZd?mode=gi_t"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium hidden sm:inline">Join WhatsApp Group</span>
            <span className="text-sm font-medium sm:hidden">Join</span>
          </a>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <Navbar />

          <div ref={createSectionRef(0)}>
            <HeroSection />
          </div>

          <div ref={createSectionRef(1)}>
            <AboutSection />
            <RainbowDivider className="opacity-50" />
          </div>

          <div ref={createSectionRef(2)}>
            <section id="spectrum" className="relative overflow-hidden">
              <MentalHealthSpectrum />
            </section>
            <RainbowDivider className="opacity-50" />
          </div>

          <div ref={createSectionRef(3)}>
            <section id="wellness-game" className="relative overflow-hidden py-8 md:py-12 lg:py-16" style={{ minHeight: "60vh" }}>
              <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="max-w-6xl mx-auto">
                  <MentalHealthGame />
                </div>
              </div>
            </section>
            <RainbowDivider className="opacity-50" />
          </div>

          <div ref={createSectionRef(4)}>
            <SolutionsSection />
          </div>

          <div ref={createSectionRef(5)}>
            <EventsSection />
          </div>

          <div ref={createSectionRef(6)}>
            <OrganizationsSection />
          </div>

          <div ref={createSectionRef(7)}>
            <PortfolioSection />
          </div>

          <div ref={createSectionRef(8)}>
            <BoardMembersSection />
          </div>

          <div ref={createSectionRef(9)}>
            <CommunitySection />
          </div>

          {/* UPDATED FAQ SECTION */}
          <div ref={createSectionRef(10)} className="bg-gray-50 dark:bg-gray-800 py-16">
            <section className="max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-600">
                  <h3 className="text-xl font-semibold mb-3 flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <span>What is corporate mental wellness?</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Corporate mental wellness focuses on improving employee psychological wellbeing through structured programs, burnout prevention strategies, and emotional support systems.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-600">
                  <h3 className="text-xl font-semibold mb-3 flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <span>How does burnout affect workplace productivity?</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Burnout reduces productivity, increases absenteeism, lowers engagement, and contributes to higher turnover—impacting both people and company outcomes.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-600">
                  <h3 className="text-xl font-semibold mb-3 flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <span>How does Welluno help organizations?</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Welluno combines AI-powered emotional insights with live wellness experiences and tailored interventions to prevent burnout and build resilient workplace cultures.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-600">
                  <h3 className="text-xl font-semibold mb-3 flex items-start gap-2">
                    <HelpCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                    <span>Are corporate wellness programs effective?</span>
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    When designed strategically and embedded into organizational systems, wellness programs improve morale, reduce stress-related leave, and enhance long-term performance.
                  </p>
                </div>
              </div>
            </section>
            {/* <RainbowDivider className="opacity-50" /> */}
          </div>

          {/* Footer */}
          <div ref={createSectionRef(11)} className="relative">
            <Footer />
          </div>
        </div>

        {/* Mobile arrows */}
        <div className="fixed bottom-20 right-4 z-40 flex md:hidden flex-col gap-2">
          {currentSection > 0 && (
            <button
              onClick={() => scrollToSection(currentSection - 1)}
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md"
              aria-label="Previous section"
            >
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
          {currentSection < sections.length - 1 && (
            <button
              onClick={() => scrollToSection(currentSection + 1)}
              className="w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-md"
              aria-label="Next section"
            >
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          )}
        </div>

        {/* Back to top */}
        {currentSection > 3 && (
          <button
            onClick={() => scrollToSection(0)}
            className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            aria-label="Back to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        )}
      </main>

      {/* FAQ JSON-LD (unchanged) */}
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is corporate mental wellness?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Corporate mental wellness focuses on improving employee psychological wellbeing through structured programs, burnout prevention strategies, and emotional support systems.",
                },
              },
              {
                "@type": "Question",
                name: "How does burnout affect workplace productivity?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Burnout reduces productivity, increases absenteeism, lowers engagement, and contributes to higher turnover—impacting both people and company outcomes.",
                },
              },
              {
                "@type": "Question",
                name: "How does Welluno help organizations?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Welluno combines AI-powered emotional insights with live wellness experiences and tailored interventions to prevent burnout and build resilient workplace cultures.",
                },
              },
              {
                "@type": "Question",
                name: "Are corporate wellness programs effective?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "When designed strategically and embedded into organizational systems, wellness programs improve morale, reduce stress-related leave, and enhance long-term performance.",
                },
              },
            ],
          })}
        </script>
      </Helmet>
    </>
  );
};

export default Index;