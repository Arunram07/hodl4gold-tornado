import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import config  from "../../utils/config";

let coinsArray: Array<string>;
export function useCoinList() {
  const { active, chainId } = useWeb3React();

  useEffect(() => {
    if (active) {
      coinsArray = Object.keys(config.deployments[`netId${chainId}`]);
    }
  }, [active, chainId]);

  if (coinsArray === undefined) {
    return ["Connect wallet"];
  } else {
    return coinsArray;
  }
}
