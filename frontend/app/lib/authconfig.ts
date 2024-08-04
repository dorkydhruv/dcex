import GoogleProvider from "next-auth/providers/google";
import { Keypair } from "@solana/web3.js";
import prisma from "@/app/db";

import { Session } from "next-auth";

export interface session extends Session {
  user: {
    email: string;
    name: string;
    image: string;
    uid: string;
  };
}

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET || "secr3t",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      if (account?.provider === "google") {
        const email = user.email;
        if (!email) return false;
        const userDb = await prisma.user.findFirst({
          where: { username: email },
        });
        if (userDb) {
          return true;
        }
        const keypair = Keypair.generate();
        await prisma.user.create({
          data: {
            username: email,
            provider: "Google",
            name: profile?.name,
            sub: account.providerAccountId,
            //@ts-ignore
            profilePicture: profile?.picture,
            solWallet: {
              create: {
                publicKey: keypair.publicKey.toBase58(),
                privateKey: keypair.secretKey.toString(),
              },
            },
            inrWallet: {
              create: {
                balance: 0,
              },
            },
          },
        });
        return true;
      }
      return false;
    },
  },
  session: ({ session, token }: any): session => {
    const newSession: session = session as session;
    if (newSession.user && token.uid) {
      // @ts-ignore
      newSession.user.uid = token.uid ?? "";
    }
    return newSession!;
  },

  async jwt({ token, account, profile }: any) {
    const user = await prisma.user.findFirst({
      where: {
        sub: account?.providerAccountId ?? "",
      },
    });
    if (user) {
      token.uid = user.id;
    }
    return token;
  },
};
