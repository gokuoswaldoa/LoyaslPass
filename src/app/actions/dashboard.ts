"use server";

import { db } from "@/db";
import { businesses, customers, stampsLog, passesConfig } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";

export async function getDashboardStats(timeRange: "hoy" | "semana" | "mes" = "hoy") {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];

    if (!business) {
      return { success: false, error: "Negocio no encontrado" };
    }

    // Get total customers
    const customersArray = await db
      .select()
      .from(customers)
      .where(eq(customers.businessId, business.id));
    const totalCustomers = customersArray.length;

    // Get total stamps issued today (Mock simple counting for now)
    const allStamps = await db
      .select()
      .from(stampsLog)
      .where(eq(stampsLog.businessId, business.id));
    
    // Calculate Date Threshold
    const now = new Date();
    const thresholdDate = new Date();
    
    if (timeRange === "hoy") {
      thresholdDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "semana") {
      thresholdDate.setDate(now.getDate() - 7);
      thresholdDate.setHours(0, 0, 0, 0);
    } else if (timeRange === "mes") {
      thresholdDate.setMonth(now.getMonth() - 1);
      thresholdDate.setHours(0, 0, 0, 0);
    }

    const stampsInRange = allStamps.filter(s => {
      const stampDate = s.stampedAt ? new Date(s.stampedAt) : new Date(0);
      return stampDate >= thresholdDate;
    }).length;

    // --- GRÁFICA 1: AFLUENCIA (Últimos 7 días) ---
    const afluenciaData = [];
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    
    // Identificar la fecha del primer sello de cada cliente para saber si son "nuevos"
    const firstStampByCustomer: Record<string, Date> = {};
    allStamps.forEach(s => {
      if (!s.stampedAt) return;
      const date = new Date(s.stampedAt);
      if (!s.customerId) return;
      if (!firstStampByCustomer[s.customerId] || date < firstStampByCustomer[s.customerId]) {
        firstStampByCustomer[s.customerId] = date;
      }
    });

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const endOfDay = new Date(d);
      endOfDay.setHours(23, 59, 59, 999);
      
      const dayName = days[d.getDay()];
      
      let nuevos = 0;
      let recurrentes = 0;

      // Sellos dados en este día exacto
      const stampsThisDay = allStamps.filter(s => {
        if (!s.stampedAt) return false;
        const date = new Date(s.stampedAt);
        return date >= d && date <= endOfDay;
      });

      // Contar únicos por cliente (un cliente que viene 2 veces el mismo día cuenta 1 vez)
      const uniqueCustomersToday = new Set(stampsThisDay.map(s => s.customerId));

      uniqueCustomersToday.forEach(customerId => {
        if (!customerId) return;
        const firstVisit = firstStampByCustomer[customerId];
        // Si su primera visita fue en este día, es "nuevo", sino "recurrente"
        if (firstVisit >= d && firstVisit <= endOfDay) {
          nuevos++;
        } else {
          recurrentes++;
        }
      });

      afluenciaData.push({ day: dayName, recurrentes, nuevos });
    }

    // --- GRÁFICA 2: HORARIOS PICO (Hoy) ---
    // Rangos: 10am (8-11), 12pm (11-13), 2pm (13-15), 4pm (15-17), 6pm (17-19), 8pm (19-21), 10pm (21-23)
    const horariosMap = { '10am': 0, '12pm': 0, '2pm': 0, '4pm': 0, '6pm': 0, '8pm': 0, '10pm': 0 };
    
    const todayStart = new Date();
    todayStart.setHours(0,0,0,0);

    const stampsTodayForChart = allStamps.filter(s => {
      if (!s.stampedAt) return false;
      return new Date(s.stampedAt) >= todayStart;
    });

    stampsTodayForChart.forEach(s => {
      if (!s.stampedAt) return;
      const hour = new Date(s.stampedAt).getHours();
      
      if (hour < 11) horariosMap['10am']++;
      else if (hour < 13) horariosMap['12pm']++;
      else if (hour < 15) horariosMap['2pm']++;
      else if (hour < 17) horariosMap['4pm']++;
      else if (hour < 19) horariosMap['6pm']++;
      else if (hour < 21) horariosMap['8pm']++;
      else horariosMap['10pm']++;
    });

    const horariosData = Object.keys(horariosMap).map(time => ({
      time,
      visitas: horariosMap[time as keyof typeof horariosMap]
    }));

    return {
      success: true,
      businessId: business.id,
      stats: {
        totalCustomers,
        stampsToday: stampsInRange,
        totalStamps: allStamps.length,
      },
      chartAfluencia: afluenciaData,
      chartHorarios: horariosData
    };

  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false, error: "Error al obtener estadísticas" };
  }
}

export async function getCustomers() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];
    if (!business) return { success: false, error: "Negocio no encontrado" };

    const configArray = await db.select().from(passesConfig).where(eq(passesConfig.businessId, business.id));
    const config = configArray[0];
    const totalStampsRequired = (config && config.totalStampsRequired) ? config.totalStampsRequired : 8;

    const customersList = await db
      .select()
      .from(customers)
      .where(eq(customers.businessId, business.id));

    // For each customer, count their stamps
    const stamps = await db
      .select()
      .from(stampsLog)
      .where(eq(stampsLog.businessId, business.id));

    const customersWithStats = customersList.map(c => {
      const customerStamps = stamps.filter(s => s.customerId === c.id);
      
      let status = 'Nuevo';
      if (customerStamps.length > 0) {
        if (customerStamps.length >= totalStampsRequired) {
          status = 'VIP';
        } else {
          // Check if last stamp was > 30 days ago
          // Find the latest stamp
          let lastStampDate = new Date(0);
          customerStamps.forEach(s => {
            if (s.stampedAt) {
              const d = new Date(s.stampedAt);
              if (d > lastStampDate) lastStampDate = d;
            }
          });
          
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          
          if (lastStampDate < thirtyDaysAgo) {
            status = 'Riesgo';
          } else {
            status = 'Activo';
          }
        }
      }

      return {
        id: c.id,
        name: c.name,
        phone: c.phoneNumber,
        stamps: customerStamps.length,
        status,
        walletPassId: c.walletPassId,
        businessId: c.businessId,
        birthdate: c.birthdate,
        totalStampsRequired: totalStampsRequired,
      };
    });

    return { success: true, customers: customersWithStats };
  } catch (error) {
    console.error("Error fetching customers:", error);
    return { success: false, error: "Error al obtener clientes" };
  }
}

export async function deleteCustomer(customerId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];
    if (!business) return { success: false, error: "Negocio no encontrado" };

    // Verificar que el cliente pertenezca a este negocio
    const customerArray = await db.select().from(customers).where(eq(customers.id, customerId));
    if (!customerArray[0] || customerArray[0].businessId !== business.id) {
      return { success: false, error: "Cliente no válido" };
    }

    // Borrar sellos (cascada manual si es necesario)
    await db.delete(stampsLog).where(eq(stampsLog.customerId, customerId));
    // Borrar cliente
    await db.delete(customers).where(eq(customers.id, customerId));

    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}

export async function addManualStamp(customerId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "No autenticado" };
  }

  try {
    const businessArray = await db.select().from(businesses).where(eq(businesses.userId, session.user.id));
    const business = businessArray[0];
    if (!business) return { success: false, error: "Negocio no encontrado" };

    // Verificar que el cliente pertenezca a este negocio
    const customerArray = await db.select().from(customers).where(eq(customers.id, customerId));
    if (!customerArray[0] || customerArray[0].businessId !== business.id) {
      return { success: false, error: "Cliente no válido" };
    }

    await db.insert(stampsLog).values({
      businessId: business.id,
      customerId: customerId,
    });

    // Sincronización con Google Wallet
    try {
      const { syncCustomerWalletPass } = await import("@/lib/syncGoogleWallet");
      await syncCustomerWalletPass(customerId);
    } catch (gwError) {
      console.error("Error syncing manual stamp with Google Wallet:", gwError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding manual stamp:", error);
    return { success: false, error: "Error interno del servidor" };
  }
}
