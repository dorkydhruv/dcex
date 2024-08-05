import Profilecard from "@/app/components/Profilecard";
import React from "react";
import prisma from "../db";
import { getServerSession } from "next-auth";
import { authConfig } from "../lib/authconfig";
import { error } from "console";

async function getUserWallet() {
  const session = await getServerSession(authConfig);
  const userWallet = await prisma.solWallet.findFirst({
    where: {
      userId: session?.user.uid,
    },
    select: {
      publicKey: true,
    },
  });
  if (!userWallet) {
    return {
      error: "No wallet found for user",
    };
  }
  return { error: null, userWallet };
}

const Dashboard = async () => {
  const userWallet = await getUserWallet();
  if (userWallet.error || !userWallet.userWallet?.publicKey) {
    return <div>{userWallet.error}</div>;
  }
  return <Profilecard publicKey={userWallet.userWallet?.publicKey} />;
};

export default Dashboard;
