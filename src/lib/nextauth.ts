import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { DefaultSession, NextAuthOptions, getServerSession } from "next-auth";
import { prisma } from "./db";
import GoogleProvider from "next-auth/providers/google";

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            loggedIn: Date | null;
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        loggedIn: Date | null;
    }
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ token }) => {
            const db_user = await prisma.user.findFirst({
                where: {
                    email: token?.email,
                },
            });
            if (db_user) {
                token.id = db_user.id;
                token.loggedIn = db_user.loggedIn;
            }
            return token;
        },
        session: ({ session, token }) => {
            if (token) {
                session.user.id = token.id;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.image = token.picture;
                session.user.loggedIn = token.loggedIn;
            }
            return session;
        },
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
};

export const getAuthSession = () => {
    return getServerSession(authOptions);
};