import { motion } from "framer-motion";

interface RainbowDividerProps {
  className?: string;
  animated?: boolean;
}

const RainbowDivider = ({ className = "", animated = true }: RainbowDividerProps) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <motion.div
        className="h-1 w-full gradient-rainbow"
        style={{
          backgroundSize: "200% 100%",
        }}
        animate={animated ? {
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Glow effect */}
      <div className="absolute inset-0 gradient-rainbow opacity-50 blur-sm" />
    </div>
  );
};

export default RainbowDivider;