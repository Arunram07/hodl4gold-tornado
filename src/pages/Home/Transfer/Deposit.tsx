import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Down } from "../../../assets/icons/down_arrow.svg";
import { useUpdateEffect } from "../../../hooks";

const coins = ["ETH", "BSC", "DAI", "USDT"];

const price = ["0.1", "1", "10"];

const Deposit: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useWeb3React();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState("ETH");

  useUpdateEffect(() => {
    setToggleDropdown(false);
  }, [selectedCoin]);

  const handleDeposit = async () => {};

  return (
    <div className="deposit">
      <div>
        <p className="md mb-10">Token</p>
        <div className="dropdown_input">
          <div className="dropdown" onClick={() => setToggleDropdown((t) => !t)}>
            <p>{selectedCoin}</p>
            <div>
              <Down />
            </div>
          </div>
          <div className={toggleDropdown ? "dropdown_list active" : "dropdown_list"}>
            {coins.map((coin, i) => (
              <section
                key={i.toString()}
                onClick={() => setSelectedCoin(coin)}
                className={selectedCoin === coin ? "active" : ""}
              >
                {coin}
              </section>
            ))}
          </div>
        </div>
      </div>
      <div>
        <p className="md mb-10">Amount</p>
        <div className="range_input">
          <div className="range_wrapper">
            {price.map((val, index) => (
              <div key={index.toString()} className="ranger">
                <div className="input">
                  <span></span>
                </div>
                <p>{val} ETH</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        {account ? (
          <button className="btn btn-primary full-width" onClick={() => handleDeposit()}>
            Deposit
          </button>
        ) : (
          <button
            className="btn btn-primary full-width"
            onClick={() => navigate("/connect-wallet")}
          >
            connect wallet
          </button>
        )}
      </div>
    </div>
  );
};

export default Deposit;
