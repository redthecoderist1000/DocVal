import { NextResponse } from "next/server";
import { authenticateToken } from "../helper/authenticateToken";
import { getConnection } from "../helper/db";
import sql from "mssql";

export async function GET(request) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return auth.error;
    }
    const role = auth.user.rol;
    const userId = auth.user.uid;

    const pool = await getConnection();
    const selectReq = pool.request();

    if (role === "administrator") {
      const selectRes = await selectReq
        .input("userId", sql.UniqueIdentifier, userId)
        .execute("dbo.getDashAdmin");

      const response = JSON.parse(selectRes.recordset[0].JsonOutput);

      return NextResponse.json({
        message: "Dashboard data retrieved successfully",
        body: response,
      });
    }

    if (role === "user") {
      const selectRes = await selectReq
        .input("userId", sql.UniqueIdentifier, userId)
        .execute("dbo.getDashUser");

      const response = JSON.parse(selectRes.recordset[0].JsonOutput);

      return NextResponse.json({
        message: "Dashboard data retrieved successfully",
        body: response,
      });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error.name, error: error.message },
      { status: 500 },
    );
  }
}
