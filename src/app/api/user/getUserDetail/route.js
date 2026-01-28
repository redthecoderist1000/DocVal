import { authenticateToken } from "../../helper/authenticateToken";
import { getConnection } from "../../helper/db";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // authenticate request
    const auth = await authenticateToken(request);
    if (auth.error) {
      return auth.error;
    }

    const { userId } = await request.json();

    const pool = await getConnection();
    const selectReq = pool.request();
    const selectRes = await selectReq
      .input("userId", sql.UniqueIdentifier, userId)
      .execute("dbo.getUserDetail");

    const user = selectRes.recordset[0] || null;

    return NextResponse.json({
      message: "User details retrieved successfully",
      body: user,
    });
  } catch (error) {
    console.error(error);
    const errorMessage =
      error.originalError?.message || error.message || "Unknown error";
    return NextResponse.json(
      { message: "Server error", error: errorMessage },
      { status: 500 }
    );
  }
}
