import { NextResponse } from "next/server";
import sql from "mssql";
import fs from "fs";
import path from "path";
import { getConnection } from "@/app/api/helper/db";
import { authenticateToken } from "@/app/api/helper/authenticateToken";
import { getErrorMessage } from "@/app/api/helper/errorHandler";
import { error } from "console";

export async function POST(request) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return auth.error;
    }

    const userId = auth.user.uid;
    const {
      reference_no,
      title,
      doc_type,
      doc_class,
      sender_office,
      sender_person,
      sender_email,
      sender_phone,
      base64_data,
      report,
      receiving_office,
      office_type,
    } = await request.json();

    // Basic validation
    if (
      !reference_no ||
      !title ||
      !doc_type ||
      !doc_class ||
      !sender_office ||
      !sender_person ||
      !sender_email ||
      !sender_phone ||
      !base64_data ||
      !office_type
    ) {
      return NextResponse.json(
        {
          message: "All fields are required",
          error: "All fields are required",
        },
        { status: 400 },
      );
    }

    // Upload file to storage service here and get the URL
    // For development, we will skip this step and use a placeholder URL
    const fileName = `${Date.now()}_${reference_no}.pdf`;

    // Remove "data:*/*;base64," prefix if present
    const base64String = base64_data.split(";base64,").pop();

    // Convert base64 to buffer
    const fileBuffer = Buffer.from(base64String, "base64");

    // Define folder path (make sure it exists)
    const folderPath = path.join(process.cwd(), "public", "uploaded_files");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Save file
    const filePath = path.join(folderPath, fileName);
    fs.writeFileSync(filePath, fileBuffer);

    // Insert to database
    const pool = await getConnection();
    const insertReq = pool.request();
    const insertRes = await insertReq
      .input("reference_no", sql.VarChar(100), reference_no)
      .input("title", sql.VarChar(255), title)
      .input("doc_type", sql.UniqueIdentifier, doc_type)
      .input("doc_class", sql.UniqueIdentifier, doc_class)
      .input("sender_office", sql.UniqueIdentifier, sender_office)
      .input("sender_person", sql.VarChar(255), sender_person)
      .input("sender_email", sql.VarChar(255), sender_email)
      .input("sender_phone", sql.VarChar(50), sender_phone)
      .input("created_by", sql.UniqueIdentifier, userId)
      .input("url", sql.VarChar(255), fileName)
      .input("report", sql.NVarChar(sql.MAX), JSON.stringify(report) || null)
      .input("receiving_office", sql.UniqueIdentifier, receiving_office || null)
      .input("origin", sql.VarChar(20), office_type)
      .execute("dbo.createFile");

    return NextResponse.json(
      {
        message: "File created successfully",
        body: insertRes.recordset,
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
