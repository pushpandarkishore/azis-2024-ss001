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
  TrendingUp,
  ArrowRight,
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

      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "Accepted" } : b))
      );
      setActionSuccessMessage(`Commission ${bookingId} has been confirmed for production.`);
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
      setActionSuccessMessage(`Booking ${decliningBookingId} declined (${selectedReason}). DP1 recommendation triggered for client.`);
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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto bg-[#FBF9F5] text-[#1C1917]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8C6D58]/10 border border-[#8C6D58]/20 text-[#8C6D58] text-xs tracking-wider uppercase font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Feature 4: Creator Dashboard
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#1C1917] tracking-tight leading-tight">
            Creator Studio & Inquiries
          </h1>
          <p className="text-[#68625D] text-base sm:text-lg mt-3 max-w-2xl font-light leading-relaxed">
            Review incoming commission briefs, verify deliverable timelines, and confirm production schedules with editorial poise.
          </p>
        </div>

        <Link
          href="/gigs/new"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[16px] bg-[#A34835] text-white font-semibold uppercase tracking-wider text-xs hover:bg-[#8C3B2A] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_14px_rgba(163,72,53,0.25)] shrink-0 self-start md:self-auto"
        >
          <span>Post Another Gig</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Action Success Alert */}
      {actionSuccessMessage && (
        <div className="mb-8 p-4 rounded-[16px] bg-[#3D724D]/10 border border-[#3D724D]/25 text-[#3D724D] flex items-center justify-between text-sm animate-slide-up shadow-xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-[#3D724D]/80 hover:text-[#3D724D] p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editorial Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <div className="p-6 rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-200">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8E8780] block mb-2">
            Total Inquiries
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl sm:text-4xl font-light text-[#1C1917]">{totalCount}</span>
            <LayoutDashboard className="w-5 h-5 text-[#8C6D58]" />
          </div>
        </div>

        <div className="p-6 rounded-[24px] border border-[#B47228]/25 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-200">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#B47228] block mb-2">
            Pending Review
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl sm:text-4xl font-light text-[#B47228]">{pendingCount}</span>
            <Clock className="w-5 h-5 text-[#B47228]" />
          </div>
        </div>

        <div className="p-6 rounded-[24px] border border-[#3D724D]/25 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-200">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#3D724D] block mb-2">
            Confirmed Bookings
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl sm:text-4xl font-light text-[#3D724D]">{acceptedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-[#3D724D]" />
          </div>
        </div>

        <div className="p-6 rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-200">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8E8780] block mb-2">
            Fulfillment Ratio
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl sm:text-4xl font-light text-[#1C1917]">{acceptanceRate}%</span>
            <TrendingUp className="w-5 h-5 text-[#8C6D58]" />
          </div>
        </div>
      </div>

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
            <div key={n} className="p-8 rounded-[24px] border border-[#E7E2D9] bg-white space-y-4 shadow-xs">
              <div className="h-4 bg-[#F3EFEA] rounded w-1/4 animate-pulse" />
              <div className="h-6 bg-[#F3EFEA] rounded w-1/2 animate-pulse" />
              <div className="h-16 bg-[#F5F2EC] rounded-[16px] w-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-[24px] border border-dashed border-[#DCD5C9] bg-white shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#F5F2EC] flex items-center justify-center mx-auto mb-3 text-[#8C6D58]">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <p className="font-serif text-xl font-light text-[#1C1917]">No inquiries listed under &quot;{filterTab}&quot;</p>
          <p className="text-xs text-[#68625D] mt-1 max-w-md mx-auto font-light">
            When prospective clients book your services, requests populate instantaneously in this ledger.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBookings.map((booking) => {
            const isPending = booking.status === "Pending";
            const isAccepted = booking.status === "Accepted";
            const isDeclined = booking.status === "Declined";

            return (
              <div
                key={booking.id}
                id={`booking-feed-item-${booking.id}`}
                className="p-7 sm:p-8 rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-200 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    {/* Status Badge & Booking ID */}
                    <div className="flex items-center gap-2.5 mb-3">
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
                    </div>
                  </div>

                  {/* Client Info Card */}
                  <div className="flex items-center gap-3 bg-[#F5F2EC] p-3 rounded-[16px] border border-[#E7E2D9] self-start">
                    <div className="w-9 h-9 rounded-full bg-white border border-[#DCD5C9] flex items-center justify-center text-[#8C6D58] font-semibold text-xs">
                      {booking.client_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-xs">
                      <p className="font-medium text-[#1C1917]">{booking.client_name}</p>
                      <p className="text-[#8E8780] text-[11px]">Client Inquiry</p>
                    </div>
                  </div>
                </div>

                {/* Project Scope / Notes */}
                <div className="p-5 rounded-[16px] bg-[#FAF8F5] border border-[#E7E2D9] text-xs text-[#1C1917] leading-relaxed font-light">
                  <span className="font-semibold uppercase tracking-widest text-[#8C6D58] block text-[10px] mb-1.5">
                    Commission Scope & Client Brief:
                  </span>
                  {booking.notes}
                </div>

                {/* Metadata & Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#E7E2D9]">
                  <div className="flex flex-wrap items-center gap-5 text-xs text-[#68625D] font-light">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#8C6D58]" />
                      <span>Delivery Target: <strong className="text-[#1C1917] font-mono">{booking.requested_date}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#8E8780]" />
                      <span className="font-mono text-[#8E8780]">Logged: {booking.created_at}</span>
                    </div>
                  </div>

                  {/* Pending Decision Buttons */}
                  {isPending && (
                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <button
                        onClick={() => handleAccept(booking.id)}
                        disabled={processingId === booking.id}
                        className="px-5 py-2.5 rounded-[16px] bg-[#3D724D] hover:brightness-110 text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Offer</span>
                      </button>
                      <button
                        onClick={() => handleOpenDeclineModal(booking.id)}
                        disabled={processingId === booking.id}
                        className="px-5 py-2.5 rounded-[16px] bg-[#F5F2EC] text-[#A83C3C] hover:bg-[#A83C3C]/10 border border-[#A83C3C]/30 text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {/* Declined Status Pill */}
                  {isDeclined && booking.decline_reason && (
                    <div className="text-xs text-[#A83C3C] bg-[#A83C3C]/10 px-3.5 py-1.5 rounded-[16px] border border-[#A83C3C]/25">
                      Reason Tag: <strong className="font-medium">{booking.decline_reason}</strong>
                    </div>
                  )}

                  {/* Accepted Status Pill */}
                  {isAccepted && (
                    <div className="text-xs text-[#3D724D] bg-[#3D724D]/10 px-3.5 py-1.5 rounded-[16px] border border-[#3D724D]/25 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirmed for Production</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1C1917]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-[24px] border border-[#E7E2D9] bg-white shadow-[0_16px_48px_rgba(0,0,0,0.12)] p-7 sm:p-8 space-y-6 animate-slide-up">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-2xl font-light text-[#1C1917]">Decline Commission</h3>
                <p className="text-xs text-[#68625D] mt-1 font-light leading-relaxed">
                  Categorize the reason so the client is smoothly presented alternative practitioners through the DP1 protocol.
                </p>
              </div>
              <button
                onClick={() => setDecliningBookingId(null)}
                className="p-1 rounded-[12px] text-[#8E8780] hover:text-[#1C1917] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reason Options */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#68625D]">
                Decline Rationale Tag <span className="text-[#A83C3C]">*</span>
              </label>
              {DECLINE_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full p-3.5 rounded-[16px] text-xs font-medium border text-left flex items-center justify-between transition-all duration-200 ${
                    selectedReason === reason
                      ? "border-[#A83C3C] bg-[#A83C3C]/10 text-[#A83C3C] shadow-xs"
                      : "border-[#DCD5C9] bg-[#F5F2EC] text-[#68625D] hover:border-[#8C6D58] hover:text-[#1C1917]"
                  }`}
                >
                  <span>{reason}</span>
                  {selectedReason === reason && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDecliningBookingId(null)}
                className="px-5 py-2.5 rounded-[16px] border border-[#DCD5C9] text-[#68625D] text-xs font-medium hover:text-[#1C1917] hover:border-[#8C6D58] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={processingId === decliningBookingId}
                className="px-5 py-2.5 rounded-[16px] bg-[#A83C3C] text-white text-xs font-semibold uppercase tracking-wider hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5 shadow-xs"
              >
                {processingId === decliningBookingId ? (
                  <span>Recording...</span>
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
