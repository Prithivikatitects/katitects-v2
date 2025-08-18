import { ArrowUpRight } from "lucide-react"

type Benefit = {
  title: string
  blurb: string
  spanClasses: string
}

const benefits: Benefit[] = [
  {
    title: "Increased Efficiency",
    blurb:
      "Upload a sketch, set preferences, and let AI handle rendering. Cut design time dramatically while meeting tight deadlines without sacrificing quality.",
    spanClasses: "md:col-span-6",
  },
  {
    title: "Improved Accuracy",
    blurb:
      "AI-powered rendering reduces common errors and inconsistencies, producing detailed, highly accurate visualizations with consistent results.",
    spanClasses: "md:col-span-6",
  },
  {
    title: "Enhanced Creativity",
    blurb:
      "AI adds fresh perspectives and alternative styles, helping you explore unique variations and push ideas further with minimal effort.",
    spanClasses: "md:col-span-8",
  },
  {
    title: "Saves Cost",
    blurb:
      "Faster turnarounds and fewer revisions reduce overall project cost, freeing time and resources for strategic work and higher-impact decisions.",
    spanClasses: "md:col-span-4",
  },
]

export function RenderSeamlessSection() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        {/* Title + Intro */}
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
            Effortlessly turn your sketches into high‑quality architectural renderings. Bring concepts to life with
            precision and style using these tools.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          {benefits.map((b, idx) => (
            <article
              key={idx}
              className={`relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 sm:p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:shadow-lg ${b.spanClasses}`}
            >
              {/* Subtle gradient rim on hover */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 blur-xl transition-opacity duration-500 hover:opacity-100" />
              {/* Icon badge */}
              <div className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm">
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <p className="text-xs sm:text-sm text-muted-foreground">{b.blurb}</p>
                <h3 className="mt-5 text-lg sm:text-xl font-semibold tracking-tight">{b.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
