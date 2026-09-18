"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, Star, Clock, Zap, CheckCircle, Globe, ArrowRight, Briefcase, Award } from "lucide-react";
import { getAvailabilityBadge, formatRating } from "@/lib/utils";

interface Creator {
  id: string; name: string; username: string; bio: string; location: string;
  avatar_url: string; cover_url: string; hourly_rate_equiv: number;
  availability: string; response_time: string; completed_trades: number;
  review_count: number; average_rating: number; skill_credits: number;
  verified: boolean;
  skills?: Array<{ name: string; category: string; proficiency_level: string; years_experience: number; is_primary: boolean; }>;
  portfolio_items?: Array<{ id: string; title: string; description: string; category: string; tools_used: string; client_type: string; featured: boolean; }>;
  reviews?: Array<{ id: string; reviewer_name: string; comment: string; overall_rating: number; trade_quality: number; communication: number; timeliness: number; created_at: string; }>;
}

const PROFICIENCY_COLOR: Record<string, string> = {
  expert: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  advanced: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
};

export default function CreatorProfilePage() {
  const rawParams = useParams();
  const id = (Array.isArray(rawParams.id) ? rawParams.id[0] : rawParams.id) ?? '';
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"portfolio" | "skills" | "reviews">("portfolio");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/v1/creators/${id}`)
      .then(r => r.json())
      .then(d => { setCreator(d.data); setLoading(false); });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen px-4 py-12 max-w-5xl mx-auto animate-pulse">
      <div className="h-48 rounded-3xl bg-muted mb-6" />
      <div className="flex gap-6">
        <div className="w-28 h-28 rounded-full bg-muted -mt-14" />
        <div className="flex-1 space-y-3 pt-4">
          <div className="h-6 w-48 rounded bg-muted" />
          <div className="h-4 w-32 rounded bg-muted" />
        </div>
      </div>
    </div>
  );

  if (!creator) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Creator not found.</p>
    </div>
  );

  const primarySkill = creator.skills?.find(s => s.is_primary) || creator.skills?.[0];

  return (
    <div className="min-h-screen">
      {/* Cover */}
      <div className="h-56 md:h-72 bg-gradient-to-br from-violet-500/30 via-cyan-500/20 to-pink-500/20 relative overflow-hidden">
        {creator.cover_url && (
          <img src={creator.cover_url} alt="cover" className="w-full h-full object-cover opacity-40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80" />
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-20">
        {/* Profile header */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 mb-8 relative z-10">
          <div className="relative flex-shrink-0">
            <img
              src={creator.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`}
              alt={creator.name}
              className="w-28 h-28 rounded-2xl border-4 border-background bg-muted shadow-xl"
              onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${creator.name}`; }}
            />
            {creator.verified && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <CheckCircle className="w-4 h-4 text-primary-foreground" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="text-3xl font-black">{creator.name}</h1>
              {creator.verified && <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium w-fit">Verified</span>}
              <span className={`text-xs px-2 py-1 rounded-full border font-medium capitalize w-fit ${getAvailabilityBadge(creator.availability)}`}>{creator.availability}</span>
            </div>
            {primarySkill && <p className="text-primary font-semibold text-lg mb-1">{primarySkill.name}</p>}
            {creator.location && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" /> {creator.location}
              </div>
            )}
          </div>

          <Link
            href={`/trade?withCreator=${creator.id}`}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 w-fit"
          >
            <Zap className="w-4 h-4" /> Request Trade <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Avg Rating", value: formatRating(creator.average_rating), icon: Star, color: "text-amber-500" },
            { label: "Reviews", value: creator.review_count, icon: Award, color: "text-violet-500" },
            { label: "Trades Done", value: creator.completed_trades, icon: Briefcase, color: "text-cyan-500" },
            { label: "Response Time", value: creator.response_time, icon: Clock, color: "text-emerald-500" },
          ].map(stat => (
            <div key={stat.label} className="glass border border-border/50 rounded-2xl p-4 text-center">
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="glass border border-border/50 rounded-2xl p-6 mb-8">
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2"><Globe className="w-5 h-5 text-primary" /> About</h2>
          <p className="text-muted-foreground leading-relaxed">{creator.bio}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 gap-1">
          {(["portfolio", "skills", "reviews"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 -mb-px ${tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            >
              {t} {t === "portfolio" ? `(${creator.portfolio_items?.length || 0})` : t === "skills" ? `(${creator.skills?.length || 0})` : `(${creator.reviews?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Portfolio */}
        {tab === "portfolio" && (
          <div className="grid sm:grid-cols-2 gap-6">
            {(creator.portfolio_items || []).map(item => (
              <div key={item.id} className="gradient-border rounded-2xl p-5 hover:shadow-md transition-all">
                {item.featured && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium mb-3 inline-block">Featured</span>}
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-muted text-muted-foreground">{item.category}</span>
                  {item.tools_used?.split(', ').map(t => (
                    <span key={t} className="px-2 py-1 rounded-full bg-primary/5 text-primary border border-primary/10">{t}</span>
                  ))}
                </div>
                {item.client_type && <p className="text-xs text-muted-foreground mt-3">Client: {item.client_type}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {tab === "skills" && (
          <div className="grid sm:grid-cols-2 gap-4">
            {(creator.skills || []).map(skill => (
              <div key={skill.name} className="glass border border-border/50 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{skill.name}</span>
                    {skill.is_primary && <span className="text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary">Primary</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${PROFICIENCY_COLOR[skill.proficiency_level] || ''}`}>{skill.proficiency_level}</span>
                    <span className="text-xs text-muted-foreground">{skill.years_experience}y exp</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reviews */}
        {tab === "reviews" && (
          <div className="space-y-4">
            {(creator.reviews || []).length === 0 ? (
              <p className="text-center text-muted-foreground py-12">No reviews yet. Be the first to trade!</p>
            ) : (creator.reviews || []).map(review => (
              <div key={review.id} className="glass border border-border/50 rounded-2xl p-5">
                <div className="flex items-start gap-3 mb-3">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer_name}`} alt="" className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1">
                    <p className="font-semibold">{review.reviewer_name || "Anonymous"}</p>
                    <div className="flex gap-1 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(review.overall_rating) ? 'text-amber-500 fill-current' : 'text-muted-foreground/30'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span>Quality: {review.trade_quality}/5</span>
                  <span>Comms: {review.communication}/5</span>
                  <span>Time: {review.timeliness}/5</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
