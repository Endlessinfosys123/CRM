# CRM System Implementation Plan

Build a comprehensive CRM system for an IT company using Next.js, Supabase, and Vercel.

## Proposed Changes

### Database Schema (Supabase Postgres)

#### [NEW] `schema.sql`
- `profiles`: user metadata and roles (`admin`, `employee`)
- `leads`: core lead data
- `activities`: call logs and history for leads
- `followups`: scheduled followups for leads
- `sync_logs`: tracking Google Sheet sync events

### Frontend Architecture (Next.js)

#### [NEW] `layout.tsx` / `components/Sidebar`
- Sidebar with navigation: Dashboard, Leads, Pipeline, Followups, Settings.
- Responsive design with Tailwind CSS.

#### [NEW] `pages/login`
- Supabase Auth integration.

#### [NEW] `pages/dashboard`
- Summary cards (Total Leads, Today's Followups, Closed, Pending).
- Recent activity feed.

#### [NEW] `pages/leads` & `pages/leads/[id]`
- Lead management table/list.
- Detailed view with activity history and followup scheduling.

#### [NEW] `pages/pipeline`
- Kanban board with drag-and-drop for lead stages.

### API Layer (Next.js API Routes)

#### [NEW] `api/sync`
- Webhook endpoint for Google Apps Script.
- Logic to upsert leads based on contact uniqueness.

#### [NEW] `api/leads`, `api/followups`, `api/activities`
- CRUD operations with role-based validation.

## Verification Plan

### Automated Tests
- Postman/Fetch tests for the `/api/sync` webhook.
- Unit tests for lead filtering and role-based logic.

### Manual Verification
- Testing the login flow for Admin and Employee accounts.
- Verifying the Kanban drag-and-drop functionality.
- Testing the manual sync button.
- Responsive design check on mobile/desktop.
