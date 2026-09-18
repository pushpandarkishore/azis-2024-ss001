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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto space-y-8 bg-[#FBF9F5]">
      <div className="h-64 rounded-[24px] bg-white animate-pulse border border-[#E7E2D9] shadow-xs" />
      <div className="flex gap-6 items-center">
        <div className="w-28 h-28 rounded-full bg-white animate-pulse border-4 border-[#FBF9F5]" />
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-white rounded-[12px] w-48 animate-pulse border border-[#E7E2D9]" />
          <div className="h-4 bg-white rounded-[12px] w-32 animate-pulse border border-[#E7E2D9]" />
        </div>
      </div>
    </div>
  );

  if (!creator) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FBF9F5]">
      <p className="text-[#68625D] font-light text-base">Creator profile not found.</p>
    </div>
  );

  const primarySkill = creator.skills?.find(s => s.is_primary) || creator.skills?.[0];

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#1C1917]">
      {/* Cover */}
      <div className="h-60 sm:h-72 md:h-80 bg-[#EFEBE3] border-b border-[#E7E2D9] relative overflow-hidden">
        {creator.cover_url ? (
          <img src={creator.cover_url} alt="cover" className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#F5F2EC] via-[#EFEBE3] to-[#E7E2D9]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FBF9F5] via-transparent to-transparent" />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-16 sm:-mt-20 mb-10 relative z-10">
          <div className="relative shrink-0">
            <img
              src={creator.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`}
              alt={creator.name}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-[24px] border-4 border-[#FBF9F5] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] object-cover"
              onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${creator.name}`; }}
            />
            {creator.verified && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#8C6D58] text-white flex items-center justify-center shadow-md">
                <CheckCircle className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1917] tracking-tight">
                {creator.name}
              </h1>
              {creator.verified && (
                <span className="text-[11px] px-3 py-0.5 rounded-full bg-[#8C6D58]/10 text-[#8C6D58] border border-[#8C6D58]/20 uppercase tracking-wider font-semibold w-fit">
                  Verified Practitioner
                </span>
              )}
              <span className="text-[11px] px-3 py-0.5 rounded-full border border-[#3D724D]/30 bg-[#3D724D]/10 text-[#3D724D] capitalize font-medium w-fit">
                {creator.availability}
              </span>
            </div>
            {primarySkill && (
              <p className="text-[#A34835] text-base sm:text-lg font-light mb-1.5">
                {primarySkill.name}
              </p>
            )}
            {creator.location && (
              <div className="flex items-center gap-1.5 text-[#68625D] text-xs font-light">
                <MapPin className="w-3.5 h-3.5 text-[#8C6D58]" />
                <span>{creator.location}</span>
              </div>
            )}
          </div>

          <Link
            href={`/trade?withCreator=${creator.id}`}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-[16px] bg-[#A34835] text-white font-semibold uppercase tracking-wider text-xs hover:bg-[#8C3B2A] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_14px_rgba(163,72,53,0.25)] shrink-0 self-start md:self-auto"
          >
            <Zap className="w-4 h-4" />
            <span>Request Barter Swap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-10">
          {[
            { label: "Editorial Rating", value: formatRating(creator.average_rating), icon: Star, color: "text-[#B47228]" },
            { label: "Verified Reviews", value: creator.review_count, icon: Award, color: "text-[#8C6D58]" },
            { label: "Trades Executed", value: creator.completed_trades, icon: Briefcase, color: "text-[#3D724D]" },
            { label: "Response Window", value: creator.response_time, icon: Clock, color: "text-[#68625D]" },
          ].map(stat => (
            <div key={stat.label} className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-6 text-center hover:-translate-y-1 transition-all duration-200">
              <stat.icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <p className="font-mono text-2xl font-light text-[#1C1917]">{stat.value}</p>
              <p className="text-[11px] uppercase tracking-widest text-[#8E8780] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Bio */}
        <div className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8 sm:p-10 mb-10">
          <h2 className="font-serif text-2xl font-light text-[#1C1917] mb-4 flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#8C6D58]" />
            About the Practitioner
          </h2>
          <p className="text-[#68625D] text-sm leading-relaxed font-light">{creator.bio}</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E7E2D9] mb-10 gap-2">
          {(["portfolio", "skills", "reviews"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 border-b-2 -mb-px ${
                tab === t
                  ? "border-[#A34835] text-[#1C1917]"
                  : "border-transparent text-[#8E8780] hover:text-[#68625D]"
              }`}
            >
              {t} {t === "portfolio" ? `(${creator.portfolio_items?.length || 0})` : t === "skills" ? `(${creator.skills?.length || 0})` : `(${creator.reviews?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Portfolio */}
        {tab === "portfolio" && (
          <div className="grid sm:grid-cols-2 gap-6">
            {(creator.portfolio_items || []).map(item => (
              <div
                key={item.id}
                className="rounded-[24px] border border-[#E7E2D9] bg-white p-7 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-200 space-y-3"
              >
                {item.featured && (
                  <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-0.5 rounded-full bg-[#8C6D58]/10 text-[#8C6D58] border border-[#8C6D58]/20 mb-2 inline-block">
                    Featured Artifact
                  </span>
                )}
                <h3 className="font-serif text-2xl font-light text-[#1C1917]">{item.title}</h3>
                <p className="text-[#68625D] text-xs font-light leading-relaxed">{item.description}</p>
                <div className="flex flex-wrap gap-2 pt-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-[#F5F2EC] border border-[#DCD5C9] text-[#68625D]">
                    {item.category}
                  </span>
                  {item.tools_used?.split(', ').map(t => (
                    <span key={t} className="px-3 py-1 rounded-full bg-white border border-[#E7E2D9] text-[#8C6D58]">
                      {t}
                    </span>
                  ))}
                </div>
                {item.client_type && (
                  <p className="text-[11px] text-[#8E8780] font-light mt-3">Engagement: {item.client_type}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {tab === "skills" && (
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {(creator.skills || []).map(skill => (
              <div
                key={skill.name}
                className="rounded-[20px] border border-[#E7E2D9] bg-white p-5 flex items-center gap-4 hover:-translate-y-1 transition-all duration-200 shadow-xs"
              >
                <div className="w-10 h-10 rounded-[14px] bg-[#F5F2EC] border border-[#DCD5C9] flex items-center justify-center shrink-0 text-[#8C6D58]">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-base font-normal text-[#1C1917]">{skill.name}</span>
                    {skill.is_primary && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#A34835]/15 text-[#A34835] uppercase font-mono font-medium">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#DCD5C9] bg-[#F5F2EC] text-[#68625D] capitalize">
                      {skill.proficiency_level}
                    </span>
                    <span className="text-xs text-[#8E8780] font-mono">{skill.years_experience}y experience</span>
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
              <p className="text-center text-[#8E8780] font-light py-16">No editorial reviews logged yet. Be the first to trade!</p>
            ) : (creator.reviews || []).map(review => (
              <div
                key={review.id}
                className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-7 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${review.reviewer_name}`}
                    alt=""
                    className="w-10 h-10 rounded-full bg-[#F5F2EC] border border-[#DCD5C9]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[#1C1917] text-sm">{review.reviewer_name || "Anonymous"}</p>
                    <div className="flex gap-1 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.round(review.overall_rating)
                              ? "text-[#B47228] fill-[#B47228]"
                              : "text-[#DCD5C9]"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs font-mono text-[#8E8780]">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-[#68625D] text-xs font-light leading-relaxed">{review.comment}</p>
                <div className="flex gap-5 pt-2 text-[11px] font-mono text-[#8E8780] border-t border-[#E7E2D9]">
                  <span>Craft: {review.trade_quality}/5</span>
                  <span>Communication: {review.communication}/5</span>
                  <span>Timeliness: {review.timeliness}/5</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
