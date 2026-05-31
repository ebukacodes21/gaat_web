const main = `${process.env.NEXT_PUBLIC_BASE_API_URL}`;

const ApiConfig = {
  register: `${main}/register`,
  verify: `${main}/verify`,
  login: `${main}/login`,
  login_staff: `${main}/login-staff`,
  forgot: `${main}/forgot`,
  reset: `${main}/reset`,
  resend: `${main}/resend`,
  updateUser: `${main}/user/update-account`,
  updatePassword: `${main}/user/update-password`,
  manageUser: `${main}/users/manage`, 

  user: `${main}/user`,
  users: `${main}/users`,
  queryUser: `${main}/user/query`,

  getLoanTypes: `${main}/loan-types`,
  upload: `${main}/upload`,
  requestLoan: `${main}/loans/request`,
  getUserLoans: `${main}/loans/user`,
  getUserDeposits: `${main}/deposits/user`,
  requestDeposit: `${main}/deposits/request`,
  loans: `${main}/loans`,
  loan: `${main}/loan`,
  manageLoan: `${main}/loans/manage`,
  manageDeposit: `${main}/deposits/manage`,
  deposit: `${main}/deposit`,
  deposits: `${main}/deposits`,

  createLoanType: `${main}/loan-types/create`,
  UpdateLoanType: `${main}/loan-types/update`,

  createStaff: `${main}/staffs/create`,
  staffs: `${main}/staffs`,
  staff: `${main}/staff`,
  updateStaff: `${main}/staffs/update`,
  manageStaff: `${main}/staffs/manage`,
};

export default ApiConfig;
