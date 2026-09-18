"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  X,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  Zap,
  BookmarkCheck,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { useDemoRole } from "@/lib/role-context";

interface Gig {
  id: string;
  title: string;
  category: string;
  rate: string;
  rate_numeric: number;
  description: string;
  creator_id: string;
  creator_name: string;
  creator_avatar?: string;
  responsiveness_rate: number;
  completed_bookings: number;
  composite_score: number;
  created_at: string;
}

interface BookingConfirmation {
  id: string;
  gig_title: string;
  client_name: string;
  requested_date: string;
  rate: string;
}

const CATEGORIES = ["All", "Design", "Video", "Writing", "Audio", "Tutoring"];

const SORT_OPTIONS = [
  { value: "composite", label: "Composite Recommended" },
  { value: "low_to_high", label: "Rate: Low to High" },
  { value: "high_to_low", label: "Rate: High to Low" },
  { value: "newest", label: "Newest" },
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const { user } = useDemoRole();

  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("composite");

  // Newly created gig notification
  const [highlightGigId, setHighlightGigId] = useState<string | null>(null);
  const [showCreatedToast, setShowCreatedToast] = useState(false);

  // Booking Modal State
  const [selectedGig, setSelectedGig] = useState<Gig | null>(null);
  const [clientName, setClientName] = useState(user.name);
  const [projectNotes, setProjectNotes] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [bookingErrors, setBookingErrors] = useState<Record<string, string>>({});
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Booking Confirmation Dialogue State
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  useEffect(() => {
    setClientName(user.name);
  }, [user.name]);

  useEffect(() => {
    const newId = searchParams.get("newGigId");
    const created = searchParams.get("created");
    if (newId && created) {
      setHighlightGigId(newId);
      setShowCreatedToast(true);
    }
    const catParam = searchParams.get("category");
    if (catParam) {
      setCategory(catParam);
    }
  }, [searchParams]);

  const fetchGigs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (category !== "All") params.set("category", category);
      if (sort) params.set("sort", sort);

      const res = await fetch(`/api/gigs?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setGigs(data);
      }
    } catch (err) {
      console.error("Error loading gigs:", err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchGigs();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchGigs]);

  const handleOpenBooking = (gig: Gig) => {
    setSelectedGig(gig);
    setBookingErrors({});
    // Default delivery date: 7 days from today
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setRequestedDate(d.toISOString().split("T")[0]);
  };

  const handleCloseBooking = () => {
    setSelectedGig(null);
    setBookingErrors({});
  };

  const validateBooking = () => {
    const errs: Record<string, string> = {};
    if (!clientName.trim()) {
      errs.clientName = "Client name is required";
    }
    if (!projectNotes.trim()) {
      errs.projectNotes = "Project scope and notes are required";
    } else if (projectNotes.trim().length < 10) {
      errs.projectNotes = "Please provide at least 10 characters of project details";
    }
    if (!requestedDate) {
      errs.requestedDate = "Requested delivery date is required";
    }
    setBookingErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGig || !validateBooking()) return;

    setSubmittingBooking(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId: selectedGig.id,
          clientName: clientName.trim(),
          notes: projectNotes.trim(),
          requestedDate,
          clientId: user.id || "client_demo",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create booking");
      }

      const newBooking = await res.json();
      setSelectedGig(null);
      setProjectNotes("");
      setConfirmation({
        id: newBooking.id,
        gig_title: newBooking.gig_title,
        client_name: newBooking.client_name,
        requested_date: newBooking.requested_date,
        rate: newBooking.rate,
      });
    } catch (err: any) {
      setBookingErrors({ form: err.message || "Failed to complete booking request" });
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-7xl mx-auto">
      {/* Newly created toast */}
      {showCreatedToast && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Your new gig has been successfully published to the marketplace!</span>
          </div>
          <button
            onClick={() => setShowCreatedToast(false)}
            className="text-emerald-400/80 hover:text-emerald-400 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Feature 2: Browse & Search &middot; Feature 3: Book a Gig
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Explore Creative Gigs
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mt-1.5">
            Discover verified creators in design, video, audio, writing, and tutoring. Book directly with zero platform fee.
          </p>
        </div>

        <Link
          href="/gigs/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm shrink-0 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Post a Gig
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, title, tools, or description..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dynamic Sorting Dropdown */}
          <div className="relative min-w-[220px]">
            <div className="relative">
              <ArrowUpDown className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full pl-10 pr-8 py-3 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills with Emojis & Neon Glow */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {[
            { id: "All", label: "✨ All Gigs" },
            { id: "Design", label: "🎨 UI/UX & Design" },
            { id: "Video", label: "🎬 Video & Motion" },
            { id: "Writing", label: "✍️ Copy & Writing" },
            { id: "Audio", label: "🎧 Sound & Music" },
            { id: "Tutoring", label: "🧠 1-on-1 Mentorship" },
          ].map((cat) => {
            const isSelected =
              category === cat.id ||
              (cat.id === "Video" && category === "Video Editing") ||
              (cat.id === "Video Editing" && category === "Video");
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 border flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-gradient-to-r from-violet-600 to-cyan-600 text-white border-transparent shadow-md shadow-violet-500/25 scale-105"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:bg-muted/70"
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gigs Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="p-6 rounded-2xl border border-border bg-card/50 space-y-4 animate-pulse"
            >
              <div className="flex justify-between">
                <div className="w-20 h-5 bg-muted rounded-full" />
                <div className="w-16 h-5 bg-muted rounded-md" />
              </div>
              <div className="w-3/4 h-6 bg-muted rounded-md" />
              <div className="w-full h-12 bg-muted rounded-md" />
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <div className="w-24 h-8 bg-muted rounded-full" />
                <div className="w-20 h-8 bg-muted rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      ) : gigs.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/40">
          <p className="text-lg font-semibold text-foreground">No creative gigs match your query</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
            Try adjusting your search terms, changing the category filter, or post the first gig in this category.
          </p>
          <div className="flex justify-center gap-3 mt-5">
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="px-4 py-2 rounded-xl bg-muted text-foreground text-sm font-semibold hover:bg-muted/80 transition-colors"
            >
              Reset Filters
            </button>
            <Link
              href="/gigs/new"
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Post a Gig
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => {
            const isHighlighted = gig.id === highlightGigId;
            return (
              <div
                key={gig.id}
                id={`gig-card-${gig.id}`}
                className={`group flex flex-col justify-between p-6 rounded-3xl border bg-card/90 backdrop-blur-xl transition-all duration-300 relative overflow-hidden neon-glow-hover ${
                  isHighlighted
                    ? "border-primary ring-2 ring-primary/60 shadow-xl shadow-primary/20 scale-[1.02]"
                    : "border-border/80 hover:border-primary/50"
                }`}
              >
                {/* Top Subtle Cyber Glow Accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Category badge & Rate */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/25">
                        {gig.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground border border-border/60">
                        {gig.category.toLowerCase().includes("video")
                          ? "⚡ 4K Motion"
                          : gig.category.toLowerCase().includes("design")
                          ? "💎 Figma Native"
                          : gig.category.toLowerCase().includes("audio")
                          ? "🎵 Spatial Mix"
                          : gig.category.toLowerCase().includes("writing")
                          ? "🔥 High ROI"
                          : "🌟 1-on-1 Mentorship"}
                      </span>
                    </div>
                    <span className="text-sm font-black text-foreground bg-muted/80 px-2.5 py-1 rounded-xl border border-border/80 shadow-sm">
                      {gig.rate}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                    {gig.title}
                  </h3>

                  {/* Description snippet */}
                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                    {gig.description}
                  </p>
                </div>

                {/* Creator info & Actions */}
                <div className="pt-4 border-t border-border/70 mt-2">
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white text-xs font-black shadow-md shadow-violet-500/20 shrink-0 group-hover:scale-105 transition-transform">
                        {gig.creator_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-foreground line-clamp-1">{gig.creator_name}</p>
                        <p className="text-muted-foreground flex items-center gap-1 text-[11px] font-medium">
                          <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{Math.round((gig.responsiveness_rate || 0.95) * 100)}% Fast Reply</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 block">
                        {gig.completed_bookings || 12} trades done
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenBooking(gig)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-primary text-primary-foreground font-bold text-xs sm:text-sm hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/25 active:scale-95 group-hover:scale-[1.01]"
                    >
                      <span>Book Now</span>
                      <ArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                    <Link
                      href={`/trade?gigId=${gig.id}`}
                      className="p-2.5 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex items-center justify-center group/btn"
                      title="Request an AI Barter Swap for this gig"
                    >
                      <Sparkles className="w-4 h-4 text-violet-400 group-hover/btn:scale-110 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feature 3: Book a Gig Modal */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 sm:p-8 space-y-5 animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  Feature 3 &middot; Book a Gig
                </span>
                <h2 className="text-xl font-bold text-foreground mt-0.5">
                  Book: {selectedGig.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Offered by <span className="font-semibold text-foreground">{selectedGig.creator_name}</span> &middot; Rate: <span className="font-semibold text-foreground">{selectedGig.rate}</span>
                </p>
              </div>
              <button
                onClick={handleCloseBooking}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {bookingErrors.form && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{bookingErrors.form}</span>
              </div>
            )}

            {/* Booking Form */}
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {/* Client Name */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Client Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (bookingErrors.clientName) setBookingErrors((prev) => ({ ...prev, clientName: "" }));
                  }}
                  placeholder="e.g. Demo Client or your name"
                  className={`w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 transition-all ${
                    bookingErrors.clientName
                      ? "border-destructive focus:ring-destructive/30"
                      : "border-border focus:ring-primary/40 focus:border-primary"
                  }`}
                />
                {bookingErrors.clientName && (
                  <p className="text-destructive text-[11px] mt-1">{bookingErrors.clientName}</p>
                )}
              </div>

              {/* Project Scope / Notes */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Project Scope & Notes <span className="text-destructive">*</span>
                </label>
                <textarea
                  rows={4}
                  value={projectNotes}
                  onChange={(e) => {
                    setProjectNotes(e.target.value);
                    if (bookingErrors.projectNotes) setBookingErrors((prev) => ({ ...prev, projectNotes: "" }));
                  }}
                  placeholder="Describe your project requirements, deliverables, reference links, and any specific expectations..."
                  className={`w-full p-3.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 transition-all ${
                    bookingErrors.projectNotes
                      ? "border-destructive focus:ring-destructive/30"
                      : "border-border focus:ring-primary/40 focus:border-primary"
                  }`}
                />
                {bookingErrors.projectNotes && (
                  <p className="text-destructive text-[11px] mt-1">{bookingErrors.projectNotes}</p>
                )}
              </div>

              {/* Requested Delivery Date */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Requested Delivery Date <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={requestedDate}
                    onChange={(e) => {
                      setRequestedDate(e.target.value);
                      if (bookingErrors.requestedDate) setBookingErrors((prev) => ({ ...prev, requestedDate: "" }));
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 transition-all ${
                      bookingErrors.requestedDate
                        ? "border-destructive focus:ring-destructive/30"
                        : "border-border focus:ring-primary/40 focus:border-primary"
                    }`}
                  />
                </div>
                {bookingErrors.requestedDate && (
                  <p className="text-destructive text-[11px] mt-1">{bookingErrors.requestedDate}</p>
                )}
              </div>

              {/* Modal Actions */}
              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={handleCloseBooking}
                  className="px-4 py-2.5 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {submittingBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      <span>Sending Request...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Booking Request</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feature 3: Immediate Booking Confirmation Dialogue */}
      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 sm:p-8 space-y-5 text-center animate-slide-up">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-black text-foreground">Booking Request Submitted!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your booking request is now active with initial status <span className="text-amber-400 font-semibold">Pending</span>.
              </p>
            </div>

            {/* Reference ID Card */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Booking Reference ID:</span>
                <span className="font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  {confirmation.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Gig:</span>
                <span className="font-semibold text-foreground text-right line-clamp-1">{confirmation.gig_title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Client:</span>
                <span className="font-semibold text-foreground">{confirmation.client_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Requested Delivery:</span>
                <span className="font-semibold text-foreground">{confirmation.requested_date}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <Link
                href="/my-bookings"
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>View in My Bookings</span>
              </Link>
              <button
                onClick={() => setConfirmation(null)}
                className="py-2.5 px-4 rounded-xl border border-border text-foreground font-semibold text-xs sm:text-sm hover:bg-muted transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
