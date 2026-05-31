import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const accountNumber = req.nextUrl.searchParams.get("account_number");
  const bankCode = req.nextUrl.searchParams.get("bank_code");

  if (!accountNumber || !bankCode) {
    return NextResponse.json({ error: "Missing account number or bank code" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${"001"}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error)
    const message = error.response?.data?.message || "Failed to resolve account";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}