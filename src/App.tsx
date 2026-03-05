import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider, Helmet } from "react-helmet-async";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BlogList from "./blog/BlogList";
import BlogPost from "./blog/BlogPost";

const queryClient = new QueryClient();

const App = () => {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            {/* GLOBAL SEO (Homepage Only Should Ideally Handle This) */}
            <Helmet>
              <title>
                Corporate Mental Wellness Platform | AI Workplace Wellness | Welluno India
              </title>

              <meta
                name="description"
                content="Welluno is a corporate mental wellness platform in India providing AI-powered emotional insights and live workplace wellness experiences to reduce burnout and improve employee wellbeing."
              />

              <link rel="canonical" href="https://welluno.in/" />

              {/* Organization + Service Schema */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Organization",
                  name: "Welluno",
                  url: "https://welluno.in",
                  description:
                    "Corporate mental wellness platform in India providing AI-powered emotional insights and live workplace wellness experiences.",
                  areaServed: {
                    "@type": "Country",
                    name: "India",
                  },
                  hasOfferCatalog: {
                    "@type": "OfferCatalog",
                    name: "Corporate Mental Wellness Services",
                    itemListElement: [
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Workplace Burnout Prevention",
                        },
                      },
                      {
                        "@type": "Offer",
                        itemOffered: {
                          "@type": "Service",
                          name: "Corporate Wellness Workshops",
                        },
                      },
                    ],
                  },
                })}
              </script>
            </Helmet>

            <Routes>
              <Route path="/" element={<Index />} />

              {/* BLOG ROUTES */}
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />

              {/* ALWAYS KEEP CATCH-ALL LAST */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;