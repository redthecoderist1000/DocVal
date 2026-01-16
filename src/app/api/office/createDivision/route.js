import { NextResponse } from "next/server";
import sql from "mssql";
import { getConnection } from "@/app/api/helper/db";
import { authenticateToken } from "@/app/api/helper/authenticateToken";

export async function POST(request) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return auth.error;
    }

    const { name, abrv } = await request.json();

    if (!name || !abrv) {
      return NextResponse.json(
        { message: "name and abrv are required" },
        { status: 400 }
      );
    }

    const pool = await getConnection();
    const sqlReq = pool.request();
    const sqlRes = await sqlReq
      .input("name", sql.VarChar(255), name)
      .input("abrv", sql.VarChar(50), abrv)
      .execute("dbo.createDivision");

    return NextResponse.json(
      {
        message: "Division created successfully",
        body: sqlRes.recordset,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
