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
