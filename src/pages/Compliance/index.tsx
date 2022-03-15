import React from "react";

const Compliance: React.FC = () => {
  return (
    <div className="mb-50" style={{ textAlign: "center" }}>
      <h1 className="mb-30">
        Hodl4Gold <span className="text-primary">compliance tool</span>
      </h1>
      <p>Maintaining financial privacy is essential to preserving our freedoms.</p>
      <p>
        However, it should not come at the cost of non-compliance. With Tornado.cash, you can always
        provide cryptographically verified proof of transactional history using the Ethereum address
        you used to deposit or withdraw funds. This might be necessary to show the origin of assets
        held in your withdrawal address. To generate a compliance report, please enter your
        Tornado.сash Note below.
      </p>
    </div>
  );
};

export default Compliance;
