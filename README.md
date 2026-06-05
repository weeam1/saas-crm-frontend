# Weeam CRM — Frontend

> A full-featured, enterprise-grade **Real Estate CRM SaaS** web application built with React, Chakra UI, and Redux Toolkit. It combines lead & deal management, telephony (WebRTC/SIP softphone), WhatsApp business messaging, HR & payroll, finance & invoicing, real-time notifications, and rich reporting into a single multi-tenant, role-based platform.

![Version](https://img.shields.io/badge/version-2.1-blue) ![React](https://img.shields.io/badge/React-17.0.2-61dafb) ![Chakra UI](https://img.shields.io/badge/Chakra%20UI-1.8-319795) ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.5-764abc) ![License](https://img.shields.io/badge/license-Private-lightgrey)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Theming & UI](#theming--ui)
- [Coding Conventions](#coding-conventions)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview

**Weeam CRM Frontend** is the single-page application (SPA) layer of the Weeam real-estate sales platform. It is designed for real-estate agencies that need to manage the full sales lifecycle — from raw lead capture, through agent assignment, calling and WhatsApp follow-up, to deal closure, invoicing, and back-office HR/payroll.

The application is **multi-tenant** (agency-aware), **role-based** (Super Admin, Admin, Manager, Team Leader, Executive, Telecaller, HR, Accountant), and **real-time** (notifications, presence, live leads, and chat). It embeds a full **WebRTC/SIP softphone** and a **WhatsApp Web–style messaging client** directly in the browser.

---

## Key Features

### 🎯 Lead & Sales Management
- **Lead lifecycle** — capture, qualify, assign, and track leads across stages with a configurable lead cycle.
- **Fresh leads & lead pool** — real-time inbound lead capture with live pop-up alerts and a shared lead pool.
- **Lead settings & custom fields** — agency-configurable lead attributes, statuses, sources, and dynamic custom fields.
- **Deals pipeline** — convert qualified leads into deals and track them to closure.
- **Contacts** — centralized contact database with international phone validation.

### 📞 Telephony (WebRTC / SIP Softphone)
- **In-browser softphone** — place and receive calls directly from the CRM with no external dialer.
- **Call history & feedback** — full call logs, outcome/feedback capture, and configurable dialer settings.
- **Call recording & playback** — record calls with in-app audio waveform playback.

### 💬 WhatsApp Business Messaging
- **WhatsApp Web–style client** — live two-way chat with real-time message sync.
- **Media handling** — send and receive images, documents, and other media with emoji support.
- **Per-agent sessions** — isolated messaging sessions per user/instance.

### 📧 Communication & Outreach
- **Email** — message history, templates, and rich-text composition.
- **SMS / text messaging** — outbound and inbound text messaging.
- **Announcements** — broadcast messages with in-app, sound, and push notifications.

### 👥 HR, Attendance & Payroll
- **HR module** — employee records, hiring, and performance evaluation.
- **Attendance** — clock-in/out tracking with office timings and timezone awareness.
- **Payroll** — salary processing with configurable late/early deduction rules and off-days.
- **Daily reports** — agent daily activity reporting.

### 💰 Finance & Billing
- **Invoicing** — create and export invoices to PDF.
- **Payments** — integrated online payment processing.
- **Bank accounts & finance dashboards** — account management and financial overview.
- **Currency points** — multi-currency support and conversion handling.

### 🏢 Property & Listings
- **Property & listing management** — inventory of properties and listings.
- **Developers directory** — manage real-estate developers.
- **Document management** — upload, organize, and view documents (with in-app PDF viewing).

### 📅 Productivity
- **Tasks** — assignable to-dos with status tracking.
- **Meetings** — schedule and manage meetings.
- **Calendar** — full calendar with resource timeline views.
- **Surveys** — create and collect survey responses.

### 📊 Reporting & Analytics
- **Dashboards & reports** — interactive charts and KPIs across sales, calls, and team performance.
- **Data export** — export to Excel and CSV, plus chart/screenshot and PDF export.

### ⚙️ Administration
- **User & role management** — manage users, teams, and hierarchical reporting structures.
- **Granular permissions** — fine-grained, per-feature access control.
- **Agencies & settings** — multi-agency configuration and global admin settings.
- **Table/field configuration** — customize visible columns and form fields.
- **Action & activity logs** — auditable record of user actions.

### 🔔 Platform Capabilities
- Real-time notifications with browser push and sound alerts.
- Online-user presence indicators.
- Dark / light mode and full RTL (right-to-left) language support.
- QR code generation, drag-and-drop interfaces, on-upload image compression, and virtualized tables for large datasets.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React `17.0.2` (Create React App + `react-app-rewired` / `customize-cra`) |
| **UI library** | Chakra UI `1.8` (`@chakra-ui/react`, `@chakra-ui/icons`, theme tools), Emotion |
| **State** | Redux Toolkit `2.5`, React-Redux `7.2`, Redux Thunk |
| **Routing** | React Router DOM `6.14` |
| **Forms & validation** | React Hook Form, Formik, Yup, Zod |
| **HTTP** | Axios |
| **Real-time** | Socket.IO Client, native WebSocket |
| **Telephony** | JsSIP, opus-recorder, wavesurfer.js |
| **Charts** | ApexCharts, Chart.js, Recharts |
| **Calendar** | FullCalendar `6.1` (resource timeline, scrollgrid) |
| **PDF / Docs** | `@react-pdf/renderer`, jsPDF, `@react-pdf-viewer`, react-pdf |
| **Data export** | ExcelJS, xlsx, PapaParse, file-saver |
| **Payments** | Stripe |
| **Dates** | date-fns, dayjs, moment, moment-timezone |
| **Phone** | google-libphonenumber, libphonenumber-js, react-phone-input-2 |
| **Utilities** | crypto-js, fuse.js (fuzzy search), use-debounce, browser-image-compression, jwt-decode |
| **Animation** | Framer Motion |
| **Deployment** | gh-pages, GitHub Actions |

---

## Architecture

The app is a client-side SPA that talks to a REST backend and multiple real-time channels:

```
                        ┌───────────────────────────────────────────────┐
                        │               Weeam CRM Frontend              │
                        │                 (React SPA)                   │
                        │                                               │
  Browser  ───────────▶│  Chakra UI  ◀──▶  Redux Store  ◀──▶  Hooks    │
                        │     │                  │                │     │
                        │     ▼                  ▼                ▼     │
                        │  Layouts/Views   Slices/Thunks    Services   │
                        └───────┬───────────────┬───────────────┬──────┘
                                │               │               │
                  REST (Axios)  │   Socket.IO   │   WebSocket    │  SIP/WebRTC
                                ▼               ▼               ▼  (JsSIP)
                        ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
                        │  Backend API │ │  Socket.IO  │ │  SIP Servers │
                        │  (Express)   │ │   Server    │ │ + WhatsApp   │
                        └──────────────┘ └─────────────┘ └──────────────┘
```

- **Presentation** — Chakra UI components organized into layouts and feature views.
- **State** — Redux Toolkit slices for domain state, with React Context for shared UI state.
- **Services** — a thin API layer (Axios), Socket.IO and WebSocket clients, a SIP/WebRTC layer, and a WhatsApp messaging client.
- **Hooks** — reusable logic for permissions, sessions, real-time events, timezones, downloads, and more.

---

## Theming & UI

- **Chakra UI** theme with custom foundations (colors, typography, breakpoints, shadows, spacing) and component styles.
- **Dark / light mode** with a runtime theme editor.
- **RTL support** for right-to-left languages.
- **40+ reusable components** — data tables, charts, modals, dropzones, date pickers, pagination, search, loaders, and more.

---

## Coding Conventions

- **Indentation:** tabs (matches existing source).
- **Imports:** use the source-relative path aliases rather than long relative paths.
- **ESLint:** extends `react-app` + `react-app/jest`.
- **Domain organization:** keep feature code grouped by module, reusable UI in shared components, side-effect logic in hooks and services, and validation in schemas.
- **State:** add new global state as a Redux slice and register it in the store.

---

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| **API calls fail / CORS** | Confirm the backend is running and the environment is set to development. |
| **No real-time updates** | Verify the socket server configuration and that the servers are reachable. |
| **Softphone not registering** | Check SIP server configuration and grant microphone permissions. |
| **Chunk load errors after deploy** | Handled automatically (auto-reload); hard-refresh if it persists. |
| **Blank page / push notifications blocked** | Grant browser notification permission when prompted on load. |

---

## License

**Private / Proprietary** — © Weeam. All rights reserved. Internal use only.

---

<sub>Built with React, Chakra UI, and Redux Toolkit • Weeam CRM Frontend v2.1</sub>
