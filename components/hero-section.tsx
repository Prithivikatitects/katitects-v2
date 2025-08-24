"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import HeroImg from "@/public/images/hero.jpg";
import HeroImg2 from "@/public/images/hero-2.jpg";

// Variants for staggered text reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: "100%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function HeroSection() {
  return (
    <section className="container px-4 py-24 md:py-32 overflow-hidden mx-auto">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="flex items-center gap-2"
              >
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 hover:from-emerald-600 hover:to-teal-600 transition-all duration-300">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered Solutions
                </Badge>
              </motion.div>

              {/* Headline with word reveal */}
              <motion.h1
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl overflow-hidden"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[
                  <span
                    key="rev"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"
                  >
                    Revolutionize
                  </span>,
                  "Your",
                  "Building",
                  "Designs",
                  "with",
                  <span
                    key="ai"
                    className="bg-gradient-to-r from-orange-500 to-red-500 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent"
                  >
                    AI-Powered
                  </span>,
                  "Solutions",
                ].map((word, i) => (
                  <motion.span
                    key={i}
                    variants={wordVariants as any}
                    className="inline-block mr-2"
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <p className="text-xl text-muted-foreground max-w-[600px]">
                  Transform architecture and{" "}
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    interior design
                  </span>{" "}
                  with cutting-edge AI technology for rendering, visualization,
                  and creative workflows.
                </p>
                <p className="text-lg text-muted-foreground">
                  Unlock efficiency, creativity, and accuracy with our SaaS
                  solutions for architects, designers, and builders.
                </p>
              </motion.div>
            </div>

            {/* Buttons */}
            <motion.div
              className="flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-blue-500/25 transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="group border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/10 bg-transparent"
              >
                <Zap className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400 group-hover:animate-pulse" />
                Explore Tool
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="flex items-center gap-8 text-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  <Users className="w-4 h-4 inline mr-1" />
                  10,000+ Active Users
                </span>
              </div>
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  99.9% Uptime
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column (Image) */}
          <motion.div
            className="relative lg:col-span-1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
          >
            <div className="relative h-[500px] lg:h-[600px] overflow-hidden">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative h-full flex flex-col gap-4 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 p-3 backdrop-blur-sm transition-all duration-300 border border-purple-500">
                {/* Image 1 */}
                <div className="relative h-full w-[140%] -mr-[40%] group">
                  <Image
                    src={HeroImg}
                    alt="Modern interior design rendering showcasing AI-powered architecture"
                    fill
                    className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>

                {/* Image 2 */}
                <div className="relative h-full w-[140%] -mr-[40%] group">
                  <Image
                    src={HeroImg2}
                    alt="Modern interior design rendering showcasing AI-powered architecture"
                    fill
                    className="rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
