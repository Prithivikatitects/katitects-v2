"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "./animations/reveal";

export function CTASection() {
  return (
    <section className="px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <article className="glass-hover relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:p-8">
          <div className="grid items-center gap-6 md:grid-cols-2 md:gap-10">
            {/* Text */}
            <Reveal className="space-y-4 md:space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Start Your Design{" "}
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Journey
                </span>{" "}
                Today
              </h2>
              <p className="max-w-md text-sm md:text-base text-muted-foreground">
                Sign up now and experience the power of AI-driven design without
                any commitment.
              </p>
              <Button
                size="lg"
                className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:shadow-purple-500/20 border-0"
              >
                <span className="relative z-10">Get Started</span>
                <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 group-hover:translate-x-[120%]" />
              </Button>
            </Reveal>

            {/* Image */}
            <Reveal delay={0.1}>
              <div className="relative h-52 w-full overflow-hidden rounded-2xl md:h-60 lg:h-64">
                <Image
                  src="/images/cta-livingroom.png"
                  alt="Warm living room showcasing finished interior design"
                  fill
                  sizes="(min-width: 1024px) 520px, (min-width: 640px) 80vw, 100vw"
                  className="object-cover"
                  priority={false}
                />
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-transparent dark:from-white/5" />
              </div>
            </Reveal>
          </div>
        </article>
      </div>
    </section>
  );
}
