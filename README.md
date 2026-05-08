# JinjaMonogatari CMS ⛩️📝

JinjaMonogatari CMS is a React + TypeScript web application for managing the structured, citation-backed shrine content that powers the JinjaMonogatari platform. It gives editors and admins a focused workspace for importing shrine records, drafting researched content, validating blockers, submitting work for review, and publishing approved shrine information to the public mobile experience.

---

## ✨ Overview

The CMS is the internal content-management layer for JinjaMonogatari. While the mobile app is focused on discovery and reading, the CMS is focused on research operations: entering shrine metadata, linking tags and kami, editing history/folklore/gallery content, managing citations, checking audit blockers, and moving shrine records through a review workflow.

This repository contains **only the CMS frontend**. The CMS consumes the JinjaMonogatari API and supports the content pipeline used by the mobile client.

Related repositories:
- API: https://github.com/KobenjiSan/jinjamonogatari-api
- Mobile: https://github.com/KobenjiSan/jinjamonogatari-mobile

## 🧠 Problem & Motivation

A shrine discovery app cannot scale responsibly if cultural information is hardcoded, unsourced, or pushed directly to users without review. The CMS exists to make content creation slower in the right places: structured fields, citation management, role-based permissions, audit blockers, and admin review all help protect the quality and transparency of the public-facing experience.

The goal is not just to let someone “edit content.” The goal is to support a research-backed publishing workflow where editors can draft information clearly and admins can verify whether that content is ready to be shown to users.

## 🏗 Architecture

The CMS is organized around route-level pages, feature-specific modules, shared UI patterns, and a centralized API/auth boundary. The structure is designed to keep page files readable while allowing complex shrine editor flows to be split into smaller, purpose-built components.

### Architecture overview

- **App shell + routing** (`/src/App.tsx`, `/src/routes`, `/src/layouts`)
  - Handles authenticated vs unauthenticated routing
  - Uses an app layout with a persistent side navigation
  - Routes users into dashboard, shrine management, editor, admin, and supporting pages
- **API boundary** (`/src/api`)
  - Central `apiClient` for API calls
  - Shared response/error parsing behavior
  - Keeps request details out of page and editor components
- **Auth layer** (`/src/auth`)
  - CMS login flow
  - Token storage helpers
  - Auth provider for current-user state, role state, and session boundaries
- **Config layer** (`/src/config`)
  - Environment validation through `VITE_API_BASE_URL`
  - Fails early when required configuration is missing
- **Feature modules** (`/src/features`)
  - Shrine editor workflows
  - Shrine list/table behavior
  - User management
  - Audit/dashboard surfaces
  - Shared feature-specific helpers and types
- **Shared UI layer** (`/src/shared`, `/src/components`)
  - Reusable modals, confirmation flows, form sections, list/table shells, and common styling patterns

### Major components

- **Authentication + role gating**
  - CMS users authenticate through the API and receive token-based sessions.
  - Role-aware rendering controls which pages and actions are visible to editors vs admins.
  - UI read-only states mirror backend write policies so users get immediate feedback before restricted actions are attempted.

- **Shrine list workspace**
  - Displays shrine records by workflow status.
  - Supports search, filtering, sorting, and pagination.
  - Surfaces audit blockers so users can see which records need attention before review or publication.
  - Provides entry points for importing, creating, editing, reviewing, and deleting shrine records where allowed.

- **Shrine editor workspace**
  - Uses a tabbed editor model so shrine content areas stay separated and manageable.
  - Supports editing metadata, notes, tags, kami links, history entries, folklore entries, gallery images, citations, and status/review information.
  - Keeps local draft state visible so editors can understand what changed before saving.

- **Citation + image workflows**
  - Treats citations as reusable research objects instead of one-off text fields.
  - Supports citation linking across shrine content areas.
  - Includes Cloudinary-backed image upload support for media workflows where implemented.

- **Review + audit workflow**
  - Editors can submit shrine records for review after audit validation.
  - Admins can publish or reject submissions with reviewer comments.
  - Review history is preserved so editors can understand rejection context and admins can inspect previous decisions.

- **Admin surfaces**
  - User management allows admins to inspect users, update roles, and remove users where safe.
  - Audit/admin pages provide visibility into system quality and content readiness.

### Key technical decisions

- **Feature-oriented CMS structure**: complex editor workflows are split by content area instead of being forced into a single giant editor component.
- **Centralized API client**: all request parsing and failure handling goes through one boundary, which keeps components focused on UI and state.
- **Role + status-aware UI**: editors and admins see different actions based on role and shrine status, reducing accidental invalid edits.
- **Audit-first publishing model**: audit blockers are surfaced before review/publish decisions so quality checks become part of the workflow, not an afterthought.
- **Reusable modal patterns**: base and confirmation modals keep destructive actions, save confirmations, and review decisions consistent across the CMS.
- **Citation reuse over duplication**: citation linking is treated as a core content-management concern because research transparency is one of the platform’s main values.

## 🚀 Features

- CMS authentication:
  - Login against the JinjaMonogatari API
  - Token storage and session restoration
  - Logout flow
- Role-based CMS access:
  - Editor/admin-aware navigation
  - Read-only editor states based on role and shrine status
  - Backend-aligned restrictions for protected actions
- Shrine list management:
  - Status tabs for workflow grouping
  - Search, filtering, sorting, and pagination
  - Shrine ID, status, review, and blocker visibility
- Shrine creation/import:
  - Manual shrine creation by name/address or coordinates
  - Import workflow powered by API-side geocoding and OpenStreetMap/Overpass lookup
  - Preview-before-import flow
- Shrine editor:
  - Metadata editing
  - Notes editing
  - Tag linking/unlinking
  - Kami linking, creation, editing, and removal from shrine records
  - History CRUD
  - Folklore CRUD
  - Gallery CRUD
  - Citation overview and reuse workflows
  - Status/review tab
- Review workflow:
  - Submit for review
  - Admin publish
  - Admin reject with reviewer message
  - Review history modal
  - Recently rejected indicator on shrine lists
- Etiquette editor:
  - Metadata editing
  - Etiquette step editing
  - At a Glance editing
- Kami editor:
  - Kami CRUD
- Tag editor:
  - Tag CRUD
- Audit support:
  - Audit checks surfaced in editor/list views
  - Blockers visible before review/publish decisions
- Admin user management:
  - User list with filtering/sorting
  - Role update modal
  - User removal flow with protection for current user actions
- Admin audit view:
  - Global Audit list with filtering/sorting
- UI system:
  - Side navigation app layout
  - Global styling system
  - Reusable list/table shell patterns
  - Base modal and confirmation modal patterns
  - Toast feedback for user actions

## 🛠 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- React Router DOM

### UI / Styling
- CSS with global design tokens/patterns
- Noto Sans
- Noto Sans JP
- React Icons
- React Hot Toast

### Data / Networking
- Fetch-based API client
- Environment-based API configuration
- Feature-level API helpers and request/response types

### Auth / Security
- JWT access tokens
- Refresh-token session support through the API
- Central token storage helpers
- Role-based page/action visibility
- Backend-enforced write policy alignment

### External Platform Integration
- JinjaMonogatari API

### Tools
- npm
- ESLint
- TypeScript compiler
- Vite dev/build tooling

## 📸 Screenshots / Demo

> Screenshots coming soon.

## ⚙️ Local Development

### Prerequisites

- Node.js (LTS)
- npm
- A running JinjaMonogatari API instance
- Valid CMS-capable user account from the API

### Setup

1) Clone

```bash
git clone https://github.com/KobenjiSan/jinjamonogatari-cms.git
cd jinjamonogatari-cms
```

2) Install dependencies

```bash
npm install
```

3) Configure environment

Create a `.env.local` file at the repo root:

```bash
VITE_API_BASE_URL=http://<YOUR_API_HOST>:<PORT>
```

Notes:
- `VITE_API_BASE_URL` should point to the running JinjaMonogatari API.
- The CMS expects the API to provide authentication, shrine editor, review, audit, user, tag, kami, citation, and media-related endpoints.
- CMS access depends on user role. Regular mobile users should not be treated as CMS editors/admins unless their API role allows it.

4) Run the CMS

```bash
npm run dev
```

5) Build for production

```bash
npm run build
```

6) Preview production build locally

```bash
npm run preview
```

## 🔐 Authentication / Security

- CMS authentication is token-based and backed by the JinjaMonogatari API.
- Access tokens and refresh tokens are handled through the centralized auth/token storage layer.
- The frontend uses role-aware rendering to reduce invalid actions before they happen.
- The backend remains responsible for enforcing real write permissions.
- Shrine editing rules are status-aware:
  - Editors should not modify shrines that are under review or published.
  - Admins should not modify published shrines through normal editor commands.
  - Protected write endpoints should be blocked by the API policy layer, not only by the UI.

## 🧩 Key Engineering Decisions

- **Separate CMS from the public app**: the CMS is intentionally not part of the mobile client. It serves editors/admins, not general users.
- **Workflow statuses drive the UI**: import, draft, review, published, and recently rejected states shape which actions are visible and which records need attention.
- **Tabbed shrine editor**: shrine content is too broad for one form. Tabs keep metadata, kami, history, folklore, gallery, citations, notes, and status workflows understandable.
- **Review history over single-state review**: rejection/publish decisions are stored as history so users can inspect how a shrine moved through the workflow.
- **Audit blockers before publication**: incomplete or invalid records should be caught before content reaches the mobile app.
- **Shared confirmation patterns**: destructive actions and publishing decisions require deliberate confirmation to reduce accidental changes.
- **Frontend guidance, backend authority**: the CMS shows users what they can do, but the API is still the source of truth for authorization and data integrity.

## 📈 Future Improvements

- Expand and polish Cloudinary image upload flows across all shrine content areas
- Improve import deduplication and result paging for repeated location imports
- Add a true invite/admin-create-user workflow for CMS users
- Refactor citation and tag management into cleaner shared abstractions
- Add stronger automated test coverage for auth, role gating, shrine editor flows, review workflow, and admin actions
- Standardize loading, empty, and error states across every CMS page
- Improve audit performance and audit summaries for larger shrine datasets
- Add richer dashboard metrics for editor/admin progress tracking

## 🧪 Testing

Automated test coverage is not yet established.

## 🚢 Deployment

- The CMS is intended to deploy as a static Vite application.
- Current deployment path: Vercel.
- Production deployment requires `VITE_API_BASE_URL` to point to the deployed JinjaMonogatari API.
- The API must allow the CMS origin through its CORS configuration.

## 👤 Author

Samuel Keller  
B.S. Information Technology (Software Development + Digital Media) — Georgia Gwinnett College
