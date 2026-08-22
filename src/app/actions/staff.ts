"use server";

import { db } from "@/db";
import { businessStaff, stampsLog } from "@/db/schema";
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

  const loginToken = crypto.randomBytes(4).toString("hex").substring(0, 6).toUpperCase();

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

  await db.update(businessStaff)
    .set({ isActive: false, loginToken: null })
    .where(eq(businessStaff.id, staffId));
    
  return { success: true };
}

export async function regenerateStaffToken(staffId: string) {
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

  const newToken = crypto.randomBytes(4).toString("hex").substring(0, 6).toUpperCase();

  await db.update(businessStaff)
    .set({ loginToken: newToken, isActive: true })
    .where(eq(businessStaff.id, staffId));
    
  return { success: true, token: newToken };
}

import { cookies } from "next/headers";

export async function loginStaff(token: string) {
  const staffArray = await db.select().from(businessStaff).where(eq(businessStaff.loginToken, token));
  const staffMember = staffArray[0];

  if (!staffMember || !staffMember.isActive) {
    return { success: false, error: "Código inválido o revocado" };
  }

  // Rotate token to make the scanned QR code one-time use
  const newToken = crypto.randomBytes(4).toString("hex").substring(0, 6).toUpperCase();
  await db.update(businessStaff)
    .set({ loginToken: newToken })
    .where(eq(businessStaff.id, staffMember.id));

  const cookieStore = await cookies();
  cookieStore.set("loyalpass_staff_token", newToken, {
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


export async function getStaffAnalytics() {
  const roleInfo = await getUserRoleInfo();
  if (!roleInfo.success || roleInfo.role !== "owner" || !roleInfo.businessId) {
    throw new Error("Unauthorized");
  }
  const businessId = roleInfo.businessId;

  const allStaff = await db.select().from(businessStaff).where(eq(businessStaff.businessId, businessId));
  
  // Get all stamps for the business
  const allStamps = await db.select().from(stampsLog).where(eq(stampsLog.businessId, businessId)).orderBy(desc(stampsLog.stampedAt));

  // Get all customers
  const { customers } = await import("@/db/schema");
  const allCustomers = await db.select().from(customers).where(eq(customers.businessId, businessId));

  // Aggregate data
  const staffPerformance = allStaff.map(staff => {
    const stampsGiven = allStamps.filter(s => s.staffId === staff.id);
    // Find churn risk (customers whose LAST stamp was by this staff and was > 30 days ago)
    // We'll calculate churn Risk globally instead to keep it simple, or per staff.
    return {
      id: staff.id,
      name: staff.name,
      isActive: staff.isActive,
      totalStamps: stampsGiven.length,
      recentStamps: stampsGiven.slice(0, 5)
    };
  });

  // Churn calculation: Customers not seen in 60 days
  const now = new Date();
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const churnRisk = allCustomers.map(customer => {
    const customerStamps = allStamps.filter(s => s.customerId === customer.id);
    if (customerStamps.length === 0) return null;
    const lastStamp = customerStamps[0]; // ordered desc
    if (lastStamp.stampedAt && new Date(lastStamp.stampedAt) < sixtyDaysAgo) {
      const staff = allStaff.find(s => s.id === lastStamp.staffId);
      return {
        customerId: customer.id,
        customerName: customer.name,
        lastSeen: lastStamp.stampedAt,
        lastStaffId: staff?.id,
        lastStaffName: staff?.name || "Desconocido"
      };
    }
    return null;
  }).filter(c => c !== null);

  // Recent Activity Log
  const recentActivity = allStamps.slice(0, 20).map(stamp => {
    const customer = allCustomers.find(c => c.id === stamp.customerId);
    const staff = allStaff.find(s => s.id === stamp.staffId);
    return {
      id: stamp.id,
      stampedAt: stamp.stampedAt,
      customerName: customer?.name || "Desconocido",
      staffName: staff?.name || "Desconocido"
    };
  });

  return { success: true, performance: staffPerformance, churnRisk, recentActivity };
}
