import Profilecard from "@/components/Profilecard";
import React from "react";
import prisma from "../db";
import { getServerSession } from "next-auth";


// async function  getBalance(){
//   const session = await getServerSession();
//   prisma.solWallet.findFirst({
//     where:{
//       userId:
//     }
//   })
// }

const Dashboard = () => {
  return <Profilecard />;
};

export default Dashboard;
