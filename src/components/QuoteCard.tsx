import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface QuoteCardProps {
  quote: string;
  author: string;
  role?: string;
  className?: string;
  variant?: "default" | "large" | "minimal";
}

const QuoteCard = ({ 
  quote, 
  author, 
  role,
  className = "",
  variant = "default" 
}: QuoteCardProps) => {
  if (variant === "minimal") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className={`text-center ${className}`}
      >
        <p className="text-xl md:text-2xl font-display italic text-foreground mb-4">
          "{quote}"
        </p>
        <p className="text-muted-foreground font-medium">
          — {author}{role && <span className="text-primary">, {role}</span>}
        </p>
      </motion.div>
    );
  }

  if (variant === "large") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className={`relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-3xl p-8 lg:p-12 shadow-soft ${className}`}
      >
        <div className="absolute -top-6 left-8">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-glow-teal">
            <Quote className="w-6 h-6 text-primary-foreground" />
          </div>
        </div>
        
        <blockquote className="text-2xl lg:text-3xl font-display italic text-navy leading-relaxed mb-6 mt-4">
          "{quote}"
        </blockquote>
        
        <footer className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-teal-dark flex items-center justify-center text-primary-foreground font-bold text-lg">
            {author.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-navy">{author}</p>
            {role && <p className="text-sm text-muted-foreground">{role}</p>}
          </div>
        </footer>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative bg-card border border-border/50 rounded-2xl p-6 shadow-soft group hover:shadow-elevated transition-all duration-300 ${className}`}
    >
      <Quote className="w-8 h-8 text-primary/20 mb-4 group-hover:text-primary/40 transition-colors" />
      
      <blockquote className="text-lg font-display italic text-foreground leading-relaxed mb-4">
        "{quote}"
      </blockquote>
      
      <footer>
        <p className="font-semibold text-navy">{author}</p>
        {role && <p className="text-sm text-muted-foreground">{role}</p>}
      </footer>
      
      {/* Hover accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-gold to-coral rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
};

export default QuoteCard;