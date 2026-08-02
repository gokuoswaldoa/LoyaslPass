import { db } from './src/db';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { users, accounts, sessions, verificationTokens, authenticators } from './src/db/schema';

const adapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
  authenticatorsTable: authenticators
});

async function run() {
  try {
    const user = await adapter.createUser({
      email: 'test' + Date.now() + '@example.com',
      emailVerified: new Date(),
      name: 'Test',
      image: ''
    });
    console.log('User created:', user);
    const account = await adapter.linkAccount({
      userId: user.id,
      type: 'oauth',
      provider: 'google',
      providerAccountId: '123' + Date.now(),
      access_token: 'abc'
    });
    console.log('Account linked:', account);
  } catch (e) {
    console.error('ADAPTER ERROR:', e);
  }
}

run();
