import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Link2,
  BookOpen,
  ChevronUp
} from 'lucide-react';
import { getBlogBySlug, blogs } from './blogData';

// Calculate reading time
const getReadingTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
};

// Format date nicely
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Share URL helpers
const shareUrl = (slug: string) => `https://welluno.in/blog/${slug}`;

// Simple toast component
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg flex items-center gap-2"
    >
      <Link2 className="w-4 h-4" />
      {message}
    </motion.div>
  );
};

export default function BlogPost() {
  const { slug } = useParams();
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!slug) return <Navigate to="/blog" />;

  const blog = getBlogBySlug(slug);
  if (!blog) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 pt-28 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Blog not found</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            The article you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 text-primary hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to blog
          </Link>
        </div>
      </main>
    );
  }

  const readingTime = getReadingTime(blog.content);
  const publishedDate = formatDate(blog.date);

  // Get related posts (latest 2 excluding current)
  const relatedPosts = blogs.filter(b => b.slug !== slug).slice(0, 2);

  // Handle scroll for progress bar and back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const element = contentRef.current;
      const totalHeight = element.clientHeight - window.innerHeight;
      const windowScrollTop = window.scrollY - element.offsetTop;
      if (windowScrollTop > 0) {
        const progress = (windowScrollTop / totalHeight) * 100;
        setReadingProgress(Math.min(100, Math.max(0, progress)));
      } else {
        setReadingProgress(0);
      }
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl(blog.slug));
    setShowCopyToast(true);
  };

  return (
    <>
      <Helmet>
        <title>{blog.title} | Welluno</title>
        <meta name="description" content={blog.description} />
        <link rel="canonical" href={`https://welluno.in/blog/${blog.slug}`} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.description} />
        <meta property="og:url" content={`https://welluno.in/blog/${blog.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.date} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: blog.title,
            description: blog.description,
            datePublished: blog.date,
            author: { '@type': 'Person', name: 'Welluno Team' },
          })}
        </script>
      </Helmet>

      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-coral to-gold z-50 origin-left"
        style={{ scaleX: readingProgress / 100 }}
        initial={{ scaleX: 0 }}
      />

      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        {/* Hero section */}
        <div className="relative pt-28 pb-12 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-coral/5 dark:from-primary/10 dark:to-coral/10" />
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-coral/5 rounded-full blur-3xl" />
          
          <div className="relative max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Back button */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-8 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to all articles
              </Link>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6">
                <span className="bg-gradient-to-r from-primary via-coral to-gold bg-clip-text text-transparent">
                  {blog.title}
                </span>
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={blog.date}>{publishedDate}</time>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{readingTime} min read</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Welluno Insights</span>
                </div>
              </div>

              {/* Lead paragraph */}
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed border-l-4 border-primary pl-6 italic">
                {blog.description}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main content area */}
        <div className="relative max-w-3xl mx-auto px-4 pb-20" ref={contentRef}>
          {/* Copy link button (inline, top right) */}
          <div className="flex justify-end mb-6">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200 dark:border-gray-700 hover:text-primary hover:border-primary transition-colors"
              aria-label="Copy link"
            >
              <Link2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Article content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="prose prose-lg max-w-none dark:prose-invert
              prose-headings:font-display prose-headings:text-gray-900 dark:prose-headings:text-white
              prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
              prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
              prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-primary
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic
              prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-900/50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
              prose-code:text-primary dark:prose-code:text-primary prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
              prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-700 prose-pre:rounded-xl prose-pre:p-4
              prose-img:rounded-2xl prose-img:shadow-xl prose-img:mx-auto
              prose-hr:border-gray-200 dark:prose-hr:border-gray-800
            ">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
          </motion.article>

          {/* Author bio / CTA */}
          <div className="mt-16 p-8 bg-gradient-to-br from-primary/5 via-transparent to-coral/5 dark:from-primary/10 dark:to-coral/10 rounded-3xl border border-gray-200 dark:border-gray-800">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-coral flex items-center justify-center text-white text-2xl font-bold">
                  W
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-2">
                  Welluno Team
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We write about mental health, workplace wellness, and strategies to thrive in corporate environments. 
                  Our mission is to help professionals own their story and build sustainable success.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/blog"
                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                  >
                    Read more articles
                  </Link>
                  <a
                    href="https://welluno.in"
                    className="px-6 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium border border-gray-200 dark:border-gray-700 hover:border-primary transition-colors"
                  >
                    Visit Welluno
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-6">
                You might also like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {relatedPosts.map(post => (
                  <Link
                    key={post.slug}
                    to={`/blog/${post.slug}`}
                    className="group p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h4>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {post.description}
                    </p>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                      {formatDate(post.date)} · {getReadingTime(post.content)} min read
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bottom back link */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to all articles
            </Link>
          </div>
        </div>

        {/* Back to top button */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-4 right-4 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors z-40"
              aria-label="Back to top"
            >
              <ChevronUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Copy link toast */}
        <AnimatePresence>
          {showCopyToast && (
            <Toast message="Link copied to clipboard!" onClose={() => setShowCopyToast(false)} />
          )}
        </AnimatePresence>
      </main>
    </>
  );
}