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
            <p>{props.cardData.date}</p>
            <p
              className={props.cardData.status ? styles.closed : styles.opened}
            >
              {props.cardData.status ? "Closed" : "Open"}
            </p>
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
