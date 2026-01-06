// import { salaryTypes } from "utils/options";
// import * as yup from "yup";

// export const getSalaryType = (salaryType) =>
//   salaryTypes.find((t) => t.value === salaryType);

// export const userSchema = yup.object({
//   firstName: yup.string().required("First Name is required"),
//   lastName: yup.string(),
//   agency: yup.string().required("Agency is required"),

//   username: yup
//     .string()
//     .email("Email must be a valid email")
//     .required("Email Is required"),
//   salaryType: yup
//     .string()
//     .required("Salary type is required")
//     .test("valid-salary-type", "Salary type is required", (value) => {
//       return salaryTypes.some((t) => t.value === value);
//     }),

//   // salary: yup
//   // 	.number()
//   // 	.transform((v) => (isNaN(v) ? undefined : v))
//   // 	.when('salaryType', (salaryType, schema) => {
//   // 		const type = getSalaryType(salaryType[0]);
//   // 		if (type?.hasBaseSalary) {
//   // 			return schema
//   // 				.required('Salary amount is required')
//   // 				.positive('Salary must be a positive amount');
//   // 		}
//   // 		return schema.optional().nullable();
//   // 	}),

//   commission: yup
//     .number()
//     .transform((v) => (isNaN(v) ? undefined : v))
//     .when("salaryType", (salaryType, schema) => {
//       const type = getSalaryType(salaryType[0]);

//       if (type?.hasCommission) {
//         return schema
//           .required("Commission rate is required")
//           .min(0, "Commission must be at least 0%")
//           .max(100, "Commission cannot exceed 100%");
//       }
//       return schema.optional().nullable();
//     }),

//   // commissionType: yup
//   // 	.number()
//   // 	.transform((v) => (isNaN(v) ? undefined : v))
//   // 	.when('salaryType', (salaryType, schema) => {
//   // 		const type = getSalaryType(salaryType[0]);

//   // 		if (type?.hasCommission) {
//   // 			return schema.required('Commission type is required');
//   // 		}
//   // 		return schema.optional().nullable();
//   // 	}),

//   incentive: yup
//     .number()
//     .transform((v) => (isNaN(v) ? undefined : v))
//     .when("salaryType", (salaryType, schema) => {
//       const type = getSalaryType(salaryType[0]);

//       if (type?.hasIncentive) {
//         return schema
//           .required("Incentive amount is required")
//           .positive("Incentive amount must be positive");
//       }
//       return schema.optional().nullable();
//     }),

//   nationality: yup.string().optional(),
//   dob: yup.date().optional().max(new Date(), "Date cannot be in future"),
//   passportId: yup.string().optional(),
//   uaeId: yup.string().optional(),
//   drivingLicense: yup.string().optional(),
//   education: yup.string().optional(),
//   uaeAddress: yup.string().optional(),
//   homeCountry: yup.string().optional(),
//   homeCountryAddress: yup.string().optional(),
//   intlPhone: yup.string().optional(),
// });

// // phoneNumber: yup
// // 	.string()
// // 	.required('Phone Number Is required')
// // 	.matches(/^\d{10}$/, 'Phone Number must be exactly 10 digits'),
// // profileImage: yup
// // 	.mixed()
// // 	.required('Profile image is required')
// // 	.test('fileType', 'Only PNG or JPG files are allowed', (file) =>
// // 		file ? ['image/png', 'image/jpeg'].includes(file.type) : false
// // 	)
// // 	.test('fileSize', 'File size must be less than 2MB', (file) =>
// // 		file ? file.size <= 2 * 1024 * 1024 : false
// // 	),

import { salaryTypes } from 'utils/options';
import * as yup from 'yup';

export const getSalaryType = (salaryType) =>
	salaryTypes.find((t) => t.value === salaryType);

/**
 * @param {Object} options
 * @param {boolean} options.isAdmin
 * @param {boolean} options.isSuperAdmin
 *
 * DEFAULT:
 * If nothing is passed, behaves like old schema (admin-level validation)
 */
export const userSchema = ({ isAdmin = true, isSuperAdmin = true } = {}) =>
	yup.object({
		firstName: yup.string().required('First Name is required'),
		lastName: yup.string(),

		agency:
			isAdmin || isSuperAdmin
				? yup.string().required('Agency is required')
				: yup.string().nullable(),

		username: yup
			.string()
			.email('Email must be a valid email')
			.required('Email Is required'),

		salaryType:
			isAdmin || isSuperAdmin
				? yup
						.string()
						.required('Salary type is required')
						.test('valid-salary-type', 'Salary type is required', (value) =>
							salaryTypes.some((t) => t.value === value)
						)
				: yup.string().nullable(),

		salary:
			isAdmin || isSuperAdmin
				? yup
						.number()
						.transform((v) => (isNaN(v) ? undefined : v))
						.when('salaryType', (salaryType, schema) => {
							const type = getSalaryType(salaryType[0]);
							if (type?.hasBaseSalary) {
								return schema
									.required('Salary amount is required')
									.min(0, 'Salary must be a positive amount');
							}
							return schema.optional().nullable();
						})
				: yup.number().nullable(),

		commission:
			isAdmin || isSuperAdmin
				? yup
						.number()
						.transform((v) => (isNaN(v) ? undefined : v))
						.when('salaryType', (salaryType, schema) => {
							const type = getSalaryType(salaryType[0]);
							if (type?.hasCommission) {
								return schema
									.required('Commission rate is required')
									.min(0, 'Commission must be at least 0%')
									.max(100, 'Commission cannot exceed 100%');
							}
							return schema.optional().nullable();
						})
				: yup.number().nullable(),

		incentive:
			isAdmin || isSuperAdmin
				? yup
						.number()
						.transform((v) => (isNaN(v) ? undefined : v))
						.when('salaryType', (salaryType, schema) => {
							const type = getSalaryType(salaryType[0]);
							if (type?.hasIncentive) {
								return schema
									.required('Incentive amount is required')
									.min(0, 'Incentive must be a positive amount');
							}
							return schema.optional().nullable();
						})
				: yup.number().nullable(),

		nationality: yup.string().optional(),
		dob: yup.date().optional().max(new Date(), 'Date cannot be in future'),
		passportId: yup.string().optional(),
		uaeId: yup.string().optional(),
		drivingLicense: yup.string().optional(),
		education: yup.string().optional(),
		uaeAddress: yup.string().optional(),
		homeCountry: yup.string().optional(),
		homeCountryAddress: yup.string().optional(),
		intlPhone: yup.string().optional(),
	});
