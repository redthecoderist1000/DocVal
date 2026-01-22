import { getConnection } from "@/app/api/helper/db";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { email } = await request.json();

    const pool = await getConnection();
    const selectReq = pool.request();
    const selectRes = await selectReq
      .input("email", sql.VarChar(255), email)
      .execute("dbo.checkEmail");

    if (selectRes.recordset.length > 0) {
      return NextResponse.json(
        {
          exists: true,
          message: "Email is found",
          userId: selectRes.recordset[0].id,
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json(
        { exists: false, message: "Invalid Email" },
        { status: 200 },
      );
    }
  } catch (error) {}
}
