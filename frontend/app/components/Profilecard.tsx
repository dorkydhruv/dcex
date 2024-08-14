"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useTokens } from "@/app/api/hooks/useTokens";
import { TokenList } from "./TokenList";
import { TabButton } from "./TabButton";
import Swap from "./Swap";

const Profilecard = ({ publicKey }: { publicKey: string }) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<Tab>("tokens");
  const session = useSession();
  const [tokenBalances, setTokenBalances] = useState<any>(null);
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
    <div className="pt-8 flex-col">
      <div className="mx-w-xl  bg-white rounded shadow p-8">
        <Greeting
          name={session.data?.user?.name ?? ""}
          image={session.data?.user?.image ?? ""}
        />
      </div>
      <div className="flex w-full justify-center px-10 py-4">
        {tabs.map((tab) => (
          <TabButton
            active={selectedTab === tab ? true : false}
            onClick={() => setSelectedTab(tab)}
          >
            {tab.toUpperCase()}
          </TabButton>
        ))}
      </div>
      <div className={`${selectedTab === "tokens" ? "visible" : "hidden"}`}>
        <Assets publicKey={publicKey} />
      </div>
      <div className={`${selectedTab === "swap" ? "visible" : "hidden"}`}>
        <Swap publicKey={publicKey} />
      </div>
    </div>
  );
};

export default Profilecard;

type Tab = "tokens" | "send" | "add_funds" | "swap" | "withdraw";

const tabs: Tab[] = ["tokens", "send", "add_funds", "withdraw", "swap"];

function Assets({ publicKey }: { publicKey: string }) {
  const [copied, setCopied] = useState(false);
  const { tokenBalances, loading } = useTokens({ address: publicKey });

  useEffect(() => {
    if (copied) {
      let timeout = setTimeout(() => {
        setCopied(false);
      }, 3000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [copied]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div className="text-slate-500">
      <div className="mx-12 py-2">Account assets</div>
      <div className="flex justify-between mx-12">
        <div className="flex">
          <div className="text-5xl font-bold text-black">
            ${tokenBalances?.totalBalance.toFixed(2)}
          </div>
          <div className="font-slate-500 font-bold text-3xl flex flex-col justify-end pb-0 pl-2">
            USD
          </div>
        </div>

        <div>
          <Button
            className="bg-slate-900 text-white rounded-xl"
            onClick={() => {
              navigator.clipboard.writeText(publicKey);
              setCopied(true);
            }}
          >
            {copied ? "Copied" : "Your wallet address"}
          </Button>
        </div>
      </div>

      <div className="pt-4 bg-slate-50 p-12 mt-4">
        <TokenList tokens={tokenBalances?.tokens || []} />
      </div>
    </div>
  );
}
function Greeting({ image, name }: { image: string; name: string }) {
  return (
    <div className="flex p-12">
      <img src={image} className="rounded-full w-16 h-16 mr-4" />
      <div className="text-2xl font-semibold flex flex-col justify-center">
        Welcome back, {name}
      </div>
    </div>
  );
}
