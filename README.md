# Weeam CRM — Frontend

> A full-featured, enterprise-grade **Real Estate CRM SaaS** web application built with React, Chakra UI, and Redux Toolkit. It combines lead & deal management, telephony (WebRTC/SIP softphone), WhatsApp business messaging, HR & payroll, finance & invoicing, real-time notifications, and rich reporting into a single multi-tenant, role-based platform.

![Version](https://img.shields.io/badge/version-2.1-blue) ![React](https://img.shields.io/badge/React-17.0.2-61dafb) ![Chakra UI](https://img.shields.io/badge/Chakra%20UI-1.8-319795) ![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.5-764abc) ![License](https://img.shields.io/badge/license-Private-lightgrey)

---

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Module Reference](#module-reference)
- [State Management](#state-management)
- [Real-Time & Telephony](#real-time--telephony)
- [Authentication & Authorization](#authentication--authorization)
- [Routing](#routing)
- [Theming & UI](#theming--ui)
- [Deployment](#deployment)
- [Coding Conventions](#coding-conventions)
- [Troubleshooting](#troubleshooting)

---

## Overview

**Weeam CRM Frontend** is the single-page application (SPA) layer of the Weeam real-estate sales platform. It is designed for real-estate agencies that need to manage the full sales lifecycle — from raw lead capture, through agent assignment, calling and WhatsApp follow-up, to deal closure, invoicing, and back-office HR/payroll.

The application is **multi-tenant** (agency-aware), **role-based** (Super Admin, Admin, Manager, Team Leader, Executive, Telecaller, HR, Accountant), and **real-time** (Socket.IO + native WebSocket channels for notifications, presence, live leads, and chat). It embeds a full **WebRTC/SIP softphone** and a **WhatsApp Web–style messaging client** directly in the browser.

- **App name:** `real-estate` (package), branded as **Weeam CRM**
- **Release version:** `2.1`
- **Default dev port:** `3006`
- **Backend API:** Node/Express service (see sibling `backend/` repo)

---

## Key Features

### 🎯 Lead & Sales Management
- **Lead lifecycle** — capture, qualify, assign, and track leads across stages with a configurable **lead cycle**.
- **Fresh Leads & Lead Pool** — real-time inbound lead capture with live modals (`NewFreshLeadModal`, `FreshLeadPoolModal`, `FreshApprovedLeadModal`) and a shared **lead pool** with v1 and v2 implementations.
- **Lead settings & custom fields** — agency-configurable lead attributes, statuses, sources, and dynamic custom fields.
- **Deals pipeline** — convert qualified leads into deals and track them to closure.
- **Contacts** — centralized contact database with phone validation (`google-libphonenumber`, `libphonenumber-js`).

### 📞 Telephony (WebRTC / SIP Softphone)
- **In-browser softphone** built on `jssip` with a full SIP UA, session manager, and audio elements (`src/lib/webrtc`).
- **Call history**, **dialer settings**, call feedback capture, and call recording (Opus via `opus-recorder` + `wavesurfer.js` waveform playback).
- Dual SIP server support (primary + secondary base URLs).

### 💬 WhatsApp Business Messaging
- **WhatsApp Web–style client** (`whatsapp`, `whatsapp-v2` views) with live socket sync, media download handling, emoji picker, and per-instance sessions.
- Dedicated socket service and media download handler (`src/services/whatsapp`).

### 📧 Communication & Outreach
- **Email** history, templates, and rich-text composition (`react-quill`).
- **SMS / Text messaging** module.
- **Announcements** — broadcast modal with sound + push notifications.

### 👥 HR, Attendance & Payroll
- **HR module**, **attendance** tracking, **payroll**, **hiring**, **evaluation**, and **daily reports**.
- Agency office timings, late/early deduction rules, off-days, and timezone configuration.

### 💰 Finance & Billing
- **Invoices** (with PDF generation via `@react-pdf/renderer` / `jspdf`), **payments** (Stripe integration), **bank accounts** (v1 & v2), **finance** dashboards, and **currency points**.

### 🏢 Property & Listings
- **Property** and **Listing** management, **developers** directory, and **document** management with PDF viewing (`@react-pdf-viewer`).

### 📅 Productivity
- **Tasks** (v1 & v2), **meetings**, **calendar** (FullCalendar with resource timeline), and **surveys**.

### 📊 Reporting & Analytics
- **Reports** (v1 & v2) with charts via ApexCharts, Chart.js, and Recharts.
- Excel/CSV export (`exceljs`, `xlsx`, `papaparse`, `file-saver`) and screenshot/PDF export (`html2canvas`, `html-to-image`).

### ⚙️ Administration
- **User & role management** (v1 & v2), **granular permissions** (`usePermissions`, `Permission` components), **agencies** management, **admin settings**, **table/field configuration**, and **action logs**.

### 🔔 Platform Capabilities
- Real-time **notifications** with browser push + sound, **online-user presence**, multi-channel WebSocket reducers, **dark/light mode + RTL** theming, **QR codes**, **drag-and-drop** (`react-beautiful-dnd`), image compression on upload, and virtualized large tables.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React `17.0.2` (Create React App + `react-app-rewired` / `customize-cra`) |
| **UI library** | Chakra UI `1.8` (`@chakra-ui/react`, `@chakra-ui/icons`, theme tools), Emotion |
| **State** | Redux Toolkit `2.5`, React-Redux `7.2`, Redux Thunk |
| **Routing** | React Router DOM `6.14` |
| **Forms & validation** | React Hook Form, Formik, Yup, Zod, `@hookform/resolvers` |
| **HTTP** | Axios |
| **Real-time** | Socket.IO Client `4.8`, native WebSocket service |
| **Telephony** | JsSIP `3.10`, opus-recorder, wavesurfer.js |
| **Charts** | ApexCharts, Chart.js, Recharts |
| **Calendar** | FullCalendar `6.1` (core, react, resource, resource-timeline, scrollgrid) |
| **PDF / Docs** | `@react-pdf/renderer`, jsPDF, `@react-pdf-viewer`, react-pdf |
| **Data export** | ExcelJS, xlsx, PapaParse, file-saver |
| **Payments** | Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`) |
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

**Service layers (`src/services`):**
- `api.js` — Axios wrapper (`getApi`, `postApi`, `putApi`, …) with token injection.
- `socketService.js` — Socket.IO client lifecycle.
- `WebSocketService.js` — native WebSocket channel for notifications/presence.
- `NotificationService.js` — browser push permission + delivery.
- `sip/` — SIP service glue around `src/lib/webrtc`.
- `whatsapp/` — WhatsApp socket, media downloads, and type helpers.

**Cross-cutting hooks (`src/hooks`):** permissions, user session, socket events, WhatsApp events, team hierarchy, timezones, notification history, media/PDF downloads, mobile detection, chunk-error recovery, and more.

---

## Project Structure

```
frontend/
├── public/                     # Static assets, index.html, audio, web workers (opus encoder)
├── src/
│   ├── api/                    # Domain API calls + RTK Query slice; webrtc API constants/types
│   ├── assets/                 # Images, CSS, fonts, sounds
│   ├── common/                 # Shared cross-module helpers
│   ├── components/             # 40+ reusable UI building blocks (tables, modals, charts,
│   │                           #   sidebar, navbar, fields, permission guards, etc.)
│   ├── config/                 # keys.js — env-var mapping
│   ├── constants/              # currencies, call-feedback constants
│   ├── contexts/               # RoleContext, SidebarContext, global store provider
│   ├── data/                   # Static JSON (countries, country codes)
│   ├── hooks/                  # Custom hooks (permissions, session, sockets, reports, …)
│   ├── layouts/                # admin / auth / user shells
│   ├── lib/webrtc/             # SIP UA, session manager, audio elements, models, utils
│   ├── redux/                  # Store + ~25 slices + websocket/webrtc reducers
│   ├── schema/                 # Yup/Zod validation schemas per domain
│   ├── services/               # API, sockets, SIP, WhatsApp, notifications
│   ├── storage/                # LocalStorage/session abstraction
│   ├── theme/                  # Chakra theme: foundations, components, styles
│   ├── utils/                  # Formatters, filters, phone validation, permissions, sound, …
│   ├── views/                  # Feature modules (see Module Reference)
│   │   ├── admin/              # The bulk of the app — 60+ feature areas
│   │   ├── auth/signIn/        # Login + agent onboarding
│   │   └── webrtc/             # Softphone UI (dialer, phone, history, settings)
│   ├── constant.js             # Resolves base URLs from env/node mode
│   ├── roles.js                # ROLE and ROLE_PATH maps
│   ├── routes.js / routesV2.js # Route tables (v1 & v2)
│   ├── sidebarRoutes.js        # Sidebar navigation config
│   └── index.js                # App bootstrap: providers, sockets, global modals
├── .env                        # Local environment configuration
├── jsconfig.json               # Path alias: @/* and baseUrl=src
├── package.json
└── README.md
```

> **Scale:** ~1,300 JS/JSX source files across ~60 admin feature modules.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 16 (LTS recommended)
- **npm** ≥ 8
- A running instance of the **Weeam CRM backend** (default `http://127.0.0.1:5000/`)

### Installation

```bash
# 1. Clone and enter the frontend
git clone <repo-url>
cd frontend

# 2. Install dependencies
npm install

# 3. Configure environment
# Edit the provided .env (see Environment Variables below)

# 4. Start the dev server (http://localhost:3006)
npm start
```

> **Note:** The `start` script sets `PORT=3006` using Windows syntax (`set PORT=3006 && ...`). On macOS/Linux, run with:
> ```bash
> PORT=3006 npx react-scripts start
> ```
> or install `cross-env` and use `cross-env PORT=3006 react-scripts start`.

---

## Environment Variables

Configured via `.env` and surfaced through `src/config/keys.js`. The active base URL is chosen by `REACT_APP_NODE_ENV` (`development` → local URLs, otherwise → live URLs) in `src/constant.js`.

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_NODE_ENV` | `development` or `production` (selects local vs live API) | `development` |
| `REACT_APP_WEEAM_LOCAL_API` | Local backend REST base URL | `http://127.0.0.1:5000/` |
| `REACT_APP_WEEAM_LIVE_API` | Production backend REST base URL | `https://sasapi.weeam.info/` |
| `REACT_APP_SOCKET_API` | Socket (notifications) base URL | `https://pystage.weeam.info` |
| `REACT_APP_SOCKET_WSS_API` | Secure WebSocket URL | `wss://pystage.weeam.info` |
| `REACT_APP_SOCKET_IO_URL` | Socket.IO server URL | `http://127.0.0.1:5000` |
| `REACT_APP_CLIENT_URL` | This app's public URL | `http://localhost:3006/` |
| `REACT_APP_RELEASE_VERSION` | App version banner | `2.1` |
| `REACT_APP_SIP_BASE_URL` | Primary SIP/WebRTC server | `https://webrtc.weeam.info` |
| `REACT_APP_SIP_SERVER_2_BASE_URL` | Secondary SIP server | `https://call.weeam.info:3001` |
| `REACT_APP_CRM_PRODUCT_API_URL` | Product/listing API | `https://product-api.weeam.info/` |
| `REACT_APP_FB_PIXEL_API` / `_ID` / `_TOKEN` | Optional Facebook Pixel tracking | — |

> ⚠️ `.env` is git-ignored. Never commit secrets. Maintain a `.env.example` template for sharing config shape.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the dev server on port `3006` with hot reload. |
| `npm run build` | Produce an optimized production build in `build/`. |
| `npm test` | Run the CRA/Jest test runner. |
| `npm run sitemap` | Generate a sitemap via `sitemap-builder.js` (Babel). |
| `npm run predeploy` | Build before deploying (auto-runs on `deploy`). |
| `npm run deploy` | Publish `build/` to GitHub Pages (`gh-pages`). |
| `npm run eject` | Eject CRA configuration (irreversible). |

---

## Module Reference

All feature modules live under `src/views/admin/`. Highlights:

| Module | Purpose |
|--------|---------|
| `lead`, `lead-v2`, `leadAdmin`, `leadCycle`, `leadSetting` | Core lead management, lifecycle stages, and configuration |
| `freshLead`, `leadpool`, `leadPool-v2` | Real-time inbound lead capture and shared lead pools |
| `deals` | Sales pipeline & deal closure |
| `contact` | Contact database with phone validation |
| `property`, `Listing`, `developers`, `document` | Property/listing inventory & document management |
| `phoneCall`, `callHistory`, `sip` | Telephony, call logs, and SIP configuration |
| `whatsapp`, `whatsapp-v2`, `communication`, `textMsg`, `emailHistory` | Multi-channel messaging |
| `meeting`, `task`, `taskV2`, `calender`, `survey` | Productivity & scheduling |
| `invoice`, `payments`, `finance`, `bankAccounts`, `bankAccountsV2`, `currencypoints` | Billing & finance |
| `hrModule`, `attendance`, `payroll`, `hiring`, `evalution`, `dailyReport` | HR & back office |
| `reports`, `reports-v2` | Analytics dashboards |
| `users`, `users-v2`, `role`, `userPermission`, `agencies`, `adminSetting` | Administration & access control |
| `customField`, `tableField`, `validation` | Dynamic schema & form configuration |
| `announcement`, `logAction`, `default` | Broadcasts, audit logs, and the main dashboard |

The **softphone UI** lives in `src/views/webrtc/` (`WebRTCApp.jsx`, `phone/`, `dialer_settings/`, `history/`, `settings/`), and **authentication** in `src/views/auth/signIn/`.

---

## State Management

Global state uses **Redux Toolkit** (`src/redux/store.js`) with ~25 feature slices, including:

`leadSlice`, `leadsSlice`, `freshLeadSlice`, `freshLeadPoolSlice`, `usersSlice`, `roleSlice`, `permissionSlice`, `onlineUsersSlice`, `announcementsSlice`, `invoiceSlice`, `sipSlice`, `whatsappSlice`, `whatsappWebSlice`, `filtersSlice`, `countriesSlice`, `positionsSlice`, `imageSlice`, `missingFilesSlice`, `localSlice`, `utilSlice`, plus `webSocketReducer` and `webrtc/webrtcSlice`.

Local/UI state is shared through React Context (`RoleContext`, `SidebarContext`, and a global `contexts/store` provider).

---

## Real-Time & Telephony

Initialized in `src/index.js` at app boot:

- **Socket.IO** (`socketService`) — connection lifecycle + domain events via `useSocketEvents`.
- **Native WebSocket** (`webSocketService`) — notification stream dispatched into `webSocketReducer`; triggers in-app toast, browser push (`react-push-notification`), and a notification sound.
- **WhatsApp socket** (`registerWhatsappSocket`) — live message/media sync via `useWhatsappEvents`.
- **WebRTC/SIP** — `src/lib/webrtc` provides `SipUA`, `SipSessionManager`, `SipSession`, and audio element management built on `jssip`; the `webrtc` view renders the dialer and call history.
- **Live lead modals** — `NewFreshLeadModal`, `FreshLeadPoolModal`, and `FreshApprovedLeadModal` pop in response to socket events.

---

## Authentication & Authorization

- **Token-based auth** — JWT stored in `localStorage`/`sessionStorage` (`token`, `accessToken`); decoded via `jwt-decode`. Axios requests attach `Authorization` headers automatically (`setAuthHeader`).
- **Roles** (`src/roles.js`): `superAdmin`, `admin`, `manager`, `teamleader`, `executive`, `telecaller`, `HR`, `accountant`, `user`, plus `attendance`.
- **Granular permissions** — enforced via the `usePermissions` hook, `Permission` guard components, and `permissionUtils`. UI elements and routes render conditionally based on the user's resolved permission set.
- **Multi-tenancy** — agency-scoped data and configuration (timings, deductions, currencies) managed in the `agencies` module.
- **Sessions** — `useUserSession` resolves the active user and role name; `useUserActivityLog` records activity.

---

## Routing

- `src/routes.js` and `src/routesV2.js` define route tables (legacy v1 and current v2).
- `src/sidebarRoutes.js` drives the collapsible sidebar navigation, filtered by role/permission.
- Layout shells in `src/layouts/` (`admin`, `auth`, `user`) wrap routed views.
- Path alias `@/*` → `src/*` (configured in `jsconfig.json`), so imports like `import keys from 'config/keys'` resolve from `src`.

---

## Theming & UI

- **Chakra UI** theme in `src/theme/` with custom `foundations` (colors, typography, breakpoints, shadows, radii, spacing, z-index), `components` (button, input, badge, switch, slider, …), and card `additions`.
- **Dark / light mode** via `ColorModeScript` and a runtime theme editor (`@hypertheme-editor/chakra-ui`).
- **RTL support** via `stylis-plugin-rtl` and an `rtlProvider` component.
- **40+ shared components** in `src/components/` — data tables (`react-table`, virtualized), charts, modals, dropzones, date pickers, pagination, search, folder tree, fixed plugin, loaders, and more.

---

## Deployment

### GitHub Pages

```bash
npm run deploy   # builds and publishes build/ to gh-pages
```

### GitHub Actions

A workflow at `.github/workflows/deploy.yml` handles CI/CD. Configure repository secrets and the production `.env` values in your hosting/CI environment.

### Static hosting (Nginx, S3/CloudFront, Netlify, Vercel)

```bash
npm run build
# Serve the build/ directory as a static SPA (enable history-API fallback to index.html)
```

> Ensure production env vars point at the live API, Socket.IO, SIP, and product endpoints.

---

## Coding Conventions

- **Indentation:** tabs (matches existing source).
- **Imports:** use the `src`-relative aliases (e.g. `services/api`, `config/keys`, `redux/store`) rather than long relative paths.
- **ESLint:** extends `react-app` + `react-app/jest`.
- **Domain organization:** keep feature code under `views/admin/<module>/`, reusable UI under `components/`, side-effect logic in `hooks/` and `services/`, and validation in `schema/`.
- **State:** add new global state as a Redux slice in `src/redux/` and register it in `store.js`.

---

## Troubleshooting

| Issue | Resolution |
|-------|-----------|
| **`PORT` not set / wrong port on macOS/Linux** | Run `PORT=3006 npx react-scripts start` (the default script uses Windows `set` syntax). |
| **API calls fail / CORS** | Confirm the backend is running at `REACT_APP_WEEAM_LOCAL_API` and `REACT_APP_NODE_ENV=development`. |
| **No real-time updates** | Verify `REACT_APP_SOCKET_IO_URL` / `REACT_APP_SOCKET_API` and that the socket servers are reachable. |
| **Softphone not registering** | Check `REACT_APP_SIP_BASE_URL` / `REACT_APP_SIP_SERVER_2_BASE_URL` and microphone permissions. |
| **Chunk load errors after deploy** | Handled by `useChunkErrorHandler` (auto-reload); hard-refresh if it persists. |
| **`react-error-overlay` mismatch** | Pinned via `resolutions` to `6.0.9`; reinstall with `npm install`. |
| **Blank page / push notifications blocked** | Grant browser notification permission (requested on load via `NotificationService`). |

---

## License

**Private / Proprietary** — © Weeam. All rights reserved. Internal use only.

---

<sub>Built with React, Chakra UI, and Redux Toolkit • Weeam CRM Frontend v2.1</sub>
