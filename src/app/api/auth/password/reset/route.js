import { getConnection } from "@/app/api/helper/db";
import sql from "mssql";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, newPass } = await request.json();

    // check if userId and newPass are provided
    if (!userId || !newPass) {
      return NextResponse.json(
        { message: "User ID and new password are required" },
        { status: 400 },
      );
    }

    // const pool = await getConnection();
    // const updateReq = pool.request();
    // await updateReq
    //   .input("userId", sql.UniqueIdentifier, userId)
    //   .input("newPass", sql.VarChar(255), newPass)
    //   .execute("dbo.resetPassword");
  } catch (error) {}
}
