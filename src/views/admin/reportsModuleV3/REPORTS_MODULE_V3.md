# Reports Module V3 (`reportsModuleV3`)

A new frontend reporting module that surfaces the backend **Leads Reports V3**
API (`/api/v3/reports/leads/*`) as an interactive analytics dashboard. Built to
match the existing CRM conventions (Chakra UI v1 dark/gold theme, Redux Toolkit
Query data fetching, recharts visualizations, feature-folder structure under
`views/admin`).

---

## 1. Overview

- **What it does:** Provides a **Reports Home** page (a grid of report-module
  cards) and a full **Leads Reports** dashboard with KPI tiles, charts (trend,
  breakdown, conversion comparison, funnel) and a paginated/sortable owner
  performance table, all driven by live API data with full loading / empty /
  error states.
- **Why it was added:** The backend exposes a rich v3 leads reporting layer
  (13 endpoints). This module makes that data explorable by users without
  touching any existing reporting screens — it is **purely additive** and lives
  alongside `reports` and `reports-v2`.

---

## 2. Folder structure

```
src/views/admin/reportsModuleV3/
├── index.js                         # Reports Home page (grid of module cards). Route: /reports-v3
├── types.js                         # JSDoc typedefs for request/response shapes
├── helpers.js                       # Chart color palette + number/percent/currency formatters
├── REPORTS_MODULE_V3.md             # This document
├── api/
│   └── useLeadsReports.js           # Hooks wrapping useFetchItemsQuery for each v3 leads endpoint
├── hooks/
│   └── useLeadsReportFilters.js     # Shared filter state + derived query params
├── components/
│   ├── ModuleCard.jsx               # Home card (icon, title, desc, status badge); keyboard accessible
│   ├── KPICard.jsx                  # Reusable KPI tile (value formatting, trend, skeleton)
│   ├── ChartCard.jsx                # Titled chart container w/ loading/empty/error state machine
│   ├── FiltersBar.jsx               # Date range + date-field + status + source filters
│   ├── ReportTable.jsx              # Generic responsive table: sortable headers, server pagination, states
│   └── StateViews.jsx               # LoadingState / SkeletonGrid / EmptyState / ErrorState primitives
├── charts/
│   ├── ChartTooltip.jsx             # Themed recharts tooltip shared by all charts
│   ├── LeadsTrendChart.jsx          # Area chart — leads/conversions over time
│   ├── BreakdownChart.jsx           # Donut + legend — distribution by source/status
│   ├── ConversionBySourceChart.jsx  # Grouped bar — leads vs converted by source
│   └── FunnelChart.jsx              # Horizontal bar — funnel stages
└── leads/
    └── LeadsReportsPage.jsx         # Main Leads dashboard. Route: /reports-v3/leads
```

---

## 3. Architecture

**Data flow:**

```
FiltersBar / section controls (useState)
        │  (filter values)
        ▼
useLeadsReportFilters  ──►  params object (dateField, dateFrom/To, source, leadStatus)
        │
        ▼
useLeadsReports hooks  ──►  useFetchItemsQuery({ path:'/v3/reports/leads/<ep>', params })
        │                         │ (RTK Query — apiSlice, baseUrl includes /api,
        │                         │  auto Authorization + x-tenant-id headers)
        ▼                         ▼
{ doc, pagination, isLoading, isError, refetch }  ◄── normalized envelope (response.doc)
        │
        ▼
KPICard / ChartCard + charts / ReportTable   (render data, handle every state)
```

- **State management:** **Redux Toolkit Query** via the project's existing
  `apiSlice` and its generic `useFetchItemsQuery` hook — no new fetch pattern or
  dependency was introduced. Each report has a thin wrapper hook that normalizes
  the standard `{ success, message, doc, pagination }` envelope down to `doc` /
  `pagination`. RTK Query handles caching, deduping (sections sharing the same
  params object reuse one request), and refetch-on-arg-change.
- **Local UI state:** plain `useState` for section controls (trend metric/
  interval, breakdown dimension, owner role/sort/page) and a small
  `useLeadsReportFilters` hook for the shared filter bar.
- **Empty-param safety:** `cleanParams()` strips empty strings before requests
  because the backend Joi validation rejects empty query values.

---

## 4. API integration

- **Base:** `GET {apiBaseUrl}/api/v3/reports/leads/<endpoint>`
  (the `apiSlice` baseUrl already ends in `/api`; hooks prefix `/v3/...`).
- **Auth:** `Authorization: Bearer <accessToken>` and `x-tenant-id` are injected
  automatically by `apiSlice.prepareHeaders`.
- **Envelope:** every endpoint returns
  `{ success, statusCode, message, timestamp, doc, count?, pagination? }`.
  The payload of interest is **`doc`**.

| Hook | Endpoint | Key params | `doc` shape |
|------|----------|-----------|-------------|
| `useLeadsSummary` | `/summary` | shared | `{ totalLeads, newLeads, convertedLeads, conversionRate, avgLeadScore, ... }` |
| `useLeadsByStatus` | `/by-status` | shared, `metric` | `[{ key, label, color, count, percentage }]` |
| `useLeadsBySource` | `/by-source` | shared, `groupBy` | `[{ name, count, percentage }]` |
| `useLeadsByOwner` | `/by-owner` | shared, `role`, `sortBy`, `page`, `limit` | `[{ ownerId, name, total, converted, conversionRate, revenue, ... }]` + `pagination` |
| `useLeadsFunnel` | `/funnel` | shared | `{ totalLeads, stages:[{ label, count, conversionFromTop }] }` |
| `useLeadsConversion` | `/conversion` | shared, `groupBy` | `{ totalLeads, convertedLeads, conversionRate, totalRevenue, breakdown:[{ name, leads, converted }] }` |
| `useLeadsTrend` | `/trend` | shared, `metric`, `interval` | `{ metric, interval, series:[{ date, count }] }` |
| `useLeadsAging` | `/aging` | shared | `{ openLeads, buckets:[{ bucket, count }], staleOver30d }` |
| `useLeadsActivity` | `/activity` | shared, `groupBy` | `{ totals, leadsTouched, leadsUntouched, breakdown }` |
| `useLeadsTimeToConversion` | `/time-to-conversion` | shared | `{ convertedLeads, avgDays, medianDays, distribution }` |
| `useLeadsTimeToAssignment` | `/time-to-assignment` | shared, `role` | `{ avgDays, medianDays, distribution }` |
| `useLeadsQualification` | `/qualification` | shared, `groupBy` | `{ qualificationCoverage, investorCount, breakdown }` |
| `useLeadsLostReasons` | `/lost-reasons` | shared, `lostStatuses` | `{ totalLost, breakdown:[{ reason, count }] }` |

> The Leads page currently wires **summary, by-status, by-source, by-owner,
> conversion, funnel, trend**. The remaining hooks are implemented and ready for
> additional sections (see "How to extend").

**Shared query params (`LeadsReportFilters`):** `dateField`, `dateFrom`,
`dateTo`, `source`, `leadStatus`, `eLeadStatus`, `agentId`, `managerId`,
`teamLeadId`, `search`. Full TypeScript-style contracts are in
[`types.js`](./types.js) as JSDoc typedefs (this is a CRA JS project, no `.ts`).

---

## 5. Components

| Component | Key props | Purpose |
|-----------|-----------|---------|
| `ModuleCard` | `title, description, icon, status('active'\|'soon'), onClick` | Report-module card on the Home grid; keyboard accessible, disabled for "coming soon". |
| `KPICard` | `title, value, icon, format('number'\|'percent'\|'currency'), trend, isLoading, tooltip, helpText` | KPI tile with formatting, optional trend badge and skeleton. |
| `ChartCard` | `title, subtitle, actions, isLoading, isError, isEmpty, onRetry, minH, children` | Titled container that renders loading/empty/error or the chart. |
| `FiltersBar` | `filters, onChange, onReset, statusOptions, sourceOptions, isLoading` | Date range + date-field + status + source filters; data-driven dropdowns. |
| `ReportTable` | `columns, rows, isLoading, isError, onRetry, sortBy, onSort, pagination, onPageChange, rowKey` | Generic responsive table: sortable headers, server pagination, built-in states. |
| `StateViews` | `LoadingState`, `SkeletonGrid`, `EmptyState`, `ErrorState` | Shared state primitives reused everywhere. |
| `ChartTooltip` | recharts tooltip props + `valueFormatter` | Themed tooltip for all charts. |

---

## 6. Routes

Added to `src/routes.js` (single additive block; no existing route changed):

| Path | Component | Sidebar | Notes |
|------|-----------|---------|-------|
| `/reports-v3` | `ReportsHomeV3` (`reportsModuleV3/index.js`) | **Yes** — "Reports V3" (has `icon`, `moduleId:'reports'`) | Landing grid of module cards. |
| `/reports-v3/leads` | `LeadsReportsV3` (`reportsModuleV3/leads/LeadsReportsPage.jsx`) | No (`under:'Reports V3'`) | Reachable via the Leads card or directly by URL. |

Both are lazy-loaded (`React.lazy`) like every other route, gated by the
existing `reports` permission (`usePermissions().hasPermission('reports')`) and
the `[superAdmin, user]` layout. **Navigation:** open the sidebar → **Reports
V3** → click the **Leads** card → `/reports-v3/leads`.

---

## 7. Charts / graphs

Library: **recharts** (`^2.15.3`, already a dependency — matches the existing
`reports-v2/lead-report` charts; all use `ResponsiveContainer` for full
responsiveness).

| Chart | Type | Data source |
|-------|------|-------------|
| `LeadsTrendChart` | Area (gradient) | `trend.series` — leads/conversions over time (metric × interval toggles) |
| `BreakdownChart` | Donut + legend | `by-source` or `by-status` rows (dimension toggle) |
| `ConversionBySourceChart` | Grouped bar | `conversion.breakdown` — leads vs converted per source |
| `FunnelChart` | Horizontal bar | `funnel.stages` — stage counts |

---

## 8. Files created / modified

**Created (18):**
```
src/views/admin/reportsModuleV3/index.js
src/views/admin/reportsModuleV3/types.js
src/views/admin/reportsModuleV3/helpers.js
src/views/admin/reportsModuleV3/REPORTS_MODULE_V3.md
src/views/admin/reportsModuleV3/api/useLeadsReports.js
src/views/admin/reportsModuleV3/hooks/useLeadsReportFilters.js
src/views/admin/reportsModuleV3/components/ModuleCard.jsx
src/views/admin/reportsModuleV3/components/KPICard.jsx
src/views/admin/reportsModuleV3/components/ChartCard.jsx
src/views/admin/reportsModuleV3/components/FiltersBar.jsx
src/views/admin/reportsModuleV3/components/ReportTable.jsx
src/views/admin/reportsModuleV3/components/StateViews.jsx
src/views/admin/reportsModuleV3/charts/ChartTooltip.jsx
src/views/admin/reportsModuleV3/charts/LeadsTrendChart.jsx
src/views/admin/reportsModuleV3/charts/BreakdownChart.jsx
src/views/admin/reportsModuleV3/charts/ConversionBySourceChart.jsx
src/views/admin/reportsModuleV3/charts/FunnelChart.jsx
src/views/admin/reportsModuleV3/leads/LeadsReportsPage.jsx
```

**Modified (1):**
```
src/routes.js   # added 2 lazy imports + 2 route objects (Reports V3 home + Leads)
```

No existing component, style, store slice, or API file was changed.

---

## 9. How to extend (e.g. add a "Deals" module)

1. **Activate the Home card:** in `index.js`, change the `deals` entry `status`
   to `'active'` and give it a `path: '/reports-v3/deals'`.
2. **Add API hooks:** create `api/useDealsReports.js` mirroring
   `useLeadsReports.js` (point `BASE` at `/v3/reports/deals`).
3. **Build the page:** add `deals/DealsReportsPage.jsx`, reusing `FiltersBar`,
   `KPICard`, `ChartCard`, `ReportTable`, the chart components and `StateViews`
   (all are domain-agnostic).
4. **Register routes:** in `src/routes.js`, add a lazy import and two route
   objects (`/reports-v3/deals`, `under: 'Reports V3'`) next to the Leads ones.

Adding a **new report section** to the Leads page is even simpler: call the
already-implemented hook (e.g. `useLeadsAging(params)`) and drop a `ChartCard`
with the relevant chart — no new infrastructure needed.

---

## 10. Screenshots / placeholders

> Add captures here after running the app (`npm start` → `/reports-v3`).

- Reports Home grid — `![Reports Home](./docs/reports-home.png)`
- Leads dashboard (KPIs + charts) — `![Leads Dashboard](./docs/leads-dashboard.png)`
- Owner performance table — `![Owner Table](./docs/owner-table.png)`
- Mobile layout — `![Mobile](./docs/leads-mobile.png)`
