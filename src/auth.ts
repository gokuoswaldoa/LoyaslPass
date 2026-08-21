import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import { users, accounts, sessions, verificationTokens, authenticators } from "@/db/schema";

const originalConsoleError = console.error;
console.error = (...args) => {
  const newArgs = args.map(arg => {
    if (arg instanceof Error) {
      return `Error: ${arg.message}\nStack: ${arg.stack}`;
    }
    if (arg && typeof arg === 'object' && arg.name === 'NeonDbError') {
      return `NeonDbError: ${(arg as {message: string}).message}`;
    }
    return arg;
  });
  originalConsoleError(...newArgs);
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
    authenticatorsTable: authenticators,
  }),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  pages: {
    signIn: '/login', // Optional, we will likely just use the onboarding button
  },
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  debug: true,
  secret: process.env.AUTH_SECRET,
  trustHost: true,
});
