"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { CheckCircle, Clock, Zap, FileText, AlertCircle, Users, Calendar, Shield } from "lucide-react";

interface Milestone {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueOffsetDays: number;
  skillCredits: number;
  deliverables: string[];
}

interface BriefContent {
  title: string;
  summary: string;
  parties: {
    creatorA: { name: string; role: string; responsibilities: string[] };
    creatorB: { name: string; role: string; responsibilities: string[] };
  };
  milestones: Milestone[];
  deliverables: { fromA: string[]; fromB: string[] };
  rights: { licenseType: string; territory: string; creditRequired: boolean; exclusivityPeriodDays: number };
  revisionPolicy: { maxRoundsA: number; maxRoundsB: number; feedbackWindowHours: number };
  totalDurationDays: number;
  skillCreditsEscrowed: number;
  tags: string[];
}

interface Brief {
  id: string;
  title: string;
  status: string;
  content: BriefContent;
  creator_a_id: string;
  creator_b_id: string;
  created_at: string;
  expires_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-[#B47228]/10 text-[#B47228] border-[#B47228]/25",
  active: "bg-[#3D724D]/10 text-[#3D724D] border-[#3D724D]/25",
  completed: "bg-[#8C6D58]/10 text-[#8C6D58] border-[#8C6D58]/25",
};

export default function WorkspacePage() {
  const rawParams = useParams();
  const briefId = (Array.isArray(rawParams.briefId) ? rawParams.briefId[0] : rawParams.briefId) ?? "new";
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
        .then((r) => r.json())
        .then((d) => {
          setBrief(d.data);
          setLoading(false);
        });
    } else {
      setLoading(false);
      fetch("/api/v1/creators?limit=50")
        .then((r) => r.json())
        .then((d) => setCreators(d.data || []));
    }
  }, [briefId]);

  const generateBrief = async () => {
    if (!creatorAId || !creatorBId) {
      setError("Please select both participating creators.");
      return;
    }
    if (creatorAId === creatorBId) {
      setError("Please select two distinct creators for the brief.");
      return;
    }
    setError("");
    setGenerating(true);
    try {
      const res = await fetch("/api/v1/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorAId, creatorBId }),
      });
      const json = await res.json();
      if (res.ok) {
        setBrief(json.data.brief ? { ...json.data.brief, content: json.data.content } : null);
        setGeneratorMode(false);
      } else {
        setError(json.error || "Brief generation failed");
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto space-y-6 bg-[#FBF9F5]">
        <div className="h-6 w-48 bg-white rounded-[12px] animate-pulse border border-[#E7E2D9]" />
        <div className="h-44 bg-white rounded-[24px] animate-pulse border border-[#E7E2D9]" />
        <div className="h-60 bg-white rounded-[24px] animate-pulse border border-[#E7E2D9]" />
      </div>
    );
  }

  if (generatorMode || !brief) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto bg-[#FBF9F5] text-[#1C1917]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8C6D58]/10 border border-[#8C6D58]/20 text-[#8C6D58] text-xs tracking-wider uppercase font-semibold mb-4">
              <FileText className="w-3.5 h-3.5" />
              AI Collaboration Brief Protocol
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1917] tracking-tight leading-tight">
              Draft Collaboration Accord
            </h1>
            <p className="text-[#68625D] text-sm sm:text-base mt-2 font-light leading-relaxed">
              Synthesize an editorial bilateral agreement complete with milestone schedules, deliverable expectations, and intellectual licensing parameters.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-10 space-y-6">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
                Creator A (Party 1)
              </label>
              <select
                value={creatorAId}
                onChange={(e) => setCreatorAId(e.target.value)}
                className="w-full px-4 py-3.5 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] text-sm focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
              >
                <option value="">Select a registered creator...</option>
                {creators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
                Creator B (Party 2)
              </label>
              <select
                value={creatorBId}
                onChange={(e) => setCreatorBId(e.target.value)}
                className="w-full px-4 py-3.5 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] text-sm focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
              >
                <option value="">Select a registered creator...</option>
                {creators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[#A83C3C] bg-[#A83C3C]/10 border border-[#A83C3C]/25 rounded-[16px] px-4 py-3 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={generateBrief}
              disabled={generating}
              className="w-full py-4 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-[0_4px_14px_rgba(163,72,53,0.25)]"
            >
              {generating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 bg-white/30 rounded-full animate-pulse" />
                  <span>Synthesizing Legal & Creative Accord...</span>
                </div>
              ) : (
                <span>Generate Collaboration Accord</span>
              )}
            </button>
            <p className="text-[11px] text-[#8E8780] text-center font-light">
              Calibrated by SkillSwap AI with strict Zod schema compliance before mutual signing.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const content: BriefContent = typeof brief.content === "string" ? JSON.parse(brief.content) : brief.content;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto bg-[#FBF9F5] text-[#1C1917]">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#E7E2D9] pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1C1917] tracking-tight">
                {content?.title || brief.title}
              </h1>
              <span
                className={`text-[11px] px-3 py-0.5 rounded-full border uppercase tracking-wider font-mono ${
                  STATUS_COLORS[brief.status] || "bg-[#F5F2EC] text-[#68625D] border-[#DCD5C9]"
                }`}
              >
                {brief.status}
              </span>
            </div>
            <p className="text-[#68625D] text-sm font-light leading-relaxed">{content?.summary}</p>
          </div>
        </div>

        {/* Parties */}
        {content?.parties && (
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { party: content.parties.creatorA, side: "Party A", accent: "#A34835" },
              { party: content.parties.creatorB, side: "Party B", accent: "#8C6D58" },
            ].map(({ party, side, accent }) => (
              <div
                key={side}
                className="rounded-[24px] border border-[#E7E2D9] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-3"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold" style={{ color: accent }}>
                  <Users className="w-4 h-4" />
                  <span>{side}</span>
                </div>
                <p className="font-serif text-xl font-normal text-[#1C1917]">{party.name}</p>
                <p className="text-xs text-[#68625D] font-light">{party.role}</p>
                <ul className="space-y-1.5 pt-2 border-t border-[#E7E2D9]">
                  {party.responsibilities.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-[#68625D] font-light leading-relaxed">
                      <CheckCircle className="w-3.5 h-3.5 text-[#3D724D] shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Milestones */}
        {content?.milestones && (
          <div className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-7 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl font-light text-[#1C1917] flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#8C6D58]" />
              Scheduled Milestones ({content.milestones.length})
            </h2>
            <div className="space-y-4">
              {content.milestones.map((ms, i) => (
                <div
                  key={ms.id || i}
                  className="flex items-start gap-4 p-5 rounded-[16px] bg-[#FAF8F5] border border-[#E7E2D9]"
                >
                  <div className="w-8 h-8 rounded-full bg-white border border-[#DCD5C9] flex items-center justify-center shrink-0 text-[#1C1917] text-xs font-mono">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h3 className="font-serif text-base font-normal text-[#1C1917]">{ms.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-[10px] bg-white border border-[#DCD5C9] text-[#68625D] uppercase font-mono">
                        {ms.assignedTo}
                      </span>
                    </div>
                    <p className="text-xs text-[#68625D] font-light mb-3 leading-relaxed">{ms.description}</p>
                    <div className="flex flex-wrap gap-3 text-xs font-mono text-[#8E8780]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#8C6D58]" /> Day {ms.dueOffsetDays}
                      </span>
                      <span className="flex items-center gap-1 text-[#A34835] font-semibold">
                        <Zap className="w-3.5 h-3.5" /> {ms.skillCredits} SC
                      </span>
                    </div>
                    {ms.deliverables?.length > 0 && (
                      <ul className="mt-3 space-y-1 pt-2 border-t border-[#E7E2D9]">
                        {ms.deliverables.map((d: string, j: number) => (
                          <li key={j} className="text-xs text-[#68625D] font-light flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#A34835] shrink-0" />
                            <span>{d}</span>
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

        {/* Rights & Licensing */}
        {content?.rights && (
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-7 space-y-4">
              <h3 className="font-serif text-xl font-light text-[#1C1917] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#8C6D58]" />
                Licensing & Attribution
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-[#E7E2D9] pb-2">
                  <span className="text-[#8E8780]">License Classification</span>
                  <span className="capitalize font-mono text-[#1C1917]">{content.rights.licenseType}</span>
                </div>
                <div className="flex justify-between border-b border-[#E7E2D9] pb-2">
                  <span className="text-[#8E8780]">Territory</span>
                  <span className="font-mono text-[#1C1917]">{content.rights.territory}</span>
                </div>
                <div className="flex justify-between border-b border-[#E7E2D9] pb-2">
                  <span className="text-[#8E8780]">Attribution Mandate</span>
                  <span className="font-mono text-[#1C1917]">{content.rights.creditRequired ? "Yes" : "No"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E8780]">Exclusivity Window</span>
                  <span className="font-mono text-[#1C1917]">{content.rights.exclusivityPeriodDays} days</span>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-7 space-y-4">
              <h3 className="font-serif text-xl font-light text-[#1C1917] flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#A34835]" />
                Escrow & Revision Policy
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-[#E7E2D9] pb-2">
                  <span className="text-[#8E8780]">Total Escrowed</span>
                  <span className="font-mono text-[#A34835] font-semibold">{content.skillCreditsEscrowed} SC</span>
                </div>
                <div className="flex justify-between border-b border-[#E7E2D9] pb-2">
                  <span className="text-[#8E8780]">Total Project Duration</span>
                  <span className="font-mono text-[#1C1917]">{content.totalDurationDays} days</span>
                </div>
                {content.revisionPolicy && (
                  <>
                    <div className="flex justify-between border-b border-[#E7E2D9] pb-2">
                      <span className="text-[#8E8780]">Revisions Party A</span>
                      <span className="font-mono text-[#1C1917]">{content.revisionPolicy.maxRoundsA} rounds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8E8780]">Revisions Party B</span>
                      <span className="font-mono text-[#1C1917]">{content.revisionPolicy.maxRoundsB} rounds</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tags */}
        {content?.tags && (
          <div className="flex flex-wrap gap-2 pt-2">
            {content.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-3.5 py-1 rounded-full bg-white border border-[#DCD5C9] text-[#68625D] font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="text-center text-xs text-[#8E8780] border-t border-[#E7E2D9] pt-8 font-mono">
          Brief calibrated by SkillSwap AI &middot; Zod-validated &middot; AZIS-2024-SS001
        </div>
      </div>
    </div>
  );
}
