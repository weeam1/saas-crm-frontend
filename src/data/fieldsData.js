// data/fieldsData.js
export const ALL_FIELDS = [
    // Core Contact Fields
    { name: 'name', field: 'leadName', category: 'required', type: 'string', required: true, description: 'Full name of the lead', example: 'John Doe' },
    { name: 'leadEmail', field: 'leadEmail', category: 'contact', type: 'email', required: false, description: 'Email address of the lead', example: 'john@example.com' },
    { name: 'mobile', field: 'leadPhoneNumber', category: 'contact', type: 'string', required: false, description: 'Phone number with country code', example: '+971501234567' },
    { name: 'whatsapp', field: 'leadWhatsappNumber', category: 'contact', type: 'string', required: false, description: 'WhatsApp number with country code', example: '+971501234567' },
    { name: 'nationality', field: 'nationality', category: 'contact', type: 'string', required: false, description: 'Nationality of the lead', example: 'United Arab Emirates' },
    { name: 'interest', field: 'interest', category: 'contact', type: 'string', required: false, description: 'Property type interested in', example: '2 Bedroom Apartment' },
    { name: 'r_u_in_uae', field: 'r_u_in_uae', category: 'contact', type: 'string', required: false, description: 'Whether lead is currently in UAE', example: 'Yes' },
    { name: 'budget', field: 'budget', category: 'contact', type: 'string', required: false, description: 'Budget range for property', example: '500,000 - 1,000,000 AED' },
    
    // Time Related Fields
    { name: 'timetocall', field: 'timetocall', category: 'contact', type: 'string', required: false, description: 'Best time to call', example: 'Afternoon' },
    { name: 'leadLang', field: 'leadLang', category: 'contact', type: 'string', required: false, description: 'Preferred language', example: 'English' },
    { name: 'attendanceDay', field: 'attendanceDay', category: 'contact', type: 'string', required: false, description: 'Preferred day for meetings', example: 'Weekend' },
    { name: 'timeToCallFrom', field: 'timeToCallFrom', category: 'contact', type: 'string', required: false, description: 'Call from time (24hr format)', example: '14:00' },
    { name: 'timeToCallTo', field: 'timeToCallTo', category: 'contact', type: 'string', required: false, description: 'Call to time (24hr format)', example: '18:00' },
    
    // UTM Tracking Fields
    { name: 'utm_source', field: 'leadSource', category: 'utm', type: 'string', required: false, description: 'Traffic source (Facebook, Google, etc.)', example: 'facebook' },
    { name: 'utm_medium', field: 'leadSourceMedium', category: 'utm', type: 'string', required: false, description: 'Marketing medium (cpc, email, social)', example: 'cpc' },
    { name: 'utm_campaign', field: 'leadCampaign', category: 'utm', type: 'string', required: false, description: 'Campaign name', example: 'summer_sale_2024' },
    { name: 'utm_content', field: 'leadSourceDetails', category: 'utm', type: 'string', required: false, description: 'Ad content identifier', example: 'ad_creative_5' },
    { name: 'adset', field: 'adset', category: 'utm', type: 'string', required: false, description: 'Ad set name', example: 'Retargeting_Main' },
    
    // Facebook Specific
    { name: 'fbclid', field: 'fbclid', category: 'technical', type: 'string', required: false, description: 'Facebook Click ID for tracking', example: 'IwZXh0bgNhZW0BMABhZGlkAAS...' },
    { name: 'fbp', field: 'fbp', category: 'technical', type: 'string', required: false, description: 'Facebook Browser ID', example: 'fb.1.1769075753731...' },
    
    // Technical Fields
    { name: 'ip', field: 'ip', category: 'technical', type: 'string', required: false, description: 'Lead IP address (auto-detected if not sent)', example: '192.168.1.1' },
    { name: 'zip', field: 'zip', category: 'technical', type: 'string', required: false, description: 'Postal/Zip code', example: '12345' },
    { name: 'eLeadStatus', field: 'eLeadStatus', category: 'technical', type: 'string', required: false, description: 'Lead status (default: "new")', example: 'new' },
    
    // Page/URL Fields
    { name: 'page_url', field: 'pageUrl', category: 'technical', type: 'string', required: false, description: 'Landing page URL (sent in meta object)', example: 'https://example.com/landing-page' }
];

export const PAYLOAD_EXAMPLE = {
  "fields": {
    "name": { "value": "John Doe" },
    "leadEmail": { "value": "john@example.com" },
    "mobile": { "value": "+971501234567" },
    "whatsapp": { "value": "+971501234567" },
    "nationality": { "value": "United Arab Emirates" },
    "interest": { "value": "2 Bedroom Apartment" },
    "r_u_in_uae": { "value": "Yes" },
    "budget": { "value": "500,000 - 1,000,000 AED" },
    "timetocall": { "value": "Afternoon" },
    "leadLang": { "value": "English" },
    "attendanceDay": { "value": "Weekend" },
    "timeToCallFrom": { "value": "14:00" },
    "timeToCallTo": { "value": "18:00" },
    "utm_source": { "value": "facebook" },
    "utm_medium": { "value": "cpc" },
    "utm_campaign": { "value": "summer_sale_2024" },
    "utm_content": { "value": "ad_creative_5" },
    "adset": { "value": "Retargeting_Main" },
    "fbclid": { "value": "IwZXh0bgNhZW0BMABhZGlkAAS..." },
    "fbp": { "value": "fb.1.1769075753731..." },
    "ip": { "value": "192.168.1.1" },
    "zip": { "value": "12345" },
    "eLeadStatus": { "value": "new" }
  },
  "meta": {
    "page_url": { "value": "https://example.com/landing-page?utm_source=facebook" }
  }
};