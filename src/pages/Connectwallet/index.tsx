import React, { useContext } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import "./connectwallet.scss";
import { walletContext } from "../../store/walletContext";

const Connectwallet: React.FC = () => {
  const { account, deactivate, error } = useWeb3React();
  const { setOpenWalletModal } = useContext(walletContext);

  return (
    <>
      <h1 className="mb-30" style={{ textAlign: "center" }}>
        Wallet
      </h1>
      {error instanceof UnsupportedChainIdError && (
        <div className="alert_info warning mb-30">
          <p className="md" style={{ textAlign: "center", width: "100%" }}>
            App doesn't support this chain id . please change network.
          </p>
        </div>
      )}
      <div className="connectwallet_route">
        <div className="wallet_accounts">
          <div className="accounts mb-20">
            <p className="mb-10">connected Web3</p>
            <b style={{ wordBreak: "break-word" }}>{account ?? "-"}</b>
          </div>
          {account ? (
            <button className="btn btn-primary" onClick={() => deactivate()}>
              Disconnect
            </button>
          ) : (
            <div className="wallets">
              <p>Connect your Web3 wallet</p>
              <button className="btn btn-primary" onClick={() => setOpenWalletModal(true)}>
                Connect web3
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Connectwallet;
