"use client";
import { useState } from "react";
import Link from "next/link";
import { CheckCircle, User, Zap, Plus, X, ArrowRight } from "lucide-react";

const SKILLS = [
  "Motion Graphics",
  "3D Animation",
  "UI/UX Design",
  "Brand Identity",
  "Video Editing",
  "Color Grading",
  "Copywriting",
  "Audio Engineering",
  "Music Production",
  "Photography",
  "Illustration",
  "Social Media Strategy",
  "Podcast Production",
  "Graphic Design",
  "Web Development",
];

const STEPS = ["Basic Info", "Skills", "Portfolio", "Availability"];

export default function NewProfilePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creatorId, setCreatorId] = useState("");

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    bio: "",
    location: "",
    skills: [] as string[],
    customSkill: "",
    portfolio: [{ title: "", description: "", tools_used: "", category: "default" }],
    availability: "available" as "available" | "busy" | "unavailable",
    response_time: "24h",
  });

  const updateForm = (field: string, value: unknown) => setForm((prev) => ({ ...prev, [field]: value }));

  const addSkill = (skill: string) => {
    if (!form.skills.includes(skill)) updateForm("skills", [...form.skills, skill]);
  };

  const removeSkill = (skill: string) => updateForm("skills", form.skills.filter((s) => s !== skill));

  const submit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          username: form.username.toLowerCase().replace(/\s+/g, "_"),
          email: form.email,
          bio: form.bio,
          location: form.location,
          availability: form.availability,
          response_time: form.response_time,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username}`,
          cover_url: "",
          hourly_rate_equiv: 0,
          verified: false,
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setCreatorId(json.data.id);
        setSubmitted(true);
      } else {
        setError(json.error || "Failed to create profile");
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#FBF9F5]">
        <div className="text-center max-w-md p-8 sm:p-10 rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-[#3D724D]/10 text-[#3D724D] border border-[#3D724D]/25 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-light text-[#1C1917] mb-3">Welcome to the Directory</h1>
          <p className="text-[#68625D] text-xs font-light mb-8 leading-relaxed">
            Your creator profile has been published to the editorial index. You can now initiate direct client commissions or balanced barter collaborations.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/marketplace"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] bg-[#A34835] text-white font-semibold uppercase tracking-wider text-xs hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(163,72,53,0.25)]"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {creatorId && (
              <Link
                href={`/creators/${creatorId}`}
                className="px-6 py-3.5 rounded-[16px] border border-[#DCD5C9] text-[#68625D] font-medium text-xs hover:text-[#1C1917] hover:border-[#8C6D58] transition-all duration-200 text-center"
              >
                View Live Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto bg-[#FBF9F5] text-[#1C1917]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8C6D58]/10 border border-[#8C6D58]/20 text-[#8C6D58] text-xs tracking-wider uppercase font-semibold mb-4">
            Creator Registration &middot; Editorial Guild
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#1C1917] tracking-tight">
            Join the SkillSwap Index
          </h1>
          <p className="text-[#68625D] text-sm mt-2 font-light">
            Curate your practitioner profile across four deliberate steps.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-200 ${
                  i <= step
                    ? "bg-[#A34835] text-white font-semibold"
                    : "bg-white border border-[#DCD5C9] text-[#8E8780]"
                }`}
              >
                {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`text-[11px] uppercase tracking-wider hidden sm:block font-medium ${
                  i === step ? "text-[#1C1917]" : "text-[#8E8780]"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px ${i < step ? "bg-[#A34835]" : "bg-[#E7E2D9]"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card Form */}
        <div className="rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-8 sm:p-10 space-y-7">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-light text-[#1C1917] flex items-center gap-2.5">
                <User className="w-5 h-5 text-[#8C6D58]" />
                Identity & Details
              </h2>
              {[
                { label: "Full Name", field: "name", type: "text", placeholder: "e.g. Sofia Andersen" },
                { label: "Username / Slug", field: "username", type: "text", placeholder: "e.g. sofiaandersen" },
                { label: "Contact Email", field: "email", type: "email", placeholder: "sofia@studio.com" },
                { label: "Location", field: "location", type: "text", placeholder: "e.g. Copenhagen, Denmark" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={(form as Record<string, unknown>)[field] as string}
                    onChange={(e) => updateForm(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] placeholder:text-[#8E8780] text-sm focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
                  Bio (min 10 characters)
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => updateForm("bio", e.target.value)}
                  placeholder="Articulate your creative ethos, tools of choice, and typical project engagements..."
                  rows={4}
                  className="w-full p-4 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] placeholder:text-[#8E8780] text-sm focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200 leading-relaxed resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 1: Skills */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-light text-[#1C1917] flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-[#8C6D58]" />
                Craft Disciplines
              </h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => (form.skills.includes(skill) ? removeSkill(skill) : addSkill(skill))}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      form.skills.includes(skill)
                        ? "bg-[#A34835] text-white shadow-xs"
                        : "bg-[#F5F2EC] border border-[#DCD5C9] text-[#68625D] hover:border-[#8C6D58] hover:text-[#1C1917]"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {form.skills.length > 0 && (
                <div className="border-t border-[#E7E2D9] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#8C6D58] mb-2.5 font-mono">
                    Selected Disciplines ({form.skills.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8C6D58]/10 text-[#8C6D58] border border-[#8C6D58]/20 text-xs font-medium"
                      >
                        {s}{" "}
                        <button type="button" onClick={() => removeSkill(s)} className="hover:text-[#1C1917]">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.customSkill}
                  onChange={(e) => updateForm("customSkill", e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && form.customSkill.trim()) {
                      addSkill(form.customSkill.trim());
                      updateForm("customSkill", "");
                    }
                  }}
                  placeholder="Add custom discipline..."
                  className="flex-1 px-4 py-2.5 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] text-xs focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (form.customSkill.trim()) {
                      addSkill(form.customSkill.trim());
                      updateForm("customSkill", "");
                    }
                  }}
                  className="px-4 py-2.5 rounded-[16px] bg-[#A34835] text-white hover:bg-[#8C3B2A] transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Portfolio */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-light text-[#1C1917]">Portfolio Sample</h2>
              {form.portfolio.map((item, i) => (
                <div key={i} className="space-y-4 p-5 rounded-[16px] border border-[#E7E2D9] bg-[#FAF8F5]">
                  {[
                    { label: "Project Title", field: "title", placeholder: "e.g. Identity Architecture for Design Biennale" },
                    { label: "Deliverable Scope", field: "description", placeholder: "Detailed scope, creative execution, and tools applied..." },
                    { label: "Tools Used", field: "tools_used", placeholder: "e.g. Figma, DaVinci Resolve, Webflow" },
                  ].map(({ label, field, placeholder }) => (
                    <div key={field}>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-1.5 block">
                        {label}
                      </label>
                      {field === "description" ? (
                        <textarea
                          value={item[field as keyof typeof item] as string}
                          onChange={(e) => {
                            const updated = [...form.portfolio];
                            updated[i] = { ...updated[i], [field]: e.target.value };
                            updateForm("portfolio", updated);
                          }}
                          placeholder={placeholder}
                          rows={3}
                          className="w-full p-3 rounded-[12px] border border-[#DCD5C9] bg-white text-[#1C1917] text-xs focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200 resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item[field as keyof typeof item] as string}
                          onChange={(e) => {
                            const updated = [...form.portfolio];
                            updated[i] = { ...updated[i], [field]: e.target.value };
                            updateForm("portfolio", updated);
                          }}
                          placeholder={placeholder}
                          className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#DCD5C9] bg-white text-[#1C1917] text-xs focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-light text-[#1C1917]">Availability & Response</h2>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-3 block">
                  Studio Capacity Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "available", label: "Available", activeClass: "border-[#3D724D] bg-[#3D724D]/10 text-[#3D724D]" },
                    { value: "busy", label: "Busy", activeClass: "border-[#B47228] bg-[#B47228]/10 text-[#B47228]" },
                    { value: "unavailable", label: "Unavailable", activeClass: "border-[#A83C3C] bg-[#A83C3C]/10 text-[#A83C3C]" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateForm("availability", opt.value)}
                      className={`py-3 rounded-[16px] border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        form.availability === opt.value
                          ? opt.activeClass
                          : "border-[#DCD5C9] bg-[#F5F2EC] text-[#8E8780] hover:border-[#8C6D58] hover:text-[#1C1917]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-2 block">
                  Typical Inquiry Turnaround
                </label>
                <select
                  value={form.response_time}
                  onChange={(e) => updateForm("response_time", e.target.value)}
                  className="w-full px-4 py-3 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] text-xs font-mono focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
                >
                  {["1h", "2h", "4h", "6h", "8h", "12h", "24h", "48h"].map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && (
            <p className="text-[#A83C3C] text-xs mt-4 flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-[#E7E2D9]">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-[16px] border border-[#DCD5C9] text-[#68625D] text-xs font-medium disabled:opacity-30 hover:text-[#1C1917] hover:border-[#8C6D58] transition-all duration-200"
            >
              Previous
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="px-6 py-2.5 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xs"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="px-6 py-2.5 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-[0_4px_14px_rgba(163,72,53,0.25)]"
              >
                {loading ? "Publishing..." : "Complete Profile"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
