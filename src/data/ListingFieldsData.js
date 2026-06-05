// integrations/data/listingFieldsData.js
export const LISTING_FIELDS = [
  // Property Information - Required
  { name: 'projectName', field: 'projectName', category: 'property', type: 'string', required: true, description: 'Name of the property project', example: 'Burj Khalifa' },
  { name: 'listingType', field: 'listingType', category: 'property', type: 'string', required: true, description: 'Type of listing ID reference', example: '65abc123...' },
  { name: 'unitType', field: 'unitType', category: 'property', type: 'string', required: true, description: 'Unit type ID reference', example: '65abc456...' },
  { name: 'description', field: 'description', category: 'property', type: 'string', required: true, description: 'Detailed description of the property', example: 'Luxury apartment with sea view...' },
  { name: 'area', field: 'area', category: 'property', type: 'number', required: true, description: 'Area in square feet', example: '1500' },
  { name: 'sellingPrice', field: 'sellingPrice', category: 'property', type: 'number', required: true, description: 'Selling price in AED', example: '2500000' },
  { name: 'developer', field: 'developer', category: 'property', type: 'string', required: true, description: 'Property developer name', example: 'Emaar Properties' },
  
  // Property Information - Optional
  { name: 'unitNumber', field: 'unitNumber', category: 'property', type: 'number', required: false, description: 'Unit/apartment number', example: '1204' },
  { name: 'subUnitType', field: 'subUnitType', category: 'property', type: 'string', required: false, description: 'Sub-unit type ID reference', example: '65abc789...' },
  { name: 'buildingAge', field: 'buildingAge', category: 'property', type: 'number', required: false, description: 'Age of building in years', example: '5' },
  { name: 'currency', field: 'currency', category: 'property', type: 'object', required: false, description: 'Currency object with code and symbol', example: '{ code: "AED", symbol: "د.إ" }' },
  
  // Location Fields
  { name: 'location', field: 'location', category: 'location', type: 'string', required: true, description: 'Property location address', example: 'Downtown Dubai' },
  { name: 'city', field: 'city', category: 'location', type: 'string', required: false, description: 'City name', example: 'Dubai' },
  { name: 'country', field: 'country', category: 'location', type: 'object', required: false, description: 'Country object with name and code', example: '{ name: "UAE", code: "AE" }' },
  
  // Contact Information
  { name: 'landlordName', field: 'landlordName', category: 'contact', type: 'string', required: false, description: 'Landlord/owner name', example: 'Ahmed Al Mansouri' },
  { name: 'landlordPhone', field: 'landlordPhone', category: 'contact', type: 'string', required: false, description: 'Landlord phone number', example: '+971501234567' },
  { name: 'email', field: 'email', category: 'contact', type: 'email', required: false, description: 'Contact email address', example: 'owner@example.com' },
  { name: 'createdBy', field: 'createdBy', category: 'contact', type: 'string', required: false, description: 'User ID who created the listing', example: '65abc123...' },
  
  // Media Fields
  { name: 'documents', field: 'documents', category: 'property', type: 'array', required: false, description: 'Array of document URLs', example: '["doc1.pdf", "doc2.pdf"]' },
  { name: 'images', field: 'images', category: 'property', type: 'array', required: false, description: 'Array of image URLs', example: '["image1.jpg", "image2.jpg"]' },
  { name: 'mediaDir', field: 'mediaDir', category: 'property', type: 'string', required: false, description: 'Media directory path', example: '/uploads/listings/123/' },
  
  // Status Fields
  { name: 'status', field: 'status', category: 'property', type: 'string', required: false, description: 'Listing status (pending/approved/rejected/active/inactive/draft)', example: 'pending' },
  { name: 'isClient', field: 'isClient', category: 'property', type: 'boolean', required: false, description: 'Is this a client listing?', example: 'true' },
  { name: 'metaData', field: 'metaData', category: 'property', type: 'object', required: false, description: 'Additional metadata', example: '{ source: "web", tags: ["luxury"] }' }
];

export const LISTING_PAYLOAD_EXAMPLE = {
  "projectName": "Burj Khalifa Residences",
  "unitNumber": 1204,
  "listingType": "65abc1234567890abcdef01",
  "unitType": "65abc4567890abcdef0123",
  "subUnitType": "65abc7890abcdef01234567",
  "description": "Luxury 3-bedroom apartment with panoramic city views. Fully furnished with high-end finishes.",
  "area": 1850,
  "sellingPrice": 3500000,
  "currency": {
    "code": "AED",
    "symbol": "د.إ"
  },
  "country": {
    "name": "United Arab Emirates",
    "code": "AE"
  },
  "city": "Dubai",
  "location": "Downtown Dubai - Burj Khalifa District",
  "landlordName": "Ahmed Al Mansouri",
  "landlordPhone": "+971501234567",
  "email": "owner@burjkhalifa.com",
  "developer": "Emaar Properties",
  "buildingAge": 12,
  "status": "pending",
  "isClient": false,
  "documents": ["title_deed.pdf", "floor_plan.pdf"],
  "images": ["exterior.jpg", "living_room.jpg", "bedroom.jpg", "kitchen.jpg"],
  "mediaDir": "/uploads/listings/BURJ-1204/",
  "metaData": {
    "source": "admin_portal",
    "featured": true,
    "virtual_tour_url": "https://example.com/tour/123"
  }
};