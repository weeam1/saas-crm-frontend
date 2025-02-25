import * as yup from 'yup';

export const userSchema = yup.object({
	firstName: yup.string().required('First Name is required'),
	lastName: yup.string(),
	agency: yup.string().required('Agency is required'),
	phoneNumber: yup
		.string()
		.required('Phone Number Is required')
		.matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits'),
	username: yup
		.string()
		.email('Email must be a valid email')
		.required('Email Is required'),
});
