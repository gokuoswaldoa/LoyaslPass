require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });
const { neon } = require('@neondatabase/serverless');

async function check() {
  const sql = neon(process.env.DATABASE_URL);
  try {
    const rows = await sql`SELECT name, "web_push_sub" FROM customers`;
    console.log("Customers in DB:", rows.length);
    const withPush = rows.filter(r => r.web_push_sub);
    console.log("Customers with Web Push:", withPush);
  } catch(e) {
    console.error(e);
  }
}
check();
