import * as yup from "yup";

export const developerSchema = yup.object().shape({
  developer_name: yup
    .string()
    .required("Developer name is required")
    .min(2, "Developer name must be at least 2 characters")
    .max(100, "Developer name cannot exceed 100 characters")
    .trim(),
  address: yup
    .string()
    .max(200, "Address cannot exceed 200 characters")
    .trim()
    .notRequired(), // Optional field
  trn: yup
    .string()
    .matches(/^[0-9]{15}$/, "TRN must be exactly 15 digits") // Assuming TRN is a 15-digit Tax Registration Number, adjust as needed
    .notRequired(), // Optional field
  email: yup
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email cannot exceed 100 characters")
    .notRequired(), // Optional field
});
