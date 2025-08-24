"use client";

import { Linkedin, Twitter, Instagram, Facebook } from "lucide-react";
import { Reveal } from "./animations/reveal";
import Logo from "@/public/images/logo.png";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-card/50">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 md:py-16">
        {/* Top */}
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          {/* Brand */}
          <Reveal>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Image
                  src={Logo}
                  height={100}
                  width={100}
                  alt="logo"
                  className="h-7 w-7 cursor-pointer hover:scale-105 transition-all duration-200"
                />
              </div>
              <div className="text-lg font-semibold">Katitects</div>
            </div>
          </Reveal>

          {/* Nav */}
          <Reveal delay={0.1}>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    className="hover:text-foreground transition-colors"
                    href="#"
                  >
                    How it Works
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-foreground transition-colors"
                    href="#"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-foreground transition-colors"
                    href="#"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-foreground transition-colors"
                    href="#"
                  >
                    FAQs
                  </a>
                </li>
              </ul>
            </nav>
          </Reveal>
        </div>

        {/* Middle - Socials */}
        <Reveal delay={0.2}>
          <div className="mt-8 flex items-center gap-4">
            <a
              aria-label="LinkedIn"
              href="#"
              className="glass-hover inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm hover:opacity-90 transition"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              aria-label="Twitter"
              href="#"
              className="glass-hover inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm hover:opacity-90 transition"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              aria-label="Instagram"
              href="#"
              className="glass-hover inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm hover:opacity-90 transition"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              aria-label="Facebook"
              href="#"
              className="glass-hover inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-sm hover:opacity-90 transition"
            >
              <Facebook className="h-4 w-4" />
            </a>
          </div>
        </Reveal>

        {/* Bottom */}
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-col gap-3 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
            <div>Katitects build 2024 • All rights reserved.</div>
            <div className="flex items-center gap-4">
              <a className="hover:text-foreground transition-colors" href="#">
                Privacy Policy
              </a>
              <a className="hover:text-foreground transition-colors" href="#">
                Terms & Conditions
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
