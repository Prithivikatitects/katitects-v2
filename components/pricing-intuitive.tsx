"use client"

import { useMemo, useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

type PlanName = "Free" | "Basic" | "Pro"

type Plan = {
  name: PlanName
  perSeatMonthly: number
  perSeatYearly: number // effective monthly rate when billed yearly
  info: string
  features: string[]
  includedRenders: number
}

const PLANS: Record<PlanName, Plan> = {
  Free: {
    name: "Free",
    perSeatMonthly: 0,
    perSeatYearly: 0,
    info: "Free forever",
    includedRenders: 100,
    features: [
      "Basic AI‑generated designs",
      "Customization tools (limited)",
      "Standard templates library",
      "1 seat, 5 projects / month",
    ],
  },
  Basic: {
    name: "Basic",
    perSeatMonthly: 14.99,
    perSeatYearly: 11.99,
    info: "Great for individuals & small teams",
    includedRenders: 1000,
    features: [
      "Advanced AI‑generated designs",
      "Full customization tools",
      "Premium templates library",
      "Unlimited projects",
      "Real‑time collaboration",
      "Priority email support",
    ],
  },
  Pro: {
    name: "Pro",
    perSeatMonthly: 29.99,
    perSeatYearly: 23.99,
    info: "Best for studios & enterprises",
    includedRenders: 5000,
    features: [
      "Everything in Basic",
      "Dedicated account manager",
      "Custom AI solutions & designs",
      "Onboarding & training",
      "24/7 priority support",
      "Advanced analytics & reporting",
      "Secure cloud storage",
    ],
  },
}

function currencyUSD(value: number) {
  if (value === 0) return "$0"
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value)
}

function recommendPlan(seats: number, renders: number): PlanName {
  if (seats <= 1 && renders <= PLANS.Free.includedRenders) return "Free"
  if (seats <= 5 && renders <= PLANS.Basic.includedRenders) return "Basic"
  return "Pro"
}

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  suffix,
}: {
  label: string
  value: number
  min: number
  max: number
  step?: number
  onChange: (next: number) => void
  suffix?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-foreground/90">{label}</span>
        <span className="font-medium">
          {value}
          {suffix ? ` ${suffix}` : ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full appearance-none rounded-lg bg-muted/60 accent-indigo-600 h-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-600 [&::-webkit-slider-thumb]:to-indigo-600 [&::-webkit-slider-thumb]:shadow [&::-webkit-slider-thumb]:shadow-purple-500/30"
        aria-label={label}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}

export function PricingIntuitiveSection() {
  const [yearly, setYearly] = useState(false)
  const [seats, setSeats] = useState(3)
  const [renders, setRenders] = useState(300)

  const suggested = useMemo(() => recommendPlan(seats, renders), [seats, renders])

  const pricePerSeat = (plan: Plan) => (yearly ? plan.perSeatYearly : plan.perSeatMonthly)
  const totalPrice = (plan: Plan) => {
    if (plan.name === "Free") return 0
    // Price scales by seat count
    return seats * pricePerSeat(plan)
  }

  const label = yearly ? "Yearly" : "Monthly"

  const orderedPlans: Plan[] = [PLANS.Free, PLANS.Basic, PLANS.Pro]

  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl">
        {/* Heading */}
        <header className="mb-8 md:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Affordable Plans for{" "}
            <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Every Need
            </span>
          </h2>
          <p className="mt-4 max-w-3xl text-sm md:text-base text-muted-foreground">
            Tune your plan interactively. Choose billing, seats, and monthly renders. We’ll recommend the best option
            and compute your estimated price in real time.
          </p>
        </header>

        {/* Controls */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm">
            <div className="text-sm text-muted-foreground">Billing</div>
            <div className="mt-3 flex items-center gap-3 text-sm">
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
            <p className="mt-3 text-xs text-muted-foreground">You&apos;re viewing {label.toLowerCase()} rates.</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm">
            <Range label="Seats" value={seats} min={1} max={20} onChange={setSeats} />
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm">
            <Range label="Renders / month" value={renders} min={50} max={5000} step={50} onChange={setRenders} />
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            Your selection: <span className="font-medium text-foreground">{seats}</span> seat(s),{" "}
            <span className="font-medium text-foreground">{renders}</span> renders/month •{" "}
            <span className="font-medium text-foreground">{label}</span> billing
          </div>
          <div className="text-sm">
            Recommended:{" "}
            <span className="font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">
              {suggested}
            </span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {orderedPlans.map((plan) => {
            const isRecommended = plan.name === suggested
            const price = totalPrice(plan)
            const badgeText = isRecommended ? "Recommended" : plan.name === "Basic" ? "Popular" : undefined

            return (
              <article
                key={plan.name}
                className={[
                  "group relative overflow-hidden rounded-2xl border bg-card/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                  "border-border/60 hover:border-border",
                  isRecommended ? "ring-1 ring-inset ring-purple-500/30" : "",
                ].join(" ")}
              >
                {/* Hover rim glow */}
                <div
                  className={`pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 ${
                    isRecommended
                      ? "bg-gradient-to-br from-purple-600/15 to-indigo-600/15"
                      : "bg-gradient-to-br from-foreground/5 to-foreground/0"
                  }`}
                />

                {/* Moving badge */}
                {badgeText && (
                  <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm">
                    {badgeText}
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{plan.name}</div>

                  {/* Price */}
                  <div className="mb-1 text-3xl font-bold tracking-tight">
                    {currencyUSD(price)}
                    <span className="text-base font-medium text-muted-foreground">/m</span>
                  </div>
                  <div className="mb-3 text-xs text-muted-foreground">
                    {plan.name === "Free"
                      ? plan.info
                      : `${seats} seat${seats > 1 ? "s" : ""} @ ${currencyUSD(pricePerSeat(plan))}/seat • ${
                          yearly ? "billed yearly" : "billed monthly"
                        }`}
                  </div>

                  <hr className="mb-4 border-border/60" />

                  <ul className="space-y-3">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span
                          className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white ${
                            isRecommended ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-foreground/70"
                          }`}
                        >
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-sm text-foreground/90">{f}</span>
                      </li>
                    ))}
                    <li className="flex items-start gap-2">
                      <span
                        className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white ${
                          isRecommended ? "bg-gradient-to-br from-purple-600 to-indigo-600" : "bg-foreground/70"
                        }`}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-sm text-foreground/90">
                        Includes up to {plan.includedRenders.toLocaleString()} renders / month
                      </span>
                    </li>
                  </ul>

                  <div className="mt-6">
                    <Button
                      size="lg"
                      variant={isRecommended ? "default" : "outline"}
                      className={[
                        "w-full group/btn relative overflow-hidden",
                        isRecommended
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:from-purple-700 hover:to-indigo-700"
                          : "border-2",
                      ].join(" ")}
                    >
                      <span className="relative z-10">{plan.name === "Free" ? "Start Free" : "Get Started"}</span>
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

        <p className="mt-6 text-xs text-muted-foreground">Prices in USD. Taxes may apply. Cancel anytime.</p>
      </div>
    </section>
  )
}
