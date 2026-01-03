import { FaSimCard, FaWhatsapp } from 'react-icons/fa';
import { FiPhone, FiWifi } from 'react-icons/fi';

export const FEEDBACK_REASON_OPTIONS = [
	{ value: 'vpn_issue', label: 'VPN Issue' },
	{ value: 'voice_cutting', label: 'Voice Cutting' },
	{ value: 'latency', label: 'High Latency' },
	{ value: 'unable_to_login', label: 'Unable to Login' },
	{ value: 'unable_to_call', label: 'Unable to Call' },
];

export const CALL_MEDIUM_OPTIONS = [
	{
		value: 'external_sim',
		label: 'External SIM',
		icon: FaSimCard,
		color: 'orange',
	},
	{ value: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: 'green' },
	{ value: 'dailer', label: 'Dialer', icon: FiPhone, color: 'blue' },
];

export const QUALITY_STARS = [
	{ value: 'very_bad', label: 'Very Bad', stars: 1 },
	{ value: 'bad', label: 'Bad', stars: 2 },
	{ value: 'average', label: 'Average', stars: 3 },
	{ value: 'good', label: 'Good', stars: 4 },
	{ value: 'excellent', label: 'Excellent', stars: 5 },
];

export const CALL_QUALITY_OPTIONS = [
	{ value: 'excellent', label: '⭐ Excellent' },
	{ value: 'good', label: '👍 Good' },
	{ value: 'average', label: '⚡ Average' },
	{ value: 'bad', label: '👎 Bad' },
	{ value: 'very_bad', label: '❌ Very Bad' },
];
