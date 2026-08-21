import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { systemNotifications, businesses } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ success: false }, { status: 401 });

  const bArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
  const business = bArray[0];

  if (!business) return NextResponse.json({ success: true, notifications: [] });

  const notifs = await db.select()
    .from(systemNotifications)
    .where(eq(systemNotifications.businessId, business.id))
    .orderBy(desc(systemNotifications.createdAt));

  return NextResponse.json({ success: true, notifications: notifs });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ success: false }, { status: 401 });

  const bArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
  const business = bArray[0];

  if (!business) return NextResponse.json({ success: true });

  await db.update(systemNotifications)
    .set({ isRead: true })
    .where(eq(systemNotifications.businessId, business.id));

  return NextResponse.json({ success: true });
}
