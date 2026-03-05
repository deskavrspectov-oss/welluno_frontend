import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Heart, Brain, Coffee, Users, 
  Zap, Sparkles, Trophy, RotateCcw,
  Play, Pause, Volume2, VolumeX,
  X, Activity, Target,
  Clock, Battery, Star, AlertTriangle,
  CheckCircle, Briefcase, Building,
  ChevronUp, ChevronDown
} from 'lucide-react';

interface Obstacle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'negative' | 'positive' | 'powerup';
  emoji: string;
  value: number;
  speed: number;
  effect?: 'slow' | 'speed' | 'shield' | 'magnet' | 'points';
  color: string;
  name: string;
  rotation: number;
  pulse: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
  type: 'sparkle' | 'smoke' | 'collect' | 'damage';
}

interface CloudType {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface GameStats {
  score: number;
  highScore: number;
  energy: number;
  productivity: number;
  distance: number;
  speed: number;
  multiplier: number;
  combo: number;
  level: number;
  jumpCount: number;
  duckCount: number;
}

interface PowerUp {
  type: 'shield' | 'magnet' | 'speed' | 'points';
  active: boolean;
  duration: number;
  timeLeft: number;
}

interface MentalHealthGameProps {
  className?: string;
}

const MentalHealthGame = ({ className = '' }: MentalHealthGameProps) => {
  // Get dark mode from document
  const [isDark, setIsDark] = useState(false);
  
  // Game state
  const [gameActive, setGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    energy: 100,
    productivity: 100,
    distance: 0,
    speed: 5,
    multiplier: 1,
    combo: 0,
    level: 1,
    jumpCount: 0,
    duckCount: 0
  });
  
  const [playerState, setPlayerState] = useState({
    y: 0,
    velocity: 0,
    isJumping: false,
    canDoubleJump: false,
    hasDoubleJumped: false,
    isDucking: false,
    invulnerable: false,
    magnetActive: false,
    runCycle: 0,
    duckProgress: 0,
    jumpProgress: 0
  });
  
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [clouds, setClouds] = useState<CloudType[]>([]);
  const [gameMessage, setGameMessage] = useState<{text: string, type: 'positive' | 'negative' | 'info'} | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [environment, setEnvironment] = useState({
    timeOfDay: 9,
    weather: 'sunny' as 'sunny' | 'cloudy' | 'rainy',
    wind: 0.5,
    buildingVariation: 0
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastFrameRef = useRef<number>(0);
  const obstacleIdRef = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const gameStartTimeRef = useRef<number>(0);
  const lastObstacleSpawnRef = useRef<number>(0);
  const lastCloudSpawnRef = useRef<number>(0);
  const canvasWidth = useRef<number>(800);
  const canvasHeight = useRef<number>(400);
  const runAnimationRef = useRef<number>(0);
  
  // Game constants - FIXED VALUES
  const GRAVITY = 0.5;
  const JUMP_FORCE = 12;
  const GROUND_LEVEL = 320;
  const PLAYER_WIDTH = 50;
  const PLAYER_HEIGHT = 70;
  const PLAYER_DUCK_HEIGHT = 40;
  const PLAYER_X = 120;
  const BASE_SPEED = 5;
  const MAX_SPEED = 15;
  const SCORE_PER_SECOND = 5;
  const MAX_CLOUDS = 6;
  
  // Enhanced obstacles with better visuals
  const workplaceObstacles = [
    { 
      emoji: '⏰', 
      name: 'Deadline', 
      width: 45, 
      height: 45, 
      value: 25, 
      color: '#EF4444', 
      effect: 'slow',
      rotationSpeed: 0.02
    },
    { 
      emoji: '🔥', 
      name: 'Burnout', 
      width: 50, 
      height: 50, 
      value: 20, 
      color: '#F59E0B',
      rotationSpeed: 0.01
    },
    { 
      emoji: '📧', 
      name: 'Email Flood', 
      width: 55, 
      height: 40, 
      value: 15, 
      color: '#6B7280',
      rotationSpeed: 0.005
    },
    { 
      emoji: '💼', 
      name: 'Overtime', 
      width: 50, 
      height: 50, 
      value: 30, 
      color: '#1F2937',
      rotationSpeed: 0.015
    },
  ];
  
  // Enhanced wellness items
  const wellnessItems = [
    { 
      emoji: '☕', 
      name: 'Coffee Break', 
      width: 40, 
      height: 50, 
      value: 25, 
      color: '#D97706', 
      effect: 'speed',
      rotationSpeed: 0.01
    },
    { 
      emoji: '🧘', 
      name: 'Mindfulness', 
      width: 45, 
      height: 45, 
      value: 30, 
      color: '#10B981',
      rotationSpeed: 0.008
    },
    { 
      emoji: '💪', 
      name: 'Energy Boost', 
      width: 40, 
      height: 40, 
      value: 20, 
      color: '#3B82F6',
      rotationSpeed: 0.012
    },
    { 
      emoji: '👥', 
      name: 'Team Support', 
      width: 50, 
      height: 50, 
      value: 35, 
      color: '#8B5CF6',
      rotationSpeed: 0.006
    },
  ];
  
  // Enhanced power-ups
  const powerUps = [
    { 
      emoji: '⚡', 
      name: 'Productivity Surge', 
      width: 45, 
      height: 45, 
      value: 50, 
      color: '#F59E0B', 
      effect: 'speed',
      rotationSpeed: 0.02
    },
    { 
      emoji: '🛡️', 
      name: 'Focus Shield', 
      width: 50, 
      height: 50, 
      value: 40, 
      color: '#06B6D4', 
      effect: 'shield',
      rotationSpeed: 0.015
    },
    { 
      emoji: '⭐', 
      name: 'Star Performer', 
      width: 40, 
      height: 40, 
      value: 60, 
      color: '#FBBF24', 
      effect: 'points',
      rotationSpeed: 0.025
    },
  ];

  // Check dark mode from document
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // Observe for dark mode changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    setGameStats(prev => ({
      ...prev,
      score: 0,
      energy: 100,
      productivity: 100,
      distance: 0,
      speed: BASE_SPEED,
      multiplier: 1,
      combo: 0,
      level: 1,
      jumpCount: 0,
      duckCount: 0
    }));
    
    setPlayerState({
      y: 0,
      velocity: 0,
      isJumping: false,
      canDoubleJump: false,
      hasDoubleJumped: false,
      isDucking: false,
      invulnerable: false,
      magnetActive: false,
      runCycle: 0,
      duckProgress: 0,
      jumpProgress: 0
    });
    
    setActivePowerUps([]);
    setObstacles([]);
    setParticles([]);
    setClouds([]);
    setGameMessage(null);
    setGameTime(0);
    setEnvironment({
      timeOfDay: 9,
      weather: 'sunny',
      wind: 0.5,
      buildingVariation: 0
    });
    setGameActive(true);
    setIsPaused(false);
    obstacleIdRef.current = 0;
    gameStartTimeRef.current = Date.now();
    lastObstacleSpawnRef.current = Date.now();
    lastCloudSpawnRef.current = Date.now();
    keysPressed.current.clear();
    runAnimationRef.current = 0;
    
    // Initialize clouds
    const initialClouds: CloudType[] = [];
    for (let i = 0; i < 4; i++) {
      initialClouds.push({
        x: Math.random() * canvasWidth.current,
        y: Math.random() * 120 + 20,
        size: Math.random() * 35 + 25,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.3
      });
    }
    setClouds(initialClouds);
    
    setGameMessage({ 
      text: "🏃‍♂️ Start your workday! Collect wellness items and avoid burnout! 🚀", 
      type: 'info' 
    });
  }, []);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('corporate_wellness_high_score');
    if (savedHighScore) {
      setGameStats(prev => ({ ...prev, highScore: parseInt(savedHighScore) }));
    }
  }, []);

  // Save high score
  useEffect(() => {
    if (gameStats.score > gameStats.highScore) {
      localStorage.setItem('corporate_wellness_high_score', gameStats.score.toString());
      setGameStats(prev => ({ ...prev, highScore: gameStats.score }));
    }
  }, [gameStats.score, gameStats.highScore]);

  // Create enhanced particles
  const createParticles = useCallback((x: number, y: number, count: number, color: string, type: Particle['type']) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = type === 'sparkle' ? 2 + Math.random() * 3 : 
                   type === 'collect' ? 1.5 + Math.random() * 2 :
                   type === 'damage' ? 1 + Math.random() * 1.5 :
                   0.5 + Math.random() * 1;
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
        size: type === 'sparkle' ? 2 + Math.random() * 3 :
              type === 'collect' ? 3 + Math.random() * 4 :
              type === 'damage' ? 2 + Math.random() * 3 :
              1 + Math.random() * 2,
        type
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Show game message
  const showGameMessage = useCallback((text: string, type: 'positive' | 'negative' | 'info' = 'info') => {
    setGameMessage({ text, type });
    setTimeout(() => setGameMessage(null), 2000);
  }, []);

  // Activate power-up
  const activatePowerUp = useCallback((effect: string, duration: number = 5000) => {
    const powerUp: PowerUp = {
      type: effect as any,
      active: true,
      duration,
      timeLeft: duration
    };
    
    setActivePowerUps(prev => {
      const existingIndex = prev.findIndex(p => p.type === effect);
      if (existingIndex >= 0) {
        const newPowerUps = [...prev];
        newPowerUps[existingIndex] = powerUp;
        return newPowerUps;
      }
      return [...prev, powerUp];
    });
    
    switch(effect) {
      case 'speed':
        setGameStats(prev => ({ ...prev, speed: Math.min(MAX_SPEED, prev.speed * 1.5) }));
        createParticles(PLAYER_X + PLAYER_WIDTH/2, GROUND_LEVEL - playerState.y + PLAYER_HEIGHT/2, 15, '#F59E0B', 'sparkle');
        showGameMessage("⚡ Productivity Surge Activated!", 'positive');
        break;
      case 'shield':
        setPlayerState(prev => ({ ...prev, invulnerable: true }));
        createParticles(PLAYER_X + PLAYER_WIDTH/2, GROUND_LEVEL - playerState.y + PLAYER_HEIGHT/2, 12, '#06B6D4', 'sparkle');
        showGameMessage("🛡️ Focus Shield Activated!", 'positive');
        break;
      case 'magnet':
        setPlayerState(prev => ({ ...prev, magnetActive: true }));
        createParticles(PLAYER_X + PLAYER_WIDTH/2, GROUND_LEVEL - playerState.y + PLAYER_HEIGHT/2, 15, '#8B5CF6', 'sparkle');
        showGameMessage("🧲 Wellness Magnet Activated!", 'positive');
        break;
      case 'points':
        setGameStats(prev => ({ ...prev, multiplier: prev.multiplier * 2 }));
        createParticles(PLAYER_X + PLAYER_WIDTH/2, GROUND_LEVEL - playerState.y + PLAYER_HEIGHT/2, 20, '#FBBF24', 'sparkle');
        showGameMessage("⭐ Double Points Activated!", 'positive');
        break;
    }
    
    setTimeout(() => {
      setActivePowerUps(prev => prev.filter(p => p.type !== effect));
      if (effect === 'speed') {
        setGameStats(prev => ({ ...prev, speed: BASE_SPEED + (prev.level * 0.3) }));
      }
      if (effect === 'shield') {
        setPlayerState(prev => ({ ...prev, invulnerable: false }));
      }
      if (effect === 'magnet') {
        setPlayerState(prev => ({ ...prev, magnetActive: false }));
      }
      if (effect === 'points') {
        setGameStats(prev => ({ ...prev, multiplier: 1 + Math.floor(prev.combo / 3) }));
      }
    }, duration);
  }, [showGameMessage, createParticles, playerState.y]);

  // Handle jump with better physics
  const handleJump = useCallback(() => {
    if (!gameActive || isPaused) return;
    
    // Ground jump
    if (!playerState.isJumping && playerState.y === 0) {
      setPlayerState(prev => ({
        ...prev,
        isJumping: true,
        canDoubleJump: true,
        hasDoubleJumped: false,
        velocity: -JUMP_FORCE,
        jumpProgress: 0
      }));
      setGameStats(prev => ({ ...prev, jumpCount: prev.jumpCount + 1 }));
      createParticles(PLAYER_X + PLAYER_WIDTH/2, GROUND_LEVEL, 8, '#60A5FA', 'sparkle');
    }
    // Double jump
    else if (playerState.isJumping && playerState.canDoubleJump && !playerState.hasDoubleJumped && playerState.y > 60) {
      setPlayerState(prev => ({
        ...prev,
        hasDoubleJumped: true,
        canDoubleJump: false,
        velocity: -JUMP_FORCE * 0.8,
        jumpProgress: 0.5
      }));
      createParticles(PLAYER_X + PLAYER_WIDTH/2, GROUND_LEVEL - playerState.y + PLAYER_HEIGHT/2, 12, '#A78BFA', 'sparkle');
    }
  }, [gameActive, isPaused, playerState, createParticles]);

  // Handle duck with smooth transition
  const handleDuck = useCallback((ducking: boolean) => {
    if (!gameActive || isPaused) return;
    setPlayerState(prev => ({ 
      ...prev, 
      isDucking: ducking,
      duckProgress: ducking ? 0 : 1 
    }));
    if (ducking) {
      setGameStats(prev => ({ ...prev, duckCount: prev.duckCount + 1 }));
    }
  }, [gameActive, isPaused]);

  // Generate obstacles with better distribution
  const generateObstacle = useCallback((currentTime: number) => {
    const minSpawnInterval = Math.max(800, 1500 - gameStats.distance * 0.3);
    if (currentTime - lastObstacleSpawnRef.current < minSpawnInterval) return;
    
    const rand = Math.random();
    let obstacleList: any[];
    let type: 'negative' | 'positive' | 'powerup';
    
    if (rand < 0.45) {
      // Negative obstacle (45% chance)
      obstacleList = workplaceObstacles;
      type = 'negative';
    } else if (rand < 0.85) {
      // Positive item (40% chance)
      obstacleList = wellnessItems;
      type = 'positive';
    } else {
      // Power-up (15% chance)
      obstacleList = powerUps;
      type = 'powerup';
    }
    
    const obstacle = obstacleList[Math.floor(Math.random() * obstacleList.length)];
    
    // Calculate vertical position with better distribution
    let y = GROUND_LEVEL - obstacle.height;
    if (type === 'negative' && Math.random() > 0.5) {
      y = GROUND_LEVEL - obstacle.height - (Math.random() * 80 + 40);
    }
    
    const newObstacle: Obstacle = {
      id: obstacleIdRef.current++,
      x: canvasWidth.current + 50,
      y,
      width: obstacle.width,
      height: obstacle.height,
      type,
      emoji: obstacle.emoji,
      value: obstacle.value,
      speed: gameStats.speed * (0.9 + Math.random() * 0.2),
      effect: obstacle.effect,
      color: obstacle.color,
      name: obstacle.name,
      rotation: 0,
      pulse: 0
    };
    
    setObstacles(prev => [...prev, newObstacle]);
    lastObstacleSpawnRef.current = currentTime;
  }, [gameStats.distance, gameStats.speed]);

  // Generate clouds
  const generateCloud = useCallback((currentTime: number) => {
    if (currentTime - lastCloudSpawnRef.current < 4000) return;
    
    const newCloud: CloudType = {
      x: canvasWidth.current + 50,
      y: Math.random() * 120 + 20,
      size: Math.random() * 40 + 25,
      speed: Math.random() * 0.3 + 0.1,
      opacity: Math.random() * 0.5 + 0.2
    };
    
    setClouds(prev => {
      const updatedClouds = [...prev, newCloud];
      if (updatedClouds.length > MAX_CLOUDS) {
        updatedClouds.shift();
      }
      return updatedClouds;
    });
    
    lastCloudSpawnRef.current = currentTime;
  }, []);

  // Check collision
  const checkCollision = useCallback((obstacle: Obstacle) => {
    const playerHeight = playerState.isDucking ? PLAYER_DUCK_HEIGHT : PLAYER_HEIGHT;
    const playerBottom = GROUND_LEVEL - playerState.y;
    const playerTop = playerBottom - playerHeight;
    
    const playerHitbox = {
      left: PLAYER_X + 10,
      right: PLAYER_X + PLAYER_WIDTH - 10,
      top: playerTop + 10,
      bottom: playerBottom - 5
    };
    
    const obstacleHitbox = {
      left: obstacle.x + 8,
      right: obstacle.x + obstacle.width - 8,
      top: obstacle.y + 8,
      bottom: obstacle.y + obstacle.height - 8
    };
    
    return !(
      playerHitbox.right < obstacleHitbox.left ||
      playerHitbox.left > obstacleHitbox.right ||
      playerHitbox.bottom < obstacleHitbox.top ||
      playerHitbox.top > obstacleHitbox.bottom
    );
  }, [playerState.y, playerState.isDucking]);

  // Update combo system
  const updateCombo = useCallback((positive: boolean) => {
    if (positive) {
      setGameStats(prev => {
        const newCombo = prev.combo + 1;
        const newMultiplier = Math.min(5, 1 + Math.floor(newCombo / 2));
        
        if (newCombo % 2 === 0) {
          showGameMessage(`${newCombo} Combo! x${newMultiplier}`, 'positive');
          createParticles(PLAYER_X + PLAYER_WIDTH/2, GROUND_LEVEL - playerState.y + PLAYER_HEIGHT/2, 8, '#8B5CF6', 'sparkle');
        }
        
        return {
          ...prev,
          combo: newCombo,
          multiplier: newMultiplier
        };
      });
    } else {
      setGameStats(prev => ({ ...prev, combo: 0, multiplier: 1 }));
    }
  }, [showGameMessage, createParticles, playerState.y]);

  // Main game loop
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastFrameRef.current) lastFrameRef.current = timestamp;
    const delta = Math.min(timestamp - lastFrameRef.current, 32);
    lastFrameRef.current = timestamp;

    if (!gameActive || isPaused) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const currentTime = Date.now();
    const elapsedTime = (currentTime - gameStartTimeRef.current) / 1000;
    setGameTime(elapsedTime);

    // Update environment
    setEnvironment(prev => ({
      ...prev,
      timeOfDay: (prev.timeOfDay + 0.0005) % 24,
      wind: 0.5 + Math.sin(elapsedTime / 10) * 0.2
    }));

    // Update player physics with smooth animations
    setPlayerState(prev => {
      let newVelocity = prev.velocity + GRAVITY;
      let newY = prev.y - newVelocity;
      let newRunCycle = prev.runCycle + 0.15;
      let newJumpProgress = Math.min(1, prev.jumpProgress + 0.04);
      let newDuckProgress = prev.isDucking ? 
        Math.min(1, prev.duckProgress + 0.15) : 
        Math.max(0, prev.duckProgress - 0.15);
      
      if (newY <= 0) {
        newY = 0;
        newVelocity = 0;
        newJumpProgress = 0;
        return {
          ...prev,
          y: newY,
          velocity: newVelocity,
          isJumping: false,
          canDoubleJump: false,
          hasDoubleJumped: false,
          runCycle: newRunCycle,
          jumpProgress: newJumpProgress,
          duckProgress: newDuckProgress
        };
      }
      
      return { 
        ...prev, 
        y: newY, 
        velocity: newVelocity,
        runCycle: newRunCycle,
        jumpProgress: newJumpProgress,
        duckProgress: newDuckProgress
      };
    });

    // Update game stats
    setGameStats(prev => {
      const newDistance = prev.distance + prev.speed * 0.1;
      const scoreIncrease = Math.floor(prev.speed * SCORE_PER_SECOND * (delta / 1000) * prev.multiplier);
      const newScore = prev.score + scoreIncrease;
      
      const speedIncrease = (newDistance / 1000) * 0.5;
      const newSpeed = Math.min(MAX_SPEED, BASE_SPEED + speedIncrease);
      
      const energyDrainRate = 0.2 + (prev.speed / MAX_SPEED) * 0.6;
      const productivityDrainRate = 0.1 + (prev.speed / MAX_SPEED) * 0.3;
      
      const newEnergy = Math.max(0, prev.energy - energyDrainRate * 0.06);
      const newProductivity = Math.max(20, prev.productivity - productivityDrainRate * 0.06);
      
      const newLevel = Math.floor(newScore / 500) + 1;
      
      if (newLevel > prev.level) {
        showGameMessage(`🎉 Promoted to Level ${newLevel}!`, 'positive');
        createParticles(PLAYER_X + PLAYER_WIDTH/2, GROUND_LEVEL - playerState.y + PLAYER_HEIGHT/2, 20, '#F59E0B', 'sparkle');
      }
      
      return { 
        ...prev, 
        distance: newDistance, 
        score: newScore,
        speed: newSpeed,
        energy: newEnergy,
        productivity: newProductivity,
        level: newLevel
      };
    });

    // Generate obstacles and clouds
    generateObstacle(currentTime);
    generateCloud(currentTime);

    // Update obstacles
    setObstacles(prev => {
      const newObstacles = prev.map(obstacle => {
        let newX = obstacle.x - obstacle.speed;
        let newRotation = obstacle.rotation + (obstacle.type === 'powerup' ? 0.025 : 0.008);
        let newPulse = Math.sin(elapsedTime * 2) * 0.15 + 0.85;
        
        if (checkCollision({ ...obstacle, x: newX })) {
          const isShielded = playerState.invulnerable && obstacle.type === 'negative';
          
          if (obstacle.type === 'positive' || obstacle.type === 'powerup') {
            const points = obstacle.value * gameStats.multiplier;
            setGameStats(prevStats => {
              const updatedStats: any = {
                score: prevStats.score + points,
                energy: Math.min(100, prevStats.energy + Math.floor(points / 2)),
                productivity: Math.min(100, prevStats.productivity + Math.floor(points / 3))
              };
              
              if (obstacle.emoji === '☕') {
                updatedStats.energy = Math.min(100, prevStats.energy + 20);
                showGameMessage("Coffee Break! +20 Energy ☕", 'positive');
              } else if (obstacle.effect) {
                activatePowerUp(obstacle.effect);
              } else {
                showGameMessage(`+${points} ${obstacle.name}`, 'positive');
              }
              
              return { ...prevStats, ...updatedStats };
            });
            
            createParticles(newX + obstacle.width/2, obstacle.y + obstacle.height/2, 
              12, obstacle.color, 'collect');
            updateCombo(true);
            return null;
          } else if (!isShielded) {
            const damage = obstacle.value;
            setGameStats(prevStats => ({
              ...prevStats,
              energy: Math.max(0, prevStats.energy - damage),
              productivity: Math.max(20, prevStats.productivity - damage * 0.5),
              speed: Math.max(BASE_SPEED, prevStats.speed * (obstacle.effect === 'slow' ? 0.7 : 0.9))
            }));
            
            createParticles(newX + obstacle.width/2, obstacle.y + obstacle.height/2, 10, '#EF4444', 'damage');
            showGameMessage(`${obstacle.name}! -${damage}`, 'negative');
            updateCombo(false);
            
            // Screen shake
            if (canvasRef.current) {
              canvasRef.current.style.transform = 'translateX(6px) translateY(3px)';
              setTimeout(() => {
                if (canvasRef.current) canvasRef.current.style.transform = '';
              }, 100);
            }
            return null;
          } else {
            createParticles(newX + obstacle.width/2, obstacle.y + obstacle.height/2, 6, '#06B6D4', 'collect');
          }
        }
        
        return { 
          ...obstacle, 
          x: newX, 
          rotation: newRotation,
          pulse: newPulse
        };
      }).filter((obstacle): obstacle is Obstacle => 
        obstacle !== null && obstacle.x + obstacle.width > -100
      );
      
      return newObstacles;
    });

    // Update particles
    setParticles(prev => 
      prev.map(p => ({
        ...p,
        x: p.x - gameStats.speed * 0.3 + (p.type === 'sparkle' ? Math.sin(p.life * 10) * 1.5 : 0),
        y: p.y + p.vy + (p.type === 'sparkle' ? Math.cos(p.life * 10) * 0.8 : 0),
        vy: p.vy + (p.type === 'sparkle' ? -0.015 : 0.06),
        life: p.life - (p.type === 'sparkle' ? 0.025 : 0.015)
      })).filter(p => p.life > 0 && p.x > -100)
    );

    // Update clouds
    setClouds(prev => 
      prev.map(cloud => ({
        ...cloud,
        x: cloud.x - cloud.speed * environment.wind,
        opacity: cloud.opacity + Math.sin(elapsedTime + cloud.x) * 0.03
      })).filter(cloud => cloud.x > -200)
    );

    // Update power-ups time left
    setActivePowerUps(prev => 
      prev.map(powerup => ({
        ...powerup,
        timeLeft: Math.max(0, powerup.timeLeft - delta)
      })).filter(powerup => powerup.timeLeft > 0)
    );

    // Game over condition
    if (gameStats.energy <= 0) {
      setGameActive(false);
      if (gameStats.score > gameStats.highScore) {
        showGameMessage(`🏆 New High Score! ${gameStats.score}`, 'positive');
      } else {
        showGameMessage(`End of Workday! Score: ${gameStats.score}`, 'info');
      }
    }

    renderGame(timestamp);
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [
    gameActive, isPaused, gameStats, playerState, checkCollision, 
    createParticles, showGameMessage, updateCombo, generateObstacle, 
    generateCloud, activatePowerUp, environment.wind
  ]);

  // Enhanced render game with beautiful scenery
  const renderGame = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    // Clear canvas
    const skyGradient = ctx.createLinearGradient(0, 0, 0, GROUND_LEVEL);
    const hour = environment.timeOfDay;
    
    if (hour >= 6 && hour < 18) {
      // Daytime
      skyGradient.addColorStop(0, isDark ? '#4B5563' : '#87CEEB');
      skyGradient.addColorStop(0.5, isDark ? '#6B7280' : '#B0E2FF');
      skyGradient.addColorStop(1, isDark ? '#9CA3AF' : '#E0F7FF');
    } else if (hour >= 18 && hour < 20) {
      // Sunset
      skyGradient.addColorStop(0, '#FF7F50');
      skyGradient.addColorStop(0.3, '#FFA07A');
      skyGradient.addColorStop(0.7, isDark ? '#4B5563' : '#87CEEB');
      skyGradient.addColorStop(1, isDark ? '#6B7280' : '#B0E2FF');
    } else {
      // Night
      skyGradient.addColorStop(0, isDark ? '#1F2937' : '#191970');
      skyGradient.addColorStop(0.5, isDark ? '#374151' : '#000080');
      skyGradient.addColorStop(1, isDark ? '#4B5563' : '#0F172A');
    }
    
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, GROUND_LEVEL);
    
    // Draw sun/moon
    const sunMoonY = 60 + Math.sin(environment.timeOfDay * 0.26) * 80;
    const sunMoonX = canvas.width * 0.8;
    
    if (hour >= 6 && hour < 18) {
      // Sun
      ctx.beginPath();
      ctx.arc(sunMoonX, sunMoonY, 30, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#FBBF24' : '#FFD700';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sunMoonX, sunMoonY, 40, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.3)' : 'rgba(255, 215, 0, 0.3)';
      ctx.fill();
    } else {
      // Moon
      ctx.beginPath();
      ctx.arc(sunMoonX, sunMoonY, 25, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? '#E5E7EB' : '#F0F8FF';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(sunMoonX - 8, sunMoonY - 4, 6, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? 'rgba(31, 41, 55, 0.3)' : 'rgba(0, 0, 0, 0.1)';
      ctx.fill();
    }
    
    // Draw clouds
    clouds.forEach(cloud => {
      ctx.globalAlpha = cloud.opacity;
      ctx.fillStyle = isDark ? '#D1D5DB' : 'white';
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.4, cloud.y - cloud.size * 0.2, cloud.size * 0.5, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.size * 0.8, cloud.y, cloud.size * 0.6, 0, Math.PI * 2);
      ctx.arc(cloud.x - cloud.size * 0.2, cloud.y, cloud.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
    
    // Draw distant buildings
    const buildingCount = 12;
    for (let i = 0; i < buildingCount; i++) {
      const buildingX = (i * 180 - gameStats.distance * 0.08) % (canvas.width + 400) - 200;
      const buildingHeight = Math.sin(i * 0.5 + environment.buildingVariation) * 30 + 90;
      const buildingWidth = Math.cos(i * 0.3) * 25 + 60;
      
      ctx.fillStyle = hour >= 6 && hour < 18 ? 
        (isDark ? '#374151' : '#2D3748') : 
        (isDark ? '#1F2937' : '#1A202C');
      ctx.fillRect(buildingX, GROUND_LEVEL - buildingHeight, buildingWidth, buildingHeight);
      
      // Windows
      ctx.fillStyle = hour >= 6 && hour < 18 ? 
        (isDark ? '#F59E0B' : '#FBBF24') : 
        (isDark ? '#4FD1C7' : '#4FD1C7');
      for (let wy = 0; wy < 4; wy++) {
        for (let wx = 0; wx < 3; wx++) {
          if (Math.random() > 0.3) {
            ctx.fillRect(
              buildingX + wx * 12 + 8,
              GROUND_LEVEL - buildingHeight + wy * 16 + 10,
              6, 10
            );
          }
        }
      }
    }
    
    // Draw ground with perspective
    const groundGradient = ctx.createLinearGradient(0, GROUND_LEVEL, 0, canvas.height);
    groundGradient.addColorStop(0, isDark ? '#4B5563' : '#374151');
    groundGradient.addColorStop(0.3, isDark ? '#6B7280' : '#4B5563');
    groundGradient.addColorStop(1, isDark ? '#1F2937' : '#1F2937');
    ctx.fillStyle = groundGradient;
    ctx.fillRect(0, GROUND_LEVEL, canvas.width, canvas.height - GROUND_LEVEL);
    
    // Draw road lines
    ctx.strokeStyle = isDark ? '#F59E0B' : '#FBBF24';
    ctx.lineWidth = 2;
    ctx.setLineDash([15, 25]);
    for (let i = 0; i < 8; i++) {
      const lineX = (i * 80 - gameStats.distance) % (canvas.width + 100) - 50;
      ctx.beginPath();
      ctx.moveTo(lineX, GROUND_LEVEL + 20);
      ctx.lineTo(lineX + 15, GROUND_LEVEL + 20);
      ctx.stroke();
    }
    ctx.setLineDash([]);
    
    // Draw particles
    particles.forEach(particle => {
      ctx.globalAlpha = particle.life;
      if (particle.type === 'sparkle') {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 1.3, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + '40';
        ctx.fill();
      } else {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;

    // Draw obstacles with enhanced visuals
    obstacles.forEach(obstacle => {
      ctx.save();
      ctx.translate(obstacle.x + obstacle.width/2, obstacle.y + obstacle.height/2);
      ctx.rotate(obstacle.rotation);
      
      // Glow effect for powerups
      if (obstacle.type === 'powerup') {
        ctx.shadowColor = obstacle.color;
        ctx.shadowBlur = 15;
        ctx.globalAlpha = 0.8;
        
        // Pulsing effect
        const scale = obstacle.pulse;
        ctx.scale(scale, scale);
      }
      
      // Background shape
      if (obstacle.type === 'powerup') {
        // Star shape for powerups
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = obstacle.width/2;
        const innerRadius = outerRadius * 0.5;
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = obstacle.color;
        ctx.fill();
      } else {
        // Rounded rectangle for regular items
        const radius = 8;
        ctx.beginPath();
        ctx.roundRect(-obstacle.width/2, -obstacle.height/2, obstacle.width, obstacle.height, radius);
        ctx.fillStyle = obstacle.type === 'positive' ? 
          `${obstacle.color}DD` : `${obstacle.color}DD`;
        ctx.fill();
        
        // Border
        ctx.strokeStyle = obstacle.type === 'positive' ? '#FFFFFF' : '#000000';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // Emoji
      ctx.font = `bold ${obstacle.width/2}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = obstacle.type === 'negative' ? '#FFFFFF' : '#000000';
      ctx.globalAlpha = 1;
      ctx.fillText(obstacle.emoji, 0, 0);
      
      ctx.restore();
    });

    // Draw player with enhanced animation
    const playerHeight = playerState.isDucking ? 
      PLAYER_DUCK_HEIGHT + (PLAYER_HEIGHT - PLAYER_DUCK_HEIGHT) * (1 - playerState.duckProgress) : 
      PLAYER_HEIGHT;
    const playerBottom = GROUND_LEVEL - playerState.y;
    const playerTop = playerBottom - playerHeight;
    const runOffset = playerState.y === 0 ? Math.sin(playerState.runCycle) * 3 : 0;
    const bodyY = playerTop + runOffset;
    
    // Shadow with perspective
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    const shadowWidth = PLAYER_WIDTH * (1 - playerState.y/200 * 0.5);
    const shadowHeight = 8 * (1 - playerState.y/200 * 0.8);
    ctx.ellipse(
      PLAYER_X + PLAYER_WIDTH/2,
      GROUND_LEVEL + 6,
      shadowWidth/2,
      shadowHeight,
      0, 0, Math.PI * 2
    );
    ctx.fill();
    
    // Player body - Professional with animation
    const suitGradient = ctx.createLinearGradient(
      PLAYER_X, bodyY,
      PLAYER_X, playerBottom
    );
    
    if (isDark) {
      suitGradient.addColorStop(0, '#1E40AF');
      suitGradient.addColorStop(0.5, '#1D4ED8');
      suitGradient.addColorStop(1, '#1E3A8A');
    } else {
      suitGradient.addColorStop(0, '#3B82F6');
      suitGradient.addColorStop(0.5, '#2563EB');
      suitGradient.addColorStop(1, '#1D4ED8');
    }
    
    // Animated arms
    const armSwing = playerState.y === 0 ? Math.sin(playerState.runCycle * 2) * 15 : 0;
    
    // Body (suit jacket)
    ctx.fillStyle = suitGradient;
    ctx.beginPath();
    ctx.roundRect(PLAYER_X, bodyY, PLAYER_WIDTH, playerHeight - 20, 8);
    ctx.fill();
    
    // Collar and tie
    ctx.fillStyle = isDark ? '#E5E7EB' : '#FFFFFF';
    ctx.beginPath();
    ctx.moveTo(PLAYER_X + PLAYER_WIDTH/2 - 8, bodyY + 15);
    ctx.lineTo(PLAYER_X + PLAYER_WIDTH/2, bodyY + 5);
    ctx.lineTo(PLAYER_X + PLAYER_WIDTH/2 + 8, bodyY + 15);
    ctx.closePath();
    ctx.fill();
    
    const tieGradient = ctx.createLinearGradient(
      PLAYER_X + PLAYER_WIDTH/2, bodyY + 15,
      PLAYER_X + PLAYER_WIDTH/2, bodyY + 35
    );
    tieGradient.addColorStop(0, '#DC2626');
    tieGradient.addColorStop(0.7, '#B91C1C');
    tieGradient.addColorStop(1, '#991B1B');
    ctx.fillStyle = tieGradient;
    ctx.beginPath();
    ctx.moveTo(PLAYER_X + PLAYER_WIDTH/2 - 4, bodyY + 15);
    ctx.lineTo(PLAYER_X + PLAYER_WIDTH/2 + 4, bodyY + 15);
    ctx.lineTo(PLAYER_X + PLAYER_WIDTH/2, bodyY + 35);
    ctx.closePath();
    ctx.fill();
    
    // Pants
    ctx.fillStyle = isDark ? '#0F172A' : '#1E293B';
    ctx.fillRect(PLAYER_X, playerBottom - 20, PLAYER_WIDTH, 20);
    
    // Animated legs
    const legSwing = playerState.y === 0 ? Math.sin(playerState.runCycle * 2 + Math.PI) * 12 : 0;
    
    // Left leg
    ctx.strokeStyle = isDark ? '#0F172A' : '#1E293B';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(PLAYER_X + PLAYER_WIDTH/3, playerBottom - 20);
    ctx.lineTo(PLAYER_X + PLAYER_WIDTH/3 + legSwing, playerBottom + 4);
    ctx.stroke();
    
    // Right leg
    ctx.beginPath();
    ctx.moveTo(PLAYER_X + PLAYER_WIDTH * 2/3, playerBottom - 20);
    ctx.lineTo(PLAYER_X + PLAYER_WIDTH * 2/3 - legSwing, playerBottom + 4);
    ctx.stroke();
    
    // Shoes
    ctx.fillStyle = isDark ? '#000000' : '#111827';
    ctx.fillRect(PLAYER_X + PLAYER_WIDTH/3 - 6 + legSwing, playerBottom + 2, 12, 6);
    ctx.fillRect(PLAYER_X + PLAYER_WIDTH * 2/3 - 6 - legSwing, playerBottom + 2, 12, 6);
    
    // Head with expression
    const headRadius = 14;
    const headX = PLAYER_X + PLAYER_WIDTH/2;
    const headY = bodyY - headRadius + 3 + Math.sin(timestamp/300) * 1.5;
    
    // Head shape
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Hair
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.arc(headX, headY - 10, headRadius * 0.9, 0, Math.PI);
    ctx.fill();
    
    // Eyes with blink animation
    const blink = Math.sin(timestamp/1200) > 0.95 ? 0 : 3;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(headX - 5, headY - 2, blink, 0, Math.PI * 2);
    ctx.arc(headX + 5, headY - 2, blink, 0, Math.PI * 2);
    ctx.fill();
    
    // Glasses when productivity is low
    if (gameStats.productivity < 50) {
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(headX - 5, headY - 2, 8, 0, Math.PI * 2);
      ctx.arc(headX + 5, headY - 2, 8, 0, Math.PI * 2);
      ctx.moveTo(headX - 3, headY - 2);
      ctx.lineTo(headX + 3, headY - 2);
      ctx.stroke();
    }
    
    // Mouth based on energy and productivity
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    const mood = (gameStats.energy + gameStats.productivity) / 2;
    if (mood > 75) {
      // Happy
      ctx.arc(headX, headY + 6, 5, 0.2 * Math.PI, 0.8 * Math.PI);
    } else if (mood > 45) {
      // Neutral
      ctx.moveTo(headX - 4, headY + 6);
      ctx.lineTo(headX + 4, headY + 6);
    } else {
      // Stressed
      ctx.arc(headX, headY + 8, 4, 1.2 * Math.PI, 1.8 * Math.PI);
    }
    ctx.stroke();
    
    // Briefcase
    if (!playerState.isDucking) {
      ctx.fillStyle = '#92400E';
      ctx.fillRect(PLAYER_X + PLAYER_WIDTH - 12, bodyY + 30, 15, 10);
      ctx.fillStyle = '#B45309';
      ctx.fillRect(PLAYER_X + PLAYER_WIDTH - 11, bodyY + 31, 13, 8);
      
      // Handle
      ctx.fillStyle = '#D97706';
      ctx.fillRect(PLAYER_X + PLAYER_WIDTH - 6, bodyY + 28, 3, 6);
    }
    
    // Jump/double jump indicator
    if (playerState.canDoubleJump && !playerState.hasDoubleJumped && playerState.y > 40) {
      ctx.fillStyle = '#8B5CF6';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(PLAYER_X + PLAYER_WIDTH/2, bodyY - 10, 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Wings effect
      for (let i = 0; i < 3; i++) {
        const angle = timestamp/250 + i * Math.PI/1.5;
        const wingX = PLAYER_X + PLAYER_WIDTH/2 + Math.cos(angle) * 10;
        const wingY = bodyY - 10 + Math.sin(angle) * 10;
        ctx.beginPath();
        ctx.arc(wingX, wingY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    
    // Invulnerability shield effect
    if (playerState.invulnerable) {
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#06B6D4';
      ctx.shadowBlur = 20;
      ctx.globalAlpha = 0.6 + Math.sin(timestamp / 150) * 0.3;
      ctx.beginPath();
      ctx.arc(
        PLAYER_X + PLAYER_WIDTH/2,
        bodyY + playerHeight/2,
        PLAYER_WIDTH/1.2,
        0, Math.PI * 2
      );
      ctx.stroke();
      
      // Inner shield effect
      ctx.beginPath();
      const shieldRadius = PLAYER_WIDTH/1.4;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI/3) + timestamp/600;
        const x = PLAYER_X + PLAYER_WIDTH/2 + Math.cos(angle) * shieldRadius;
        const y = bodyY + playerHeight/2 + Math.sin(angle) * shieldRadius;
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    }
  }, [obstacles, particles, clouds, playerState, gameStats, isDark, environment]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!keysPressed.current.has('Space')) {
          keysPressed.current.add('Space');
          handleJump();
        }
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        if (!keysPressed.current.has('ArrowDown')) {
          keysPressed.current.add('ArrowDown');
          handleDuck(true);
        }
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        if (gameActive) setIsPaused(prev => !prev);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        initGame();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        setSoundOn(prev => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ' || e.code === 'ArrowUp') {
        keysPressed.current.delete('Space');
      } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keysPressed.current.delete('ArrowDown');
        handleDuck(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameActive, handleJump, handleDuck, initGame]);

  // Handle game loop
  useEffect(() => {
    if (gameActive && !isPaused) {
      animationRef.current = requestAnimationFrame(gameLoop);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameActive, isPaused, gameLoop]);

  // Handle canvas resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current && containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        
        // Calculate responsive dimensions
        let width, height;
        
        if (containerWidth < 640) { // Mobile
          width = containerWidth - 32; // 16px padding on each side
          height = width * 0.6; // 3:2 aspect ratio for mobile
        } else if (containerWidth < 1024) { // Tablet
          width = Math.min(600, containerWidth - 64);
          height = width * 0.5; // 2:1 aspect ratio
        } else { // Desktop
          width = Math.min(800, containerWidth - 96);
          height = width * 0.5; // 2:1 aspect ratio
        }
        
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        canvasWidth.current = width;
        canvasHeight.current = height;
        
        // Adjust constants for responsive canvas
        const scaleFactor = width / 800; // Original width was 800
        const PLAYER_X = 120 * scaleFactor;
        const GROUND_LEVEL = 320 * scaleFactor;
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Mobile touch handlers
  const handleTouchStart = useCallback((action: 'jump' | 'duck') => {
    if (action === 'jump') {
      handleJump();
    } else {
      handleDuck(true);
    }
  }, [handleJump, handleDuck]);

  const handleTouchEnd = useCallback(() => {
    handleDuck(false);
  }, [handleDuck]);

  return (
    <div 
      ref={containerRef}
      className={`${className} ${isDark ? 'dark' : ''} w-full min-h-screen flex flex-col`}
    >
      {/* Enhanced Header - Fixed height */}
      <div className={`relative p-3 sm:p-4 rounded-2xl backdrop-blur-lg shadow-lg border mb-2 sm:mb-4 ${
        isDark 
          ? 'bg-gradient-to-r from-gray-800/90 via-gray-900/90 to-gray-800/90 border-gray-700' 
          : 'bg-gradient-to-r from-blue-50/90 via-cyan-50/90 to-blue-50/90 border-blue-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className={`p-2 sm:p-3 rounded-xl shadow-lg flex-shrink-0 ${
              isDark 
                ? 'bg-gradient-to-br from-blue-600 to-cyan-600' 
                : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            }`}>
              <Briefcase className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className={`text-sm sm:text-xl md:text-2xl font-bold truncate ${
                isDark 
                  ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400' 
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600'
              }`}>
                Corporate Wellness Runner
              </h1>
              <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>
                Balance work and wellness in this endless runner!
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border flex-shrink-0 ${
              isDark 
                ? 'bg-gradient-to-r from-gray-800/80 to-gray-900/80 border-gray-700' 
                : 'bg-gradient-to-r from-blue-100/80 to-cyan-100/80 border-blue-300'
            }`}>
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <div className="min-w-0">
                <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>High Score</div>
                <div className={`font-bold text-sm sm:text-base truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>{gameStats.highScore}</div>
              </div>
            </div>
            
            <button
              onClick={() => setSoundOn(!soundOn)}
              className={`p-2 sm:p-3 rounded-xl shadow-lg border transition-all hover:scale-105 flex-shrink-0 ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border-gray-700' 
                  : 'bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 border-blue-300'
              }`}
              aria-label="Toggle sound"
            >
              {soundOn ? 
                <Volume2 className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} /> : 
                <VolumeX className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Main Game Area - Responsive grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 overflow-hidden">
        {/* Left Stats Panel - Responsive */}
        <div className="lg:col-span-1 h-full overflow-y-auto pr-1 sm:pr-2">
          <div className="space-y-3 sm:space-y-4 h-full pb-4">
            {/* Score Card - Fixed height */}
            <div className={`relative rounded-2xl p-4 sm:p-5 shadow-lg border overflow-hidden min-h-[140px] sm:min-h-[160px] ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700' 
                : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-blue-200'
            }`}>
              <div className="relative h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-2 rounded-lg ${
                      isDark 
                        ? 'bg-gradient-to-br from-blue-600/30 to-cyan-600/30' 
                        : 'bg-gradient-to-br from-blue-500/30 to-cyan-500/30'
                    }`}>
                      <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    </div>
                    <span className={`font-bold text-lg sm:text-xl ${isDark ? 'text-white' : 'text-gray-800'}`}>Score</span>
                  </div>
                  <span className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent`}>
                    {gameStats.score}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-auto">
                  <div className={`rounded-xl p-2 sm:p-3 ${
                    isDark 
                      ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' 
                      : 'bg-gradient-to-br from-blue-100/80 to-cyan-100/80'
                  }`}>
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                      <span className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Time</span>
                    </div>
                    <div className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>{formatTime(gameTime)}</div>
                  </div>
                  <div className={`rounded-xl p-2 sm:p-3 ${
                    isDark 
                      ? 'bg-gradient-to-br from-gray-900/80 to-gray-800/80' 
                      : 'bg-gradient-to-br from-blue-100/80 to-cyan-100/80'
                  }`}>
                    <div className="flex items-center gap-1 sm:gap-2 mb-1">
                      <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Multiplier</span>
                    </div>
                    <div className={`font-bold text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>x{gameStats.multiplier}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards - Fixed heights */}
            <div className="space-y-3">
              {/* Energy Card */}
              <div className={`relative rounded-2xl p-3 sm:p-4 shadow-lg border overflow-hidden min-h-[110px] sm:min-h-[120px] ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700' 
                  : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-blue-200'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10" />
                <div className="relative h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-1 sm:p-2 rounded-lg ${
                        gameStats.energy > 70 ? 'bg-green-600/30' : gameStats.energy > 30 ? 'bg-yellow-600/30' : 'bg-red-600/30'
                      }`}>
                        <Battery className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          gameStats.energy > 70 ? 'text-green-500' : gameStats.energy > 30 ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <span className={`font-medium text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Energy</span>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>{gameStats.jumpCount} jumps</div>
                      </div>
                    </div>
                    <span className={`text-xl sm:text-2xl font-bold ${
                      gameStats.energy > 70 ? 'text-green-500' : gameStats.energy > 30 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {Math.round(gameStats.energy)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className={`relative h-2 sm:h-3 ${isDark ? 'bg-gray-900' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div 
                        className="h-full transition-all duration-300 rounded-full"
                        style={{ 
                          width: `${gameStats.energy}%`,
                          background: gameStats.energy > 70 
                            ? 'linear-gradient(90deg, #10B981, #34D399)' 
                            : gameStats.energy > 30 
                            ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                            : 'linear-gradient(90deg, #EF4444, #F87171)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Productivity Card */}
              <div className={`relative rounded-2xl p-3 sm:p-4 shadow-lg border overflow-hidden min-h-[110px] sm:min-h-[120px] ${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700' 
                  : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-blue-200'
              }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10" />
                <div className="relative h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-1 sm:p-2 rounded-lg ${
                        gameStats.productivity > 70 ? 'bg-blue-600/30' : gameStats.productivity > 40 ? 'bg-yellow-600/30' : 'bg-red-600/30'
                      }`}>
                        <Target className={`w-4 h-4 sm:w-5 sm:h-5 ${
                          gameStats.productivity > 70 ? 'text-blue-500' : gameStats.productivity > 40 ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <span className={`font-medium text-sm sm:text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>Productivity</span>
                        <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} truncate`}>{gameStats.duckCount} ducks</div>
                      </div>
                    </div>
                    <span className={`text-xl sm:text-2xl font-bold ${
                      gameStats.productivity > 70 ? 'text-blue-500' : gameStats.productivity > 40 ? 'text-yellow-500' : 'text-red-500'
                    }`}>
                      {Math.round(gameStats.productivity)}%
                    </span>
                  </div>
                  <div className="mt-2">
                    <div className={`relative h-2 sm:h-3 ${isDark ? 'bg-gray-900' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                      <div 
                        className="h-full transition-all duration-300 rounded-full"
                        style={{ 
                          width: `${gameStats.productivity}%`,
                          background: gameStats.productivity > 70 
                            ? 'linear-gradient(90deg, #3B82F6, #60A5FA)' 
                            : gameStats.productivity > 40 
                            ? 'linear-gradient(90deg, #F59E0B, #FBBF24)'
                            : 'linear-gradient(90deg, #EF4444, #F87171)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Game Info Card - Fixed height */}
            <div className={`rounded-2xl p-3 sm:p-4 shadow-lg border min-h-[180px] sm:min-h-[200px] ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700' 
                : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-blue-200'
            }`}>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="text-center">
                  <div className={`text-xl sm:text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{gameStats.level}</div>
                  <div className={`text-xs flex flex-col items-center justify-center gap-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                    Level
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl sm:text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{gameStats.speed.toFixed(1)}</div>
                  <div className={`text-xs flex flex-col items-center justify-center gap-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                    Speed
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-xl sm:text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{gameStats.combo}</div>
                  <div className={`text-xs flex flex-col items-center justify-center gap-1 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />
                    Combo
                  </div>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4">
                <button
                  onClick={initGame}
                  className="w-full relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-700 text-white font-bold py-3 px-4 text-sm sm:text-base rounded-xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <span className="relative flex items-center justify-center gap-2">
                    <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
                    {gameActive ? 'Restart Game' : 'Start Game'}
                  </span>
                </button>
              </div>
            </div>

            {/* Active Buffs - Scrollable if needed */}
            {activePowerUps.length > 0 && (
              <div className={`rounded-2xl p-3 sm:p-4 shadow-lg border backdrop-blur-lg max-h-[200px] overflow-y-auto ${
                isDark 
                  ? 'bg-gradient-to-br from-purple-900/40 via-purple-800/40 to-violet-900/40 border-purple-700/50' 
                  : 'bg-gradient-to-br from-purple-100/80 via-violet-100/80 to-purple-100/80 border-purple-300/50'
              }`}>
                <h3 className={`font-bold mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2 ${
                  isDark ? 'text-white' : 'text-gray-800'
                }`}>
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 animate-pulse" />
                  <span className="text-sm sm:text-base">Active Buffs</span>
                </h3>
                <div className="space-y-1 sm:space-y-2">
                  {activePowerUps.map((powerup, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center justify-between p-2 sm:p-3 rounded-lg border backdrop-blur-sm ${
                        isDark 
                          ? 'bg-gradient-to-r from-purple-900/30 to-violet-900/30 border-purple-700/30' 
                          : 'bg-gradient-to-r from-purple-100/50 to-violet-100/50 border-purple-300/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse ${
                          powerup.type === 'speed' ? 'bg-yellow-500' :
                          powerup.type === 'shield' ? 'bg-cyan-500' :
                          'bg-purple-500'
                        }`} />
                        <span className={`text-xs sm:text-sm font-medium capitalize ${
                          isDark ? 'text-white' : 'text-gray-800'
                        }`}>{powerup.type}</span>
                      </div>
                      <div className={`text-xs font-mono px-2 py-1 rounded ${
                        isDark ? 'text-gray-300 bg-gray-900/50' : 'text-gray-700 bg-gray-200/50'
                      }`}>
                        {(powerup.timeLeft / 1000).toFixed(1)}s
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Game Canvas Area - Takes remaining space */}
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col min-h-[400px] sm:min-h-[500px]">
          <div className={`relative flex-1 min-h-0 rounded-2xl overflow-hidden shadow-lg border p-2 sm:p-3 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-gray-800/50 border-gray-700' 
              : 'bg-gradient-to-br from-blue-50/50 via-cyan-50/50 to-blue-50/50 border-blue-200'
          }`}>
            <canvas
              ref={canvasRef}
              className="w-full h-full rounded-xl"
            />
            
            {/* Game Controls Overlay */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 flex gap-1 sm:gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`p-2 sm:p-3 rounded-xl backdrop-blur-lg shadow-lg hover:scale-105 transition-transform border ${
                  isDark 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border-gray-700' 
                    : 'bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 border-blue-300'
                }`}
                disabled={!gameActive}
              >
                {isPaused ? (
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                ) : (
                  <Pause className={`w-4 h-4 sm:w-5 sm:h-5 ${isDark ? 'text-white' : 'text-gray-800'}`} />
                )}
              </button>
            </div>
            
            {/* Game Message with animation */}
            {gameMessage && (
              <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-3 py-2 sm:px-6 sm:py-4 rounded-xl font-bold shadow-2xl transition-all duration-500 backdrop-blur-lg border animate-bounceIn max-w-[90%] sm:max-w-auto ${
                gameMessage.type === 'positive' 
                  ? 'bg-gradient-to-r from-green-600/90 via-emerald-600/90 to-green-600/90 border-green-500 text-white' 
                  : gameMessage.type === 'negative'
                  ? 'bg-gradient-to-r from-red-600/90 via-rose-600/90 to-red-600/90 border-red-500 text-white'
                  : 'bg-gradient-to-r from-blue-600/90 via-cyan-600/90 to-blue-600/90 border-blue-500 text-white'
              }`}>
                <div className="flex items-center gap-1 sm:gap-3">
                  <span className="text-lg sm:text-2xl">{gameMessage.type === 'positive' ? '✨' : gameMessage.type === 'negative' ? '⚠️' : '💡'}</span>
                  <span className="text-xs sm:text-base text-center">{gameMessage.text}</span>
                </div>
              </div>
            )}
            
            {/* Game Over / Start Overlay */}
            {!gameActive && (
              <div className={`absolute inset-0 flex items-center justify-center rounded-xl ${
                isDark ? 'bg-gradient-to-br from-black/70 via-gray-900/80 to-black/70' : 'bg-gradient-to-br from-black/40 via-gray-900/60 to-black/40'
              }`}>
                <div className={`relative backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl max-w-[90%] sm:max-w-md text-center border overflow-hidden ${
                  isDark 
                    ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 border-gray-700' 
                    : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-blue-300'
                }`}>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600" />
                  
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="relative">
                      <Building className="w-10 h-10 sm:w-16 sm:h-16 text-blue-500" />
                      <div className="absolute inset-0 animate-ping bg-blue-400/20 rounded-full" />
                    </div>
                  </div>
                  
                  <h2 className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 ${
                    isDark 
                      ? 'bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent' 
                      : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
                  }`}>
                    Corporate Wellness Runner
                  </h2>
                  
                  <p className={`mb-4 sm:mb-6 text-xs sm:text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Navigate workplace challenges with style! Collect wellness items, 
                    avoid burnout, and climb the corporate ladder.
                  </p>
                  
                  <button
                    onClick={initGame}
                    className="w-full relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-700 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg overflow-hidden group text-sm sm:text-base"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      Start Workday
                    </span>
                  </button>
                  
                  <div className={`mt-3 sm:mt-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                      <span className="flex items-center gap-1">
                        <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                        Space/Up to Jump
                      </span>
                      <span className="flex items-center gap-1">
                        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                        Down/S to Duck
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {isPaused && (
              <div className={`absolute inset-0 flex items-center justify-center rounded-xl ${
                isDark ? 'bg-gradient-to-br from-black/70 via-amber-900/50 to-black/70' : 'bg-gradient-to-br from-black/40 via-amber-900/40 to-black/40'
              }`}>
                <div className={`relative backdrop-blur-lg p-4 sm:p-6 md:p-8 rounded-2xl shadow-2xl text-center border overflow-hidden max-w-[90%] sm:max-w-md ${
                  isDark 
                    ? 'bg-gradient-to-br from-amber-900/80 via-yellow-900/80 to-amber-900/80 border-amber-700/50' 
                    : 'bg-gradient-to-br from-amber-100/90 via-yellow-100/90 to-amber-100/90 border-amber-300'
                }`}>
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600" />
                  
                  <div className="flex justify-center mb-4 sm:mb-6">
                    <div className="relative">
                      <Coffee className="w-10 h-10 sm:w-16 sm:h-16 text-amber-500" />
                      <div className="absolute inset-0 animate-pulse bg-amber-400/20 rounded-full" />
                    </div>
                  </div>
                  
                  <h3 className={`text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 ${
                    isDark 
                      ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-yellow-600'
                  }`}>
                    Coffee Break ☕
                  </h3>
                  
                  <p className={`mb-4 sm:mb-6 text-xs sm:text-sm ${isDark ? 'text-amber-100' : 'text-amber-800'}`}>
                    Take a mindful moment to recharge...
                  </p>
                  
                  <button
                    onClick={() => setIsPaused(false)}
                    className="w-full relative bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-600 hover:from-amber-700 hover:via-yellow-700 hover:to-amber-700 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg overflow-hidden group text-sm sm:text-base"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-2 sm:gap-3">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                      Back to Work
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Enhanced Game Controls - Responsive */}
          <div className="mt-2 sm:mt-4">
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-2 sm:mb-4">
              <button
                onMouseDown={() => handleDuck(true)}
                onMouseUp={() => handleDuck(false)}
                onTouchStart={() => handleTouchStart('duck')}
                onTouchEnd={() => handleTouchEnd()}
                className={`relative py-3 sm:py-4 rounded-xl font-bold active:scale-95 transition-all shadow-lg border overflow-hidden group ${
                  isDark 
                    ? 'bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 hover:from-gray-700 hover:via-gray-800 hover:to-gray-700 text-white border-gray-700' 
                    : 'bg-gradient-to-r from-blue-100 via-cyan-100 to-blue-100 hover:from-blue-200 hover:via-cyan-200 hover:to-blue-200 text-gray-800 border-blue-300'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700/20 to-gray-800/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">Duck (Down/S)</span>
                </span>
              </button>
              
              <button
                onMouseDown={handleJump}
                onTouchStart={() => handleTouchStart('jump')}
                className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 hover:from-blue-700 hover:via-blue-600 hover:to-cyan-700 text-white py-3 sm:py-4 rounded-xl font-bold active:scale-95 transition-all shadow-lg overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
                <span className="relative flex items-center justify-center gap-2">
                  <ChevronUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-sm sm:text-base">Jump (Space/Up)</span>
                </span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  isDark 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                }`}
              >
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  {isPaused ? <Play className="w-3 h-3 sm:w-4 sm:h-4" /> : <Pause className="w-3 h-3 sm:w-4 sm:h-4" />}
                  {isPaused ? 'Resume' : 'Pause'}
                </span>
              </button>
              
              <button
                onClick={initGame}
                className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                }`}
              >
                <span className="flex items-center justify-center gap-1 sm:gap-2">
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  Restart
                </span>
              </button>
            </div>
            
            {/* Mobile Instructions */}
            <div className="mt-2 text-center">
              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                <span className="sm:hidden">Tap buttons or use Space/Arrow keys</span>
                <span className="hidden sm:inline">Use Space/Arrow keys or tap buttons</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes bounceIn {
          0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.05); }
          70% { transform: translate(-50%, -50%) scale(0.9); }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        
        /* Custom scrollbar for left panel */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar {
          width: 4px;
        }
        
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default MentalHealthGame;