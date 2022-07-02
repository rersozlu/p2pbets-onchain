import { useEffect, useState, createContext } from "react";
import { config } from "../config";

export const Web3Context = createContext();

export function Web3ContextProvider(props) {
  async function chainChangeHandler() {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: config.chainId }],
    });
  }

  const [web3Data, setWeb3Data] = useState({});
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", chainChangeHandler);
      console.log("mounted");
    }

    return () => {
      if (window.ethereum) {
        window.removeEventListener("chainChanged", chainChangeHandler);
      }
    };
  }, []);
  return (
    <Web3Context.Provider value={[web3Data, setWeb3Data]}>
      {props.children}
    </Web3Context.Provider>
  );
}
