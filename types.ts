export type Loan = {
  id: string;
  loan_type: string;
  principal_amount: number;
  interest_rate: number;
  monthly_amount: number;
  monthly_interest: number;
  total_interest: number;
  admin_fee: number;
  total_repayment: number;
  total_repaid: number;
  total_unpaid: number;
  number_of_repayments: number;
  months: number;
  due_date: string;
  next_payment_date?: string;
  approved_date?: string;
  status: string;
  collateral: string;
  account_holder: string;
  guarantor_name: string;
  guarantor_email: string;
  guarantor_phone: string;
  guarantor_ippis_no: string;
  bank_name: string;
  account_number: string;
  bvn: string;
  occupation: string;
  employer_address?: string;
  employer_name?: string;
  employer_phone?: string;
  your_ippis_no?: string;
  statement: string;
  admin_fee_receipt: string;
  collateral_document: string;
  loan_interest?: string;
  user_id: string;
  borrower_name: string;
  email: string;
  created_at: string;
};

export type Deposit = {
  id: string;
  type: string;
  status: string;
  months: number;
  receipt: string;
  loan_id: string;
  amount: number;
  user_id: string;
  email: string;
  created_at: string;
};

export type Pagination = {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
};

export type LoanListResult = {
  items: Loan[];
  pagination: Pagination;
};

export type BankResponse = {
  id: number;
  name: string;
  slug: string;
  code: string;
  logo: string;
};

export type UserRole = "admin" | "supervisor" | "staff" | "user";

export type User = {
  id: string;
  email: string;
  email_verified: boolean;
  role: UserRole;
  account_enabled: boolean;
  last_login: string | null;
  first_name: string;
  last_name: string;
  address: string;
  lga: string;
  zip_code?: string | null;
  state: string;
  gender: "Male" | "Female" | string;
  marital_status: "Single" | "Married" | "Divorced" | string;
  phone1: string;
  phone2?: string | null;
  occupation: string;
  img_url: string;
  created_at: string;
  updated_at: string;
  code_expires_in: string | null;
}