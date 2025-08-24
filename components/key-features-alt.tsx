import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./animations/reveal";
import Feature1Img from "@/public/images/key-feature-1.avif";
import Feature2Img from "@/public/images/key-feature-2.jpg";
import Feature3Img from "@/public/images/key-feature-3.jpg";
import Feature4Img from "@/public/images/key-feature-4.jpg";
import Feature5Img from "@/public/images/key-feature-5.webp";
import Feature6Img from "@/public/images/key-feature-6.png";
import { cn } from "@/lib/utils";

type Feature = {
  title: string;
  description: string;
  image: any;
  gradient: string;
};

const features: Feature[] = [
  {
    title: "Instant rendering and visualization",
    description:
      "Drop in your sketch or plan and get polished, presentation-ready renders in minutes with realistic materials.",
    image: Feature1Img,
    gradient: "from-purple-600 to-indigo-600",
  },
  {
    title: "Smart material suggestions",
    description:
      "Receive context-aware palettes matched to your style, lighting, and budget—ready to apply in one click.",
    image: Feature2Img,
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    title: "Intelligent design suggestions",
    description:
      "Let the AI work its magic! Within minutes, receive a high-resolution, beautifully rendered image ready to showcase or present to clients.",
    image: Feature3Img,
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "One-click style variations",
    description:
      "Explore multiple stylistic takes—minimal, Scandinavian, industrial—without changing your layout.",
    image: Feature4Img,
    gradient: "from-cyan-600 to-blue-600",
  },
  {
    title: "Precision masking tools",
    description:
      "Emphasize key areas with non-destructive masks for refined details and client-ready results.",
    image: Feature5Img,
    gradient: "from-pink-600 to-fuchsia-600",
  },
  {
    title: "Export and share anywhere",
    description:
      "Deliver hi-res images optimized for presentations, reviews, and social.",
    image: Feature6Img,
    gradient: "from-lime-600 to-green-600",
  },
];

export function KeyFeaturesAltSection() {
  return (
    <section className="px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 md:mb-12">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Our Key{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Features
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 max-w-3xl text-sm md:text-base text-muted-foreground">
              Discover how our AI-Powered Design Assistant transforms your ideas
              into stunning designs effortlessly. Follow these simple steps to
              turn your vision into reality.
            </p>
          </Reveal>
        </header>

        <div className="grid gap-6 sm:gap-7 md:gap-8 md:grid-cols-2 h-full">
          {features.map((f, i) => (
            <Reveal delay={0.2 * (i + 1)} key={i}>
              <article className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:border-border h-full">
                {/* gradient ring on hover */}
                <div
                  className={`pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br ${f.gradient} opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-15`}
                />
                {/* shine sweep */}
                <div
                  className="pointer-events-none absolute -inset-1 translate-x-[-120%] rounded-2xl 
                  bg-[linear-gradient(110deg,transparent,rgba(0,0,0,0.08),transparent)] 
                  dark:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] 
                  transition-transform duration-700 group-hover:translate-x-[120%]"
                />
                <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
                  {/* media */}
                  <div className="relative overflow-hidden rounded-xl border border-border/50">
                    <div className="relative h-36 sm:h-40 md:h-44">
                      <Image
                        src={f.image || "/placeholder.svg"}
                        alt={f.title}
                        fill
                        sizes="(min-width: 768px) 520px, 100vw"
                        className={cn(
                          "object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        )}
                      />
                      {/* soft tint */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent dark:from-white/5" />
                    </div>
                  </div>

                  {/* content */}
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-1 inline-flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full text-[11px] font-semibold text-white bg-gradient-to-br ${f.gradient} shadow-sm`}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-base sm:text-lg font-semibold leading-tight">
                        {f.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {f.description}
                      </p>
                      <button
                        className="mt-2 inline-flex items-center text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                        aria-label="Learn more"
                      >
                        Learn more
                        <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
