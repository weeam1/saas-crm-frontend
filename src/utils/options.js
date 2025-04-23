export const mainLeadStatus = [
	{ label: 'Interested', value: 'interested' },
	{ label: 'Not interested', value: 'not-interested' },
	{ label: 'No response', value: 'no-response' },
	{ label: 'Interested Seller', value: 'interested-seller' },
	{ label: 'Interested Buyer', value: 'interested-buyer' },
	{ label: 'Hot', value: 'hot' },
	{ label: 'Secondary request', value: 'secondary-request' },
	{ label: 'Show', value: 'show' },
	{ label: 'Junk', value: 'junk' },
	{ label: 'Deal', value: 'deal' },
	{ label: 'Change Agent', value: 'change-agent' },
];

export const eventMainLeadStatus = [
	'interested',
	'not-interested',
	'junk',
	'deal',
];

export const eventLeadStatus = ['broker', 'pending', 'will_attend_the_show'];

export const visaOptions = [
	{ label: 'Visit Visa', value: 'Visit Visa' },
	{ label: 'Residential Visa', value: 'Residential Visa' },
	{ label: 'Canceled Visa', value: 'Canceled Visa' },
];

// export const leadStatus = [
// 	// General Status
// 	{ label: 'Interested', value: 'active' },
// 	{ label: 'Sold', value: 'sold' },
// 	{ label: 'Not Interested', value: 'pending' },
// 	{ label: 'Reassigned', value: 'reassigned' },
// 	{ label: 'New', value: 'new' },

// 	// Communication Status
// 	{ label: 'No Answer', value: 'no_answer' },
// 	{ label: 'Unreachable', value: 'unreachable' },
// 	{ label: 'Callback', value: 'callback' },
// 	{ label: 'Voice Mail', value: 'voice_mail' },
// 	{ label: 'Wrong Number', value: 'wrong_number' },

// 	// Follow-Up Status
// 	{ label: 'Waiting', value: 'waiting' },
// 	{ label: 'Follow Up', value: 'follow_up' },
// 	{ label: 'Meeting', value: 'meeting' },
// 	{ label: 'Follow Up After Meeting', value: 'follow_up_after_meeting' },

// 	// Deal-Related Status
// 	{ label: 'Deal', value: 'deal' },
// 	{ label: 'Deal Out', value: 'deal_out' },

// 	// WhatsApp Status
// 	{ label: 'Whatsapp Send', value: 'whatsapp_send' },
// 	{ label: 'Whatsapp Rec', value: 'whatsapp_rec' },

// 	// Show-Related Status
// 	{ label: 'Will Attend the Show', value: 'will_attend_the_show' },
// 	{ label: 'Attended the Show', value: 'attended_the_show' },

// 	// Miscellaneous
// 	{ label: 'Junk', value: 'junk' },
// 	{ label: 'Shift Project', value: 'shift_project' },
// 	{ label: 'Broker', value: 'broker' },
// 	{ label: 'Request', value: 'request' },
// ];

export const leadStatus = [
	// General Status
	{
		label: 'Interested',
		value: 'active',
		bgColor: 'green.100',
		textColor: 'green.700',
	},
	{ label: 'Sold', value: 'sold', bgColor: 'blue.100', textColor: 'blue.700' },
	{
		label: 'Not Interested',
		value: 'pending',
		bgColor: 'gray.100',
		textColor: 'gray.700',
	},
	{
		label: 'Reassigned',
		value: 'reassigned',
		bgColor: 'orange.100',
		textColor: 'orange.700',
	},
	{ label: 'New', value: 'new', bgColor: 'cyan.100', textColor: 'cyan.700' },

	// Communication Status
	{
		label: 'No Answer',
		value: 'no_answer',
		bgColor: 'red.100',
		textColor: 'red.700',
	},
	{
		label: 'Unreachable',
		value: 'unreachable',
		bgColor: 'purple.100',
		textColor: 'purple.700',
	},
	{
		label: 'Callback',
		value: 'callback',
		bgColor: 'yellow.100',
		textColor: 'yellow.700',
	},
	{
		label: 'Voice Mail',
		value: 'voice_mail',
		bgColor: 'pink.100',
		textColor: 'pink.700',
	},
	{
		label: 'Wrong Number',
		value: 'wrong_number',
		bgColor: 'red.200',
		textColor: 'red.800',
	},

	// Follow-Up Status
	{
		label: 'Waiting',
		value: 'waiting',
		bgColor: 'blue.50',
		textColor: 'blue.600',
	},
	{
		label: 'Follow Up',
		value: 'follow_up',
		bgColor: 'teal.100',
		textColor: 'teal.700',
	},
	{
		label: 'Meeting',
		value: 'meeting',
		bgColor: 'indigo.100',
		textColor: 'indigo.700',
	},
	{
		label: 'Follow Up After Meeting',
		value: 'follow_up_after_meeting',
		bgColor: 'teal.200',
		textColor: 'teal.800',
	},

	// Deal-Related Status
	{
		label: 'Deal',
		value: 'deal',
		bgColor: 'green.200',
		textColor: 'green.800',
	},
	{
		label: 'Deal Out',
		value: 'deal_out',
		bgColor: 'gray.200',
		textColor: 'gray.800',
	},

	// WhatsApp Status
	{
		label: 'Whatsapp Send',
		value: 'whatsapp_send',
		bgColor: 'whatsapp.100',
		textColor: 'whatsapp.700',
	},
	{
		label: 'Whatsapp Rec',
		value: 'whatsapp_rec',
		bgColor: 'whatsapp.200',
		textColor: 'whatsapp.800',
	},

	// Show-Related Status
	{
		label: 'Will Attend the Show',
		value: 'will_attend_the_show',
		bgColor: 'blue.200',
		textColor: 'blue.800',
	},
	{
		label: 'Attended the Show',
		value: 'attended_the_show',
		bgColor: 'blue.300',
		textColor: 'blue.900',
	},

	// Miscellaneous
	{ label: 'Junk', value: 'junk', bgColor: 'gray.300', textColor: 'gray.900' },
	{
		label: 'Shift Project',
		value: 'shift_project',
		bgColor: 'purple.200',
		textColor: 'purple.800',
	},
	{
		label: 'Broker',
		value: 'broker',
		bgColor: 'yellow.200',
		textColor: 'yellow.800',
	},
	{
		label: 'Request',
		value: 'request',
		bgColor: 'orange.200',
		textColor: 'orange.800',
	},
];

export const userLocations = [
	{ label: 'Dubai', value: 'Dubai' },
	{ label: 'Egypt', value: 'Egypt' },
];

export const jobRoles = [
	{ label: 'Manager', value: 'Manager' },
	{ label: 'HR', value: 'HR' },
	{ label: 'Secretary', value: 'Secretary' },
	{ label: 'Team Leader', value: 'Team Leader' },
	{ label: 'Sales', value: 'Sales' },
	{ label: 'Telesales', value: 'Telesales' },
];

export const jobTypes = [
	{ value: 'Salary', label: 'Salary' },
	{ value: 'Commission', label: 'Commission' },
	{ value: 'SalaryPlusCommission', label: 'Salary + Comission' },
];
