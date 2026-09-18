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
      setActionSuccessMessage(`Booking ${bookingId} has been confirmed for delivery.`);
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
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12 max-w-[1280px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B4887A]/15 border border-[#B4887A]/30 text-[#B4887A] text-xs tracking-wider uppercase font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Feature 4: Creator Dashboard
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#E6E8E8] tracking-tight leading-tight">
            Creator Studio & Inquiries
          </h1>
          <p className="text-[#CFC7C1] text-base sm:text-lg mt-3 max-w-2xl font-light leading-relaxed">
            Review incoming commission requests, verify scope alignment, and confirm project timelines with editorial elegance.
          </p>
        </div>

        <Link
          href="/gigs/new"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-[16px] bg-[#C46A6D] text-white font-medium text-sm hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-sm shrink-0 self-start md:self-auto"
        >
          <span>Post Another Gig</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Action Success Alert */}
      {actionSuccessMessage && (
        <div className="mb-8 p-4 rounded-[16px] bg-[#5E8A67]/15 border border-[#5E8A67]/30 text-[#5E8A67] flex items-center justify-between text-sm animate-slide-up">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button
            onClick={() => setActionSuccessMessage(null)}
            className="text-[#5E8A67]/80 hover:text-[#5E8A67] p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editorial Stats Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
        <div className="p-6 rounded-[24px] border border-[#3A3A3A] bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#7A7A7A] block mb-2">
            Total Inquiries
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl sm:text-4xl font-light text-[#E6E8E8]">{totalCount}</span>
            <LayoutDashboard className="w-5 h-5 text-[#7A7A7A]" />
          </div>
        </div>

        <div className="p-6 rounded-[24px] border border-[#C89B53]/30 bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#C89B53] block mb-2">
            Pending Scrutiny
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl sm:text-4xl font-light text-[#C89B53]">{pendingCount}</span>
            <Clock className="w-5 h-5 text-[#C89B53]" />
          </div>
        </div>

        <div className="p-6 rounded-[24px] border border-[#5E8A67]/30 bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#5E8A67] block mb-2">
            Confirmed Deliveries
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl sm:text-4xl font-light text-[#5E8A67]">{acceptedCount}</span>
            <CheckCircle2 className="w-5 h-5 text-[#5E8A67]" />
          </div>
        </div>

        <div className="p-6 rounded-[24px] border border-[#3A3A3A] bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#7A7A7A] block mb-2">
            Fulfillment Ratio
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-3xl sm:text-4xl font-light text-[#E6E8E8]">{acceptanceRate}%</span>
            <TrendingUp className="w-5 h-5 text-[#B4887A]" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-8 border-b border-[#3A3A3A] pb-4">
        {(["All", "Pending", "Accepted", "Declined"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterTab(tab)}
            className={`px-5 py-2.5 rounded-[16px] text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 ${
              filterTab === tab
                ? "bg-[#C46A6D] text-white shadow-sm"
                : "text-[#CFC7C1] hover:text-[#E6E8E8] hover:bg-[#262626]"
            }`}
          >
            <span>{tab}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                filterTab === tab
                  ? "bg-white/20 text-white"
                  : "bg-[#262626] text-[#7A7A7A]"
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
            <div key={n} className="p-8 rounded-[24px] border border-[#3A3A3A] bg-[#2E2E2E] space-y-4">
              <div className="h-4 bg-[#3A3A3A] rounded w-1/4 animate-pulse" />
              <div className="h-6 bg-[#3A3A3A] rounded w-1/2 animate-pulse" />
              <div className="h-16 bg-[#262626] rounded-[16px] w-full animate-pulse" />
            </div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 px-6 rounded-[24px] border border-dashed border-[#3A3A3A] bg-[#262626]/40">
          <div className="w-12 h-12 rounded-full bg-[#3A3A3A] flex items-center justify-center mx-auto mb-3 text-[#7A7A7A]">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <p className="font-serif text-lg font-light text-[#E6E8E8]">No inquiries listed under &quot;{filterTab}&quot;</p>
          <p className="text-xs text-[#7A7A7A] mt-1 max-w-md mx-auto">
            When prospective clients book your services or test roles, requests appear instantaneously in this ledger.
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
                className="p-7 sm:p-8 rounded-[24px] border border-[#3A3A3A] bg-[#2E2E2E] shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-200 space-y-5"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    {/* Status Badge & Booking ID */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 border ${
                          isPending
                            ? "bg-[#C89B53]/15 text-[#C89B53] border-[#C89B53]/30"
                            : isAccepted
                            ? "bg-[#5E8A67]/15 text-[#5E8A67] border-[#5E8A67]/30"
                            : "bg-[#B85C5C]/15 text-[#B85C5C] border-[#B85C5C]/30"
                        }`}
                      >
                        {isPending && <Clock className="w-3.5 h-3.5" />}
                        {isAccepted && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {isDeclined && <XCircle className="w-3.5 h-3.5" />}
                        <span>{booking.status}</span>
                      </span>

                      <span className="font-mono text-xs text-[#7A7A7A]">
                        {booking.id}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl font-light text-[#E6E8E8]">
                      {booking.gig_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#CFC7C1] mt-1.5 font-light">
                      <span className="px-2.5 py-0.5 rounded-[12px] bg-[#262626] border border-[#444444] text-[#E6E8E8]">
                        {booking.category}
                      </span>
                      <span>&middot;</span>
                      <span className="font-mono text-[#E6E8E8]">{booking.rate}</span>
                    </div>
                  </div>

                  {/* Client Info Card */}
                  <div className="flex items-center gap-3 bg-[#262626] p-3 rounded-[16px] border border-[#3A3A3A] self-start">
                    <div className="w-9 h-9 rounded-full bg-[#3A3A3A] border border-[#444444] flex items-center justify-center text-[#B4887A] font-semibold text-xs">
                      {booking.client_name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="text-xs">
                      <p className="font-medium text-[#E6E8E8]">{booking.client_name}</p>
                      <p className="text-[#7A7A7A] text-[11px]">Client Inquiry</p>
                    </div>
                  </div>
                </div>

                {/* Project Scope / Notes */}
                <div className="p-5 rounded-[16px] bg-[#262626] border border-[#3A3A3A] text-xs text-[#E6E8E8] leading-relaxed">
                  <span className="font-semibold uppercase tracking-widest text-[#7A7A7A] block text-[10px] mb-1.5">
                    Commission Scope & Client Brief:
                  </span>
                  {booking.notes}
                </div>

                {/* Metadata & Actions */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#3A3A3A]">
                  <div className="flex flex-wrap items-center gap-5 text-xs text-[#CFC7C1] font-light">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#B4887A]" />
                      <span>Delivery Target: <strong className="text-[#E6E8E8] font-mono">{booking.requested_date}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#7A7A7A]" />
                      <span className="font-mono text-[#7A7A7A]">Logged: {booking.created_at}</span>
                    </div>
                  </div>

                  {/* Pending Decision Buttons */}
                  {isPending && (
                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <button
                        onClick={() => handleAccept(booking.id)}
                        disabled={processingId === booking.id}
                        className="px-5 py-2.5 rounded-[16px] bg-[#5E8A67] hover:brightness-110 text-white text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Accept Offer</span>
                      </button>
                      <button
                        onClick={() => handleOpenDeclineModal(booking.id)}
                        disabled={processingId === booking.id}
                        className="px-5 py-2.5 rounded-[16px] bg-[#262626] text-[#B85C5C] hover:bg-[#B85C5C]/15 border border-[#B85C5C]/40 text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  )}

                  {/* Declined Status Pill */}
                  {isDeclined && booking.decline_reason && (
                    <div className="text-xs text-[#B85C5C] bg-[#B85C5C]/15 px-3.5 py-1.5 rounded-[16px] border border-[#B85C5C]/30">
                      Reason Tag: <strong className="font-medium">{booking.decline_reason}</strong>
                    </div>
                  )}

                  {/* Accepted Status Pill */}
                  {isAccepted && (
                    <div className="text-xs text-[#5E8A67] bg-[#5E8A67]/15 px-3.5 py-1.5 rounded-[16px] border border-[#5E8A67]/30 flex items-center gap-1.5">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-[24px] border border-[#3A3A3A] bg-[#2E2E2E] shadow-[0_16px_48px_rgb(0,0,0,0.5)] p-7 sm:p-8 space-y-6 animate-slide-up">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-2xl font-light text-[#E6E8E8]">Decline Commission</h3>
                <p className="text-xs text-[#CFC7C1] mt-1 font-light leading-relaxed">
                  Categorize the reason so the client is smoothly presented alternative talent through the DP1 protocol.
                </p>
              </div>
              <button
                onClick={() => setDecliningBookingId(null)}
                className="p-1 rounded-[12px] text-[#7A7A7A] hover:text-[#E6E8E8] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reason Options */}
            <div className="space-y-2.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#CFC7C1]">
                Decline Rationale Tag <span className="text-[#B85C5C]">*</span>
              </label>
              {DECLINE_REASONS.map((reason) => (
                <button
                  key={reason}
                  type="button"
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full p-3.5 rounded-[16px] text-xs font-medium border text-left flex items-center justify-between transition-all duration-200 ${
                    selectedReason === reason
                      ? "border-[#B85C5C] bg-[#B85C5C]/15 text-[#B85C5C] shadow-sm"
                      : "border-[#444444] bg-[#262626] text-[#CFC7C1] hover:border-[#7A7A7A] hover:text-[#E6E8E8]"
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
                className="px-5 py-2.5 rounded-[16px] border border-[#444444] text-[#CFC7C1] text-xs font-medium hover:text-[#E6E8E8] hover:border-[#7A7A7A] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDecline}
                disabled={processingId === decliningBookingId}
                className="px-5 py-2.5 rounded-[16px] bg-[#B85C5C] text-white text-xs font-semibold hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5 shadow-sm"
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
