import React, { ReactNode } from "react";
import LoaderContextProvider from "./LoaderContext";
import WalletContextProvider from "./walletContext";

const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LoaderContextProvider>
      <WalletContextProvider>{children}</WalletContextProvider>
    </LoaderContextProvider>
  );
};

export default Provider;
