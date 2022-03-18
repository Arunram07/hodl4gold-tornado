import { useWeb3React } from "@web3-react/core";
import React, { Component, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { withdraw } from "../../../utils/anonDeposits";
import snarkjs from "snarkjs";
import config from "../../../utils/config";
import { abi } from "../../../utils/abi/ETHAnon.js";
import { useUpdateEffect } from "../../../hooks";
import { LoaderContext } from "../../../store/LoaderContext";

const abis: any = abi;

const Withdraw: React.FC = () => {
  const navigate = useNavigate();
  const { account, library, active } = useWeb3React();
  const [note, setNote] = useState("");
  const [recipient, setRecipient] = useState("");
  const [worker, setWorker]: any = useState();
  const [groth16, setGroth16]: any = useState();
  const [isValid, setIsValid] = useState(false);
  const [amount, setAmount] = useState();
  const [currency, setCurrency] = useState("");
  const { setIsLoading } = useContext(LoaderContext);

  useUpdateEffect(() => {
    try {
      getWithdrawEssentials(note);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  }, [note]);

  const handleWithdraw = async () => {
    try {
      setIsLoading(true);
      const anon = await getContract(note);
      console.log(anon);
      const { proof, args } = await withdraw(note, anon, account);
      await anon.methods
        .withdraw(proof, ...args)
        .send({ from: account, gas: 1e6 });

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getContract = async (note: string) => {
    const { currency, amount, netId } = await getWithdrawEssentials(note);
    const web3 = new Web3(library.provider);
    const address =
      config.deployments[`netId${netId}`][currency].instanceAddress[amount];
    const anon = new web3.eth.Contract(abis, address);
    return anon;
  };

  const getWithdrawEssentials = (note: string) => {
    const noteRegex =
      /anon-(?<currency>\w+)-(?<amount>[\d.]+)-(?<netId>\d+)-0x(?<note>[0-9a-fA-F]{124})/g;
    const match: any = noteRegex.exec(note);
    if (!match) {
      throw new Error("The note has invalid format");
    }

    const buf = Buffer.from(match.groups.note, "hex");
    const nullifier = snarkjs.bigInt.leBuff2int(buf.slice(0, 31));
    const secret = snarkjs.bigInt.leBuff2int(buf.slice(31, 62));

    const netId = Number(match.groups.netId);

    setAmount(match.groups.amount);
    setCurrency(match.groups.currency);

    return {
      currency: match.groups.currency,
      amount: match.groups.amount,
      netId,
    };
  };

  return (
    <div className="withdraw">
      <div>
        <p className="md mb-10">Note</p>
        <div className="input_container">
          <input
            type="text"
            value={note}
            onChange={({ target }) => setNote(target.value)}
          />
        </div>
        {isValid && (
          <div className="flex_between">
            <p>Amount</p>
            <b>
              {amount}&nbsp;{currency}
            </b>
          </div>
        )}
      </div>
      <div>
        <div className="flex-gap mb-10">
          <p className="md">Recipient Address</p>
          <p
            className="sm"
            style={{ textDecoration: "underline", cursor: "pointer" }}
            onClick={() =>
              setRecipient("0x8A153e0ab347A70F28A911CA5a89f2338a831F5a")
            }
          >
            Donate
          </p>
        </div>
        <div className="input_container">
          <input
            type="text"
            value={recipient}
            onChange={({ target }) => setRecipient(target.value)}
          />
        </div>
        {isValid && (
          <div className="flex_between">
            <p>Tokens to receive</p>
            <b>{amount}</b>
          </div>
        )}
      </div>
      <div>
        {account ? (
          <button
            className="btn btn-primary full-width"
            disabled={!isValid}
            onClick={() => handleWithdraw()}
          >
            Withdraw
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

export default Withdraw;
