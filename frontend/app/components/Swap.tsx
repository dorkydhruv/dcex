import { useEffect, useState } from "react";
import { SUPPORTED_TOKENS, TokenDetails } from "../lib/tokens";
import Image from "next/image";
import { useTokens } from "../api/hooks/useTokens";
import { Button } from "./ui/button";
import axios from "axios";

export default function Swap({ publicKey }: { publicKey: string }) {
  const [baseAsset, setBaseAsset] = useState(SUPPORTED_TOKENS[0]);
  const [quoteAsset, setQuoteAsset] = useState(SUPPORTED_TOKENS[1]);
  const { tokenBalances, loading } = useTokens({ address: publicKey });
  const [baseAmont, setBaseAmount] = useState<string>();
  const [quoteAmount, setQuoteAmount] = useState<string>();
  const [fetchingQuote, setFetchingQuote] = useState<boolean>(false);
  const [quoteResponse, setQuoteResponse] = useState<any>();
  useEffect(() => {
    console.log(baseAmont);
    if (!baseAmont || Number(baseAmont) === 0) {
      setQuoteAmount("");
      return;
    }
    if (fetchingQuote) return;
    setFetchingQuote(true);
    try {
      axios
        .get(
          `https://quote-api.jup.ag/v6/quote?inputMint=${
            baseAsset.mint
          }&outputMint=${quoteAsset.mint}&amount=${
            Number(baseAmont) * 10 ** baseAsset.decimals
          }&slippageBps=50`
        )
        .then((res) => {
          setQuoteAmount(
            Number(res.data.outAmount / 10 ** quoteAsset.decimals).toString()
          );
          setQuoteResponse(res.data);
          setFetchingQuote(false);
        });
    } catch (e) {
      console.log(e);
      setFetchingQuote(false);
    }
  }, [baseAmont, quoteAmount, baseAsset, quoteAsset]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  return (
    <div>
      <div className="text-2xl font-bold pb-4 mx-5">Swap Tokens</div>
      <SwapInputRow
        onSelect={(asset) => {
          setBaseAsset(asset);
        }}
        onAmounChange={(amount) => {
          setBaseAmount(amount);
        }}
        selectedToken={baseAsset}
        title="You send"
        topBorderEnabled={true}
        bottomBorderEnabled={false}
        subtitle={`Current balance : ${
          tokenBalances?.tokens.find((x) => x.name === baseAsset.name)?.balance
        } ${baseAsset.name}`}
        amount={baseAmont?.toString()}
      ></SwapInputRow>
      <div className="flex justify-center">
        <div
          onClick={() => {
            let baseAssetTemp = baseAsset;
            setBaseAsset(quoteAsset);
            setQuoteAsset(baseAssetTemp);
          }}
          className="cursor-pointer rounded-full flex justify-center items-center w-10 h-10 border absolute mt-[-20px] bg-white"
        >
          <SwapIcon />
        </div>
      </div>
      <SwapInputRow
        onSelect={(asset) => {
          setQuoteAsset(asset);
        }}
        inputLoading={fetchingQuote}
        selectedToken={quoteAsset}
        onAmounChange={(amount) => {}}
        title="You recieve"
        topBorderEnabled={false}
        bottomBorderEnabled={true}
        amount={quoteAmount?.toString()}
      ></SwapInputRow>

      <div className="flex justify-end">
        <Button
          onClick={() => {
            //swap logic
            axios.post(
              "/api/swap",
              { quoteResponse },
              {
                withCredentials: true,
              }
            );
          }}
          className="bg-blue-500 text-white rounded-xl mx-4 p-4 mt-4"
        >
          Swap
        </Button>
      </div>
    </div>
  );
}

function SwapInputRow({
  onSelect,
  selectedToken,
  topBorderEnabled,
  bottomBorderEnabled,
  subtitle,
  inputLoading,
  title,
  onAmounChange,
  amount,
}: {
  onSelect: (asset: TokenDetails) => void;
  selectedToken: TokenDetails;
  topBorderEnabled: boolean;
  bottomBorderEnabled: boolean;
  title: string;
  subtitle?: string;
  inputLoading?: boolean;
  amount?: string;
  onAmounChange?: (amount: string) => void;
}) {
  return (
    <div
      className={`border flex justify-between mx-4 p-4 ${
        topBorderEnabled ? "rounded-t-xl" : ""
      } ${bottomBorderEnabled ? "rounded-b-xl" : ""}`}
    >
      <div>
        <div className="px-3  text-xs font-bold">{title}</div>
        <AssetSelector
          selectedToken={selectedToken}
          onSelect={onSelect}
        ></AssetSelector>
        {subtitle && (
          <div className="text-gray-500 text-sm mx-3">{subtitle}</div>
        )}
      </div>
      <div>
        {!inputLoading ? (
          <input
            disabled={bottomBorderEnabled}
            onChange={(e) => {
              onAmounChange?.(e.target.value);
            }}
            value={amount}
            placeholder="0"
            type="text"
            className="p-6 outline-none bg-white text-4xl"
            dir="rtl"
          ></input>
        ) : (
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900"></div>
        )}
      </div>
    </div>
  );
}

function AssetSelector({
  selectedToken,
  onSelect,
}: {
  selectedToken: TokenDetails;
  onSelect: (asset: TokenDetails) => void;
}) {
  return (
    <div>
      <select
        onChange={(e) => {
          const selectedToken = SUPPORTED_TOKENS.find(
            (token) => token.name === e.target.value
          );
          if (selectedToken) onSelect(selectedToken);
        }}
        id="countries"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 m-2 "
      >
        {SUPPORTED_TOKENS.map((token) => (
          <option selected={selectedToken.name === token.name ? true : false}>
            {token.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function SwapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      className="size-6 "
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
      />
    </svg>
  );
}
