import React, { createContext, ReactNode, useState } from "react";
import WalletModal from "../components/Layout/WalletModal";

export const walletContext = createContext<{
  openWalletModal: boolean;
  setOpenWalletModal: React.Dispatch<React.SetStateAction<boolean>>;
}>({ openWalletModal: false, setOpenWalletModal: () => {} });

const WalletContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [openWalletModal, setOpenWalletModal] = useState(false);
  return (
    <walletContext.Provider value={{ openWalletModal, setOpenWalletModal }}>
      {children}
      <WalletModal modal={openWalletModal} setModal={setOpenWalletModal} />
    </walletContext.Provider>
  );
};

export default WalletContextProvider;
