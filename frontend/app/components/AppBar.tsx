"use client";
import React from "react";
import { Button } from "./ui/button";
import { signOut, useSession } from "next-auth/react";
import { LogIn, LogOut } from "lucide-react";

const AppBar = () => {
  const sesion = useSession();
  return (
    <div className="flex border-b px-2 py-2  justify-between">
      <div className="text-xl font-bold flex flex-col justify-center ">
        DCEX
      </div>
      {sesion.data?.user ? (
        <Button
          className="gap-2 bg-teal-100 rounded-2xl flex justify-center items-center p-4"
          onClick={() => signOut()}
        >
          <LogOut /> Logout
        </Button>
      ) : (
        <Button
          className="gap-2 bg-teal-100 rounded-2xl flex justify-center items-center p-4"
          onClick={() => {}}
        >
          <LogIn /> Login
        </Button>
      )}
    </div>
  );
};

export default AppBar;
