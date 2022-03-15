import React, { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./Modal.scss";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import { useWeb3React } from "@web3-react/core";
import { Injected, Walletconnect } from "../../utils/connector";
import metamask from "../../assets/images/metamask.svg";
import walletconnectLogo from "../../assets/images/walletconnect.svg";
import { LoaderContext } from "../../store/LoaderContext";

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.5,
    x: "-50%",
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
    scale: 1,
    x: "-50%",
  },
  exit: {
    opacity: 0,
    scale: 0,
    x: "-50%",
  },
};

interface ModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const WalletModal: React.FC<ModalProps> = ({ modal, setModal }) => {
  const { activate } = useWeb3React();
  const { setIsLoading } = useContext(LoaderContext);

  const handleConnect = async (type: string = "metamask") => {
    setIsLoading(true);
    if (type === "metamask") await activate(Injected);
    else await activate(Walletconnect);

    setIsLoading(false);
    setModal(false);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {modal && (
        <motion.div
          className="modal_backdrop"
          variants={backdropVariants}
          animate="animate"
          initial="initial"
          exit="initial"
          onClick={() => setModal(false)}
        >
          <motion.div
            className="wallet_modal"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            animate="animate"
            initial="initial"
            exit="exit"
          >
            <div className="flex mb-20">
              <b>Your wallet</b>
              <span className="pointer" onClick={() => setModal(false)}>
                <Close />
              </span>
            </div>
            <div className="wallets">
              <div onClick={() => handleConnect()}>
                <img src={metamask} alt="metamask" />
              </div>
              <div onClick={() => handleConnect("walletconnect")}>
                <img src={walletconnectLogo} alt="walletconnect" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;
