import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const translations = [
  { lang: "English", text: "Welluno" },
  { lang: "Hindi", text: "वेलुनो" },
  { lang: "Japanese", text: "ウェルーノ" },
  { lang: "Arabic", text: "ويلونو" },
  { lang: "Chinese", text: "健康一号" },
  { lang: "Korean", text: "웰우노" },
  { lang: "Russian", text: "Веллуно" },
  { lang: "Greek", text: "Γουέλουνο" },
];

interface AnimatedLogoProps {
  className?: string;
  showLabel?: boolean;
}

const AnimatedLogo = ({ className = "", showLabel = true }: AnimatedLogoProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % translations.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative overflow-hidden h-14 flex items-center justify-center min-w-[200px]">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ y: 40, opacity: 0, rotateX: -90 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            exit={{ y: -40, opacity: 0, rotateX: 90 }}
            transition={{ 
              duration: 0.5,
              ease: [0.23, 1, 0.32, 1]
            }}
            className="text-4xl md:text-5xl font-bold text-gradient-primary font-display absolute"
          >
            {translations[currentIndex].text}
          </motion.span>
        </AnimatePresence>
      </div>
      {showLabel && (
        <motion.span
          key={`label-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mt-1 font-mono-custom"
        >
          {translations[currentIndex].lang}
        </motion.span>
      )}
    </div>
  );
};

export default AnimatedLogo;