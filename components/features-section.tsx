import type React from "react";
import { PencilLine, Sparkles, Eraser } from "lucide-react";
import { Reveal } from "./animations/reveal";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
};

const features: Feature[] = [
  {
    title: "Sketch to Image",
    description:
      "Upload your sketches, and our AI will bring them to life as fully rendered images in minutes.",
    icon: <PencilLine className="h-4 w-4" />,
    gradient: "from-blue-500 to-purple-500",
  },
  {
    title: "Style Transfer AI",
    description:
      "Blend your designs with the aesthetic you choose, creating personalized, high-impact visuals.",
    icon: <Sparkles className="h-4 w-4" />,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    title: "Masking AI",
    description:
      "Highlight or modify specific areas with refined details and adjustments to emphasize key elements.",
    icon: <Eraser className="h-4 w-4" />,
    gradient: "from-orange-500 to-rose-500",
  },
];

export function FeaturesSection() {
  return (
    <section className="px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 md:mb-12">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Unleash Your{" "}
              <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 dark:from-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent">
                Creativity
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">
              Katitects.build leverages artificial intelligence to automate and
              optimize building design processes, enabling faster, more
              accurate, and cost-effective results.
            </p>
          </Reveal>
        </header>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Reveal delay={0.2 * (i + 1)} key={i}>
              <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-border">
                {/* soft glow */}
                <div
                  className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20`}
                />

                {/* subtle shine sweep */}
                <div
                  className="pointer-events-none absolute -inset-1 translate-x-[-120%] rounded-2xl 
                  bg-[linear-gradient(110deg,transparent,rgba(0,0,0,0.08),transparent)] 
                  dark:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] 
                  transition-transform duration-700 group-hover:translate-x-[120%]"
                />

                <div className="relative z-10">
                  <div
                    className={`mb-5 inline-flex h-9 w-9 items-center justify-center rounded-full text-white shadow-sm bg-gradient-to-br ${f.gradient}`}
                  >
                    {f.icon}
                  </div>

                  <h3 className="text-lg font-semibold leading-none tracking-tight">
                    {f.title}
                  </h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {f.description}
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
