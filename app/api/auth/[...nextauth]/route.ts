import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "../../../generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
	providers: [
		Credentials({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) return null;
				const user = await prisma.user.findUnique({ where: { email: credentials.email } });
				if (!user) return null;
				const valid = await bcrypt.compare(credentials.password, user.password);
				if (!valid) return null;
				return {
					id: String(user.id),
					name: user.name || user.email,
					email: user.email,
					role: user.role as any,
					phone: user.phone || null,
					image: user.image || null,
				} as any;
			},
		}),
	],
	session: { strategy: "jwt" },
	pages: { signIn: "/" },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				const t: any = token;
				const u: any = user;
				t.id = u.id;
				t.role = u.role;
				t.name = u.name;
				t.phone = u.phone;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token) {
				const su: any = session.user as any;
				const t: any = token as any;
				su.id = t.id;
				su.role = t.role;
				su.name = t.name;
				su.phone = t.phone;
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };