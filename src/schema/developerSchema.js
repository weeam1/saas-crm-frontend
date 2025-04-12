import * as yup from "yup";

export const developerSchema = yup.object({
  developer_name: yup
    .string()
    .required("Developer name is required")
    .min(2, "Developer name must be at least 2 characters"),
  trn: yup.string().required("TRN is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  address: yup
    .string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
});

export const userSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  username: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup.string().required("Phone number is required"),
});
