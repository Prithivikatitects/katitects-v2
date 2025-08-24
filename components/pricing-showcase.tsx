"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Check } from "lucide-react";
import { Reveal } from "./animations/reveal"; // ✅ import Reveal

type Plan = {
  name: "Free" | "Basic" | "Pro";
  priceMonthly: number;
  priceYearly: number;
  blurb: string;
  features: string[];
  highlighted?: boolean;
  accent: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    priceMonthly: 0,
    priceYearly: 0,
    blurb: "Free forever",
    features: [
      "Basic AI-generated designs",
      "Access to customization tools",
      "Standard templates library",
      "5 projects per month",
    ],
    accent: "from-zinc-500/20 to-zinc-400/10",
  },
  {
    name: "Basic",
    priceMonthly: 14.99,
    priceYearly: 11.99,
    blurb: "For individuals & small teams",
    features: [
      "Advanced AI-generated designs",
      "Full customization tools",
      "Premium templates library",
      "Unlimited projects",
      "Real-time collaboration",
      "Priority email support",
    ],
    highlighted: true,
    accent: "from-purple-600 to-indigo-600",
  },
  {
    name: "Pro",
    priceMonthly: 29.99,
    priceYearly: 23.99,
    blurb: "For studios & enterprises",
    features: [
      "All Basic features",
      "Dedicated account manager",
      "Custom AI solutions & designs",
      "Onboarding & training",
      "24/7 priority support",
      "Advanced analytics & reporting",
      "Secure cloud storage",
    ],
    accent: "from-sky-600 to-cyan-600",
  },
];

function fmtUSD(n: number) {
  return n === 0 ? "$0" : `$${n.toFixed(n % 1 ? 2 : 0)}`;
}

export function PricingShowcaseSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="px-4 py-14 md:py-20">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-10 md:mb-12">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Affordable Plans for{" "}
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Every Need
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-3xl text-sm md:text-base text-muted-foreground">
              Choose the perfect plan for your design projects, from startups to
              enterprises. Our pricing tiers are designed for flexibility and
              value so you get the most out of our AI-powered design assistant.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-5 flex items-center gap-3 text-sm">
              <span
                className={!yearly ? "font-medium" : "text-muted-foreground"}
              >
                Monthly
              </span>
              <Switch
                checked={yearly}
                onCheckedChange={setYearly}
                className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-muted-foreground/40"
              />
              <span
                className={yearly ? "font-medium" : "text-muted-foreground"}
              >
                Yearly
              </span>
              {yearly && (
                <span className="ml-2 inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                  Save up to 20%
                </span>
              )}
            </div>
          </Reveal>
        </header>

        {/* Cards */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-3">
          {plans.map((plan, idx) => {
            const price = yearly ? plan.priceYearly : plan.priceMonthly;
            const isHighlight = plan.highlighted;
            return (
              <Reveal key={plan.name} delay={0.1 * idx}>
                <article
                  className={[
                    "group h-full glass-hover relative overflow-hidden rounded-2xl border bg-card/60 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg",
                    "border-border/60 hover:border-border",
                    isHighlight
                      ? "md:-translate-y-1 ring-1 ring-inset ring-purple-500/30"
                      : "",
                  ].join(" ")}
                >
                  {/* Subtle glow rim */}
                  <div
                    className={`pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100 ${
                      isHighlight
                        ? "bg-gradient-to-br from-purple-600/15 to-indigo-600/15"
                        : "bg-gradient-to-br from-foreground/5 to-foreground/0"
                    }`}
                  />

                  {/* Accent top bar */}
                  <div
                    className={`absolute inset-x-0 top-0 h-1.5 rounded-t-2xl ${
                      isHighlight
                        ? "bg-gradient-to-r " + plan.accent
                        : "bg-border/60"
                    }`}
                  />

                  {/* Badge */}
                  {isHighlight && (
                    <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-xs font-medium text-white shadow-sm">
                      Popular
                    </div>
                  )}

                  {/* Shine sweep */}
                  <div
                    className="pointer-events-none absolute -inset-1 translate-x-[-120%] rounded-2xl 
                  bg-[linear-gradient(110deg,transparent,rgba(0,0,0,0.08),transparent)] 
                  dark:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.12),transparent)] 
                  transition-transform duration-700 group-hover:translate-x-[120%]"
                  />

                  <div className="relative z-10">
                    <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">
                      {plan.name}
                    </div>
                    <div className="mb-1 text-3xl font-bold tracking-tight">
                      {fmtUSD(price)}
                      <span className="text-base font-medium text-muted-foreground">
                        /m
                      </span>
                    </div>
                    <div className="mb-5 text-xs text-muted-foreground">
                      {yearly
                        ? "Billed yearly (effective monthly rate)"
                        : "Billed monthly"}{" "}
                      • {plan.blurb}
                    </div>

                    <hr className="mb-4 border-border/60" />

                    <ul className="space-y-3">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span
                            className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white ${
                              isHighlight
                                ? "bg-gradient-to-br " + plan.accent
                                : "bg-foreground/70"
                            }`}
                            aria-hidden="true"
                          >
                            <Check className="h-3 w-3" />
                          </span>
                          <span className="text-sm text-foreground/90">
                            {f}
                          </span>
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
                            ? "bg-gradient-to-r " +
                              plan.accent +
                              " text-white border-0"
                            : "border-2",
                        ].join(" ")}
                      >
                        <span className="relative z-10">
                          {plan.name === "Free" ? "Start Free" : "Get Started"}
                        </span>
                        <div className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-700 group-hover/btn:translate-x-[120%]" />
                      </Button>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-6 text-xs text-muted-foreground">
            Prices shown in USD. Taxes may apply. Cancel anytime.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
