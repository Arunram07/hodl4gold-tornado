import React from "react";

import "./layout.scss";
import { ReactComponent as Twitter } from "../../assets/icons/twitter.svg";
import { ReactComponent as Discord } from "../../assets/icons/discord.svg";
import { ReactComponent as Telegram } from "../../assets/icons/telegram.svg";

const Footer: React.FC = () => {
  return (
    <div className="footer">
      <div className="footer-block_left">
        <p className="md">
          Donation address:{" "}
          <span className="text-primary" style={{ wordBreak: "break-word" }}>
            0xDD4c48C0B24039969fC16D1cdF626eaB821d3384
          </span>
        </p>
      </div>
      <div className="footer-block_right">
        <div>
          <Twitter />
        </div>
        <div>
          <Discord />
        </div>
        <div>
          <Telegram />
        </div>
      </div>
    </div>
  );
};

export default Footer;
