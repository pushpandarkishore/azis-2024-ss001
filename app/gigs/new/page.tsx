"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Send, CheckCircle2, AlertCircle, DollarSign, Tag, FileText, User } from "lucide-react";
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
      // Redirect to marketplace with newly created gig highlighted
      router.push(`/marketplace?newGigId=${created.id}&created=true`);
    } catch (err: any) {
      setServerError(err.message || "An unexpected error occurred");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#CFC7C1] mb-8">
        <Link href="/marketplace" className="hover:text-[#E6E8E8] flex items-center gap-1.5 transition-colors duration-200">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Marketplace</span>
        </Link>
        <span className="text-[#7A7A7A]">/</span>
        <span className="text-[#E6E8E8] font-medium">Post a Gig</span>
      </div>

      {/* Header Banner */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4887A]/15 border border-[#B4887A]/30 text-[#B4887A] text-xs tracking-wider uppercase font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Feature 1: Post a Gig
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#E6E8E8] tracking-tight leading-tight">
          Publish Your Creative Service
        </h1>
        <p className="text-[#CFC7C1] text-base sm:text-lg mt-3 max-w-2xl font-light leading-relaxed">
          List your specialized craft on the SkillSwap editorial index. Clients and fellow creators can initiate verified direct bookings or request balanced barter agreements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Form Card (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 sm:p-10 rounded-[24px] border border-[#3A3A3A] bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.2)] space-y-7"
            noValidate
          >
            {serverError && (
              <div className="p-4 rounded-[16px] bg-[#B85C5C]/15 border border-[#B85C5C]/30 text-[#B85C5C] text-sm flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="gig-title" className="block text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-2.5">
                Gig Title <span className="text-[#B85C5C]">*</span>
              </label>
              <input
                id="gig-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                }}
                placeholder="e.g. Modern Brand Identity & Scalable Design Architecture"
                className={`w-full px-4 py-3.5 rounded-[16px] border bg-[#262626] text-[#E6E8E8] placeholder:text-[#7A7A7A] transition-all duration-200 focus:outline-none ${
                  errors.title
                    ? "border-[#B85C5C] focus:border-[#B85C5C] focus:ring-1 focus:ring-[#B85C5C]"
                    : "border-[#444444] focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D]"
                }`}
              />
              {errors.title && (
                <p className="text-[#B85C5C] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                </p>
              )}
            </div>

            {/* Category Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-2.5">
                Discipline Category <span className="text-[#B85C5C]">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-3 rounded-[16px] text-xs font-medium border text-left transition-all duration-200 flex items-center justify-between ${
                      category === cat
                        ? "bg-[#C46A6D] text-white border-[#C46A6D] shadow-sm scale-[1.01]"
                        : "bg-[#262626] text-[#CFC7C1] border-[#444444] hover:border-[#7A7A7A] hover:text-[#E6E8E8]"
                    }`}
                  >
                    <span>{cat}</span>
                    {category === cat && <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-[#B85C5C] text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.category}
                </p>
              )}
            </div>

            {/* Rate */}
            <div>
              <label htmlFor="gig-rate" className="block text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-2.5">
                Rate / Valuation <span className="text-[#B85C5C]">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A7A]" />
                <input
                  id="gig-rate"
                  type="text"
                  value={rate}
                  onChange={(e) => {
                    setRate(e.target.value);
                    if (errors.rate) setErrors((prev) => ({ ...prev, rate: "" }));
                  }}
                  placeholder="e.g. $65/hr or $280 flat deliverable"
                  className={`w-full pl-10 pr-4 py-3.5 rounded-[16px] border bg-[#262626] text-[#E6E8E8] placeholder:text-[#7A7A7A] font-mono text-sm transition-all duration-200 focus:outline-none ${
                    errors.rate
                      ? "border-[#B85C5C] focus:border-[#B85C5C] focus:ring-1 focus:ring-[#B85C5C]"
                      : "border-[#444444] focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D]"
                  }`}
                />
              </div>
              <p className="text-xs text-[#7A7A7A] mt-1.5">
                State your rate clearly (e.g. $65/hr or $250 flat). Used for both client billing and LEU parity calibration.
              </p>
              {errors.rate && (
                <p className="text-[#B85C5C] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.rate}
                </p>
              )}
            </div>

            {/* Creator Name */}
            <div>
              <label htmlFor="creator-name" className="block text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-2.5">
                Creator Identity
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A7A]" />
                <input
                  id="creator-name"
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full pl-10 pr-4 py-3.5 rounded-[16px] border border-[#444444] bg-[#262626] text-[#E6E8E8] placeholder:text-[#7A7A7A] focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="gig-description" className="block text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-2.5">
                Scope & Deliverable Specifications <span className="text-[#B85C5C]">*</span>
              </label>
              <textarea
                id="gig-description"
                rows={5}
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
                }}
                placeholder="Detail what is included in this service: source files, timeline, toolstack (e.g. Figma, DaVinci Resolve, Pro Tools), revision cycles, and expected turnaround..."
                className={`w-full p-4 rounded-[16px] border bg-[#262626] text-[#E6E8E8] placeholder:text-[#7A7A7A] focus:outline-none transition-all duration-200 text-sm leading-relaxed ${
                  errors.description
                    ? "border-[#B85C5C] focus:border-[#B85C5C] focus:ring-1 focus:ring-[#B85C5C]"
                    : "border-[#444444] focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D]"
                }`}
              />
              <div className="flex justify-between items-center text-xs text-[#7A7A7A] mt-2 font-mono">
                <span>Min 15 characters. Editorial precision.</span>
                <span>{description.length} chars</span>
              </div>
              {errors.description && (
                <p className="text-[#B85C5C] text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 rounded-[16px] bg-[#C46A6D] text-white font-medium hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white/30 rounded-full animate-pulse" />
                    <span>Publishing to Editorial Index...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Publish Gig & View in Marketplace</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Sidebar (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="text-xs uppercase tracking-widest text-[#CFC7C1] font-semibold flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#C46A6D]" />
            Live Marketplace Preview
          </div>

          <div className="p-7 rounded-[24px] border border-[#3A3A3A] bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <span className="px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold bg-[#B4887A]/15 text-[#B4887A] border border-[#B4887A]/30">
                {category || "Discipline"}
              </span>
              <span className="font-mono text-sm font-semibold text-[#E6E8E8]">
                {rate || "$--/hr"}
              </span>
            </div>

            <div>
              <h3 className="font-serif text-xl font-light text-[#E6E8E8] line-clamp-2">
                {title || "Your Offering Title Will Appear Here"}
              </h3>
              <p className="text-xs text-[#CFC7C1] font-light mt-2.5 line-clamp-3 leading-relaxed">
                {description || "A clean editorial summary of your craft, deliverables, and terms will appear here for prospective clients and collaborators to discover."}
              </p>
            </div>

            <div className="pt-4 border-t border-[#3A3A3A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#3A3A3A] border border-[#444444] flex items-center justify-center text-[#E6E8E8] text-xs font-semibold">
                  {(creatorName || user.name).substring(0, 2).toUpperCase()}
                </div>
                <div className="text-xs">
                  <p className="font-medium text-[#E6E8E8] line-clamp-1">{creatorName || user.name}</p>
                  <p className="text-[#7A7A7A] text-[11px]">Available</p>
                </div>
              </div>
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-[16px] bg-[#C46A6D]/20 text-[#C46A6D] text-xs font-medium cursor-default"
              >
                Inquire
              </button>
            </div>
          </div>

          <div className="p-6 rounded-[24px] bg-[#262626] border border-[#3A3A3A] text-xs text-[#CFC7C1] space-y-3 leading-relaxed">
            <div className="font-medium text-[#E6E8E8] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#5E8A67]" />
              Evaluation Benchmark: Feature 1
            </div>
            <p>
              Validates all input criteria, transmits the payload to <code className="text-[#C46A6D] font-mono">POST /api/gigs</code>, and transitions immediately to <code className="text-[#C46A6D] font-mono">/marketplace</code> showcasing your freshly registered listing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
