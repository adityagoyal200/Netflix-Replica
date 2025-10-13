import type { PrismaClient } from '@prisma/client';
import type { MongoClient } from 'mongodb';
import NextAuth from 'next-auth';

declare global {
  namespace globalThis {
    var prismadb: PrismaClient
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
  }
}
