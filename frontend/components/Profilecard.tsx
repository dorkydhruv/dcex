"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

const Profilecard = () => {
  const router = useRouter();
  const session = useSession();
  if (session.status === "loading") {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session.data?.user) {
    router.push("/");
    return null;
  }

  return (
    <div className="pt-8 flex justify-center items-center  flex-col">
      <div className="mx-w-xl bg-white rounded shadow p-8">
        <Greeting
          name={session.data?.user?.name ?? ""}
          image={session.data?.user?.image ?? ""}
        />
      </div>
      <Assets />
    </div>
  );
};

export default Profilecard;

function Assets() {
  return <div className="text-slate-400 mt-4">Your stats</div>;
}

function Greeting({ name, image }: { name: string; image: string }) {
  return (
    <div className=" flex gap-3">
      <img
        src={image}
        alt="imae"
        height={30}
        width={30}
        className="rounded-full"
      />
      <div className="text-2lg font-bold  ">Howdy, {name}!</div>
    </div>
  );
}
