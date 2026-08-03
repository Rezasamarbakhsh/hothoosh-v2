import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await db.user.findUnique({
          where: { email: credentials.email },
          include: { company: { select: { id: true, name: true, slug: true } } },
        });
        if (!user) return null;
        if (!user.isActive) return null;

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? '',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id! },
          include: { company: { select: { id: true, name: true, slug: true } } },
        });
        if (dbUser) {
          token.role = dbUser.role;
          token.companyId = dbUser.companyId;
          token.companyName = dbUser.company?.name ?? null;
          token.companySlug = dbUser.company?.slug ?? null;
          token.isActive = dbUser.isActive;
        }
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as Record<string, unknown>).role = token.role;
        (session.user as Record<string, unknown>).id = token.id;
        (session.user as Record<string, unknown>).companyId = token.companyId;
        (session.user as Record<string, unknown>).companyName = token.companyName;
        (session.user as Record<string, unknown>).companySlug = token.companySlug;
        (session.user as Record<string, unknown>).isActive = token.isActive;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};
