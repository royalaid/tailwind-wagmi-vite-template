import { defineConfig } from "@wagmi/cli";
import { react } from "@wagmi/cli/plugins";
import {
  qiStablecoin,
  crosschainQiStablecoinV2,
  crosschainQiStablecoinSlimV2,
  crosschainQiStablecoinwbtc,
  crosschainNativeQiStablecoin,
  crosschainQiStablecoinSlim,
  crosschainQiStablecoin,
  erc20QiStablecoincamwbtc,
  erc20QiStablecoinwbtc,
  stableQiVault,
  erc20Stablecoin,
} from "@qidao/sdk";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    { abi: qiStablecoin.abi, name: "QiStablecoin" },
    { abi: crosschainQiStablecoinV2, name: "crosschainQiStablecoinV2" },
    { abi: crosschainQiStablecoinSlimV2, name: "crosschainQiStablecoinSlimV2" },
    { abi: crosschainQiStablecoinwbtc, name: "crosschainQiStablecoinwbtc" },
    { abi: crosschainNativeQiStablecoin, name: "crosschainNativeQiStablecoin" },
    { abi: crosschainQiStablecoinSlim, name: "crosschainQiStablecoinSlim" },
    { abi: crosschainQiStablecoin, name: "crosschainQiStablecoin" },
    { abi: erc20QiStablecoincamwbtc, name: "erc20QiStablecoincamwbtc" },
    { abi: erc20QiStablecoinwbtc, name: "erc20QiStablecoinwbtc" },
    { abi: stableQiVault, name: "stableQiVault" },
    { abi: erc20Stablecoin, name: "erc20Stablecoin" },
  ],
  plugins: [react()],
});
