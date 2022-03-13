import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./Modal.scss";

const backdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

const modalVariants = {
  initial: {
    opacity: 0,
    scale: 0.5,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 0,
  },
};

interface ModalProps {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Loader: React.FC<ModalProps> = ({ modal, setModal }) => {
  return (
    <AnimatePresence exitBeforeEnter>
      {modal && (
        <motion.div
          className="modal_backdrop loader"
          variants={backdropVariants}
          animate="animate"
          initial="initial"
          exit="initial"
        >
          <motion.div
            className="modal_loader"
            variants={modalVariants}
            animate="animate"
            initial="initial"
            exit="exit"
          >
            <span className="spinner" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
