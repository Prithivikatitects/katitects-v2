"use client"

import { useMemo, useState } from "react"
import { Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

type Plan = {
  name: "Free" | "Basic" | "Pro"
  monthly: number // price per month
  yearly: number // price per month when billed yearly (effective)
  blurb: string
  features: string[]
  highlighted?: boolean
}

const plans: Plan[] = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    blurb: "Free forever",
    features: [
      "Basic AI‑generated designs",
      "Access to customization tools",
      "Standard templates library",
      "5 projects per month",
    ],
  },
  {
    name: "Basic",
    monthly: 14.99,
    yearly: 11.99, // discounted effective monthly rate when billed yearly
    blurb: "Billed Monthly or Yearly",
    features: [
      "Advanced AI‑generated designs",
      "Full access to customization tools",
      "Premium templates library",
      "Unlimited projects",
      "Real‑time collaboration",
      "Priority email support",
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    monthly: 29.99,
    yearly: 23.99,
    blurb: "For teams & studios",
    features: [
      "All Basic features",
      "Dedicated account manager",
      "Custom AI solutions & designs",
      "Onboarding & training sessions",
      "24/7 priority support",
      "Advanced analytics & reporting",
      "Secure cloud storage",
    ],
  },
]

function formatUSD(v: number) {
  return v === 0 ? "$0" : `$${v.toFixed(v % 1 ? 2 : 0)}`
}

export function PricingSection() {
  const [yearly, setYearly] = useState(false)

  const label = useMemo(() => (yearly ? "Yearly" : "Monthly"), [yearly])

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        {/* Heading */}
        <header className="mb-10 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Affordable Plans for{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Every Need
            </span>
          </h2>
          <p className="mt-4 max-w-3xl text-sm md:text-base text-muted-foreground">
            Choose the perfect plan for your design projects, from startups to enterprises. Flexible tiers to help you
            get the most out of our AI‑powered design assistant.
          </p>

          {/* Toggle */}
          <div className="mt-5 flex items-center gap-3 text-sm">
            <span className={!yearly ? "font-medium" : "text-muted-foreground"}>Monthly</span>
            <Switch
              checked={yearly}
              onCheckedChange={setYearly}
              className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-muted-foreground/40"
            />
            <span className={yearly ? "font-medium" : "text-muted-foreground"}>Yearly</span>
            {yearly && (
              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                Save up to 20%
              </span>
            )}
          </div>
        </header>

        {/* Cards */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {plans.map((plan, idx) => {
            const price = yearly ? plan.yearly : plan.monthly
            const isHighlight = plan.highlighted

            return (
              <article
                key={plan.name}
                className={[
                  "group relative overflow-hidden rounded-2xl border bg-card/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                  "border-border/60 hover:border-border",
                  isHighlight ? "ring-1 ring-inset ring-purple-500/30" : "",
                ].join(" ")}
              >
                {/* Glow rim */}
                <div
                  className={`pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 ${
                    isHighlight
                      ? "bg-gradient-to-br from-purple-600/15 to-indigo-600/15"
                      : "bg-gradient-to-br from-foreground/5 to-foreground/0"
                  }`}
                />
                {/* Badge for highlight */}
                {isHighlight && (
                  <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm">
                    Popular
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{plan.name}</div>
                  <div className="mb-1 text-3xl font-bold tracking-tight">
                    {formatUSD(price)}
                    <span className="text-base font-medium text-muted-foreground">/m</span>
                  </div>
                  <div className="mb-5 text-xs text-muted-foreground">
                    {yearly ? "Billed yearly (effective monthly rate)" : "Billed monthly"}
                  </div>

                  <hr className="mb-4 border-border/60" />

                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white ${
                            isHighlight ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-foreground/70"
                          }`}
                          aria-hidden="true"
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-sm text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <Button
                      size="lg"
                      variant={isHighlight ? "default" : "outline"}
                      className={[
                        "w-full group/btn relative overflow-hidden",
                        isHighlight
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:from-purple-700 hover:to-indigo-700"
                          : "border-2",
                      ].join(" ")}
                    >
                      <span className="relative z-10">Get Started</span>
                      <ArrowRight className="ml-2 h-4 w-4 relative z-10 transition-transform group-hover/btn:translate-x-0.5" />
                      {/* Shine */}
                      <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 group-hover/btn:translate-x-[120%]" />
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* Subtle footnote */}
        <p className="mt-6 text-xs text-muted-foreground">Prices shown in USD. Taxes may apply. Cancel anytime.</p>
      </div>
    </section>
  )
}
