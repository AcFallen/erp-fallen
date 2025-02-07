import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    role: string;
    token?: string;
  }

  interface Session {
    accessToken?: string;
    user: User;
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son obligatorios.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("Usuario no encontrado.");
        }

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!passwordMatch) {
          throw new Error("Contraseña incorrecta.");
        }

        // Firmar JWT
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.NEXTAUTH_SECRET!,
          { expiresIn: "7d" }
        );

        return { ...user, token };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        email: token.email as string,
        role: token.role as string,
      };
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
