require('dotenv').config({path: '.env'});
const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);
async function run() {
  // Delete passes config for these empty businesses first
  await sql`DELETE FROM passes_config WHERE business_id IN ('43f9f5f9-4256-417f-8e07-2a6b85b5b86a', '857ab961-548b-46be-8925-f54e100ef2c9', '33ef871b-dda9-4b24-b1cd-2eadd2d92214')`;
  // Delete the empty businesses
  await sql`DELETE FROM businesses WHERE id IN ('43f9f5f9-4256-417f-8e07-2a6b85b5b86a', '857ab961-548b-46be-8925-f54e100ef2c9', '33ef871b-dda9-4b24-b1cd-2eadd2d92214')`;
  console.log('Deleted duplicate empty businesses');
}
run().catch(console.error);
