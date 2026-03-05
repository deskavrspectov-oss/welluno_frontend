import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const ShootingStars = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const newStars: Star[] = [];
      for (let i = 0; i < 5; i++) {
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 30,
          delay: Math.random() * 5,
          duration: 2 + Math.random() * 2,
        });
      }
      setStars(newStars);
    };

    generateStars();
    const interval = setInterval(generateStars, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Static twinkling stars */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`twinkle-${i}`}
          className="absolute w-1 h-1 bg-gold rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
        />
      ))}

      {/* Shooting stars */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
          }}
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [-50, -300],
            y: [0, 200],
          }}
          transition={{
            duration: star.duration,
            delay: star.delay,
            repeat: Infinity,
            repeatDelay: 5 + Math.random() * 3,
            ease: "linear",
          }}
        >
          <div className="relative">
            <div className="w-2 h-2 bg-gold rounded-full shadow-glow-gold" />
            <div className="absolute top-1/2 right-full w-20 h-0.5 bg-gradient-to-l from-gold to-transparent -translate-y-1/2" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShootingStars;