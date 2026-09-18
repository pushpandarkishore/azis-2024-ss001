"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Users,
  BarChart3,
  FileText,
  Shield,
  Star,
  TrendingUp,
  Sparkles,
  Flame,
  ArrowRightLeft,
  CheckCircle2,
  Play,
  Layers,
  Palette,
  Video,
  Headphones,
  Code,
  Compass
} from "lucide-react";

const LIVE_TICKER_ITEMS = [
  "🔥 Zara Chen traded 3D Intro for Sofia's Full-Stack Next.js App (98% Fair)",
  "⚡ David Kim swapped 4K Color Grade for Marcus's SaaS Design System (95% Fair)",
  "🎧 Liam Thorne mastered 8 Podcast Episodes for Elena's SEO Strategy (92% Fair)",
  "🚀 Aria Tanaka exchanged 30 Vector Icons for TechStart's Pitch Deck Copy (96% Fair)",
  "✨ 48 Active Creators jamming & trading right now with $0 platform cash fee",
];

const SKILL_CHIPS = [
  { name: "3D Motion Graphics", icon: Layers, color: "text-violet-400 bg-violet-500/10 border-violet-500/30" },
  { name: "UI/UX & Figma", icon: Palette, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30" },
  { name: "Shortform & Reels", icon: Video, color: "text-pink-400 bg-pink-500/10 border-pink-500/30" },
  { name: "Spatial Audio Mix", icon: Headphones, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
  { name: "Next.js & React", icon: Code, color: "text-amber-400 bg-amber-500/10 border-amber-500/30" },
];

const BENTO_CARDS = [
  {
    tag: "Feature 2 & 3",
    title: "Instant Gig Booking & Direct Escrow",
    description: "Browse 14+ curated gigs across Design, Video, Audio, Writing, and Tutoring. Book in 10 seconds with pre-seeded identity & zero signup walls.",
    gradient: "from-violet-600/20 via-purple-600/10 to-transparent",
    border: "hover:border-violet-500/50",
    icon: Zap,
    stat: "14+ Live Gigs",
    link: "/marketplace",
    linkText: "Browse Marketplace",
  },
  {
    tag: "Feature 1",
    title: "Post & Monetize Your Creative Powers",
    description: "Publish your craft in 60 seconds with live reactive card previews, category tags, and hourly or flat deliverable rates.",
    gradient: "from-cyan-600/20 via-blue-600/10 to-transparent",
    border: "hover:border-cyan-500/50",
    icon: Flame,
    stat: "Instant Publishing",
    link: "/gigs/new",
    linkText: "Post a Gig Now",
  },
  {
    tag: "Feature 4 & 5",
    title: "Creator Dashboard & Rejection Protocol (DP1)",
    description: "Real-time incoming request feed with 1-click Accept or transparent Decline reason tags that automatically re-route clients to active peers.",
    gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
    border: "hover:border-emerald-500/50",
    icon: Shield,
    stat: "99% Trust Score",
    link: "/creator/dashboard",
    linkText: "Open Dashboard",
  },
  {
    tag: "AI Barter Engine",
    title: "LEU × MSI Mathematical Equivalence",
    description: "Our proprietary algorithm balances Labor Effort Units and Market Scarcity Index to calculate bulletproof barter fairness without cash.",
    gradient: "from-amber-600/20 via-orange-600/10 to-transparent",
    border: "hover:border-amber-500/50",
    icon: BarChart3,
    stat: "96.4% Avg. Fairness",
    link: "/trade",
    linkText: "Launch Calculator",
  },
];

export default function HomePage() {
  // Interactive Hero Swap Demo State
  const [skillOffer, setSkillOffer] = useState("Video Editing");
  const [skillRequest, setSkillRequest] = useState("UI/UX Design");

  const fairness =
    skillOffer === skillRequest
      ? 100
      : (skillOffer === "Video Editing" && skillRequest === "UI/UX Design")
      ? 96
      : (skillOffer === "3D Motion Graphics" && skillRequest === "Audio")
      ? 92
      : 89;

  return (
    <div className="flex flex-col overflow-hidden">
      {/* 🚀 Gen-Z Live Activity Marquee Ticker */}
      <div className="w-full bg-primary/10 border-b border-primary/25 overflow-hidden py-2 select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-semibold text-foreground/90">
          {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, idx) => (
            <span key={idx} className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{item}</span>
              <span className="text-muted-foreground/50">&middot;</span>
            </span>
          ))}
        </div>
      </div>

      {/* ⚡ HERO SECTION */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 py-16">
        {/* Dynamic ambient glowing orbs */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[28rem] h-[28rem] bg-violet-600/20 rounded-full blur-[110px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] bg-cyan-500/20 rounded-full blur-[100px] animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-fuchsia-500/10 rounded-full blur-[130px]" />
        </div>

        <div className="max-w-6xl mx-auto text-center space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm font-semibold animate-pulse-glow">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
            <span>SkillSwap &middot; The Creative Barter Protocol</span>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
              Code2Career
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05]">
            Trade Raw Talent. <br />
            <span className="gradient-text">Zero Cash. Pure Craft.</span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            The next-generation marketplace where video editors, designers, sound engineers, and creators trade high-end services using fair mathematical equivalence.
          </p>

          {/* Skill Tag Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {SKILL_CHIPS.map((chip) => {
              const Icon = chip.icon;
              return (
                <div
                  key={chip.name}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur-md transition-all hover:scale-105 cursor-pointer ${chip.color}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{chip.name}</span>
                </div>
              );
            })}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/marketplace"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-cyan-600 text-white font-bold text-base sm:text-lg hover:opacity-95 transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-violet-600/30 flex items-center justify-center gap-2 group"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              href="/trade"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-border bg-card/80 backdrop-blur-md text-foreground font-bold text-base sm:text-lg hover:bg-muted hover:border-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>AI Barter Calculator</span>
            </Link>
          </div>

          {/* 🎮 Interactive Live Vibe / Trade Simulator Card */}
          <div className="max-w-2xl mx-auto mt-12 p-6 rounded-3xl border border-border/80 bg-card/75 backdrop-blur-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground border-b border-border/60 pb-3">
              <span className="flex items-center gap-1.5 text-foreground font-bold">
                <ArrowRightLeft className="w-4 h-4 text-primary" />
                Live Barter Simulator (LEU × MSI)
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                {fairness}% Fair Trade Score
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  I Offer:
                </label>
                <select
                  value={skillOffer}
                  onChange={(e) => setSkillOffer(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  <option value="Video Editing">Video Editing (Longform + Shorts)</option>
                  <option value="3D Motion Graphics">3D Motion Graphics & Intros</option>
                  <option value="UI/UX Design">UI/UX Design & Design Systems</option>
                  <option value="Audio">Audio Mixing & Mastering</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  I Want in Return:
                </label>
                <select
                  value={skillRequest}
                  onChange={(e) => setSkillRequest(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  <option value="UI/UX Design">UI/UX Design & Design Systems</option>
                  <option value="Video Editing">Video Editing (Longform + Shorts)</option>
                  <option value="3D Motion Graphics">3D Motion Graphics & Intros</option>
                  <option value="Audio">Audio Mixing & Mastering</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>Dynamic Labor Effort Units & Scarcity indexed</span>
              <Link href={`/trade?offer=${encodeURIComponent(skillOffer)}&need=${encodeURIComponent(skillRequest)}`} className="text-primary font-bold hover:underline flex items-center gap-1">
                <span>Evaluate Full Scope</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 🧩 BENTO GRID SHOWCASE */}
      <section className="px-4 sm:px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold text-primary uppercase tracking-widest px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            Engineered For The New Creator Economy
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Built Different. <span className="gradient-text">Designed to Wow.</span>
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Every feature is architected for zero-friction evaluation, lightning-fast interactivity, and transparent creative exchange.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {BENTO_CARDS.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-8 rounded-3xl border border-border bg-card relative overflow-hidden transition-all duration-300 neon-glow-hover flex flex-col justify-between group ${card.border}`}
              >
                {/* Background Subtle Gradient Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none`}
                />

                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                      {card.tag}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-lg border border-border/60">
                      {card.stat}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-primary/30 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {card.description}
                  </p>
                </div>

                <div className="relative z-10 pt-6 mt-4 border-t border-border/60 flex items-center justify-between">
                  <Link
                    href={card.link}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline group-hover:translate-x-1 transition-transform"
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    Ready to Test &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 🔮 COMMUNITY STATS BAR */}
      <section className="px-4 sm:px-6 py-12 border-y border-border/70 bg-muted/20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-4xl sm:text-5xl font-black gradient-text">14+</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1">Pre-Seeded Gigs</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black gradient-text">100%</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1">Zero Auth Gating</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black gradient-text">5 / 5</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1">Required Features Built</p>
          </div>
          <div>
            <p className="text-4xl sm:text-5xl font-black gradient-text">&lt; 100ms</p>
            <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-1">Instant REST Response</p>
          </div>
        </div>
      </section>
    </div>
  );
}
