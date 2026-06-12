/**
 * Leads Reports V3 — shared type contracts (JSDoc).
 *
 * This is a CRA JavaScript project (no TypeScript), so request/response shapes
 * are documented as JSDoc typedefs. Editors with TS-powered IntelliSense pick
 * these up for autocompletion and light type-checking.
 *
 * Backend contract: see `backend/REPORTS_V3_LEADS.md`.
 * Every endpoint returns the envelope `{ success, statusCode, message, doc, count?, pagination? }`.
 * The payload of interest is always `response.doc`.
 */

/**
 * @typedef {Object} LeadsReportFilters
 * @property {string} [dateField]   One of createdDate|leadConversionDate|leadStatusDate|updatedDate|managerAssignedDate|agentAssignedDate|teamLeadAssignedDate
 * @property {string} [dateFrom]    ISO date (yyyy-mm-dd), inclusive lower bound
 * @property {string} [dateTo]      ISO date (yyyy-mm-dd), inclusive upper bound
 * @property {string} [source]      Exact source match
 * @property {string} [leadStatus]  Single value or CSV → $in
 * @property {string} [eLeadStatus] Single value or CSV → $in
 * @property {string} [agentId]     ObjectId or "unassigned"
 * @property {string} [managerId]   ObjectId or "unassigned"
 * @property {string} [teamLeadId]  ObjectId or "unassigned"
 * @property {string} [search]      Free-text over name/email/phone
 */

/**
 * @typedef {Object} LeadsSummary
 * @property {number} totalLeads
 * @property {number} newLeads
 * @property {number} assignedLeads
 * @property {number} unassignedLeads
 * @property {number} convertedLeads
 * @property {number} conversionRate     Percentage (0-100)
 * @property {number} avgLeadScore
 * @property {number} totalNotes
 * @property {{field:string, from:?string, to:?string}} dateRange
 */

/**
 * @typedef {Object} BreakdownRow
 * @property {string} name
 * @property {number} count
 * @property {number} [percentage]
 * @property {string} [label]
 * @property {?string} [color]
 * @property {?number} [order]
 * @property {string} [key]
 */

/**
 * @typedef {Object} FunnelStage
 * @property {string} stage
 * @property {string} label
 * @property {number} order
 * @property {number} count
 * @property {?number} dropOffFromPrev
 * @property {number} conversionFromTop
 */

/**
 * @typedef {Object} FunnelReport
 * @property {number} totalLeads
 * @property {FunnelStage[]} stages
 */

/**
 * @typedef {Object} ConversionBreakdownRow
 * @property {string} name
 * @property {number} leads
 * @property {number} converted
 * @property {number} conversionRate
 * @property {number} revenue
 */

/**
 * @typedef {Object} ConversionReport
 * @property {number} totalLeads
 * @property {number} convertedLeads
 * @property {number} conversionRate
 * @property {number} totalRevenue
 * @property {number} avgDealValue
 * @property {ConversionBreakdownRow[]} breakdown
 */

/**
 * @typedef {Object} TrendPoint
 * @property {string} date
 * @property {number} [count]
 * @property {{name:string,count:number}[]} [groups]
 */

/**
 * @typedef {Object} TrendReport
 * @property {string} metric    intake|conversion|byStatus|bySource
 * @property {string} interval  day|week|month
 * @property {TrendPoint[]} series
 */

/**
 * @typedef {Object} OwnerRow
 * @property {string} ownerId
 * @property {string} name
 * @property {number} total
 * @property {number} assigned
 * @property {number} converted
 * @property {number} conversionRate
 * @property {number} revenue
 * @property {number} avgLeadScore
 * @property {number} notes
 */

/**
 * @typedef {Object} Pagination
 * @property {number} total
 * @property {number} page
 * @property {number} limit
 * @property {number} totalPages
 * @property {boolean} hasNextPage
 * @property {boolean} hasPrevPage
 */

export {};
