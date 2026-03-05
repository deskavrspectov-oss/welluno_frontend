import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useConfetti } from "@/hooks/useConfetti";
import { Sparkles, Heart, Star, Zap, Gift } from "lucide-react";

interface SurpriseButtonProps {
  children: React.ReactNode;
  variant?: "hero" | "warm" | "glass" | "navy" | "outline" | "default";
  size?: "default" | "sm" | "lg" | "xl";
  className?: string;
  href?: string;
  onClick?: () => void;
  surpriseType?: "confetti" | "hearts" | "stars" | "rainbow";
}

const surpriseIcons = [Sparkles, Heart, Star, Zap, Gift];

const SurpriseButton = ({ 
  children, 
  variant = "hero", 
  size = "lg",
  className = "",
  href,
  onClick,
  surpriseType = "confetti"
}: SurpriseButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [floatingIcons, setFloatingIcons] = useState<{ id: number; Icon: any; x: number }[]>([]);
  const { fireConfetti, fireMultiple, fireRainbow, fireStars } = useConfetti();

  const handleClick = () => {
    // Fire surprise effect
    switch (surpriseType) {
      case "confetti":
        fireMultiple();
        break;
      case "rainbow":
        fireRainbow();
        break;
      case "stars":
        fireStars();
        break;
      case "hearts":
        fireConfetti({
          shapes: ['circle'],
          colors: ['#F5A48A', '#FF6B6B', '#FFB8B8'],
        });
        break;
    }

    // Spawn floating icons
    const newIcons = [...Array(5)].map((_, i) => ({
      id: Date.now() + i,
      Icon: surpriseIcons[Math.floor(Math.random() * surpriseIcons.length)],
      x: Math.random() * 100 - 50,
    }));
    setFloatingIcons(newIcons);

    // Clear after animation
    setTimeout(() => setFloatingIcons([]), 1000);

    onClick?.();
  };

  const ButtonComponent = (
    <Button
      variant={variant}
      size={size}
      className={`magic-button relative overflow-visible ${className}`}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
        className="relative z-10 flex items-center gap-2"
      >
        {children}
      </motion.span>

      {/* Floating icons on click */}
      {floatingIcons.map(({ id, Icon, x }) => (
        <motion.span
          key={id}
          className="absolute pointer-events-none"
          initial={{ y: 0, x: 0, opacity: 1, scale: 0 }}
          animate={{ y: -60, x: x, opacity: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Icon className="w-5 h-5 text-gold" />
        </motion.span>
      ))}

      {/* Hover sparkle effect */}
      {isHovered && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                repeat: Infinity,
              }}
            >
              <Sparkles className="w-3 h-3 text-gold" />
            </motion.span>
          ))}
        </motion.span>
      )}
    </Button>
  );

  if (href) {
    return <a href={href}>{ButtonComponent}</a>;
  }

  return ButtonComponent;
};

export default SurpriseButton;