"use server";

import { db } from "@/db";
import { businesses, businessStaff, passesConfig, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

import { cookies } from "next/headers";

export async function getUserRoleInfo() {
  const cookieStore = await cookies();
  const staffToken = cookieStore.get("loyalpass_staff_token")?.value;

  if (staffToken) {
    const staffArray = await db.select().from(businessStaff).where(eq(businessStaff.loginToken, staffToken));
    const staffMember = staffArray[0];
    if (staffMember) {
      return { success: true, role: "staff", businessId: staffMember.businessId, staffId: staffMember.id, staffName: staffMember.name };
    }
  }

  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return { success: false, error: "No autenticado" };
  }

  try {
    // Fetch user to check if superadmin
    const userArray = await db.select().from(users).where(eq(users.id, session.user.id));
    const dbUser = userArray[0];

    // Check if user is owner
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];

    if (business) {
      return { 
        success: true, 
        role: "owner", 
        superadmin: dbUser?.role === "superadmin" || session.user.email === process.env.SUPER_ADMIN_EMAIL,
        businessId: business.id,
        businessStatus: business.status,
        trialEndsAt: business.trialEndsAt,
        subscriptionEndsAt: business.subscriptionEndsAt
      };
    }

    return { success: false, error: "No tiene cuenta de negocio ni es staff" };
  } catch (error) {
    console.error("Error fetching role:", error);
    return { success: false, error: "Error de servidor" };
  }
}


