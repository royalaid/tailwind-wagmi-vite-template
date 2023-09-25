import { COLLATERAL, COLLATERAL_V2, COLLATERALS } from "@qidao/sdk";
import { useAccount } from "wagmi";
import { Lookup } from "./scopedHooks";

function CollateralCard(props: { collateral: COLLATERAL | COLLATERAL_V2 }) {
  const collateral = props.collateral;
  const { useBalanceOf } = Lookup[collateral.discriminator];
  const { address } = useAccount();
  const balance = useBalanceOf({
    address: collateral.vaultAddress as `0x${string}`,
    args: [address as `0x${string}`],
    chainId: collateral.chainId,
    enabled: Boolean(address),
  });
  console.log(address);
  console.log(balance.isLoading);
  console.log(balance.data);
  if (balance.error) console.error(balance.error);

  return (
    <div>
      <p>{props.collateral.token.name}</p>
      <p>{props.collateral.vaultAddress}</p>
      <p>{balance.data?.toString()}</p>
    </div>
  );
}

const Dougy = () => {
  const collaterals = Object.values(COLLATERALS).flat(2);
  return (
    <div>
      <h1>Hello Dougy</h1>
      {collaterals.map((collateral) => {
        return (
          <CollateralCard
            key={collateral.vaultAddress + collateral.chainId}
            collateral={collateral}
          />
        );
      })}
    </div>
  );
};

export default Dougy;
