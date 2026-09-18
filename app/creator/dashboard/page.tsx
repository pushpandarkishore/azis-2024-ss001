"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Sparkles,
  AlertCircle,
  TrendingUp,
  User,
  ArrowRight,
  ShieldCheck,
  Check,
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

const DECLINE_REASONS = [
  "Schedule Conflict",
  "Scope Mismatch",
  "Rate Incompatibility",
];

export default function CreatorDashboardPage() {
  const { user } = useDemoRole();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<"All" | "Pending" | "Accepted" | "Declined">("All");

  // Decline prompt modal state
  const [decliningBookingId, setDecliningBookingId] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("Schedule Conflict");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const fetchCreatorBookings = useCallback(async () => {
    setLoading(true);
    try {
      // Query bookings for creator (default creatorId or demo creator)
      const res = await fetch("/api/bookings?role=creator");
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error("Error fetching creator bookings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCreatorBookings();
  }, [fetchCreatorBookings]);

  const handleAccept = async (bookingId: string) => {
    setProcessingId(bookingId);
    setActionSuccessMessage(null);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Accepted" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to accept booking");
      }

      const updated = await res.json();
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "Accepted" } : b))
      );
      setActionSuccessMessage(`Booking ${bookingId} accepted successfully!`);
    } catch (err: any) {
      alert(err.message || "Failed to accept booking");
    } finally {
      setProcessingId(null);
    }
  };

  const handleOpenDeclineModal = (bookingId: string) => {
    setDecliningBookingId(bookingId);
    setSelectedReason("Schedule Conflict");
  };

  const handleConfirmDecline = async () => {
    if (!decliningBookingId) return;
    setProcessingId(decliningBookingId);
    setActionSuccessMessage(null);
    try {
      const res = await fetch(`/api/bookings/${decliningBookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "Declined",
          declineReason: selectedReason,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to decline booking");
      }

      setBookings((prev) =>
        prev.map((b) =>
          b.id === decliningBookingId
            ? { ...b, status: "Declined", decline_reason: selectedReason }
            : b
        )
      );
      setActionSuccessMessage(`Booking ${decliningBookingId} declined with reason: "${selectedReason}"`);
      setDecliningBookingId(null);
    } catch (err: any) {
      alert(err.message || "Failed to decline booking");
    } finally {
      setProcessingId(null);
    }
  };

  // Metrics
  const totalCount = bookings.length;
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const acceptedCount = bookings.filter((b) => b.status === "Accepted").length;
  const declinedCount = bookings.filter((b) => b.status === "Declined").length;
  const resolvedCount = acceptedCount + declinedCount;
  const acceptanceRate = resolvedCount > 0 ? Math.round((acceptedCount / resolvedCount) * 100) : 100;

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === "All") return true;
    return b.status === filterTab;
  });

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Feature 4: Creator Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Creator Dashboard
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg mt-1.5">
            Manage incoming booking inquiries, evaluate scopes, and accept or decline client offers.
          </p>
        </div>

        <Link
          href="/gigs/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shrink-0 self-start md:self-auto shadow-sm"
        >
          <span>Post Another Gig</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Action Success Alert */}
      {actionSuccessMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-between text-sm animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-400/80 hover:text-emerald-400 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Total Requests
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-foreground">{totalCount}</span>
            <LayoutDashboard className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 shadow-sm">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block mb-1">
            Pending Review
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{pendingCount}</span>
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 shadow-sm">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
            Accepted Bookings
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{acceptedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
            Acceptance Rate
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-foreground">{acceptanceRate}%</span>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

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
                ? totalCount
                : tab === "Pending"
                ? pendingCount
                : tab === "Accepted"
                ? acceptedCount
                : declinedCount}
            </span>
          </button>
        ))}
      </div>

      {/* Booking Feed */}
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
          <p className="text-base font-semibold text-foreground">No bookings found in &quot;{filterTab}&quot;</p>
          <p className="text-xs text-muted-foreground mt-1">
            When clients book your gigs or switch roles, requests will populate here in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === "Pending";
            const isAccepted = booking.status === "Accepted";
            const isDeclined = booking.status === "Declined";

            return (
              <div
                key={booking.id}
                id={`booking-feed-item-${booking.id}`}
                className="p-6 rounded-2xl border border-border bg-card hover:border-border/90 transition-all shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    {/* Header line: status tag & booking ID */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${
                          isPending
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/25"
                            : isAccepted
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/25"
                        }`}
                      >
                        {isPending && <Clock className="w-3 h-3" />}
                        {isAccepted && <CheckCircle2 className="w-3 h-3" />}
                        {isDeclined && <XCircle className="w-3 h-3" />}
                        <span>{booking.status}</span>
                      </span>

                      <span className="font-mono text-xs text-muted-foreground">
                        {booking.id}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground">
                      {booking.gig_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span className="px-2 py-0.5 rounded bg-muted text-foreground font-medium">
                        {booking.category}
                      </span>
                      <span>&middot;</span>
                      <span className="font-semibold text-foreground">{booking.rate}</span>
                    </div>
                  </div>

                  {/* Client Info Card */}
                  <div className="flex items-center gap-2.5 bg-muted/40 p-2.5 rounded-xl border border-border/60 self-start">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                      {booking.client_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">{booking.client_name}</p>
                      <p className="text-muted-foreground text-[11px]">Client Inquiry</p>
                    </div>
                  </div>
                </div>

                {/* Project Scope / Notes */}
                <div className="p-4 rounded-xl bg-muted/30 border border-border/60 text-xs text-foreground leading-relaxed">
                  <span className="font-semibold text-muted-foreground block text-[11px] uppercase tracking-wider mb-1">
                    Project Scope & Notes:
                  </span>
                  {booking.notes}
                </div>

                {/* Metadata row & Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <span>Requested Date: <strong className="text-foreground">{booking.requested_date}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Received: {booking.created_at}</span>
                    </div>
                  </div>

                  {/* Actions for Pending */}
                  {isPending && (
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleAccept(booking.id)}
                        disabled={processingId === booking.id}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleOpenDeclineModal(booking.id)}
                        disabled={processingId === booking.id}
                        className="px-4 py-2 rounded-xl bg-destructive/15 text-destructive hover:bg-destructive/25 border border-destructive/30 text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {/* Declined tag */}
                  {isDeclined && booking.decline_reason && (
                    <div className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                      Reason: <strong className="font-semibold">{booking.decline_reason}</strong>
                    </div>
                  )}

                  {/* Accepted tag */}
                  {isAccepted && (
                    <div className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmed for Delivery</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decline Reason Modal */}
      {decliningBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl p-6 space-y-5 animate-slide-up">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Decline Booking Request</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select a transparent reason so the client is smoothly routed to similar creators (DP1).
                </p>
              </div>
              <button
                onClick={() => setDecliningBookingId(null)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Reason Options */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-foreground">
                Select Decline Reason Tag <span className="text-destructive">*</span>
              </label>
              {DECLINE_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full p-3 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition-all ${
                    selectedReason === reason
                      ? "border-destructive/60 bg-destructive/10 text-destructive shadow-sm"
                      : "border-border bg-muted/40 text-foreground hover:bg-muted"
                  }`}
                >
                  <span>{reason}</span>
                  {selectedReason === reason && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDecliningBookingId(null)}
                className="px-4 py-2 rounded-xl border border-border text-foreground text-xs font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={processingId === decliningBookingId}
                className="px-4 py-2 rounded-xl bg-destructive text-destructive-foreground text-xs font-semibold hover:bg-destructive/90 transition-all flex items-center gap-1.5 shadow-sm"
              >
                {processingId === decliningBookingId ? (
                  <span>Declining...</span>
                ) : (
                  <span>Confirm Decline</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
