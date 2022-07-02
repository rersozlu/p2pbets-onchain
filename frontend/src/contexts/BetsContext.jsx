import { useState, createContext, useEffect } from "react";
import data from "../data.json";
import betAbi from "../contracts/BetPool.json";
export const BetsContext = createContext();

export function BetsContextProvider(props) {
  const [betsData, setBetsData] = useState([]);
  useEffect(() => {
    setBetsData(
      data.map((item) => ({
        id: item.id,
        contractAddress: item.contractAddress,
        teamA: item.teamA,
        teamB: item.teamB,
        teamALogo: item.teamALogo,
        teamBLogo: item.teamBLogo,
        date: item.date,
        category: item.category,
        abi: betAbi.abi,
      }))
    );
  }, []);
  return (
    <BetsContext.Provider value={[betsData, setBetsData]}>
      {props.children}
    </BetsContext.Provider>
  );
}
