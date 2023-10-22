import { COLLATERAL, COLLATERAL_V2, COLLATERALS } from "@qidao/sdk";
import { useAccount } from "wagmi";
import { Lookup } from "./scopedHooks";
import { range } from "lodash";

function useCollateral(collateral: COLLATERAL | COLLATERAL_V2) {
  if (collateral.discriminator === "QiStablecoin") throw new Error("TODO");
  return Lookup[collateral.discriminator];
}

function VaultCard({
  collateral,
  index = 0n,
}: {
  collateral: COLLATERAL | COLLATERAL_V2;
  index?: bigint;
}) {
  const { address } = useAccount();
  if (!address) return <></>; //TODO: loading state

  const { useVaultDebt, useVaultCollateral, useTokenOfOwnerByIndex } =
    useCollateral(collateral);

  const vaultGlobalIdxRes = useTokenOfOwnerByIndex({
    chainId: collateral.chainId,
    args: [address, index],
  });

  const vaultGlobalIdx = vaultGlobalIdxRes.data;
  if (!vaultGlobalIdx) return <></>;

  const debt = useVaultDebt({
    chainId: collateral.chainId,
    args: [vaultGlobalIdx],
  });
  if (debt.error) console.error(debt.error);

  const collateralBalance = useVaultCollateral({
    chainId: collateral.chainId,
    args: [vaultGlobalIdx],
  });
  if (collateralBalance.error) console.error(collateralBalance.error);

  if (debt.data === 0n || !debt.data) return <></>;

  return (
    <div>
      <p>{collateral.token.name}</p>
      <p>{collateral.vaultAddress}</p>
      <p>{debt.data?.toString()}</p>
      <p>{collateralBalance.data?.toString()}</p>
    </div>
  );
}

function CollateralCard({
  collateral,
}: {
  collateral: COLLATERAL | COLLATERAL_V2;
}) {
  if (collateral.discriminator === "QiStablecoin") return <></>;
  const { useBalanceOf } = useCollateral(collateral);
  if (!useBalanceOf) return <></>;
  const { address } = useAccount();
  const balance = useBalanceOf({
    // address: collateral.vaultAddress as `0x${string}`,
    args: [address],
    chainId: collateral.chainId,
    enabled: Boolean(address),
  });
  if (balance.error) return <></>;

  if (balance.data === 0n || !balance.data) return <></>;
  console.log(collateral.token.name);
  console.log(balance.data);
  return (
    <div>
      <p>{collateral.token.name}</p>
      {range(0, Number(balance.data)).map((i) => {
        return (
          <VaultCard
            key={collateral.vaultAddress + collateral.chainId + i}
            collateral={collateral}
            index={BigInt(i)}
          />
        );
      })}
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
