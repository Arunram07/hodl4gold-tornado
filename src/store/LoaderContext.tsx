import React, { createContext, ReactNode, useState } from "react";
import Loader from "../components/Layout/Loader";

export const LoaderContext = createContext<{
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}>({ isLoading: false, setIsLoading: () => {} });

const LoaderContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoaderContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
      <Loader modal={isLoading} setModal={setIsLoading} />
    </LoaderContext.Provider>
  );
};

export default LoaderContextProvider;
