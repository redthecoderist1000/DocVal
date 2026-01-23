import { getConnection } from "@/app/api/helper/db";
import sql from "mssql";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const pool = await getConnection();
    const selectReq = pool.request();
    const selectRes = await selectReq
      .input("email", sql.VarChar(255), email)
      .execute("dbo.checkEmail");

    const user_id = selectRes.recordset[0]?.id;

    if (selectRes.recordset.length > 0) {
      // create otp
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // hash otp
      const hashedOtp = await bcrypt.hash(otp, 10);
      const expires_at = new Date();
      expires_at.setMinutes(expires_at.getMinutes() + 10); // otp valid for 10 minutes

      // store otp hash in db
      const storeOtpReq = pool.request();
      await storeOtpReq
        .input("otp", sql.VarChar(255), hashedOtp)
        .input("user_id", sql.UniqueIdentifier, user_id)
        .input("expires_at", sql.DateTime, expires_at)
        .execute("dbo.createOtp");

      // send otp to email
      // kunyari email muna  to
      // console.log(`Sending OTP ${otp} to email ${email}`);

      return NextResponse.json(
        {
          message: `OTP sent to ${email}`,
          body: { user_id }, // remove otp in production
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ message: "Invalid Email" }, { status: 200 });
    }
  } catch (error) {
    console.error("Error checking email:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
