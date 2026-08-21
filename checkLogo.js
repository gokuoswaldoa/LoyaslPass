require('dotenv').config({ path: '.env' });
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
sql`SELECT logo_url FROM passes_config`.then(rows => {
  rows.forEach(r => console.log('Length of logoUrl:', r.logo_url ? r.logo_url.length : 0));
});
