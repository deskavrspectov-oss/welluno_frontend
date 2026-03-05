import React from 'react';
import { Link } from 'react-router-dom';
import { motion, Variants } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { blogs } from './blogData';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

export default function BlogList() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with gradient */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold font-display bg-gradient-to-r from-primary via-coral to-gold bg-clip-text text-transparent">
            Welluno Blog
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, stories, and resources to help you own your story and thrive.
          </p>
        </motion.div>

        {/* Blog list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {blogs.map((blog) => (
            <motion.article
              key={blog.slug}
              variants={itemVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-coral/5 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative p-6 md:p-8">
                <Link to={`/blog/${blog.slug}`} className="block">
                  <h2 className="text-2xl md:text-3xl font-bold font-display text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary transition-colors">
                    {blog.title}
                  </h2>
                </Link>

                <p className="mt-3 text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
                  {blog.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <time
                    dateTime={blog.date}
                    className="text-sm text-gray-500 dark:text-gray-500"
                  >
                    {new Date(blog.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>

                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
                  >
                    Read article
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Decorative corner gradient */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </motion.article>
          ))}
        </motion.div>
      </div>
    </main>
  );
}