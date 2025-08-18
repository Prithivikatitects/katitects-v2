import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

type FeatureItem = {
  title: string
  description: string
  cta?: string
  imageAlt: string
  imageUrl: string
}

const items: FeatureItem[] = [
  {
    title: "Instant rendering and visualization",
    description:
      "Simply drag and drop your sketch or design concept. Our AI accepts everything from rough outlines to detailed plans, making it easy to get started.",
    cta: "Get Started",
    imageAlt: "Blueprint with 3D floor plan mock",
    imageUrl: "/placeholder.svg?height=420&width=640",
  },
  {
    title: "Smart material suggestions",
    description:
      "Get context-aware material palettes tuned to your style, lighting, and budget with a single prompt or upload.",
    cta: "Explore",
    imageAlt: "Material swatches and textures laid out",
    imageUrl: "/placeholder.svg?height=420&width=640",
  },
  {
    title: "Lighting presets and mood",
    description: "Apply realistic daylight, golden hour, or interior mood lighting to preview ambiance instantly.",
    cta: "Try Presets",
    imageAlt: "Architectural model with dramatic lighting",
    imageUrl: "/placeholder.svg?height=420&width=640",
  },
  {
    title: "One‑click style variations",
    description:
      "Generate multiple stylistic takes—minimal, modern, Scandinavian, industrial—without redoing your layout.",
    cta: "Generate",
    imageAlt: "Collage of design styles",
    imageUrl: "/placeholder.svg?height=420&width=640",
  },
  {
    title: "Precision masking tools",
    description: "Refine and emphasize key areas with non‑destructive masks for accurate, client‑ready visuals.",
    cta: "Refine",
    imageAlt: "Masking interface on a design mock",
    imageUrl: "/placeholder.svg?height=420&width=640",
  },
  {
    title: "Export and share anywhere",
    description: "Deliver high‑resolution images and short clips optimized for presentations and stakeholder feedback.",
    cta: "Export",
    imageAlt: "Export options panel",
    imageUrl: "/placeholder.svg?height=420&width=640",
  },
]

function FeatureRow({
  item,
  reverse = false,
}: {
  item: FeatureItem
  reverse?: boolean
}) {
  return (
    <article
      className={`grid items-center gap-8 md:gap-10 lg:gap-14 lg:grid-cols-2 ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}
    >
      {/* Text */}
      <div className="space-y-4 lg:space-y-6">
        <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">{item.title}</h3>
        <p className="text-sm md:text-base text-muted-foreground">{item.description}</p>
        {item.cta && (
          <div>
            <Button
              size="lg"
              className="group relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:shadow-purple-500/20"
            >
              <span className="relative z-10">{item.cta}</span>
              <ArrowRight className="ml-2 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-0.5" />
              <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 group-hover:translate-x-[120%]" />
            </Button>
          </div>
        )}
      </div>

      {/* Image */}
      <div className="relative">
        <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-2 shadow-sm transition-all duration-300 hover:border-border hover:shadow-lg">
          {/* soft colored rim light */}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-indigo-500/10" />
          <div className="relative h-[240px] sm:h-[300px] md:h-[340px] lg:h-[360px] overflow-hidden rounded-xl">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.imageAlt}
              fill
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 80vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority={false}
            />
            {/* subtle purple tint for elegance */}
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-t from-purple-500/20 via-transparent to-transparent" />
            {/* shine sweep */}
            <div className="pointer-events-none absolute -inset-1 translate-x-[-120%] rounded-xl bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] transition-transform duration-700 group-hover:translate-x-[120%]" />
          </div>
        </div>
      </div>
    </article>
  )
}

export function KeyFeaturesSection() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">Our Key Features</h2>
          <p className="mt-4 max-w-3xl text-sm md:text-base text-muted-foreground">
            Discover how our AI‑Powered Design Assistant transforms your ideas into stunning designs effortlessly.
            Follow these simple steps to turn your vision into reality.
          </p>
        </header>

        <div className="space-y-16 md:space-y-20">
          {items.map((item, idx) => (
            <FeatureRow key={idx} item={item} reverse={idx % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  )
}
