import { useState, createContext } from "react";

export const Web3Context = createContext();

export function Web3ContextProvider(props) {
  const [web3Data, setWeb3Data] = useState({});
  return (
    <Web3Context.Provider value={[web3Data, setWeb3Data]}>
      {props.children}
    </Web3Context.Provider>
  );
}