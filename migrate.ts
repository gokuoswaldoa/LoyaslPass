import { neon } from '@neondatabase/serverless';
import 'dotenv/config';

async function migrate() {
  const sql = neon(process.env.DATABASE_URL!);
  try {
    console.log("Adding staff_id to stamps_log...");
    await sql`ALTER TABLE "stamps_log" ADD COLUMN "staff_id" uuid;`;
    
    console.log("Adding foreign key to stamps_log...");
    await sql`DO $$ BEGIN
     ALTER TABLE "stamps_log" ADD CONSTRAINT "stamps_log_staff_id_business_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."business_staff"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION
     WHEN duplicate_object THEN null;
    END $$;`;

    console.log("Altering business_staff table...");
    await sql`ALTER TABLE "business_staff" ADD COLUMN "name" varchar NOT NULL DEFAULT 'Staff';`;
    await sql`ALTER TABLE "business_staff" ADD COLUMN "login_token" varchar;`;
    await sql`ALTER TABLE "business_staff" DROP COLUMN "email";`;
    await sql`ALTER TABLE "business_staff" ADD CONSTRAINT "business_staff_login_token_unique" UNIQUE("login_token");`;
    await sql`ALTER TABLE "business_staff" ALTER COLUMN "name" DROP DEFAULT;`;

    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration failed:", error);
  }
}

migrate();
