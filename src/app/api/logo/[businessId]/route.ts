import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { passesConfig } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;

    const configArray = await db
      .select()
      .from(passesConfig)
      .where(eq(passesConfig.businessId, businessId));
      
    const config = configArray[0];

    if (!config || !config.logoUrl || !config.logoUrl.startsWith("data:image/")) {
      // Return a default logo if none is found or if it's already a public URL
      return NextResponse.redirect(new URL('/logo/icono.png', req.url));
    }

    // Extract mime type and base64 data
    // Format is typically: "data:image/jpeg;base64,/9j/4AAQSk..."
    const matches = config.logoUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    
    if (!matches || matches.length !== 3) {
      return NextResponse.redirect(new URL('/logo/icono.png', req.url));
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    
    const buffer = Buffer.from(base64Data, "base64");

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400", // Cache for 24 hours
      },
    });

  } catch (error) {
    console.error("Error serving logo:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
