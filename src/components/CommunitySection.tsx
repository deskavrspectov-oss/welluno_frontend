import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
// Removed all icon imports

const CommunitySection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isHoveringCTA, setIsHoveringCTA] = useState(false);
  const [activeFeature, setActiveFeature] = useState<number | null>(null);
  
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const communityFeatures = [
    {
      title: "Global Network",
      description: "Connect with professionals across the globe. Share, learn, and grow together in a supportive environment.",
      color: "primary",
    },
    {
      title: "Verified Community",
      description: "Every member is verified to ensure safe, authentic conversations and meaningful connections.",
      color: "coral",
    },
    {
      title: "Goal-Oriented",
      description: "Weekly challenges and progress tracking to help you achieve your personal and professional goals.",
      color: "gold",
    },
  ];

  const quotes = [
    {
      quote: "This community helped me find balance in the chaos of startup life. The support system is genuinely caring.",
      author: "Alex Chen",
      role: "Product Manager",
      stars: 5,
    },
    {
      quote: "Finally a platform that understands modern work pressures. It's been transformative for my daily routine.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      stars: 5,
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const digits = formData.phone.replace(/\D/g, '');
      if (digits.length < 10) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    } else if (formData.location.trim().length < 2) {
      newErrors.location = "Please enter a valid location";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      const response = await fetch('https://welluno-backend.onrender.com/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: "", email: "", phone: "", location: "" });
        
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to submit. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Connection error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, phone: value }));
    
    if (errors.phone) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  return (
    <section id="community" className="py-16 lg:py-20 relative overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Animated Background */}
      <motion.div 
        style={{ y: backgroundY }} 
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-background to-amber-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 -left-32 w-80 h-80 rounded-full blur-3xl bg-blue-200/30 dark:bg-blue-900/20"
        />
        
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full blur-3xl bg-amber-200/30 dark:bg-amber-900/20"
        />
      </motion.div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ type: "spring", delay: 0.1 }}
            className="inline-flex items-center gap-3 mb-6"
          >
            {/* Removed heart icons */}
            <span className="font-display text-pink-500 dark:text-pink-400 font-bold text-sm uppercase tracking-wider">
              Join Our Community
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 font-display tracking-tight text-gray-900 dark:text-white"
          >
            Be Part of Something{" "}
            <span className="relative inline-block">
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500"
                animate={isInView ? { 
                  scale: [1, 1.05, 1],
                } : {}}
                transition={{ duration: 3, delay: 0.5 }}
              >
                Extraordinary
              </motion.span>
              <motion.div
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ duration: 1, delay: 0.8 }}
              />
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg leading-relaxed max-w-2xl mx-auto font-medium text-gray-600 dark:text-gray-300"
          >
            Join a community of like-minded individuals focused on growth, wellness, and meaningful connections.
          </motion.p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Column - Community Features & Testimonials */}
          <div className="space-y-8">
            {/* Features */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="space-y-4"
            >
              {communityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
                  whileHover={{ 
                    x: 5,
                    transition: { type: "spring", stiffness: 400 }
                  }}
                  onMouseEnter={() => setActiveFeature(index)}
                  onMouseLeave={() => setActiveFeature(null)}
                  className="relative p-5 rounded-xl border overflow-hidden cursor-pointer group bg-white/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700 hover:border-blue-500/50 transition-all duration-300"
                >
                  {activeFeature === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`absolute inset-0 rounded-xl ${
                        feature.color === 'primary' ? 'bg-blue-500/5' :
                        feature.color === 'coral' ? 'bg-pink-500/5' :
                        'bg-amber-500/5'
                      }`}
                    />
                  )}

                  <div className="relative z-10">
                    {/* Removed icon container */}
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg font-display text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>

                      <motion.div
                        className={`absolute bottom-0 left-0 h-0.5 ${
                          feature.color === 'primary' ? 'bg-blue-500' :
                          feature.color === 'coral' ? 'bg-pink-500' :
                          'bg-amber-500'
                        }`}
                        initial={{ width: 0 }}
                        whileHover={{ width: "100%" }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Testimonials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="rounded-xl border p-5 bg-white/60 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-2 mb-4">
                {/* Removed Quote icon */}
                <h4 className="font-bold font-display text-gray-900 dark:text-white">
                  What Members Say
                </h4>
              </div>
              
              <div className="space-y-5">
                {quotes.map((quote, index) => (
                  <motion.div
                    key={quote.author}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    className="group"
                  >
                    <div className="flex gap-1 mb-2">
                      {/* Removed star icons - could keep if you want, but user asked to remove all icons; we'll remove stars as well. */}
                      {[...Array(quote.stars)].map((_, i) => (
                        <span key={i} className="w-3 h-3 bg-amber-500 rounded-full" /> // optional: use small dots instead of stars
                      ))}
                    </div>
                    
                    <blockquote className="text-sm italic mb-3 leading-relaxed text-gray-700 dark:text-gray-300">
                      "{quote.quote}"
                    </blockquote>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-gray-900 dark:text-white">
                          {quote.author}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {quote.role}
                        </div>
                      </div>
                      {/* Removed Sparkles icon */}
                    </div>
                    
                    {index < quotes.length - 1 && (
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-300/20 to-transparent my-4" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Join Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="relative"
          >
            {/* Form Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700/50">
              {/* Form Header */}
              <div className="flex items-center gap-3 mb-6">
                {/* Removed Rocket icon and its animation container */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Join the Waitlist
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Be among the first to join our community and get early access to all features.
              </p>

              {/* Benefits */}
              <div className="space-y-2 mb-8">
                {[
                  "Early access to community features",
                  "Priority support and guidance",
                  "Exclusive workshops and events",
                  "Personalized growth plan"
                ].map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    {/* Removed CheckCircle icon */}
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {benefit}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Form */}
              {showSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    {/* Removed SVG checkmark; could replace with simple text or keep as is? User said remove icons, so we'll remove. */}
                    <span className="text-green-600 text-2xl">✓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    You're on the list!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We'll notify you when we launch.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.name 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                        autoComplete="name"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                        autoComplete="email"
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="+91 99999 99999"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.phone 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                        autoComplete="tel"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.phone}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Enter with country code
                      </p>
                    </div>

                    {/* Location Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Your city or region"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                          errors.location 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        required
                        autoComplete="address-level2"
                      />
                      {errors.location && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                          {errors.location}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onMouseEnter={() => setIsHoveringCTA(true)}
                      onMouseLeave={() => setIsHoveringCTA(false)}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          {/* Removed Send and ArrowRight icons */}
                          Join Community Waitlist
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              )}

            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;