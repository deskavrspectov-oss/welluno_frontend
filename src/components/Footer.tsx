import { motion } from "framer-motion";
import { Heart, Mail, Linkedin, Phone, Instagram, ArrowUp, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import wellunoLogo from "@/assets/welluno-logo.jpg";
import ShootingStars from "./ShootingStars";
import AnimatedLogo from "./AnimatedLogo";

const footerLinks = {
  company: [
    { label: "About", href: "#about" },
    { label: "Solutions", href: "#solutions" },
    { label: "Events", href: "#events" },
    { label: "Community", href: "#community" },
  ],
  resources: [
    { label: "Blog", href: "/blog", badge: "Live" },
    { label: "Press Kit", href: "/press" },
    { label: "Careers", href: "/careers" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { 
    icon: Phone, 
    href: "tel:+917982904715", 
    label: "Call Us",
    ariaLabel: "Call Welluno at 7982904715" 
  },
  { 
    icon: Linkedin, 
    href: "https://www.linkedin.com/company/welluno/", 
    label: "LinkedIn",
    ariaLabel: "Visit Welluno on LinkedIn" 
  },
  { 
    icon: Instagram, 
    href: "https://www.instagram.com/welluno.in/", 
    label: "Instagram",
    ariaLabel: "Visit Welluno on Instagram" 
  },
  { 
    icon: Mail, 
    href: "mailto:welluno.pvt.ltd@gmail.com", 
    label: "Email",
    ariaLabel: "Email Welluno at welluno.pvt.ltd@gmail.com" 
  },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  // Detect dark mode from document
  useEffect(() => {
    const updateDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    // Initial check
    updateDarkMode();
    
    // Observe changes to dark class
    const observer = new MutationObserver(updateDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setIsSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setIsSubscribed(false);
      }, 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="relative pt-12 pb-8 overflow-hidden transition-colors duration-300">
      {/* Schema.org structured data for SEO */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "WELLUNO",
          "url": "https://welluno.in",
          "logo": "https://welluno.in/logo.jpg",
          "description": "Making work human again with AI-powered insights and genuine human connection through handcrafted wellness experiences.",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-7982904715",
            "contactType": "Customer Service",
            "email": "welluno.pvt.ltd@gmail.com"
          },
          "sameAs": [
            "https://www.linkedin.com/company/welluno/",
            "https://www.instagram.com/welluno.in/"
          ]
        })}
      </script>

      {/* Background - Different for light/dark mode */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? "bg-gradient-to-b from-gray-900 via-gray-900/95 to-gray-900" 
          : "bg-gradient-to-b from-navy via-navy/95 to-navy"
      }`} />
      
      {/* Shooting Stars - Adjusted for dark mode */}
      <div className="absolute inset-0 overflow-hidden">
        <ShootingStars />
      </div>
      
      {/* Gradient overlay - Adjusted opacity for dark mode */}
      <div className={`absolute inset-0 pointer-events-none ${
        isDarkMode 
          ? "bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/80" 
          : "bg-gradient-to-t from-navy via-navy/95 to-navy/90"
      }`} />

      {/* Subtle grid pattern */}
      <div className={`absolute inset-0 ${
        isDarkMode 
          ? "bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]" 
          : "bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
      } bg-[size:40px_40px]`} />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-start gap-4">
              {/* Logo with scroll to top */}
              <motion.button
                onClick={scrollToTop}
                className="flex-shrink-0 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Scroll to top"
              >
                <div className="relative">
                  <motion.div
                    className={`absolute inset-0 rounded-xl blur-md group-hover:blur-lg transition-all duration-300 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-primary/40 to-coral/40"
                        : "bg-gradient-to-br from-primary/30 to-coral/30"
                    }`}
                    animate={{
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <img
                    src={wellunoLogo}
                    alt="Welluno Logo - Workplace Wellness Platform"
                    className={`relative h-14 w-14 rounded-xl object-cover border-2 ${
                      isDarkMode 
                        ? "border-gray-700/50 shadow-xl group-hover:border-primary/40" 
                        : "border-background/20 shadow-lg group-hover:border-primary/30"
                    } transition-all duration-300`}
                    width={56}
                    height={56}
                  />
                </div>
              </motion.button>
              
              <div className="space-y-3">
                <h1 className={`text-2xl font-bold tracking-tight ${
                  isDarkMode ? "text-white" : "text-background"
                }`}>
                  WELLUNO
                </h1>
                <p className={`text-sm leading-relaxed max-w-md ${
                  isDarkMode ? "text-gray-300" : "text-background/70"
                }`}>
                  Making work human again with AI-powered insights and genuine human connection through handcrafted wellness experiences.
                </p>
                {/* Hidden SEO text */}
                <div className="sr-only">
                  Welluno provides corporate wellness solutions, employee wellness programs, workplace wellbeing, mental health support, and team building activities for companies across India.
                </div>
              </div>
            </div>

            {/* Language Section */}
            <div className="mt-6">
              <AnimatedLogo />
              <motion.p 
                className="text-gold font-script text-xl mt-3 flex items-center gap-2"
                animate={{ 
                  textShadow: ["0 0 10px rgba(245,158,11,0)", "0 0 10px rgba(245,158,11,0.3)", "0 0 10px rgba(245,158,11,0)"]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-4 h-4" />
                Own Your Story
                <Sparkles className="w-4 h-4" />
              </motion.p>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Company Links */}
              <div>
                <motion.h2 
                  className={`font-semibold mb-5 text-sm tracking-wider uppercase relative inline-block ${
                    isDarkMode ? "text-white" : "text-background"
                  }`}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <span className="relative z-10">Company</span>
                  <motion.span 
                    className={`absolute -bottom-1 left-0 h-0.5 rounded-full ${
                      isDarkMode ? "bg-primary/80" : "bg-primary"
                    }`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                  />
                </motion.h2>
                <ul className="space-y-2.5">
                  {footerLinks.company.map((link, index) => (
                    <motion.li 
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.a
                        href={link.href}
                        onClick={() => handleLinkClick(link.href)}
                        className={`group flex items-center transition-all duration-300 text-sm ${
                          isDarkMode 
                            ? "text-gray-400 hover:text-primary" 
                            : "text-background/60 hover:text-primary"
                        }`}
                        whileHover={{ x: 4 }}
                        aria-label={`Navigate to ${link.label} section`}
                      >
                        <span className="relative">
                          {link.label}
                          <span className={`absolute left-0 -bottom-0.5 w-0 h-px ${
                            isDarkMode ? "bg-primary/70" : "bg-primary"
                          } group-hover:w-full transition-all duration-300`} />
                        </span>
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Resources Links */}
              <div>
                <motion.h2 
                  className={`font-semibold mb-5 text-sm tracking-wider uppercase relative inline-block ${
                    isDarkMode ? "text-white" : "text-background"
                  }`}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <span className="relative z-10">Resources</span>
                  <motion.span 
                    className={`absolute -bottom-1 left-0 h-0.5 rounded-full ${
                      isDarkMode ? "bg-coral/80" : "bg-coral"
                    }`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                  />
                </motion.h2>
                <ul className="space-y-2.5">
                  {footerLinks.resources.map((link, index) => (
                    <motion.li 
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.1 }}
                      viewport={{ once: true }}
                    >
                      <motion.a
                        href={link.href}
                        className={`group flex items-center gap-2 transition-all duration-300 text-sm ${
                          isDarkMode 
                            ? "text-gray-400 hover:text-primary" 
                            : "text-background/60 hover:text-primary"
                        }`}
                        whileHover={{ x: 4 }}
                        rel={link.href.startsWith('http') ? "noopener noreferrer" : undefined}
                        target={link.href.startsWith('http') ? "_blank" : undefined}
                        aria-label={link.badge ? `${link.label} - ${link.badge}` : link.label}
                      >
                        <span className="relative">
                          {link.label}
                          <span className={`absolute left-0 -bottom-0.5 w-0 h-px ${
                            isDarkMode ? "bg-primary/70" : "bg-primary"
                          } group-hover:w-full transition-all duration-300`} />
                        </span>
                        {link.badge && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full transition-all duration-300 ${
                              link.label === "Blog"
                                ? isDarkMode
                                  ? "bg-primary/40 text-primary-200 shadow-[0_0_10px_rgba(59,130,246,0.7)] animate-pulse"
                                  : "bg-primary/30 text-primary-700 shadow-[0_0_10px_rgba(59,130,246,0.5)] animate-pulse"
                                : isDarkMode
                                ? "bg-primary/20 text-primary/90"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {link.badge}
                          </span>
                        )}
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <motion.h2 
                  className={`font-semibold mb-5 text-sm tracking-wider uppercase relative inline-block ${
                    isDarkMode ? "text-white" : "text-background"
                  }`}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <span className="relative z-10">Legal</span>
                  <motion.span 
                    className={`absolute -bottom-1 left-0 h-0.5 rounded-full ${
                      isDarkMode ? "bg-gold/80" : "bg-gold"
                    }`}
                    initial={{ width: 0 }}
                    whileInView={{ width: "60%" }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  />
                </motion.h2>
                <ul className="space-y-2.5">
                  {footerLinks.legal.map((link, index) => (
                    <motion.li 
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                      viewport={{ once: true }}
                    >
                      <motion.a
                        href={link.href}
                        className={`group flex items-center transition-all duration-300 text-sm ${
                          isDarkMode 
                            ? "text-gray-400 hover:text-primary" 
                            : "text-background/60 hover:text-primary"
                        }`}
                        whileHover={{ x: 4 }}
                        aria-label={`Read our ${link.label}`}
                      >
                        <span className="relative">
                          {link.label}
                          <span className={`absolute left-0 -bottom-0.5 w-0 h-px ${
                            isDarkMode ? "bg-primary/70" : "bg-primary"
                          } group-hover:w-full transition-all duration-300`} />
                        </span>
                      </motion.a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact & Social Links */}
            <div className="mt-10">
              <p className={`text-sm mb-4 ${
                isDarkMode ? "text-gray-400" : "text-background/60"
              }`}>
                Contact us
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith('http') ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel || social.label}
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -3,
                      transition: { type: "spring", stiffness: 400, damping: 25 }
                    }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
                      isDarkMode 
                        ? "bg-gray-800/30 text-gray-300 border-gray-700/50 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/40"
                        : "bg-background/5 text-background/60 border-background/10 group-hover:bg-background/10 group-hover:text-primary group-hover:border-primary/30"
                    }`}>
                      <social.icon size={18} />
                    </div>
                    <span className={`absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border ${
                      isDarkMode 
                        ? "bg-gray-900 text-gray-100 border-gray-700" 
                        : "bg-navy text-background border-background/10"
                    }`}>
                      {social.label}
                    </span>
                  </motion.a>
                ))}
                {/* Direct contact info for SEO */}
                <div className="sr-only">
                  <a href="tel:+917982904715">+91 79829 04715</a>
                  <a href="mailto:welluno.pvt.ltd@gmail.com">welluno.pvt.ltd@gmail.com</a>
                  <a href="https://www.linkedin.com/company/welluno/">LinkedIn Company Page</a>
                  <a href="https://www.instagram.com/welluno.in/">Instagram Profile</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Form */}
        <motion.div 
          className={`mb-10 p-5 rounded-xl border backdrop-blur-sm ${
            isDarkMode 
              ? "bg-gray-900/40 border-gray-700/30" 
              : "bg-gradient-to-r from-background/5 via-background/10 to-background/5 border-background/10"
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className={`font-semibold mb-1 ${
                isDarkMode ? "text-white" : "text-background"
              }`}>
                Join our wellness journey
              </h3>
              <p className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-background/60"
              }`}>
                Get insights and updates on creating happier workplaces
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your work email"
                  className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-300 focus:outline-none focus:ring-2 ${
                    isDarkMode 
                      ? "bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:ring-primary/50" 
                      : "bg-background/5 border border-background/10 text-background placeholder:text-background/40 focus:ring-primary/50"
                  }`}
                  required
                  aria-label="Your work email for newsletter subscription"
                />
                {isSubscribed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute -bottom-6 left-0 text-xs ${
                      isDarkMode ? "text-primary/90" : "text-primary"
                    }`}
                  >
                    Thanks for subscribing! 🎉
                  </motion.div>
                )}
              </div>
              <motion.button
                type="submit"
                disabled={isSubscribed}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/30"
                    : "bg-gradient-to-r from-primary to-primary/80 text-background hover:shadow-md hover:shadow-primary/20"
                }`}
                aria-label="Subscribe to newsletter"
              >
                {isSubscribed ? "Subscribed!" : "Subscribe"}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Bottom Bar */}
        <div className={`pt-6 flex flex-col md:flex-row justify-between items-center gap-4 ${
          isDarkMode 
            ? "border-t border-gray-800" 
            : "border-t border-background/10"
        }`}>
          <div className="flex items-center gap-2 text-sm order-2 md:order-1">
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className={`flex items-center gap-1 ${
                isDarkMode ? "text-gray-500" : "text-background/50"
              }`}
            >
              <Heart className="w-4 h-4 text-coral fill-coral" aria-hidden="true" />
              <span>© {currentYear} Welluno Pvt Ltd. All rights reserved.</span>
            </motion.span>
            <span className={`hidden md:inline ${
              isDarkMode ? "text-gray-600" : "text-background/30"
            }`} aria-hidden="true">•</span>
            <span className={`hidden md:inline ${
              isDarkMode ? "text-gray-500" : "text-background/50"
            }`}>
              Corporate wellness solutions for happier workplaces
            </span>
          </div>

          
        </div>

        {/* Mobile message */}
        <div className={`md:hidden text-center text-xs mt-4 ${
          isDarkMode ? "text-gray-600" : "text-background/40"
        }`}>
          Corporate wellness solutions for happier workplaces
        </div>

        {/* SEO Keywords in hidden div */}
        <div className="sr-only">
          Welluno: Corporate wellness programs, employee wellbeing solutions, workplace mental health, team building activities, stress management workshops, corporate wellness India, employee engagement programs, workplace happiness, wellness workshops, corporate health programs, organizational wellbeing, workplace wellness platforms, employee wellness initiatives, corporate wellbeing solutions, mental wellness at work, workplace wellness consulting, employee health and wellness, corporate wellness services, workplace wellness programs India, employee wellbeing platform.
        </div>
      </div>
    </footer>
  );
};

export default Footer;