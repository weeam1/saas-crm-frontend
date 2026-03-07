export const NOTIFICATION_TYPES = {
	ANNOUNCEMENT: 'ANNOUNCEMENT',
	LEAD_ASSIGNED: 'LEAD_ASSIGNED',
	LEAD_CLAIMED: 'LEAD_CLAIMED',
	LEAD_CREATED: 'LEAD_CREATED',
	LEAD_BULK_ASSIGNED: 'LEAD_BULK_ASSIGNED',

	INTERVIEW_INVITE: 'INTERVIEW_INVITE',

	TASK_ASSIGNED: 'TASK_ASSIGNED',
	TASK_COMPLETED: 'TASK_COMPLETED',

	SYSTEM_ALERT: 'SYSTEM_ALERT',
};

export const NOTIFICATION_MESSAGE_TEMPLATES = {
	LEAD_ASSIGNED: ({ leadName }) =>
		`A new lead "${leadName}" has been assigned to you.`,

	LEAD_CLAIMED: ({ userName, leadName }) =>
		`${userName} claimed the lead "${leadName}".`,

	INTERVIEW_INVITE: ({ senderName, candidateName, role }) =>
		`${senderName} invited you to evaluate ${candidateName} for ${role}.`,
};
