import Link from "next/link";
import { ArrowRight, Zap, Users, BarChart3, FileText, Shield, Star, TrendingUp, Globe } from "lucide-react";

const FEATURES = [
  {
    icon: Users,
    title: "Creator Profiles & Skill Vectorization",
    description: "Rich profiles with portfolio samples, skill tags, availability scheduling, and semantic embeddings that represent your creative DNA.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: Zap,
    title: "Semantic Matching Engine",
    description: "Natural-language search powered by AI finds complementary creators — a video editor needing a logo gets matched with a designer needing video shorts.",
    color: "from-cyan-500 to-blue-600",
  },
  {
    icon: BarChart3,
    title: "AI Value Equivalence Calculator",
    description: "Labor Effort Units × Market Scarcity Index — a dimensionless barter score that makes asymmetrical skills comparable without synthetic currency.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: FileText,
    title: "Smart Collaboration Brief Generator",
    description: "AI generates structured agreements with mutual milestones, deliverables, licensing terms, and deadlines — validated with schema enforcement.",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: Shield,
    title: "Verification, Escrow & Mutual Review",
    description: "Deliverable checkpoints with simulated skill-credit release and qualitative feedback — trust built into every exchange.",
    color: "from-pink-500 to-rose-600",
  },
];

const STATS = [
  { label: "Active Creators", value: "12+", icon: Users },
  { label: "Skill Categories", value: "15+", icon: Globe },
  { label: "Avg. Match Score", value: "87%", icon: TrendingUp },
  { label: "Trades Completed", value: "238", icon: Star },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Build Your Profile", desc: "List your creative skills, upload portfolio samples, set your availability and skill scope." },
  { step: "02", title: "Find Your Match", desc: "Search with natural language. Our AI surfaces creators who complement what you offer and need." },
  { step: "03", title: "Calculate Fair Value", desc: "Use the Trade Calculator to score both scopes with our LEU×MSI model. Aim for >80% fairness." },
  { step: "04", title: "Generate a Brief", desc: "AI drafts a structured collaboration agreement with milestones, deliverables, and licensing terms." },
  { step: "05", title: "Execute & Review", desc: "Complete checkpoints, release skill-credits via escrow, and leave qualitative feedback." },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        {/* Background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.75s' }} />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-8 animate-pulse-glow">
            <Zap className="w-3.5 h-3.5" />
            CODE2CAREER Track 2 — Creator Economy
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none mb-6">
            Exchange Skills.{" "}
            <span className="gradient-text">No Cash Required.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            SkillSwap is the AI-powered marketplace where video editors, designers, copywriters, and audio engineers exchange services through fair, verified, and transparent barter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/marketplace"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
            >
              Explore Marketplace
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/profile/new"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-foreground font-semibold text-lg hover:bg-muted transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Join as Creator
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16">
            {STATS.map((stat) => (
              <div key={stat.label} className="glass border border-border/50 rounded-2xl p-4 text-center">
                <p className="text-3xl font-black gradient-text">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">5 Core Features, Built for Creatives</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every feature designed to make fair creative exchange possible — from first profile to final review.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className={`gradient-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${i === 4 ? 'md:col-span-2 lg:col-span-1' : ''}`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4">How SkillSwap Works</h2>
            <p className="text-muted-foreground text-lg">From profile to paid — in 5 steps.</p>
          </div>
          <div className="space-y-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="flex items-start gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-primary/20 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <span className="text-primary font-black text-sm">{step.step}</span>
                </div>
                <div className="flex-1 pt-3">
                  <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute left-7 mt-16 w-px h-6 bg-border ml-[-1rem]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass border border-border/50 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-primary/10 rounded-full blur-3xl" />
            </div>
            <h2 className="text-4xl font-black mb-4">Ready to Start Swapping?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join 12+ creators already exchanging skills on SkillSwap. Your next creative collaborator is one search away.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/marketplace"
                className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
              >
                Browse Creators <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/trade"
                className="px-8 py-4 rounded-xl border border-border bg-card font-semibold hover:bg-muted transition-all hover:scale-105"
              >
                Try Trade Calculator
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
