import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { passesConfig } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const resolvedParams = await params;
    const businessId = resolvedParams.businessId;
    
    const configArray = await db
      .select()
      .from(passesConfig)
      .where(eq(passesConfig.businessId, businessId));
      
    const config = configArray[0];
    
    if (!config || !config.logoUrl) {
      // Fallback
      return NextResponse.redirect(new URL('/logo/cafe-happy-logo.png', req.url));
    }

    const base64Data = config.logoUrl.split(',')[1];
    const mimeType = config.logoUrl.split(';')[0].split(':')[1];
    
    if (!base64Data || !mimeType) {
      return NextResponse.redirect(new URL('/logo/cafe-happy-logo.png', req.url));
    }

    const buffer = Buffer.from(base64Data, 'base64');

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=86400'
      },
    });
  } catch (error) {
    console.error("Error fetching logo:", error);
    return NextResponse.redirect(new URL('/logo/cafe-happy-logo.png', req.url));
  }
}
