import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { authenticateToken } from "@/app/api/helper/authenticateToken";

export async function POST(request) {
  try {
    const auth = await authenticateToken(request);
    if (auth.error) {
      return auth.error;
    }

    const { fileName } = await request.json();

    // Basic validation - prevent directory traversal attacks
    if (
      fileName.includes("..") ||
      fileName.includes("/") ||
      fileName.includes("\\")
    ) {
      return NextResponse.json(
        { message: "Invalid file name" },
        { status: 400 }
      );
    }

    // Construct file path
    const filePath = path.join(
      process.cwd(),
      "public",
      "uploaded_files",
      fileName
    );

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Read and send file
    const fileBuffer = fs.readFileSync(filePath);
    const response = new NextResponse(fileBuffer);
    response.headers.set(
      "Content-Disposition",
      `attachment; filename="${fileName}"`
    );
    response.headers.set("Content-Type", "application/pdf");

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
