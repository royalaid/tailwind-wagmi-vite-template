import {
  COLLATERAL,
  COLLATERAL_V2,
  COLLATERALS,
  QiStablecoin,
} from "@qidao/sdk";
import { VaultContractDiscriminator } from "@qidao/sdk/dist/src/vaultInfo";
import { ReadContractParameters } from "viem";
import { useAccount, useContractRead } from "wagmi";
import { range } from "lodash";
import {
  Abi,
  ExtractAbiFunctionNames,
  ExtractAbiFunction,
  AbiParametersToPrimitiveTypes,
} from "abitype";

import {
  qiStablecoinABI,
  crosschainQiStablecoinV2ABI,
  crosschainQiStablecoinSlimV2ABI,
  crosschainQiStablecoinwbtcABI,
  crosschainNativeQiStablecoinABI,
  crosschainQiStablecoinSlimABI,
  crosschainQiStablecoinABI,
  erc20QiStablecoincamwbtcABI,
  erc20QiStablecoinwbtcABI,
  stableQiVaultABI,
  erc20StablecoinABI,
} from "../constABIs";

type ABI =
  | typeof qiStablecoinABI
  | typeof crosschainQiStablecoinV2ABI
  | typeof crosschainQiStablecoinSlimV2ABI
  | typeof crosschainQiStablecoinwbtcABI
  | typeof crosschainNativeQiStablecoinABI
  | typeof crosschainQiStablecoinSlimABI
  | typeof crosschainQiStablecoinABI
  | typeof erc20QiStablecoincamwbtcABI
  | typeof erc20QiStablecoinwbtcABI
  | typeof stableQiVaultABI
  | typeof erc20StablecoinABI;

const lookup = {
  QiStablecoin: crosschainQiStablecoinABI,
  CrosschainQiStablecoinV2: crosschainQiStablecoinV2ABI,
  CrosschainQiStablecoinSlimV2: crosschainQiStablecoinSlimV2ABI,
  CrosschainQiStablecoinwbtc: crosschainQiStablecoinwbtcABI,
  CrosschainNativeQiStablecoin: crosschainNativeQiStablecoinABI,
  CrosschainQiStablecoinSlim: crosschainQiStablecoinSlimABI,
  CrosschainQiStablecoin: crosschainQiStablecoinABI,
  Erc20QiStablecoincamwbtc: erc20QiStablecoincamwbtcABI,
  Erc20QiStablecoinwbtc: erc20QiStablecoinwbtcABI,
  StableQiVault: stableQiVaultABI,
  Erc20Stablecoin: erc20StablecoinABI,
} satisfies { [key in VaultContractDiscriminator]: Abi };

type AbiMap = typeof lookup;

function abiLookup<Td extends VaultContractDiscriminator>(discriminator: Td) {
  return lookup[discriminator];
}

function asMaximallyNarrowedAbi<
  TAbi extends Abi,
  TFunctionName extends ExtractAbiFunctionNames<TAbi, "pure" | "view">,
  TAbiFunction extends ExtractAbiFunction<
    TAbi,
    TFunctionName
  > = ExtractAbiFunction<TAbi, TFunctionName>,
>(readParams: {
  abi: TAbi;
  functionName: TFunctionName;
  args: AbiParametersToPrimitiveTypes<TAbiFunction["inputs"], "inputs">;
}): {
  abi: TAbi;
  functionName: TFunctionName;
  args: AbiParametersToPrimitiveTypes<TAbiFunction["inputs"], "inputs">;
} {
  const { functionName, abi, args } = readParams;

  const abiEntry = abi.find((entry) => {
    if (entry.type !== "function") return false;
    if (entry.name !== functionName) return false;
    if (entry.inputs.length !== args?.length) return false;
  });

  if (!abiEntry) throw new Error("No matching abi entry");

  return readParams; // This will now return a narrowed type based on the ABI function's outputs
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

  const foobar = abiLookup(collateral.discriminator);

  const blah = asMaximallyNarrowedAbi({
    chainId: collateral.chainId,
    address: collateral.vaultAddress as `0x${string}`,
    functionName: "ownerOf",
    abi: foobar,
    args: [0n],
  });

  const foo = useContractRead({
    chainId: collateral.chainId,
    address: collateral.vaultAddress as `0x${string}`,
    functionName: "tokenOfOwnerByIndex",
    abi: erc20QiStablecoinwbtcABI,
    args: [address, 0n],
  });

  // const { useVaultDebt, useVaultCollateral, useTokenOfOwnerByIndex } =
  //
  // const vaultGlobalIdxRes = useTokenOfOwnerByIndex({
  //   chainId: collateral.chainId,
  //   args: [address, index],
  // });
  //
  // const vaultGlobalIdx = vaultGlobalIdxRes.data;
  // if (!vaultGlobalIdx) return <></>;
  //
  // const debt = useVaultDebt({
  //   chainId: collateral.chainId,
  //   args: [vaultGlobalIdx],
  // });
  // if (debt.error) console.error(debt.error);
  //
  // const collateralBalance = useVaultCollateral({
  //   chainId: collateral.chainId,
  //   args: [vaultGlobalIdx],
  // });
  // if (collateralBalance.error) console.error(collateralBalance.error);
  //
  // if (debt.data === 0n || !debt.data) return <></>;

  return (
    <div>
      <p>{collateral.token.name}</p>
      <p>{collateral.vaultAddress}</p>
      {/*<p>{debt.data?.toString()}</p>*/}
      {/*<p>{collateralBalance.data?.toString()}</p>*/}
    </div>
  );
}

function CollateralCard({
  collateral,
}: {
  collateral: COLLATERAL | COLLATERAL_V2;
}) {
  if (collateral.discriminator === "QiStablecoin") return <></>;
  const { useBalanceOf } = {
    useBalanceOf: (_: any) => {
      return { data: 1n, error: null };
    },
  };
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
