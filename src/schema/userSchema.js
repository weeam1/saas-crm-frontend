import * as yup from 'yup';

export const userSchema = yup.object({
	firstName: yup.string().required('First Name is required'),
	lastName: yup.string(),
	agency: yup.string().required('Agency is required'),
	// phoneNumber: yup
	// 	.string()
	// 	.required('Phone Number Is required')
	// 	.matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits'),
	username: yup
		.string()
		.email('Email must be a valid email')
		.required('Email Is required'),
	// profileImage: yup
	// 	.mixed()
	// 	.required('Profile image is required')
	// 	.test('fileType', 'Only PNG or JPG files are allowed', (file) =>
	// 		file ? ['image/png', 'image/jpeg'].includes(file.type) : false
	// 	)
	// 	.test('fileSize', 'File size must be less than 2MB', (file) =>
	// 		file ? file.size <= 2 * 1024 * 1024 : false
	// 	),
});
