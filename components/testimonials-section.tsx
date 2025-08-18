"use client";

import type React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { Reveal } from "./animations/reveal";

type Testimonial = {
  name: string;
  role?: string;
  quote: string;
  avatarAlt: string;
  avatarUrl: string;
};

const items: Testimonial[] = [
  {
    name: "John D.",
    role: "Architect",
    quote:
      "Katitects.build has revolutionized our design process, saving us time and resources without compromising quality.",
    avatarAlt: "Portrait of John",
    avatarUrl: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Michael S.",
    role: "Designer",
    quote:
      "The AI-generated design suggestions have been incredibly valuable in sparking new ideas for client presentations.",
    avatarAlt: "Portrait of Michael",
    avatarUrl: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "David L.",
    role: "Studio Lead",
    quote:
      "This tool is a game-changer! Incredibly intuitive with consistently impressive results. I can’t imagine working without it.",
    avatarAlt: "Portrait of David",
    avatarUrl: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Sarah K.",
    role: "Interior Designer",
    quote:
      "From sketch to polished render in minutes. Our team iterates faster and delivers with more confidence than ever.",
    avatarAlt: "Portrait of Sarah",
    avatarUrl: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Priya N.",
    role: "Visualization Artist",
    quote:
      "Lighting presets and style variations helped us nail the brief on the first pass—clients love the options!",
    avatarAlt: "Portrait of Priya",
    avatarUrl: "/placeholder.svg?height=80&width=80",
  },
  {
    name: "Leo M.",
    role: "Project Manager",
    quote:
      "Turnaround times dropped dramatically and our reviews are smoother. The collaboration features are excellent.",
    avatarAlt: "Portrait of Leo",
    avatarUrl: "/placeholder.svg?height=80&width=80",
  },
];

export function TestimonialsSection() {
  return (
    <section className="px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-5xl">
        {/* Heading */}
        <Reveal>
          <div className="mb-8 md:mb-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Customer{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Success
              </span>{" "}
              Stories
            </h2>
            <p className="mt-4 max-w-3xl text-sm md:text-base text-muted-foreground">
              Discover how our platform helps teams create outstanding content
              effortlessly.
            </p>
          </div>
        </Reveal>

        {/* Controls (optional, manual scroll) */}
        <Reveal delay={0.1}>
          <div className="mb-4 flex justify-end gap-2">
            <button
              type="button"
              aria-label="Previous testimonials"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm hover:opacity-90 transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm hover:opacity-90 transition"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        {/* Infinite scrolling testimonials */}
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-4 shadow-sm">
          <motion.div
            className="flex gap-4"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              ease: "linear",
              duration: 40, // speed control
              repeat: Infinity,
            }}
          >
            {[...items, ...items].map((t, i) => (
              <Reveal key={i} delay={0.1 * (i % items.length)}>
                <article
                  data-card
                  className="group glass-hover relative flex min-w-[280px] max-w-[340px] snap-start flex-col gap-3 rounded-xl border border-border/60 bg-card/80 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  role="listitem"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full border border-border/60">
                      <Image
                        src={t.avatarUrl || "/placeholder.svg"}
                        alt={t.avatarAlt}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t.name}</div>
                      {t.role && (
                        <div className="text-xs text-muted-foreground">
                          {t.role}
                        </div>
                      )}
                    </div>
                    <Quote
                      className="ml-auto h-4 w-4 text-muted-foreground/70"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{t.quote}</p>
                </article>
              </Reveal>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
