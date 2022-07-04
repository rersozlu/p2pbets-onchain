import { useState, createContext, useEffect } from "react";
import betAbi from "../contracts/BetPool.json";
export const BetsContext = createContext();

export function BetsContextProvider(props) {
  const [betsData, setBetsData] = useState([]);
  async function getData() {
    const data = await fetch("http://localhost:5000/bets");
    const response = await data.json();
    console.log(response);
    setBetsData(
      response.map((item) => ({
        id: item.id,
        contractAddress: item.contractAddress,
        teamA: item.teamA,
        teamB: item.teamB,
        teamALogo: item.teamALogo,
        teamBLogo: item.teamBLogo,
        date: item.date,
        category: item.category,
        abi: betAbi.abi,
        status: item.status,
        winner: item.winner,
      }))
    );
  }
  useEffect(() => {
    getData();
  }, []);
  return (
    <BetsContext.Provider value={[betsData, setBetsData]}>
      {props.children}
    </BetsContext.Provider>
  );
}
