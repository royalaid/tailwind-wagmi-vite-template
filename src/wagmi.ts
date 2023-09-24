import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import {
  goerli,
  mainnet,
  arbitrum,
  optimism,
  bsc,
  fantom,
  gnosis,
  harmonyOne,
  metis,
  moonbeam,
  moonriver,
  polygon,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const walletConnectProjectId = "07aaa3b8014f862823c152b9a472f26f";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    arbitrum,
    optimism,
    bsc,
    fantom,
    gnosis,
    harmonyOne,
    metis,
    moonbeam,
    moonriver,
    polygon,
    ...(import.meta.env?.MODE === "development" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My wagmi + RainbowKit App",
  chains,
  projectId: walletConnectProjectId,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export { chains };
