import { NextResponse } from "next/server";
import sql from "mssql";
import bcrypt from "bcrypt";
import { getConnection } from "@/app/api/helper/db";
import {
  gen_access_JWT,
  gen_refresh_JWT,
} from "@/app/api/helper/generateToken";
import { Resend } from "resend";
import NewAccountEmail from "@/helper/emailTemplates/new_account";
import { getErrorMessage } from "@/app/api/helper/errorHandler";

/**
 * POST /api/auth/register
 * Registers a new user account
 *
 * Request body:
 * {
 *   "f_name": "John",
 *   "m_name": "Doe",
 *   "l_name": "Smith",
 *   "email": "john@example.com",
 *   "password": "hashedPassword",
 *   "role": "user",
 *   "division": "uuid"
 * }
 */
export async function POST(request) {
  try {
    const { f_name, m_name, l_name, email, password, role, division } =
      await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Get database connection
    const pool = await getConnection();

    // Check if user already exists
    const selectRequest = pool.request();
    const selectResult = await selectRequest
      .input("email", sql.VarChar(255), email)
      .query("SELECT TOP 1 * FROM tbl_user WHERE email = @email");

    if (selectResult.recordset.length > 0) {
      return NextResponse.json(
        { message: "User already exists", error: "User already exists" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare role table-valued parameter
    const roleTable = new sql.Table();
    roleTable.columns.add("RoleIdList", sql.UniqueIdentifier);
    (role || []).forEach((r) => roleTable.rows.add(r));

    // Insert user into database
    const insertReq = pool.request();
    const insertRes = await insertReq
      .input("f_name", sql.VarChar(100), f_name || "")
      .input("m_name", sql.VarChar(100), m_name || "")
      .input("l_name", sql.VarChar(100), l_name || "")
      .input("email", sql.VarChar(255), email)
      .input("password", sql.VarChar(255), hashedPassword)
      .input("role", roleTable)
      .input("division", sql.UniqueIdentifier, division || "")
      .execute("dbo.registerUser");

    // Generate tokens
    const refreshToken = gen_refresh_JWT(insertRes.recordset[0]);
    const accessToken = gen_access_JWT(insertRes.recordset[0]);

    // Respond with user details and tokens
    // send email notification here
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "DocVal User Enrollment",
      react: NewAccountEmail({
        name: `${f_name} ${l_name}`,
        email: email,
        tempPassword: password,
      }),
    });

    if (error) {
      return NextResponse.json(
        {
          message: "User created, but failed to send email",
          body: insertRes.recordset,
          refresh_token: refreshToken,
          access_token: accessToken,
        },
        { status: 210 },
      );
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        body: insertRes.recordset,
        refresh_token: refreshToken,
        access_token: accessToken,
      },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Server error", error: getErrorMessage(err) },
      { status: 500 },
    );
  }
}
