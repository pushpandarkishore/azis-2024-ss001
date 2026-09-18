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

function ScopeEditor({
  scope,
  onChange,
  label,
  accentColor,
}: {
  scope: TradeScope;
  onChange: (s: TradeScope) => void;
  label: string;
  accentColor: "primary" | "secondary";
}) {
  const [newDeliverable, setNewDeliverable] = useState("");

  const addDeliverable = () => {
    if (!newDeliverable.trim()) return;
    onChange({ ...scope, deliverables: [...scope.deliverables, newDeliverable.trim()] });
    setNewDeliverable("");
  };

  const accentHex = accentColor === "primary" ? "#A34835" : "#8C6D58";

  return (
    <div className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-7 sm:p-8 flex-1 space-y-6">
      <h3 className="font-serif text-2xl font-light text-[#1C1917] flex items-center gap-3">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accentHex }} />
        {label}
      </h3>

      <div className="space-y-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
            Craft Discipline / Service *
          </label>
          <input
            type="text"
            value={scope.skill}
            onChange={(e) => onChange({ ...scope, skill: e.target.value })}
            placeholder="e.g. Brand Identity, Sound Mastering..."
            className="w-full px-4 py-3 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] placeholder:text-[#8E8780] text-sm focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
              Hours of Effort
            </label>
            <input
              type="number"
              min={0.5}
              max={200}
              step={0.5}
              value={scope.hours}
              onChange={(e) => onChange({ ...scope, hours: parseFloat(e.target.value) || 1 })}
              className="w-full px-4 py-3 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] font-mono text-sm focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
              Revision Rounds
            </label>
            <input
              type="number"
              min={0}
              max={10}
              value={scope.revisions}
              onChange={(e) => onChange({ ...scope, revisions: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] font-mono text-sm focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
            Craft Complexity Level
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(Object.entries(COMPLEXITY_LABELS) as [TradeScope["complexity"], string][]).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => onChange({ ...scope, complexity: k })}
                className={`py-2.5 rounded-[12px] text-xs font-semibold transition-all duration-200 ${
                  scope.complexity === k
                    ? "bg-[#A34835] text-white shadow-xs"
                    : "bg-[#F5F2EC] text-[#68625D] border border-[#DCD5C9] hover:border-[#8C6D58] hover:text-[#1C1917]"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
            Market Scarcity (0 = Ubiquitous, 1 = Bespoke / Rare)
          </label>
          <input
            type="range"
            min={0.01}
            max={1}
            step={0.01}
            value={scope.scarcityScore || 0.3}
            onChange={(e) => onChange({ ...scope, scarcityScore: parseFloat(e.target.value) })}
            className="w-full accent-[#A34835] cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[#8E8780] font-mono mt-1">
            <span>Ubiquitous</span>
            <span className="text-[#8C6D58] font-semibold">{((scope.scarcityScore || 0.3) * 100).toFixed(0)}%</span>
            <span>Bespoke / Rare</span>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
            Deliverable Artifacts
          </label>
          <div className="space-y-2 mb-3">
            {scope.deliverables.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs bg-[#F5F2EC] border border-[#E7E2D9] rounded-[12px] px-3.5 py-2">
                <span className="flex-1 text-[#1C1917]">{d}</span>
                <button
                  type="button"
                  onClick={() => onChange({ ...scope, deliverables: scope.deliverables.filter((_, j) => j !== i) })}
                  className="text-[#8E8780] hover:text-[#A83C3C] transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDeliverable}
              onChange={(e) => setNewDeliverable(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addDeliverable()}
              placeholder="Add deliverable..."
              className="flex-1 px-4 py-2.5 rounded-[14px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] text-xs focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={addDeliverable}
              className="p-2.5 rounded-[14px] bg-[#A34835] text-white hover:bg-[#8C3B2A] transition-all duration-200 shadow-xs"
            >
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
      setError("Please specify the craft disciplines for both parties.");
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
      else setError(json.error || "Equivalence calibration failed");
    } catch {
      setError("Network connection issue. Please retry calibration.");
    } finally {
      setLoading(false);
    }
  };

  const fairnessPercent = result ? Math.round(result.fairnessScore * 100) : 0;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto bg-[#FBF9F5] text-[#1C1917]">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8C6D58]/10 border border-[#8C6D58]/20 text-[#8C6D58] text-xs tracking-wider uppercase font-semibold mb-4">
          <BarChart3 className="w-3.5 h-3.5" />
          AI Parity Engine &middot; Labor Equivalence Calibration
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-[#1C1917] tracking-tight leading-tight">
          Is Your Barter Trade Balanced?
        </h1>
        <p className="text-[#68625D] text-base sm:text-lg max-w-2xl mx-auto mt-4 font-light leading-relaxed">
          Define mutual project scopes. Our algorithmic LEU × MSI engine calculates value equivalence and suggests adjustments without monetary friction.
        </p>
      </div>

      {/* Scope Editors Grid */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-stretch">
        <ScopeEditor
          scope={offerScope}
          onChange={setOfferScope}
          label="Your Creative Scope"
          accentColor="primary"
        />
        <div className="flex items-center justify-center shrink-0 self-center">
          <div className="w-12 h-12 rounded-full bg-white border border-[#DCD5C9] flex items-center justify-center text-[#8C6D58] shadow-xs">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
        </div>
        <ScopeEditor
          scope={requestScope}
          onChange={setRequestScope}
          label="Partner's Creative Scope"
          accentColor="secondary"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2.5 text-[#A83C3C] bg-[#A83C3C]/10 border border-[#A83C3C]/25 rounded-[16px] px-5 py-3.5 mb-6 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary Action Button */}
      <button
        onClick={evaluate}
        disabled={loading}
        className="w-full py-4 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:scale-100 shadow-[0_4px_14px_rgba(163,72,53,0.25)] mb-12"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 bg-white/30 rounded-full animate-pulse" />
            <span>Calibrating Equivalence Ratio...</span>
          </div>
        ) : (
          <span>Calculate Barter Equivalence</span>
        )}
      </button>

      {/* Results Section */}
      {result && (
        <div className="space-y-8 animate-slide-up">
          {/* Gauge Card */}
          <div className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-10 text-center">
            <div className="relative w-44 h-44 mx-auto mb-6">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#F3EFEA" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={fairnessPercent >= 80 ? "#3D724D" : fairnessPercent >= 60 ? "#B47228" : "#A83C3C"}
                  strokeWidth="8"
                  strokeDasharray={`${fairnessPercent * 2.51} 251`}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-4xl font-light text-[#1C1917]">{fairnessPercent}%</span>
                <span className="text-[10px] uppercase tracking-widest text-[#8E8780] mt-1 font-mono">Parity</span>
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 border ${
                fairnessPercent >= 80
                  ? "bg-[#3D724D]/10 text-[#3D724D] border-[#3D724D]/25"
                  : fairnessPercent >= 60
                  ? "bg-[#B47228]/10 text-[#B47228] border-[#B47228]/25"
                  : "bg-[#A83C3C]/10 text-[#A83C3C] border-[#A83C3C]/25"
              }`}
            >
              {fairnessPercent >= 80 ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {getFairnessLabel(result.fairnessScore)}
            </div>
            <p className="text-[#68625D] text-sm max-w-lg mx-auto font-light leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          {/* Metric Breakdown */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-[24px] border border-[#E7E2D9] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#A34835] mb-4">
                Your Scope Labor Metrics
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#68625D] font-light">Labor Effort Units (LEU)</span>
                  <span className="font-mono text-[#1C1917] font-medium">{result.laborUnitsA}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68625D] font-light">Scarcity-Adjusted TVS</span>
                  <span className="font-mono text-[#1C1917] font-medium">{result.scarcityAdjustedA}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#E7E2D9] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#8C6D58] mb-4">
                Partner Scope Labor Metrics
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#68625D] font-light">Labor Effort Units (LEU)</span>
                  <span className="font-mono text-[#1C1917] font-medium">{result.laborUnitsB}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#68625D] font-light">Scarcity-Adjusted TVS</span>
                  <span className="font-mono text-[#1C1917] font-medium">{result.scarcityAdjustedB}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#E7E2D9] bg-white p-6 sm:col-span-2 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#8E8780]">Equivalence Ratio</span>
                <span className="font-mono text-3xl font-light text-[#1C1917]">{result.equivalenceRatio}x</span>
              </div>
              <p className="text-xs text-[#68625D] font-light mt-2 leading-relaxed">
                {result.equivalenceRatio > 1
                  ? "Your scope produces higher calibrated labor value. Consider adjusting deliverables or hours."
                  : result.equivalenceRatio < 0.9
                  ? "Partner's scope produces higher calibrated labor value. Consider adding deliverables to reach parity."
                  : "Balanced barter trade! This exchange demonstrates high reciprocity across both disciplines."}
              </p>
            </div>
          </div>

          {result.adjustmentSuggestions.length > 0 && (
            <div className="rounded-[24px] border border-[#B47228]/25 bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#B47228] mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Algorithmic Parity Recommendations
              </h4>
              <ul className="space-y-2.5">
                {result.adjustmentSuggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-[#68625D] font-light leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-[#B47228]/15 text-[#B47228] font-mono text-[11px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {i + 1}
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-center pt-4">
            <p className="text-[#68625D] text-xs font-light mb-4">
              Satisfied with the exchange equilibrium? Transition into an official binding brief.
            </p>
            <a
              href="/workspace/new"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(163,72,53,0.25)]"
            >
              <Zap className="w-4 h-4" />
              <span>Generate Collaboration Brief</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TradePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-[#8E8780] text-xs uppercase tracking-widest font-mono">Loading Parity Engine...</div>
        </div>
      }
    >
      <TradePageContent />
    </Suspense>
  );
}
