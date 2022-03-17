import React, { useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./Modal.scss";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "../../utils/connector";
import { networks } from "../../utils/networks";
import { LoaderContext } from "../../store/LoaderContext";

const modalVariants = {
  initial: {
    opacity: 0,
    y: "-100vh",
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: "100vh",
  },
};

interface ModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal: React.FC<ModalProps> = ({ modal, setModal }) => {
  const { chainId } = useWeb3React();
  const { setIsLoading } = useContext(LoaderContext);

  const handleNetwork = async (id: number) => {
    setIsLoading(true);
    await switchNetwork(id);
    setIsLoading(false);
    setModal(false);
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {modal && (
        <motion.div
          className="modal_backdrop"
          variants={modalVariants}
          animate="animate"
          initial="initial"
          exit="exit"
          onClick={() => setModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex mb-20">
              <b>Change Network</b>
              <span className="pointer" onClick={() => setModal(false)}>
                <Close />
              </span>
            </div>
            <div className="network_wrapper">
              {networks.map((network, index) => (
                <div
                  key={index.toString()}
                  className="flex pointer"
                  onClick={() => handleNetwork(network.chain)}
                >
                  <div className="network_block">
                    <img src={network.logo} alt={network.name} width={24} height={24} />
                    <p className="md">{network.label}</p>
                  </div>
                  <div className={network.chain === chainId ? "radio active" : "radio"} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
