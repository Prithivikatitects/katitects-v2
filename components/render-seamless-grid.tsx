"use client";

import { ArrowUpRight } from "lucide-react";
import { Reveal } from "./animations/reveal";

type Tile = {
  title: string;
  blurb: string;
};

const tiles: Tile[] = [
  {
    title: "Increased Efficiency",
    blurb:
      "Automate time-consuming steps and hit deadlines faster without compromising quality across deliverables.",
  },
  {
    title: "Improved Accuracy",
    blurb:
      "Consistent, high-quality renderings reduce manual errors and rework with precise visual outputs.",
  },
  {
    title: "Enhanced Creativity",
    blurb:
      "Explore more variations and perspectives with intelligent prompts that expand your creative direction.",
  },
  {
    title: "Saves Cost",
    blurb:
      "Shorter timelines and fewer revisions optimize budgets and increase overall project profitability.",
  },
  {
    title: "Seamless Collaboration",
    blurb:
      "Share results easily and iterate with stakeholders using clear visuals and structured feedback loops.",
  },
  {
    title: "Scales with Teams",
    blurb:
      "From solo designers to large studios—keep a consistent pipeline that adapts to your project load.",
  },
];

export function RenderSeamlessGridSection() {
  return (
    <section className="px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-5xl">
        {/* Heading */}
        <Reveal>
          <div className="grid gap-6 md:grid-cols-12 md:items-end md:gap-8 mb-8 md:mb-12">
            <h2 className="md:col-span-7 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
              Render Seamlessly
              <br />
              from{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Sketch to AI
              </span>
            </h2>
            <p className="md:col-span-5 text-sm md:text-base text-muted-foreground">
              Effortlessly turn sketches into high-quality architectural
              visuals. These benefits keep your pipeline fast, accurate, and
              elegant.
            </p>
          </div>
        </Reveal>

        {/* Tiles */}
        <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t, i) => (
            <Reveal key={i} delay={i * 0.07}>
              <article className="group glass-hover relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6 shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:border-border hover:shadow-lg">
                {/* soft gradient rim */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
                {/* corner icon */}
                <div className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </div>
                {/* shine sweep */}
                <div
                  className="pointer-events-none absolute -inset-1 translate-x-[-120%] rounded-2xl 
                  bg-[linear-gradient(110deg,transparent,rgba(0,0,0,0.08),transparent)] 
                  dark:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] 
                  transition-transform duration-700 group-hover:translate-x-[120%]"
                />
                <div className="relative z-10">
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
                    {t.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {t.blurb}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
