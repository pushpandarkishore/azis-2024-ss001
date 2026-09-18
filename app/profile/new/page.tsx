"use client";
import { useState } from "react";
import { CheckCircle, User, Zap, Plus, X, ArrowRight } from "lucide-react";

const SKILLS = ["Motion Graphics", "3D Animation", "UI/UX Design", "Brand Identity", "Video Editing", "Color Grading", "Copywriting", "Audio Engineering", "Music Production", "Photography", "Illustration", "Social Media Strategy", "Podcast Production", "Graphic Design", "Web Development"];


const STEPS = ["Basic Info", "Skills", "Portfolio", "Availability"];

export default function NewProfilePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [creatorId, setCreatorId] = useState("");

  const [form, setForm] = useState({
    name: "", username: "", email: "", bio: "", location: "",
    skills: [] as string[],
    customSkill: "",
    portfolio: [{ title: "", description: "", tools_used: "", category: "default" }],
    availability: "available" as "available" | "busy" | "unavailable",
    response_time: "24h",
  });

  const updateForm = (field: string, value: unknown) => setForm(prev => ({ ...prev, [field]: value }));

  const addSkill = (skill: string) => {
    if (!form.skills.includes(skill)) updateForm("skills", [...form.skills, skill]);
  };

  const removeSkill = (skill: string) => updateForm("skills", form.skills.filter(s => s !== skill));

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/v1/creators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name, username: form.username.toLowerCase().replace(/\s+/g, "_"),
          email: form.email, bio: form.bio, location: form.location,
          availability: form.availability, response_time: form.response_time,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.username}`,
          cover_url: "", hourly_rate_equiv: 0, verified: false,
        }),
      });
      const json = await res.json();
      if (res.ok) { setCreatorId(json.data.id); setSubmitted(true); }
      else setError(json.error || "Failed to create profile");
    } finally { setLoading(false); }
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h1 className="text-3xl font-black mb-3">You&apos;re Live! 🎉</h1>
        <p className="text-muted-foreground mb-8">Your creator profile has been created. Start finding skill-swap partners.</p>
        <div className="flex flex-col gap-3">
          <a href="/marketplace" className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all">
            Browse Marketplace <ArrowRight className="w-4 h-4" />
          </a>
          {creatorId && (
            <a href={`/creators/${creatorId}`} className="px-6 py-3 rounded-xl border border-border font-semibold hover:bg-muted transition-all text-center">
              View My Profile
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black mb-2">Join SkillSwap</h1>
          <p className="text-muted-foreground">Build your creator profile in 4 quick steps.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-foreground' : 'text-muted-foreground'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-primary' : 'bg-border'}`} />}
            </div>
          ))}
        </div>

        <div className="glass border border-border/50 rounded-3xl p-8">
          {/* Step 0: Basic Info */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold flex items-center gap-2"><User className="w-5 h-5 text-primary" /> Basic Info</h2>
              {[
                { label: "Full Name", field: "name", type: "text", placeholder: "e.g. Sofia Andersen" },
                { label: "Username", field: "username", type: "text", placeholder: "e.g. sofiaandersen" },
                { label: "Email", field: "email", type: "email", placeholder: "your@email.com" },
                { label: "Location", field: "location", type: "text", placeholder: "e.g. Copenhagen, Denmark" },
              ].map(({ label, field, type, placeholder }) => (
                <div key={field}>
                  <label className="text-sm font-medium mb-1.5 block">{label}</label>
                  <input
                    type={type}
                    value={(form as Record<string, unknown>)[field] as string}
                    onChange={e => updateForm(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium mb-1.5 block">Bio (min 10 chars)</label>
                <textarea
                  value={form.bio}
                  onChange={e => updateForm("bio", e.target.value)}
                  placeholder="Tell other creators who you are and what you do..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 1: Skills */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> Your Skills</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <button
                    key={skill}
                    onClick={() => form.skills.includes(skill) ? removeSkill(skill) : addSkill(skill)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${form.skills.includes(skill) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {form.skills.length > 0 && (
                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-2">Selected ({form.skills.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map(s => (
                      <span key={s} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                        {s} <button onClick={() => removeSkill(s)}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.customSkill}
                  onChange={e => updateForm("customSkill", e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && form.customSkill.trim()) { addSkill(form.customSkill.trim()); updateForm("customSkill", ""); } }}
                  placeholder="Add custom skill..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button
                  onClick={() => { if (form.customSkill.trim()) { addSkill(form.customSkill.trim()); updateForm("customSkill", ""); } }}
                  className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                ><Plus className="w-4 h-4" /></button>
              </div>
            </div>
          )}

          {/* Step 2: Portfolio */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Portfolio Sample</h2>
              {form.portfolio.map((item, i) => (
                <div key={i} className="space-y-4 p-4 rounded-xl border border-border">
                  {[
                    { label: "Project Title", field: "title", placeholder: "e.g. Brand Rebrand for XYZ" },
                    { label: "Description", field: "description", placeholder: "What did you create? What tools? What was the impact?" },
                    { label: "Tools Used", field: "tools_used", placeholder: "e.g. Figma, After Effects, Procreate" },
                  ].map(({ label, field, placeholder }) => (
                    <div key={field}>
                      <label className="text-xs text-muted-foreground font-medium mb-1 block">{label}</label>
                      {field === "description" ? (
                        <textarea
                          value={item[field as keyof typeof item] as string}
                          onChange={e => { const updated = [...form.portfolio]; updated[i] = { ...updated[i], [field]: e.target.value }; updateForm("portfolio", updated); }}
                          placeholder={placeholder}
                          rows={3}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={item[field as keyof typeof item] as string}
                          onChange={e => { const updated = [...form.portfolio]; updated[i] = { ...updated[i], [field]: e.target.value }; updateForm("portfolio", updated); }}
                          placeholder={placeholder}
                          className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
              <h2 className="text-xl font-bold">Availability</h2>
              <div>
                <label className="text-sm font-medium mb-3 block">Current Status</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "available", label: "Available", color: "border-emerald-500 bg-emerald-500/10 text-emerald-500" },
                    { value: "busy", label: "Busy", color: "border-amber-500 bg-amber-500/10 text-amber-500" },
                    { value: "unavailable", label: "Unavailable", color: "border-red-500 bg-red-500/10 text-red-500" },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => updateForm("availability", opt.value)}
                      className={`py-3 rounded-xl border-2 font-semibold text-sm transition-all ${form.availability === opt.value ? opt.color : 'border-border text-muted-foreground hover:border-primary/40'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Typical Response Time</label>
                <select
                  value={form.response_time}
                  onChange={e => updateForm("response_time", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  {["1h", "2h", "4h", "6h", "8h", "12h", "24h", "48h"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {error && <p className="text-destructive text-sm mt-4">{error}</p>}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="px-6 py-3 rounded-xl border border-border font-semibold disabled:opacity-30 hover:bg-muted transition-all"
            >
              Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:scale-105"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all disabled:opacity-60"
              >
                {loading ? "Creating Profile…" : "Create Profile 🚀"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
