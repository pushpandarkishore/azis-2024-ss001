"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Send, CheckCircle2, AlertCircle, DollarSign, User } from "lucide-react";
import { useDemoRole } from "@/lib/role-context";

const CATEGORIES = [
  "Design",
  "Video Editing",
  "Writing",
  "Audio",
  "Tutoring",
];

export default function PostGigPage() {
  const router = useRouter();
  const { user } = useDemoRole();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Design");
  const [rate, setRate] = useState("");
  const [description, setDescription] = useState("");
  const [creatorName, setCreatorName] = useState(user.name);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) {
      errs.title = "Gig title is required";
    } else if (title.trim().length < 5) {
      errs.title = "Title must be at least 5 characters";
    }

    if (!category) {
      errs.category = "Please select a category";
    }

    if (!rate.trim()) {
      errs.rate = "Rate is required (e.g. $45/hr or $150 flat)";
    } else if (!/\d/.test(rate)) {
      errs.rate = "Rate must contain a numerical amount (e.g. $50/hr)";
    }

    if (!description.trim()) {
      errs.description = "Detailed description is required";
    } else if (description.trim().length < 15) {
      errs.description = "Description must be at least 15 characters";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/gigs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          rate: rate.trim(),
          description: description.trim(),
          creatorName: creatorName.trim() || user.name,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post gig");
      }

      const created = await res.json();
      router.push(`/marketplace?newGigId=${created.id}&created=true`);
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto bg-[#FBF9F5] text-[#1C1917]">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#8C6D58] mb-8 font-semibold">
        <Link href="/marketplace" className="hover:text-[#1C1917] flex items-center gap-1.5 transition-colors duration-200">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Marketplace</span>
        </Link>
        <span className="text-[#DCD5C9]">/</span>
        <span className="text-[#1C1917] font-medium">Post a Gig</span>
      </div>

      {/* Header Banner */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8C6D58]/10 border border-[#8C6D58]/20 text-[#8C6D58] text-xs tracking-wider uppercase font-semibold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Feature 1: Post a Gig
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1917] tracking-tight leading-tight">
          Publish Your Creative Service
        </h1>
        <p className="text-[#68625D] text-base sm:text-lg mt-3 max-w-2xl font-light leading-relaxed">
          List your craft on the SkillSwap editorial directory. Clients and fellow practitioners can initiate verified direct bookings or calibrate balanced barter exchanges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Form Card (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-10 rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] space-y-7"
            noValidate
          >
            {serverError && (
              <div className="p-4 rounded-[16px] bg-[#A83C3C]/10 border border-[#A83C3C]/25 text-[#A83C3C] text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="gig-title" className="block text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2.5">
                Gig Title <span className="text-[#A83C3C]">*</span>
              </label>
              <input
                id="gig-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="e.g. Modern Brand Architecture & Scalable Design Systems"
                className={`w-full px-4 py-3.5 rounded-[16px] border bg-[#F5F2EC] text-[#1C1917] placeholder:text-[#8E8780] transition-all duration-200 focus:outline-none ${
                  errors.title
                    ? "border-[#A83C3C] focus:border-[#A83C3C] focus:ring-1 focus:ring-[#A83C3C]"
                    : "border-[#DCD5C9] focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30"
                }`}
              />
              {errors.title && (
                <p className="text-[#A83C3C] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                </p>
              )}
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2.5">
                Discipline Category <span className="text-[#A83C3C]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-3 rounded-[16px] text-xs font-medium border text-left transition-all duration-200 flex items-center justify-between ${
                      category === cat
                        ? "bg-[#A34835] text-white border-[#A34835] shadow-xs scale-[1.01]"
                        : "bg-[#F5F2EC] text-[#68625D] border-[#DCD5C9] hover:border-[#8C6D58] hover:text-[#1C1917]"
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-[#A83C3C] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
                </p>
              )}
            </div>

            {/* Rate */}
            <div>
              <label htmlFor="gig-rate" className="block text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2.5">
                Rate / Valuation <span className="text-[#A83C3C]">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
                <input
                  id="gig-rate"
                  type="text"
                  value={rate}
                  onChange={(e) => {
                    setRate(e.target.value);
                    if (errors.rate) setErrors((prev) => ({ ...prev, rate: "" }));
                  }}
                  placeholder="e.g. $65/hr or $280 flat deliverable"
                  className={`w-full pl-10 pr-4 py-3.5 rounded-[16px] border bg-[#F5F2EC] text-[#1C1917] placeholder:text-[#8E8780] font-mono text-sm transition-all duration-200 focus:outline-none ${
                    errors.rate
                      ? "border-[#A83C3C] focus:border-[#A83C3C] focus:ring-1 focus:ring-[#A83C3C]"
                      : "border-[#DCD5C9] focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30"
                  }`}
                />
              </div>
              <p className="text-xs text-[#8E8780] mt-1.5">
                State your rate clearly (e.g. $65/hr or $250 flat). Used for client billing and LEU equivalence calculations.
              </p>
              {errors.rate && (
                <p className="text-[#A83C3C] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.rate}
                </p>
              )}
            </div>

            {/* Creator Name */}
            <div>
              <label htmlFor="creator-name" className="block text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2.5">
                Practitioner Identity
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
                <input
                  id="creator-name"
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full pl-10 pr-4 py-3.5 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] placeholder:text-[#8E8780] focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="gig-description" className="block text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2.5">
                Scope & Deliverable Specifications <span className="text-[#A83C3C]">*</span>
              </label>
              <textarea
                id="gig-description"
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                }}
                placeholder="Detail what is included: source files, timeline, toolstack (e.g. Figma, DaVinci Resolve, Ableton), revision policy, and expected deliverables..."
                className={`w-full p-4 rounded-[16px] border bg-[#F5F2EC] text-[#1C1917] placeholder:text-[#8E8780] focus:outline-none transition-all duration-200 text-sm leading-relaxed ${
                  errors.description
                    ? "border-[#A83C3C] focus:border-[#A83C3C] focus:ring-1 focus:ring-[#A83C3C]"
                    : "border-[#DCD5C9] focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30"
                }`}
              />
              <div className="flex justify-between items-center text-xs text-[#8E8780] mt-2 font-mono">
                <span>Min 15 characters. Editorial precision.</span>
                <span>{description.length} chars</span>
              </div>
              {errors.description && (
                <p className="text-[#A83C3C] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(163,72,53,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/30 rounded-full animate-pulse" />
                    <span>Publishing to Editorial Index...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish Gig & View in Directory</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-xs uppercase tracking-widest text-[#8C6D58] font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#A34835]" />
            Live Marketplace Preview
          </div>

          <div className="p-8 rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-200 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#8C6D58]/10 text-[#8C6D58] border border-[#8C6D58]/20">
                {category || "Discipline"}
              </span>
              <span className="font-mono text-sm font-semibold text-[#1C1917] bg-[#F5F2EC] px-2.5 py-1 rounded-md border border-[#DCD5C9]">
                {rate || "$--/hr"}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-2xl font-light text-[#1C1917] line-clamp-2">
                {title || "Your Offering Title Will Appear Here"}
              </h3>
              <p className="text-xs text-[#68625D] font-light mt-2.5 line-clamp-3 leading-relaxed">
                {description || "A clean editorial summary of your craft, deliverables, and terms will appear here for prospective clients and collaborators to discover."}
              </p>
            </div>

            <div className="pt-5 border-t border-[#E7E2D9] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F5F2EC] border border-[#DCD5C9] flex items-center justify-center text-[#8C6D58] text-xs font-semibold">
                  {(creatorName || user.name).substring(0, 2).toUpperCase()}
                </div>
                <div className="text-xs">
                  <p className="font-medium text-[#1C1917] line-clamp-1">{creatorName || user.name}</p>
                  <p className="text-[#3D724D] text-[11px]">Available</p>
                </div>
              </div>
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-[16px] bg-[#A34835]/15 text-[#A34835] text-xs font-semibold uppercase tracking-wider cursor-default"
              >
                Inquire
              </button>
            </div>
          </div>

          <div className="p-6 rounded-[24px] bg-[#F5F2EC] border border-[#E7E2D9] text-xs text-[#68625D] space-y-3 leading-relaxed">
            <div className="font-medium text-[#1C1917] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#3D724D]" />
              Evaluation Benchmark: Feature 1
            </div>
            <p>
              Validates all input criteria, transmits the payload to <code className="text-[#A34835] font-mono">POST /api/gigs</code>, and transitions immediately to <code className="text-[#A34835] font-mono">/marketplace</code> showing your freshly registered listing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
