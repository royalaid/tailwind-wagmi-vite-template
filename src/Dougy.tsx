import { ChainId, COLLATERALS } from "@qidao/sdk";
import { Lookup } from "./scopedHooks";

const Dougy = () => {
  const firstCollateral = COLLATERALS[ChainId.OPTIMISM][0];
  const collateralHooks = Lookup[firstCollateral.discriminator];

  return (
    <div>
      <h1>Hello Dougy</h1>
      <p>Collaterals: {JSON.stringify(COLLATERALS)}</p>
    </div>
  );
};
