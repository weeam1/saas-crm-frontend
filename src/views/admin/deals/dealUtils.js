import * as Yup from 'yup';

export const dealSchema = Yup.object().shape({
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
	 sharePercent: Yup
    .number()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === "" ? null : value;
    })
    .when("shareUser", {
      is: (val) => !!val, 
      then: (schema) =>
        schema
          .typeError("Share Percentage is required")
          .required("Share Percentage is required")
          .min(0.01, "Share Percentage must be greater than 0")
		  .max(100, "Share Percentage cannot exceed 100"),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),
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
