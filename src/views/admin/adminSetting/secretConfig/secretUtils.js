import {
	FiUsers,
	FiMail,
	FiMessageSquare,
	FiVideo,
	FiCreditCard,
	FiDatabase,
	FiShield,
	FiServer,
	FiBarChart2,
	FiGlobe,
	FiPhone,
	FiKey,
} from 'react-icons/fi';

import {
	SiStripe,
	SiTwilio,
	SiWhatsapp,
	SiHubspot,
	SiSalesforce,
	SiMailchimp,
	SiFirebase,
	SiGoogleanalytics,
	SiAmazonaws,
	SiMongodb,
	SiOpenai,
	SiFacebook,
} from 'react-icons/si';

import { MdCurrencyExchange } from 'react-icons/md';

export const SERVICE_META = {
	// CRM Core
	crm: { icon: FiUsers, color: 'blue.500' },
	sales: { icon: FiBarChart2, color: 'green.500' },
	marketing: { icon: SiMailchimp, color: 'yellow.500' },
	analytics: { icon: SiGoogleanalytics, color: 'orange.500' },
	support: { icon: FiMessageSquare, color: 'purple.500' },

	// Communication
	email: { icon: FiMail, color: 'red.500' },
	smtp: { icon: FiMail, color: 'red.400' },
	whatsapp: { icon: SiWhatsapp, color: 'green.400' },
	facebook: { icon: SiFacebook, color: 'blue.400' },
	sms: { icon: FiMessageSquare, color: 'cyan.500' },
	twilio: { icon: SiTwilio, color: 'red.600' },
	phone: { icon: FiPhone, color: 'teal.500' },

	// Payments
	stripe: { icon: SiStripe, color: 'purple.600' },
	payment: { icon: FiCreditCard, color: 'purple.500' },

	// Currency
	currency: { icon: MdCurrencyExchange, color: 'green.600' },

	// AI
	openai: { icon: SiOpenai, color: 'gray.700' },

	// Infrastructure
	database: { icon: FiDatabase, color: 'blue.600' },
	mongodb: { icon: SiMongodb, color: 'green.700' },
	aws: { icon: SiAmazonaws, color: 'orange.400' },
	firebase: { icon: SiFirebase, color: 'yellow.400' },
	server: { icon: FiServer, color: 'gray.600' },

	// Security
	auth: { icon: FiShield, color: 'red.500' },
	api: { icon: FiKey, color: 'yellow.600' },
	token: { icon: FiKey, color: 'orange.600' },

	// Real-time
	webrtc: { icon: FiPhone, color: 'blue.400' },
	websocket: { icon: FiGlobe, color: 'cyan.600' },

	// Enterprise CRM
	hubspot: { icon: SiHubspot, color: 'orange.500' },
	salesforce: { icon: SiSalesforce, color: 'blue.400' },
};

export const getServiceMeta = (service) => {
	return (
		SERVICE_META[service?.toLowerCase()] || {
			icon: FiShield,
			color: 'gray.500',
		}
	);
};

export const getEnvironmentBadge = (env) => {
	const colors = {
		development: { bg: 'green.50', color: 'green.700', label: 'Dev' },
		staging: { bg: 'orange.50', color: 'orange.700', label: 'Stg' },
		production: { bg: 'red.50', color: 'red.700', label: 'Prod' },
	};
	return colors[env] || colors.development;
};
