"use client";

import Link from "next/link";
import {
  ArrowRight,
  Compass,
  CheckCircle2
} from "lucide-react";

const EDITORIAL_DISCIPLINES = [
  { name: "Brand & Visual Identity", category: "Design", count: "14 Available" },
  { name: "Cinematic Post-Production", category: "Video Editing", count: "9 Available" },
  { name: "Studio Sound Engineering", category: "Audio", count: "8 Available" },
  { name: "Editorial & Strategy Copy", category: "Writing", count: "11 Available" },
  { name: "1-on-1 Craft Mentorship", category: "Tutoring", count: "12 Available" },
];

const CURATED_PILLARS = [
  {
    num: "01",
    title: "Curated Directory of Creative Craft",
    subtitle: "Browse & Book",
    description: "Discover verified independent practitioners across motion, brand systems, sound design, and long-form strategy. Book directly with transparent deliverables and zero middleman friction.",
    link: "/marketplace",
    linkText: "Explore Gigs",
  },
  {
    num: "02",
    title: "Post & Showcase Your Service Scope",
    subtitle: "Direct Listings",
    description: "Present your creative practice with clean editorial cards, deliverable schedules, and fixed or hourly rates. Pre-seeded demo identity enables immediate publishing.",
    link: "/gigs/new",
    linkText: "List a Service",
  },
  {
    num: "03",
    title: "Transparent Protocol for Rejection (DP1)",
    subtitle: "Trust & Continuity",
    description: "When a creator cannot commit, clients immediately receive clear contextual reason tags (e.g. Schedule Conflict) paired with an automated carousel of comparable peers.",
    link: "/my-bookings",
    linkText: "Client Portal",
  },
  {
    num: "04",
    title: "Multi-Factor Barter Equivalence",
    subtitle: "Labor Effort Units",
    description: "An algorithmic dimensionless barter ratio (LEU × MSI) that accounts for skill rarity, tool overhead, and revisions to establish objective parity without cash exchange.",
    link: "/trade",
    linkText: "Barter Calculator",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col bg-[#FBF9F5] text-[#1C1917]">
      {/* Editorial Announcement Bar */}
      <div className="border-b border-[#E7E2D9] bg-[#F3EFEA] py-2.5 px-4 text-center">
        <p className="text-xs text-[#68625D] tracking-wide font-medium">
          <span className="text-[#8C6D58] font-serif italic mr-2 text-sm font-semibold">Code2Career Track 2</span>
          An editorial barter marketplace for independent creative practitioners
        </p>
      </div>

      {/* Hero Section — Generous Whitespace & Editorial Typography */}
      <section className="relative px-4 sm:px-8 pt-20 pb-28 md:pt-28 md:pb-36 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Hero Column: Large Cormorant Garamond Heading */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DCD5C9] bg-white text-xs text-[#8C6D58] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#3D724D]" />
              <span className="font-semibold tracking-wider uppercase text-[11px]">Independent Creative Exchange</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-light tracking-tight text-[#1C1917] leading-[1.04]">
              Exchange craft. <br />
              <span className="italic text-[#A34835] font-normal">Without cash.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#68625D] font-light leading-relaxed max-w-xl">
              SkillSwap is an editorial platform where video editors, art directors, copywriters, and sound designers collaborate through mathematically calibrated barter equivalence.
            </p>

            {/* Primary & Secondary CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/marketplace"
                className="px-8 py-4 rounded-[16px] bg-[#A34835] text-white text-sm font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out shadow-[0_4px_14px_rgba(163,72,53,0.25)] text-center flex items-center justify-center gap-2 group"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/trade"
                className="px-8 py-4 rounded-[16px] bg-white text-[#1C1917] border border-[#DCD5C9] hover:border-[#8C6D58] hover:bg-[#F3EFEA] text-sm font-semibold uppercase tracking-wider transition-all duration-200 ease-out text-center flex items-center justify-center gap-2 shadow-xs"
              >
                <Compass className="w-4 h-4 text-[#8C6D58]" />
                <span>Barter Calculator</span>
              </Link>
            </div>

            {/* Micro details */}
            <div className="pt-4 flex flex-wrap items-center gap-8 text-xs text-[#68625D]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3D724D]" />
                <span>Zero signup gating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3D724D]" />
                <span>Deterministic REST API</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#3D724D]" />
                <span>DP1 Rejection Protocol</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Curated Disciplines Card */}
          <div className="lg:col-span-5">
            <div className="rounded-[24px] bg-white border border-[#E7E2D9] p-8 sm:p-10 space-y-7 shadow-[0_4px_24px_rgba(0,0,0,0.05)] relative overflow-hidden">
              <div className="flex items-center justify-between pb-5 border-b border-[#E7E2D9]">
                <div>
                  <span className="font-serif text-2xl font-light text-[#1C1917]">Curated Disciplines</span>
                  <p className="text-xs text-[#68625D] mt-0.5">Active practitioners ready to collaborate</p>
                </div>
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-[#F3EFEA] text-[#8C6D58] border border-[#DCD5C9] font-medium">
                  14+ Gigs
                </span>
              </div>

              {/* Discipline Rows */}
              <div className="space-y-3">
                {EDITORIAL_DISCIPLINES.map((d) => (
                  <Link
                    key={d.name}
                    href={`/marketplace?category=${encodeURIComponent(d.category)}`}
                    className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#FAF8F5] hover:bg-white border border-[#E7E2D9] hover:border-[#A34835]/40 hover:shadow-xs transition-all duration-200 ease-out group"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#1C1917] group-hover:text-[#A34835] transition-colors">
                        {d.name}
                      </p>
                      <p className="text-[11px] text-[#68625D]">{d.category}</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#8C6D58] group-hover:text-[#1C1917]">
                      {d.count} &rarr;
                    </span>
                  </Link>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/gigs/new"
                  className="text-xs font-semibold text-[#8C6D58] hover:text-[#A34835] transition-colors inline-flex items-center gap-1 uppercase tracking-wider"
                >
                  <span>Are you a creator? List your service here</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Pillars Section — 12-Column Grid */}
      <section className="border-t border-[#E7E2D9] py-24 px-4 sm:px-8 bg-[#F3EFEA]/60">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-semibold tracking-widest text-[#8C6D58] uppercase">
              Platform Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1917] tracking-tight leading-tight">
              Crafted for trust, reciprocity, and velocity.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CURATED_PILLARS.map((pillar) => (
              <div
                key={pillar.num}
                className="rounded-[24px] bg-white border border-[#E7E2D9] p-7 flex flex-col justify-between space-y-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.06)] hover:border-[#DCD5C9]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-[#8C6D58] font-bold">{pillar.num}</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#68625D] font-medium">{pillar.subtitle}</span>
                  </div>

                  <h3 className="font-serif text-xl font-light text-[#1C1917] leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#68625D] font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E7E2D9]">
                  <Link
                    href={pillar.link}
                    className="text-xs font-semibold text-[#A34835] hover:text-[#8C3B2A] inline-flex items-center gap-1 uppercase tracking-wider"
                  >
                    <span>{pillar.linkText}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Metrics Section with JetBrains Mono numbers */}
      <section className="border-t border-[#E7E2D9] py-16 px-4 sm:px-8 bg-white">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-light text-[#1C1917]">14+</p>
            <p className="text-xs text-[#68625D]">Curated Gigs Seeded</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-light text-[#3D724D]">100%</p>
            <p className="text-xs text-[#68625D]">Zero Auth Friction</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-light text-[#8C6D58]">5 / 5</p>
            <p className="text-xs text-[#68625D]">Mandatory Brief Features</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-light text-[#A34835]">&lt; 100ms</p>
            <p className="text-xs text-[#68625D]">Deterministic REST Latency</p>
          </div>
        </div>
      </section>
    </div>
  );
}
