"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  BookmarkCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Zap,
  ExternalLink,
  ShieldCheck,
  Send,
  X,
  AlertCircle
} from "lucide-react";
import { useDemoRole } from "@/lib/role-context";

interface Booking {
  id: string;
  gig_id: string;
  gig_title: string;
  category: string;
  rate: string;
  client_id: string;
  client_name: string;
  creator_id: string;
  creator_name: string;
  notes: string;
  requested_date: string;
  status: "Pending" | "Accepted" | "Declined";
  decline_reason?: string | null;
  created_at: string;
  updated_at?: string;
}

interface Gig {
  id: string;
  title: string;
  category: string;
  rate: string;
  description: string;
  creator_name: string;
  responsiveness_rate: number;
}

export default function MyBookingsPage() {
  const { user } = useDemoRole();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"All" | "Pending" | "Accepted" | "Declined">("All");

  // Similar gigs cache for DP1 recommendations
  const [categoryGigs, setCategoryGigs] = useState<Record<string, Gig[]>>({});

  // Quick booking modal for similar gigs
  const [bookingModalGig, setBookingModalGig] = useState<Gig | null>(null);
  const [quickClientName, setQuickClientName] = useState(user.name);
  const [quickNotes, setQuickNotes] = useState("");
  const [quickDate, setQuickDate] = useState("");
  const [submittingQuick, setSubmittingQuick] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings?role=client");
      if (res.ok) {
        const data: Booking[] = await res.json();
        setBookings(data);

        // For any declined booking, fetch similar gigs in the same category
        const declinedCategories = Array.from(
          new Set(data.filter((b) => b.status === "Declined").map((b) => b.category))
        );

        for (const cat of declinedCategories) {
          fetchSimilarGigs(cat);
        }
      }
    } catch (err) {
      console.error("Error fetching client bookings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSimilarGigs = async (categoryName: string) => {
    try {
      const res = await fetch(`/api/gigs?category=${encodeURIComponent(categoryName)}`);
      if (res.ok) {
        const data = await res.json();
        setCategoryGigs((prev) => ({
          ...prev,
          [categoryName]: data,
        }));
      }
    } catch (e) {
      console.error("Failed to load similar gigs:", e);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleOpenQuickBook = (gig: Gig) => {
    setBookingModalGig(gig);
    setQuickClientName(user.name);
    setQuickNotes("Re-routing booking following previous schedule conflict. Ready to proceed!");
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setQuickDate(d.toISOString().split("T")[0]);
    setQuickSuccess(null);
  };

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingModalGig || !quickNotes.trim() || !quickDate) return;

    setSubmittingQuick(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gigId: bookingModalGig.id,
          clientName: quickClientName.trim() || user.name,
          notes: quickNotes.trim(),
          requestedDate: quickDate,
          clientId: user.id || "client_demo",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create booking");
      }

      const created = await res.json();
      setQuickSuccess(`Booking successfully submitted with ID: ${created.id}`);
      setBookingModalGig(null);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || "Failed to submit booking");
    } finally {
      setSubmittingQuick(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === "All") return true;
    return b.status === filterTab;
  });

  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const acceptedCount = bookings.filter((b) => b.status === "Accepted").length;
  const declinedCount = bookings.filter((b) => b.status === "Declined").length;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Feature 5: My Bookings &middot; DP1 Rejection Protocol
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            My Bookings & Inquiries
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mt-1.5">
            Track all creative services you have requested, review creator confirmations, and discover alternative talent.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shrink-0 self-start md:self-auto shadow-sm"
        >
          <span>Browse Marketplace</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {quickSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between text-sm animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{quickSuccess}</span>
          </div>
          <button
            onClick={() => setQuickSuccess(null)}
            className="text-emerald-400/80 hover:text-emerald-400 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
        {(["All", "Pending", "Accepted", "Declined"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
              filterTab === tab
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <span>{tab}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                filterTab === tab
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {tab === "All"
                ? bookings.length
                : tab === "Pending"
                ? pendingCount
                : tab === "Accepted"
                ? acceptedCount
                : declinedCount}
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-6 rounded-2xl border border-border bg-card animate-pulse space-y-3">
              <div className="h-5 bg-muted rounded w-1/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-12 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/40">
          <BookmarkCheck className="w-10 h-10 text-muted-foreground mx-auto mb-2 opacity-50" />
          <p className="text-base font-semibold text-foreground">No bookings in &quot;{filterTab}&quot;</p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Browse the marketplace and book a creative gig to see your project updates here.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-1.5 px-4 py-2 mt-4 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Explore Gigs
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === "Pending";
            const isAccepted = booking.status === "Accepted";
            const isDeclined = booking.status === "Declined";
            const similarGigs = (categoryGigs[booking.category] || []).filter(
              (g) => g.id !== booking.gig_id
            );

            return (
              <div
                key={booking.id}
                id={`client-booking-${booking.id}`}
                className="p-6 sm:p-7 rounded-2xl border border-border bg-card shadow-sm space-y-4 hover:border-border/90 transition-all"
              >
                {/* Header line */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {/* Categorized Status Tags */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                          isPending
                            ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                            : isAccepted
                            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                            : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                        }`}
                      >
                        {isPending && <Clock className="w-3.5 h-3.5" />}
                        {isAccepted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isDeclined && <XCircle className="w-3.5 h-3.5" />}
                        <span>{booking.status}</span>
                      </span>

                      <span className="font-mono text-xs text-muted-foreground">
                        {booking.id}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-foreground">
                      {booking.gig_title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="px-2 py-0.5 rounded bg-muted text-foreground font-medium">
                        {booking.category}
                      </span>
                      <span>&middot;</span>
                      <span className="font-semibold text-foreground">Rate: {booking.rate}</span>
                      <span>&middot;</span>
                      <span>Creator: <strong className="text-foreground">{booking.creator_name}</strong></span>
                    </div>
                  </div>

                  {/* Delivery date indicator */}
                  <div className="bg-muted/40 p-3 rounded-xl border border-border/60 text-xs self-start sm:text-right">
                    <span className="text-muted-foreground block text-[11px]">Requested Delivery:</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {booking.requested_date}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-4 rounded-xl bg-muted/20 border border-border/60 text-xs text-foreground leading-relaxed">
                  <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">
                    Your Project Scope / Notes:
                  </span>
                  {booking.notes}
                </div>

                {/* DECLINED BOOKING DP1 PROTOCOL */}
                {isDeclined && (
                  <div className="mt-4 pt-4 border-t border-rose-500/20 space-y-4">
                    {/* Reason Tag */}
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="text-rose-400 font-bold">
                          Decline Reason Tag: {booking.decline_reason || "Schedule Conflict"}
                        </p>
                        <p className="text-muted-foreground mt-0.5">
                          In accordance with Decision Point 1 (DP1: Rejection Protocol), transparent feedback is provided and similar available talent has been surfaced below so your project keeps moving forward.
                        </p>
                      </div>
                    </div>

                    {/* Inline "Find Similar Gigs" recommendation strip */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/5 via-muted/30 to-background border border-primary/20 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span>Find Similar Gigs in {booking.category}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary uppercase font-semibold">
                            DP1 Protocol
                          </span>
                        </div>
                        <Link
                          href={`/marketplace?category=${encodeURIComponent(booking.category)}`}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <span>View all</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {similarGigs.length === 0 ? (
                        <p className="text-xs text-muted-foreground">Loading similar active creators...</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {similarGigs.slice(0, 3).map((sim) => (
                            <div
                              key={sim.id}
                              className="p-3.5 rounded-xl border border-border bg-card flex flex-col justify-between space-y-2.5 hover:border-primary/40 transition-all"
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <span className="text-xs font-bold text-foreground line-clamp-1">
                                    {sim.title}
                                  </span>
                                  <span className="text-[11px] font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded shrink-0">
                                    {sim.rate}
                                  </span>
                                </div>
                                <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                                  {sim.description}
                                </p>
                              </div>

                              <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                                <span className="text-[11px] text-foreground font-medium">
                                  {sim.creator_name}
                                </span>
                                <button
                                  onClick={() => handleOpenQuickBook(sim)}
                                  className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:bg-primary/90 transition-colors"
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Booking Modal for Similar Gigs */}
      {bookingModalGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 sm:p-8 space-y-5 animate-slide-up">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                  DP1 Fast Re-route &middot; Book Similar Gig
                </span>
                <h2 className="text-lg font-bold text-foreground mt-0.5">
                  {bookingModalGig.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Creator: {bookingModalGig.creator_name} &middot; Rate: {bookingModalGig.rate}
                </p>
              </div>
              <button
                onClick={() => setBookingModalGig(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={quickClientName}
                  onChange={(e) => setQuickClientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Project Scope & Notes
                </label>
                <textarea
                  rows={3}
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Requested Delivery Date
                </label>
                <input
                  type="date"
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBookingModalGig(null)}
                  className="px-4 py-2 rounded-xl border border-border text-foreground text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingQuick}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all flex items-center gap-1.5"
                >
                  {submittingQuick ? "Submitting..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
