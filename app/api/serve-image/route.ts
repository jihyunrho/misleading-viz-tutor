import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

/**
 * Serves images from the /assets/visualizations folder
 *
 * @param request - The incoming HTTP request
 * @returns Response containing the image file or an error
 */
export async function GET(request: NextRequest) {
  try {
    // Get the image filename from the URL search params
    const url = new URL(request.url);
    const filename = url.searchParams.get("file");

    // Return 400 if no filename provided
    if (!filename) {
      return NextResponse.json(
        { error: "Missing file parameter" },
        { status: 400 }
      );
    }

    // Construct the file path, ensuring no path traversal attacks
    const safePath = path.normalize(filename).replace(/^(\.\.(\/|\\|$))+/, "");
    const filePath = path.join(
      process.cwd(),
      "assets",
      "visualizations",
      safePath
    );

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Read file and determine content type
    const fileData = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();

    let contentType = "application/octet-stream"; // default

    // Set appropriate content type based on file extension
    switch (extension) {
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
      case ".jpeg":
        contentType = "image/jpeg";
        break;
      case ".gif":
        contentType = "image/gif";
        break;
      case ".svg":
        contentType = "image/svg+xml";
        break;
      case ".webp":
        contentType = "image/webp";
        break;
    }

    // Return the image with proper headers
    return new NextResponse(fileData, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
