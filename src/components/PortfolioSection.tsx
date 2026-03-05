import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Rocket, Users, Globe, ChevronRight, Sparkles, TrendingUp, HeartHandshake } from "lucide-react";

const partners = [
  {
    name: "Nokia",
    type: "Enterprise",
    description: "Strategic wellness initiatives for global teams",
    icon: Globe,
    color: "from-blue-500 to-teal-400",
    darkColor: "from-blue-600 to-teal-500",
    metric: "+87%",
    metricLabel: "Engagement",
  },
  {
    name: "InternshipKaro",
    type: "Startup",
    description: "Empowering young professionals",
    icon: Rocket,
    color: "from-orange-400 to-yellow-400",
    darkColor: "from-orange-500 to-yellow-500",
    metric: "2.4x",
    metricLabel: "Growth",
  },
  {
    name: "Spectov",
    type: "Tech Partner",
    description: "Innovation meets wellbeing",
    icon: Users,
    color: "from-purple-400 to-pink-400",
    darkColor: "from-purple-500 to-pink-500",
    metric: "98%",
    metricLabel: "Satisfaction",
  },
];

const PortfolioSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

  return (
    <section 
      ref={ref}
      className="py-12 md:py-16 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/30 dark:to-gray-900 relative overflow-hidden"
    >
      {/* Minimal background elements */}
      <motion.div 
        style={{ opacity: opacityProgress, scale: scaleProgress }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 -right-4 w-48 h-48 bg-gradient-to-r from-blue-100/20 to-teal-100/20 dark:from-blue-900/10 dark:to-teal-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-4 w-48 h-48 bg-gradient-to-r from-orange-100/20 to-yellow-100/20 dark:from-orange-900/10 dark:to-yellow-900/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20 border border-blue-100 dark:border-blue-800/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
            <span className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              Trusted By Industry Leaders
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Partners Who <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-400 dark:to-teal-300">Thrive</span> With Us
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Driving measurable impact across organizations through innovative wellness solutions
          </p>
        </motion.div>

        {/* Timeline/Flow Layout */}
        <div className="max-w-4xl mx-auto">
          {/* Progress line */}
          <div className="relative h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-700 mb-8 md:mb-12">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-500 dark:from-blue-400 dark:to-teal-400 origin-left"
            />
          </div>

          {/* Partners in timeline layout */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -4 }}
                className="group relative"
              >
                {/* Connection line */}
                {index < partners.length - 1 && (
                  <div className="hidden md:block absolute top-8 right-0 w-8 h-0.5 bg-gray-200 dark:bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-teal-400 transition-colors" />
                )}

                {/* Partner badge */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${partner.color} dark:${partner.darkColor} shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <partner.icon className="w-5 h-5 text-white" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white dark:bg-gray-800 rounded-full border-2 border-white dark:border-gray-800" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">{partner.name}</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{partner.type}</span>
                  </div>
                </div>

                {/* Metric badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 mb-3">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{partner.metric}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300">{partner.metricLabel}</span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {partner.description}
                </p>

                {/* Hover link */}
                <motion.div
                  initial={{ x: -5, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                  className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer"
                >
                  View case study
                  <ChevronRight className="w-3 h-3" />
                </motion.div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:via-blue-50/50 group-hover:dark:via-blue-900/10 transition-all duration-300" />
              </motion.div>
            ))}
          </div>


        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-10 md:mt-12"
        >
          <button className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-500 dark:to-teal-400 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/25 dark:hover:shadow-blue-400/25 transition-all duration-300">
            Become a Partner
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Join forward-thinking companies transforming workplace wellness
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;