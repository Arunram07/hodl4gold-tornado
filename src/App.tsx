import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { Compliance, Connectwallet, Home } from "./pages";
import { Footer, Header } from "./components";

import { useEagerConnect } from "./hooks/useEagerConnect";
import Modal from "./components/Layout/Modal";

const App: React.FC = () => {
  useEagerConnect();
  const [networkModal, setNetworkModal] = useState(false);

  return (
    <div className="app">
      <div className="app_routes">
        <Header setNetworkModal={setNetworkModal} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/connect-wallet" element={<Connectwallet />} />
        </Routes>
        <Footer />
      </div>
      <Modal modal={networkModal} setModal={setNetworkModal} />
    </div>
  );
};

export default App;
