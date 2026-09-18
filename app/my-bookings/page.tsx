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
  AlertCircle,
  X
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

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleOpenQuickBook = (gig: Gig) => {
    setBookingModalGig(gig);
    setQuickClientName(user.name);
    setQuickNotes("Re-routing booking following previous schedule conflict. Ready to proceed with project scope.");
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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto bg-[#FBF9F5] text-[#1C1917]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8C6D58]/10 border border-[#8C6D58]/20 text-[#8C6D58] text-xs tracking-wider uppercase font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Feature 5: My Bookings &middot; DP1 Rejection Protocol
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1917] tracking-tight leading-tight">
            Client Commissions & Portfolio
          </h1>
          <p className="text-[#68625D] text-base sm:text-lg mt-3 max-w-2xl font-light leading-relaxed">
            Monitor creative service commissions, review confirmation timelines, and seamlessly pivot to qualified peers if scheduling shifts.
          </p>
        </div>

        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[16px] bg-[#A34835] text-white font-semibold uppercase tracking-wider text-xs hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(163,72,53,0.25)] shrink-0 self-start md:self-auto"
        >
          <span>Explore Editorial Index</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {quickSuccess && (
        <div className="mb-8 p-4 rounded-[16px] bg-[#3D724D]/10 border border-[#3D724D]/25 text-[#3D724D] flex items-center justify-between text-sm animate-slide-up shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{quickSuccess}</span>
          </div>
          <button
            onClick={() => setQuickSuccess(null)}
            className="text-[#3D724D]/80 hover:text-[#3D724D] p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-[#E7E2D9] pb-4">
        {(["All", "Pending", "Accepted", "Declined"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-5 py-2.5 rounded-[16px] text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              filterTab === tab
                ? "bg-[#A34835] text-white shadow-xs"
                : "text-[#68625D] hover:text-[#1C1917] hover:bg-white"
            }`}
          >
            <span>{tab}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                filterTab === tab
                  ? "bg-white/20 text-white"
                  : "bg-[#F5F2EC] text-[#8E8780]"
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
        <div className="space-y-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-8 rounded-[24px] border border-[#E7E2D9] bg-white space-y-4 shadow-xs">
              <div className="h-4 bg-[#F3EFEA] rounded w-1/4 animate-pulse" />
              <div className="h-6 bg-[#F3EFEA] rounded w-1/2 animate-pulse" />
              <div className="h-16 bg-[#F5F2EC] rounded-[16px] w-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-[24px] border border-dashed border-[#DCD5C9] bg-white shadow-xs">
          <BookmarkCheck className="w-10 h-10 text-[#8C6D58] mx-auto mb-3" />
          <p className="font-serif text-xl font-light text-[#1C1917]">No commissions recorded in &quot;{filterTab}&quot;</p>
          <p className="text-xs text-[#68625D] mt-1 max-w-sm mx-auto font-light">
            Explore the creative index and initiate an engagement to track project milestones here.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 mt-6 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xs"
          >
            <span>Explore Editorial Index</span>
            <ArrowRight className="w-3.5 h-3.5" />
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
                className="p-7 sm:p-8 rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] space-y-5 hover:-translate-y-1 transition-all duration-200"
              >
                {/* Header Line */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-3">
                      {/* Status Badges */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 border ${
                          isPending
                            ? "bg-[#B47228]/10 text-[#B47228] border-[#B47228]/25"
                            : isAccepted
                            ? "bg-[#3D724D]/10 text-[#3D724D] border-[#3D724D]/25"
                            : "bg-[#A83C3C]/10 text-[#A83C3C] border-[#A83C3C]/25"
                        }`}
                      >
                        {isPending && <Clock className="w-3.5 h-3.5" />}
                        {isAccepted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isDeclined && <XCircle className="w-3.5 h-3.5" />}
                        <span>{booking.status}</span>
                      </span>

                      <span className="font-mono text-xs text-[#8E8780]">
                        {booking.id}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-light text-[#1C1917]">
                      {booking.gig_title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#68625D] mt-1.5 font-light">
                      <span className="px-2.5 py-0.5 rounded-[12px] bg-[#F5F2EC] border border-[#DCD5C9] text-[#1C1917]">
                        {booking.category}
                      </span>
                      <span>&middot;</span>
                      <span className="font-mono text-[#1C1917] font-medium">{booking.rate}</span>
                      <span>&middot;</span>
                      <span>Practitioner: <strong className="text-[#1C1917] font-normal">{booking.creator_name}</strong></span>
                    </div>
                  </div>

                  {/* Delivery date indicator */}
                  <div className="bg-[#F5F2EC] p-3.5 rounded-[16px] border border-[#E7E2D9] text-xs self-start sm:text-right">
                    <span className="text-[#8E8780] block text-[11px] uppercase tracking-wider font-mono">Requested Target:</span>
                    <span className="font-mono font-medium text-[#1C1917] flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#8C6D58]" />
                      {booking.requested_date}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="p-5 rounded-[16px] bg-[#FAF8F5] border border-[#E7E2D9] text-xs text-[#1C1917] leading-relaxed font-light">
                  <span className="font-semibold uppercase tracking-widest text-[#8C6D58] block text-[10px] mb-1.5">
                    Your Commission Scope & Notes:
                  </span>
                  {booking.notes}
                </div>

                {/* DECLINED BOOKING DP1 PROTOCOL */}
                {isDeclined && (
                  <div className="mt-5 pt-5 border-t border-[#E7E2D9] space-y-4">
                    {/* Reason Tag */}
                    <div className="p-4 rounded-[16px] bg-[#A83C3C]/10 border border-[#A83C3C]/25 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-[#A83C3C] shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <p className="text-[#A83C3C] font-semibold">
                          Decline Reason Tag: {booking.decline_reason || "Schedule Conflict"}
                        </p>
                        <p className="text-[#68625D] mt-1 font-light leading-relaxed">
                          In accordance with Decision Point 1 (DP1: Rejection Protocol), alternative practitioners within {booking.category} are surfaced below to keep your commission progressing without interruption.
                        </p>
                      </div>
                    </div>

                    {/* Inline "Find Similar Gigs" recommendation strip */}
                    <div className="p-6 rounded-[24px] bg-[#F5F2EC] border border-[#8C6D58]/30 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1917]">
                          <Sparkles className="w-4 h-4 text-[#A34835]" />
                          <span>Similar Offerings in {booking.category}</span>
                          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white text-[#8C6D58] border border-[#DCD5C9] uppercase font-mono tracking-wider">
                            DP1 Protocol
                          </span>
                        </div>
                        <Link
                          href={`/marketplace?category=${encodeURIComponent(booking.category)}`}
                          className="text-xs text-[#A34835] hover:underline flex items-center gap-1 font-semibold uppercase tracking-wider"
                        >
                          <span>View Index</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>

                      {similarGigs.length === 0 ? (
                        <p className="text-xs text-[#8E8780] font-light">Loading verified alternative creators...</p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {similarGigs.slice(0, 3).map((sim) => (
                            <div
                              key={sim.id}
                              className="p-4 rounded-[20px] border border-[#E7E2D9] bg-white flex flex-col justify-between space-y-3 hover:border-[#A34835]/40 transition-all duration-200 shadow-xs"
                            >
                              <div>
                                <div className="flex justify-between items-start gap-2">
                                  <span className="font-serif text-sm font-medium text-[#1C1917] line-clamp-1">
                                    {sim.title}
                                  </span>
                                  <span className="text-[11px] font-mono text-[#A34835] bg-[#A34835]/10 px-2 py-0.5 rounded-[12px] shrink-0 font-medium">
                                    {sim.rate}
                                  </span>
                                </div>
                                <p className="text-[11px] text-[#68625D] font-light line-clamp-2 mt-1.5 leading-relaxed">
                                  {sim.description}
                                </p>
                              </div>

                              <div className="pt-3 border-t border-[#E7E2D9] flex items-center justify-between">
                                <span className="text-[11px] text-[#68625D]">
                                  {sim.creator_name}
                                </span>
                                <button
                                  onClick={() => handleOpenQuickBook(sim)}
                                  className="px-3 py-1.5 rounded-[16px] bg-[#A34835] text-white text-[11px] font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)] p-7 sm:p-8 space-y-6 animate-slide-up">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8C6D58] font-semibold">
                  DP1 Fast Re-route &middot; Book Similar Gig
                </span>
                <h2 className="font-serif text-2xl font-light text-[#1C1917] mt-1">
                  {bookingModalGig.title}
                </h2>
                <p className="text-xs text-[#68625D] font-light mt-1">
                  Practitioner: {bookingModalGig.creator_name} &middot; Rate: <span className="font-mono text-[#1C1917]">{bookingModalGig.rate}</span>
                </p>
              </div>
              <button
                onClick={() => setBookingModalGig(null)}
                className="p-1 rounded-[12px] text-[#8E8780] hover:text-[#1C1917] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-1.5">
                  Client Identity
                </label>
                <input
                  type="text"
                  value={quickClientName}
                  onChange={(e) => setQuickClientName(e.target.value)}
                  className="w-full px-4 py-3 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] text-sm focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-1.5">
                  Scope & Deliverable Notes
                </label>
                <textarea
                  rows={3}
                  value={quickNotes}
                  onChange={(e) => setQuickNotes(e.target.value)}
                  className="w-full p-4 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] text-sm focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200 leading-relaxed font-light"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#68625D] mb-1.5">
                  Requested Delivery Target
                </label>
                <input
                  type="date"
                  value={quickDate}
                  onChange={(e) => setQuickDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-[16px] border border-[#DCD5C9] bg-[#F5F2EC] text-[#1C1917] text-sm font-mono focus:border-[#A34835] focus:ring-1 focus:ring-[#A34835]/30 focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModalGig(null)}
                  className="px-5 py-2.5 rounded-[16px] border border-[#DCD5C9] text-[#68625D] text-xs font-medium hover:text-[#1C1917] hover:border-[#8C6D58] transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingQuick}
                  className="px-6 py-2.5 rounded-[16px] bg-[#A34835] text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5 shadow-[0_4px_14px_rgba(163,72,53,0.25)]"
                >
                  {submittingQuick ? "Transmitting..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
