import Card from "./Card";
import { BetsContext } from "../contexts/BetsContext";
import { useContext } from "react";
import styles from "./AllCards.module.css";

function AllCards(props) {
  const [betsData, setBetData] = useContext(BetsContext);
  return (
    <div className={props.isPopup ? styles.AllCardsPopUp : styles.allCards}>
      {betsData.length > 0 &&
        betsData.map((item) => (
          <Card
            key={item.id}
            cardData={item}
            toggleFunction={() => props.toggleFunction(item.id)}
          />
        ))}
    </div>
  );
}

export default AllCards;
