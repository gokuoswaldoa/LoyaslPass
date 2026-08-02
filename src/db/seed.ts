import { db } from './index';
import { businesses, passesConfig } from './schema';

async function seed() {
  console.log('Running seed...');

  try {
    // 1. Crear el negocio
    const newBusiness = await db.insert(businesses).values({
      name: 'Cachito de Cielo',
      email: 'contacto@cachitodecielo.com',
    }).returning();

    const businessId = newBusiness[0].id;

    // 2. Crear configuración del pass
    await db.insert(passesConfig).values({
      businessId,
      totalStampsRequired: 10,
      rewardText: '1 mini-pie o carlota gratis',
      colorBackground: '#111827',
      colorText: '#10B981',
    });

    console.log('Seed exitoso. Negocio creado con ID:', businessId);
  } catch (error) {
    console.error('Error durante el seed:', error);
  }
}

seed();
