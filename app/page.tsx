"use client";

import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Compass,
  ArrowRightLeft,
  Shield,
  Layers,
  Award,
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
    <div className="flex flex-col bg-[#1F2224] text-[#E6E8E8]">
      {/* Editorial Announcement Bar */}
      <div className="border-b border-[#3A3A3A] bg-[#262626]/60 py-2.5 px-4 text-center">
        <p className="text-xs text-[#CFC7C1] tracking-wide font-medium">
          <span className="text-[#B4887A] font-serif italic mr-2 text-sm">Code2Career Track 2</span>
          An editorial barter marketplace for independent creative practitioners
        </p>
      </div>

      {/* Hero Section — Generous Whitespace & Editorial Typography */}
      <section className="relative px-4 sm:px-8 pt-20 pb-28 md:pt-28 md:pb-36 max-w-[1280px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Hero Column: Large Cormorant Garamond Heading */}
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#444444] bg-[#2E2E2E] text-xs text-[#B4887A]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5E8A67]" />
              <span className="font-medium tracking-wide">Independent Creative Exchange</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-normal tracking-tight text-[#E6E8E8] leading-[1.02]">
              Exchange craft. <br />
              <span className="italic text-[#C46A6D]">Without cash.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#CFC7C1] font-normal leading-relaxed max-w-xl">
              SkillSwap is an editorial platform where video editors, art directors, copywriters, and sound designers collaborate through mathematically verified barter equivalence.
            </p>

            {/* Primary & Secondary CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/marketplace"
                className="px-8 py-4 rounded-[16px] bg-[#C46A6D] text-white text-base font-medium hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out shadow-sm text-center flex items-center justify-center gap-2 group"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>

              <Link
                href="/trade"
                className="px-8 py-4 rounded-[16px] bg-[#2E2E2E] text-[#E6E8E8] border border-[#3A3A3A] hover:border-[#7A7A7A] hover:bg-[#262626] text-base font-medium transition-all duration-200 ease-out text-center flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-[#B4887A]" />
                <span>Barter Calculator</span>
              </Link>
            </div>

            {/* Micro details */}
            <div className="pt-4 flex items-center gap-8 text-xs text-[#CFC7C1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8A67]" />
                <span>Zero signup gating</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8A67]" />
                <span>Deterministic REST API</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#5E8A67]" />
                <span>DP1 Rejection Protocol</span>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Editorial Card with Warm Architectural Geometry */}
          <div className="lg:col-span-5">
            <div className="rounded-[24px] bg-[#2E2E2E] border border-[#3A3A3A] p-8 sm:p-10 space-y-8 shadow-xl relative overflow-hidden">
              {/* Subtle Architectural Arc Indicator */}
              <div className="flex items-center justify-between pb-6 border-b border-[#3A3A3A]">
                <div>
                  <span className="font-serif text-2xl font-normal text-[#E6E8E8]">Curated Disciplines</span>
                  <p className="text-xs text-[#CFC7C1] mt-0.5">Active practitioners ready to collaborate</p>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-[#262626] text-[#B4887A] border border-[#444444]">
                  14+ Gigs
                </span>
              </div>

              {/* Discipline Rows */}
              <div className="space-y-3.5">
                {EDITORIAL_DISCIPLINES.map((d) => (
                  <Link
                    key={d.name}
                    href={`/marketplace?category=${encodeURIComponent(d.category)}`}
                    className="flex items-center justify-between p-3.5 rounded-[16px] bg-[#262626] hover:bg-[#1F2224] border border-[#3A3A3A] hover:border-[#7A7A7A]/50 transition-all duration-200 ease-out group"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#E6E8E8] group-hover:text-[#C46A6D] transition-colors">
                        {d.name}
                      </p>
                      <p className="text-[11px] text-[#CFC7C1]">{d.category}</p>
                    </div>
                    <span className="font-mono text-[11px] text-[#CFC7C1] group-hover:text-[#E6E8E8]">
                      {d.count} &rarr;
                    </span>
                  </Link>
                ))}
              </div>

              <div className="pt-2 text-center">
                <Link
                  href="/gigs/new"
                  className="text-xs font-medium text-[#B4887A] hover:text-[#C46A6D] transition-colors inline-flex items-center gap-1"
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
      <section className="border-t border-[#3A3A3A] py-24 px-4 sm:px-8 bg-[#262626]/30">
        <div className="max-w-[1280px] mx-auto space-y-16">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-medium tracking-widest text-[#B4887A] uppercase">
              Platform Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal text-[#E6E8E8] tracking-tight">
              Crafted for trust, reciprocity, and velocity.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CURATED_PILLARS.map((pillar) => (
              <div
                key={pillar.num}
                className="rounded-[24px] bg-[#2E2E2E] border border-[#3A3A3A] p-7 flex flex-col justify-between space-y-6 transition-transform duration-200 ease-out hover:-translate-y-1 hover:border-[#7A7A7A]/40"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-[#B4887A] font-semibold">{pillar.num}</span>
                    <span className="text-[11px] uppercase tracking-wider text-[#CFC7C1]">{pillar.subtitle}</span>
                  </div>

                  <h3 className="font-serif text-xl font-normal text-[#E6E8E8] leading-snug">
                    {pillar.title}
                  </h3>

                  <p className="text-xs text-[#CFC7C1] leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#3A3A3A]">
                  <Link
                    href={pillar.link}
                    className="text-xs font-medium text-[#C46A6D] hover:underline inline-flex items-center gap-1"
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
      <section className="border-t border-[#3A3A3A] py-16 px-4 sm:px-8 bg-[#1F2224]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-[#E6E8E8]">14+</p>
            <p className="text-xs text-[#CFC7C1]">Curated Gigs Seeded</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-[#5E8A67]">100%</p>
            <p className="text-xs text-[#CFC7C1]">Zero Auth Friction</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-[#B4887A]">5 / 5</p>
            <p className="text-xs text-[#CFC7C1]">Mandatory Brief Features</p>
          </div>
          <div className="space-y-1.5">
            <p className="font-mono text-3xl sm:text-4xl font-semibold text-[#C46A6D]">&lt; 100ms</p>
            <p className="text-xs text-[#CFC7C1]">Deterministic REST Latency</p>
          </div>
        </div>
      </section>
    </div>
  );
}
