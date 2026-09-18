"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  CheckCircle2,
  Calendar,
  X,
  PlusCircle,
  ArrowRight,
  Sparkles,
  User,
  SlidersHorizontal,
  Clock,
  Send,
  AlertCircle
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

const CATEGORIES = [
  { id: "All", label: "All Craft" },
  { id: "Design", label: "Brand & UI/UX" },
  { id: "Video", label: "Motion & Editing" },
  { id: "Writing", label: "Strategy & Copy" },
  { id: "Audio", label: "Sound & Music" },
  { id: "Tutoring", label: "1-on-1 Mentorship" },
];

const SORT_OPTIONS = [
  { value: "composite", label: "Composite Recommended" },
  { value: "low_to_high", label: "Rate: Low to High" },
  { value: "high_to_low", label: "Rate: High to Low" },
  { value: "newest", label: "Newest Listings" },
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
    }, 150);
    return () => clearTimeout(timer);
  }, [fetchGigs]);

  const handleOpenBooking = (gig: Gig) => {
    setSelectedGig(gig);
    setBookingErrors({});
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
      errs.projectNotes = "Project scope and deliverables are required";
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
    <div className="min-h-screen px-4 sm:px-8 py-16 max-w-[1280px] mx-auto">
      {/* Newly created toast */}
      {showCreatedToast && (
        <div className="mb-8 p-4 rounded-[16px] bg-[#2E2E2E] border border-[#5E8A67]/50 text-[#E6E8E8] flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-[#5E8A67]" />
            <span className="font-medium">Your service listing has been successfully published to the marketplace.</span>
          </div>
          <button
            onClick={() => setShowCreatedToast(false)}
            className="text-[#CFC7C1] hover:text-[#E6E8E8] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Editorial Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-8 border-b border-[#3A3A3A]">
        <div className="space-y-3 max-w-2xl">
          <span className="text-xs font-medium tracking-widest text-[#B4887A] uppercase">
            Curated Marketplace
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#E6E8E8] tracking-tight">
            Creative Services & Gigs
          </h1>
          <p className="text-sm sm:text-base text-[#CFC7C1] font-normal leading-relaxed">
            Browse independent creative practitioners in brand identity, video editing, sound design, and long-form strategy.
          </p>
        </div>

        <Link
          href="/gigs/new"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-[16px] bg-[#C46A6D] text-white text-sm font-medium hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out shadow-sm shrink-0 self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Service</span>
        </Link>
      </div>

      {/* Search & Filter Controls */}
      <div className="space-y-6 mb-12">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filled Style Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CFC7C1]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by keywords, discipline, tools, or practitioner name..."
              className="w-full pl-11 pr-10 py-3.5 rounded-[14px] bg-[#262626] border border-[#444444] text-[#E6E8E8] placeholder-[#CFC7C1]/40 text-sm focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-all duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CFC7C1] hover:text-[#E6E8E8]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Dynamic Sorting Dropdown */}
          <div className="relative min-w-[240px]">
            <div className="relative">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CFC7C1] pointer-events-none" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full pl-11 pr-10 py-3.5 rounded-[14px] bg-[#262626] border border-[#444444] text-[#E6E8E8] text-sm focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#CFC7C1] text-xs">
                ▼
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected =
              category === cat.id ||
              (cat.id === "Video" && category === "Video Editing") ||
              (cat.id === "Video Editing" && category === "Video");
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 ease-out border ${
                  isSelected
                    ? "bg-[#C46A6D] text-white border-[#C46A6D] shadow-sm"
                    : "bg-[#2E2E2E] text-[#CFC7C1] border-[#3A3A3A] hover:border-[#7A7A7A] hover:text-[#E6E8E8]"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* SKELETON LOADING (Instead of Spinners) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="rounded-[24px] bg-[#2E2E2E] border border-[#3A3A3A] p-8 space-y-6 skeleton-box"
            >
              <div className="flex justify-between items-center">
                <div className="w-24 h-4 bg-[#262626] rounded-md" />
                <div className="w-16 h-4 bg-[#262626] rounded-md" />
              </div>
              <div className="w-4/5 h-7 bg-[#262626] rounded-md" />
              <div className="space-y-2">
                <div className="w-full h-3 bg-[#262626] rounded-md" />
                <div className="w-3/4 h-3 bg-[#262626] rounded-md" />
              </div>
              <div className="pt-6 border-t border-[#3A3A3A] flex justify-between items-center">
                <div className="w-28 h-4 bg-[#262626] rounded-md" />
                <div className="w-20 h-8 bg-[#262626] rounded-[16px]" />
              </div>
            </div>
          ))}
        </div>
      ) : gigs.length === 0 ? (
        /* Editorial Empty State with Next Action */
        <div className="rounded-[24px] bg-[#2E2E2E] border border-[#3A3A3A] p-16 text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#262626] border border-[#444444] mx-auto flex items-center justify-center text-[#B4887A]">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-2xl font-normal text-[#E6E8E8]">
            No services match this criteria
          </h2>
          <p className="text-xs text-[#CFC7C1] leading-relaxed max-w-sm mx-auto">
            Try broadening your search term or exploring another creative discipline.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="px-5 py-2.5 rounded-[16px] bg-[#262626] text-[#E6E8E8] border border-[#444444] text-xs font-medium hover:bg-[#1F2224] transition-colors"
            >
              Reset Filters
            </button>
            <Link
              href="/gigs/new"
              className="px-5 py-2.5 rounded-[16px] bg-[#C46A6D] text-white text-xs font-medium hover:bg-[#B55B5E] transition-colors"
            >
              List a Service
            </Link>
          </div>
        </div>
      ) : (
        /* Editorial Cards (Radius 24px, Bg #2E2E2E, 1px border #3A3A3A, 4px lift on hover) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig) => {
            const isHighlighted = gig.id === highlightGigId;
            return (
              <div
                key={gig.id}
                id={`gig-card-${gig.id}`}
                className={`rounded-[24px] bg-[#2E2E2E] border transition-all duration-200 ease-out hover:-translate-y-1 p-8 flex flex-col justify-between space-y-6 ${
                  isHighlighted
                    ? "border-[#C46A6D] ring-1 ring-[#C46A6D]/40"
                    : "border-[#3A3A3A] hover:border-[#7A7A7A]/50"
                }`}
              >
                <div className="space-y-4">
                  {/* Category Badge & JetBrains Mono Rate */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-medium tracking-wider uppercase text-[#B4887A]">
                      {gig.category}
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#E6E8E8] bg-[#262626] px-2.5 py-1 rounded-md border border-[#444444]">
                      {gig.rate}
                    </span>
                  </div>

                  {/* Editorial Serif Heading */}
                  <h3 className="font-serif text-2xl font-normal text-[#E6E8E8] leading-snug line-clamp-2 hover:text-[#C46A6D] transition-colors">
                    {gig.title}
                  </h3>

                  {/* Clean Body Excerpt */}
                  <p className="text-xs text-[#CFC7C1] leading-relaxed line-clamp-3">
                    {gig.description}
                  </p>
                </div>

                {/* Creator Footer with 16px Rounded Button */}
                <div className="pt-6 border-t border-[#3A3A3A] space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <p className="font-medium text-[#E6E8E8]">{gig.creator_name}</p>
                      <p className="font-mono text-[11px] text-[#5E8A67] mt-0.5">
                        {Math.round((gig.responsiveness_rate || 0.95) * 100)}% responsiveness
                      </p>
                    </div>
                    <span className="font-mono text-[11px] text-[#CFC7C1]">
                      {gig.completed_bookings || 12} completed
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleOpenBooking(gig)}
                      className="flex-1 py-3 px-5 rounded-[16px] bg-[#C46A6D] text-white text-xs font-medium hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out shadow-sm flex items-center justify-center gap-2"
                    >
                      <span>Book Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={`/trade?gigId=${gig.id}`}
                      className="p-3 rounded-[16px] bg-[#262626] border border-[#444444] text-[#CFC7C1] hover:text-[#E6E8E8] hover:border-[#7A7A7A] transition-colors"
                      title="Simulate barter equivalence"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#B4887A]" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDITORIAL BOOKING MODAL */}
      {selectedGig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2224]/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[24px] bg-[#2E2E2E] border border-[#3A3A3A] p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-[#B4887A] font-medium">
                  Direct Booking Form
                </span>
                <h2 className="font-serif text-2xl font-normal text-[#E6E8E8]">
                  {selectedGig.title}
                </h2>
                <p className="text-xs text-[#CFC7C1]">
                  Offered by <strong className="text-[#E6E8E8]">{selectedGig.creator_name}</strong> &middot; Rate: <span className="font-mono text-[#E6E8E8]">{selectedGig.rate}</span>
                </p>
              </div>
              <button
                onClick={handleCloseBooking}
                className="p-2 rounded-xl text-[#CFC7C1] hover:text-[#E6E8E8] hover:bg-[#262626] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {bookingErrors.form && (
              <div className="p-3 rounded-[14px] bg-[#B85C5C]/10 border border-[#B85C5C]/30 text-[#B85C5C] text-xs">
                {bookingErrors.form}
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#CFC7C1] mb-1.5">
                  Client Name <span className="text-[#B85C5C]">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => {
                    setClientName(e.target.value);
                    if (bookingErrors.clientName) setBookingErrors((prev) => ({ ...prev, clientName: "" }));
                  }}
                  className="w-full px-4 py-3 rounded-[14px] bg-[#262626] border border-[#444444] text-[#E6E8E8] text-sm focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-colors"
                />
                {bookingErrors.clientName && (
                  <p className="text-[#B85C5C] text-[11px] mt-1">{bookingErrors.clientName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CFC7C1] mb-1.5">
                  Project Scope & Deliverables <span className="text-[#B85C5C]">*</span>
                </label>
                <textarea
                  rows={4}
                  value={projectNotes}
                  onChange={(e) => {
                    setProjectNotes(e.target.value);
                    if (bookingErrors.projectNotes) setBookingErrors((prev) => ({ ...prev, projectNotes: "" }));
                  }}
                  placeholder="Outline requested milestones, formats, reference links, and expectations..."
                  className="w-full p-4 rounded-[14px] bg-[#262626] border border-[#444444] text-[#E6E8E8] text-sm focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-colors"
                />
                {bookingErrors.projectNotes && (
                  <p className="text-[#B85C5C] text-[11px] mt-1">{bookingErrors.projectNotes}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#CFC7C1] mb-1.5">
                  Requested Delivery Date <span className="text-[#B85C5C]">*</span>
                </label>
                <input
                  type="date"
                  value={requestedDate}
                  onChange={(e) => {
                    setRequestedDate(e.target.value);
                    if (bookingErrors.requestedDate) setBookingErrors((prev) => ({ ...prev, requestedDate: "" }));
                  }}
                  className="w-full px-4 py-3 rounded-[14px] bg-[#262626] border border-[#444444] text-[#E6E8E8] text-sm focus:border-[#C46A6D] focus:ring-1 focus:ring-[#C46A6D] focus:outline-none transition-colors"
                />
                {bookingErrors.requestedDate && (
                  <p className="text-[#B85C5C] text-[11px] mt-1">{bookingErrors.requestedDate}</p>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseBooking}
                  className="px-5 py-2.5 rounded-[16px] text-xs font-medium text-[#CFC7C1] hover:text-[#E6E8E8] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingBooking}
                  className="px-6 py-3 rounded-[16px] bg-[#C46A6D] text-white text-xs font-medium hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out shadow-sm disabled:opacity-50"
                >
                  {submittingBooking ? "Creating Booking..." : "Submit Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDITORIAL CONFIRMATION DIALOGUE */}
      {confirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F2224]/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[24px] bg-[#2E2E2E] border border-[#3A3A3A] p-8 space-y-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-[#5E8A67]/15 border border-[#5E8A67]/40 flex items-center justify-center mx-auto text-[#5E8A67]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-wider text-[#B4887A] font-medium">
                Booking Request Active
              </span>
              <h3 className="font-serif text-2xl font-normal text-[#E6E8E8]">
                Inquiry Submitted
              </h3>
              <p className="text-xs text-[#CFC7C1]">
                Your booking request is now registered with initial status <span className="text-[#C89B53] font-medium">Pending</span>.
              </p>
            </div>

            <div className="p-4 rounded-[16px] bg-[#262626] border border-[#3A3A3A] text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-[#CFC7C1]">Reference ID:</span>
                <span className="font-mono font-medium text-[#B4887A]">
                  {confirmation.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#CFC7C1]">Service:</span>
                <span className="font-medium text-[#E6E8E8] line-clamp-1">{confirmation.gig_title}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#CFC7C1]">Target Date:</span>
                <span className="font-mono text-[#E6E8E8]">{confirmation.requested_date}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/my-bookings"
                className="flex-1 py-3 px-5 rounded-[16px] bg-[#C46A6D] text-white text-xs font-medium hover:bg-[#B55B5E] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ease-out text-center shadow-sm"
              >
                View in My Bookings
              </Link>
              <button
                onClick={() => setConfirmation(null)}
                className="py-3 px-5 rounded-[16px] bg-[#262626] border border-[#3A3A3A] text-[#CFC7C1] hover:text-[#E6E8E8] text-xs font-medium transition-colors"
              >
                Close
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
          <div className="w-8 h-8 rounded-full border-2 border-[#C46A6D] border-t-transparent animate-spin" />
        </div>
      }
    >
      <MarketplaceContent />
    </Suspense>
  );
}
