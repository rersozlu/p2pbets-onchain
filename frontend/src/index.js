import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Web3ContextProvider } from "./contexts/Web3Context";
import { BetsContextProvider } from "./contexts/BetsContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Web3ContextProvider>
      <BetsContextProvider>
        <App />
      </BetsContextProvider>
    </Web3ContextProvider>
  </React.StrictMode>
);
