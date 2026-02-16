import { css } from '@emotion/react';

export const leadSelectInputSize = 'xs'; // md, lg, sm

export function formatList(items) {
	if (items.length === 1) return items[0];
	if (items.length === 2) return `${items[0]} and ${items[1]}`;
	return `${items.slice(0, -1).join(', ')}, and ${items.at(-1)}`;
}

export const AdminMainStatus = ['deal', 'show'];
export const QualificationMainStatus = [
	'contacted',
	'junk',
	'show',
	'unreachable_after_attempts',
	'lost',
];
export const QualificationSubStatus = [
	'booked_by_himself',
	'no_response',
	'unreachable',
	'outside_coverage',
	'whatsapp_sent',
	'callback_requested',
	'busy',
	'4_attempts',
	'5_attempts',
	'6_attempts',
	'whatsapp_unread',
	'call_not_answered',
	'fake_lead',
	'wrong_number',
	'spam',
	'test_lead',
	'duplicate_confirmed',
	'not_interested_anymore',
];

export const ASSIGNMENT_BY_PERMISSION = {
	bulkAssign_all: ['managerAssigned', 'teamLeadAssigned', 'agentAssigned'],
	bulkAssign_teamLead: ['teamLeadAssigned', 'agentAssigned'],
	bulkAssign_agents: ['agentAssigned'],
};

export const leadlabelFontSize =
	'clamp(0.625rem, min(1vw, 0.625rem), 0.875rem)';
// 10px (large screens) → scales down on mid-sized → increases to 14px on XL screens

export const leadValueFontSize = 'clamp(0.75rem, min(1.2vw, 0.75rem), 1rem)';
// 12px (large screens) → scales down on mid-sized → increases to 16px on XL screens

export const leadIconSize = 'clamp(0.75rem, min(1.2vw, 0.75rem), 1rem)';
// 12px (large screens) → scales down on mid-sized → increases to 16px on XL screens

export const leadSelectInputFontSize =
	'clamp(0.75rem, min(1.2vw, 0.75rem), 1rem)';
// 12px (large screens) → scales down on mid-sized → increases to 16px on XL screens

export const buttonStyle = {
	size: 'sm',
	borderRadius: 'md',
	_hover: { shadow: 'sm', transition: 'all 0.2s ease-in-out' },
	_active: { bg: 'brand.500' },
	color: 'white',
	fontWeight: 'medium',
	sx: {
		svg: { fill: 'white', bg: 'transparent', borderRadius: 'full', p: '.5px' },
	}, // ✅ Only changes icon color
};

export const customDatepickerStyles = css`
	.react-datepicker {
		border: none;
		box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
	}

	.react-datepicker__header {
		background-color: #e5b668;
		color: white;
		border-bottom: none;
	}

	.react-datepicker__current-month,
	.react-datepicker__day-name {
		color: white;
	}

	.react-datepicker__day {
		font-size: 14px;
		&:hover {
			background-color: rgba(229, 182, 104, 0.3);
		}
	}

	.react-datepicker__day--selected {
		background-color: #e5b668 !important;
		color: white !important;
	}

	.react-datepicker__day--keyboard-selected {
		background-color: #e5b668 !important;
		color: white !important;
	}

	.react-datepicker__input-container input {
		width: 100%;
		padding: 10px;
		font-size: 14px;
		border: 2px solid #e5b668;
		border-radius: 8px;
		background: white;
		color: black;
		&:focus {
			border-color: #e5b668;
			box-shadow: 0 0 5px rgba(229, 182, 104, 0.5);
			outline: none;
		}
	}
`;
