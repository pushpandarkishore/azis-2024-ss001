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
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md p-8 sm:p-10 rounded-[24px] border border-[#3A3A3A] bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <div className="w-16 h-16 rounded-full bg-[#5E8A67]/15 text-[#5E8A67] border border-[#5E8A67]/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-light text-[#E6E8E8] mb-3">Welcome to the Guild</h1>
          <p className="text-[#CFC7C1] text-xs font-light mb-8 leading-relaxed">
            Your creator profile has been published to the editorial index. You can now initiate direct client commissions or balanced skill-swap collaborations.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/marketplace"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-[16px] bg-[#C46A6D] text-white font-medium text-xs hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
            >
              <span>Explore Marketplace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            {creatorId && (
              <Link
                href={`/creators/${creatorId}`}
                className="px-6 py-3.5 rounded-[16px] border border-[#444444] text-[#CFC7C1] font-medium text-xs hover:text-[#E6E8E8] hover:border-[#7A7A7A] transition-all duration-200 text-center"
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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4887A]/15 border border-[#B4887A]/30 text-[#B4887A] text-xs tracking-wider uppercase font-medium mb-4">
            Creator Registration &middot; Editorial Guild
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-[#E6E8E8] tracking-tight">
            Join the SkillSwap Index
          </h1>
          <p className="text-[#CFC7C1] text-sm mt-2 font-light">
            Curate your creator profile across four deliberate steps.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono shrink-0 transition-all duration-200 ${
                  i <= step
                    ? "bg-[#C46A6D] text-white font-semibold"
                    : "bg-[#262626] border border-[#444444] text-[#7A7A7A]"
                }`}
              >
                {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`text-[11px] uppercase tracking-wider hidden sm:block ${
                  i === step ? "text-[#E6E8E8] font-medium" : "text-[#7A7A7A]"
                }`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px ${i < step ? "bg-[#C46A6D]" : "bg-[#3A3A3A]"}`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Card Form */}
        <div className="rounded-[24px] border border-[#3A3A3A] bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8 sm:p-10 space-y-7">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-light text-[#E6E8E8] flex items-center gap-2.5">
                <User className="w-5 h-5 text-[#B4887A]" />
                Identity & Details
              </h2>
              {[
                { label: "Full Name", field: "name", type: "text", placeholder: "e.g. Sofia Andersen" },
                { label: "Username / Slug", field: "username", type: "text", placeholder: "e.g. sofiaandersen" },
                { label: "Contact Email", field: "email", type: "email", placeholder: "sofia@studio.com" },
                { label: "Location", field: "location", type: "text", placeholder: "e.g. Copenhagen, Denmark" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-2 block">
                    {label}
                  </label>
                  <input
                    type={type}
                    value={(form as Record<string, unknown>)[field] as string}
                    onChange={(e) => updateForm(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-[16px] border border-[#444444] bg-[#262626] text-[#E6E8E8] placeholder:text-[#7A7A7A] text-sm focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-all duration-200"
                  />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-2 block">
                  Bio (min 10 characters)
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => updateForm("bio", e.target.value)}
                  placeholder="Articulate your creative ethos, tools of choice, and typical project engagements..."
                  rows={4}
                  className="w-full p-4 rounded-[16px] border border-[#444444] bg-[#262626] text-[#E6E8E8] placeholder:text-[#7A7A7A] text-sm focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-all duration-200 leading-relaxed resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 1: Skills */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-light text-[#E6E8E8] flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-[#B4887A]" />
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
                        ? "bg-[#C46A6D] text-white shadow-sm"
                        : "bg-[#262626] border border-[#444444] text-[#CFC7C1] hover:border-[#7A7A7A] hover:text-[#E6E8E8]"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {form.skills.length > 0 && (
                <div className="border-t border-[#3A3A3A] pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#7A7A7A] mb-2.5 font-mono">
                    Selected Disciplines ({form.skills.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((s) => (
                      <span
                        key={s}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B4887A]/15 text-[#B4887A] border border-[#B4887A]/30 text-xs font-medium"
                      >
                        {s}{" "}
                        <button type="button" onClick={() => removeSkill(s)} className="hover:text-white">
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
                  className="flex-1 px-4 py-2.5 rounded-[16px] border border-[#444444] bg-[#262626] text-[#E6E8E8] text-xs focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (form.customSkill.trim()) {
                      addSkill(form.customSkill.trim());
                      updateForm("customSkill", "");
                    }
                  }}
                  className="px-4 py-2.5 rounded-[16px] bg-[#C46A6D] text-white hover:bg-[#B55B5E] transition-all duration-200"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Portfolio */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-light text-[#E6E8E8]">Portfolio Sample</h2>
              {form.portfolio.map((item, i) => (
                <div key={i} className="space-y-4 p-5 rounded-[16px] border border-[#3A3A3A] bg-[#262626]">
                  {[
                    { label: "Project Title", field: "title", placeholder: "e.g. Identity Architecture for Design Biennale" },
                    { label: "Deliverable Scope", field: "description", placeholder: "Detailed scope, creative execution, and tools applied..." },
                    { label: "Tools Used", field: "tools_used", placeholder: "e.g. Figma, DaVinci Resolve, Webflow" },
                  ].map(({ label, field, placeholder }) => (
                    <div key={field}>
                      <label className="text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-1.5 block">
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
                          className="w-full p-3 rounded-[12px] border border-[#444444] bg-[#1F2224] text-[#E6E8E8] text-xs focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-all duration-200 resize-none"
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
                          className="w-full px-3.5 py-2.5 rounded-[12px] border border-[#444444] bg-[#1F2224] text-[#E6E8E8] text-xs focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-all duration-200"
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
              <h2 className="font-serif text-2xl font-light text-[#E6E8E8]">Availability & Response</h2>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-3 block">
                  Studio Capacity Status
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "available", label: "Available", activeClass: "border-[#5E8A67] bg-[#5E8A67]/15 text-[#5E8A67]" },
                    { value: "busy", label: "Busy", activeClass: "border-[#C89B53] bg-[#C89B53]/15 text-[#C89B53]" },
                    { value: "unavailable", label: "Unavailable", activeClass: "border-[#B85C5C] bg-[#B85C5C]/15 text-[#B85C5C]" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateForm("availability", opt.value)}
                      className={`py-3 rounded-[16px] border text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                        form.availability === opt.value
                          ? opt.activeClass
                          : "border-[#444444] bg-[#262626] text-[#7A7A7A] hover:border-[#7A7A7A] hover:text-[#CFC7C1]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-[#CFC7C1] mb-2 block">
                  Typical Inquiry Turnaround
                </label>
                <select
                  value={form.response_time}
                  onChange={(e) => updateForm("response_time", e.target.value)}
                  className="w-full px-4 py-3 rounded-[16px] border border-[#444444] bg-[#262626] text-[#E6E8E8] text-xs font-mono focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-all duration-200"
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
            <p className="text-[#B85C5C] text-xs mt-4 flex items-center gap-1.5">
              <X className="w-3.5 h-3.5" />
              <span>{error}</span>
            </p>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-[#3A3A3A]">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-5 py-2.5 rounded-[16px] border border-[#444444] text-[#CFC7C1] text-xs font-medium disabled:opacity-30 hover:text-[#E6E8E8] hover:border-[#7A7A7A] transition-all duration-200"
            >
              Previous
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
                className="px-6 py-2.5 rounded-[16px] bg-[#C46A6D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm"
              >
                Next Step
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="px-6 py-2.5 rounded-[16px] bg-[#C46A6D] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 shadow-sm"
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
