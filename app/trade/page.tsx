"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart3, ArrowLeftRight, CheckCircle, AlertCircle, Info, Zap, Plus, X } from "lucide-react";
import { getFairnessColor, getFairnessLabel } from "@/lib/utils";

interface TradeScope {
  skill: string;
  category: string;
  hours: number;
  revisions: number;
  complexity: "low" | "medium" | "high" | "expert";
  deliverables: string[];
  scarcityScore?: number;
}

interface EvalResult {
  equivalenceRatio: number;
  fairnessScore: number;
  laborUnitsA: number;
  laborUnitsB: number;
  scarcityAdjustedA: number;
  scarcityAdjustedB: number;
  recommendation: string;
  adjustmentSuggestions: string[];
}

const DEFAULT_SCOPE: TradeScope = {
  skill: "",
  category: "default",
  hours: 4,
  revisions: 2,
  complexity: "medium",
  deliverables: ["Final deliverable"],
  scarcityScore: 0.3,
};

const COMPLEXITY_LABELS = { low: "Low", medium: "Medium", high: "High", expert: "Expert" };
const CATEGORIES = ["motion-graphics", "ui-ux-design", "audio-engineering", "video-editing", "copywriting", "illustration", "photography", "social-media", "podcast-production", "graphic-design", "web-development", "default"];

function ScopeEditor({ scope, onChange, label, color }: {
  scope: TradeScope;
  onChange: (s: TradeScope) => void;
  label: string;
  color: string;
}) {
  const [newDeliverable, setNewDeliverable] = useState("");

  const addDeliverable = () => {
    if (!newDeliverable.trim()) return;
    onChange({ ...scope, deliverables: [...scope.deliverables, newDeliverable.trim()] });
    setNewDeliverable("");
  };

  return (
    <div className={`glass border ${color} rounded-2xl p-6 flex-1`}>
      <h3 className="font-bold text-xl mb-6 flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color.includes('violet') ? 'bg-violet-500' : 'bg-cyan-500'}`} />
        {label}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Skill / Service Name *</label>
          <input
            type="text"
            value={scope.skill}
            onChange={e => onChange({ ...scope, skill: e.target.value })}
            placeholder="e.g. Motion Graphics, Logo Design..."
            className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Hours of Work</label>
            <input
              type="number"
              min={0.5} max={200} step={0.5}
              value={scope.hours}
              onChange={e => onChange({ ...scope, hours: parseFloat(e.target.value) || 1 })}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Revision Rounds</label>
            <input
              type="number"
              min={0} max={10}
              value={scope.revisions}
              onChange={e => onChange({ ...scope, revisions: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Complexity Level</label>
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.entries(COMPLEXITY_LABELS) as [TradeScope["complexity"], string][]).map(([k, v]) => (
              <button
                key={k}
                onClick={() => onChange({ ...scope, complexity: k })}
                className={`py-2 rounded-lg text-xs font-semibold transition-all ${scope.complexity === k ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Supply Density (0=rare, 1=common)</label>
          <input
            type="range" min={0.01} max={1} step={0.01}
            value={scope.scarcityScore || 0.3}
            onChange={e => onChange({ ...scope, scarcityScore: parseFloat(e.target.value) })}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Rare skill</span><span>{((scope.scarcityScore || 0.3) * 100).toFixed(0)}%</span><span>Common</span>
          </div>
        </div>
        <div>
          <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Deliverables</label>
          <div className="space-y-2 mb-2">
            {scope.deliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-muted rounded-lg px-3 py-1.5">
                <span className="flex-1">{d}</span>
                <button onClick={() => onChange({ ...scope, deliverables: scope.deliverables.filter((_, j) => j !== i) })}>
                  <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDeliverable}
              onChange={e => setNewDeliverable(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addDeliverable()}
              placeholder="Add deliverable..."
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button onClick={addDeliverable} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TradePageContent() {
  const searchParams = useSearchParams();
  const [offerScope, setOfferScope] = useState<TradeScope>({ ...DEFAULT_SCOPE });
  const [requestScope, setRequestScope] = useState<TradeScope>({ ...DEFAULT_SCOPE });
  const [result, setResult] = useState<EvalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const evaluate = async () => {
    if (!offerScope.skill || !requestScope.skill) {
      setError("Please fill in both skill names.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/v1/evaluate-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerScope, requestScope }),
      });
      const json = await res.json();
      if (res.ok) setResult(json.data);
      else setError(json.error || "Evaluation failed");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fairnessPercent = result ? Math.round(result.fairnessScore * 100) : 0;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            <BarChart3 className="w-4 h-4" /> AI Value Equivalence Calculator
          </div>
          <h1 className="text-4xl font-black mb-3">Is Your Trade Fair?</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter both skill scopes and our LEU × MSI model scores the exchange parity — no cash required.
          </p>
        </div>

        {/* Scope editors */}
        <div className="flex flex-col lg:flex-row gap-6 mb-6">
          <ScopeEditor scope={offerScope} onChange={setOfferScope} label="Your Offering" color="border-violet-500/30" />
          <div className="flex items-center justify-center flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-muted border border-border flex items-center justify-center">
              <ArrowLeftRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <ScopeEditor scope={requestScope} onChange={setRequestScope} label="Their Offering" color="border-cyan-500/30" />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 mb-4 text-sm">
            <AlertCircle className="w-4 h-4" /> {error}
          </div>
        )}

        <button
          onClick={evaluate}
          disabled={loading}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:scale-100 shadow-lg shadow-primary/20 mb-8"
        >
          {loading ? "Calculating..." : "Calculate Trade Equivalence"}
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-slide-up">
            {/* Fairness gauge */}
            <div className="glass border border-border/50 rounded-3xl p-8 text-center">
              <div className="relative w-48 h-48 mx-auto mb-6">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="40" fill="none"
                    stroke={fairnessPercent >= 80 ? "#10b981" : fairnessPercent >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    strokeDasharray={`${fairnessPercent * 2.51} 251`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center rotate-0">
                  <span className={`text-4xl font-black ${getFairnessColor(result.fairnessScore)}`}>{fairnessPercent}%</span>
                  <span className="text-xs text-muted-foreground mt-1">Fairness</span>
                </div>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-3 ${fairnessPercent >= 80 ? 'bg-emerald-500/10 text-emerald-500' : fairnessPercent >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                {fairnessPercent >= 80 ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {getFairnessLabel(result.fairnessScore)}
              </div>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">{result.recommendation}</p>
            </div>

            {/* Score breakdown */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="glass border border-violet-500/20 rounded-2xl p-5">
                <h4 className="font-semibold mb-3 text-violet-400">Your Offering — Scores</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Labor Effort Units</span><span className="font-mono font-semibold">{result.laborUnitsA}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Scarcity-Adjusted TVS</span><span className="font-mono font-semibold">{result.scarcityAdjustedA}</span></div>
                </div>
              </div>
              <div className="glass border border-cyan-500/20 rounded-2xl p-5">
                <h4 className="font-semibold mb-3 text-cyan-400">Their Offering — Scores</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Labor Effort Units</span><span className="font-mono font-semibold">{result.laborUnitsB}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Scarcity-Adjusted TVS</span><span className="font-mono font-semibold">{result.scarcityAdjustedB}</span></div>
                </div>
              </div>
              <div className="glass border border-border/50 rounded-2xl p-5 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Equivalence Ratio</span>
                  <span className="text-2xl font-black font-mono">{result.equivalenceRatio}x</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {result.equivalenceRatio > 1 ? "Your offering is worth more. Consider reducing scope." : result.equivalenceRatio < 0.9 ? "Their offering is worth more. Consider adding scope." : "Balanced trade!"}
                </p>
              </div>
            </div>

            {result.adjustmentSuggestions.length > 0 && (
              <div className="glass border border-amber-500/20 rounded-2xl p-5">
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-400"><Info className="w-4 h-4" /> Adjustment Suggestions</h4>
                <ul className="space-y-2">
                  {result.adjustmentSuggestions.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-500 text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="text-center">
              <p className="text-muted-foreground text-sm mb-4">Happy with the balance? Generate a formal collaboration brief.</p>
              <a
                href="/workspace/new"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
              >
                <Zap className="w-4 h-4" /> Generate Collaboration Brief
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-muted-foreground">Loading...</div></div>}>
      <TradePageContent />
    </Suspense>
  );
}
