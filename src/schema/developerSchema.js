import * as yup from "yup";

export const developerSchema = yup.object({
  developer_name: yup
    .string()
    .required("Developer name is required")
    .min(2, "Developer name must be at least 2 characters"),
  trn: yup
    .string()
    .required("TRN is required")
    .matches(/^\d{5}$/, { message: "TRN must be exactly 5 digits" }),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
});

// Optionally, export userSchema if you still need it elsewhere
export const userSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  username: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  // Add other user fields as needed
});
