import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { abi } from "../../../utils/abi/ETHAnon.js";
import snarkjs from "snarkjs";

import { ReactComponent as Down } from "../../../assets/icons/down_arrow.svg";
import DepositModal from "../../../components/Layout/DepositModal";
import { useUpdateEffect } from "../../../hooks";
import { useCoinList } from "../../../hooks/DepositEssentialHooks/useCoinList";
import config from "../../../utils/config";
import { deposit } from "../../../utils/anonDeposits";

const Deposit: React.FC = () => {
  const navigate = useNavigate();
  const { account, chainId, library } = useWeb3React();

  const coins = useCoinList();
  const [amounts, setAmounts] = useState<string[]>([]);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [depositModal, setDepositModal] = useState(false);
  const [note, setNote] = useState<string>("");
  const [selectedCoin, setSelectedCoin] = useState<string>("");
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [depositO, setDepositO] = useState<any>();

  useUpdateEffect(() => {
    setToggleDropdown(false);
  }, [selectedCoin]);

  useUpdateEffect(() => {
    if (coins.length > 1) {
      setSelectedCoin(coins[0]);
      const amountsList = Object.keys(
        config.deployments[`netId${chainId}`][coins[0]].instanceAddress
      );
      setAmounts(amountsList);
      setSelectedAmount(amountsList[0]);
    }
  }, [coins]);

  const handleSelectedCoin = (_coin: string) => {
    setAmounts(
      Object.keys(config.deployments[`netId${chainId}`][_coin].instanceAddress)
    );
    setSelectedCoin(_coin);
  };

  const handleDeposit = async () => {
    const depositObj = {
      currency: selectedCoin,
      amount: selectedAmount,
      chainId: chainId,
    };
    const note = deposit(depositObj);
    setNote(note.noteString);
    setDepositO(note.deposit);
    setDepositModal(true);
  };

  function toHex(number, length = 32) {
    console.log(number);
    const str =
      number instanceof Buffer
        ? number.toString("hex")
        : snarkjs.bigInt(number).toString(16);
    return "0x" + str.padStart(length * 2, "0");
  }

  const handleSendDeposit = async () => {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(note)
    );
    element.setAttribute("download", `backup-${note.substring(0, 28)}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    const instance = getContractInstance();
    const hex = toHex(depositO.commitement);
    await instance.methods
      .deposit(hex)
      .send({ value: Web3.utils.toWei(selectedAmount), from: account });
    setDepositModal(false);
  };

  function getContractInstance() {
    const web3 = new Web3(library.provider);
    const anon = new web3.eth.Contract(
      abi,
      config.deployments[`netId${chainId}`][selectedCoin].instanceAddress[
        selectedAmount
      ]
    );
    return anon;
  }

  return (
    <>
      <div className="deposit">
        <div>
          <p className="md mb-10">Token</p>
          <div className="dropdown_input">
            <div
              className="dropdown"
              onClick={() => setToggleDropdown((t) => !t)}
            >
              <p>{selectedCoin}</p>
              <div>
                <Down />
              </div>
            </div>
            <div
              className={
                toggleDropdown ? "dropdown_list active" : "dropdown_list"
              }
            >
              {coins.map((coin, i) => (
                <section
                  key={i.toString()}
                  onClick={() => {
                    handleSelectedCoin(coin);
                  }}
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
            <div
              className="range_wrapper"
              style={{ gridTemplateColumns: `repeat(${amounts.length},1fr)` }}
            >
              {amounts.map((val, index) => (
                <div key={index.toString()} className="ranger">
                  <div className="input" onClick={() => setSelectedAmount(val)}>
                    <div
                      className={val === selectedAmount ? "active" : undefined}
                    ></div>
                  </div>
                  <p>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          {account ? (
            <button
              className="btn btn-primary full-width"
              onClick={() => handleDeposit()}
            >
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
      <DepositModal
        modal={depositModal}
        setModal={setDepositModal}
        note={note}
        handleSendDeposit={handleSendDeposit}
      />
    </>
  );
};

export default Deposit;
