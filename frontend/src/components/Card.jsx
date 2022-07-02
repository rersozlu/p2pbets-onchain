import { BetsContext } from "../contexts/BetsContext";
import { useContext } from "react";
import styles from "./Card.module.css";
function Card(props) {
  const [betsData, setBetData] = useContext(BetsContext);

  return (
    <div>
      {betsData.length !== 0 && (
        <div className={styles.card} onClick={props.toggleFunction}>
          <div className={styles.teamA}>
            <img src={props.cardData.teamALogo} alt="teamALogo" />
            <p>{props.cardData.teamA}</p>
          </div>
          <div className={styles.date}>
            <p>{props.cardData.date.split(",")[0]}</p>
            <p>{props.cardData.date.split(",")[1]}</p>
          </div>
          <div className={styles.teamB}>
            <img src={props.cardData.teamBLogo} alt="teamBLogo" />
            <p>{props.cardData.teamB}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;