import React, { useState } from "react";

import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

const Transfer: React.FC = () => {
  const [toggle, setToggle] = useState<"deposit" | "withdraw">("deposit");
  return (
    <div className="home_transfer_container">
      <div className="home_transfer_container-header">
        <h2 className={toggle === "deposit" ? "active" : ""} onClick={() => setToggle("deposit")}>
          Deposit
        </h2>
        <h2 className={toggle === "withdraw" ? "active" : ""} onClick={() => setToggle("withdraw")}>
          Withdraw
        </h2>
      </div>
      <div className="home_transfer_container-content">
        {toggle === "deposit" ? <Deposit /> : <Withdraw />}
      </div>
    </div>
  );
};

export default Transfer;
