import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(1, {
        message: "Password is required"
    }),
});

export const ForgotSchema = z.object({
    email: z.string().email({
        message: 'Must be a valid email address',
    }),
});

export const SignupSchema = z.object({
    email: z.string().email({
        message: "Email is required"
    }),
    password: z.string().min(8, {
        message: "Minimum 8 characters required"
    }),
    confirmPassword: z.string().min(8, {
        message: "Minimum 8 characters required"
    }),
    termsAccepted: z.boolean(),
    firstName: z.string().min(1,"first name is required"),
    lastName: z.string().min(1,"last name is required"),
    address: z.string().min(1,"address is required"),
    lga: z.string().min(1,"lga is required"),
    zipCode: z.string().min(1,"Zip code is required"),
    state: z.string().min(1,"State is required"),
    gender: z.string().min(1,"gender is required"),
    maritalStatus: z.string().min(1,"marital status is required"),
    aboutUs: z.string().min(1,"how you heard about us is required"),
    phone1: z.string().min(1,"primary phone number is required"),
    phone2: z.string().min(1,"secondary phone number is required"),
    occupation: z.string().min(1,"occupation is required"),
}).refine((data) => data.phone1 !== data.phone2, {
    message: "Primary and Secondary Phone number cannot be the same",
    path: ["phone2"],
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
});

export const ResetPasswordSchema = z.object({
    password: z.string().min(8, {
        message: "Minimum 8 characters required"
    }),
    confirmPassword: z.string().min(8, {
        message: "Minimum 8 characters required"
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match!",
    path: ["confirmPassword"],
});

export const LoanRequestSchema = z.object({
    collateral: z.string().min(1, "collateral is required"),
    account_holder: z.string().min(1, "account holder is required"),
    bank_name: z.string().min(1, "bank name is required"),
    account_number: z.string().min(1, "account number is required"),
    bvn: z.string().min(1, "bvn is required"),
    occupation: z.string().min(1, "occupation is required"),
    guarantor_name: z.string().optional(),
    guarantor_email: z.string().optional(),
    guarantor_phone: z.string().optional(),
    guarantor_ippis_no: z.string().optional(),
    employer_address: z.string().optional(),
    employer_name: z.string().optional(),
    employer_phone: z.string().optional(),
    ippis_no: z.string().optional(),
});

export const ChangePassword = z.object({
    currentPassword: z.string().min(8, {
        message: "Minimum 8 characters required"
    }),
    newPassword: z.string().min(8, {
        message: "Minimum 8 characters required"
    }),
    confirmNewPassword: z.string().min(8, {
        message: "Minimum 8 characters required"
    }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match!",
    path: ["confirmNewPassword"],
});

export const UpdateUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    phone1: z.string().optional(),
    phone2: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    state: z.string().optional(),
    gender: z.string().optional(),
    maritalStatus: z.string().optional(),
    occupation: z.string().optional(),
    imgUrl: z.string().optional(),
});

  