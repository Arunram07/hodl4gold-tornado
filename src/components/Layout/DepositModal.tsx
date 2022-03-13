import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import CopyToClipbaord from "react-copy-to-clipboard";

import "./Modal.scss";
import { ReactComponent as Close } from "../../assets/icons/close.svg";
import { useUpdateEffect } from "../../hooks";

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
  note: string;
  handleSendDeposit: () => void;
}

const DepositModal: React.FC<ModalProps> = ({ modal, setModal, note, handleSendDeposit }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useUpdateEffect(() => {
    if (isCopied) {
      setTimeout(() => setIsCopied(false), 3000);
    }
  }, [isCopied]);

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
              <b>Your private note</b>
              <span className="pointer" onClick={() => setModal(false)}>
                <Close />
              </span>
            </div>
            <div className="modal_content">
              <p className="md">
                Please backup your note. You will need it later to withdraw your deposit back
              </p>
              <p className="md">
                Treat your note as a private key - never share it with anyone , including Hodl4Gold
                developers
              </p>
              <p className="text-primary mt-10 mb-10" style={{wordBreak:"break-all"}}>
                {note}&nbsp;
                <CopyToClipbaord text={note}>
                  <span
                    style={{ color: "#000", cursor: "pointer" }}
                    onClick={() => setIsCopied(true)}
                  >
                    {isCopied ? "copied" : "copy"}
                  </span>
                </CopyToClipbaord>
              </p>
              <p className="mb-20 md">The file will ask to save your note as a file</p>
              <div style={{ display: "flex", alignItems: "center" }} className="mb-10">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setIsChecked((c) => !c)}
                />
                <p className="ml-10 md">I backed up my note</p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (!isChecked) return alert("please check the checkbox to proceed");
                  handleSendDeposit();
                }}
              >
                Send Deposit
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepositModal;
