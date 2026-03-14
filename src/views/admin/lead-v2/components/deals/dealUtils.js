import * as Yup from 'yup';

export const dealSchema = Yup.object().shape({
	// clientName: Yup.string()
	// 	.min(2, 'Name must be at least 2 characters')
	// 	.required('Client name is required'),

	// clientNumber: Yup.string()
	// 	.matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number')
	// 	.required('Client number is required'),

	// clientWhatsapp: Yup.string()
	// 	.matches(/^\+?[0-9]{10,15}$/, 'Invalid WhatsApp number')
	// 	.optional(),

	developer: Yup.string()
		.min(1, 'Developer is required')
		.required('Developer is required'),

	salesPerson: Yup.string()
		.min(1, 'Sales person is required')
		.required('Sales person is required'),

	projectName: Yup.string()
		.min(1, 'Project name is required')
		.required('Project name is required'),

	unitNumber: Yup.string()
		.min(1, 'Unit number is required')
		.required('Unit number is required'),

	unitType: Yup.string()
		.min(1, 'Unit type is required')
		.required('Unit type is required'),

	unitPrice: Yup.number()
		.typeError('Unit price must be a number')
		.min(1, 'Price must be positive')
		.required('Unit price is required'),

	downpaymentPaid: Yup.number()
		.typeError('Downpayment must be a number')
		.min(0, 'Cannot be negative')
		.required('Downpayment is required'),

	bookingAmountPaid: Yup.number()
		.typeError('Booking amount must be a number')
		.min(0, 'Cannot be negative')
		.required('Booking amount is required'),

	companyCommissionAmount: Yup.number()
		.typeError('Company commission must be a number')
		.min(0, 'Cannot be negative')
		.required('Company commission is required'),

	companyCommissionPercent: Yup.number()
		.typeError('Company commission % must be a number')
		.min(0, 'Cannot be negative')
		.max(100, 'Max value is 100')
		.required('Company commission % is required'),

	spaDone: Yup.boolean().optional(),
	invoiceSent: Yup.boolean().optional(),
	commissionStatus: Yup.string().required('Comission status is required'),
});

export const roundTo2 = (n) => Math.round(n * 100) / 100;

export const ALLOWED_FILE_TYPES = [
	'application/pdf',
	'application/msword',
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const commissionStatuses = [
	{
		label: 'Fully Paid',
		value: 'Fully Paid',
	},
	{
		label: 'Partially Paid',
		value: 'Partially Paid',
	},
];

export const currencies = [
	{
		label: 'AED',
		value: 'AED',
	},
];

// export const getSharedUsersData = ({
// 	lead,
// 	user, // login user
// 	unitPrice = 0,
// 	companyCommissionAmount = 0,
// 	companyCommissionPercent = 0,
// 	shareUserId,
// 	sharePercent = 0,
// 	users = [],
// }) => {
// 	if (!lead) return [];

// 	// Find selected shared user (if any)
// 	const sharedUser = shareUserId
// 		? users.find((u) => u._id === shareUserId)
// 		: null;

// 	const unitPriceNum = Number(unitPrice) || 0;
// 	const companyAmountNum = Number(companyCommissionAmount) || 0;
// 	const companyPercentNum = Number(companyCommissionPercent) || 0;

// 	const result = [];

// 	// --- Commission calculation ---
// 	const calculateCompanyCommission = () => {
// 		if (companyAmountNum > 0) return companyAmountNum;
// 		if (companyPercentNum > 0 && unitPriceNum > 0) {
// 			return (unitPriceNum * companyPercentNum) / 100;
// 		}
// 		return 0;
// 	};

// 	const calculateCommissionAmount = (userData, percentOverride = null) => {
// 		if (!userData) return 0;

// 		const commissionPercent =
// 			percentOverride !== null
// 				? percentOverride
// 				: Number(userData.commission) || 0;

// 		if (commissionPercent <= 0) return 0;

// 		const type = userData.commissionType?.toUpperCase();

// 		if (type === 'COMPANY_COMMISSION') {
// 			const base = calculateCompanyCommission();
// 			return (base * commissionPercent) / 100;
// 		}

// 		// DEAL_COMMISSION (default)
// 		if (unitPriceNum > 0 && commissionPercent > 0) {
// 			return (unitPriceNum * commissionPercent) / 100;
// 		}
// 		return 0;
// 	};

// 	// --- Collect eligible users (agent, manager) ---
// 	const usersList = [];

// 	if (lead.agentDetails?._id) {
// 		usersList.push({
// 			role: 'agent',
// 			data: lead.agentDetails,
// 			percent: Number(lead.agentDetails.commission) || 0,
// 		});
// 	}

// 	if (lead.managerDetails?._id) {
// 		usersList.push({
// 			role: 'manager',
// 			data: lead.managerDetails,
// 			percent: Number(lead.managerDetails.commission) || 0,
// 		});
// 	}

// 	// If neither manager nor agent → use login user
// 	if (usersList.length === 0 && user) {
// 		usersList.push({
// 			role: 'current_user',
// 			data: {
// 				_id: user._id,
// 				fullName: user.fullName || user.name || user.username,
// 				commission: Number(user.commission) || 0,
// 				commissionType: user.commissionType || 'DEAL_COMMISSION',
// 			},
// 			percent: Number(user.commission) || 0,
// 		});
// 	}

// 	// If no shared user → normal behavior (return original users)
// 	if (!sharedUser || sharePercent <= 0) {
// 		for (const u of usersList) {
// 			result.push({
// 				user: u.data._id,
// 				name: u.data.fullName,
// 				commission: u.percent,
// 				commissionType: u.data.commissionType,
// 				commissionAmount: calculateCommissionAmount(u.data),
// 				role: u.role,
// 			});
// 		}
// 		return result;
// 	}

// 	// ------------------------
// 	// APPLY PROPORTIONAL SHARING
// 	// ------------------------

// 	// Sum of commissions of whoever exists
// 	const T = usersList.reduce((sum, u) => sum + u.percent, 0);
// 	const totalCommissionAmount = usersList.reduce(
// 		(sum, u) => sum + u.commissionAmount,
// 		0
// 	);

// 	// Shared user gets total*T%S
// 	const sharedCommissionPercent = T * (sharePercent / 100);

// 	// Each original user loses proportional %
// 	for (const u of usersList) {
// 		const loss = u.percent * (sharePercent / 100); // proportional cut
// 		const newPercent = u.percent - loss;

// 		result.push({
// 			user: u.data._id,
// 			name: u.data.fullName,
// 			role: u.role,
// 			commission: newPercent,
// 			commissionType: u.data.commissionType,
// 			commissionAmount: calculateCommissionAmount(u.data, newPercent),
// 		});
// 	}

// 	// Add shared user final entry
// 	result.push({
// 		user: sharedUser._id,
// 		name: sharedUser.fullName,
// 		role: 'shared_user',
// 		commission: sharedCommissionPercent,
// 		commissionType: 'DEAL_COMMISSION', // shared always from total
// 		commissionAmount:
// 			totalCommissionAmount * (sharedCommissionPercent / 100) || 0,
// 	});

// 	return result;
// };

export const getSharedUsersData = ({
	lead,
	user, // login user
	unitPrice = 0,
	companyCommissionAmount = 0,
	companyCommissionPercent = 0,
	shareUserId,
	sharePercent = 0,
	users = [],
}) => {
	if (!lead) return [];

	// Find selected shared user (if any)
	const sharedUser = shareUserId
		? users.find((u) => u._id === shareUserId)
		: null;

	const unitPriceNum = Number(unitPrice) || 0;
	const companyAmountNum = Number(companyCommissionAmount) || 0;
	const companyPercentNum = Number(companyCommissionPercent) || 0;

	console.log({ unitPriceNum, companyAmountNum, companyPercentNum });

	const result = [];

	// --- Commission calculation ---
	const calculateCompanyCommission = () => {
		if (companyAmountNum > 0) return companyAmountNum;
		if (companyPercentNum > 0 && unitPriceNum > 0) {
			return (unitPriceNum * companyPercentNum) / 100;
		}
		return 0;
	};

	const calculateCommissionAmount = (userData, percentOverride = null) => {
		if (!userData) return 0;

		const commissionPercent =
			percentOverride !== null
				? percentOverride
				: Number(userData.commission) || 0;

		if (commissionPercent <= 0) return 0;

		const type = userData.commissionType?.toUpperCase();

		if (type === 'COMPANY_COMMISSION') {
			const base = calculateCompanyCommission();
			return (base * commissionPercent) / 100;
		}

		// DEAL_COMMISSION (default)
		if (unitPriceNum > 0 && commissionPercent > 0) {
			return (unitPriceNum * commissionPercent) / 100;
		}
		return 0;
	};

	// --- Collect eligible users (agent, manager) ---
	const usersList = [];

	if (lead.agentDetails?._id) {
		usersList.push({
			role: 'agent',
			data: lead.agentDetails,
			percent: Number(lead.agentDetails.commission) || 0,
		});
	}

	if (lead.managerDetails?._id) {
		usersList.push({
			role: 'manager',
			data: lead.managerDetails,
			percent: Number(lead.managerDetails.commission) || 0,
		});
	}
	if (lead.teamLeadDetails?._id) {
		usersList.push({
			role: 'teamLeader',
			data: lead.teamLeadDetails,
			percent: Number(lead.teamLeadDetails.commission) || 0,
		});
	}

	// If neither manager nor agent → use login user
	if (usersList.length === 0 && user) {
		usersList.push({
			role: 'current_user',
			data: {
				_id: user._id,
				fullName: user.fullName || user.name || user.username,
				commission: Number(user.commission) || 0,
				commissionType: user.commissionType || 'DEAL_COMMISSION',
			},
			percent: Number(user.commission) || 0,
		});
	}

	// --- Calculate original amounts BEFORE any sharing ---
	const originalUsers = usersList.map((u) => {
		const originalAmount = calculateCommissionAmount(u.data, u.percent);
		return {
			...u,
			originalPercent: u.percent,
			originalAmount,
		};
	});

	const originalTotalPercent = originalUsers.reduce(
		(sum, u) => sum + u.originalPercent,
		0,
	);

	const originalTotalAmount = originalUsers.reduce(
		(sum, u) => sum + u.originalAmount,
		0,
	);

	// If no shared user or sharePercent = 0 → return original users
	if (!sharedUser || sharePercent <= 0) {
		for (const u of originalUsers) {
			result.push({
				user: u.data._id,
				name: u.data.fullName,
				role: u.role,
				commission: u.percent,
				commissionType: u.data.commissionType,
				commissionAmount: u.originalAmount,
			});
		}
		return result;
	}

	// ------------------------
	// APPLY PROPORTIONAL SHARING
	// ------------------------
	const sharedCommissionPercent = originalTotalPercent * (sharePercent / 100);

	const sharedCommissionAmount = originalTotalAmount * (sharePercent / 100);

	// Reduce each original user proportionally
	for (const u of originalUsers) {
		const lossPercent = u.originalPercent * (sharePercent / 100);
		const newPercent = u.originalPercent - lossPercent;

		result.push({
			user: u.data._id,
			name: u.data.fullName,
			role: u.role,
			commission: newPercent,
			commissionType: u.data.commissionType,
			commissionAmount: calculateCommissionAmount(u.data, newPercent),
		});
	}

	// Add shared user entry
	result.push({
		user: sharedUser._id,
		name: sharedUser.fullName,
		role: 'shared_user',
		commission: sharedCommissionPercent,
		commissionType: 'SHARED_COMMISSION',
		commissionAmount: sharedCommissionAmount,
	});

	return result;
};
