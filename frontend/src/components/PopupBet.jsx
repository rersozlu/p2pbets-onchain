import styles from "./PopupBet.module.css";
import { useContext } from "react";
import { BetsContext } from "../contexts/BetsContext";
import { Web3Context } from "../contexts/Web3Context";
import { ethers } from "ethers";
function PopupBet(props) {
  const [web3Data, setWeb3Data] = useContext(Web3Context);
  const [betsData, setBetsData] = useContext(BetsContext);
  return (
    <div className={styles.Popup}>
      {betsData.length !== 0 && (
        <>
          <p className={styles.date}>{betsData[0].date}</p>
          <div className={styles.info}>
            <div className={styles.teamA}>
              <img src={betsData[0].teamALogo} alt="teamALogo" />
              <p>{betsData[0].teamA}</p>
            </div>
            <div className={styles.teamB}>
              <img src={betsData[0].teamBLogo} alt="teamBLogo" />
              <p>{betsData[0].teamB}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PopupBet;
