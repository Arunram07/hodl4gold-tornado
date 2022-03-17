import { useWeb3React } from "@web3-react/core";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Withdraw: React.FC = () => {
  const navigate = useNavigate();
  const { account } = useWeb3React();
  const [note, setNote] = useState("");
  const [recipient, setRecipient] = useState("");

  const handleWithdraw = async () => {};

  return (
    <div className="withdraw">
      <div>
        <p className="md mb-10">Note</p>
        <div className="input_container">
          <input type="text" value={note} onChange={({ target }) => setNote(target.value)} />
        </div>
      </div>
      <div>
        <div className="flex-gap mb-10">
          <p className="md">Recipient Address</p>
          <p className="sm" style={{ textDecoration: "underline", cursor: "pointer" }}>
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
      </div>
      <div>
        {account ? (
          <button className="btn btn-primary full-width" onClick={() => handleWithdraw()}>
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
