import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface DecorativeItem {
  id: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  text: string;
  variant: "why" | "question";
  fontSize: number;
  opacity: number;
  color: string;
  fontFamily: string;
  fontWeight: number;
  collected?: boolean;
  animationDelay?: number;
}

export interface DecorativeWhyBackgroundProps {
  maxCount?: number;
  density?: number;
  variant?: "why" | "question" | "mixed";
  persistRemovals?: boolean;
  storageKey?: string;
  theme?: "auto" | "light" | "dark";
  removalDuration?: number;
  containerClassName?: string;
  enableAnimations?: boolean;
  onCollectionUpdate?: (collectedCount: number, totalCount: number) => void;
  showCollectionCounter?: boolean;
}

const DecorativeWhyBackground: React.FC<DecorativeWhyBackgroundProps> = ({
  maxCount = 80,
  density = 0.95,
  variant = "mixed",
  persistRemovals = true,
  storageKey = "welluno-why-section-collections",
  theme = "auto",
  removalDuration = 350,
  containerClassName = "",
  enableAnimations = true,
  onCollectionUpdate,
  showCollectionCounter = false,
}) => {
  const [items, setItems] = useState<DecorativeItem[]>([]);
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [isClient, setIsClient] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");
  const containerRef = useRef<HTMLDivElement>(null);
  const collectionSoundRef = useRef<HTMLAudioElement | null>(null);

  // Font families for different variants
  const whyFonts = [
    "'Brush Script MT', cursive",
    "'Dancing Script', cursive",
    "'Great Vibes', cursive",
    "'Pacifico', cursive",
    "'Sacramento', cursive",
  ];

  const questionFonts = [
    "'Fredoka One', cursive",
    "'Bangers', cursive",
    "'Lilita One', cursive",
    "'Righteous', cursive",
    "'Concert One', cursive",
  ];

  // Initialize client-side detection
  useEffect(() => {
    setIsClient(true);
    
    // Determine theme
    const determineTheme = () => {
      if (theme === "auto") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setCurrentTheme(isDark ? "dark" : "light");
      } else {
        setCurrentTheme(theme);
      }
    };
    
    determineTheme();
    
    const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (theme === "auto") {
        setCurrentTheme(e.matches ? "dark" : "light");
      }
    };
    
    themeMediaQuery.addEventListener("change", handleThemeChange);
    
    // Load collected items from storage
    if (persistRemovals) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as string[];
          setCollectedItems(new Set(parsed));
        }
      } catch (error) {
        console.warn("Failed to load collected items from storage:", error);
      }
    }

    // Preload collection sound
    collectionSoundRef.current = new Audio(
      "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=="
    );

    return () => {
      themeMediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, [persistRemovals, storageKey, theme]);

  // Generate decorative items
  useEffect(() => {
    if (!isClient || !containerRef.current || items.length > 0) return;

    const container = containerRef.current;
    const { width, height } = container.getBoundingClientRect();
    
    // Calculate actual count based on density and container size
    const baseCount = Math.min(maxCount, Math.floor((width * height) / 3000));
    const actualCount = Math.floor(baseCount * density);
    
    const newItems: DecorativeItem[] = [];
    const existingPositions = new Set<string>();
    
    // Theme-based colors with better contrast
    const getColors = () => {
      if (currentTheme === "dark") {
        return {
          why: [
            "rgba(255, 255, 255, 0.95)",
            "rgba(255, 215, 0, 0.9)",
            "rgba(255, 182, 193, 0.9)",
            "rgba(173, 216, 230, 0.9)",
          ],
          question: [
            "rgba(255, 255, 255, 0.95)",
            "rgba(144, 238, 144, 0.9)",
            "rgba(221, 160, 221, 0.9)",
            "rgba(255, 160, 122, 0.9)",
          ],
        };
      } else {
        return {
          why: [
            "rgba(0, 0, 0, 0.9)",
            "rgba(138, 43, 226, 0.9)",
            "rgba(219, 39, 119, 0.9)",
            "rgba(31, 41, 55, 0.9)",
          ],
          question: [
            "rgba(0, 0, 0, 0.9)",
            "rgba(59, 130, 246, 0.9)",
            "rgba(34, 197, 94, 0.9)",
            "rgba(234, 88, 12, 0.9)",
          ],
        };
      }
    };

    const colors = getColors();

    for (let i = 0; i < actualCount; i++) {
      let attempts = 0;
      let item: DecorativeItem | null = null;
      
      // Try to find a non-overlapping position
      while (attempts < 20 && !item) {
        const x = Math.random() * 85 + 7.5; // 7.5-92.5%
        const y = Math.random() * 85 + 7.5; // 7.5-92.5%
        
        // Grid-based collision avoidance with tighter grid
        const gridX = Math.floor(x / 8);
        const gridY = Math.floor(y / 8);
        const positionKey = `${gridX},${gridY}`;
        
        if (!existingPositions.has(positionKey)) {
          const itemVariant = 
            variant === "mixed" 
              ? Math.random() > 0.5 ? "why" : "question"
              : variant;
          
          const fonts = itemVariant === "why" ? whyFonts : questionFonts;
          const fontIndex = Math.floor(Math.random() * fonts.length);
          
          // Different size ranges for why and question
          const baseSize = itemVariant === "why" ? 22 : 28;
          const sizeVariation = itemVariant === "why" ? 16 : 24;
          const fontSize = baseSize + Math.random() * sizeVariation;
          
          // Different opacity for better readability
          const opacity = 0.25 + Math.random() * 0.3;
          
          // Different font weights
          const fontWeight = itemVariant === "why" 
            ? 400 + Math.random() * 300 
            : 700 + Math.random() * 300;
          
          item = {
            id: `decorative-${itemVariant}-${x.toFixed(2)}-${y.toFixed(2)}-${i}`,
            x,
            y,
            rotation: Math.random() * 40 - 20, // -20 to 20 degrees
            scale: 0.9 + Math.random() * 0.4, // 0.9 to 1.3
            text: itemVariant === "why" ? "why" : "?",
            variant: itemVariant,
            fontSize,
            opacity,
            color: colors[itemVariant][Math.floor(Math.random() * colors[itemVariant].length)],
            fontFamily: fonts[fontIndex],
            fontWeight,
            animationDelay: Math.random() * 3,
          };
          
          existingPositions.add(positionKey);
        }
        attempts++;
      }
      
      if (item) {
        newItems.push(item);
      }
    }
    
    setItems(newItems);
  }, [isClient, maxCount, density, variant, currentTheme]);

  // Save collected items to storage
  useEffect(() => {
    if (!isClient || !persistRemovals) return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify([...collectedItems]));
    } catch (error) {
      console.warn("Failed to save collected items to storage:", error);
    }
    
    // Notify parent of collection update
    if (onCollectionUpdate) {
      onCollectionUpdate(collectedItems.size, items.length);
    }
  }, [collectedItems, persistRemovals, storageKey, isClient, items.length, onCollectionUpdate]);

  // Handle item collection
  const handleCollectItem = useCallback((itemId: string) => {
    // Play collection sound (if available)
    if (collectionSoundRef.current) {
      collectionSoundRef.current.currentTime = 0;
      collectionSoundRef.current.play().catch(() => {
        // Silent fail for audio
      });
    }
    
    // Add to collected items
    setCollectedItems(prev => {
      const newSet = new Set(prev);
      newSet.add(itemId);
      return newSet;
    });
    
    // Add subtle vibration feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  // Reset all collections
  const handleReset = useCallback(() => {
    setCollectedItems(new Set());
  }, []);

  // Calculate collection progress
  const collectionProgress = items.length > 0 
    ? Math.round((collectedItems.size / items.length) * 100) 
    : 0;

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  // Filter out collected items for rendering
  const visibleItems = items.filter(item => !collectedItems.has(item.id));

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${containerClassName}`}
    >
      {/* AnimatePresence for smooth collection animations */}
      <AnimatePresence>
        {visibleItems.map((item) => (
          <motion.div
            key={item.id}
            className="absolute cursor-pointer pointer-events-auto group"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
              fontFamily: item.fontFamily,
              fontWeight: item.fontWeight,
              fontSize: `${item.fontSize}px`,
              color: item.color,
              opacity: item.opacity,
              textShadow: currentTheme === 'dark' 
                ? '0 2px 8px rgba(0, 0, 0, 0.5)'
                : '0 2px 4px rgba(255, 255, 255, 0.5)',
            }}
            initial={{ 
              opacity: 0,
              scale: item.scale * 0.5,
              rotate: item.rotation - 45,
            }}
            animate={{ 
              opacity: item.opacity,
              scale: item.scale,
              rotate: item.rotation,
              y: enableAnimations ? [0, -15, 0] : 0,
            }}
            exit={{ 
              opacity: 0,
              scale: 0,
              rotate: item.rotation + 180,
            }}
            transition={{
              opacity: { duration: 0.5 },
              scale: { duration: 0.5 },
              rotate: { duration: 0.5 },
              y: enableAnimations 
                ? { 
                    duration: 4, 
                    repeat: Infinity,
                    delay: item.animationDelay,
                    ease: "easeInOut" 
                  } 
                : undefined,
            }}
            whileHover={{
              scale: item.scale * 1.3,
              opacity: 1,
              rotate: 0,
              transition: { duration: 0.2 },
            }}
            onClick={() => handleCollectItem(item.id)}
            title={`Click to collect ${item.variant === 'why' ? 'why' : 'question mark'}`}
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div 
                className="absolute inset-0 blur-md"
                style={{ 
                  background: item.color,
                  opacity: 0.3,
                }}
              />
            </div>
            
            {/* Main text */}
            <div className="relative transition-all duration-300 group-hover:scale-110">
              {item.text}
            </div>
            
            {/* Collection hint */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              <div className="text-xs font-semibold bg-black/50 text-white px-2 py-1 rounded-full">
                {item.variant === 'why' ? 'Collect "why"' : 'Collect "?"'}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Collection counter (optional) */}
      {showCollectionCounter && items.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 right-4 pointer-events-auto"
        >
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Collection Progress
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {collectedItems.size}/{items.length}
                </span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${collectionProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            
            {/* Reset button */}
            {collectedItems.size > 0 && (
              <button
                onClick={handleReset}
                className="mt-2 w-full text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                Reset collection
              </button>
            )}
          </div>
        </motion.div>
      )}

      {/* Collection celebration effect */}
      {collectedItems.size > 0 && collectedItems.size % 5 === 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
              initial={{
                x: "50vw",
                y: "50vh",
                opacity: 1,
              }}
              animate={{
                x: `calc(${Math.cos((i * Math.PI) / 10) * 100}vw)`,
                y: `calc(${Math.sin((i * Math.PI) / 10) * 100}vh)`,
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}

      {/* Add font styles to document head */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Brush+Script+MT&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Pacifico&family=Sacramento&family=Fredoka+One&family=Bangers&family=Lilita+One&family=Righteous&family=Concert+One&display=swap');
        
        /* Enhanced text rendering */
        .enhanced-text {
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
    </div>
  );
};

export default React.memo(DecorativeWhyBackground);