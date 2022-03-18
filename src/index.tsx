import React from "react";
import ReactDOM from "react-dom";
import { Web3ReactProvider } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { BrowserRouter } from "react-router-dom";
import { createClient, Provider as GraphProvider } from "urql";

import "./index.scss";
import App from "./App";
import Provider from "./store";

function getLibrary(provider) {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

const API_URL =
  "https://api.thegraph.com/subgraphs/name/braj1410/anonwalletrinkeby";

const client = createClient({
  url: API_URL,
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider>
          <GraphProvider value={client}>
            <App />
          </GraphProvider>
        </Provider>
      </Web3ReactProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
