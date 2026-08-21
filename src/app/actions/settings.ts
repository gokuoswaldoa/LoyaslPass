"use server";

import { db } from "@/db";
import { businesses, businessStaff, passesConfig, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";

export async function getUserRoleInfo() {
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

    // Check if user is staff (by their google email)
    const staffArray = await db.select().from(businessStaff).where(eq(businessStaff.email, session.user.email));
    const staffMember = staffArray[0];

    if (staffMember) {
      return { success: true, role: "staff", businessId: staffMember.businessId };
    }

    return { success: false, error: "No tiene cuenta de negocio ni es staff" };
  } catch (error) {
    console.error("Error fetching role:", error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function getStaffList() {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autenticado" };

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];

    if (!business) return { success: false, error: "Negocio no encontrado" };

    const staffList = await db.select().from(businessStaff).where(eq(businessStaff.businessId, business.id));
    return { success: true, staffList };
  } catch (error) {
    console.error("Error fetching staff:", error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function addStaffMember(email: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autenticado" };

  if (!email || !email.includes("@")) {
    return { success: false, error: "Correo inválido" };
  }

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];

    if (!business) return { success: false, error: "Negocio no encontrado" };

    // Check if already exists
    const existing = await db.select().from(businessStaff).where(and(eq(businessStaff.businessId, business.id), eq(businessStaff.email, email.toLowerCase())));
    if (existing.length > 0) {
      return { success: false, error: "El empleado ya está registrado" };
    }

    await db.insert(businessStaff).values({
      businessId: business.id,
      email: email.toLowerCase(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error adding staff:", error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function removeStaffMember(staffId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "No autenticado" };

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];

    if (!business) return { success: false, error: "Negocio no encontrado" };

    await db.delete(businessStaff).where(and(eq(businessStaff.id, staffId), eq(businessStaff.businessId, business.id)));

    return { success: true };
  } catch (error) {
    console.error("Error removing staff:", error);
    return { success: false, error: "Error de servidor" };
  }
}
