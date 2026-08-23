"use server";

import { db } from "@/db";
import { businesses, customers, passesConfig, stampsLog } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function getBusinessOnboardingData(businessId: string) {
  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.id, businessId));
    const business = businessArray[0];

    if (!business) {
      return { success: false, error: "Negocio no encontrado" };
    }

    const configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, businessId));
    const config = configArray[0];

    return { success: true, business, config };
  } catch (error) {
    console.error("Error fetching business onboarding data:", error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function registerCustomer(businessId: string, name: string, phone: string, email: string, birthdate: string = "", referredBy: string | null = null) {
  if (!name) return { success: false, error: "El nombre es obligatorio" };
  if (!phone) return { success: false, error: "El número es obligatorio" };
  if (!birthdate) return { success: false, error: "La fecha de nacimiento es obligatoria" };

  try {
    // Buscar si ya existe un cliente con ese número para ese negocio
    const existing = await db.select().from(customers).where(
      and(
        eq(customers.businessId, businessId),
        eq(customers.phoneNumber, phone)
      )
    );

    if (existing.length > 0) {
      // Si existe, retornamos su tarjeta en lugar de crear un duplicado
      return { success: true, walletPassId: existing[0].walletPassId };
    }

    const walletPassId = "lp-" + uuidv4().split("-")[0]; // Generate short unique ID

    const inserted = await db.insert(customers).values({
      businessId,
      name,
      phoneNumber: phone,
      email: email || null,
      birthdate: birthdate || null,
      walletPassId,
      referredBy: referredBy || null,
    }).returning();

    return { success: true, walletPassId: inserted[0].walletPassId };
  } catch (error) {
    console.error("Error registering customer:", error);
    return { success: false, error: "Error al registrar cliente" };
  }
}

export async function getClientWalletData(businessId: string, walletPassId: string) {
  try {
    const customerArray = await db
      .select()
      .from(customers)
      .where(and(eq(customers.businessId, businessId), eq(customers.walletPassId, walletPassId)));
    
    const customer = customerArray[0];
    if (!customer) return { success: false, error: "Cliente no encontrado" };

    const businessArray = await db.select().from(businesses).where(eq(businesses.id, businessId));
    const business = businessArray[0];

    const configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, businessId));
    const config = configArray[0];

    const stampsArray = await db.select().from(stampsLog).where(eq(stampsLog.customerId, customer.id));
    const stampsCount = stampsArray.length;

    return { success: true, customer, business, config, stampsCount };
  } catch (error) {
    console.error("Error fetching client wallet:", error);
    return { success: false, error: "Error de servidor" };
  }
}

export async function getCustomerNameById(customerId: string) {
  try {
    const customerArray = await db.select().from(customers).where(eq(customers.id, customerId));
    if (customerArray.length > 0) {
      return customerArray[0].name;
    }
    return null;
  } catch (error) {
    return null;
  }
}
