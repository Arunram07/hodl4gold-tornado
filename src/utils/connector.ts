import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { ethers } from "ethers";

export const Injected = new InjectedConnector({
  supportedChainIds: [1, 4],
});

export const Walletconnect = new WalletConnectConnector({
  rpc: {
    1: "https://mainnet.infura.io/v3/de7757285d664cb6af8239c7fd98a7cc",
  },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: 12000,
});

const switchRequest = (id: number) => {
  const { ethereum } = window as any;
  return ethereum.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: ethers.utils.hexlify(id) }],
  });
};

export const switchNetwork = async (id: number) => {
  const { ethereum } = window as any;
  if (ethereum) {
    try {
      await switchRequest(id);
    } catch (error) {
      console.log(error);
    }
  }
};
