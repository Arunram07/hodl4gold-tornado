import React, { useState } from "react";

import "./Home.scss";
import Stats from "./Stats";
import Transfer from "./Transfer";
import { ReactComponent as Close } from "../../assets/icons/close.svg";

const Home: React.FC = () => {
  const [alertInfo, setAlertInfo] = useState(true);
  return (
    <>
      {alertInfo && (
        <div className="alert_info mb-30">
          <p className="md">
            Hodl4Gold Cash was audited. However, it is still an experimental software. Please use at
            your own risk.
          </p>
          <div className="pointer" onClick={() => setAlertInfo(false)}>
            <Close />
          </div>
        </div>
      )}
      <div className="home">
        <Transfer />
        <Stats />
      </div>
    </>
  );
};

export default Home;
