import { getDashboardStats } from './src/app/actions/dashboard';
import { db } from './src/db';
import { businesses } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function main() {
  const businessArray = await db.select().from(businesses).limit(1);
  const business = businessArray[0];
  
  // mock auth
  jest.mock('./src/auth', () => ({
    auth: () => Promise.resolve({ user: { id: business.userId } })
  }));

  const res = await getDashboardStats("semana");
  console.log(JSON.stringify(res, null, 2));
}

main().catch(console.error);
