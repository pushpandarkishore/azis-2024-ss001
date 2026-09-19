# AZIS-UXE4MN

# SkillSwap — Creator Gig Marketplace for Young Creatives
> **Code2Career AI Hackathon — Track 2: Real-World AI Products**

SkillSwap is a production-grade, two-sided creator economy marketplace built for young creatives (designers, video editors, copywriters, audio engineers, and tutors) to exchange services, book gigs, and collaborate seamlessly — **with zero authentication required for evaluation**.

[![Next.js 14](https://img.shields.io/badge/Next.js-14+-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![SQLite](https://img.shields.io/badge/SQLite-better--sqlite3-003B57?logo=sqlite)](https://sqlite.org)

---

## 🧭 Grader Navigation Paths & Core Evaluation Checklist

Evaluators can access all views directly via the fixed **Top Navigation Role Switcher Banner** without creating an account or logging in. Default identities are pre-seeded:
- **Client Identity**: `clientId: "client_demo"` (Demo Client)
- **Creator Identity**: `creatorId: "creator_demo"` (Alex Rivera / Demo Creator)

| # | Evaluation Requirement | Route / Endpoint | Description |
|---|------------------------|------------------|-------------|
| 1 | **Feature 1: Post a Gig** | [`/gigs/new`](http://localhost:3000/gigs/new) | Form with Title, Category, Rate, Description validation. Submits to `POST /api/gigs` and redirects to `/marketplace` showing the new gig card. |
| 2 | **Feature 2: Browse & Search** | [`/marketplace`](http://localhost:3000/marketplace) | Real-time search by title & description, category filter pills (All, Design, Video, Writing, Audio, Tutoring), dynamic sorting (Composite, Rate Low-High, Rate High-Low, Newest). |
| 3 | **Feature 3: Book a Gig** | Modal on [`/marketplace`](http://localhost:3000/marketplace) | Click "Book Now" on any card. Form requests Client Name, Project Scope/Notes, Requested Delivery Date. Submits to `POST /api/bookings` (status: `Pending`) and renders an immediate confirmation dialog with reference ID. |
| 4 | **Feature 4: Creator Dashboard** | [`/creator/dashboard`](http://localhost:3000/creator/dashboard) | Incoming booking request feed with client name, gig title, notes, delivery date, timestamp. Interactive "Accept" (marks `Accepted`) and "Decline" with quick decline reason tags ("Schedule Conflict", "Scope Mismatch", "Rate Incompatibility"). |
| 5 | **Feature 5: My Bookings** | [`/my-bookings`](http://localhost:3000/my-bookings) | Client portal listing bookings categorized by status tags (`Pending` in amber, `Accepted` in green, `Declined` in red/gray). Implements **DP1**: For any declined booking, surfaces the specific decline reason and an inline "Find Similar Gigs" recommendation strip pre-filtered to the same category. |
| 6 | **AI Barter Calculator** | [`/trade`](http://localhost:3000/trade) | Multi-factor barter valuation engine computing Labor Effort Units (LEU) × Market Scarcity Index (MSI). |

---

## 🔌 Standard REST API Specification

SkillSwap implements deterministic REST endpoints matching the standard evaluation schema:

### 1. `GET /api/health`
- **Response**: `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2026-09-18T19:43:09.992Z"
}
```

### 2. `GET /api/gigs?search=&category=&sort=`
- **Query Parameters**:
  - `search`: Case-insensitive keyword search matching title, description, or creator.
  - `category`: Filters by category (`Design`, `Video`, `Writing`, `Audio`, `Tutoring`).
  - `sort`: `composite` (Composite Recommended), `low_to_high` (Rate: Low to High), `high_to_low` (Rate: High to Low), `newest` (Newest).
- **Response**: `200 OK` with JSON array of gig objects.

### 3. `POST /api/gigs`
- **Request Body**:
```json
{
  "title": "Minimalist Vector Illustration & Icon Sets",
  "category": "Design",
  "rate": "$35/hr",
  "description": "Sharp scalable SVG icons and editorial graphics.",
  "creatorName": "Aria Tanaka"
}
```
- **Response**: `201 Created` with full gig object.

### 4. `GET /api/bookings?role=&userId=`
- **Query Parameters**:
  - `role`: `creator` or `client`.
  - `userId`: Optional specific ID (defaults to `creator_demo` or `client_demo`).
- **Response**: `200 OK` with JSON array of bookings.

### 5. `POST /api/bookings`
- **Request Body**:
```json
{
  "gigId": "gig_1",
  "clientName": "Demo Client",
  "notes": "Full brand identity refresh and component library.",
  "requestedDate": "2026-10-15"
}
```
- **Response**: `201 Created` with full booking object (initial status: `"Pending"`).

### 6. `PATCH /api/bookings/[id]`
- **Request Body**:
```json
{
  "status": "Accepted"
}
```
or
```json
{
  "status": "Declined",
  "declineReason": "Schedule Conflict"
}
```
- **Response**: `200 OK` with updated booking object.

---

## 🏛️ Architectural Decision Points (`DECISIONS.md`)

Full architectural rationale is codified in [`DECISIONS.md`](./DECISIONS.md):
- **DP1 · Rejection Protocol**: When a creator declines, the client immediately sees a clear rejection category tag (e.g., "Schedule Conflict") and an automated "Similar Available Creators" recommendation carousel pre-filtered to the same category and rate tier.
- **DP2 · Double Booking & Concurrency**: Gigs permit multiple concurrent "Pending" bookings until an offer is explicitly accepted by the creator.
- **DP3 · Marketplace Discovery Algorithm**: Gigs are ranked using a dynamic Composite Health Score: 40% Responsiveness Rate, 35% Completed Bookings, and a 25% Freshness Rotation Boost.

---

## 🔑 Test Credentials & Demo Personas

> **Important**: This application is intentionally built with **Zero Authentication / Login / Signup** to comply with the hackathon grading protocol. Evaluators do not need to register, remember passwords, or set up external auth providers.

The persistent **Top Navigation Role Switcher Banner** allows evaluators to toggle between pre-seeded test personas with a single click:

| Role | Persona Name | User ID | Pre-seeded State & Available Actions |
|------|-------------|---------|--------------------------------------|
| **Client** | `Demo Client` | `client_demo` | Can browse/search gigs, submit new bookings (`POST /api/bookings`), inspect booking status tags on `/my-bookings` (Pending, Accepted, Declined), and test the DP1 auto-recommendation strip for declined requests. |
| **Creator** | `Alex Rivera (Demo Creator)` | `creator_demo` | Can post new gigs on `/gigs/new` (`POST /api/gigs`), manage incoming requests on `/creator/dashboard`, accept pending bookings, or decline with quick reason tags. |

---

## 🛠️ Tech Stack & Setup

* **Track:** Code2Career Hackathon — Track 2: Real-World AI Products
* **Framework:** Next.js 14+ (App Router, Server + Client Components)
* **Language:** TypeScript 5 (Strict Mode, 100% type safety)
* **Styling:** Tailwind CSS, Lucide-React icons, glassmorphism design system
* **Database / State:** Local SQLite via `better-sqlite3` with automated schema initialization and pre-seeded realistic data (14+ gigs across Design, Video, Writing, Audio, Tutoring, plus live booking scenarios).

### Run Steps (Local Setup)

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/skillswap.git
cd skillswap

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:3000

# 5. (Optional) Run production build check
npm run build
```
