"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Clock, Zap, FileText, AlertCircle, Users, Calendar, Shield } from "lucide-react";

interface Milestone {
  id: string; title: string; description: string;
  assignedTo: string; dueOffsetDays: number; skillCredits: number; deliverables: string[];
}
interface BriefContent {
  title: string; summary: string;
  parties: { creatorA: { name: string; role: string; responsibilities: string[] }; creatorB: { name: string; role: string; responsibilities: string[] } };
  milestones: Milestone[];
  deliverables: { fromA: string[]; fromB: string[] };
  rights: { licenseType: string; territory: string; creditRequired: boolean; exclusivityPeriodDays: number };
  revisionPolicy: { maxRoundsA: number; maxRoundsB: number; feedbackWindowHours: number };
  totalDurationDays: number; skillCreditsEscrowed: number; tags: string[];
}
interface Brief {
  id: string; title: string; status: string; content: BriefContent;
  creator_a_id: string; creator_b_id: string; created_at: string; expires_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

export default function WorkspacePage() {
  const rawParams = useParams();
  const briefId = (Array.isArray(rawParams.briefId) ? rawParams.briefId[0] : rawParams.briefId) ?? 'new';
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatorMode, setGeneratorMode] = useState(briefId === "new");
  const [creatorAId, setCreatorAId] = useState("");
  const [creatorBId, setCreatorBId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [creators, setCreators] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (briefId !== "new") {
      fetch(`/api/v1/briefs/${briefId}`)
        .then(r => r.json())
        .then(d => { setBrief(d.data); setLoading(false); });
    } else {
      setLoading(false);
      fetch("/api/v1/creators?limit=50").then(r => r.json()).then(d => setCreators(d.data || []));
    }
  }, [briefId]);

  const generateBrief = async () => {
    if (!creatorAId || !creatorBId) { setError("Select both creators"); return; }
    if (creatorAId === creatorBId) { setError("Select two different creators"); return; }
    setError(""); setGenerating(true);
    try {
      const res = await fetch("/api/v1/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorAId, creatorBId }),
      });
      const json = await res.json();
      if (res.ok) { setBrief(json.data.brief ? { ...json.data.brief, content: json.data.content } : null); setGeneratorMode(false); }
      else setError(json.error || "Generation failed");
    } finally { setGenerating(false); }
  };

  if (loading) return (
    <div className="min-h-screen px-4 py-12 max-w-4xl mx-auto animate-pulse space-y-4">
      <div className="h-8 w-64 bg-muted rounded" />
      <div className="h-48 bg-muted rounded-2xl" />
      <div className="h-64 bg-muted rounded-2xl" />
    </div>
  );

  if (generatorMode || !brief) return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
            <FileText className="w-4 h-4" /> Smart Brief Generator
          </div>
          <h1 className="text-4xl font-black mb-3">Generate Collaboration Brief</h1>
          <p className="text-muted-foreground">AI creates a structured agreement with milestones, deliverables, and licensing terms.</p>
        </div>
        <div className="glass border border-border/50 rounded-3xl p-8 space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Creator A (Party 1)</label>
            <select
              value={creatorAId}
              onChange={e => setCreatorAId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
            >
              <option value="">Select a creator...</option>
              {creators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Creator B (Party 2)</label>
            <select
              value={creatorBId}
              onChange={e => setCreatorBId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
            >
              <option value="">Select a creator...</option>
              {creators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          {error && (
            <div className="flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3 text-sm">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          <button
            onClick={generateBrief}
            disabled={generating}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-60 shadow-lg shadow-primary/20"
          >
            {generating ? "Generating Brief…" : "Generate Collaboration Brief"}
          </button>
          <p className="text-xs text-muted-foreground text-center">AI-generated with Zod schema validation. You&apos;ll review before signing.</p>
        </div>
      </div>
    </div>
  );

  const content: BriefContent = typeof brief.content === "string" ? JSON.parse(brief.content) : brief.content;

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-black">{content?.title || brief.title}</h1>
              <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize ${STATUS_COLORS[brief.status] || ''}`}>{brief.status}</span>
            </div>
            <p className="text-muted-foreground">{content?.summary}</p>
          </div>
        </div>

        {/* Parties */}
        {content?.parties && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[{ party: content.parties.creatorA, side: "Party A", color: "border-violet-500/30 bg-violet-500/5" },
              { party: content.parties.creatorB, side: "Party B", color: "border-cyan-500/30 bg-cyan-500/5" }].map(({ party, side, color }) => (
              <div key={side} className={`rounded-2xl border ${color} p-5`}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground font-medium">{side}</span>
                </div>
                <p className="font-bold text-lg">{party.name}</p>
                <p className="text-primary text-sm mb-3">{party.role}</p>
                <ul className="space-y-1">
                  {party.responsibilities.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Milestones */}
        {content?.milestones && (
          <div className="glass border border-border/50 rounded-2xl p-6">
            <h2 className="font-bold text-xl mb-5 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Milestones ({content.milestones.length})
            </h2>
            <div className="space-y-4">
              {content.milestones.map((ms, i) => (
                <div key={ms.id || i} className="flex items-start gap-4 p-4 rounded-xl bg-muted/40 border border-border/30">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary text-sm font-bold">{i + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{ms.title}</h3>
                      <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground capitalize">{ms.assignedTo}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{ms.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground"><Clock className="w-3 h-3" /> Day {ms.dueOffsetDays}</span>
                      <span className="flex items-center gap-1 text-primary"><Zap className="w-3 h-3" /> {ms.skillCredits} SC</span>
                    </div>
                    {ms.deliverables?.length > 0 && (
                      <ul className="mt-2 space-y-0.5">
                        {ms.deliverables.map((d: string, j: number) => (
                          <li key={j} className="text-xs text-muted-foreground flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" /> {d}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Rights & Policy */}
        {content?.rights && (
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass border border-border/50 rounded-2xl p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Rights & Licensing</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">License Type</span><span className="capitalize font-medium">{content.rights.licenseType}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Territory</span><span className="font-medium">{content.rights.territory}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Credit Required</span><span className="font-medium">{content.rights.creditRequired ? "Yes" : "No"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Exclusivity</span><span className="font-medium">{content.rights.exclusivityPeriodDays} days</span></div>
              </div>
            </div>
            <div className="glass border border-border/50 rounded-2xl p-5">
              <h3 className="font-bold mb-3 flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /> Escrow & Revisions</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Total Escrowed</span><span className="font-medium">{content.skillCreditsEscrowed} SC</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{content.totalDurationDays} days</span></div>
                {content.revisionPolicy && <>
                  <div className="flex justify-between"><span className="text-muted-foreground">Revisions A</span><span className="font-medium">{content.revisionPolicy.maxRoundsA}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Revisions B</span><span className="font-medium">{content.revisionPolicy.maxRoundsB}</span></div>
                </>}
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {content?.tags && (
          <div className="flex flex-wrap gap-2">
            {content.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{tag}</span>
            ))}
          </div>
        )}

        <div className="text-center text-xs text-muted-foreground border-t border-border pt-6">
          Brief generated by SkillSwap AI · Zod-validated · AZIS-UXE4MN
        </div>
      </div>
    </div>
  );
}
