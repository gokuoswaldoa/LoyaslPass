import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function run() {
  try {
    const result = await db.execute(
      sql`select "account"."userId", "account"."type", "account"."provider", "account"."providerAccountId", "account"."refresh_token", "account"."access_token", "account"."expires_at", "account"."token_type", "account"."scope", "account"."id_token", "account"."session_state", "user"."id", "user"."name", "user"."email", "user"."emailVerified", "user"."image" from "account" inner join "user" on "account"."userId" = "user"."id" where ("account"."provider" = 'google' and "account"."providerAccountId" = '123')`
    );
    console.log('SUCCESS', result);
  } catch (e) {
    console.error('REAL ERROR:', e);
  }
}
run();
