"use server";

import { db } from "@/db";
import { businessStaff } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import crypto from "crypto";

import { getUserRoleInfo } from "@/app/actions/settings";

export async function getStaff() {
  const roleInfo = await getUserRoleInfo();
  if (!roleInfo.success || roleInfo.role !== "owner" || !roleInfo.businessId) {
    throw new Error("Unauthorized");
  }

  const staffList = await db
    .select()
    .from(businessStaff)
    .where(eq(businessStaff.businessId, roleInfo.businessId))
    .orderBy(desc(businessStaff.addedAt));

  return staffList;
}

export async function createStaff(name: string) {
  const roleInfo = await getUserRoleInfo();
  if (!roleInfo.success || roleInfo.role !== "owner" || !roleInfo.businessId) {
    throw new Error("Unauthorized");
  }

  const loginToken = crypto.randomBytes(32).toString("hex");

  const newStaff = await db.insert(businessStaff).values({
    businessId: roleInfo.businessId,
    name,
    loginToken,
  }).returning();

  return newStaff[0];
}

export async function deleteStaff(staffId: string) {
  const roleInfo = await getUserRoleInfo();
  if (!roleInfo.success || roleInfo.role !== "owner" || !roleInfo.businessId) {
    throw new Error("Unauthorized");
  }

  // Verify staff belongs to business
  const staff = await db.query.businessStaff.findFirst({
    where: eq(businessStaff.id, staffId),
  });

  if (!staff || staff.businessId !== roleInfo.businessId) {
    throw new Error("Staff not found or unauthorized");
  }

  await db.delete(businessStaff).where(eq(businessStaff.id, staffId));
  return { success: true };
}

import { cookies } from "next/headers";

export async function loginStaff(token: string) {
  const staffArray = await db.select().from(businessStaff).where(eq(businessStaff.loginToken, token));
  const staffMember = staffArray[0];

  if (!staffMember) {
    return { success: false, error: "Código inválido o revocado" };
  }

  const cookieStore = await cookies();
  cookieStore.set("loyalpass_staff_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: "/",
  });

  return { success: true };
}

export async function logoutStaff() {
  const cookieStore = await cookies();
  cookieStore.delete("loyalpass_staff_token");
  return { success: true };
}
