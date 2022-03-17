import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import "./layout.scss";
import { ReactComponent as Logo } from "../../assets/images/logo.svg";
import { ReactComponent as Menu } from "../../assets/icons/menu.svg";
import metamask from "../../assets/images/metamask.png";
import ethereum from "../../assets/images/ethereum.png";
import { networks } from "../../utils/networks";
import { motion } from "framer-motion";
import { walletContext } from "../../store/walletContext";

const Header: React.FC<{ setNetworkModal: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  setNetworkModal,
}) => {
  const { active, chainId } = useWeb3React();
  const navigate = useNavigate();
  const { setOpenWalletModal } = useContext(walletContext);
  const [sidebar, setSidebar] = useState(false);
  const [metamaskTooltip, setMetamaskTooltip] = useState(false);

  const getNetworkName = (id?: number) => {
    const getNetwork = networks.find((f) => f.chain === id);
    if (getNetwork) return getNetwork.name;
    return "Ethereum";
  };

  const renderNetwork = (
    <>
      <div className="networks" onClick={() => setNetworkModal(true)}>
        <div className="wallet_logo">
          <img src={ethereum} alt="wallet logo" />
        </div>
        <p className="md">{getNetworkName(chainId)}</p>
      </div>
    </>
  );

  const renderLinks = (
    <div className="links">
      <Link to="/compliance">Compliance</Link>
      <Link to="/">Docs</Link>
    </div>
  );

  const renderControls = (
    <>
      <div
        className={active ? "sites active" : "sites"}
        onMouseEnter={() => setMetamaskTooltip(true)}
        onMouseLeave={() => setMetamaskTooltip(false)}
      >
        <img src={metamask} alt="metamask logo" />
        {metamaskTooltip && (
          <motion.div
            className="tooltip"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="sm">{active ? "connected" : "Not connected"}</p>
            <p className=" md text-primary pointer" onClick={() => setOpenWalletModal(true)}>
              {active ? "Connected" : "Connect"}
            </p>
          </motion.div>
        )}
      </div>
      <div className="account" onClick={() => navigate("/connect-wallet")}>
        <p>settings</p>
      </div>
    </>
  );

  return (
    <>
      <div className="header">
        <div className="header-block_left">
          <div className="logo">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          {renderLinks}
        </div>
        <div className="header-block_right">
          {renderNetwork}
          {renderControls}
        </div>
        <div className="menu" onClick={() => setSidebar((s) => !s)}>
          <Menu />
        </div>
      </div>
      {sidebar && (
        <div className="sidebar">
          {renderLinks}
          {renderNetwork}
          {renderControls}
        </div>
      )}
    </>
  );
};

export default Header;
