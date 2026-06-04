import { COOKIE_NAME } from "@/constants";
import ApiConfig from "@/services/api-config";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const routeMap: Record<string, string> = {
  register: ApiConfig.register,
  verify: ApiConfig.verify,
  login: ApiConfig.login,
  login_staff: ApiConfig.login_staff,
  forgot: ApiConfig.forgot,
  reset: ApiConfig.reset,
  resend: ApiConfig.resend,
  update_user: ApiConfig.updateUser,
  manage_user: ApiConfig.manageUser,
  update_password: ApiConfig.updatePassword,
  loan_types: ApiConfig.getLoanTypes,
  upload: ApiConfig.upload,
  request_loan: ApiConfig.requestLoan,
  user_loans: ApiConfig.getUserLoans,
  user_deposits: ApiConfig.getUserDeposits,
  request_deposit: ApiConfig.requestDeposit,
  loans: ApiConfig.loans,
  loan: ApiConfig.loan,
  manage_loan: ApiConfig.manageLoan,
  deposit: ApiConfig.deposit,
  deposits: ApiConfig.deposits,
  manage_deposit: ApiConfig.manageDeposit,
  create_loan_type: ApiConfig.createLoanType,
  update_loan_type: ApiConfig.UpdateLoanType,
  user: ApiConfig.user,
  users: ApiConfig.users,
  query_user: ApiConfig.queryUser,
  staffs: ApiConfig.staffs,
  create_staff: ApiConfig.createStaff,
  update_staff: ApiConfig.updateStaff,
  manage_staff: ApiConfig.manageStaff,
  admin_loan_types: ApiConfig.adminLoanTypes,
};

/**
 * Resolves the incoming catch-all slug array into a clean target URL.
 * Handles both plain routes (e.g., ['login']) and nested paths (e.g., ['user', 'login'] or ['loan', 'deposit']).
 */
function buildTargetUrl(slug?: string[]): string | null {
  if (!slug || slug.length === 0) return null;

  // 1. Check the last segment directly (e.g., /api/loan/deposit -> 'deposit')
  const lastSegment = slug[slug.length - 1];
  if (routeMap[lastSegment]) {
    return routeMap[lastSegment];
  }

  // 2. Check the full joined subpath just in case (e.g., /api/update_user -> 'update_user')
  const joinedPath = slug.join("/");
  if (routeMap[joinedPath]) {
    return routeMap[joinedPath];
  }

  return null;
}

async function handleProxyRequest(
  request: NextRequest,
  method: string,
  slug?: string[],
) {
  try {
    const targetUrl = buildTargetUrl(slug);
    if (!targetUrl) {
      return NextResponse.json(
        {
          success: false,
          message: `Route mapping not found for: ${slug?.join("/")}`,
        },
        { status: 404 },
      );
    }

    // Append any incoming search parameters or query filters cleanly (?page=1 etc.)
    const { searchParams } = new URL(request.url);
    const finalUrl = searchParams.toString()
      ? `${targetUrl}?${searchParams.toString()}`
      : targetUrl;

    // Securely read auth token from the client cookies
    const token = request.cookies.get(COOKIE_NAME)?.value;

    // Conditionally extract incoming payload bodies for write verbs
    const hasBody = !["GET", "DELETE", "HEAD"].includes(method.toUpperCase());
    const contentType = request.headers.get("content-type");
    const isMultipart = contentType?.includes("multipart/form-data");

    // Determine body and headers
    let bodyData: any = undefined;
    let headers: Record<string, string> = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    if (isMultipart) {
      // If it's multipart, forward the original body and headers
      bodyData = await request.formData();
      headers["Content-Type"] = contentType!;
    } else if (hasBody) {
      // For standard JSON requests
      try {
        bodyData = await request.json();
        headers["Content-Type"] = "application/json";
      } catch {
        bodyData = undefined;
      }
    }

    const res = await axios({
      method,
      url: finalUrl,
      data: bodyData,
      headers: headers, // Use the dynamic headers
      validateStatus: () => true,
    });

    const response = NextResponse.json(res.data, { status: res.status });

    // Cookie lifecycle management interceptor
    const lastSegment = slug ? slug[slug.length - 1] : "";
    if (["login", "login_staff", "verify", "register"].includes(lastSegment)) {
      const receivedToken = res.data?.data?.token || res.data?.token;

      if (receivedToken) {
        response.cookies.set(COOKIE_NAME, receivedToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
          sameSite: "lax",
          maxAge: res.data?.data?.expires_in || 60 * 60 * 12, // 12-hour fallback window
        });
      }
    }

    return response;
  } catch (error: any) {
    console.log(error, "err")
    return NextResponse.json(
      {
        success: false,
        message:
          error.response?.data?.message ||
          error.message ||
          "Internal Proxy Routing Error",
      },
      { status: error.response?.status || 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  return handleProxyRequest(req, "GET", slug);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  return handleProxyRequest(req, "POST", slug);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  return handleProxyRequest(req, "PATCH", slug);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  return handleProxyRequest(req, "PUT", slug);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> },
) {
  const { slug } = await params;
  return handleProxyRequest(req, "DELETE", slug);
}
