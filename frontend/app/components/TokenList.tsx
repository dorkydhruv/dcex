import { TokenWithBalance } from "../api/hooks/useTokens";

export function TokenList({ tokens }: { tokens: TokenWithBalance[] }) {
  return (
    <div>
      {tokens.map((t) => (
        <TokenRow key={t.name} token={t} />
      ))}
    </div>
  );
}

function TokenRow({ token }: { token: TokenWithBalance }) {
  return (
    <div className="flex justify-between">
      <div className="justify-center flex items-center ">
        <div>
          <img
            src={token.image}
            height={40}
            width={40}
            className="rounded-full justify-center flex items-center   mr-2"
          />
        </div>
        <div>
          <div className="font-bold">{token.name}</div>
          <div className="font-slim">
            1 {token.name} = ~${token.price}
          </div>
        </div>
      </div>
      <div>
        <div>
          <div className="font-bold flex justify-end">{token.usdBalance}</div>
          <div className="font-slim flex justify-end">{token.balance}</div>
        </div>
      </div>
    </div>
  );
}
